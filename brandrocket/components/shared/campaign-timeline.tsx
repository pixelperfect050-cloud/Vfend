'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Search, Target, PenTool, BarChart3, Cpu, MessageSquare,
  CheckCircle2, Sparkles, Loader2, Lightbulb, Settings2
} from 'lucide-react'
import type { CampaignState, AgentId, CampaignEventType } from '@/types'

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
)

// Agent identity configuration
const AGENT_CONFIG: Record<AgentId, { name: string; icon: React.ElementType; color: string; bgColor: string }> = {
  orchestrator: { name: 'Orchestrator', icon: Cpu, color: 'text-brand', bgColor: 'bg-brand/10' },
  seo: { name: 'SEO Strategist', icon: Search, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ads: { name: 'Ad Optimizer', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  content: { name: 'Content Writer', icon: PenTool, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  social: { name: 'Social Manager', icon: MessageSquare, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  analytics: { name: 'Growth Analyst', icon: BarChart3, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
}

const EVENT_ICONS: Record<CampaignEventType, React.ElementType> = {
  status_update: Settings2,
  agent_thinking: Loader2,
  action_started: Sparkles,
  action_completed: CheckCircle2,
  insight_discovered: Lightbulb,
  optimization_applied: Settings2,
}

const STATE_COLORS: Record<CampaignState, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Planning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Orchestrating: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Executing: 'bg-brand/10 text-brand',
  Monitoring: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Optimizing: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Completed: 'bg-success/10 text-success',
}

interface TimelineEvent {
  id: string
  campaign_id: string
  agent_id: AgentId
  event_type: CampaignEventType
  message: string
  metadata: Record<string, unknown>
  created_at: string
}

interface CampaignTimelineProps {
  campaignId: string
  className?: string
}

export function CampaignTimeline({ campaignId, className }: CampaignTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [status, setStatus] = useState<CampaignState>('Draft')
  const [isConnected, setIsConnected] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch existing events and current status
  useEffect(() => {
    async function load() {
      // Get current campaign status
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('status')
        .eq('id', campaignId)
        .single()

      if (campaign) {
        setStatus(campaign.status as CampaignState)
      }

      // Get existing events
      const { data: existingEvents } = await supabase
        .from('campaign_events')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true })

      if (existingEvents) {
        setEvents(existingEvents as TimelineEvent[])
      }
    }

    load()
  }, [campaignId])

  // Subscribe to realtime updates
  useEffect(() => {
    // Subscribe to campaign_events
    const eventsChannel = supabase
      .channel(`campaign-events-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaign_events',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          const newEvent = payload.new as TimelineEvent
          setEvents(prev => [...prev, newEvent])

          // Auto-scroll to bottom
          setTimeout(() => {
            scrollRef.current?.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }, 100)
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Subscribe to campaign status changes
    const statusChannel = supabase
      .channel(`campaign-status-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaigns',
          filter: `id=eq.${campaignId}`,
        },
        (payload) => {
          const updated = payload.new as { status: CampaignState }
          setStatus(updated.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(eventsChannel)
      supabase.removeChannel(statusChannel)
    }
  }, [campaignId])

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 5) return 'just now'
    if (diffSec < 60) return `${diffSec}s ago`
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={cn('bg-card border rounded-xl shadow-sm overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand/10">
            <Cpu className="w-5 h-5 text-brand animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Execution Timeline
              {isConnected && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">Real-time agent activity</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Badge className={cn('font-semibold text-xs', STATE_COLORS[status])}>
              {status}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Events list */}
      <div ref={scrollRef} className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-muted mb-3">
              <Cpu className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Waiting for campaign to start...</p>
            {/* Typing indicator */}
            <div className="flex gap-1 mt-3">
              <div className="typing-dot bg-brand" />
              <div className="typing-dot bg-brand" />
              <div className="typing-dot bg-brand" />
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {events.map((event, index) => {
            const agentConfig = AGENT_CONFIG[event.agent_id] || AGENT_CONFIG.orchestrator
            const AgentIcon = agentConfig.icon
            const EventIcon = EVENT_ICONS[event.event_type] || CheckCircle2
            const isThinking = event.event_type === 'agent_thinking'

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index === events.length - 1 ? 0.1 : 0,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="flex gap-3 group"
              >
                {/* Agent icon */}
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  agentConfig.bgColor
                )}>
                  <AgentIcon className={cn(
                    'w-4 h-4',
                    agentConfig.color,
                    isThinking && 'animate-spin'
                  )} />
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-xs font-semibold', agentConfig.color)}>
                      {agentConfig.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(event.created_at)}
                    </span>
                  </div>
                  <p className={cn(
                    'text-sm leading-relaxed',
                    isThinking ? 'text-muted-foreground italic' : 'text-foreground/90'
                  )}>
                    {event.message}
                    {isThinking && (
                      <span className="inline-flex gap-0.5 ml-1">
                        <span className="typing-dot bg-muted-foreground" />
                        <span className="typing-dot bg-muted-foreground" />
                        <span className="typing-dot bg-muted-foreground" />
                      </span>
                    )}
                  </p>
                </div>

                {/* Event type indicator */}
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EventIcon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
