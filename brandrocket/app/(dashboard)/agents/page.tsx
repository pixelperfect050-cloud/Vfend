'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bot, Search, FileText, Megaphone, BarChart3, Brain, 
  Settings, Play, Pause, Trash2, Plus, Sparkles, Zap
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  type: 'seo' | 'content' | 'ads' | 'analytics'
  description: string
  isActive: boolean
  lastRun?: string
  tasksCompleted?: number
}

const AGENT_TYPES = {
  seo: {
    icon: Search,
    color: 'text-brand bg-brand/10',
    capabilities: ['Website analysis', 'Keyword research', 'Competitor SEO', 'Content optimization'],
  },
  content: {
    icon: FileText,
    color: 'text-purple-500 bg-purple-500/10',
    capabilities: ['Blog generation', 'Social copy', 'Email sequences', 'Ad copy'],
  },
  ads: {
    icon: Megaphone,
    color: 'text-warning bg-warning/10',
    capabilities: ['Ad copy generation', 'A/B testing', 'Budget optimization', 'Performance analysis'],
  },
  analytics: {
    icon: BarChart3,
    color: 'text-success bg-success/10',
    capabilities: ['Growth insights', 'Trend detection', 'Report generation', 'Forecasting'],
  },
}

export default function AgentsPage() {
  const [agents, setAgents] = React.useState<Agent[]>([
    { id: '1', name: 'SEO Specialist', type: 'seo', description: 'Analyzes websites and provides optimization recommendations', isActive: true, lastRun: '2h ago', tasksCompleted: 45 },
    { id: '2', name: 'Content Writer', type: 'content', description: 'Generates marketing content across all channels', isActive: true, lastRun: '1d ago', tasksCompleted: 128 },
    { id: '3', name: 'Ads Manager', type: 'ads', description: 'Creates and optimizes ad campaigns', isActive: false, lastRun: '3d ago', tasksCompleted: 67 },
    { id: '4', name: 'Analytics Bot', type: 'analytics', description: 'Monitors metrics and provides growth insights', isActive: true, lastRun: '30m ago', tasksCompleted: 234 },
  ])

  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null)
  const [showConfig, setShowConfig] = React.useState(false)

  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const handleRunAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowConfig(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="AI Agents" 
          description="Configure and manage your AI agents for automated tasks."
        />
        <Button className="bg-brand hover:bg-brand/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Agent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Bot className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agents.filter(a => a.isActive).length}</p>
              <p className="text-xs text-muted-foreground">Active Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Zap className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agents.reduce((acc, a) => acc + (a.tasksCompleted || 0), 0)}</p>
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Brain className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Agent Types</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-xs text-muted-foreground">Avg. Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const config = AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]
          const Icon = config?.icon || Bot
          
          return (
            <Card key={agent.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${config?.color || 'bg-muted'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">{agent.type} Agent</p>
                    </div>
                  </div>
                  <Switch 
                    checked={agent.isActive} 
                    onCheckedChange={() => toggleAgent(agent.id)}
                  />
                </div>
                <CardDescription className="mt-2">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {config?.capabilities.map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last run: {agent.lastRun}</span>
                    <span>{agent.tasksCompleted} tasks</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunAgent(agent)}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Run
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add Agent Card */}
        <Card className="border-dashed border-2 flex items-center justify-center min-h-[280px] cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium">Add New Agent</p>
            <p className="text-xs text-muted-foreground mt-1">Configure a custom AI agent</p>
          </div>
        </Card>
      </div>

      {/* Run Agent Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run {selectedAgent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Input / Query</Label>
              <Textarea 
                placeholder={`What would you like the ${selectedAgent?.name} to do?`}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Use Previous Context</Button>
                <Button variant="outline" size="sm">Save as Template</Button>
              </div>
            </div>
            <Button className="w-full bg-brand hover:bg-brand/90" onClick={() => setShowConfig(false)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Execute Agent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}