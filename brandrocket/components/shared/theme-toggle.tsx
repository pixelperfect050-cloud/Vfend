'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const themes = ['light', 'dark', 'system'] as const
type ThemeValue = (typeof themes)[number]

const icons: Record<ThemeValue, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const labels: Record<ThemeValue, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const cycle = () => {
    const currentIndex = themes.indexOf(theme as ThemeValue)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Prevent hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = (theme as ThemeValue) ?? 'system'
  const Icon = icons[currentTheme]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 cursor-pointer"
          onClick={cycle}
          aria-label={`Current theme: ${labels[currentTheme]}. Click to switch.`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentTheme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <Icon className="size-4" />
            </motion.span>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        <p className="text-xs">{labels[currentTheme]}</p>
      </TooltipContent>
    </Tooltip>
  )
}
