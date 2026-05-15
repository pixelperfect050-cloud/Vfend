"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = "right", className }) => {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={cn("absolute z-50 mt-2 w-56 rounded-xl border bg-card py-1 shadow-lg animate-scale-in origin-top", alignClasses[align], className)}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
  divider?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ className, icon, destructive, divider, children, ...props }) => {
  if (divider) {
    return <div className="my-1 h-px bg-border" />;
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted",
        destructive && "text-destructive hover:bg-destructive/10",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
};

export { Dropdown, DropdownItem };
