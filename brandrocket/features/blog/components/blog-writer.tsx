'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCompletion } from '@ai-sdk/react'
import { Loader2, PenTool, Copy, Save, Check } from 'lucide-react'
import type { z } from 'zod'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

import { blogWriterSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type BlogFormValues = z.infer<typeof blogWriterSchema>

export function BlogWriter() {
  const [isCopied, setIsCopied] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogWriterSchema),
    defaultValues: {
      keyword: '',
      tone: 'professional',
      length: 'medium',
      outline: ''
    }
  })

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/generate',
    onError: (err: Error) => {
      toast.error('Failed to generate blog post.')
      console.error(err)
    }
  })

  const onSubmit = async (data: BlogFormValues) => {
    await complete(JSON.stringify(data))
  }

  const handleCopy = async () => {
    if (!completion) return
    try {
      await navigator.clipboard.writeText(completion)
      setIsCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Failed to copy text')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Configuration Form */}
      <div className="lg:col-span-4 h-fit sticky top-20">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Blog Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Main Keyword or Topic</Label>
                <Input
                  id="keyword"
                  placeholder="e.g. The Future of SaaS Marketing"
                  {...register('keyword')}
                  disabled={isLoading}
                />
                {errors.keyword && (
                  <p className="text-sm text-destructive">{errors.keyword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tone of Voice</Label>
                <Controller
                  name="tone"
                  control={control}
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="storytelling">Storytelling</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Length</Label>
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (~500 words)</SelectItem>
                        <SelectItem value="medium">Medium (~1000 words)</SelectItem>
                        <SelectItem value="long">Long (1500+ words)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outline">Outline / Key Points (Optional)</Label>
                <Textarea
                  id="outline"
                  placeholder="List specific points you want the AI to cover..."
                  className="resize-none h-32"
                  {...register('outline')}
                  disabled={isLoading}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-6">
            <Button 
              form="blog-form"
              type="submit" 
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PenTool className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Writing...' : 'Generate Blog Post'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Editor / Output Area */}
      <div className="lg:col-span-8">
        <Card className={cn(
          "border-border shadow-sm min-h-[600px] flex flex-col transition-all duration-300",
          isLoading && "border-brand/50 ring-1 ring-brand/20 shadow-md"
        )}>
          <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Editor</span>
              {isLoading && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!completion || isLoading}>
                {isCopied ? <Check className="mr-2 h-4 w-4 text-success" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy
              </Button>
              <Button variant="default" size="sm" disabled={!completion || isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 overflow-y-auto prose prose-brand max-w-none dark:prose-invert">
            {completion ? (
              <ReactMarkdown>{completion}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground mt-20">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PenTool className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-foreground text-lg">Blank Canvas</p>
                <p className="text-sm max-w-sm mt-2">
                  Configure your blog settings on the left and hit generate to watch the AI write your next masterpiece.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
