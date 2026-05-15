export type UserRole = "admin" | "staff" | "client";

export type DocumentStatus = "pending" | "received" | "verified" | "rejected";

export type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type BusinessType = 
  | "proprietorship"
  | "partnership"
  | "llp"
  | "private_ltd"
  | "public_ltd"
  | "trust"
  | "society"
  | "other";

export type FilingType = "gst" | "itr" | "tds" | "audit" | "other";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastActive?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: "en" | "hi" | "both";
  darkMode: boolean;
  notifications: boolean;
  emailAlerts: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  gstNumber?: string;
  panNumber?: string;
  businessType: BusinessType;
  businessName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  assignedStaff?: string;
  healthScore: number;
  riskLevel: "low" | "medium" | "high";
  status: "active" | "inactive" | "prospect";
  createdAt: Date;
  lastActivity?: Date;
  notes?: string;
  documents: ClientDocument[];
  filings: Filing[];
  payments: Payment[];
}

export interface ClientDocument {
  id: string;
  clientId: string;
  type: DocumentType;
  name: string;
  fileUrl?: string;
  status: DocumentStatus;
  requiredFor: FilingType[];
  uploadedAt?: Date;
  verifiedAt?: Date;
  notes?: string;
}

export type DocumentType = 
  | "gstr1"
  | "gstr3b"
  | "itr_form"
  | "pan_card"
  | "aadhar_card"
  | "bank_statement"
  | "balance_sheet"
  | "p_l_statement"
  | "invoice"
  | "receipt"
  | "expense_voucher"
  | "other";

export interface Filing {
  id: string;
  clientId: string;
  type: FilingType;
  period: string;
  dueDate: Date;
  status: "pending" | "in_progress" | "filed" | "overdue" | "cancelled";
  filedAt?: Date;
  acknowledgmentNumber?: string;
  amount?: number;
  penalty?: number;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  type: "consultation" | "filing" | "additional" | "subscription";
  status: "pending" | "paid" | "overdue";
  dueDate: Date;
  paidAt?: Date;
  method?: "upi" | "bank_transfer" | "cash" | "cheque";
  transactionId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientId?: string;
  assignedTo: string;
  assignedBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  filingType?: FilingType;
  completedAt?: Date;
  createdAt: Date;
  order?: number;
  voiceNote?: string;
  tags?: string[];
}

export interface Reminder {
  id: string;
  clientId: string;
  type: "document" | "payment" | "filing" | "custom";
  message: string;
  language: "en" | "hi" | "both";
  scheduledFor: Date;
  sentAt?: Date;
  status: "scheduled" | "sent" | "failed";
  reminderLevel: number;
  createdBy: string;
  whatsapp?: boolean;
}

export interface Activity {
  id: string;
  clientId?: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type ActivityType = 
  | "client_added"
  | "document_uploaded"
  | "document_verified"
  | "filing_completed"
  | "payment_received"
  | "task_created"
  | "task_completed"
  | "reminder_sent"
  | "note_added"
  | "client_updated";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface AISuggestion {
  id: string;
  type: "document_missing" | "deadline_approaching" | "client_inactive" | "payment_overdue" | "risk_alert";
  title: string;
  description: string;
  clientId?: string;
  priority: TaskPriority;
  actionRequired: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalClients: number;
  pendingDocuments: number;
  gstDue: number;
  itrDue: number;
  pendingPayments: number;
  staffWorkload: StaffWorkload[];
  urgentAlerts: number;
  recentActivity: Activity[];
  aiSuggestions: AISuggestion[];
}

export interface StaffWorkload {
  staffId: string;
  staffName: string;
  activeTasks: number;
  completedTasks: number;
  delayedTasks: number;
}

export interface AnalyticsData {
  monthlyFilings: MonthlyFiling[];
  clientGrowth: ClientGrowth[];
  revenueOverview: RevenueOverview[];
  pendingWork: PendingWork[];
  staffPerformance: StaffPerformance[];
  workloadHeatmap: WorkloadHeatmap[];
}

export interface MonthlyFiling {
  month: string;
  gst: number;
  itr: number;
  tds: number;
  audit: number;
}

export interface ClientGrowth {
  month: string;
  new: number;
  active: number;
  inactive: number;
}

export interface RevenueOverview {
  month: string;
  revenue: number;
  expenses: number;
}

export interface PendingWork {
  type: FilingType;
  count: number;
  critical: number;
}

export interface StaffPerformance {
  staffId: string;
  name: string;
  tasksCompleted: number;
  avgCompletionTime: number;
  rating: number;
}

export interface WorkloadHeatmap {
  day: string;
  morning: number;
  afternoon: number;
  evening: number;
}

export interface HealthScoreBreakdown {
  lateReplies: { score: number; count: number; days: number };
  missingDocuments: { score: number; count: number; types: string[] };
  filingDelays: { score: number; count: number; overdueDays: number };
  pendingFees: { score: number; amount: number; overdueDays: number };
  communicationInactivity: { score: number; daysSinceContact: number };
}
