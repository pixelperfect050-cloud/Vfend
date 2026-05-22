import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle Vercel and proxy domains properly
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isHttps = process.env.NODE_ENV === 'production'
  const redirectOrigin = forwardedHost 
    ? `${isHttps ? 'https' : 'http'}://${forwardedHost}`
    : origin

  if (code) {
    const supabase = await createClient()
    
    // We just need to exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Check profile status
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', session.user.id)
        .single()

      if (!profile || !profile.onboarding_completed) {
        return NextResponse.redirect(`${redirectOrigin}/onboarding`)
      }

      return NextResponse.redirect(`${redirectOrigin}${next}`)
    } else if (error) {
      console.error('Supabase exchange error:', error)
      return NextResponse.redirect(`${redirectOrigin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${redirectOrigin}/login?error=No_code_provided_in_callback`)
}
