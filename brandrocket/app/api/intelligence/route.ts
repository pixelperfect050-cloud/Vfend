import { NextResponse } from 'next/server'
import { requireWorkspaceAuth } from '@/lib/auth-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    const type = searchParams.get('type')

    const { supabase, error } = await requireWorkspaceAuth(teamId)
    if (error) return error

    // Get scores
    let scoresQuery = supabase
      .from('growth_scores')
      .select('*')
      .eq('team_id', teamId!)
      .order('overall_score', { ascending: false })
      .limit(10)

    const { data: scores } = await scoresQuery

    // Get recommendations
    let recQuery = supabase
      .from('ai_recommendations')
      .select('*')
      .eq('team_id', teamId!)
      .eq('dismissed', false)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)

    if (type === 'recommendations') {
      const { data: recommendations } = await recQuery
      return NextResponse.json({ recommendations })
    }

    // Get opportunities
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('*')
      .eq('team_id', teamId!)
      .eq('status', 'identified')
      .order('impact_score', { ascending: false })
      .limit(10)

    // Get activity timeline
    const { data: activity } = await supabase
      .from('activity_timeline')
      .select('*')
      .eq('team_id', teamId!)
      .order('created_at', { ascending: false })
      .limit(30)

    return NextResponse.json({
      scores: scores || [],
      opportunities: opportunities || [],
      activity: activity || [],
    })
  } catch (error) {
    console.error('Get intelligence error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, teamId, data } = body

    const { supabase, user, error } = await requireWorkspaceAuth(teamId)
    if (error) return error

    switch (action) {
      case 'log_activity':
        await supabase.from('activity_timeline').insert({
          team_id: teamId,
          user_id: user.id,
          actor_type: data.actorType,
          actor_name: data.actorName,
          action_type: data.actionType,
          entity_type: data.entityType,
          entity_id: data.entityId,
          description: data.description,
          metadata: data.metadata || {},
        })
        break

      case 'dismiss_recommendation':
        await supabase
          .from('ai_recommendations')
          .update({ dismissed: true })
          .eq('id', data.recommendationId)
        break

      case 'create_recommendation':
        await supabase.from('ai_recommendations').insert({
          team_id: teamId,
          type: data.type,
          priority: data.priority,
          title: data.title,
          description: data.description,
          context: data.context || {},
          action_url: data.actionUrl,
        })
        break

      case 'calculate_score':
        await supabase.rpc('calculate_growth_score', {
          p_team_id: teamId,
          p_entity_type: data.entityType,
          p_entity_id: data.entityId,
        })
        break

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Intelligence action error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}