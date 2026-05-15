"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "circular" | "rectangular" | "text";
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
          {
            "rounded-full": variant === "circular",
            "rounded-xl": variant === "rectangular",
            "rounded h-4": variant === "text",
          },
          className
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
