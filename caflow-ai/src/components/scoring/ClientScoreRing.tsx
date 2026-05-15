"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  MessageCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientScoreProps {
  score: number;
  factors: ScoreFactor[];
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  interactive?: boolean;
}

interface ScoreFactor {
  type: "late_replies" | "missing_docs" | "filing_delays" | "pending_fees" | "inactivity";
  value: number;
  maxValue: number;
  label: string;
  icon: React.ReactNode;
}

export function ClientScoreRing({ 
  score, 
  factors, 
  onClick,
  size = "md", 
  showGlow = true,
  interactive = true 
}: ClientScoreProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const sizes = {
    sm: { ring: 60, stroke: 6, text: "text-lg" },
    md: { ring: 100, stroke: 8, text: "text-3xl" },
    lg: { ring: 140, stroke: 10, text: "text-5xl" },
  };

  const { ring, stroke, text } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 70) return { stroke: "#22c55e", fill: "text-green-500", glow: "rgba(34, 197, 94, 0.4)" };
    if (score >= 40) return { stroke: "#f59e0b", fill: "text-amber-500", glow: "rgba(245, 158, 11, 0.4)" };
    return { stroke: "#ef4444", fill: "text-red-500", glow: "rgba(239, 68, 68, 0.4)" };
  };

  const colors = getScoreColor(score);

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    } else if (interactive) {
      setDetailsOpen(true);
    }
  };

  return (
    <>
      <motion.div 
        className={cn(
          "relative cursor-pointer",
          interactive && "hover:scale-105 transition-transform"
        )}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
      >
        {showGlow && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: colors.glow }}
            animate={{ opacity: isHovered ? 0.8 : 0.4 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <svg width={ring} height={ring} className="transform -rotate-90">
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
          />
          <motion.circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={cn("font-bold", colors.fill, text)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">score</span>
        </div>

        {interactive && (
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            <Badge variant="gradient" size="sm" className="shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              Click for insights
            </Badge>
          </motion.div>
        )}
      </motion.div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Insights & Actions
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown of your client&apos;s health score
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <svg width={120} height={120} className="transform -rotate-90">
                  <circle
                    cx={60}
                    cy={60}
                    r={50}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={10}
                    className="text-muted/20"
                  />
                  <circle
                    cx={60}
                    cy={60}
                    r={50}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={314}
                    strokeDashoffset={314 - (score / 100) * 314}
                    style={{ filter: `drop-shadow(0 0 6px ${colors.stroke})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn("text-4xl font-bold", colors.fill)}>{score}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Score Breakdown</h4>
              {factors.map((factor, index) => {
                const percentage = Math.round((factor.value / factor.maxValue) * 100);
                const isNegative = percentage < 50;
                
                return (
                  <motion.div
                    key={factor.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isNegative ? "bg-destructive/10" : "bg-success/10"
                        )}>
                          {factor.icon}
                        </div>
                        <span className="text-sm font-medium">{factor.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isNegative ? (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-success" />
                        )}
                        <span className={cn(
                          "text-sm font-bold",
                          isNegative ? "text-destructive" : "text-success"
                        )}>
                          {factor.value}/{factor.maxValue}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          isNegative ? "bg-destructive" : "bg-success"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-sm mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {factors.filter(f => (f.value / f.maxValue) < 0.5).map((factor) => (
                  <div key={factor.type} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Address {factor.label.toLowerCase()} issues</span>
                  </div>
                ))}
                <Button variant="gradient" className="w-full mt-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Action Plan
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ScoreCard({ 
  score, 
  factors, 
  clientName,
  onClick 
}: { 
  score: number; 
  factors: ScoreFactor[];
  clientName: string;
  onClick?: () => void;
}) {
  const getStatus = (score: number) => {
    if (score >= 70) return { label: "Healthy", color: "text-green-500", bg: "bg-green-500/10" };
    if (score >= 40) return { label: "Risky", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Critical", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const status = getStatus(score);

  return (
    <motion.div 
      className="relative bg-card rounded-2xl p-6 border border-border/50 hover:border-border transition-all cursor-pointer group"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      
      <div className="relative flex items-start gap-4">
        <ClientScoreRing score={score} factors={factors} size="md" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{clientName}</h3>
            <Badge className={status.bg} variant="outline">
              <span className={cn("w-2 h-2 rounded-full mr-1.5", status.color.replace("text-", "bg-"))} />
              {status.label}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {score >= 70 ? "All compliance metrics looking good" : 
             score >= 40 ? "Some issues need attention" : 
             "Immediate action required"}
          </p>

          <div className="flex flex-wrap gap-2">
            {factors.filter(f => f.value > 0).slice(0, 3).map((factor) => (
              <Badge key={factor.type} variant="outline" size="sm" className="text-xs">
                {factor.icon}
                <span className="ml-1">{factor.label}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

export function getScoreFactors(client: {
  healthScore: number;
  lastActivity?: Date;
  documents: { status: string }[];
  filings: { status: string }[];
  payments: { status: string }[];
}): ScoreFactor[] {
  const daysSinceLastActivity = client.lastActivity 
    ? Math.floor((Date.now() - new Date(client.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    : 30;

  const pendingDocs = client.documents.filter(d => d.status === "pending").length;
  const overdueFilings = client.filings.filter(f => f.status === "overdue").length;
  const pendingFees = client.payments.filter(p => p.status === "overdue" || p.status === "pending").length;

  return [
    {
      type: "late_replies",
      value: Math.max(0, 20 - daysSinceLastActivity * 0.5),
      maxValue: 20,
      label: "Late Replies",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      type: "missing_docs",
      value: pendingDocs * 5,
      maxValue: 25,
      label: "Missing Documents",
      icon: <FileText className="h-4 w-4 text-red-500" />,
    },
    {
      type: "filing_delays",
      value: overdueFilings * 10,
      maxValue: 30,
      label: "Filing Delays",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    },
    {
      type: "pending_fees",
      value: pendingFees * 5,
      maxValue: 15,
      label: "Pending Fees",
      icon: <DollarSign className="h-4 w-4 text-amber-500" />,
    },
    {
      type: "inactivity",
      value: Math.min(10, daysSinceLastActivity / 5),
      maxValue: 10,
      label: "Inactivity",
      icon: <MessageCircle className="h-4 w-4 text-amber-500" />,
    },
  ];
}