"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, X, CheckCircle2, Clock, FileText, DollarSign, MessageSquare } from "lucide-react";

interface HealthScoreRingProps {
  score: number;
  riskLevel: "low" | "medium" | "high";
  clientId?: string;
  lateReplies?: number;
  missingDocs?: number;
  filingDelays?: number;
  pendingFees?: number;
  inactivityDays?: number;
  onClick?: () => void;
}

const getScoreColor = (score: number, riskLevel: "low" | "medium" | "high") => {
  if (score >= 70) return { primary: "#22c55e", secondary: "#86efac", glow: "rgba(34, 197, 94, 0.5)" };
  if (score >= 40) return { primary: "#eab308", secondary: "#fde047", glow: "rgba(234, 179, 8, 0.5)" };
  return { primary: "#ef4444", secondary: "#fca5a5", glow: "rgba(239, 68, 68, 0.5)" };
};

const getRiskLabel = (riskLevel: "low" | "medium" | "high") => {
  switch (riskLevel) {
    case "low": return { label: "Healthy", color: "text-green-500" };
    case "medium": return { label: "Risky", color: "text-yellow-500" };
    case "high": return { label: "Critical", color: "text-red-500" };
  }
};

export function HealthScoreRing({
  score,
  riskLevel,
  clientId,
  lateReplies = 0,
  missingDocs = 0,
  filingDelays = 0,
  pendingFees = 0,
  inactivityDays = 0,
  onClick,
}: HealthScoreRingProps) {
  const [showInsights, setShowInsights] = useState(false);
  const colors = getScoreColor(score, riskLevel);
  const risk = getRiskLabel(riskLevel);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const insights = [
    { icon: Clock, label: "Late Replies", value: lateReplies, color: lateReplies > 3 ? "text-red-500" : "text-yellow-500" },
    { icon: FileText, label: "Missing Docs", value: missingDocs, color: missingDocs > 0 ? "text-red-500" : "text-green-500" },
    { icon: AlertTriangle, label: "Filing Delays", value: filingDelays, color: filingDelays > 0 ? "text-red-500" : "text-green-500" },
    { icon: DollarSign, label: "Pending Fees", value: pendingFees, color: pendingFees > 0 ? "text-red-500" : "text-green-500" },
    { icon: MessageSquare, label: "Inactivity", value: inactivityDays > 0 ? `${inactivityDays}d` : "None", color: inactivityDays > 7 ? "text-red-500" : "text-green-500" },
  ];

  const aiSuggestions = [
    "Send a gentle reminder about pending documents",
    "Schedule a call to discuss compliance status",
    "Review recent communication history",
    missingDocs > 0 ? `Request ${missingDocs} missing document(s)` : null,
    pendingFees > 0 ? `Follow up on pending payment of ₹${pendingFees}` : null,
  ].filter(Boolean);

  const recommendedActions = [
    { action: "Send WhatsApp Reminder", type: "whatsapp" },
    { action: "Request Documents", type: "request" },
    { action: "Schedule Call", type: "call" },
    { action: "Send Payment Reminder", type: "payment" },
  ];

  const pendingTasks = [
    { task: "Upload bank statements", priority: "high" },
    { task: "Complete GSTR-1 filing", priority: "medium" },
    { task: "Review invoices", priority: "low" },
  ];

  return (
    <>
      <motion.div
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowInsights(true)}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
          style={{ backgroundColor: colors.glow }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-200 dark:text-slate-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.primary}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={`text-xs font-medium ${risk.color}`}>{risk.label}</span>
        </div>

        <motion.div
          className="absolute -top-1 -right-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score >= 70 && <span className="text-lg">🟢</span>}
          {score >= 40 && score < 70 && <span className="text-lg">🟡</span>}
          {score < 40 && <span className="text-lg">🔴</span>}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showInsights && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <button
                  onClick={() => setShowInsights(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}20`, border: `3px solid ${colors.primary}` }}
                      animate={{ boxShadow: [`0 0 20px ${colors.glow}`, `0 0 40px ${colors.glow}`, `0 0 20px ${colors.glow}`], }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-3xl font-bold" style={{ color: colors.primary }}>{score}</span>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 text-2xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {score >= 70 ? "🟢" : score >= 40 ? "🟡" : "🔴"}
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Client Health Score</h3>
                    <p className={`text-sm ${risk.color} font-medium`}>{risk.label} Risk</p>
                    <p className="text-slate-400 text-sm mt-1">Click score to see details</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {insights.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                      <p className="text-2xl font-bold text-white">{item.value}</p>
                      <p className="text-xs text-slate-400">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-300px)]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-slate-800 dark:text-white">AI Suggestions</h4>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{suggestion}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Recommended Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendedActions.map((action, index) => (
                      <motion.button
                        key={index}
                        className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {action.action}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Pending Tasks</h4>
                  <div className="space-y-2">
                    {pendingTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === "high" ? "bg-red-500" :
                            task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                          }`} />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{task.task}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "high" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                          task.priority === "medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function HealthScoreMini({ score, riskLevel }: { score: number; riskLevel: "low" | "medium" | "high" }) {
  const colors = getScoreColor(score, riskLevel);
  const risk = getRiskLabel(riskLevel);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
        style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, border: `2px solid ${colors.primary}` }}
        whileHover={{ scale: 1.1 }}
      >
        {score}
      </motion.div>
      <div>
        <p className={`text-xs font-medium ${risk.color}`}>{risk.label}</p>
        <p className="text-xs text-slate-500">{score >= 70 ? "🟢" : score >= 40 ? "🟡" : "🔴"}</p>
      </div>
    </div>
  );
}
