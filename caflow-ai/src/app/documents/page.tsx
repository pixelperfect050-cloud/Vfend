"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Search, Sparkles,
  Upload, Filter, MoreVertical, File, FileCheck, FileX,
  Clock, CheckCircle2, XCircle, Download, Eye, Trash2,
  Image, FileText as DocIcon, Table, MessageCircle
} from "lucide-react";
import { DEMO_CLIENTS } from "@/lib/data";
import { useToast } from "@/components/ui/toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: FileText, label: "Documents", href: "/documents", active: true },
  { icon: MessageSquare, label: "Reminders", href: "/reminders" },
  { icon: Bell, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  received: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcons = {
  pending: Clock,
  received: File,
  verified: CheckCircle2,
  rejected: XCircle,
};

const documentTypeLabels: Record<string, string> = {
  gstr1: "GSTR-1",
  gstr3b: "GSTR-3B",
  itr_form: "ITR Form",
  pan_card: "PAN Card",
  aadhar_card: "Aadhar",
  bank_statement: "Bank Statement",
  balance_sheet: "Balance Sheet",
  p_l_statement: "P&L Statement",
  invoice: "Invoice",
  receipt: "Receipt",
  expense_voucher: "Expense Voucher",
  other: "Other",
};

const documentTypeIcons: Record<string, typeof File> = {
  gstr1: Table,
  gstr3b: Table,
  itr_form: DocIcon,
  pan_card: Image,
  aadhar_card: Image,
  bank_statement: Table,
  balance_sheet: Table,
  p_l_statement: Table,
  invoice: DocIcon,
  receipt: DocIcon,
  expense_voucher: DocIcon,
  other: File,
};

export default function DocumentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "received" | "verified" | "rejected">("all");
  const [filterClient, setFilterClient] = useState("all");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleAction = (action: string, docName: string) => {
    addToast({
      title: "Action Triggered",
      message: `${action}ing "${docName}"... (Demo Mode)`,
      type: "info"
    });
  };

  const handleUpload = () => {
    addToast({
      title: "Upload",
      message: "Opening secure upload portal...",
      type: "success"
    });
  };

  const allDocuments = DEMO_CLIENTS.flatMap(client => 
    client.documents.map(doc => ({ ...doc, clientName: client.name, clientId: client.id }))
  );

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesClient = filterClient === "all" || doc.clientId === filterClient;
    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          {sidebarOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">CAflow AI</span>
        </Link>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
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
              <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
              <p className="text-slate-500">Track and manage all client documents</p>
            </div>
            <button 
              onClick={handleUpload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Document
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Documents", value: allDocuments.length, icon: File, color: "from-blue-500 to-cyan-500" },
              { label: "Pending", value: allDocuments.filter(d => d.status === 'pending').length, icon: Clock, color: "from-yellow-500 to-amber-500" },
              { label: "Verified", value: allDocuments.filter(d => d.status === 'verified').length, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
              { label: "Rejected", value: allDocuments.filter(d => d.status === 'rejected').length, icon: XCircle, color: "from-red-500 to-pink-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-6 border border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                <option value="all">All Clients</option>
                {DEMO_CLIENTS.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => {
              const DocTypeIcon = documentTypeIcons[doc.type as keyof typeof documentTypeIcons] || File;
              const StatusIcon = statusIcons[doc.status as keyof typeof statusIcons];
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <DocTypeIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[doc.status as keyof typeof statusColors]}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{doc.name}</h3>
                  <p className="text-sm text-zinc-500 mb-3">{doc.clientName}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">{documentTypeLabels[doc.type]}</span>
                    {doc.uploadedAt && (
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button 
                      onClick={() => handleAction("View", doc.name)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button 
                      onClick={() => handleAction("Download", doc.name)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    {doc.status === 'pending' && (
                      <button className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No documents found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your filters or upload new documents</p>
            </div>
          )}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-indigo-600' : 'text-zinc-400'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}