'use client'

import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Bot, FileText, Megaphone, Search, Zap, ArrowUpRight, Plus, Rocket, Copy, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { demoCampaigns, demoActivityFeed, demoMetrics } from '@/lib/demo-data'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useDemoMode } from '@/hooks/use-demo-mode'

export default function DashboardPage() {
  const { isDemoMode, isLoaded } = useDemoMode()

  const campaigns = isDemoMode ? demoCampaigns : [] // Explicit source switching: Real users see empty state until real DB is connected
  const activityFeed = isDemoMode ? demoActivityFeed : []
  const metrics = isDemoMode ? demoMetrics : {
    totalConversions: 0,
    conversionGrowth: '0%',
    totalSpend: '$0',
    spendEfficiency: '0%',
    activeAgents: 0,
    tasksCompleted: 0
  }

  if (!isLoaded) return null // Prevent hydration mismatch


  return (
    <div className="space-y-6 pb-12">
      
      <PageHeader 
        title="Command Center" 
        description="Your AI growth team is actively monitoring and optimizing your campaigns."
      >
        <Link href="/launch">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/20 transition-all hover:scale-105 gap-2">
            <Rocket className="w-4 h-4" /> Launch Campaign
          </Button>
        </Link>
      </PageHeader>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
              <TargetIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.totalConversions}</div>
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {metrics.conversionGrowth}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Spend Efficiency</p>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.totalSpend}</div>
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {metrics.spendEfficiency}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Autonomous Tasks</p>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">completed this week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-brand/5 to-transparent border-brand/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-brand">Active AI Agents</p>
              <Activity className="h-4 w-4 text-brand animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-brand">{metrics.activeAgents}</div>
              <div className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                <p className="text-xs text-brand font-medium">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tight">Active Campaigns</h3>
            <Link href="/dashboard/campaign-builder" className="text-sm text-brand hover:underline font-medium">
              View all
            </Link>
          </div>
          
          <div className="grid gap-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                No active campaigns found. Start one today!
              </div>
            ) : (
            campaigns.map(campaign => (
              <Card key={campaign.id} className="hover:border-brand/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{campaign.name}</h4>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                            campaign.status === 'active' ? "bg-success/10 text-success" : 
                            campaign.status === 'optimizing' ? "bg-amber-500/10 text-amber-600" :
                            "bg-blue-500/10 text-blue-600"
                          )}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {campaign.channels.map(c => (
                            <span key={c} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-brand/5 border border-brand/10 p-3 rounded-lg flex items-start gap-3">
                        <Bot className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-brand mb-0.5">{campaign.lastActiveAgent}</p>
                          <p className="text-xs text-muted-foreground">{campaign.lastAction}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-end gap-2 sm:min-w-[120px]">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                        <p className="font-bold text-xl">{campaign.conversions}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">CPA</p>
                        <p className="font-semibold">{campaign.cpa}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>

        {/* AI Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tight">Intelligence Feed</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
          </div>
          
          <Card className="h-[calc(100%-2rem)]">
            <CardContent className="p-0">
              <div className="divide-y">
                {activityFeed.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No recent activity.</div>
                ) : (
                  activityFeed.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg shrink-0 mt-0.5",
                          activity.type === 'opportunity' ? "bg-blue-500/10 text-blue-500" :
                          activity.type === 'alert' ? "bg-amber-500/10 text-amber-500" :
                          activity.type === 'success' ? "bg-success/10 text-success" :
                          "bg-brand/10 text-brand"
                        )}>
                          {activity.type === 'opportunity' ? <Zap className="w-4 h-4" /> :
                           activity.type === 'alert' ? <AlertTriangle className="w-4 h-4" /> :
                           activity.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                           <Bot className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-foreground">{activity.agent}</p>
                            <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-snug">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t bg-muted/20 text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
