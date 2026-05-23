'use client'

import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Brain,
  Zap, Activity, BarChart3, Shield, ChevronRight, RefreshCw, Lightbulb
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/shared/empty-state'
import { useWorkspaceStore } from '@/stores/workspace-store'

interface ScoreData {
  entityName: string
  entityType: string
  overall: number
  growth: number
  risk: number
  opportunity: number
  execution: number
}

interface TrendData {
  label: string
  value: number
  change: number
  direction: 'up' | 'down'
}

export default function IntelligencePage() {
  const { currentWorkspace } = useWorkspaceStore()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [scores, setScores] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (!currentWorkspace?.id) return

    async function loadData() {
      setIsLoading(true)
      try {
        const [intelRes, recsRes] = await Promise.all([
          fetch(`/api/intelligence?team_id=${currentWorkspace?.id}`),
          fetch(`/api/intelligence?team_id=${currentWorkspace?.id}&type=recommendations`)
        ])

        if (intelRes.ok) {
          const data = await intelRes.json()
          setScores(data.scores || [])
          setOpportunities(data.opportunities || [])
        }

        if (recsRes.ok) {
          const data = await recsRes.json()
          setRecommendations(data.recommendations || [])
        }
      } catch (err) {
        console.error('Failed to load intelligence data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentWorkspace?.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success'
    if (score >= 60) return 'bg-warning'
    return 'bg-destructive'
  }

  if (!currentWorkspace) return null

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading intelligence data...</div>
  }

  if (scores.length === 0 && opportunities.length === 0 && recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Growth Intelligence" 
          description="AI-powered insights, scores, and recommendations."
        />
        <EmptyState 
          icon={Brain}
          title="Intelligence Gathering"
          description="Your AI team needs active campaigns to generate growth insights and recommendations. Launch your first campaign to start gathering intelligence."
          action={{
            label: "Generate First Analysis",
            onClick: () => router.push('/dashboard/campaign-builder')
          }}
        />
      </div>
    )
  }

  const avgOverall = scores.length > 0 
    ? scores.reduce((acc, s) => acc + (s.overall_score || 0), 0) / scores.length 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Growth Intelligence" 
          description="AI-powered insights, scores, and recommendations."
        />
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      {/* Overall Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 border-border shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Overall Growth Score</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8"
                  strokeDasharray={`${avgOverall * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className={avgOverall >= 70 ? 'text-success' : avgOverall >= 50 ? 'text-warning' : 'text-destructive'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{Math.round(avgOverall)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{avgOverall >= 70 ? 'Healthy' : avgOverall >= 50 ? 'Needs Attention' : 'Critical'}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Growth</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(scores.length > 0 ? scores[0].growth_score || 0 : 0)}</p>
              <p className="text-xs text-success">+8% this month</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Risk</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(scores.length > 0 ? scores[0].risk_score || 0 : 0)}</p>
              <p className="text-xs text-warning">2 alerts active</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <Target className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm text-muted-foreground">Opportunity</span>
              </div>
              <p className="text-2xl font-bold">{opportunities.length}</p>
              <p className="text-xs text-brand">{opportunities.filter(o => o.status === 'identified').length} active</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-500" />
                </div>
                <span className="text-sm text-muted-foreground">Execution</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(scores.length > 0 ? scores[0].execution_score || 0 : 0)}</p>
              <p className="text-xs text-muted-foreground">5 automations running</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scores">Entity Scores</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          {scores.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground border rounded-lg border-dashed">No entity scores available yet.</div>
          ) : scores.map((score, i) => (
            <Card key={score.id || i} className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{score.entity_id || 'Entity'}</h3>
                      <Badge variant="outline" className="text-xs capitalize">{score.entity_type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">Overall</p>
                      <p className={`text-sm ${getScoreColor(score.overall_score || 0)}`}>{Math.round(score.overall_score || 0)}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Growth</span>
                      <span className={getScoreColor(score.growth_score || 0)}>{Math.round(score.growth_score || 0)}</span>
                    </div>
                    <Progress value={score.growth_score || 0} className="h-1.5" indicatorClassName={getScoreBg(score.growth_score || 0)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Risk</span>
                      <span className={getScoreColor(100 - (score.risk_score || 0))}>{Math.round(score.risk_score || 0)}</span>
                    </div>
                    <Progress value={score.risk_score || 0} className="h-1.5" indicatorClassName={getScoreBg(100 - (score.risk_score || 0))} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Opportunity</span>
                      <span className={getScoreColor(score.opportunity_score || 0)}>{Math.round(score.opportunity_score || 0)}</span>
                    </div>
                    <Progress value={score.opportunity_score || 0} className="h-1.5" indicatorClassName={getScoreBg(score.opportunity_score || 0)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Execution</span>
                      <span className={getScoreColor(score.execution_score || 0)}>{Math.round(score.execution_score || 0)}</span>
                    </div>
                    <Progress value={score.execution_score || 0} className="h-1.5" indicatorClassName={getScoreBg(score.execution_score || 0)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.length === 0 ? (
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Opportunities Identified</h3>
                <p className="text-muted-foreground mb-4">Check back later once the AI has analyzed more data.</p>
              </CardContent>
            </Card>
          ) : (
            opportunities.map(opp => (
              <Card key={opp.id} className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{opp.title}</h3>
                      <p className="text-sm text-muted-foreground">{opp.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{opp.opportunity_type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
                <p className="text-muted-foreground mb-4">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            recommendations.map(rec => (
              <Card key={rec.id} className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand/10 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-brand" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    {rec.action_url && (
                      <Button className="bg-brand hover:bg-brand/90" onClick={() => router.push(rec.action_url)}>
                        Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}