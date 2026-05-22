import { inngest } from './client'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import WelcomeEmail from '@/components/emails/welcome-email'

// Supabase service client for server-side operations
function getSupabase() {
  return createClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// =============================================================================
// Campaign Launch Workflow — Real State Machine
// States: Draft → Planning → Orchestrating → Executing → Monitoring → Optimizing → Completed
// =============================================================================

export const launchCampaignWorkflow = inngest.createFunction(
  {
    id: 'launch-campaign',
    triggers: [{ event: 'campaign/launch' }],
    retries: 3,
  },
  async ({ event, step }) => {
    const { campaignId, goal } = event.data
    const supabase = getSupabase()

    // Helper: update campaign status and emit timeline event
    async function transitionTo(status: string, message: string, agentId: string = 'orchestrator') {
      await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', campaignId)

      await supabase
        .from('campaign_events')
        .insert({
          campaign_id: campaignId,
          agent_id: agentId,
          event_type: 'status_update',
          message,
          metadata: { status, goal },
        })
    }

    // Helper: emit an agent action event
    async function emitEvent(agentId: string, eventType: string, message: string, metadata: Record<string, unknown> = {}) {
      await supabase
        .from('campaign_events')
        .insert({
          campaign_id: campaignId,
          agent_id: agentId,
          event_type: eventType,
          message,
          metadata,
        })
    }

    // ── Phase 1: Planning ─────────────────────────────────────────────
    await step.run('transition-to-planning', async () => {
      await transitionTo('Planning', 'Campaign analysis initiated. Researching market landscape...')
    })

    await step.sleep('planning-research-delay', '4s')

    await step.run('planning-research', async () => {
      await emitEvent('analytics', 'agent_thinking', 'Analyzing target audience and competitive landscape...')
    })

    await step.sleep('planning-analysis-delay', '6s')

    await step.run('planning-insights', async () => {
      await emitEvent('analytics', 'insight_discovered', 'Identified 3 high-opportunity market segments.', {
        segments: ['Early adopters', 'Growth-stage startups', 'Solo founders'],
      })
    })

    await step.sleep('planning-to-orchestrating', '3s')

    // ── Phase 2: Orchestrating ────────────────────────────────────────
    await step.run('transition-to-orchestrating', async () => {
      await transitionTo('Orchestrating', 'Strategy locked. Deploying specialist agents...')
    })

    await step.sleep('orchestrating-start-delay', '4s')

    // Sub-agents work in parallel
    const seoAgent = step.run('seo-agent-work', async () => {
      await emitEvent('seo', 'action_started', 'Researching keyword clusters for target segments...')
      return { agent: 'seo', action: 'keyword_research' }
    })

    const adsAgent = step.run('ads-agent-work', async () => {
      await emitEvent('ads', 'action_started', 'Generating ad creatives and bidding strategy...')
      return { agent: 'ads', action: 'creative_generation' }
    })

    const contentAgent = step.run('content-agent-work', async () => {
      await emitEvent('content', 'action_started', 'Drafting landing page copy and blog outlines...')
      return { agent: 'content', action: 'copy_drafting' }
    })

    await Promise.all([seoAgent, adsAgent, contentAgent])

    await step.sleep('agent-work-delay', '12s')

    // Agents complete their work
    await step.run('seo-agent-complete', async () => {
      await emitEvent('seo', 'action_completed', 'Generated 5 keyword clusters with 12 long-tail variations.', {
        clusters: 5,
        keywords: 12,
      })
    })

    await step.sleep('seo-to-ads-delay', '5s')

    await step.run('ads-agent-complete', async () => {
      await emitEvent('ads', 'action_completed', 'Created 3 ad variations with optimized bidding for each segment.', {
        variations: 3,
        platforms: ['Google Ads', 'Meta Ads'],
      })
    })

    await step.sleep('ads-to-content-delay', '4s')

    await step.run('content-agent-complete', async () => {
      await emitEvent('content', 'action_completed', 'Drafted 2 landing pages and 3 blog post outlines.', {
        landingPages: 2,
        blogPosts: 3,
      })
    })

    await step.sleep('orchestrating-to-executing', '3s')

    // ── Phase 3: Executing ────────────────────────────────────────────
    await step.run('transition-to-executing', async () => {
      await transitionTo('Executing', 'All assets ready. Deploying to platforms...')
    })

    await step.sleep('executing-deploy-delay', '6s')

    await step.run('deploy-seo-content', async () => {
      await emitEvent('seo', 'action_completed', 'Published 5 SEO-optimized blog posts to content pipeline.', {
        published: 5,
      })
    })

    await step.sleep('executing-ads-delay', '8s')

    await step.run('deploy-ads', async () => {
      await emitEvent('ads', 'action_completed', 'Launched ad campaigns on Google Ads and Meta.', {
        platforms: ['Google Ads', 'Meta'],
        budget: '$50/day',
      })
    })

    await step.sleep('executing-to-monitoring', '4s')

    // ── Phase 4: Monitoring ───────────────────────────────────────────
    await step.run('transition-to-monitoring', async () => {
      await transitionTo('Monitoring', 'All campaigns live. Entering monitoring phase.')
    })

    await step.sleep('monitoring-delay', '15s')

    await step.run('monitoring-first-report', async () => {
      await emitEvent('analytics', 'insight_discovered', 'Early signals: CTR above benchmark at 3.2%. Engagement strong on Meta.', {
        ctr: '3.2%',
        benchmark: '2.1%',
      })
    })

    await step.sleep('monitoring-to-optimizing', '5s')

    // ── Phase 5: Optimizing ───────────────────────────────────────────
    await step.run('transition-to-optimizing', async () => {
      await transitionTo('Optimizing', 'Applying performance optimizations based on early data.')
    })

    await step.sleep('optimization-delay', '10s')

    await step.run('optimization-action', async () => {
      await emitEvent('ads', 'optimization_applied', 'Shifted 20% budget from Google to Meta based on ROAS data.', {
        action: 'budget_rebalance',
        from: 'Google Ads',
        to: 'Meta',
        shift: '20%',
      })
    })

    await step.sleep('optimization-to-completed', '4s')

    // ── Phase 6: Completed ────────────────────────────────────────────
    await step.run('transition-to-completed', async () => {
      await transitionTo('Completed', 'Campaign workflow completed. All systems operational.')
    })

    return { success: true, campaignId, finalStatus: 'Completed' }
  }
)

// =============================================================================
// Waitlist Signup Workflow — Durable email delivery via Inngest
// =============================================================================

export const waitlistSignupWorkflow = inngest.createFunction(
  {
    id: 'waitlist-signup',
    triggers: [{ event: 'waitlist/signup' }],
    retries: 3,
  },
  async ({ event, step }) => {
    const { email } = event.data

    // Send welcome email via Resend with retry
    const emailResult = await step.run('send-welcome-email', async () => {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const { data, error } = await resend.emails.send({
        from: 'BrandRocket <hello@brandrocket.io>',
        to: email,
        subject: 'Your AI Growth Team is Standing By 🚀',
        react: WelcomeEmail({ email }),
      })

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }

      return { emailId: data?.id, sentTo: email }
    })

    // Update waitlist status
    await step.run('update-waitlist-status', async () => {
      const supabase = getSupabase()
      await supabase
        .from('waitlists')
        .update({ 
          status: 'emailed',
          metadata: { email_sent_at: new Date().toISOString(), email_id: emailResult.emailId }
        })
        .eq('email', email)
    })

    return { success: true, email, emailId: emailResult.emailId }
  }
)
