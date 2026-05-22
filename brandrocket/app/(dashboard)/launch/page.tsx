'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Rocket, ArrowRight, Target, LayoutTemplate, Sparkles, Globe, PenTool, BarChart3, MessageSquare, Zap, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AIOrchestration } from '@/components/ui/ai-orchestration'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: 'Context' },
  { id: 2, title: 'Channels' },
  { id: 3, title: 'AI Strategy' },
  { id: 4, title: 'Launch' },
]

export default function LaunchCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
  const [goal, setGoal] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(c => c + 1)
  }

  const handleLaunch = () => {
    // In a real app, this would trigger the actual backend workflow
    router.push('/dashboard')
  }

  const channelOptions = [
    { id: 'seo', name: 'SEO Content', icon: <Globe className="w-5 h-5" />, desc: 'Articles & Landing Pages', recommended: true },
    { id: 'ads', name: 'Paid Ads', icon: <Target className="w-5 h-5" />, desc: 'Google, Meta, LinkedIn', recommended: true },
    { id: 'social', name: 'Social Media', icon: <MessageSquare className="w-5 h-5" />, desc: 'Twitter, LinkedIn posts', recommended: false },
    { id: 'email', name: 'Email Marketing', icon: <LayoutTemplate className="w-5 h-5" />, desc: 'Newsletters & Sequences', recommended: false },
  ]

  const suggestedGoals = [
    "Launch our new SaaS product",
    "Increase trial signups by 20%",
    "Promote our upcoming webinar",
    "Dominate local SEO for our store"
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header & Stepper */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Launch Campaign</h1>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand transition-all duration-500 -z-10" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => {
            const isCompleted = step.id < currentStep
            const isActive = step.id === currentStep
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-4">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                    isCompleted ? "bg-brand text-primary-foreground" : 
                    isActive ? "border-2 border-brand text-brand" : 
                    "border-2 border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CONTEXT */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">What are we helping you grow today?</h2>
                <p className="text-muted-foreground">Tell your AI growth team what you want to achieve.</p>
              </div>

              <div className="space-y-4">
                <Input 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Launch a new feature to existing users..." 
                  className="h-14 text-lg"
                  autoFocus
                />
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-sm text-muted-foreground mr-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-brand" /> Suggestions:
                  </span>
                  {suggestedGoals.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setGoal(suggestion)}
                      className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors font-medium border border-transparent hover:border-border"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <Button onClick={handleNext} disabled={!goal.trim()} size="lg" className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHANNELS */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Select your target channels</h2>
                <p className="text-muted-foreground">AI has pre-selected the best channels based on your goal.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channelOptions.map((channel) => {
                  const isSelected = selectedChannels.includes(channel.id) || (selectedChannels.length === 0 && channel.recommended)
                  
                  return (
                    <div 
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannels(prev => 
                          prev.includes(channel.id) 
                            ? prev.filter(c => c !== channel.id)
                            : [...prev, channel.id]
                        )
                      }}
                      className={cn(
                        "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 hover:shadow-sm",
                        isSelected ? "border-brand bg-brand/5" : "border-border hover:border-brand/50 bg-card"
                      )}
                    >
                      {channel.recommended && (
                        <div className="absolute -top-3 right-4 bg-brand text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" /> AI Recommended
                        </div>
                      )}
                      
                      <div className={cn(
                        "p-3 rounded-lg",
                        isSelected ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {channel.icon}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{channel.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between pt-8">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button onClick={handleNext} size="lg" className="gap-2">
                  Generate Strategy <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AI STRATEGY (MAGIC MOMENT) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="py-12"
            >
              <AIOrchestration onComplete={handleNext} />
            </motion.div>
          )}

          {/* STEP 4: LAUNCH */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold">Strategy Ready</h2>
                <p className="text-muted-foreground text-lg">
                  Your AI growth team has orchestrated a complete multi-channel campaign. Review the automated tasks below and authorize the launch.
                </p>
              </div>

              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand" /> Autonomous Execution Queue
                </h3>
                
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                  
                  {/* Item 1 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold text-sm">SEO Keyword Expansion</h4>
                      <p className="text-xs text-muted-foreground mt-1">Publishing 5 optimized clusters to your blog targeting long-tail variations.</p>
                    </div>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold text-sm">Meta Ads Launch</h4>
                      <p className="text-xs text-muted-foreground mt-1">Deploying 3 variations of A/B tested ad copy with optimized bidding strategies.</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-12 bg-brand text-brand-foreground hover:bg-brand/90 gap-2 shadow-lg shadow-brand/20 transition-all hover:scale-105" onClick={handleLaunch}>
                  <Rocket className="w-5 h-5 animate-pulse" />
                  Launch Autonomous Workflow
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
