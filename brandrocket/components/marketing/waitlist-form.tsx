'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, ArrowRight, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import posthog from 'posthog-js'

interface WaitlistFormProps {
  className?: string
  variant?: 'default' | 'compact'
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function WaitlistForm({ className, variant = 'default' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [position, setPosition] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiStyles, setConfettiStyles] = useState<React.CSSProperties[]>([])

  useEffect(() => {
    if (showConfetti) {
      setConfettiStyles(
        Array.from({ length: 12 }).map((_, i) => ({
          left: `${50 + (Math.random() - 0.5) * 60}%`,
          top: `${30 + (Math.random() - 0.5) * 40}%`,
          backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'][i % 5],
          animation: `confetti-fall ${1.5 + Math.random()}s ease-out ${i * 0.08}s forwards`,
          opacity: 0,
          animationFillMode: 'forwards',
          animationDelay: `${i * 0.08}s`,
        }))
      )
    } else {
      setConfettiStyles([])
    }
  }, [showConfetti])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setPosition(data.position || 1249)
        setStatus('success')
        setShowConfetti(true)
        posthog.capture('waitlist_conversion', { position: data.position })
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        const errorData = await res.json().catch(() => null)
        setStatus('idle')
        toast.error(errorData?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('idle')
      toast.error('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Confetti particles */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confettiStyles.map((style, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={style}
                  />
                ))}
              </div>
            )}

            <div className="bg-brand/5 border-2 border-brand/20 p-8 sm:p-10 rounded-2xl flex flex-col items-center text-center space-y-5 backdrop-blur-sm">
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-18 h-18 bg-gradient-to-br from-brand to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-brand/25"
                style={{ width: '72px', height: '72px' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                >
                  <CheckCircle2 className="w-9 h-9 text-white" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 justify-center">
                  <Zap className="w-6 h-6 text-brand" />
                  AI Team Activated
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                  You&apos;re in position{' '}
                  <span className="text-brand font-bold tabular-nums">
                    #<AnimatedCounter target={position} />
                  </span>
                  . We&apos;ll notify you when your growth team is ready.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 text-xs text-muted-foreground pt-2"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span>Check your inbox for a message from your AI team</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your work email..."
                  className="h-14 pl-5 text-lg rounded-xl border-2 focus-visible:ring-brand focus-visible:border-brand transition-colors bg-background/50 backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  id="waitlist-email-input"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                disabled={status === 'loading'}
                className="h-14 px-8 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 gap-2 font-semibold text-base hover-scale"
                id="waitlist-submit-btn"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Get Early Access <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium pt-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
              </span>
              <span>1,248+ growth teams already joined</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
