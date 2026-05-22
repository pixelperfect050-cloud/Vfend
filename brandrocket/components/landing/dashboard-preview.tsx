"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  FileText,
  Home,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Sparkles, label: "AI Studio" },
  { icon: FileText, label: "Content" },
  { icon: Search, label: "SEO" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  {
    title: "Total Campaigns",
    value: "1,284",
    change: "+12.5%",
    positive: true,
  },
  {
    title: "AI Credits Used",
    value: "8,420",
    change: "+24.1%",
    positive: true,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.8%",
    positive: true,
  },
  {
    title: "Active Users",
    value: "342",
    change: "-2.1%",
    positive: false,
  },
];

const chartBars = [35, 52, 48, 72, 65, 85, 78, 92, 68, 88, 95, 82];

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium text-brand">Dashboard</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your command center
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Everything you need to manage your marketing — campaigns, content,
          analytics — in one beautiful interface.
        </p>
      </motion.div>

      {/* Browser frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
        className="mt-14"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-400/60" />
              <div className="size-2.5 rounded-full bg-yellow-400/60" />
              <div className="size-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="ml-3 flex-1">
              <div className="mx-auto max-w-sm rounded-md bg-background px-3 py-1 text-center text-xs text-muted-foreground">
                app.brandrocket.io/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex min-h-[420px]">
            {/* Sidebar */}
            <div className="hidden w-48 shrink-0 border-r border-border bg-muted/30 p-3 md:block">
              <div className="mb-4 flex items-center gap-2 px-2 py-1">
                <div className="flex size-6 items-center justify-center rounded-md bg-brand">
                  <Sparkles className="size-3.5 text-brand-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  BrandRocket
                </span>
              </div>
              <nav className="space-y-0.5">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      item.active
                        ? "bg-brand/10 text-brand"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 md:p-6">
              {/* Welcome bar */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Good morning, Sarah
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Here&apos;s what&apos;s happening with your campaigns
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  <Users className="size-3" />
                  Pro Plan
                </Badge>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.title} size="sm" className="shadow-none">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {stat.value}
                        </span>
                        <span
                          className={`flex items-center text-[10px] font-medium ${
                            stat.positive
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {stat.positive && (
                            <ArrowUpRight className="mr-0.5 size-2.5" />
                          )}
                          {stat.change}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart area */}
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    Campaign Performance
                  </span>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="size-3" />
                    +18.2%
                  </div>
                </div>
                <div className="flex h-28 items-end gap-1.5">
                  {chartBars.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-brand/20 transition-colors hover:bg-brand/40"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>Jun</span>
                  <span>Sep</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
