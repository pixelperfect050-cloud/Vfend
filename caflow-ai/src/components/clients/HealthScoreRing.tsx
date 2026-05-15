"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, AlertTriangle, FileText, Clock, DollarSign, 
  MessageSquare, ChevronRight, Lightbulb, CheckCircle2, 
  Send, FileX, Calendar, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreRingProps {
  score: number;
  lateReplies?: number;
  missingDocs?: number;
  filingDelays?: number;
  pendingFees?: number;
  inactiveDays?: number;
  onClick?: () => void;
}

const getScoreStatus = (score: number) => {
  if (score >= 80) return { label: "Healthy", color: "text-green-500", bg: "bg-green-500", glow: "shadow-green-500/50" };
  if (score >= 60) return { label: "Risky", color: "text-yellow-500", bg: "bg-yellow-500", glow: "shadow-yellow-500/50" };
  return { label: "Critical", color: "text-red-500", bg: "bg-red-500", glow: "shadow-red-500/50" };
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return "from-green-400 to-emerald-600";
  if (score >= 60) return "from-yellow-400 to-orange-500";
  return "from-red-400 to-red-600";
};

export function HealthScoreRing({ 
  score, 
  lateReplies = 0,
  missingDocs = 0,
  filingDelays = 0,
  pendingFees = 0,
  inactiveDays = 0,
  onClick 
}: HealthScoreRingProps) {
  const [showInsights, setShowInsights] = useState(false);
  const status = getScoreStatus(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const issues = [];
  if (lateReplies > 0) issues.push({ type: "late_replies", label: "Late Replies", count: lateReplies, icon: Clock, priority: "high" });
  if (missingDocs > 0) issues.push({ type: "missing_docs", label: "Missing Documents", count: missingDocs, icon: FileX, priority: "high" });
  if (filingDelays > 0) issues.push({ type: "filing_delays", label: "Filing Delays", count: filingDelays, icon: Calendar, priority: "urgent" });
  if (pendingFees > 0) issues.push({ type: "pending_fees", label: "Pending Fees", count: pendingFees, icon: DollarSign, priority: "medium" });
  if (inactiveDays > 0) issues.push({ type: "inactive", label: "Communication Inactive", count: inactiveDays, icon: MessageSquare, priority: "medium" });

  const aiSuggestions = {
    late_replies: "Send polite reminder via WhatsApp. Consider scheduling a quick call to understand any issues.",
    missing_docs: "Use document request template. Set auto-reminder for 3 days.",
    filing_delays: "File immediately to avoid penalty. Escalate to senior staff if needed.",
    pending_fees: "Send payment reminder with clear breakdown. Offer payment plan if needed.",
    inactive: "Schedule client visit or call. Send personalized WhatsApp message.",
  };

  return (
    <>
      <motion.div 
        className={cn(
          "relative w-28 h-28 rounded-full cursor-pointer transition-all duration-300",
          "hover:scale-105"
        )}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowInsights(true)}
        style={{
          filter: `drop-shadow(0 0 15px var(--${status.color}))`,
        }}
      >
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-200 dark:text-zinc-700"
          />
          <motion.circle
            cx="56"
            cy="56"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171"} />
              <stop offset="100%" stopColor={score >= 80 ? "#059669" : score >= 60 ? "#ea580c" : "#dc2626"} />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={cn("text-2xl font-bold", status.color)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Health</span>
        </div>

        {score < 60 && (
          <motion.div 
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <AlertTriangle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", status.bg)}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Insights</h3>
                      <p className={cn("text-sm font-medium", status.color)}>{status.label} Score: {score}%</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowInsights(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                {issues.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Issues Detected
                      </h4>
                      {issues.map((issue) => (
                        <motion.div
                          key={issue.type}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className={cn(
                            "p-4 rounded-2xl border",
                            issue.priority === "urgent" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
                            issue.priority === "high" ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800" :
                            "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              issue.priority === "urgent" ? "bg-red-100 dark:bg-red-900/50" :
                              issue.priority === "high" ? "bg-orange-100 dark:bg-orange-900/50" :
                              "bg-yellow-100 dark:bg-yellow-900/50"
                            )}>
                              <issue.icon className={cn(
                                "w-5 h-5",
                                issue.priority === "urgent" ? "text-red-600" :
                                issue.priority === "high" ? "text-orange-600" :
                                "text-yellow-600"
                              )} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-zinc-900 dark:text-white">{issue.label}</p>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium",
                                  issue.priority === "urgent" ? "bg-red-500 text-white" :
                                  issue.priority === "high" ? "bg-orange-500 text-white" :
                                  "bg-yellow-500 text-white"
                                )}>
                                  {issue.count}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                {aiSuggestions[issue.type as keyof typeof aiSuggestions]}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {issues.slice(0, 3).map((issue, index) => (
                          <motion.button
                            key={issue.type}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-zinc-900 dark:text-white text-sm">Send {issue.label} Reminder</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Quick WhatsApp action</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Pending Tasks
                      </h4>
                      <div className="space-y-2">
                        {issues.slice(0, 2).map((issue, index) => (
                          <div key={issue.type} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">Follow up on {issue.label.toLowerCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">All Good!</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">No issues detected. Keep up the great work.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}