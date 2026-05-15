"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva("h-2 w-full overflow-hidden rounded-full bg-secondary", {
  variants: {
    variant: {
      default: "",
      success: "",
      warning: "",
      destructive: "",
    },
    size: {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const indicatorVariants = cva("h-full transition-all duration-500 ease-out rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  value?: number;
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, size, value = 0, showLabel, label, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const displayVariant = !variant
      ? (clampedValue >= 70 ? "success" : clampedValue >= 40 ? "warning" : "default")
      : variant;

    return (
      <div className="w-full">
        {(showLabel || label) && (
          <div className="flex justify-between mb-1.5">
            {label && <span className="text-sm font-medium text-foreground/80">{label}</span>}
            {showLabel && <span className="text-sm font-medium text-foreground">{clampedValue}%</span>}
          </div>
        )}
        <div ref={ref} className={cn(progressVariants({ variant, size }), className)} {...props}>
          <div
            className={cn(indicatorVariants({ variant: displayVariant }))}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress, progressVariants, indicatorVariants };
