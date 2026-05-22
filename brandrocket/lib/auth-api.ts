import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return { supabase, user, error: null }
}

export async function requireWorkspaceAuth(teamId: string | null | undefined) {
  const { supabase, user, error } = await requireAuth()
  if (error) return { supabase, user, error }

  if (!teamId) {
    return { supabase, user, error: NextResponse.json({ error: 'Team ID required' }, { status: 400 }) }
  }

  // Check if user has access to this workspace using RLS
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', teamId)
    .single()

  if (!workspace) {
    return { supabase, user, error: NextResponse.json({ error: 'Forbidden workspace access' }, { status: 403 }) }
  }

  return { supabase, user, error: null }
}
