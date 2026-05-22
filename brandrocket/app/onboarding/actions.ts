'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function completeOnboarding(isDemo: boolean, destination: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Create a workspace
  const { data: workspace } = await supabase
    .from('workspaces')
    .insert({
      name: 'My Workspace',
      owner_id: user.id,
      plan: 'free',
    })
    .select()
    .single()

  if (workspace) {
    await supabase
      .from('profiles')
      .update({ 
        onboarding_completed: true,
        workspace_id: workspace.id
      })
      .eq('user_id', user.id)
  } else {
    // Fallback if workspace creation fails for some reason
    await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('user_id', user.id)
  }

  if (isDemo) {
    const cookieStore = await cookies()
    cookieStore.set('demo_session', 'true', { path: '/' })
  } else {
    const cookieStore = await cookies()
    cookieStore.delete('demo_session')
  }

  redirect(destination)
}
