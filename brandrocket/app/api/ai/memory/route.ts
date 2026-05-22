import { NextResponse } from 'next/server'
import { requireAuth, requireWorkspaceAuth } from '@/lib/auth-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    const types = searchParams.get('types')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '10')

    const { supabase, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    let query = supabase
      .from('ai_memory')
      .select('*')
      .eq('team_id', teamId!)
      .order('importance', { ascending: false })
      .limit(limit)

    if (types.length > 0) {
      query = query.in('memory_type', types)
    }

    const { data: memories, error } = await query

    if (error) throw error

    return NextResponse.json({ memories: memories || [] })
  } catch (error) {
    console.error('Get memories error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teamId, memoryType, key, value, importance, ttlDays } = body

    const { supabase, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    if (!memoryType || !key || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use the stored function
    const { data, error } = await supabase.rpc('store_ai_memory', {
      p_team_id: teamId,
      p_memory_type: memoryType,
      p_key: key,
      p_value: value,
      p_importance: importance || 0.5,
      p_ttl_days: ttlDays || 30,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Store memory error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const memoryId = searchParams.get('id')

    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID required' }, { status: 400 })
    }

    const { supabase, error: authError } = await requireAuth()
    if (authError) return authError

    const { error } = await supabase
      .from('ai_memory')
      .delete()
      .eq('id', memoryId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete memory error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}