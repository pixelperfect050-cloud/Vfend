"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "gradient";
  size?: "sm" | "default" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-colors",
          {
            "bg-primary/10 text-primary": variant === "default",
            "bg-secondary text-secondary-foreground": variant === "secondary",
            "bg-success/10 text-success": variant === "success",
            "bg-warning/10 text-warning": variant === "warning",
            "bg-destructive/10 text-destructive": variant === "destructive",
            "border border-border bg-transparent": variant === "outline",
            "bg-gradient-to-r from-primary to-purple-600 text-white": variant === "gradient",
          },
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-sm": size === "default",
            "px-3 py-1.5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
