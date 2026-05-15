"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Search, Sparkles,
  Send, Plus, Filter, MoreVertical, Calendar, Clock, CheckCircle2,
  MessageCircle, Phone, Mail, ChevronRight, Zap, Brain, FileX,
  FileCheck, DollarSign, AlertTriangle
} from "lucide-react";
import { DEMO_REMINDERS, DEMO_CLIENTS } from "@/lib/data";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Reminders", href: "/reminders", active: true },
  { icon: Bell, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const levelTemplates = [
  { level: 1, days: 0, template: { en: "Kindly upload the required documents at your earliest convenience.", hi: "कृपया आवश्यक दस्तावेज जल्दी अपलोड करें।" }},
  { level: 2, days: 5, template: { en: "Return filing may get delayed due to pending documents. Please expedite.", hi: "लंबित दस्तावेज़ के कारण रिटर्न फाइलिंग में देरी हो सकती है। कृपया जल्दी करें।" }},
  { level: 3, days: 10, template: { en: "Penalty risk due to missing documents. Please respond immediately.", hi: "गायब दस्तावेज़ के कारण जुर्माने का खतरा है। कृपया तुरंत जवाब दें।" }},
];

const clientMessages = DEMO_CLIENTS.map(client => ({
  id: client.id,
  name: client.name,
  pendingDocs: client.documents.filter(d => d.status === 'pending').length,
  pendingPayments: client.payments.filter(p => p.status === 'pending' || p.status === 'overdue').length,
  lastActivity: client.lastActivity,
  riskLevel: client.riskLevel,
  phone: client.whatsapp || client.phone,
  gstNumber: client.gstNumber,
  amount: client.payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
})).filter(c => c.pendingDocs > 0 || c.pendingPayments > 0);

export default function RemindersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const filteredClients = clientMessages.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Sent", value: DEMO_REMINDERS.length, icon: MessageCircle, color: "from-blue-500 to-cyan-500" },
    { label: "Delivered", value: DEMO_REMINDERS.filter(r => r.status === 'sent').length, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { label: "Scheduled", value: DEMO_REMINDERS.filter(r => r.status === 'scheduled').length, icon: Clock, color: "from-yellow-500 to-amber-500" },
    { label: "Failed", value: DEMO_REMINDERS.filter(r => r.status === 'failed').length, icon: AlertTriangle, color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">CAflow AI</span>
        </Link>
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <Bell className="w-5 h-5 text-white" />
        </button>
      </header>

      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#121A2F] border-r border-white/5 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">CAFlow AI</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              item.active 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <MessageCircle className="w-7 h-7 text-green-400" />
                WhatsApp Reminders
              </h1>
              <p className="text-slate-400 mt-1">AI-powered WhatsApp communication with your clients</p>
            </div>
            <button 
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-glow-whatsapp transition-all"
            >
              <Send className="w-5 h-5" />
              Send Reminder
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Auto-Reminder Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-8 border border-indigo-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center ai-pulse shadow-glow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Auto-Reminders</h3>
                  <p className="text-sm text-slate-400">Automatically send smart reminders based on document status</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-slate-400">Active</div>
                  <div className="text-xl font-bold text-emerald-400">4 Clients</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reminder Templates */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold">Escalation Templates</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {levelTemplates.map((template) => (
                <motion.div 
                  key={template.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: template.level * 0.1 }}
                  className="glass-card rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        template.level === 1 ? 'bg-blue-500/20 text-blue-400' :
                        template.level === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {template.level}
                      </span>
                      <span className="text-sm font-medium">
                        {template.level === 1 ? 'First Reminder' : 
                         template.level === 2 ? 'Follow-up' : 'Final Notice'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{template.days === 0 ? "Day 1" : `Day ${template.days}`}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{template.template.en}</p>
                  <p className="text-xs text-slate-500 italic">{template.template.hi}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Clients needing reminders - WhatsApp style */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold">Quick Send</h2>
            </div>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Clients Needing Reminders</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <h4 className="font-medium">{client.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            {client.pendingDocs > 0 && (
                              <span className="flex items-center gap-1">
                                <FileX className="w-3 h-3 text-orange-400" />
                                {client.pendingDocs} docs
                              </span>
                            )}
                            {client.pendingPayments > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-red-400" />
                                ₹{client.amount.toLocaleString()} due
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          client.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                          client.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {client.riskLevel} risk
                        </span>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          Send on WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/5 flex items-center justify-around px-2 z-50 safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-green-400' : 'text-slate-400'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}