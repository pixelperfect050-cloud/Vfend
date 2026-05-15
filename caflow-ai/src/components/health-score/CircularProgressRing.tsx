"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CircularProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
}

const getColorForScore = (value: number) => {
  if (value >= 70) {
    return {
      stroke: "url(#healthyGradient)",
      glow: "rgba(34, 197, 94, 0.5)",
      text: "text-green-500",
      label: "Healthy",
    };
  } else if (value >= 40) {
    return {
      stroke: "url(#riskyGradient)",
      glow: "rgba(234, 179, 8, 0.5)",
      text: "text-yellow-500",
      label: "Risky",
    };
  }
  return {
    stroke: "url(#criticalGradient)",
    glow: "rgba(239, 68, 68, 0.5)",
    text: "text-red-500",
    label: "Critical",
  };
};

export function CircularProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className = "",
  onClick,
  showValue = true,
  label,
  animated = true,
}: CircularProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const [isHovered, setIsHovered] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);
  const colors = getColorForScore(value);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, animated]);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="healthyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="riskyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
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
          className="text-zinc-200 dark:text-zinc-800"
        />

        <motion.circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: offset,
            filter: isHovered ? "url(#glow)" : "none",
          }}
          transition={{
            strokeDashoffset: { duration: 1.5, ease: "easeOut" },
            filter: { duration: 0.3 },
          }}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.glow}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="opacity-30 blur-sm"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            className={`text-2xl font-bold ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {displayValue}
          </motion.span>
        )}
        {(label || colors.label) && (
          <span className={`text-xs font-medium ${colors.text} opacity-80`}>
            {label || colors.label}
          </span>
        )}
      </div>

      {onClick && (
        <motion.div
          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
        >
          <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
