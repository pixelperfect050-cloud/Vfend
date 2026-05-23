import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Clear Supabase session
    await supabase.auth.signOut()

    // Explicitly clear demo session if present
    const cookieStore = await cookies()
    cookieStore.delete('demo_session')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
  }
}
