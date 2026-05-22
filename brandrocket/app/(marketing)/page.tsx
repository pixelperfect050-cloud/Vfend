import React from 'react'
import { WaitlistForm } from '@/components/marketing/waitlist-form'
import { AgentOrbital } from '@/components/landing/agent-orbital'
import { BrandLogo } from '@/components/ui/brand-logo'
import { Sparkles, MessageSquare, Zap, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BrandRocket — Your Autonomous AI Growth Team',
  description: 'Brief your goals once. BrandRocket coordinates AI agents that plan campaigns, generate content, execute workflows, and continuously optimize growth.',
}

const storytellingSteps = [
  {
    step: '01',
    title: 'Brief the Team',
    description: 'Describe your business and goals. That\'s all your AI team needs to get started.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'Watch the Strategy Form',
    description: 'AI agents collaborate to build a comprehensive growth plan tailored to your objectives.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Launch Autonomous Workflows',
    description: 'Campaigns, content, SEO, and optimization execute together seamlessly.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Grow With Intelligence',
    description: 'Receive recommendations, insights, and continuous improvements automatically.',
    icon: Sparkles,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-brand/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-foreground">
              <BrandLogo className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">BrandRocket</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#how-it-works" className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/login" className="text-sm font-medium text-brand hover:text-brand/80 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ================================================================
          HERO SECTION — Emotion-first, autonomous positioning
          ================================================================ */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand/8 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left — Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-8 border border-brand/20 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                </span>
                Now Assembling AI Growth Teams
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                Your Autonomous AI Growth Team.
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
                Brief your goals once. BrandRocket coordinates AI agents that plan campaigns, generate content, execute workflows, and continuously optimize growth.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                <Link href="#waitlist" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand text-brand-foreground font-semibold hover:bg-brand/90 transition-colors shadow-sm text-center">
                  Launch Your First Campaign
                </Link>
                <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors shadow-sm text-center flex items-center justify-center gap-2">
                  Explore Demo Workspace <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — Orbital visualization */}
            <div className="flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <AgentOrbital />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          STORYTELLING SECTION — The ONE idea
          ================================================================ */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
              You brief the AI team.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">
                BrandRocket orchestrates growth.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An intelligent operating system that replaces fragmented tools with autonomous collaboration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storytellingSteps.map((item, i) => (
              <div key={item.step} className="relative group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.step}. {item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CINEMATIC CTA
          ================================================================ */}
      <section id="waitlist" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/8 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-8 border border-brand/20">
            <Sparkles className="w-4 h-4" />
            Early Access
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Your AI Growth Team is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">
              standing by.
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
            Join the waitlist and be among the first to have an autonomous AI growth operating system working alongside you.
          </p>

          <WaitlistForm className="max-w-md mx-auto" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <BrandLogo className="h-5 w-5" />
            <span className="font-semibold">BrandRocket</span>
            <span className="text-muted-foreground ml-1">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Manifesto</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
