import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { requireWorkspaceAuth } from '@/lib/auth-api'

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder')
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')

    const { error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    // Fetch workspace to get owner
    const { data: workspace } = await supabaseAdmin
      .from('workspaces')
      .select('owner_id')
      .eq('id', teamId)
      .single()

    // Fetch members from profiles
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('workspace_id', teamId)

    if (error) throw error

    // Fetch emails from auth.users (requires admin)
    // For large userbases, you would not list all users, but rather just those in the workspace.
    // However, since we can't do a direct join easily with the REST API across schemas,
    // we'll get the users we need by their IDs.
    const userIds = profiles.map(p => p.user_id || p.id)
    if (workspace && workspace.owner_id && !userIds.includes(workspace.owner_id)) {
      userIds.push(workspace.owner_id)
    }

    const members = []
    
    // Add owner if they don't have workspace_id set directly on their profile yet
    if (workspace) {
      const { data: ownerProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', workspace.owner_id)
        .single()
        
      if (ownerProfile && !profiles.find(p => (p.user_id || p.id) === workspace.owner_id)) {
        profiles.push(ownerProfile)
      }
    }

    // We'll iterate and get user info. 
    for (const profile of profiles) {
      const id = profile.user_id || profile.id
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(id)
      
      members.push({
        id: profile.id,
        name: profile.full_name || profile.display_name || 'Unknown User',
        email: userData?.user?.email || 'No email',
        role: workspace?.owner_id === id ? 'Owner' : 'Member',
        initial: (profile.full_name || profile.display_name || 'U').charAt(0).toUpperCase()
      })
    }

    // Sort so Owner is first
    members.sort((a, b) => a.role === 'Owner' ? -1 : b.role === 'Owner' ? 1 : 0)

    return NextResponse.json({ members })
  } catch (error: any) {
    console.error('Team GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')

    const { error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // In a real SaaS, we would send an invite using:
    // await supabaseAdmin.auth.admin.inviteUserByEmail(email)
    // And then add them to a pending_invites table or set their workspace_id upon joining.
    // For this prototype conversion, we will just simulate a successful invite.

    return NextResponse.json({ success: true, message: `Invite sent to ${email}` })
  } catch (error: any) {
    console.error('Team POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
