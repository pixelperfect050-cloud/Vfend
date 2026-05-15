"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Search, Bell, Plus, Menu, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  description?: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, description, onMenuClick, actions }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const notifications = [
    { id: 1, title: "Document Uploaded", message: "Tech Solutions uploaded GSTR-3B", time: "2 min ago", unread: true },
    { id: 2, title: "Task Due Tomorrow", message: "GSTR-1 filing for Ramesh Industries", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment Received", message: "₹35,000 from Tech Solutions", time: "3 hours ago", unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          
          {title && (
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("hidden md:flex items-center gap-2 transition-all duration-300", searchOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden")}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Dropdown
            trigger={
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            }
          >
            <div className="px-3 py-2 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            {notifications.map((notif) => (
              <DropdownItem key={notif.id}>
                <div className="flex items-start gap-3 w-full">
                  <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", notif.unread ? "bg-primary" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{notif.time}</p>
                  </div>
                </div>
              </DropdownItem>
            ))}
            <div className="px-3 py-2 border-t border-border">
              <button className="text-sm text-primary hover:underline w-full text-center">View all notifications</button>
            </div>
          </Dropdown>

          {user?.role !== "client" && (
            <Link href="/clients?add=true">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} className="hidden sm:flex">
                Add Client
              </Button>
              <Button size="icon" className="sm:hidden">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors">
                <Avatar size="sm" fallback={user?.name?.[0] || "U"} />
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownItem icon={<User className="h-4 w-4" />}>My Profile</DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />} onClick={() => router.push("/settings")}>Settings</DropdownItem>
            <DropdownItem divider />
            <DropdownItem icon={<LogOut className="h-4 w-4" />} destructive onClick={() => { logout(); router.push("/login"); }}>
              Sign Out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}


