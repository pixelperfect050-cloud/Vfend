"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-xl p-4 flex gap-3 items-start border",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        info: "bg-primary/5 border-primary/20",
        success: "bg-success/5 border-success/20",
        warning: "bg-warning/5 border-warning/20",
        destructive: "bg-destructive/5 border-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = {
  default: "text-muted-foreground",
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <div className={cn("shrink-0 mt-0.5", variant && iconVariants[variant as keyof typeof iconVariants])}>{icon}</div>}
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => {
  return <h5 className={cn("font-semibold text-sm mb-1", className)} {...props} />;
};

const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
};

export { Alert, AlertTitle, AlertDescription };