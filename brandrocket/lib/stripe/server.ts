import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not defined')
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return stripeInstance
}

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    credits: 100,
    priceId: null,
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 500,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    credits: -1, // unlimited
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
}

export type PlanType = 'starter' | 'pro' | 'enterprise'

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return getStripe().subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return getStripe().subscriptions.cancel(subscriptionId)
}

export async function createCustomer(email: string, name?: string) {
  return getStripe().customers.create({
    email,
    name,
  })
}

export async function getOrCreateCustomer(email: string, name?: string) {
  const existing = await getStripe().customers.list({
    email,
    limit: 1,
  })

  if (existing.data.length > 0) {
    return existing.data[0]
  }

  return createCustomer(email, name)
}