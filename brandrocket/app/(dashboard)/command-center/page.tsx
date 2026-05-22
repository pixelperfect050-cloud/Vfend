'use client'

import * as React from 'react'
import { createClient } from '@supabase/supabase-js'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, TrendingDown, Zap, Brain, Megaphone, Search, BarChart3, 
  AlertTriangle, CheckCircle2, ArrowRight, Sparkles, Target, Activity,
  Clock, Users, FileText, Calendar
} from 'lucide-react'

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
)

interface GrowthMetric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
}

interface Recommendation {
  id: string
  type: 'seo' | 'content' | 'ads' | 'growth'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action?: string
}

interface CampaignStatus {
  name: string
  type: string
  status: 'running' | 'completed' | 'failed'
  progress: number
}

export default function CommandCenterPage() {
  const [metrics, setMetrics] = React.useState<GrowthMetric[]>([])
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([])
  const [campaigns, setCampaigns] = React.useState<CampaignStatus[]>([])
  const [automations, setAutomations] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Mock data for demonstration - in production, fetch from API
      setMetrics([
        { label: 'Total Reach', value: '12.4K', change: 18, trend: 'up' },
        { label: 'Engagement Rate', value: '4.2%', change: 0.8, trend: 'up' },
        { label: 'Conversion Rate', value: '2.1%', change: -0.3, trend: 'down' },
        { label: 'Revenue', value: '$8,240', change: 24, trend: 'up' },
        { label: 'Active Users', value: '847', change: 12, trend: 'up' },
        { label: 'SEO Score', value: '87/100', change: 5, trend: 'up' },
      ])

      setRecommendations([
        { id: '1', type: 'seo', title: 'Optimize Meta Descriptions', description: '12 pages have missing meta descriptions that are hurting SEO.', priority: 'high', action: '/dashboard/seo' },
        { id: '2', type: 'content', title: 'Write Blog Post', description: 'Your audience is searching for "AI marketing trends". Create content to capture this traffic.', priority: 'high', action: '/dashboard/blog' },
        { id: '3', type: 'ads', title: 'Scale Winning Ad', description: 'Facebook ad "Spring Sale" has 3.2x ROAS. Consider increasing budget.', priority: 'medium', action: '/dashboard/ads' },
        { id: '4', type: 'growth', title: 'Email List Growth', description: 'Add pop-up to capture more leads. Current conversion is 2.1%.', priority: 'medium' },
      ])

      setCampaigns([
        { name: 'Product Launch Campaign', type: 'launch', status: 'running', progress: 65 },
        { name: 'Q2 Content Push', type: 'content', status: 'running', progress: 40 },
        { name: 'Email Nurture Sequence', type: 'email', status: 'completed', progress: 100 },
        { name: 'Competitor Analysis', type: 'research', status: 'failed', progress: 30 },
      ])

      setAutomations([
        { name: 'Blog → Social Auto-Post', status: 'active', trigger: 'New blog published', lastRun: '2h ago' },
        { name: 'SEO Scan Weekly', status: 'active', trigger: 'Every Monday 9am', lastRun: '3d ago' },
        { name: 'Lead Score Update', status: 'active', trigger: 'Daily at midnight', lastRun: '12h ago' },
        { name: 'Competitor Alert', status: 'paused', trigger: 'Manual only', lastRun: 'Never' },
      ])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10'
      case 'medium': return 'text-warning bg-warning/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'seo': return Search
      case 'content': return FileText
      case 'ads': return Megaphone
      case 'growth': return TrendingUp
      default: return Brain
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Command Center" 
          description="AI-powered growth command center - your operational hub."
        />
        <Button className="bg-brand hover:bg-brand/90">
          <Sparkles className="mr-2 h-4 w-4" />
          Ask AI Assistant
        </Button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                <div className={`flex items-center text-xs ${metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : metric.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Recommendations */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-brand" />
                    AI Recommendations
                  </CardTitle>
                  <Badge variant="secondary" className="bg-brand/10 text-brand">
                    {recommendations.length} Active
                  </Badge>
                </div>
                <CardDescription>Prioritized actions to grow your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec) => {
                  const Icon = getRecommendationIcon(rec.type)
                  return (
                    <div key={rec.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className={`p-2 rounded-lg shrink-0 ${getPriorityColor(rec.priority)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">{rec.title}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0 ml-2">{rec.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                        {rec.action && (
                          <Button variant="ghost" size="sm" className="mt-2 h-auto p-0 text-xs text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                            Take Action <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-brand" />
                    Active Campaigns
                  </CardTitle>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {campaigns.filter(c => c.status === 'running').length} Running
                  </Badge>
                </div>
                <CardDescription>Current campaign execution status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{campaign.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] ${
                            campaign.status === 'running' ? 'bg-brand/10 text-brand' :
                            campaign.status === 'completed' ? 'bg-success/10 text-success' :
                            'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{campaign.progress}%</span>
                    </div>
                    <Progress 
                      value={campaign.progress} 
                      className="h-1.5"
                      indicatorClassName={campaign.status === 'failed' ? 'bg-destructive' : 'bg-brand'}
                    />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Start New Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-brand/10 rounded-lg">
                  <Activity className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Active Automations</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-muted-foreground">Tasks This Month</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Alerts Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground">AI Efficiency</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign, i) => (
              <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge 
                        variant="secondary" 
                        className={
                          campaign.status === 'running' ? 'bg-brand/10 text-brand' :
                          campaign.status === 'completed' ? 'bg-success/10 text-success' :
                          'bg-destructive/10 text-destructive'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Launch AI Campaign</p>
                <p className="text-xs text-muted-foreground mt-1">Let AI orchestrate your growth</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Workflow Automations</CardTitle>
              <CardDescription>Automated workflows running in the background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((auto, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${auto.status === 'active' ? 'bg-success/10' : 'bg-muted'}`}>
                        <Zap className={`h-5 w-5 ${auto.status === 'active' ? 'text-success' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{auto.name}</p>
                        <p className="text-xs text-muted-foreground">{auto.trigger}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Last run</p>
                        <p className="text-sm">{auto.lastRun}</p>
                      </div>
                      <Badge variant={auto.status === 'active' ? 'default' : 'secondary'} className={auto.status === 'active' ? 'bg-success text-white' : ''}>
                        {auto.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create New Automation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-brand" />
                  Growth Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-brand/5 border border-brand/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <span className="font-medium text-sm">Top Insight</span>
                  </div>
                  <p className="text-sm">Your conversion rate peaks at 2.8% between 2-4 PM. Schedule important campaigns during this window for 23% better results.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm">LinkedIn posts perform 3x better than other platforms for B2B content. Consider prioritizing LinkedIn in your next content campaign.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm">Users who receive 3+ touchpoints convert at 48% higher rate. Your current email sequence has 2 touchpoints.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand" />
                  Performance Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Next 7 Days Reach</span>
                  <span className="font-bold text-success">+15% predicted</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Next 30 Days Revenue</span>
                  <span className="font-bold text-success">+$2,400 predicted</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Churn Risk</span>
                  <span className="font-bold text-warning">Low (8%)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Plus } from 'lucide-react'