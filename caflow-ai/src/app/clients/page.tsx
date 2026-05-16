"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Search, Sparkles,
  Plus, Filter, MoreVertical, Phone, Mail, MessageCircle,
  Building2, Calendar, DollarSign, AlertTriangle, CheckCircle2,
  ArrowRight, Upload, FileCheck, FileX, Brain, Clock, Send,
  Mic, ChevronRight, ChevronLeft
} from "lucide-react";
import { DEMO_CLIENTS, DEMO_ACTIVITIES, DEMO_TASKS } from "@/lib/data";
import { HealthScoreRing, ClientHealthDetails } from "@/components/client-scoring/HealthScoreRing";
import { WhatsAppQuickActions } from "@/components/whatsapp/WhatsAppActions";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import type { Client } from "@/types";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { AddClientModal } from "@/components/modals/AddClientModal";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/clients", active: true },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Reminders", href: "/reminders" },
  { icon: Bell, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const businessTypeLabels: Record<string, string> = {
  proprietorship: "Proprietorship",
  partnership: "Partnership",
  llp: "LLP",
  private_ltd: "Private Ltd",
  public_ltd: "Public Ltd",
  trust: "Trust",
  society: "Society",
};

export default function ClientsPage() {
  const { user } = useAuth();
  const { clients: activeClients } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "prospect">("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 6;
  const isDemoUser = useMemo(() => {
    return user?.email?.endsWith('@caflow.ai') || user?.email === 'demo@caflow.ai';
  }, [user]);

  const filteredClients = activeClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          {sidebarOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-slate-900">CAFLOW</span>
        </Link>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
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
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              item.active 
                ? "bg-amber-50 text-amber-700 font-bold border border-amber-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}>
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

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div className="relative">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter text-slate-900">Client Intelligence</h1>
              <p className="text-slate-500 mt-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-600" />
                Managing {activeClients.length} entities with AI-powered monitoring
              </p>
            </div>
            {user?.role !== "client" && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20"
              >
                <Plus className="w-5 h-5" /> Add New Entity
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, GSTIN, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
              />
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-center px-4 py-2 gap-2 text-sm">
                <Filter className="w-4 h-4 text-amber-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-transparent outline-none cursor-pointer text-slate-600 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clients Grid */}
          <div className={paginatedClients.length > 0 ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "block"}>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 group cursor-pointer relative overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
                  onClick={() => setSelectedClient(client)}
                >
                  {/* Score Glow Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 pointer-events-none ${
                    client.healthScore >= 70 ? 'bg-green-500' : client.healthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-600 font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">{client.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{businessTypeLabels[client.businessType]}</p>
                      </div>
                    </div>
                    <HealthScoreRing score={client.healthScore} size="md" />
                  </div>

                  <div className="space-y-4 mb-6 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">GSTIN</p>
                        <p className="text-xs font-mono text-slate-600">{client.gstNumber}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className={`text-xs font-bold uppercase ${
                          client.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                        }`}>{client.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
                    <WhatsAppQuickActions 
                      clientName={client.name}
                      onSendMessage={() => {}}
                      onRequestDocs={() => {}}
                      onScheduleCall={() => {}}
                      onSetReminder={() => {}}
                    />
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState 
                icon={<Users className="w-12 h-12 text-slate-400" />}
                title="No Entities Found"
                description={searchQuery ? "No clients match your search criteria." : "Start by adding your first client entity to monitor their compliance health."}
                action={!searchQuery && (
                  <button className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20">
                    <Plus className="w-5 h-5" /> Add New Entity
                  </button>
                )}
                className="bg-white rounded-3xl border border-slate-200 py-20"
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === page 
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" 
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Client Details Modal */}
      <AnimatePresence>
        {selectedClient && (
          <ClientHealthDetails 
            client={selectedClient as any} 
            onClose={() => setSelectedClient(null)} 
            onAction={() => {}} 
          />
        )}
      </AnimatePresence>
      <AddClientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}