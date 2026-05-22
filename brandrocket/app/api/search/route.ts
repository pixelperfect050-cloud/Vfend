import { NextResponse } from 'next/server'
import { requireWorkspaceAuth } from '@/lib/auth-api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const teamId = searchParams.get('team_id')
    const limit = parseInt(searchParams.get('limit') || '20')

    const { supabase, error } = await requireWorkspaceAuth(teamId)
    if (error) return error

    if (!query || !teamId) {
      return NextResponse.json({ error: 'Query and team_id required' }, { status: 400 })
    }

    // Search across multiple tables using full-text search
    const results: any[] = []

    // Search campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name, type, status, created_at')
      .eq('team_id', teamId)
      .ilike('name', `%${query}%`)
      .limit(limit)
    
    if (campaigns?.length) {
      results.push(...campaigns.map(c => ({ ...c, itemType: 'campaign' })))
    }

    // Search blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title, status, created_at')
      .eq('team_id', teamId)
      .ilike('title', `%${query}%`)
      .limit(limit)
    
    if (blogs?.length) {
      results.push(...blogs.map(b => ({ ...b, itemType: 'blog' })))
    }

    // Search templates
    const { data: templates } = await supabase
      .from('templates')
      .select('id, title, category, created_at')
      .eq('team_id', teamId)
      .ilike('title', `%${query}%`)
      .limit(limit)
    
    if (templates?.length) {
      results.push(...templates.map(t => ({ ...t, itemType: 'template' })))
    }

    // Search scheduled posts
    const { data: posts } = await supabase
      .from('scheduled_posts')
      .select('id, platform, content, status, scheduled_for')
      .eq('team_id', teamId)
      .ilike('content', `%${query}%`)
      .limit(limit)
    
    if (posts?.length) {
      results.push(...posts.map(p => ({ ...p, itemType: 'scheduled_post' })))
    }

    // Sort by created_at
    results.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )

    return NextResponse.json({ results: results.slice(0, limit) })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    )
  }
}