"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Sparkles,
  TrendingUp, TrendingDown, Calendar, DollarSign, Users2,
  FileCheck, Clock, Target, Award, MessageCircle
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { DEMO_ANALYTICS, DEMO_DASHBOARD_STATS } from "@/lib/data";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Reminders", href: "/reminders" },
  { icon: Bell, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics", active: true },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const workloadColors = ["#f59e0b", "#10b981", "#fbbf24", "#ef4444", "#d97706", "#ec4899"];

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"6m" | "1y">("6m");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-white">CAflow AI</span>
        </Link>
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">CAflow AI</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active ? "bg-amber-50 text-amber-700 font-bold border border-amber-100" : "text-slate-600 hover:bg-slate-50"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-500">Deep insights into your practice performance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange("6m")}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${timeRange === "6m" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "border border-slate-200 text-slate-600 bg-white"}`}
              >
                6 Months
              </button>
              <button
                onClick={() => setTimeRange("1y")}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${timeRange === "1y" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "border border-slate-200 text-slate-600 bg-white"}`}
              >
                1 Year
              </button>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: "₹12.6L", change: "+12%", trend: "up", icon: DollarSign, color: "from-green-500 to-emerald-500" },
              { label: "Total Clients", value: "24", change: "+2", trend: "up", icon: Users2, color: "from-blue-500 to-cyan-500" },
              { label: "Filings Completed", value: "156", change: "+18%", trend: "up", icon: FileCheck, color: "from-purple-500 to-violet-500" },
              { label: "Avg Completion", value: "3.2 days", change: "-0.5", trend: "down", icon: Clock, color: "from-orange-500 to-amber-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Filings */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Monthly Filings</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={DEMO_ANALYTICS.monthlyFilings}>
                  <defs>
                    <linearGradient id="colorGst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorItr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="gst" stroke="#f59e0b" strokeWidth={2} fill="url(#colorGst)" name="GST" />
                  <Area type="monotone" dataKey="itr" stroke="#10b981" strokeWidth={2} fill="url(#colorItr)" name="ITR" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Overview */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={DEMO_ANALYTICS.revenueOverview}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`₹${(Number(value)/1000).toFixed(0)}K`, '']} />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#10b981" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Client Growth */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Client Growth</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={DEMO_ANALYTICS.clientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Active" />
                  <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="New" />
                  <Line type="monotone" dataKey="inactive" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Inactive" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pending Work */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Pending Work</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={DEMO_ANALYTICS.pendingWork} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={12} width={60} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Total" />
                  <Bar dataKey="critical" fill="#ef4444" radius={[0, 4, 4, 0]} name="Critical" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workload Heatmap */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Workload Heatmap</h3>
            <div className="grid grid-cols-8 gap-2">
              <div className="col-span-1"></div>
              {["Morning", "Afternoon", "Evening"].map((time) => (
                <div key={time} className="text-center text-sm text-slate-500 font-medium">{time}</div>
              ))}
              {DEMO_ANALYTICS.workloadHeatmap.map((day) => (
                <React.Fragment key={day.day}>
                  <div key={`${day.day}-label`} className="text-sm text-slate-600 font-medium flex items-center">{day.day}</div>
                  <div key={`${day.day}-morning`} className={`h-12 rounded-lg flex items-center justify-center text-white font-medium ${day.morning >= 4 ? 'bg-red-500' : day.morning >= 2 ? 'bg-amber-500' : 'bg-emerald-500'}`}>{day.morning}</div>
                  <div key={`${day.day}-afternoon`} className={`h-12 rounded-lg flex items-center justify-center text-white font-medium ${day.afternoon >= 4 ? 'bg-red-500' : day.afternoon >= 2 ? 'bg-amber-500' : 'bg-emerald-500'}`}>{day.afternoon}</div>
                  <div key={`${day.day}-evening`} className={`h-12 rounded-lg flex items-center justify-center text-white font-medium ${day.evening >= 4 ? 'bg-red-500' : day.evening >= 2 ? 'bg-amber-500' : 'bg-emerald-500'}`}>{day.evening}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Staff Performance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {DEMO_ANALYTICS.staffPerformance.map((staff) => (
                <div key={staff.staffId} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{staff.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Award className="w-4 h-4 text-amber-500" />
                          {staff.rating}/5.0
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{staff.tasksCompleted}</div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{staff.avgCompletionTime}d</div>
                      <div className="text-xs text-slate-500">Avg Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{(staff.rating * 20)}%</div>
                      <div className="text-xs text-slate-500">Rating</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-amber-600' : 'text-slate-400'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}