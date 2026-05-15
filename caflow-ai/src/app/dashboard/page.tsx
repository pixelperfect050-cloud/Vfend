"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Search, Sparkles,
  Plus, Filter, MoreVertical, Phone, Mail, MessageCircle,
  Building2, Calendar, DollarSign, AlertTriangle, CheckCircle2,
  ArrowRight, Upload, FileCheck, FileX, Brain, Clock, Send,
  Mic, ChevronRight
} from "lucide-react";
import { DEMO_CLIENTS, DEMO_ACTIVITIES, DEMO_TASKS, DEMO_AI_SUGGESTIONS } from "@/lib/data";
import { HealthScoreRing } from "@/components/client-scoring/HealthScoreRing";
import { WhatsAppQuickActions } from "@/components/whatsapp/WhatsAppActions";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useEffect, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Footer } from "@/components/layout/Footer";
import { useData } from "@/contexts/DataContext";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { AddTaskModal } from "@/components/modals/AddTaskModal";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Reminders", href: "/reminders" },
  { icon: Bell, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { clients, activities, tasks } = useData();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const isDemoUser = useMemo(() => {
    return user?.email?.endsWith('@caflow.ai') || user?.email === 'demo@caflow.ai';
  }, [user]);

  const dashboardData = useMemo(() => {
    return {
      clients: clients.slice(0, 4),
      activities: activities.slice(0, 5),
      suggestions: tasks.slice(0, 3).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || "No description",
        priority: t.priority,
        type: t.filingType || "info"
      })),
      stats: [
        { icon: FileCheck, label: "Filing Ready", value: clients.length > 0 ? "12" : "0", sub: "GSTR-1 & 3B", color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: AlertTriangle, label: "Missing Docs", value: clients.length > 0 ? "08" : "0", sub: "Pending from clients", color: "text-amber-600", bg: "bg-amber-50" },
        { icon: DollarSign, label: "Pending Fees", value: clients.length > 0 ? "₹45k" : "₹0", sub: "3 Overdue invoices", color: "text-blue-600", bg: "bg-blue-50" },
      ]
    };
  }, [clients, activities, tasks]);

  useEffect(() => {
    if (searchParams.get("trial") === "true") {
      addToast({
        title: "Welcome to CAFlow AI!",
        message: "Your 14-day free trial has been activated. Enjoy exploring!",
        type: "success"
      });
    }
  }, [searchParams, addToast]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 ai-grid opacity-10" />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-slate-900">CAFLOW</span>
        </Link>
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-600 rounded-full" />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">CAFLOW</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              item.active 
                ? "bg-amber-50 text-amber-700 border border-amber-100 shadow-sm" 
                : "text-slate-600 hover:text-amber-600 hover:bg-amber-50/50"
            }`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-600' : 'group-hover:text-amber-600 transition-colors'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          
          {/* Hero / AI Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-2 text-slate-900">
                Good morning, <span className="text-amber-600">{user?.name?.split(' ')[0] || 'Imran'}</span>
              </h1>
              <p className="text-slate-500 flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-600 animate-pulse" />
                AI has identified 4 critical tasks that need your attention today.
              </p>
            </motion.div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all text-sm font-medium flex items-center gap-2 text-slate-700 shadow-sm">
                <Filter className="w-4 h-4" /> Filter
              </button>
              {user?.role !== "client" && (
                <button className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 transition-all text-sm font-bold flex items-center gap-2 text-white shadow-lg shadow-amber-600/20">
                  <Plus className="w-4 h-4" /> New Client
                </button>
              )}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {dashboardData.stats.map((item, i) => (
              <div key={i} className="bg-white p-4 flex items-center gap-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900">{item.value}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: High Risk Clients */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
                  <Activity className="w-5 h-5 text-amber-600" />
                  Client Health Monitoring
                </h2>
                <Link href="/clients" className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {dashboardData.clients.length > 0 ? (
                  dashboardData.clients.map((client, i) => (
                    <motion.div 
                      key={client.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-5 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center font-bold text-amber-700 border border-amber-100">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{client.name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{client.businessType}</p>
                          </div>
                        </div>
                        <HealthScoreRing score={client.healthScore} size="sm" showLabel={false} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Next Filing</span>
                          <span className="font-medium text-slate-700">Oct 20, 2024</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Status</span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <Clock className="w-3 h-3" /> Waiting for docs
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <WhatsAppQuickActions 
                          clientName={client.name}
                          onSendMessage={() => {}}
                          onRequestDocs={() => {}}
                          onScheduleCall={() => {}}
                          onSetReminder={() => {}}
                        />
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2">
                    <EmptyState 
                      icon={<Users className="w-8 h-8 text-slate-400" />}
                      title="No Clients Yet"
                      description="Add your first client to start tracking their filings and document health."
                      action={
                        <button 
                          onClick={() => setIsAddClientOpen(true)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 transition-all text-sm font-bold text-white shadow-lg shadow-amber-600/20 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Client
                        </button>
                      }
                      className="bg-white rounded-3xl border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: AI Suggestions & Tasks */}
            <div className="space-y-6">
              <div className="bg-amber-50/50 p-6 border border-amber-100 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
                  <Brain className="w-5 h-5 text-amber-600" />
                  AI Task Pilot
                </h3>
                <div className="space-y-4">
                  {dashboardData.suggestions.length > 0 ? (
                    dashboardData.suggestions.map((task, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white border border-slate-100 hover:border-amber-300 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            task.priority === 'urgent' ? 'bg-red-500' : 
                            task.priority === 'high' ? 'bg-amber-500' : 'bg-amber-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{task.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Brain className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 font-medium">AI is analyzing your workflow. Suggestions will appear here.</p>
                      <button 
                        onClick={() => setIsAddTaskOpen(true)}
                        className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                      >
                        Create a manual task
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="w-full mt-6 py-3 rounded-xl bg-white text-amber-700 border border-amber-100 hover:bg-amber-50 transition-all font-bold text-sm uppercase tracking-widest shadow-sm"
                >
                  Create New Task
                </button>
              </div>

              {/* Quick Chat / AI Assistant */}
              <div className="glass-card p-4">
                <div className="relative">
                  <Input 
                    placeholder="Ask CAFlow AI..." 
                    className="bg-white border-slate-200 pr-10 focus:ring-amber-500/50 text-slate-900"
                  />
                  <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-amber-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Firm Operations</h2>
              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.activities.length > 0 ? (
                dashboardData.activities.map((activity, i) => (
                  <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-slate-700">Today</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Successful</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-500 text-sm italic">No recent activity to show.</p>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-amber-600' : 'text-slate-400'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <AddClientModal 
        isOpen={isAddClientOpen} 
        onClose={() => setIsAddClientOpen(false)} 
      />
      <AddTaskModal 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)} 
      />
    </div>
  );
}

function Input({ className, ...props }: any) {
  return (
    <input
      className={`flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}