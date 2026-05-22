'use client'

import * as React from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown, RefreshCcw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface AdOutputCardProps {
  content: string
  platform: string
  isStreaming: boolean
}

export function AdOutputCard({ content, platform, isStreaming }: AdOutputCardProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Failed to copy text')
    }
  }

  const handleSave = () => {
    // In a real app, this would save to the Supabase database
    toast.success('Draft saved successfully')
  }

  return (
    <Card className={cn(
      "border-border shadow-sm flex flex-col h-full transition-all duration-300",
      isStreaming && "border-brand/50 ring-1 ring-brand/20 shadow-md"
    )}>
      <CardHeader className="p-4 md:p-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">
            {platform} Ad
          </Badge>
          {isStreaming && (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!content || isStreaming}>
            {isCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleSave} disabled={!content || isStreaming}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px] prose prose-sm dark:prose-invert max-w-none">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <RefreshCcw className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-foreground">Awaiting input</p>
            <p className="text-sm max-w-xs mt-1">Fill out the form on the left to generate highly converting ad copy.</p>
          </div>
        )}
      </CardContent>
      {content && !isStreaming && (
        <CardFooter className="p-4 border-t bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>AI generated content may require human review.</span>
          <div className="flex items-center gap-1">
            <span className="mr-2">Helpful?</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
