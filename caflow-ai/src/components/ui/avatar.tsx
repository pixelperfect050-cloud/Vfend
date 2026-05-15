"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-purple-500/30 font-semibold text-primary">
            {fallback || "?"}
          </span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
