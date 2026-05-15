"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency, formatDate, getDaysUntil, getPriorityColor, getStatusColor } from "@/lib/utils";
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Bell,
  Sparkles,
  FileCheck,
  Wallet,
  UserPlus,
  Timer
} from "lucide-react";
import { DEMO_DASHBOARD_STATS, DEMO_CLIENTS, DEMO_TASKS, DEMO_AI_SUGGESTIONS } from "@/lib/data";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "destructive" | "info";
  trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, change, changeLabel, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-blue-500/10 text-blue-500",
  };

  return (
    <motion.div variants={itemVariants}>
      <Card hover className="h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={cn("p-2.5 rounded-xl", colorClasses[color])}>
              {icon}
            </div>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
          {changeLabel && (
            <p className="text-xs text-muted-foreground mt-2">{changeLabel}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardStats() {
  const stats = DEMO_DASHBOARD_STATS;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatCard
        title="Total Clients"
        value={stats.totalClients}
        change={12}
        changeLabel="vs last month"
        icon={<Users className="h-5 w-5" />}
        color="primary"
        trend="up"
      />
      <StatCard
        title="Pending Documents"
        value={stats.pendingDocuments}
        change={-8}
        changeLabel="vs last week"
        icon={<FileText className="h-5 w-5" />}
        color="warning"
        trend="down"
      />
      <StatCard
        title="GST Returns Due"
        value={stats.gstDue}
        icon={<AlertTriangle className="h-5 w-5" />}
        color="destructive"
      />
      <StatCard
        title="Pending Payments"
        value={formatCurrency(45000)}
        icon={<DollarSign className="h-5 w-5" />}
        color="info"
      />
    </motion.div>
  );
}

export function RecentActivity() {
  const activities = DEMO_DASHBOARD_STATS.recentActivity.slice(0, 5);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_uploaded":
        return <FileText className="h-4 w-4 text-primary" />;
      case "filing_completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "reminder_sent":
        return <Bell className="h-4 w-4 text-warning" />;
      case "client_updated":
        return <UserPlus className="h-4 w-4 text-info" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1 p-2 rounded-lg bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{formatDate(activity.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StaffWorkload() {
  const workloads = DEMO_DASHBOARD_STATS.staffWorkload;
  
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Workload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workloads.map((workload) => (
            <div key={workload.staffId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar size="sm" fallback={workload.staffName[0]} />
                  <span className="text-sm font-medium">{workload.staffName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="success" size="sm">{workload.completedTasks} done</Badge>
                  {workload.delayedTasks > 0 && (
                    <Badge variant="destructive" size="sm">{workload.delayedTasks} delayed</Badge>
                  )}
                </div>
              </div>
              <Progress 
                value={(workload.activeTasks / (workload.activeTasks + workload.completedTasks)) * 100} 
                variant={(workload.activeTasks / (workload.activeTasks + workload.completedTasks)) > 0.7 ? "warning" : "default"}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function UpcomingDeadlines() {
  const tasks = DEMO_TASKS.filter(t => t.status !== "completed").slice(0, 4);
  
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Deadlines
            </CardTitle>
            <Link href="/dashboard/tasks" className="text-sm text-primary hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => {
            const daysLeft = getDaysUntil(task.dueDate);
            const client = DEMO_CLIENTS.find(c => c.id === task.clientId);
            
            return (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", getPriorityColor(task.priority).replace("bg-", "bg-/10").replace("text-", "text-"))}>
                    <Timer className={cn("h-4 w-4", getPriorityColor(task.priority).replace("bg-", "text-").replace("text-", ""))} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{client?.name}</p>
                  </div>
                </div>
                <Badge 
                  variant={daysLeft < 3 ? "destructive" : daysLeft < 7 ? "warning" : "secondary"}
                  size="sm"
                >
                  {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AISuggestions() {
  const suggestions = DEMO_AI_SUGGESTIONS.slice(0, 3);
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Suggestions
            <Badge variant="gradient" size="sm">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-3 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={cn("p-1.5 rounded-lg mt-0.5", getPriorityColor(suggestion.priority))}>
                  <Zap className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                  <p className="text-xs text-primary mt-2 font-medium">{suggestion.actionRequired} →</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FilingStatusChart() {
  const data = [
    { name: "GST", completed: 45, pending: 12, overdue: 5 },
    { name: "ITR", completed: 32, pending: 8, overdue: 3 },
    { name: "TDS", completed: 28, pending: 5, overdue: 2 },
    { name: "Audit", completed: 15, pending: 4, overdue: 1 },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Filing Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ClientHealthScore() {
  const clients = DEMO_CLIENTS.slice(0, 4);
  
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Client Health
            </CardTitle>
            <Link href="/dashboard/clients" className="text-sm text-primary hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center gap-3">
              <Avatar size="sm" fallback={client.name[0]} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{client.name}</p>
                  <span className={cn("text-xs font-medium",
                    client.healthScore >= 70 ? "text-success" : client.healthScore >= 40 ? "text-warning" : "text-destructive"
                  )}>
                    {client.healthScore}%
                  </span>
                </div>
                <Progress value={client.healthScore} size="sm" className="mt-1.5" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function QuickActions() {
  const actions = [
    { label: "Send Reminder", icon: Bell, color: "text-primary", href: "/dashboard/reminders" },
    { label: "Add Client", icon: UserPlus, color: "text-success", href: "/dashboard/clients?add=true" },
    { label: "View Tasks", icon: CheckCircle2, color: "text-warning", href: "/dashboard/tasks" },
    { label: "Analytics", icon: BarChart, color: "text-info", href: "/dashboard/analytics" },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <action.icon className={cn("h-5 w-5", action.color)} />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
