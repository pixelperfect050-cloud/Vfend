"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Calendar,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/reminders", label: "Reminders", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = React.useState(false);
  const [notifications] = React.useState(4);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-5 border-b border-border", collapsed && "px-3")}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  CAFlow AI
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.label === "Reminders" && notifications > 0 && (
                <Badge variant="destructive" size="sm" className="ml-auto">{notifications}</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className={cn("p-3 border-t border-border", collapsed && "px-2")}>
        <Dropdown
          trigger={
            <button className={cn("flex items-center gap-3 w-full rounded-xl p-2 hover:bg-muted transition-colors", collapsed && "justify-center")}>
              <Avatar size="sm" fallback={user?.name?.[0] || "U"} />
              {!collapsed && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
                </div>
              )}
            </button>
          }
          align="left"
        >
          <DropdownItem icon={<Users className="h-4 w-4" />}>My Profile</DropdownItem>
          <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem icon={<LogOut className="h-4 w-4" />} destructive onClick={logout}>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
