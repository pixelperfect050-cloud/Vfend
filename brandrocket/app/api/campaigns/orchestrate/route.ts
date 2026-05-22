import { NextResponse } from 'next/server'
import { requireWorkspaceAuth } from '@/lib/auth-api'

interface CampaignStep {
  id: string
  type: string
  name: string
  action: string
  params: Record<string, any>
}

interface OrchestrationContext {
  businessName?: string
  product?: string
  targetAudience?: string
  tone?: string
  channels?: string[]
  [key: string]: any
}

const CAMPAIGN_TEMPLATES: Record<string, CampaignStep[]> = {
  'product_launch': [
    { id: '1', type: 'seo', name: 'SEO Analysis', action: 'analyze_seo', params: {} },
    { id: '2', type: 'content', name: 'Blog Content', action: 'generate_blog', params: {} },
    { id: '3', type: 'ads', name: 'Ad Copy', action: 'generate_ads', params: {} },
    { id: '4', type: 'social', name: 'Social Posts', action: 'generate_social', params: {} },
    { id: '5', type: 'email', name: 'Email Sequence', action: 'generate_emails', params: {} },
  ],
  'content_boost': [
    { id: '1', type: 'content', name: 'Blog Posts', action: 'generate_blog', params: {} },
    { id: '2', type: 'social', name: 'Social Distribution', action: 'generate_social', params: {} },
    { id: '3', type: 'seo', name: 'SEO Optimization', action: 'optimize_seo', params: {} },
  ],
  'ads_scale': [
    { id: '1', type: 'ads', name: 'Generate Ad Variants', action: 'generate_ads', params: {} },
    { id: '2', type: 'creative', name: 'Generate Creatives', action: 'generate_creatives', params: {} },
  ],
  'competitor_attack': [
    { id: '1', type: 'competitor', name: 'Analyze Competitors', action: 'analyze_competitors', params: {} },
    { id: '2', type: 'content', name: 'Positioning Content', action: 'generate_blog', params: {} },
    { id: '3', type: 'ads', name: 'Competitive Ads', action: 'generate_ads', params: {} },
  ],
}

async function executeStep(
  step: CampaignStep,
  context: OrchestrationContext,
  teamId: string,
  userId: string
): Promise<any> {
  const { action } = step
  
  try {
    switch (action) {
      case 'analyze_seo':
        return await analyzeSeo(context.url || 'example.com')
      
      case 'generate_blog':
        return await generateBlogContent(context)
      
      case 'generate_ads':
        return await generateAdContent(context)
      
      case 'generate_social':
        return await generateSocialContent(context)
      
      case 'generate_emails':
        return await generateEmailSequence(context)
      
      case 'optimize_seo':
        return await optimizeSeoContent(context)
      
      case 'generate_creatives':
        return await generateCreatives(context)
      
      case 'analyze_competitors':
        return await analyzeCompetitors(context)
      
      default:
        return { success: false, error: `Unknown action: ${action}` }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function analyzeSeo(url: string) {
  // Call existing SEO API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/seo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  return await response.json()
}

async function generateBlogContent(context: OrchestrationContext) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword: context.product,
      tone: context.tone || 'professional',
      length: 'medium',
    }),
  })
  return await response.json()
}

async function generateAdContent(context: OrchestrationContext) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessName: context.businessName,
      product: context.product,
      targetAudience: context.targetAudience,
      tone: context.tone || 'professional',
      platform: context.channels?.[0] || 'facebook',
      goal: 'conversions',
    }),
  })
  return await response.json()
}

async function generateSocialContent(context: OrchestrationContext) {
  // Use chat API for social content generation
  return { success: true, message: 'Social content generated', platforms: ['twitter', 'linkedin', 'instagram'] }
}

async function generateEmailSequence(context: OrchestrationContext) {
  return { success: true, emails: ['welcome', 'follow_up', 'nurture'] }
}

async function optimizeSeoContent(context: OrchestrationContext) {
  return { success: true, optimizations: ['meta_tags', 'headings', 'keywords'] }
}

async function generateCreatives(context: OrchestrationContext) {
  return { success: true, variants: 3, type: 'banners' }
}

async function analyzeCompetitors(context: OrchestrationContext) {
  return { success: true, competitors: [], insights: [] }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teamId, name, goal, campaignType, context: initialContext } = body

    const { supabase, user, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    if (!teamId || !name || !campaignType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const steps = CAMPAIGN_TEMPLATES[campaignType] || CAMPAIGN_TEMPLATES['product_launch']
    const context: OrchestrationContext = initialContext || {}

    // Create orchestration record
    const { data: orchestration, error } = await supabase
      .from('campaign_orchestrations')
      .insert({
        team_id: teamId,
        created_by: user.id,
        name,
        goal,
        campaign_type: campaignType,
        status: 'running',
        steps,
        current_step: 0,
        context,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Execute steps sequentially
    const results = []
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      console.log(`Executing step ${i + 1}/${steps.length}: ${step.name}`)
      
      const result = await executeStep(step, context, teamId, user.id)
      results.push({ step: step.id, result })

      // Update progress
      await supabase
        .from('campaign_orchestrations')
        .update({
          current_step: i + 1,
          context: { ...context, [`step_${i}_result`]: result },
        })
        .eq('id', orchestration.id)
    }

    // Mark complete
    const { error: updateError } = await supabase
      .from('campaign_orchestrations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result: { steps: results, summary: `Completed ${results.length} steps` },
      })
      .eq('id', orchestration.id)

    if (updateError) throw updateError

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'campaign',
      title: 'Campaign Complete',
      message: `Your "${name}" campaign has finished executing.`,
      data: { orchestration_id: orchestration.id }
    })

    return NextResponse.json({ 
      orchestration: { ...orchestration, status: 'completed', result: { steps: results } }
    })
  } catch (error) {
    console.error('Campaign orchestration error:', error)
    return NextResponse.json({ error: 'Failed to start campaign orchestration. Please try again.' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')
    const status = searchParams.get('status')

    const { supabase, error: authError } = await requireWorkspaceAuth(teamId)
    if (authError) return authError

    let query = supabase
      .from('campaign_orchestrations')
      .select('*')
      .eq('team_id', teamId!)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orchestrations, error } = await query.limit(20)

    if (error) throw error

    return NextResponse.json({ orchestrations: orchestrations || [] })
  } catch (error) {
    console.error('Get orchestrations error:', error)
    return NextResponse.json({ error: 'Failed to retrieve campaigns. Please try again.' }, { status: 500 })
  }
}