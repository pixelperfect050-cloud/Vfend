"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Clock,
  FileText,
  DollarSign,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  Phone,
  FileUp,
  Calendar,
  Bot,
  ChevronRight,
  Wand2,
  Mic,
  FileSearch,
  Lightbulb,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client } from "@/types";

interface ClientHealthModalProps {
  client: Client;
  open: boolean;
  onClose: () => void;
}

interface HealthFactor {
  id: string;
  name: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  status: "healthy" | "warning" | "critical";
  details: string;
}

export function ClientHealthModal({ client, open, onClose }: ClientHealthModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ai" | "actions">("overview");

  const healthFactors: HealthFactor[] = [
    {
      id: "replies",
      name: "Late Replies",
      icon: <Clock className="w-4 h-4" />,
      score: client.healthScore > 60 ? 15 : client.healthScore > 40 ? 8 : 3,
      maxScore: 20,
      status: client.healthScore > 60 ? "healthy" : client.healthScore > 40 ? "warning" : "critical",
      details: "Last response received 3 days ago",
    },
    {
      id: "documents",
      name: "Missing Documents",
      icon: <FileText className="w-4 h-4" />,
      score: client.documents.filter((d) => d.status === "pending").length === 0 ? 25 : 10,
      maxScore: 25,
      status: client.documents.filter((d) => d.status === "pending").length === 0 ? "healthy" : "critical",
      details: `${client.documents.filter((d) => d.status === "pending").length} documents pending`,
    },
    {
      id: "filings",
      name: "Filing Delays",
      icon: <Calendar className="w-4 h-4" />,
      score: client.filings.filter((f) => f.status === "overdue").length === 0 ? 25 : 5,
      maxScore: 25,
      status: client.filings.filter((f) => f.status === "overdue").length === 0 ? "healthy" : "critical",
      details: `${client.filings.filter((f) => f.status === "overdue").length} overdue filings`,
    },
    {
      id: "fees",
      name: "Pending Fees",
      icon: <DollarSign className="w-4 h-4" />,
      score: client.payments.filter((p) => p.status === "overdue").length === 0 ? 15 : 5,
      maxScore: 15,
      status: client.payments.filter((p) => p.status === "overdue").length === 0 ? "healthy" : "warning",
      details: `₹${client.payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0).toLocaleString()} pending`,
    },
    {
      id: "communication",
      name: "Communication",
      icon: <MessageSquare className="w-4 h-4" />,
      score: client.healthScore > 70 ? 15 : 8,
      maxScore: 15,
      status: client.healthScore > 70 ? "healthy" : "warning",
      details: "Active communication on WhatsApp",
    },
  ];

  const aiSuggestions = [
    {
      id: "1",
      type: "urgent",
      title: "Bank statement missing for April",
      description: "GSTR-3B filing will be blocked without bank reconciliation",
      action: "Send reminder via WhatsApp",
    },
    {
      id: "2",
      type: "warning",
      title: "GSTR-1 overdue by 5 days",
      description: "Interest at 18% per annum will apply from tomorrow",
      action: "Call client immediately",
    },
    {
      id: "3",
      type: "info",
      title: "Payment due in 7 days",
      description: "₹15,000 consultation fee pending",
      action: "Send payment link",
    },
  ];

  const pendingTasks = [
    { id: "1", task: "Upload bank statement for March", priority: "urgent", dueIn: "2 days" },
    { id: "2", task: "Sign GSTR-3B return", priority: "high", dueIn: "5 days" },
    { id: "3", task: "Complete GSTR-1 reconciliation", priority: "medium", dueIn: "1 week" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500 bg-green-50 dark:bg-green-500/10";
      case "warning":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10";
      case "critical":
        return "text-red-500 bg-red-50 dark:bg-red-500/10";
      default:
        return "text-zinc-500 bg-zinc-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500 bg-red-50 dark:bg-red-500/10";
      case "high":
        return "text-orange-500 bg-orange-50 dark:bg-orange-500/10";
      case "medium":
        return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
      default:
        return "text-zinc-500 bg-zinc-50";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="relative p-6 border-b border-zinc-100 dark:border-zinc-800">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {client.name}
                  </h2>
                  <p className="text-sm text-zinc-500">{client.businessName}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-zinc-500">Health Score</span>
                    <span
                      className={cn(
                        "font-bold",
                        client.healthScore >= 80
                          ? "text-green-500"
                          : client.healthScore >= 60
                          ? "text-yellow-500"
                          : client.healthScore >= 40
                          ? "text-orange-500"
                          : "text-red-500"
                      )}
                    >
                      {client.healthScore}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        client.healthScore >= 80
                          ? "bg-green-500"
                          : client.healthScore >= 60
                          ? "bg-yellow-500"
                          : client.healthScore >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${client.healthScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    activeTab === "overview"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                    activeTab === "ai"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Insights
                </button>
                <button
                  onClick={() => setActiveTab("actions")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                    activeTab === "actions"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Actions
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Health Factors
                  </h3>
                  {healthFactors.map((factor, index) => (
                    <motion.div
                      key={factor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all",
                        factor.status === "healthy"
                          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-500/5"
                          : factor.status === "warning"
                          ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-500/5"
                          : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-500/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-xl", getStatusColor(factor.status))}>
                            {factor.icon}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {factor.name}
                            </p>
                            <p className="text-sm text-zinc-500">{factor.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn("text-lg font-bold", getStatusColor(factor.status))}>
                            {factor.score}
                          </span>
                          <span className="text-sm text-zinc-400">/{factor.maxScore}</span>
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            factor.status === "healthy"
                              ? "bg-green-500"
                              : factor.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20">
                      <Bot className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        AI Analysis
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Smart recommendations for {client.name.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-800/20 border border-zinc-200 dark:border-zinc-700"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-xl mt-0.5",
                            suggestion.type === "urgent"
                              ? "bg-red-100 dark:bg-red-500/20"
                              : suggestion.type === "warning"
                              ? "bg-yellow-100 dark:bg-yellow-500/20"
                              : "bg-blue-100 dark:bg-blue-500/20"
                          )}
                        >
                          {suggestion.type === "urgent" ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : suggestion.type === "warning" ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {suggestion.title}
                          </p>
                          <p className="text-sm text-zinc-500 mt-1">
                            {suggestion.description}
                          </p>
                          <button className="mt-3 flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-600">
                            {suggestion.action}
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        Quick AI Actions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                        <FileSearch className="w-4 h-4" />
                        Check GST Mismatch
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                        <Mic className="w-4 h-4" />
                        Generate Voice Note
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                        <Mail className="w-4 h-4" />
                        Draft Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "actions" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Pending Tasks
                  </h3>
                  {pendingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            task.priority === "urgent"
                              ? "bg-red-500"
                              : task.priority === "high"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          )}
                        />
                        <span className="text-sm text-zinc-900 dark:text-white">
                          {task.task}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium",
                            getPriorityColor(task.priority)
                          )}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs text-zinc-400">{task.dueIn}</span>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex flex-col items-center gap-2 hover:shadow-lg hover:shadow-green-500/30 transition-all">
                      <MessageSquare className="w-6 h-6" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col items-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                      <Phone className="w-6 h-6" />
                      <span className="text-sm font-medium">Call</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex flex-col items-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                      <FileUp className="w-6 h-6" />
                      <span className="text-sm font-medium">Request Docs</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex flex-col items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                      <Send className="w-6 h-6" />
                      <span className="text-sm font-medium">Reminder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
