import { NextResponse } from 'next/server'
import { requireAuth, requireWorkspaceAuth } from '@/lib/auth-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    const provider = searchParams.get('provider')

    const { supabase, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    let query = supabase
      .from('integrations')
      .select('*')
      .eq('team_id', teamId!)

    if (provider) {
      query = query.eq('provider', provider)
    }

    const { data: integrations, error } = await query

    if (error) throw error

    return NextResponse.json({ integrations: integrations || [] })
  } catch (error) {
    console.error('Get integrations error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teamId, provider, accessToken, refreshToken, accountId, accountName } = body

    const { supabase, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    if (!provider || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In production, validate token with provider first
    const { data: integration, error } = await supabase
      .from('integrations')
      .upsert({
        team_id: teamId,
        provider,
        access_token: accessToken,
        refresh_token: refreshToken,
        account_id: accountId,
        account_name: accountName,
        is_active: true,
        token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }, { onConflict: 'team_id,provider' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Create integration error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { integrationId, isActive, settings } = body

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 })
    }

    const { supabase, error: authError } = await requireAuth()
    if (authError) return authError

    const updates: any = { updated_at: new Date().toISOString() }
    if (typeof isActive === 'boolean') updates.is_active = isActive
    if (settings) updates.settings = settings

    const { data: integration, error } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', integrationId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Update integration error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const integrationId = searchParams.get('id')

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 })
    }

    const { supabase, error: authError } = await requireAuth()
    if (authError) return authError

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', integrationId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete integration error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}