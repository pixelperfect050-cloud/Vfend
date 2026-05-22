'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Sparkles, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { completeOnboarding } from './actions'

export default function OnboardingPage() {
  const startDemo = completeOnboarding.bind(null, true, '/dashboard')
  const startFresh = completeOnboarding.bind(null, false, '/launch')
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Left column: Welcome message */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Welcome to the future of growth
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Meet your new <br className="hidden md:block" />
            <span className="text-brand">AI Growth Team</span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            BrandRocket isn't just a marketing tool. It's an autonomous team of AI agents that plans, executes, and optimizes your campaigns 24/7.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <form action={startDemo}>
              <Button size="lg" type="submit" className="w-full sm:w-auto h-14 px-8 bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/20 transition-all hover:scale-105 gap-2 text-base">
                <Rocket className="w-5 h-5" /> Explore Demo Workspace
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Right column: Options */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border rounded-2xl p-6 md:p-8 shadow-xl space-y-6"
        >
          <h3 className="text-xl font-semibold border-b pb-4">How would you like to start?</h3>
          
          <div className="space-y-4">
            {/* Option 1: Demo */}
            <form action={startDemo} className="block">
              <button type="submit" className="w-full text-left group relative p-5 rounded-xl border-2 border-brand bg-brand/5 hover:bg-brand/10 transition-colors cursor-pointer overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors -mr-10 -mt-10" />
                <div className="flex items-start gap-4">
                  <div className="bg-brand text-primary-foreground p-3 rounded-lg shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      Explore Demo Workspace
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-brand text-primary-foreground px-2 py-0.5 rounded-full">Recommended</span>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 pr-4">
                      See BrandRocket in action with pre-populated campaigns, AI intelligence feeds, and live analytics.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand self-center group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>

            {/* Option 2: Fresh */}
            <form action={startFresh} className="block">
              <button type="submit" className="w-full text-left group p-5 rounded-xl border-2 border-border hover:border-brand/50 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-foreground">Start Fresh Workspace</h4>
                    <p className="text-sm text-muted-foreground mt-1 pr-4">
                      Skip the demo and immediately launch your own autonomous AI marketing campaign.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground self-center group-hover:translate-x-1 transition-transform group-hover:text-brand" />
                </div>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
