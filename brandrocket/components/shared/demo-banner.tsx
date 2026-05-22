'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useDemoMode } from '@/hooks/use-demo-mode'

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}

export function DemoBanner() {
  const { isDemoMode, isLoaded } = useDemoMode()
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isLoaded) return null

  const show = isDemoMode && isVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 24 }}
          exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
          className="bg-brand/10 border border-brand/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="bg-brand text-primary-foreground p-2 rounded-lg shrink-0">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-brand">Exploring Demo Workspace</h3>
              <p className="text-sm text-brand/80">You are viewing a live simulation of an autonomous AI growth team in action.</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="border-brand/20 text-brand hover:bg-brand/10" onClick={() => setIsVisible(false)}>
              Dismiss
            </Button>
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90 gap-2">
              <Copy className="w-4 h-4" /> Clone Workspace
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
