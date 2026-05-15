"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  label?: string;
  color?: "healthy" | "risky" | "critical";
  animated?: boolean;
}

const colorSchemes = {
  healthy: {
    stroke: "stroke-emerald-500",
    glow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  risky: {
    stroke: "stroke-amber-500",
    glow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    text: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  critical: {
    stroke: "stroke-red-500",
    glow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    text: "text-red-500",
    bg: "bg-red-500/10",
  },
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true,
  label,
  color = "healthy",
  animated = true,
}: CircularProgressProps) {
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  const animatedOffset = useTransform(springValue, [0, 100], [circumference, offset]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (animated) {
            springValue.set(value);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [springValue, value, animated]);

  if (!animated) {
    springValue.set(value);
  }

  const scheme = colorSchemes[color];

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className={cn("-rotate-90", scheme.glow)}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200 dark:text-zinc-800"
        />
        {isInView && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={scheme.stroke}
            style={{ pathLength: animatedOffset }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animated ? undefined : value / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-2xl font-bold", scheme.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.5 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {value}%
          </motion.span>
          {label && (
            <motion.span
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {label}
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}

interface HealthScoreRingProps {
  healthScore: number;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export function HealthScoreRing({ healthScore, size = 80, onClick, className }: HealthScoreRingProps) {
  const color = healthScore >= 70 ? "healthy" : healthScore >= 40 ? "risky" : "critical";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative cursor-pointer group",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity",
        colorSchemes[color].bg
      )} />
      <CircularProgress
        value={healthScore}
        size={size}
        strokeWidth={6}
        color={color}
        showValue={true}
      />
    </motion.button>
  );
}

interface MultiRingProgressProps {
  metrics: {
    label: string;
    value: number;
    max?: number;
  }[];
  size?: number;
}

export function MultiRingProgress({ metrics, size = 160 }: MultiRingProgressProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {metrics.map((metric, index) => {
          const radius = (size - 16) / 2 - index * 14;
          const circumference = radius * 2 * Math.PI;
          const offset = circumference - ((metric.value / (metric.max || 100)) * circumference);
          const color = metric.value >= 70 ? colorSchemes.healthy : metric.value >= 40 ? colorSchemes.risky : colorSchemes.critical;

          return (
            <circle
              key={metric.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={6}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={color.stroke}
              style={{
                filter: `drop-shadow(0 0 4px ${color.stroke.replace('stroke-', 'rgba(').replace('-500', ',0.5)')})`,
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">
          {Math.round(metrics.reduce((acc, m) => acc + m.value / (m.max || 100), 0) / metrics.length * 100)}%
        </span>
        <span className="text-[10px] text-muted-foreground">Health</span>
      </div>
    </div>
  );
}
