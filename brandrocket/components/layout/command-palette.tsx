'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, FileText, Megaphone, Bot, BarChart3, Settings, CreditCard, Users, Sparkles } from 'lucide-react'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from '@/components/ui/command'

const COMMANDS = [
  {
    id: 'create',
    label: 'Create New',
    icon: Plus,
    items: [
      { id: 'campaign', label: 'New Campaign', shortcut: 'C', action: '/dashboard/campaign-builder' },
      { id: 'blog', label: 'Write Blog Post', shortcut: 'B', action: '/dashboard/blog' },
      { id: 'ad', label: 'Generate Ad', shortcut: 'A', action: '/dashboard/ads' },
      { id: 'seo', label: 'SEO Analysis', shortcut: 'S', action: '/dashboard/seo' },
    ],
  },
  {
    id: 'navigate',
    label: 'Go to',
    icon: Search,
    items: [
      { id: 'dashboard', label: 'Dashboard', shortcut: 'G D', action: '/dashboard' },
      { id: 'intelligence', label: 'Intelligence', shortcut: 'G I', action: '/dashboard/intelligence' },
      { id: 'social', label: 'Social Media', shortcut: 'G S', action: '/dashboard/social' },
      { id: 'assistant', label: 'AI Assistant', shortcut: 'G A', action: '/dashboard/assistant' },
      { id: 'templates', label: 'Templates', shortcut: 'G T', action: '/dashboard/templates' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    items: [
      { id: 'billing', label: 'Billing', shortcut: 'S B', action: '/dashboard/settings/billing' },
      { id: 'team', label: 'Team', shortcut: 'S T', action: '/dashboard/settings/team' },
    ],
  },
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (action: string) => {
    setOpen(false)
    router.push(action)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-muted-foreground bg-muted/50 hover:bg-muted/80 rounded-md px-3 py-1.5 text-sm border border-border/50 transition-all w-64 lg:w-80 cursor-text"
      >
        <Search className="h-4 w-4 mr-2 opacity-50" />
        <span className="text-muted-foreground/70">Search commands...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-sans text-[10px] font-medium text-muted-foreground opacity-100 shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {COMMANDS.map((group) => (
            <CommandGroup key={group.id} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.action)}
                  className="cursor-pointer"
                >
                  <group.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}