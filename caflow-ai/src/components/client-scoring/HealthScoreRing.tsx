"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Lightbulb, AlertTriangle, CheckCircle2, Clock, FileText, DollarSign, ArrowRight, X } from "lucide-react";

interface HealthScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: { size: 48, stroke: 4, fontSize: "text-xs" },
  md: { size: 80, stroke: 6, fontSize: "text-lg" },
  lg: { size: 120, stroke: 8, fontSize: "text-2xl" },
  xl: { size: 180, stroke: 10, fontSize: "text-4xl" },
};

export function HealthScoreRing({ 
  score, 
  size = "md", 
  showLabel = true, 
  animate = true,
  onClick,
  className 
}: HealthScoreRingProps) {
  const { size: svgSize, stroke, fontSize } = sizeMap[size];
  const radius = (svgSize - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const [progress, setProgress] = React.useState(animate ? 0 : score);

  React.useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setProgress(score), 100);
      return () => clearTimeout(timer);
    }
  }, [score, animate]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 70) return { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.5)", label: "Healthy" };
    if (s >= 40) return { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", label: "Risky" };
    return { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.5)", label: "Critical" };
  };

  const colors = getScoreColor(score);

  return (
    <motion.div
      className={cn("relative cursor-pointer", onClick && "hover:scale-105 transition-transform", className)}
      onClick={onClick}
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
          className="opacity-30"
        />
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow})`,
          }}
        />
      </svg>
      <div 
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center",
          onClick && "cursor-pointer"
        )}
      >
        <span className={cn("font-bold", fontSize, `text-[${colors.stroke}]`)} style={{ color: colors.stroke }}>
          {Math.round(progress)}
        </span>
        {showLabel && size !== "sm" && (
          <span className="text-[10px] text-muted-foreground font-medium">{colors.label}</span>
        )}
      </div>
      {onClick && (
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}

interface HealthScoreInsight {
  id: string;
  type: "late_reply" | "missing_docs" | "filing_delay" | "pending_fee" | "inactivity";
  label: string;
  value: number;
  icon: React.ReactNode;
  suggestion: string;
  action: string;
}

interface ClientHealthDetailsProps {
  client: {
    id: string;
    name: string;
    healthScore: number;
    lateReplies: number;
    missingDocuments: number;
    filingDelays: number;
    pendingFees: number;
    communicationDays: number;
  };
  onClose: () => void;
  onAction: (action: string) => void;
}

export function ClientHealthDetails({ client, onClose, onAction }: ClientHealthDetailsProps) {
  const insights: HealthScoreInsight[] = [
    {
      id: "late_reply",
      type: "late_reply" as const,
      label: "Late Replies",
      value: client.lateReplies,
      icon: <Clock className="h-4 w-4" />,
      suggestion: "Send a gentle reminder via WhatsApp",
      action: "Send Reminder",
    },
    {
      id: "missing_docs",
      type: "missing_docs" as const,
      label: "Missing Documents",
      value: client.missingDocuments,
      icon: <FileText className="h-4 w-4" />,
      suggestion: "Request pending documents immediately",
      action: "Request Docs",
    },
    {
      id: "filing_delay",
      type: "filing_delay" as const,
      label: "Filing Delays",
      value: client.filingDelays,
      icon: <AlertTriangle className="h-4 w-4" />,
      suggestion: "Prioritize overdue filings to avoid penalties",
      action: "View Filings",
    },
    {
      id: "pending_fee",
      type: "pending_fee" as const,
      label: "Pending Fees",
      value: client.pendingFees,
      icon: <DollarSign className="h-4 w-4" />,
      suggestion: "Send payment reminder to client",
      action: "Send Payment Reminder",
    },
    {
      id: "inactivity",
      type: "inactivity" as const,
      label: "Communication Inactivity",
      value: client.communicationDays,
      icon: <Clock className="h-4 w-4" />,
      suggestion: "Client has been silent for days. Try calling directly.",
      action: "Call Client",
    },
  ].filter(i => i.value > 0);

  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-success";
    if (s >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{client.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Health Analysis & AI Recommendations</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center justify-center">
            <div className="relative">
              <HealthScoreRing score={client.healthScore} size="xl" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span className={cn("text-sm font-bold px-3 py-1 rounded-full", getScoreColor(client.healthScore))}>
                  {client.healthScore >= 70 ? "Healthy" : client.healthScore >= 40 ? "Needs Attention" : "Critical"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">AI Insights</h3>
            </div>
            {insights.length > 0 ? (
              insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      insight.value > 2 ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                    )}>
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{insight.label}</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          insight.value > 2 ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                        )}>
                          {insight.value} {insight.type === "late_reply" || insight.type === "inactivity" ? "days" : "items"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{insight.suggestion}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">All Clear!</p>
                <p className="text-xs text-muted-foreground">No issues detected for this client.</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h3 className="font-semibold text-sm">Recommended Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {insights.slice(0, 4).map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => onAction(insight.action)}
                  className="p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-left"
                >
                  <span className="text-xs font-medium text-primary">{insight.action}</span>
                  <ArrowRight className="h-3 w-3 text-primary mt-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-info" />
              <h3 className="font-semibold text-sm">Pending Tasks</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm">Complete GSTR-3B filing</span>
                <span className="text-xs text-warning">Due in 3 days</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm">Collect bank statements</span>
                <span className="text-xs text-destructive">Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ClientScoreCardProps {
  client: {
    id: string;
    name: string;
    healthScore: number;
    lateReplies?: number;
    missingDocuments?: number;
    filingDelays?: number;
    pendingFees?: number;
    communicationDays?: number;
    businessName?: string;
    phone?: string;
    whatsapp?: string;
  };
  onSelect: () => void;
  onWhatsApp?: () => void;
  onCall?: () => void;
  onRequestDocs?: () => void;
}

export function ClientScoreCard({ 
  client, 
  onSelect, 
  onWhatsApp, 
  onCall,
  onRequestDocs 
}: ClientScoreCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 70) return { bg: "bg-success/10", border: "border-success/30", text: "text-success", glow: "shadow-success/20" };
    if (s >= 40) return { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning", glow: "shadow-warning/20" };
    return { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", glow: "shadow-destructive/20" };
  };

  const colors = getScoreColor(client.healthScore);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative rounded-2xl p-4 bg-card border transition-all duration-300 cursor-pointer group",
          colors.border,
          `hover:shadow-lg ${colors.glow}`
        )}
        onClick={() => setShowDetails(true)}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ 
          background: colors.text,
          boxShadow: `0 0 20px ${colors.text}`
        }} />

        <div className="flex items-start gap-4">
          <HealthScoreRing score={client.healthScore} size="lg" />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{client.name}</h3>
            {client.businessName && (
              <p className="text-xs text-muted-foreground truncate">{client.businessName}</p>
            )}
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(client.missingDocuments ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  <FileText className="h-2.5 w-2.5" />
                  {client.missingDocuments} docs missing
                </span>
              )}
              {(client.filingDelays ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {client.filingDelays} delays
                </span>
              )}
              {(client.pendingFees ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                  <DollarSign className="h-2.5 w-2.5" />
                  Fees pending
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          {onWhatsApp && (
            <button
              onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors text-xs font-medium"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
          )}
          {onCall && (
            <button
              onClick={(e) => { e.stopPropagation(); onCall(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </button>
          )}
          {onRequestDocs && (
            <button
              onClick={(e) => { e.stopPropagation(); onRequestDocs(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-xs font-medium"
            >
              <FileText className="h-4 w-4" />
              Request Docs
            </button>
          )}
        </div>

        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <ClientHealthDetails
            client={{
              ...client,
              lateReplies: client.lateReplies ?? 0,
              missingDocuments: client.missingDocuments ?? 0,
              filingDelays: client.filingDelays ?? 0,
              pendingFees: client.pendingFees ?? 0,
              communicationDays: client.communicationDays ?? 0,
            }}
            onClose={() => setShowDetails(false)}
            onAction={(action) => {
              console.log("Action:", action);
              setShowDetails(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
