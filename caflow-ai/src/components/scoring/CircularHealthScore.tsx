"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
  color?: "healthy" | "risky" | "critical";
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
  animated = true,
  color = "healthy",
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const getColor = () => {
    switch (color) {
      case "healthy":
        return {
          stroke: "#22c55e",
          glow: "rgba(34, 197, 94, 0.5)",
          text: "text-emerald-500",
        };
      case "risky":
        return {
          stroke: "#eab308",
          glow: "rgba(234, 179, 8, 0.5)",
          text: "text-yellow-500",
        };
      case "critical":
        return {
          stroke: "#ef4444",
          glow: "rgba(239, 68, 68, 0.5)",
          text: "text-red-500",
        };
    }
  };

  const colors = getColor();

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <filter id={`glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#glow-${color})`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? undefined : strokeDashoffset,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.2,
          }}
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          opacity={0.3}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            filter: `blur(8px)`,
          }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-2xl font-bold", colors.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {animated ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(normalizedValue)}
              </motion.span>
            ) : (
              Math.round(normalizedValue)
            )}
          </motion.span>
          <span className="text-xs text-muted-foreground">Health</span>
        </div>
      )}

      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.8, 1.2, 1.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5,
          }}
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

interface HealthScoreDetailProps {
  lateReplies: number;
  missingDocs: number;
  filingDelays: number;
  pendingFees: number;
  communicationDays: number;
  score: number;
}

export function HealthScoreBreakdown({
  lateReplies,
  missingDocs,
  filingDelays,
  pendingFees,
  communicationDays,
  score,
}: HealthScoreDetailProps) {
  const getStatus = () => {
    if (score >= 80) return { label: "Healthy", color: "text-emerald-500", bg: "bg-emerald-500" };
    if (score >= 50) return { label: "Risky", color: "text-yellow-500", bg: "bg-yellow-500" };
    return { label: "Critical", color: "text-red-500", bg: "bg-red-500" };
  };

  const status = getStatus();

  const factors = [
    { label: "Late Replies", value: lateReplies, max: 10, penalty: lateReplies * 2 },
    { label: "Missing Docs", value: missingDocs, max: 5, penalty: missingDocs * 5 },
    { label: "Filing Delays", value: filingDelays, max: 3, penalty: filingDelays * 10 },
    { label: "Pending Fees", value: pendingFees, max: 50000, penalty: (pendingFees / 50000) * 15 },
    { label: "Inactivity", value: communicationDays, max: 30, penalty: (communicationDays / 30) * 20 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Overall Score</span>
        <div className="flex items-center gap-2">
          <span className={cn("font-bold text-lg", status.color)}>{score}</span>
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium text-white", status.bg)}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{factor.label}</span>
              <span className="font-medium">
                {typeof factor.value === "number" && factor.max > 100
                  ? `${factor.value} days`
                  : `${factor.value}/${factor.max}`}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", factor.penalty > 30 ? "bg-red-500" : factor.penalty > 15 ? "bg-yellow-500" : "bg-emerald-500")}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (factor.value / factor.max) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
