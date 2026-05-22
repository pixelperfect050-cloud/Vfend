import { NextResponse } from 'next/server'
import { requireAuth, requireWorkspaceAuth } from '@/lib/auth-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')

    const { supabase, error } = await requireWorkspaceAuth(teamId)
    if (error) return error

    const { data: workflows, error: queryError } = await supabase
      .from('ai_workflows')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })

    if (queryError) throw queryError

    return NextResponse.json({ workflows: workflows || [] })
  } catch (error) {
    console.error('Get workflows error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teamId, name, description, triggerConfig, actions } = body

    const { supabase, user, error } = await requireWorkspaceAuth(teamId)
    if (error) return error

    if (!name || !triggerConfig || !actions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: workflow, error: insertError } = await supabase
      .from('ai_workflows')
      .insert({
        team_id: teamId,
        created_by: user.id,
        name,
        description,
        trigger_config: triggerConfig,
        actions,
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Create workflow error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { workflowId, ...updates } = body

    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
    }

    const { supabase, error: authError } = await requireAuth()
    if (authError) return authError

    const { data: workflow, error } = await supabase
      .from('ai_workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workflowId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Update workflow error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workflowId = searchParams.get('id')

    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
    }

    const { supabase, error: authError } = await requireAuth()
    if (authError) return authError

    const { error } = await supabase
      .from('ai_workflows')
      .delete()
      .eq('id', workflowId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete workflow error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}