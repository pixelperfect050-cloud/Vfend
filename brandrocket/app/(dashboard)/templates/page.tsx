'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Search, Sparkles, Filter, ExternalLink, Download, Eye, Zap, ArrowRight, Plus } from 'lucide-react'
import { CardTitle } from '@/components/ui/card'

interface Template {
  id: number
  title: string
  category: string
  tags: string[]
  premium: boolean
  usage: number
  description?: string
  content?: string
}

const TEMPLATES: Template[] = [
  { id: 1, title: 'B2B SaaS Product Launch', category: 'Campaigns', tags: ['LinkedIn', 'Email'], premium: true, usage: 1245, description: 'Complete launch campaign for B2B SaaS products', content: '# Product Launch Campaign\n\n## Phase 1: Pre-Launch (Week 1-2)\n- Teaser email sequence\n- LinkedIn thought leadership posts\n- Beta tester outreach\n\n## Phase 2: Launch Week\n- Main announcement email\n- Press release distribution\n- Social media blast\n\n## Phase 3: Post-Launch\n- Case study solicitation\n- Customer testimonial requests\n- Follow-up nurture sequence' },
  { id: 2, title: 'Black Friday Mega Sale', category: 'E-commerce', tags: ['Facebook', 'Instagram'], premium: false, usage: 8932, description: 'High-converting Black Friday campaign', content: '# Black Friday Campaign\n\n## Week Before\n- Sneak peek emails\n- Countdown social posts\n- Retargeting ads\n\n## Black Friday\n- Flash sale emails (3x)\n- Instagram Stories sequence\n- Facebook ad rotation' },
  { id: 3, title: 'Local Restaurant Opening', category: 'Local Business', tags: ['Facebook', 'Local SEO'], premium: false, usage: 456, description: 'Grand opening campaign for local businesses', content: '# Local Business Launch\n\n## Pre-Opening\n- Soft opening invites\n- Local influencer partnerships\n- Google Business optimization\n\n## Opening Week\n- Grand opening event promotion\n- Customer review campaign\n- Local FB group posts' },
  { id: 4, title: 'Ultimate SEO Guide Blog', category: 'Content', tags: ['Blog', 'Long-form'], premium: true, usage: 2100, description: 'Comprehensive SEO content template', content: '# SEO Guide Template\n\n## Structure\n1. Introduction (hook + value proposition)\n2. Problem definition\n3. Solution overview\n4. Detailed sections (H2s)\n5. Action items / Summary\n6. CTA (newsletter/signup)\n\n## SEO Elements\n- Target keyword in title, URL, H1\n- LSI keywords throughout\n- Internal/external links\n- Meta description ready' },
  { id: 5, title: 'Founder Story (Personal Brand)', category: 'Social', tags: ['Twitter', 'LinkedIn'], premium: false, usage: 3421, description: 'Build your personal brand narrative', content: '# Founder Story Framework\n\n## Hook (first 3 lines)\n- Challenge faced\n- Unexpected insight\n\n## Body\n- The journey (struggles + wins)\n- Key learnings\n- Current mission\n\n## CTA\n- Connect invitation\n- Call to action' },
  { id: 6, title: 'Webinar Registration Sequence', category: 'Email', tags: ['Drip Campaign'], premium: true, usage: 890, description: 'Full webinar registration email series', content: '# Webinar Email Sequence\n\n## Email 1: Announcement\n- Value proposition\n- Date/time announcement\n- Registration link\n\n## Email 2: Social Proof\n- Speaker credentials\n- Past results\n- Testimonials\n\n## Email 3: Urgency\n- Limited spots\n- Last chance\n- Bonus offer\n\n## Email 4: Reminder\n- Day-of reminder\n- Calendar links\n- What to expect' },
]

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  
  const categories = ['All', 'Campaigns', 'E-commerce', 'Content', 'Social', 'Email']
  
  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = activeTab === 'All' ? true : t.category === activeTab
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
        <PageHeader 
          title="Template Library" 
          description="High-converting marketing templates crafted by experts. Start your next campaign instantly."
          className="mb-0"
        />
        <Button className="bg-brand text-brand-foreground hover:bg-brand/90 shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Request Template
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-9 bg-muted/30 border-transparent focus-visible:border-brand"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-10">
              {categories.map(c => (
                <TabsTrigger key={c} value={c} className="text-xs px-4">{c}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="border-border shadow-sm hover:shadow-md hover:border-brand/30 transition-all duration-300 group overflow-hidden flex flex-col">
            {/* Mock Thumbnail Area */}
            <div className="h-32 bg-muted/40 relative overflow-hidden flex items-center justify-center border-b">
              {template.premium && (
                <Badge className="absolute top-3 left-3 bg-foreground text-background hover:bg-foreground shadow-none text-[10px] uppercase font-bold tracking-wider px-2">
                  Premium
                </Badge>
              )}
              <div className="absolute right-3 top-3 text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
                <Download className="h-3 w-3 mr-1" />
                {template.usage.toLocaleString()}
              </div>
              <Sparkles className="h-10 w-10 text-muted-foreground/20 group-hover:scale-110 group-hover:text-brand/30 transition-transform duration-500" />
            </div>
            
            <CardHeader className="p-5 pb-3">
              <div className="text-xs font-medium text-brand mb-2">{template.category}</div>
              <CardTitle className="text-lg leading-tight group-hover:text-brand transition-colors">
                {template.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-5 pt-0 flex-1">
              <div className="flex flex-wrap gap-1.5 mt-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-normal bg-muted text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 border-t mt-auto flex items-center gap-2">
              <Button 
                className="flex-1 bg-brand/10 text-brand hover:bg-brand hover:text-brand-foreground transition-colors shadow-none"
                onClick={() => setSelectedTemplate(template)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="icon" className="shrink-0 text-muted-foreground hover:text-brand">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedTemplate.title}</DialogTitle>
                  {selectedTemplate.premium && (
                    <Badge className="bg-foreground text-background">Premium</Badge>
                  )}
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto mt-4">
                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedTemplate.category}</Badge>
                    {selectedTemplate.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedTemplate.content}
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Close</Button>
                <Button className="bg-brand hover:bg-brand/90">
                  <Zap className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
