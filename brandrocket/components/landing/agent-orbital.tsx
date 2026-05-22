'use client'

import React from 'react'
import { Search, Target, PenTool, BarChart3, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'

const agents = [
  { 
    id: 'seo', 
    name: 'SEO Strategist', 
    icon: Search, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    glowColor: 'shadow-emerald-500/20',
    delay: '0s',
  },
  { 
    id: 'ads', 
    name: 'Ad Optimizer', 
    icon: Target, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    glowColor: 'shadow-blue-500/20',
    delay: '-5s',
  },
  { 
    id: 'content', 
    name: 'Content Writer', 
    icon: PenTool, 
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
    glowColor: 'shadow-violet-500/20',
    delay: '-10s',
  },
  { 
    id: 'analytics', 
    name: 'Growth Analyst', 
    icon: BarChart3, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    glowColor: 'shadow-amber-500/20',
    delay: '-15s',
  },
]

interface AgentOrbitalProps {
  className?: string
}

export function AgentOrbital({ className }: AgentOrbitalProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Desktop: Orbital layout */}
      <div className="hidden md:flex items-center justify-center" style={{ height: '340px' }}>
        {/* Orbital ring */}
        <div 
          className="absolute rounded-full border border-dashed border-brand/20 dark:border-brand/15"
          style={{ width: '280px', height: '280px' }}
        />
        {/* Second ring */}
        <div 
          className="absolute rounded-full border border-dashed border-muted-foreground/10"
          style={{ width: '220px', height: '220px' }}
        />

        {/* Connection pulses — SVG lines from center to orbit path */}
        <svg className="absolute" width="280" height="280" viewBox="-140 -140 280 280" style={{ overflow: 'visible' }}>
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 140
            const y = Math.sin(rad) * 140
            return (
              <line 
                key={i}
                x1="0" y1="0" x2={x} y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-brand/10 dark:text-brand/15"
                style={{
                  animation: `connection-pulse 3s ease-in-out ${i * 0.75}s infinite`,
                }}
              />
            )
          })}
        </svg>

        {/* Center command node */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center animate-pulse-glow">
          <Cpu className="w-9 h-9 text-white" />
          {/* Live status indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-success border-2 border-background" />
          </span>
        </div>

        {/* Orbiting agent nodes */}
        {agents.map((agent, i) => {
          const Agent = agent.icon
          return (
            <div
              key={agent.id}
              className="absolute"
              style={{
                ['--orbit-radius' as string]: '140px',
                ['--orbit-duration' as string]: '20s',
                animationDelay: agent.delay,
                animation: `orbit 20s linear infinite`,
              }}
            >
              <div 
                className={cn(
                  'w-12 h-12 rounded-xl border flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-default',
                  agent.bgColor,
                )}
                style={{
                  /* Counter-rotate so icon stays upright */
                  animationDelay: agent.delay,
                  animation: 'none',
                }}
                title={agent.name}
              >
                <Agent className={cn('w-5 h-5', agent.color)} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile: Card layout */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {/* Center node */}
        <div className="col-span-2 flex justify-center mb-2">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center animate-pulse-glow">
            <Cpu className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-success border-2 border-background" />
            </span>
          </div>
        </div>
        
        {agents.map((agent, i) => {
          const Agent = agent.icon
          return (
            <div
              key={agent.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm animate-fade-up',
                agent.bgColor,
              )}
              style={{ animationDelay: `${i * 0.1 + 0.2}s`, opacity: 0 }}
            >
              <Agent className={cn('w-5 h-5 shrink-0', agent.color)} />
              <div>
                <p className="text-sm font-medium text-foreground">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Online</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
