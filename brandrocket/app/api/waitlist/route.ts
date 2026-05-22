import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { inngest } from '@/lib/inngest/client'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co')
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

export async function POST(req: Request) {
  try {
    // Basic memory rate limiting (per instance)
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimitMap = (global as any).rateLimitMap || new Map()
    if (!(global as any).rateLimitMap) (global as any).rateLimitMap = rateLimitMap

    const userHistory = rateLimitMap.get(ip) || []
    const recentRequests = userHistory.filter((time: number) => now - time < 60000) // 1 minute window

    if (recentRequests.length >= 5) { // Max 5 requests per minute
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    recentRequests.push(now)
    rateLimitMap.set(ip, recentRequests)

    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert into Supabase (fast — immediate response)
    const { error: dbError } = await supabase
      .from('waitlists')
      .insert([{ email, status: 'pending' }])

    if (dbError && dbError.code !== '23505') {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
    }

    // Get position (count of records before this one)
    const { count } = await supabase
      .from('waitlists')
      .select('*', { count: 'exact', head: true })

    const position = (count || 0) + 1248 // Base + real count for social proof

    // Fire Inngest event for durable email delivery (if new signup)
    if (!dbError) {
      await inngest.send({
        name: 'waitlist/signup',
        data: { email },
      })
    }

    return NextResponse.json({ success: true, position })
  } catch (error) {
    console.error('Waitlist API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
