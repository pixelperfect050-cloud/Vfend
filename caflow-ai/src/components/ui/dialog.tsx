"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => onOpenChange?.(false)} />
          {children}
        </>
      )}
    </>
  );
};

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className={cn("pointer-events-auto w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl animate-scale-in", className)}>
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
};

const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <p className={cn("text-sm text-muted-foreground mt-1", className)}>{children}</p>;
};

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={cn("flex justify-end gap-3 mt-6", className)}>{children}</div>;
};

const DialogClose: React.FC<{ onClose: () => void; className?: string }> = ({ onClose, className }) => {
  return (
    <button onClick={onClose} className={cn("absolute right-4 top-4 rounded-full p-1.5 hover:bg-muted transition-colors", className)}>
      <X className="h-4 w-4" />
    </button>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };
