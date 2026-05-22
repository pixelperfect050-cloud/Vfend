'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'

const SETTINGS_NAV = [
  { label: 'Profile', href: '/dashboard/settings' },
  { label: 'Team & Workspaces', href: '/dashboard/settings/team' },
  { label: 'Billing & Credits', href: '/dashboard/settings/billing' },
  { label: 'Integrations', href: '/dashboard/settings/integrations' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Settings" 
        description="Manage your account, workspaces, and billing preferences." 
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {SETTINGS_NAV.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  pathname === item.href 
                    ? "bg-brand/10 text-brand" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
