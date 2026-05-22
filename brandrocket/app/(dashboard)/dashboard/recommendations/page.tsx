'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, TrendingUp, AlertTriangle, Target, Zap, CheckCircle2,
  XCircle, ArrowRight, Sparkles, Clock, Eye, Filter
} from 'lucide-react'

interface Recommendation {
  id: string
  type: 'growth' | 'alert' | 'optimization' | 'opportunity' | 'security'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionUrl?: string
  context?: any
  createdAt: string
}

interface Activity {
  id: string
  actorType: string
  actorName: string
  actionType: string
  description: string
  createdAt: string
}

interface Opportunity {
  id: string
  opportunityType: string
  title: string
  impactScore: number
  effortScore: number
  roiEstimate: number
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([
    { id: '1', type: 'growth', priority: 'high', title: 'SEO opportunity detected', description: 'Your "AI marketing" keyword is ranking on page 2. Creating a dedicated page could push you to page 1.', actionUrl: '/dashboard/seo', createdAt: '2h ago' },
    { id: '2', type: 'alert', priority: 'high', title: 'Ad spend spike detected', description: 'Facebook ad costs increased 23% this week. Consider pausing underperforming ads.', actionUrl: '/dashboard/ads', createdAt: '4h ago' },
    { id: '3', type: 'optimization', priority: 'medium', title: 'Blog post update suggested', description: '"Marketing Trends 2024" could be refreshed with new statistics to improve engagement.', actionUrl: '/dashboard/blog', createdAt: '1d ago' },
    { id: '4', type: 'opportunity', priority: 'high', title: 'Competitor content gap', description: 'No competitor has content about "AI automation for SMB". This could be your差异化 advantage.', createdAt: '2d ago' },
    { id: '5', type: 'growth', priority: 'low', title: 'Email list milestone', description: 'You reached 1,000 subscribers! Consider celebrating with a special offer.', createdAt: '3d ago' },
    { id: '6', type: 'optimization', priority: 'medium', title: 'LinkedIn post timing', description: 'Your audience is most active at 9 AM. Schedule posts accordingly for 40% more engagement.', createdAt: '4d ago' },
  ])

  const [activity, setActivity] = React.useState<Activity[]>([
    { id: '1', actorType: 'AI Agent', actorName: 'SEO Specialist', actionType: 'completed', description: 'Analyzed website for 12 keywords', createdAt: '2h ago' },
    { id: '2', actorType: 'Workflow', actorName: 'Content Pipeline', actionType: 'created', description: 'Generated 3 new blog posts', createdAt: '3h ago' },
    { id: '3', actorType: 'Trigger', actorName: 'Performance Monitor', actionType: 'detected', description: 'ROAS dropped below threshold', createdAt: '4h ago' },
    { id: '4', actorType: 'User', actorName: 'You', actionType: 'launched', description: 'Launched "Product Launch" campaign', createdAt: '5h ago' },
    { id: '5', actorType: 'AI Agent', actorName: 'Content Writer', actionType: 'generated', description: 'Created 5 social media posts', createdAt: '1d ago' },
    { id: '6', actorType: 'System', actorName: 'Auto-Scheduler', actionType: 'scheduled', description: 'Scheduled posts for next 7 days', createdAt: '1d ago' },
  ])

  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([
    { id: '1', opportunityType: 'content', title: 'AI Marketing Guide', impactScore: 92, effortScore: 3, roiEstimate: 4.5 },
    { id: '2', opportunityType: 'seo', title: 'Long-tail keyword targeting', impactScore: 78, effortScore: 2, roiEstimate: 3.2 },
    { id: '3', opportunityType: 'ads', title: 'Retargeting campaign', impactScore: 85, effortScore: 4, roiEstimate: 5.8 },
    { id: '4', opportunityType: 'email', title: 'Welcome sequence', impactScore: 65, effortScore: 2, roiEstimate: 2.1 },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'growth': return TrendingUp
      case 'alert': return AlertTriangle
      case 'optimization': return Target
      case 'opportunity': return Sparkles
      case 'security': return Zap
      default: return Brain
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium': return 'bg-warning/10 text-warning border-warning/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const highCount = recommendations.filter(r => r.priority === 'high').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="AI Recommendations" 
          description="Real-time insights and actions for your growth."
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Brain className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recommendations.length}</p>
              <p className="text-xs text-muted-foreground">Total Recommendations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highCount}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{opportunities.length}</p>
              <p className="text-xs text-muted-foreground">Opportunities</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">All Recommendations</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-3">
          {recommendations.map((rec) => {
            const Icon = getTypeIcon(rec.type)
            return (
              <Card key={rec.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getPriorityColor(rec.priority)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{rec.title}</h3>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{rec.createdAt}</span>
                        {rec.actionUrl && (
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-brand">
                            Take Action <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Top Opportunities</CardTitle>
              <CardDescription>AI-scored opportunities ranked by potential ROI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{opp.title}</h3>
                      <Badge variant="secondary" className="text-xs capitalize">{opp.opportunityType}</Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Impact: {opp.impactScore}%</span>
                      <span>Effort: {opp.effortScore}/5</span>
                      <span>ROI: {opp.roiEstimate}x</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Target className="mr-2 h-4 w-4" />
                    Pursue
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-2">
          {activity.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                {item.actorType === 'AI Agent' ? <Brain className="h-4 w-4 text-brand" /> :
                 item.actorType === 'Workflow' ? <Zap className="h-4 w-4 text-warning" /> :
                 item.actorType === 'Trigger' ? <AlertTriangle className="h-4 w-4 text-destructive" /> :
                 <Target className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.actorName}</span>
                  <Badge variant="outline" className="text-xs">{item.actionType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{item.createdAt}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}