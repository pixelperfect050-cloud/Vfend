'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, ChevronLeft, ChevronRight, Settings, LogOut, ChevronDown } from 'lucide-react'
import * as Icons from 'lucide-react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar-store'
import { DASHBOARD_NAV } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { WorkspaceSwitcher } from './workspace-switcher'

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggle } = useSidebarStore()

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside 
      className={cn(
        "bg-card border-r flex flex-col transition-all duration-300 z-40 h-full",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="h-14 flex items-center px-4 border-b justify-between shrink-0 bg-background/50 backdrop-blur-sm">
        <Link href="/dashboard" className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
          <div className="text-foreground">
            <BrandLogo className="h-6 w-6" />
          </div>
          {!isCollapsed && <span className="font-bold tracking-tight text-foreground">BrandRocket</span>}
        </Link>
        {!isCollapsed && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={toggle}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="py-2 flex justify-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={toggle}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
        <div className="px-3 mb-2">
          {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modules</p>}
        </div>
        {DASHBOARD_NAV.map((item) => {
          const IconComponent = (Icons as any)[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <div 
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 relative group",
                  isActive 
                    ? "bg-brand/10 text-brand font-medium shadow-sm ring-1 ring-brand/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-brand rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
                {IconComponent && <IconComponent className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "scale-110" : "")} />}
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-14 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 group-hover:opacity-100 shadow-md border pointer-events-none z-50 whitespace-nowrap transition-opacity">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t bg-muted/10 shrink-0">
        <WorkspaceSwitcher isCollapsed={isCollapsed} />
        
        {!isCollapsed && (
          <div className="mt-4 flex gap-2 w-full">
            <Button variant="outline" size="sm" className="w-full text-xs font-medium" asChild>
              <Link href="/dashboard/settings"><Settings className="mr-2 h-3 w-3" /> Settings</Link>
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
        {isCollapsed && (
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
