"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, message, type = "info", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  };

  const colors = {
    success: "border-emerald-500/20 bg-emerald-500/10",
    error: "border-destructive/20 bg-destructive/10",
    info: "border-blue-500/20 bg-blue-500/10",
    warning: "border-amber-500/20 bg-amber-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px] max-w-md pointer-events-auto",
        colors[type]
      )}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold mb-0.5">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-lg hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Omit<ToastProps, "onClose">[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<ToastProps, "id" | "onClose">) => void;
} | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
