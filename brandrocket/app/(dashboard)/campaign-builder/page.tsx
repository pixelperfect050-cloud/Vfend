'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Rocket, Target, FileText, Megaphone, Share2, Mail, 
  Brain, Sparkles, CheckCircle2, ArrowRight, RefreshCw,
  Calendar, BarChart3, Zap, Layers, Palette
} from 'lucide-react'

interface CampaignData {
  businessName: string
  product: string
  targetAudience: string
  goal: string
  tone: string
  budget: string
  channels: string[]
}

const STEPS = [
  { id: 'business', title: 'Business Info', icon: Target, description: 'Tell us about your business' },
  { id: 'audience', title: 'Target Audience', icon: Users, description: 'Who are you reaching?' },
  { id: 'goals', title: 'Goals & Channels', icon: Zap, description: 'What do you want to achieve?' },
  { id: 'launch', title: 'Launch Campaign', icon: Rocket, description: 'Execute your campaign' },
]

const CHANNEL_OPTIONS = [
  { id: 'seo', name: 'SEO & Content', icon: FileText, description: 'Blog posts, landing pages' },
  { id: 'ads', name: 'Paid Ads', icon: Megaphone, description: 'Facebook, Google, LinkedIn' },
  { id: 'social', name: 'Social Media', icon: Share2, description: 'Twitter, Instagram, LinkedIn' },
  { id: 'email', name: 'Email Marketing', icon: Mail, description: 'Nurture sequences' },
]

const CAMPAIGN_TYPES = [
  { id: 'product_launch', name: 'Product Launch', description: 'Announce and promote a new product', icon: Rocket },
  { id: 'lead_gen', name: 'Lead Generation', description: 'Capture and nurture potential customers', icon: Target },
  { id: 'brand_awareness', name: 'Brand Awareness', description: 'Increase visibility and reach', icon: Megaphone },
  { id: 'content_boost', name: 'Content Distribution', description: 'Amplify existing content', icon: Share2 },
  { id: 'competitor', name: 'Competitive Attack', description: 'Target competitor audience', icon: BarChart3 },
]

export default function CampaignBuilderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [campaignType, setCampaignType] = React.useState('')
  const [data, setData] = React.useState<CampaignData>({
    businessName: '',
    product: '',
    targetAudience: '',
    goal: '',
    tone: 'professional',
    budget: 'medium',
    channels: [],
  })
  const [isLaunching, setIsLaunching] = React.useState(false)
  const [launchProgress, setLaunchProgress] = React.useState(0)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const updateData = (key: keyof CampaignData, value: any) => {
    setData({ ...data, [key]: value })
  }

  const toggleChannel = (channelId: string) => {
    const channels = data.channels.includes(channelId)
      ? data.channels.filter(c => c !== channelId)
      : [...data.channels, channelId]
    updateData('channels', channels)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.businessName && data.product
      case 1: return data.targetAudience
      case 2: return data.goal && data.channels.length > 0
      default: return true
    }
  }

  const handleLaunch = async () => {
    setIsLaunching(true)
    setLaunchProgress(0)

    // Simulate campaign launch with progress
    const steps = [
      { label: 'Analyzing business context', progress: 20 },
      { label: 'Researching target audience', progress: 40 },
      { label: 'Generating campaign strategy', progress: 60 },
      { label: 'Creating content assets', progress: 80 },
      { label: 'Setting up automations', progress: 95 },
      { label: 'Launching campaign', progress: 100 },
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setLaunchProgress(step.progress)
    }

    // Navigate to dashboard to see results
    router.push('/dashboard')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">What business are you promoting?</h2>
              <p className="text-muted-foreground">This helps AI understand your brand context</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAMPAIGN_TYPES.map((type) => (
                <Card 
                  key={type.id} 
                  className={`cursor-pointer transition-all ${campaignType === type.id ? 'border-brand bg-brand/5' : 'hover:border-muted-foreground'}`}
                  onClick={() => setCampaignType(type.id)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${campaignType === type.id ? 'bg-brand/10' : 'bg-muted'}`}>
                      <type.icon className={`h-5 w-5 ${campaignType === type.id ? 'text-brand' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {campaignType === type.id && (
                      <CheckCircle2 className="h-5 w-5 text-brand ml-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business/Brand Name</Label>
                <Input 
                  placeholder="Acme Corp"
                  value={data.businessName}
                  onChange={(e) => updateData('businessName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Product/Service</Label>
                <Input 
                  placeholder="AI Marketing Platform"
                  value={data.product}
                  onChange={(e) => updateData('product', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">Who is your target audience?</h2>
              <p className="text-muted-foreground">Help AI craft the right message</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Describe your target audience</Label>
                <Textarea 
                  placeholder="e.g., Marketing managers at B2B SaaS companies, 30-50 employees, looking to scale their marketing operations..."
                  rows={4}
                  value={data.targetAudience}
                  onChange={(e) => updateData('targetAudience', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tone of Voice</Label>
                <div className="flex flex-wrap gap-2">
                  {['Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Luxury'].map((tone) => (
                    <Button
                      key={tone}
                      variant={data.tone.toLowerCase() === tone.toLowerCase() ? 'default' : 'outline'}
                      size="sm"
                      className={data.tone.toLowerCase() === tone.toLowerCase() ? 'bg-brand' : ''}
                      onClick={() => updateData('tone', tone.toLowerCase())}
                    >
                      {tone}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">What channels and goals?</h2>
              <p className="text-muted-foreground">Choose how you want to reach your audience</p>
            </div>

            <div className="space-y-4">
              <Label>Select Channels</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHANNEL_OPTIONS.map((channel) => (
                  <Card 
                    key={channel.id}
                    className={`cursor-pointer transition-all ${data.channels.includes(channel.id) ? 'border-brand bg-brand/5' : 'hover:border-muted-foreground'}`}
                    onClick={() => toggleChannel(channel.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${data.channels.includes(channel.id) ? 'bg-brand/10' : 'bg-muted'}`}>
                        <channel.icon className={`h-5 w-5 ${data.channels.includes(channel.id) ? 'text-brand' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{channel.name}</h3>
                        <p className="text-xs text-muted-foreground">{channel.description}</p>
                      </div>
                      {data.channels.includes(channel.id) && (
                        <CheckCircle2 className="h-5 w-5 text-brand" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <Textarea 
                  placeholder="What is the main objective of this campaign?"
                  rows={2}
                  value={data.goal}
                  onChange={(e) => updateData('goal', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Budget Level</Label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <Button
                      key={level}
                      variant={data.budget === level ? 'default' : 'outline'}
                      size="sm"
                      className={data.budget === level ? 'bg-brand' : ''}
                      onClick={() => updateData('budget', level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">Ready to Launch</h2>
              <p className="text-muted-foreground">Review and launch your AI-powered campaign</p>
            </div>

            {isLaunching ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Sparkles className="h-12 w-12 mx-auto text-brand animate-pulse" />
                </div>
                <h3 className="text-lg font-medium mb-2">Launching Your Campaign</h3>
                <Progress value={launchProgress} className="max-w-md mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {launchProgress < 30 ? 'Analyzing your business context...' :
                   launchProgress < 50 ? 'Researching target audience...' :
                   launchProgress < 70 ? 'Generating campaign strategy...' :
                   launchProgress < 90 ? 'Creating content assets...' :
                   'Setting up automations...'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Campaign Type</p>
                        <p className="font-medium">{CAMPAIGN_TYPES.find(c => c.id === campaignType)?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business</p>
                        <p className="font-medium">{data.businessName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Channels</p>
                        <div className="flex flex-wrap gap-1">
                          {data.channels.map(c => (
                            <Badge key={c} variant="secondary" className="text-xs">
                              {CHANNEL_OPTIONS.find(ch => ch.id === c)?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tone</p>
                        <p className="font-medium capitalize">{data.tone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 text-brand" />
                    <h3 className="font-medium">AI Will Execute</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Create campaign strategy tailored to your audience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Generate all content (blogs, ads, social posts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Set up automated posting schedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Configure performance monitoring</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  className="w-full bg-brand hover:bg-brand/90 text-lg py-6"
                  onClick={handleLaunch}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch AI Campaign
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Campaign Builder" 
        description="Launch complete AI-powered growth campaigns in minutes."
      />

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{STEPS[currentStep].title}</span>
          <span className="text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {STEPS.map((step, i) => (
          <div 
            key={step.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              i === currentStep ? 'bg-brand text-brand-foreground' :
              i < currentStep ? 'bg-success/10 text-success' :
              'bg-muted text-muted-foreground'
            }`}
          >
            <step.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 3 && !isLaunching && (
        <div className="flex justify-between">
          <Button 
            variant="outline"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Back
          </Button>
          <Button 
            className="bg-brand hover:bg-brand/90"
            disabled={!canProceed()}
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

import { Users } from 'lucide-react'