'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { NotificationsPopover } from '@/components/layout/notifications-popover'
import { CommandPalette } from '@/components/layout/command-palette'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useSidebarStore } from '@/stores/sidebar-store'
import { Menu } from 'lucide-react'
import { DemoBanner } from '@/components/shared/demo-banner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarStore()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar className="w-full flex" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 lg:px-6 bg-card/80 backdrop-blur-md shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:block">
              <CommandPalette />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex h-8 bg-brand/5 text-brand border-brand/20 hover:bg-brand/10 transition-colors mr-2">
              Upgrade
            </Button>
            <NotificationsPopover />
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/10 selection:bg-brand/20">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <DemoBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
