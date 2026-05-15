import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysUntil(date: Date | string): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysSince(date: Date | string): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = today.getTime() - d.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getRiskColor(score: number): string {
  if (score >= 70) return "text-destructive";
  if (score >= 40) return "text-warning";
  return "text-success";
}

export function getRiskBgColor(score: number): string {
  if (score >= 70) return "bg-destructive/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-success/10";
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-orange-500";
  return "text-destructive";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-warning text-warning-foreground";
    case "medium":
      return "bg-primary/20 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
    case "filed":
    case "paid":
    case "verified":
      return "bg-success/10 text-success";
    case "in_progress":
    case "received":
      return "bg-primary/10 text-primary";
    case "delayed":
    case "overdue":
    case "rejected":
    case "pending":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const REMINDER_TEMPLATES = {
  document: {
    en: {
      day1: "Dear Client, kindly upload the required documents at your earliest convenience for smooth processing.",
      day5: "Kind reminder: Some documents are still pending. Delay may affect filing deadlines.",
      day10: "Important: Missing documents may lead to penalty. Please upload them immediately.",
    },
    hi: {
      day1: "प्रिय ग्राहक, कृपया आवश्यक दस्तावेज़ जल्द से जल्द अपलोड करें।",
      day5: "कुछ दस्तावेज़ अभी भी लंबित हैं। विलंब से फाइलिंग प्रभावित हो सकती है।",
      day10: "महत्वपूर्ण: अपूर्ण दस्तावेज़ों के कारण जुर्माना लग सकता है।",
    },
  },
  payment: {
    en: {
      day1: "Dear Client, a payment of ₹{amount} is pending. Please clear the dues at the earliest.",
      day5: "Reminder: Payment pending for {days} days. Please clear to avoid service interruption.",
      day10: "Final reminder: Outstanding payment may affect ongoing work. Please clear dues immediately.",
    },
    hi: {
      day1: "प्रिय ग्राहक, ₹{amount} की भुगतान राशि बकाया है।",
      day5: "रिमाइंडर: {days} दिनों से भुगतान लंबित है।",
      day10: "अंतिम रिमाइंडर: बकाया भुगतान से कार्य प्रभावित हो सकता है।",
    },
  },
  filing: {
    en: {
      day1: "Dear Client, GSTR-1/ITR filing deadline is approaching on {date}. Please ensure all documents are ready.",
      day5: "Urgent: Filing deadline in {days} days. Please submit pending documents immediately.",
      day10: "Final Warning: Filing deadline is tomorrow. Please clear all pending items now.",
    },
    hi: {
      day1: "प्रिय ग्राहक, GSTR-1/ITR फाइलिंग की समय सीमा {date} को आ रही है।",
      day5: "जरूरी: फाइलिंग समय सीमा {days} दिनों में है।",
      day10: "अंतिम चेतावनी: फाइलिंग समय सीमा कल है।",
    },
  },
};
