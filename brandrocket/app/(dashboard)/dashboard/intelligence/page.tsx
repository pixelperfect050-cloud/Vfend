'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Brain,
  Zap, Activity, BarChart3, Shield, ChevronRight, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDemoMode } from '@/hooks/use-demo-mode'
import { EmptyState } from '@/components/shared/empty-state'

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
  const [scores, setScores] = React.useState<ScoreData[]>([
    { entityName: 'Product Launch Campaign', entityType: 'campaign', overall: 82, growth: 78, risk: 15, opportunity: 89, execution: 75 },
    { entityName: 'Q2 Content Strategy', entityType: 'campaign', overall: 71, growth: 65, risk: 25, opportunity: 82, execution: 68 },
    { entityName: 'SEO Growth', entityType: 'seo', overall: 76, growth: 88, risk: 12, opportunity: 72, execution: 70 },
    { entityName: 'Paid Ads Portfolio', entityType: 'ads', overall: 64, growth: 55, risk: 45, opportunity: 78, execution: 60 },
    { entityName: 'Email Automation', entityType: 'email', overall: 85, growth: 82, risk: 8, opportunity: 88, execution: 90 },
  ])

  const [trends, setTrends] = React.useState<TrendData[]>([
    { label: 'Website Traffic', value: 12400, change: 18, direction: 'up' },
    { label: 'Conversion Rate', value: 2.8, change: -0.3, direction: 'down' },
    { label: 'Ad Spend', value: 4200, change: 12, direction: 'up' },
    { label: 'Email Open Rate', value: 34, change: 5, direction: 'up' },
    { label: 'SEO Ranking', value: 45, change: 8, direction: 'up' },
  ])

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

  const { isDemoMode, isLoaded } = useDemoMode()
  const router = useRouter()

  if (!isLoaded) return null

  if (!isDemoMode) {
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
            label: "Launch Campaign",
            onClick: () => router.push('/dashboard/campaign-builder')
          }}
        />
      </div>
    )
  }

  const avgOverall = scores.reduce((acc, s) => acc + s.overall, 0) / scores.length

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
              <p className="text-2xl font-bold">74</p>
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
              <p className="text-2xl font-bold">21</p>
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
              <p className="text-2xl font-bold">82</p>
              <p className="text-xs text-brand">12 new found</p>
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
              <p className="text-2xl font-bold">73</p>
              <p className="text-xs text-muted-foreground">5 automations running</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand" />
            Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trends.map((trend, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground mb-1">{trend.label}</p>
                <p className="text-xl font-bold">{trend.value.toLocaleString()}</p>
                <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${trend.direction === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scores">Entity Scores</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          {scores.map((score, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{score.entityName}</h3>
                      <Badge variant="outline" className="text-xs capitalize">{score.entityType}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">Overall</p>
                      <p className={`text-sm ${getScoreColor(score.overall)}`}>{score.overall}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Growth</span>
                      <span className={getScoreColor(score.growth)}>{score.growth}</span>
                    </div>
                    <Progress value={score.growth} className="h-1.5" indicatorClassName={getScoreBg(score.growth)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Risk</span>
                      <span className={getScoreColor(100 - score.risk)}>{score.risk}</span>
                    </div>
                    <Progress value={score.risk} className="h-1.5" indicatorClassName={getScoreBg(100 - score.risk)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Opportunity</span>
                      <span className={getScoreColor(score.opportunity)}>{score.opportunity}</span>
                    </div>
                    <Progress value={score.opportunity} className="h-1.5" indicatorClassName={getScoreBg(score.opportunity)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Execution</span>
                      <span className={getScoreColor(score.execution)}>{score.execution}</span>
                    </div>
                    <Progress value={score.execution} className="h-1.5" indicatorClassName={getScoreBg(score.execution)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-success mb-4" />
              <h3 className="text-lg font-medium mb-2">Low Risk Profile</h3>
              <p className="text-muted-foreground">No critical issues detected. Your campaigns are performing within safe parameters.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto text-brand mb-4" />
              <h3 className="text-lg font-medium mb-2">12 Opportunities Identified</h3>
              <p className="text-muted-foreground mb-4">AI has found additional growth opportunities across your campaigns.</p>
              <Button className="bg-brand hover:bg-brand/90">
                View Opportunities
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}