"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const Tabs: React.FC<TabsProps> = ({ defaultValue = "", value: controlledValue, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const onValueChangeHandler = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: onValueChangeHandler }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground", className)}>
      {children}
    </div>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className, disabled }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  const isActive = context.value === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:text-foreground/80",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
