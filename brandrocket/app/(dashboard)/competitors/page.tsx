'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Swords, Search, TrendingUp, TrendingDown, Globe, 
  AlertTriangle, CheckCircle2, Plus, RefreshCw, ExternalLink
} from 'lucide-react'

interface Competitor {
  id: string
  name: string
  website: string
  industry: string
  status: 'analyzing' | 'tracked' | 'alert'
  lastAnalysis?: string
  traffic?: string
  keywords?: number
  changes?: { type: string; description: string }[]
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = React.useState<Competitor[]>([
    { id: '1', name: 'Competitor A', website: 'competitor-a.com', industry: 'SaaS', status: 'tracked', lastAnalysis: '2h ago', traffic: '125K/mo', keywords: 342 },
    { id: '2', name: 'Competitor B', website: 'competitor-b.com', industry: 'Marketing', status: 'alert', lastAnalysis: '1d ago', traffic: '89K/mo', keywords: 198, changes: [{ type: 'new_keywords', description: 'Gained 12 new rankings' }] },
    { id: '3', name: 'Competitor C', website: 'competitor-c.com', industry: 'E-commerce', status: 'analyzing', lastAnalysis: 'In progress...' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Competitor Intelligence" 
          description="Track and analyze your competitors' marketing strategies."
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
          <Button className="bg-brand hover:bg-brand/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Swords className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{competitors.length}</p>
              <p className="text-xs text-muted-foreground">Tracked</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{competitors.filter(c => c.status === 'alert').length}</p>
              <p className="text-xs text-muted-foreground">Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">+8</p>
              <p className="text-xs text-muted-foreground">New Keywords</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Search className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">540</p>
              <p className="text-xs text-muted-foreground">Total Keywords</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{competitor.name}</CardTitle>
                    <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-brand flex items-center gap-1">
                      {competitor.website} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <Badge variant="secondary" className={
                  competitor.status === 'tracked' ? 'bg-success/10 text-success' :
                  competitor.status === 'alert' ? 'bg-warning/10 text-warning' :
                  'bg-brand/10 text-brand'
                }>
                  {competitor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Traffic</p>
                  <p className="font-medium text-sm">{competitor.traffic || 'Analyzing...'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Keywords</p>
                  <p className="font-medium text-sm">{competitor.keywords || '-'}</p>
                </div>
              </div>
              
              {competitor.changes && competitor.changes.length > 0 && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Recent Changes</span>
                  </div>
                  {competitor.changes.map((change, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{change.description}</p>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">{competitor.lastAnalysis}</span>
                <Button variant="outline" size="sm">
                  <Search className="mr-1 h-3 w-3" />
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Competitor Card */}
        <Card className="border-dashed border-2 flex items-center justify-center min-h-[250px] cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
              <Plus className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">Add Competitor</p>
            <p className="text-xs text-muted-foreground mt-1">Start tracking a competitor</p>
          </div>
        </Card>
      </div>
    </div>
  )
}