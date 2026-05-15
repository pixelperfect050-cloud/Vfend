"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Users, FileText, CheckSquare, BarChart3, Settings, Plus, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.4 }}
                  />
                )}
              </div>
              <span className={cn("text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function FloatingActionButton() {
  return (
    <Link href="/dashboard/clients?add=true">
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30 flex items-center justify-center lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </Link>
  );
}
