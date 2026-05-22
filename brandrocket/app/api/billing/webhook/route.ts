import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder')
)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface StripeEvent {
  type: string
  data: {
    object: any
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const customerId = subscription.customer
  const priceId = subscription.items.data[0]?.price.id
  const status = subscription.status
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  // Find user by stripe customer id
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .limit(1)

  // For now, store in subscriptions table with user lookup
  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_id', customerId)
    .limit(1)

  // Determine plan
  const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'Pro' :
               priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID ? 'Enterprise' : 'Starter'

  // Store subscription
  await supabaseAdmin.from('subscriptions').upsert({
    stripe_id: customerId,
    plan,
    status,
    current_period_end: currentPeriodEnd.toISOString(),
  }, { onConflict: 'stripe_id' })

  // Create notification
  if (existingSub?.[0]?.user_id) {
    await supabaseAdmin.rpc('create_notification', {
      p_user_id: existingSub[0].user_id,
      p_type: 'subscription',
      p_title: 'Subscription Activated',
      p_message: `Your ${plan} subscription is now active!`,
      p_data: { subscription_id: subscription.id }
    })
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer
  const status = subscription.status
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  await supabaseAdmin.from('subscriptions').update({
    status,
    current_period_end: currentPeriodEnd.toISOString(),
  }).eq('stripe_id', customerId)
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer

  await supabaseAdmin.from('subscriptions').update({
    status: 'canceled',
  }).eq('stripe_id', customerId)
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer
  
  // Create notification for successful payment
  await supabaseAdmin.from('notifications').insert({
    user_id: (await supabaseAdmin.from('subscriptions').select('user_id').eq('stripe_id', customerId).limit(1)).data?.[0]?.user_id || '00000000-0000-0000-0000-000000000000',
    type: 'payment',
    title: 'Payment Successful',
    message: `Your payment of $${invoice.amount_paid / 100} was successful.`,
    data: { invoice_id: invoice.id }
  })
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: StripeEvent

  try {
    event = getStripe().webhooks.constructEvent(body, signature, endpointSecret) as StripeEvent
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Store the event
  const stripeId = event.data.object?.id || `evt_${Date.now()}`
  await supabaseAdmin.from('stripe_events').insert({
    stripe_id: stripeId,
    type: event.type,
    data: event.data.object,
    processed: false,
  })

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark as processed
    await supabaseAdmin.from('stripe_events')
      .update({ processed: true })
      .eq('stripe_id', stripeId)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error handling webhook:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}