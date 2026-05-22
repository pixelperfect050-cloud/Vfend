'use client'

import * as React from 'react'
import { Bell, Check, Info, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const mockNotifications = [
  { id: 1, title: 'SEO Analysis Complete', desc: 'Your scan for brandrocket.io is ready.', time: '2m ago', read: false, icon: Sparkles, color: 'text-brand' },
  { id: 2, title: 'Ad Generator', desc: 'Generated 3 Facebook Ads for Acme Corp.', time: '1h ago', read: false, icon: Info, color: 'text-success' },
  { id: 3, title: 'Credit Limit Warning', desc: 'You have used 80% of your AI credits.', time: '2h ago', read: true, icon: Info, color: 'text-warning' },
]

export function NotificationsPopover() {
  const [open, setOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState(mockNotifications)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand ring-2 ring-background"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden shadow-lg border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-auto p-0 text-xs text-brand hover:bg-transparent hover:text-brand/80">
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <Check className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground">You're all caught up!</p>
              <p className="text-xs text-muted-foreground">No new notifications.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = n.icon
                return (
                  <div key={n.id} className={cn("p-4 flex gap-3 group transition-colors hover:bg-muted/30 relative", !n.read && "bg-brand/5 hover:bg-brand/10")}>
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />}
                    <div className={cn("mt-0.5 shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-background border shadow-sm", n.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-sm font-medium text-foreground leading-none mb-1 truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{n.time}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => removeNotification(e, n.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/20">
          <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground">View all notifications</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
