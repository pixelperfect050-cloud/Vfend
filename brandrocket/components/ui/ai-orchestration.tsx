'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, CircleDashed, Cpu, Sparkles, Terminal, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentStep {
  id: string
  agentName: string
  action: string
  duration: number // ms
  status: 'pending' | 'active' | 'completed'
  icon?: React.ReactNode
}

interface AIOrchestrationProps {
  steps?: Omit<AgentStep, 'status'>[]
  onComplete?: () => void
  className?: string
}

const defaultSteps: Omit<AgentStep, 'status'>[] = [
  { id: '1', agentName: 'Growth Intelligence', action: 'Analyzing market opportunities...', duration: 2500, icon: <Activity className="w-4 h-4" /> },
  { id: '2', agentName: 'SEO Agent', action: 'Discovering high-opportunity keyword clusters...', duration: 3000, icon: <Activity className="w-4 h-4" /> },
  { id: '3', agentName: 'Content Agent', action: 'Drafting multi-channel strategy...', duration: 3500, icon: <Activity className="w-4 h-4" /> },
  { id: '4', agentName: 'Ads Agent', action: 'Generating 3 launch hooks...', duration: 2000, icon: <Activity className="w-4 h-4" /> }
]

export function AIOrchestration({ steps = defaultSteps, onComplete, className }: AIOrchestrationProps) {
  const [internalSteps, setInternalSteps] = useState<AgentStep[]>(
    steps.map(s => ({ ...s, status: 'pending' }))
  )
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= internalSteps.length) {
      setTimeout(() => {
        onComplete?.()
      }, 1000)
      return
    }

    // Set current to active
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternalSteps(prev => 
      prev.map((step, idx) => 
        idx === currentIndex ? { ...step, status: 'active' } : step
      )
    )

    const timer = setTimeout(() => {
      // Set current to completed
      setInternalSteps(prev => 
        prev.map((step, idx) => 
          idx === currentIndex ? { ...step, status: 'completed' } : step
        )
      )
      setCurrentIndex(prev => prev + 1)
    }, internalSteps[currentIndex].duration)

    return () => clearTimeout(timer)
  }, [currentIndex, internalSteps.length, onComplete])

  return (
    <div className={cn("w-full max-w-2xl mx-auto rounded-xl border bg-card/50 p-6 backdrop-blur-sm shadow-sm overflow-x-hidden", className)}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 rounded-lg bg-brand/10 text-brand">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-lg tracking-tight flex items-center gap-2">
            AI Growth Team
            {currentIndex < internalSteps.length && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">Orchestrating campaign strategy</p>
        </div>
      </div>

      <div className="space-y-4">
        {internalSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Timeline line connecting items */}
            {index < internalSteps.length - 1 && (
              <div 
                className={cn(
                  "absolute left-3 top-8 bottom-[-16px] w-[2px] transition-colors duration-500",
                  step.status === 'completed' ? "bg-brand/50" : "bg-muted"
                )} 
              />
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: step.status === 'pending' ? 0.4 : 1, 
                y: 0 
              }}
              className={cn(
                "flex gap-4 p-3 rounded-lg transition-all duration-300",
                step.status === 'active' ? "bg-brand/5 border border-brand/20 shadow-sm" : "bg-transparent border border-transparent"
              )}
            >
              <div className="mt-1 relative z-10 bg-card rounded-full">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-brand" />
                ) : step.status === 'active' ? (
                  <CircleDashed className="w-6 h-6 text-brand animate-spin" />
                ) : (
                  <CircleDashed className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium text-sm",
                    step.status === 'active' ? "text-brand" : "text-foreground"
                  )}>
                    {step.agentName}
                  </span>
                  {step.status === 'active' && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                      Working
                    </span>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  {step.status === 'active' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-muted-foreground mt-1 flex items-center gap-2"
                    >
                      <Terminal className="w-3 h-3" />
                      <span className="typewriter-effect">{step.action}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {step.status === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground mt-1 flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Completed</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      
      {/* Typewriter CSS effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .typewriter-effect {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid transparent;
          animation: typing 2s steps(40, end), blink-caret .75s step-end infinite;
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: currentColor; }
        }
      `}} />
    </div>
  )
}
