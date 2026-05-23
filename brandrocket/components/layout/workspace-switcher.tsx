'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus, Settings, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useWorkspaceStore, Workspace } from '@/stores/workspace-store'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { LogOut } from 'lucide-react'

const mockWorkspaces: Workspace[] = [
  { id: '1', name: 'Personal Workspace', slug: 'personal', createdAt: new Date().toISOString() },
  { id: '2', name: 'Acme Corp', slug: 'acme-corp', createdAt: new Date().toISOString() },
  { id: '3', name: 'Startup Inc', slug: 'startup-inc', createdAt: new Date().toISOString() },
]

const planColors: Record<string, string> = {
  'Personal Workspace': 'bg-muted text-muted-foreground',
  'Acme Corp': 'bg-brand/10 text-brand',
  'Startup Inc': 'bg-purple-500/10 text-purple-500',
}

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const router = useRouter()
  const { currentWorkspace, setWorkspace, workspaces } = useWorkspaceStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    useWorkspaceStore.setState({ currentWorkspace: null, workspaces: [] })
    document.cookie = 'demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
    router.refresh()
  }

  const activeWorkspace = currentWorkspace || mockWorkspaces[1]
  const allWorkspaces = workspaces.length > 0 ? workspaces : mockWorkspaces

  const handleWorkspaceSwitch = (workspace: Workspace) => {
    setIsLoading(true)
    setOpen(false)
    setWorkspace(workspace)
    setTimeout(() => setIsLoading(false), 300)
  }

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const getPlanLabel = (name: string) => name === 'Personal Workspace' ? 'Free' : name === 'Acme Corp' ? 'Pro' : 'Enterprise'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          disabled={isLoading}
          className={cn(
            "w-full flex items-center gap-3 p-2 h-auto hover:bg-muted border border-transparent hover:border-border transition-all relative overflow-hidden",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center transition-opacity">
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
            </div>
          )}
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className={cn("h-8 w-8 rounded-md shrink-0 transition-transform", isLoading && "scale-75")}>
              <AvatarFallback className={cn("rounded-md font-medium", planColors[activeWorkspace.name] || "bg-muted text-muted-foreground")}>
                {getInitials(activeWorkspace.name)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col items-start truncate text-sm">
                <span className="font-semibold truncate w-[130px]">{activeWorkspace.name}</span>
                <span className="text-xs text-muted-foreground">{getPlanLabel(activeWorkspace.name)} Plan</span>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isCollapsed ? "center" : "start"} className="w-[240px]">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
          Workspaces
        </DropdownMenuLabel>
        {allWorkspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => handleWorkspaceSwitch(ws)}
            className="flex items-center gap-2 cursor-pointer py-2"
          >
            <Avatar className="h-6 w-6 rounded-md">
              <AvatarFallback className={cn("rounded-md bg-muted text-xs font-medium", planColors[ws.name])}>
                {getInitials(ws.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 truncate">
              <span className="font-medium text-sm truncate">{ws.name}</span>
            </div>
            {activeWorkspace.id === ws.id && (
              <Check className="h-4 w-4 text-brand ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          <span>Create Workspace</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Workspace Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
