'use client'

import * as React from 'react'
import { Calendar as CalendarIcon, Clock, Image as ImageIcon, Sparkles, Globe, MessageCircle, Briefcase, Camera, LayoutGrid, List, CheckCircle2, ChevronLeft, ChevronRight, Hash } from 'lucide-react'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock Data for the UI
const PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: MessageCircle, color: 'text-[#1DA1F2]', bg: 'bg-[#1DA1F2]/10' },
  { id: 'linkedin', name: 'LinkedIn', icon: Briefcase, color: 'text-[#0A66C2]', bg: 'bg-[#0A66C2]/10' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/10' },
  { id: 'facebook', name: 'Facebook', icon: Globe, color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10' },
]

const SCHEDULED_POSTS = [
  {
    id: '1',
    platform: 'twitter',
    content: "Just launched BrandRocket! 🚀 The all-in-one AI marketing platform for startups. Supercharge your ads, SEO, and social media in one place.\n\n#SaaS #BuildInPublic #Marketing",
    date: 'Today, 2:00 PM',
    status: 'scheduled'
  },
  {
    id: '2',
    platform: 'linkedin',
    content: "We're thrilled to announce our new AI SEO Analyzer tool. We've seen a 300% increase in organic traffic for early beta testers. Read the full case study below.",
    date: 'Tomorrow, 9:00 AM',
    status: 'scheduled'
  },
  {
    id: '3',
    platform: 'instagram',
    content: "Behind the scenes at BrandRocket HQ today! Building the future of marketing automation. 💻✨",
    date: 'May 24, 11:30 AM',
    status: 'draft'
  }
]

export function SocialScheduler() {
  const [content, setContent] = React.useState('')
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(['twitter'])
  const [view, setView] = React.useState<'list' | 'calendar'>('list')
  const [isScheduling, setIsScheduling] = React.useState(false)

  const { complete, isLoading: isGenerating } = useCompletion({
    api: '/api/ai/generate', // Reusing the ad generator API for now as a generic text generator
    onFinish: (result: string) => {
      setContent(result)
      toast.success('Caption generated!')
    },
    onError: () => toast.error('Failed to generate caption.')
  })

  const handleGenerate = async () => {
    if (!selectedPlatforms.length) {
      toast.error('Select at least one platform first')
      return
    }
    await complete(JSON.stringify({
      businessName: 'BrandRocket',
      product: 'Marketing Automation Platform',
      targetAudience: 'Marketers and Founders',
      tone: 'Engaging',
      platform: selectedPlatforms[0],
      goal: 'Engagement'
    }))
  }

  const handleSchedule = () => {
    if (!content) return toast.error('Please write some content first.')
    if (!selectedPlatforms.length) return toast.error('Select a platform.')
    
    setIsScheduling(true)
    setTimeout(() => {
      setIsScheduling(false)
      toast.success('Post scheduled successfully!')
      setContent('')
    }, 1000)
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Composer Section */}
      <div className="xl:col-span-5 space-y-6">
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Composer</h3>
            <Badge variant="outline" className="font-normal text-xs bg-background">Draft</Badge>
          </div>
          
          <CardContent className="p-6 space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Platforms</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                        isSelected 
                          ? cn("border-transparent ring-2 ring-brand ring-offset-1 bg-card shadow-sm", platform.color)
                          : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{platform.name}</span>
                      {isSelected && <CheckCircle2 className="h-3 w-3 ml-1" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-3 relative group">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Post Content</label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-brand hover:text-brand bg-brand/5" onClick={handleGenerate} disabled={isGenerating}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isGenerating ? 'Writing...' : 'AI Writer'}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => setContent(c => c + ' #marketing #growth')}>
                    <Hash className="h-3 w-3 mr-1" />
                    Hashtags
                  </Button>
                </div>
              </div>
              
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                className="min-h-[160px] resize-none text-base p-4 bg-muted/10 border-border focus-visible:ring-brand"
              />
              
              <div className="absolute bottom-3 right-3 text-xs font-medium text-muted-foreground flex gap-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                <span>{content.length} chars</span>
              </div>
            </div>

            {/* Media Attachment */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer group">
              <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-5 w-5" />
              </div>
              <p className="font-medium text-sm">Add Media</p>
              <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to upload</p>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t p-4 flex gap-3">
            <Button variant="outline" className="w-1/3">
              Save Draft
            </Button>
            <Button 
              className="w-2/3 bg-brand text-brand-foreground hover:bg-brand/90" 
              onClick={handleSchedule}
              disabled={isScheduling || !content}
            >
              {isScheduling ? 'Scheduling...' : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Scheduler View Section */}
      <div className="xl:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')} className="w-fit">
            <TabsList className="grid grid-cols-2 h-9 w-[200px]">
              <TabsTrigger value="list" className="text-xs"><List className="h-3 w-3 mr-2" /> List</TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs"><CalendarIcon className="h-3 w-3 mr-2" /> Calendar</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm font-medium w-32 text-center">May 2026</span>
            <Button variant="outline" size="sm" className="h-8">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="space-y-4">
            {SCHEDULED_POSTS.map((post) => {
              const platform = PLATFORMS.find(p => p.id === post.platform)
              const Icon = platform?.icon || MessageCircle

              return (
                <Card key={post.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex gap-4">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", platform?.bg, platform?.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={cn("text-xs font-normal border", 
                            post.status === 'scheduled' ? "bg-brand/10 text-brand border-brand/20" : "bg-muted text-muted-foreground border-border"
                          )}>
                            {post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.date}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Edit</Button>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-border shadow-sm p-6 flex flex-col items-center justify-center min-h-[500px] text-center bg-muted/10">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">Calendar View</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              This interactive calendar view shows a monthly grid of all your scheduled posts.
            </p>
            <Badge className="mt-4 bg-brand/10 text-brand hover:bg-brand/20 border-brand/20 shadow-none">Available in next sprint</Badge>
          </Card>
        )}
      </div>

    </div>
  )
}
