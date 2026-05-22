'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Zap, Brain, AlertTriangle, CheckCircle2, Play, Pause, 
  Plus, Settings, Trash2, Clock, Activity, TrendingDown, Search
} from 'lucide-react'

interface Trigger {
  id: string
  name: string
  triggerType: string
  conditions: string
  actions: string
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
  cooldown: number
}

const TRIGGER_TYPES = [
  { id: 'performance_drop', name: 'Performance Drop', icon: TrendingDown, description: 'Detect significant performance drops' },
  { id: 'seo_issue', name: 'SEO Issue Detected', icon: Search, description: 'New SEO issues identified' },
  { id: 'content_gap', name: 'Content Gap', icon: Brain, description: 'New content opportunity found' },
  { id: 'competitor_change', name: 'Competitor Change', icon: Activity, description: 'Competitor strategy change detected' },
  { id: 'budget_alert', name: 'Budget Alert', icon: AlertTriangle, description: 'Ad spend threshold reached' },
  { id: 'scheduled', name: 'Scheduled', icon: Clock, description: 'Run at specific times' },
]

export default function AutonomousPage() {
  const [triggers, setTriggers] = React.useState<Trigger[]>([
    { id: '1', name: 'SEO Drop Alert', triggerType: 'seo_issue', conditions: 'SEO score drops > 10%', actions: 'Notify + Generate fix suggestions', isActive: true, lastTriggered: '2d ago', triggerCount: 8, cooldown: 60 },
    { id: '2', name: 'Ad Performance Recovery', triggerType: 'performance_drop', conditions: 'ROAS < 2 for 3 days', actions: 'Pause low performers + Suggest alternatives', isActive: true, lastTriggered: '5h ago', triggerCount: 12, cooldown: 120 },
    { id: '3', name: 'Content Gap Seeker', triggerType: 'content_gap', conditions: 'New high-volume keywords detected', actions: 'Create content brief + Notify team', isActive: false, lastTriggered: '1w ago', triggerCount: 3, cooldown: 1440 },
  ])

  const [showCreate, setShowCreate] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<string>('')

  const toggleTrigger = (id: string) => {
    setTriggers(triggers.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ))
  }

  const activeCount = triggers.filter(t => t.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Autonomous AI" 
          description="Configure AI-triggered automations that act on your behalf."
        />
        <Button className="bg-brand hover:bg-brand/90" onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Trigger
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Zap className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Triggers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{triggers.reduce((acc, t) => acc + t.triggerCount, 0)}</p>
              <p className="text-xs text-muted-foreground">Executions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Needs Attention</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trigger List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-semibold">Active Automations</h2>
        </div>
        
        {triggers.map((trigger) => {
          const typeInfo = TRIGGER_TYPES.find(t => t.id === trigger.triggerType)
          const Icon = typeInfo?.icon || Zap

          return (
            <Card key={trigger.id} className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${trigger.isActive ? 'bg-brand/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${trigger.isActive ? 'text-brand' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{trigger.name}</h3>
                        <Badge variant="secondary" className={trigger.isActive ? 'bg-success/10 text-success' : ''}>
                          {trigger.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{trigger.conditions}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">→ {trigger.actions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Cooldown</p>
                      <p className="text-sm font-medium">{trigger.cooldown}min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Executions</p>
                      <p className="text-sm font-medium">{trigger.triggerCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last run</p>
                      <p className="text-sm font-medium">{trigger.lastTriggered || 'Never'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={trigger.isActive}
                        onCheckedChange={() => toggleTrigger(trigger.id)}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add Trigger Card */}
        <Card className="border-dashed border-2 flex items-center justify-center p-8 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setShowCreate(true)}>
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
              <Plus className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">Add Autonomous Trigger</p>
            <p className="text-xs text-muted-foreground mt-1">Let AI act on your behalf</p>
          </div>
        </Card>
      </div>

      {/* Create Trigger Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Autonomous Trigger</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {TRIGGER_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? 'default' : 'outline'}
                    className="justify-start h-auto py-3"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <type.icon className="mr-2 h-4 w-4" />
                    <span className="text-sm">{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trigger Name</Label>
              <Input placeholder="e.g., SEO Score Drop Alert" />
            </div>
            <div className="space-y-2">
              <Label>Conditions</Label>
              <Textarea placeholder="When should this trigger activate?" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <Textarea placeholder="What should AI do when triggered?" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Cooldown (minutes)</Label>
              <Input type="number" defaultValue={60} />
            </div>
            <Button className="w-full bg-brand hover:bg-brand/90">
              <Zap className="mr-2 h-4 w-4" />
              Create Trigger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}