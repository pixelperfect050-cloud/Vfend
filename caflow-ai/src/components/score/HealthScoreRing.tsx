"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { size: 48, strokeWidth: 4, fontSize: "text-xs" },
  md: { size: 80, strokeWidth: 6, fontSize: "text-lg" },
  lg: { size: 120, strokeWidth: 8, fontSize: "text-2xl" },
};

export function HealthScoreRing({
  score,
  size = "md",
  showLabel = true,
  animated = true,
  className,
}: HealthScoreRingProps) {
  const [mounted, setMounted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const { size: svgSize, strokeWidth, fontSize } = sizeConfig[size];

  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = animated ? (displayScore / 100) * circumference : (score / 100) * circumference;

  useEffect(() => {
    setMounted(true);
    if (animated) {
      const startTime = Date.now();
      const duration = 1500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(easeOut * score));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [animated, score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return { color: "#22c55e", glow: "rgba(34, 197, 94, 0.4)", label: "Healthy" };
    if (s >= 60) return { color: "#eab308", glow: "rgba(234, 179, 8, 0.4)", label: "Moderate" };
    if (s >= 40) return { color: "#f97316", glow: "rgba(249, 115, 22, 0.4)", label: "Risky" };
    return { color: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", label: "Critical" };
  };

  const { color, glow, label } = getScoreColor(mounted ? displayScore : score);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={svgSize}
        height={svgSize}
        className="transform -rotate-90"
      >
        <defs>
          <filter id={`glow-${score}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200 dark:text-zinc-800"
        />

        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          filter={`url(#glow-${score})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius - strokeWidth - 4}
          fill="currentColor"
          className="text-white dark:text-zinc-900 opacity-30"
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", fontSize)} style={{ color }}>
            {mounted ? displayScore : 0}%
          </span>
          {size === "lg" && (
            <span className="text-[10px] font-medium opacity-70">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface HealthScoreDetailRingProps {
  score: number;
  category: string;
  icon: React.ReactNode;
  details: Array<{ label: string; value: number; max: number }>;
}

export function HealthScoreDetailRing({
  score,
  category,
  icon,
  details,
}: HealthScoreDetailRingProps) {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-yellow-500";
    if (s >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div
      className="relative p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4">
        <HealthScoreRing score={score} size="sm" />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-zinc-900 dark:text-white">{category}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", getScoreColor(score).replace("text-", "bg-"))}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className={cn("text-sm font-semibold", getScoreColor(score))}>{score}%</span>
          </div>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2"
        >
          {details.map((detail, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">{detail.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 rounded-full"
                    style={{ width: `${(detail.value / detail.max) * 100}%` }}
                  />
                </div>
                <span className="text-zinc-600 dark:text-zinc-400 w-16 text-right">
                  {detail.value}/{detail.max}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
