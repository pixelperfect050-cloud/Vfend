"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, Bell, LogOut, Menu, X, Upload, FileText, DollarSign,
  Calendar, CheckCircle2, MessageCircle, Download, Eye, Clock,
  ChevronRight, User, Home, FileCheck, CreditCard, BellRing
} from "lucide-react";
import { DEMO_CLIENTS, DEMO_TASKS, DEMO_REMINDERS } from "@/lib/data";

const navItems = [
  { icon: Home, label: "Home", href: "/client-portal" },
  { icon: FileText, label: "Documents", href: "/client-portal/documents" },
  { icon: FileCheck, label: "Filing Status", href: "/client-portal/filing" },
  { icon: DollarSign, label: "Payments", href: "/client-portal/payments" },
  { icon: BellRing, label: "Notifications", href: "/client-portal/notifications" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
];

export default function ClientPortalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const client = DEMO_CLIENTS[0];
  const clientTasks = DEMO_TASKS.filter(t => t.clientId === "c1").slice(0, 3);
  const pendingDocs = client.documents.filter(d => d.status === "pending");
  const pendingPayments = client.payments.filter(p => p.status === "pending" || p.status === "overdue");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedDocs([...uploadedDocs, ...fileNames]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">CAflow AI</span>
        </Link>
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CAflow AI</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-white/80">Client Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome, {client.name}!</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Your filing status and documents at a glance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">2</div>
              <div className="text-sm text-zinc-500">Filed Returns</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{pendingDocs.length}</div>
              <div className="text-sm text-zinc-500">Pending Docs</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{clientTasks.length}</div>
              <div className="text-sm text-zinc-500">Active Tasks</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">₹{pendingPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</div>
              <div className="text-sm text-zinc-500">Pending Payment</div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Documents Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Documents
                </h2>
              </div>

              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors mb-4">
                <input
                  type="file"
                  id="doc-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleUpload}
                  className="hidden"
                />
                <label htmlFor="doc-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Click to upload documents</p>
                  <p className="text-xs text-zinc-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </label>
              </div>

              {uploadedDocs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Uploaded Files:</p>
                  {uploadedDocs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">{doc}</span>
                      <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                    </div>
                  ))}
                </div>
              )}

              {/* Required Documents */}
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Required Documents:</p>
                <div className="space-y-2">
                  {[
                    { name: "GSTR-3B December 2024", status: "received" },
                    { name: "Bank Statement Dec 2024", status: "pending" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-zinc-400" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        doc.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {doc.status === "pending" ? "Pending" : "Received"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Filing Status Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
                <FileCheck className="w-5 h-5 text-primary" />
                Filing Status
              </h2>

              <div className="space-y-4">
                {client.filings.map((filing) => (
                  <div key={filing.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          filing.status === "filed" ? "bg-green-100 dark:bg-green-900/30" :
                          filing.status === "in_progress" ? "bg-blue-100 dark:bg-blue-900/30" :
                          "bg-yellow-100 dark:bg-yellow-900/30"
                        }`}>
                          {filing.status === "filed" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{filing.type.toUpperCase()}</p>
                          <p className="text-sm text-zinc-500">{filing.period}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        filing.status === "filed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        filing.status === "in_progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {filing.status.replace("_", " ")}
                      </span>
                    </div>
                    {filing.status === "filed" && filing.acknowledgmentNumber && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2 ml-13">Ack: {filing.acknowledgmentNumber}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment History
              </h2>

              <div className="space-y-3">
                {client.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-zinc-500">{payment.type} - Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      payment.status === "overdue" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                Recent Notifications
              </h2>

              <div className="space-y-3">
                {[
                  { title: "Document Verified", desc: "GSTR-1 November 2024 has been verified", time: "2 hours ago", type: "success" },
                  { title: "Filing Due Soon", desc: "GSTR-3B December 2024 due on Jan 11", time: "1 day ago", type: "warning" },
                  { title: "Payment Received", desc: "₹15,000 received for November filing", time: "3 days ago", type: "info" },
                ].map((notif, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notif.type === "success" ? "bg-green-500" :
                      notif.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-white">{notif.title}</p>
                      <p className="text-sm text-zinc-500">{notif.desc}</p>
                      <p className="text-xs text-zinc-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Support</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span>Set Reminder</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span>Download Receipts</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 p-2 text-indigo-600">
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}