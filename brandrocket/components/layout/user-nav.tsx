'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useSidebarStore } from "@/stores/sidebar-store"
import { LogOut, Settings, User } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
  )

  const handleLogout = async () => {
    // 1. Sign out from Supabase
    await supabase.auth.signOut()

    // 2. Clear local state
    useWorkspaceStore.setState({ currentWorkspace: null, workspaces: [] })
    
    // 3. Clear demo_session cookie if present
    document.cookie = 'demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    // 4. Redirect to /
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              Manage your profile
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
