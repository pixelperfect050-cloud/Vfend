"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthScoreProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: { svg: 48, stroke: 4, text: "text-sm", ring: 2 },
  md: { svg: 72, stroke: 5, text: "text-lg", ring: 3 },
  lg: { svg: 96, stroke: 6, text: "text-2xl", ring: 4 },
  xl: { svg: 140, stroke: 8, text: "text-4xl", ring: 5 },
};

export function AnimatedHealthScore({
  score,
  size = "md",
  showLabel = true,
  interactive = true,
  onClick,
  className
}: HealthScoreProps) {
  const dimensions = sizeMap[size];
  const radius = (dimensions.svg - dimensions.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const [animatedScore, setAnimatedScore] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 70) return { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.5)", label: "Healthy" };
    if (s >= 40) return { stroke: "#eab308", glow: "rgba(234, 179, 8, 0.5)", label: "Risky" };
    return { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.5)", label: "Critical" };
  };

  const colors = getScoreColor(score);

  const Content = (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={dimensions.svg}
        height={dimensions.svg}
        className={cn(animatedScore > 0 && "drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]")}
        style={{ filter: `drop-shadow(0 0 ${dimensions.ring * 2}px ${colors.glow})` }}
      >
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.stroke} />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        <motion.circle
          cx={dimensions.svg / 2}
          cy={dimensions.svg / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={dimensions.stroke}
          opacity={0.2}
        />
        
        <motion.circle
          cx={dimensions.svg / 2}
          cy={dimensions.svg / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${score})`}
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        
        <motion.circle
          cx={dimensions.svg / 2}
          cy={dimensions.svg / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={dimensions.stroke / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", opacity: 0.4 }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn(
            "font-bold tabular-nums",
            dimensions.text,
            colors.stroke === "#22c55e" && "text-green-500",
            colors.stroke === "#eab308" && "text-yellow-500",
            colors.stroke === "#ef4444" && "text-red-500"
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {animatedScore}
        </motion.span>
        {showLabel && (
          <motion.span
            className="text-[8px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {colors.label}
          </motion.span>
        )}
      </div>

      {interactive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-purple-500/5 animate-pulse" />
        </motion.div>
      )}
    </div>
  );

  if (interactive && onClick) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="focus:outline-none"
      >
        {Content}
      </motion.button>
    );
  }

  return Content;
}

interface HealthScoreBreakdownProps {
  lateReplies: number;
  missingDocs: number;
  filingDelays: number;
  pendingFees: number;
  inactivityDays: number;
}

export function HealthScoreBreakdown({
  lateReplies,
  missingDocs,
  filingDelays,
  pendingFees,
  inactivityDays
}: HealthScoreBreakdownProps) {
  const factors = [
    { label: "Late Replies", value: lateReplies, max: 10, icon: "💬", color: "text-blue-500", impact: -lateReplies * 2 },
    { label: "Missing Docs", value: missingDocs, max: 5, icon: "📄", color: "text-orange-500", impact: -missingDocs * 5 },
    { label: "Filing Delays", value: filingDelays, max: 3, icon: "⏰", color: "text-red-500", impact: -filingDelays * 10 },
    { label: "Pending Fees", value: pendingFees, max: 2, icon: "💰", color: "text-purple-500", impact: -pendingFees * 15 },
    { label: "Inactivity", value: inactivityDays, max: 30, icon: "📱", color: "text-gray-500", impact: -Math.floor(inactivityDays / 7) * 5 },
  ];

  return (
    <div className="space-y-3">
      {factors.map((factor, index) => (
        factor.value > 0 && (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{factor.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{factor.label}</span>
                <span className={cn("text-xs font-semibold", factor.color)}>
                  {factor.impact}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", factor.color.replace("text-", "bg-"))}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((factor.value / factor.max) * 100, 100)}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )
      ))}
    </div>
  );
}
