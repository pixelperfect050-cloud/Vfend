"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  FileText,
  Calendar,
  DollarSign,
  MessageCircle,
  ChevronRight,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HealthScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeConfig = {
  sm: { ring: 60, stroke: 4, text: "text-sm" },
  md: { ring: 80, stroke: 5, text: "text-lg" },
  lg: { ring: 100, stroke: 6, text: "text-xl" },
  xl: { ring: 140, stroke: 8, text: "text-3xl" },
};

export function HealthScoreRing({ 
  score, 
  size = "md", 
  showLabel = true, 
  animated = true,
  onClick,
  className 
}: HealthScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (s: number) => {
    if (s >= 70) return { stroke: "#22c55e", glow: "shadow-glow-green", text: "text-health-healthy" };
    if (s >= 40) return { stroke: "#f59e0b", glow: "shadow-glow-warning", text: "text-health-risky" };
    return { stroke: "#ef4444", glow: "shadow-glow-critical", text: "text-health-critical" };
  };
  
  const colors = getScoreColor(score);
  
  return (
    <motion.div 
      className={cn("relative inline-flex items-center justify-center", className)}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <svg width={config.ring} height={config.ring} className="transform -rotate-90">
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={config.stroke}
        />
        <motion.circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.stroke})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", colors.text, config.text)}>
          {animated ? (
            <motion.span
              initial={animated ? { opacity: 0 } : {}}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {score}
            </motion.span>
          ) : (
            score
          )}
        </span>
        {showLabel && size !== "sm" && (
          <span className="text-[10px] text-muted-foreground">SCORE</span>
        )}
      </div>
      {score < 40 && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AlertTriangle className="w-4 h-4 text-destructive" fill="#ef4444" />
        </motion.div>
      )}
    </motion.div>
  );
}

interface HealthScoreBreakdown {
  lateReplies: number;
  missingDocs: number;
  filingDelays: number;
  pendingFees: number;
  inactiveDays: number;
}

interface ScoreInsightModalProps {
  client: {
    name: string;
    healthScore: number;
    breakdown?: HealthScoreBreakdown;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ScoreInsightModal({ client, isOpen, onClose }: ScoreInsightModalProps) {
  const breakdown = client.breakdown || {
    lateReplies: Math.floor(Math.random() * 5),
    missingDocs: Math.floor(Math.random() * 3),
    filingDelays: Math.floor(Math.random() * 2),
    pendingFees: Math.floor(Math.random() * 2),
    inactiveDays: Math.floor(Math.random() * 10),
  };
  
  const getAISuggestions = () => {
    const suggestions = [];
    if (breakdown.missingDocs > 0) {
      suggestions.push({
        icon: FileText,
        title: "Missing Document Alert",
        desc: `${breakdown.missingDocs} document(s) pending - Request immediate upload`,
        action: "Send Document Request",
        priority: breakdown.missingDocs > 2 ? "urgent" : "high"
      });
    }
    if (breakdown.lateReplies > 0) {
      suggestions.push({
        icon: MessageCircle,
        title: "Communication Gap",
        desc: `${client.name} has ${breakdown.lateReplies} unread responses`,
        action: "Review Message History",
        priority: "medium"
      });
    }
    if (breakdown.filingDelays > 0) {
      suggestions.push({
        icon: Calendar,
        title: "Filing Deadline Risk",
        desc: `${breakdown.filingDelays} filing(s) approaching deadline`,
        action: "View Filing Schedule",
        priority: "high"
      });
    }
    if (breakdown.pendingFees > 0) {
      suggestions.push({
        icon: DollarSign,
        title: "Pending Payments",
        desc: `₹${breakdown.pendingFees * 5000}+ outstanding fees`,
        action: "Send Payment Reminder",
        priority: "medium"
      });
    }
    if (breakdown.inactiveDays > 7) {
      suggestions.push({
        icon: Clock,
        title: "Inactivity Warning",
        desc: `No activity for ${breakdown.inactiveDays} days`,
        action: "Schedule Check-in Call",
        priority: breakdown.inactiveDays > 14 ? "urgent" : "high"
      });
    }
    return suggestions;
  };
  
  const suggestions = getAISuggestions();
  
  const getStatusLabel = (score: number) => {
    if (score >= 70) return { label: "Healthy", color: "text-health-healthy", bg: "bg-health-healthy/10", icon: CheckCircle2 };
    if (score >= 40) return { label: "Risky", color: "text-health-risky", bg: "bg-health-risky/10", icon: AlertTriangle };
    return { label: "Critical", color: "text-health-critical", bg: "bg-health-critical/10", icon: AlertTriangle };
  };
  
  const status = getStatusLabel(client.healthScore);
  const StatusIcon = status.icon;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <Card className="bg-card border-border overflow-hidden">
              <div className={cn("p-4 flex items-center justify-between", status.bg)}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl", status.bg)}>
                    <StatusIcon className={cn("w-5 h-5", status.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <Badge variant="outline" className={cn("mt-1", status.color, status.bg)}>
                      {status.label}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <HealthScoreRing score={client.healthScore} size="xl" />
                    <motion.div
                      className="absolute -inset-4 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    AI Suggestions
                  </div>
                  
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all hover:scale-[1.02]",
                          suggestion.priority === "urgent" ? "bg-destructive/10 border-destructive/30" :
                          suggestion.priority === "high" ? "bg-warning/10 border-warning/30" :
                          "bg-muted border-border"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            suggestion.priority === "urgent" ? "bg-destructive/20" :
                            suggestion.priority === "high" ? "bg-warning/20" :
                            "bg-muted"
                          )}>
                            <suggestion.icon className={cn(
                              "w-4 h-4",
                              suggestion.priority === "urgent" ? "text-destructive" :
                              suggestion.priority === "high" ? "text-warning" :
                              "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{suggestion.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.desc}</p>
                            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs text-primary">
                              {suggestion.action} <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <MessageCircle className="w-4 h-4 text-whatsapp" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <FileText className="w-4 h-4" />
                    Request Docs
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ClientHealthCardProps {
  client: {
    id: string;
    name: string;
    businessName?: string;
    healthScore: number;
    riskLevel: "low" | "medium" | "high";
    documents: { status: string }[];
    filings: { status: string }[];
  };
  onScoreClick?: () => void;
}

export function ClientHealthCard({ client, onScoreClick }: ClientHealthCardProps) {
  const pendingDocs = client.documents.filter(d => d.status === "pending").length;
  const overdueFilings = client.filings.filter(f => f.status === "overdue").length;
  
  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-glow transition-all duration-300"
      hover
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <HealthScoreRing 
              score={client.healthScore} 
              size="md" 
              onClick={onScoreClick}
            />
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {client.name}
              </h3>
              <p className="text-sm text-muted-foreground">{client.businessName}</p>
            </div>
          </div>
          
          {client.riskLevel === "high" && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                High Risk
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          {pendingDocs > 0 && (
            <div className="flex items-center gap-1.5 text-warning">
              <FileText className="w-4 h-4" />
              <span>{pendingDocs} docs pending</span>
            </div>
          )}
          {overdueFilings > 0 && (
            <div className="flex items-center gap-1.5 text-destructive">
              <Calendar className="w-4 h-4" />
              <span>{overdueFilings} overdue</span>
            </div>
          )}
          {pendingDocs === 0 && overdueFilings === 0 && (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>All good</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1 text-whatsapp hover:text-whatsapp hover:bg-whatsapp/10">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              Call
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="w-4 h-4" />
              Docs
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
