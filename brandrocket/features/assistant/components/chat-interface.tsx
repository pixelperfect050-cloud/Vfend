'use client'
// @ts-nocheck

import * as React from 'react'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import { Bot, Send, User, Sparkles, StopCircle, RefreshCcw, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  "Brainstorm 5 viral TikTok ideas for a SaaS launch.",
  "Write a cold email to pitch my marketing agency.",
  "How can I improve my website's local SEO?",
  "Analyze the tone of Apple's recent ad campaigns."
]

export function ChatInterface() {
  const { messages, isLoading, stop, append } = useChat({
    api: '/api/ai/chat',
    onError: (err: Error) => {
      toast.error('Failed to send message.')
      console.error(err)
    }
  } as any) as any
  
  const [input, setInput] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    append({ role: 'user', content: input })
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
        handleSubmit(e)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    append({ role: 'user', content: suggestion })
  }

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Message copied')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] border border-border shadow-sm bg-card rounded-xl overflow-hidden relative">
      
      {/* Header */}
      <div className="h-14 border-b bg-muted/20 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-brand/10 p-1.5 rounded-md">
            <Bot className="h-5 w-5 text-brand" />
          </div>
          <span className="font-semibold text-sm">BrandRocket Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => window.location.reload()}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-2">How can I help you grow today?</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-8">
              I&apos;m your expert marketing strategist. Ask me to write copy, brainstorm ideas, or analyze campaigns.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-brand/30 transition-all text-sm group relative overflow-hidden"
                >
                  <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">&quot;{suggestion}&quot;</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((message: any) => {
              const isAssistant = message.role === 'assistant'
              
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex gap-4 group animate-in slide-in-from-bottom-2",
                    !isAssistant ? "flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    isAssistant ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
                  )}>
                    {isAssistant ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    !isAssistant ? "items-end" : "items-start"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {isAssistant ? 'BrandRocket' : 'You'}
                      </span>
                    </div>
                    
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm",
                      !isAssistant 
                        ? "bg-brand text-brand-foreground rounded-tr-sm" 
                        : "bg-muted/40 border border-border rounded-tl-sm prose prose-sm dark:prose-invert max-w-none"
                    )}>
                      {isAssistant ? (
                        <ReactMarkdown>{(message as any).content}</ReactMarkdown>
                      ) : (
                        <span className="whitespace-pre-wrap">{(message as any).content}</span>
                      )}
                    </div>
                    
                    {/* Action Bar (Assistant only) */}
                    {isAssistant && (
                      <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(message.id, (message as any).content)}
                        >
                          {copiedId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            {/* Loading / Typing Indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="px-4 py-4 rounded-2xl bg-muted/40 border border-border rounded-tl-sm flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t shrink-0">
        <form 
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto flex items-end gap-2 bg-muted/30 border border-border rounded-2xl p-2 focus-within:ring-1 focus-within:ring-brand focus-within:border-brand transition-all"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Press Enter to send, Shift+Enter for new line)"
            className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 px-3 py-3 w-full scrollbar-hide text-sm"
            rows={1}
          />
          <div className="flex flex-col justify-end pb-1 shrink-0">
            {isLoading ? (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={stop}
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim()}
                className={cn(
                  "h-9 w-9 rounded-xl transition-all",
                  input.trim() ? "bg-brand text-brand-foreground hover:bg-brand/90" : "bg-muted text-muted-foreground"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-muted-foreground">BrandRocket AI can make mistakes. Consider verifying important information.</span>
        </div>
      </div>
    </div>
  )
}
