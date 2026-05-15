"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { DEMO_ANALYTICS, DEMO_CLIENTS, DEMO_TASKS } from "@/lib/data";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw
} from "lucide-react";
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
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = {
  primary: "#6366f1",
  success: "#22c55e",
  warning: "#f59e0b",
  destructive: "#ef4444",
  purple: "#8b5cf6",
  blue: "#3b82f6",
};

export function FilingChart() {
  const data = DEMO_ANALYTICS.monthlyFilings;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Monthly Filings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">+12%</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} barGap={8}>
              <defs>
                <linearGradient id="gstGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="itrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
              <Area type="monotone" dataKey="gst" name="GST" stroke={COLORS.primary} fill="url(#gstGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="itr" name="ITR" stroke={COLORS.success} fill="url(#itrGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="tds" name="TDS" stroke={COLORS.warning} fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="audit" name="Audit" stroke={COLORS.purple} fill="transparent" strokeWidth={2} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientGrowthChart() {
  const data = DEMO_ANALYTICS.clientGrowth;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Client Growth
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">+4 new</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
              <Line type="monotone" dataKey="active" name="Active" stroke={COLORS.success} strokeWidth={2} dot={{ fill: COLORS.success, strokeWidth: 0, r: 4 }} />
              <Line type="monotone" dataKey="new" name="New" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary, strokeWidth: 0, r: 4 }} />
              <Line type="monotone" dataKey="inactive" name="Inactive" stroke={COLORS.warning} strokeWidth={2} dot={{ fill: COLORS.warning, strokeWidth: 0, r: 4 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueChart() {
  const data = DEMO_ANALYTICS.revenueOverview;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">+8%</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill={COLORS.warning} radius={[6, 6, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function FilingDistribution() {
  const data = DEMO_ANALYTICS.pendingWork;
  const total = data.reduce((acc, item) => acc + item.count, 0);
  
  const chartData = [
    { name: "GST", value: data.find(d => d.type === "gst")?.count || 0, color: COLORS.primary },
    { name: "ITR", value: data.find(d => d.type === "itr")?.count || 0, color: COLORS.success },
    { name: "TDS", value: data.find(d => d.type === "tds")?.count || 0, color: COLORS.warning },
    { name: "Audit", value: data.find(d => d.type === "audit")?.count || 0, color: COLORS.purple },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Filing Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">({item.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StaffPerformance() {
  const performance = DEMO_ANALYTICS.staffPerformance;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Staff Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {performance.map((staff) => (
          <div key={staff.staffId} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{staff.name}</span>
              <span className="text-sm font-semibold text-success">{staff.rating}/5</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{staff.tasksCompleted} tasks completed</span>
              <span>Avg. {staff.avgCompletionTime} days</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                style={{ width: `${(staff.tasksCompleted / 50) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function WorkloadHeatmap() {
  const data = DEMO_ANALYTICS.workloadHeatmap;
  const maxValue = Math.max(...data.map(d => Math.max(d.morning, d.afternoon, d.evening)));
  
  const getHeatColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.7) return "bg-destructive/80";
    if (intensity > 0.4) return "bg-warning/60";
    if (intensity > 0.1) return "bg-primary/40";
    return "bg-muted";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Workload Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          <div />
          <span className="text-xs text-muted-foreground text-center">Morning</span>
          <span className="text-xs text-muted-foreground text-center">Afternoon</span>
          <span className="text-xs text-muted-foreground text-center">Evening</span>
          {data.map((day) => (
            <React.Fragment key={day.day}>
              <span className="text-xs text-muted-foreground flex items-center">{day.day}</span>
              <div className={cn("h-8 rounded-lg flex items-center justify-center text-xs font-medium", getHeatColor(day.morning))}>
                {day.morning}
              </div>
              <div className={cn("h-8 rounded-lg flex items-center justify-center text-xs font-medium", getHeatColor(day.afternoon))}>
                {day.afternoon}
              </div>
              <div className={cn("h-8 rounded-lg flex items-center justify-center text-xs font-medium", getHeatColor(day.evening))}>
                {day.evening}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-muted" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary/40" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-warning/60" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-destructive/80" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsSummary() {
  const stats = {
    totalRevenue: DEMO_ANALYTICS.revenueOverview.reduce((acc, item) => acc + item.revenue, 0),
    totalClients: DEMO_CLIENTS.length,
    totalTasks: DEMO_TASKS.length,
    completedTasks: DEMO_TASKS.filter(t => t.status === "completed").length,
    avgRating: DEMO_ANALYTICS.staffPerformance.reduce((acc, s) => acc + s.rating, 0) / DEMO_ANALYTICS.staffPerformance.length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <Card className="bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <div className="flex items-center gap-1 text-xs text-success mt-1">
            <TrendingUp className="h-3 w-3" />
            +8% this month
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-success/10 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Clients</p>
          <p className="text-xl font-bold">{stats.totalClients}</p>
          <div className="flex items-center gap-1 text-xs text-success mt-1">
            <TrendingUp className="h-3 w-3" />
            +4 new
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-warning/10 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Tasks Completed</p>
          <p className="text-xl font-bold">{stats.completedTasks}/{stats.totalTasks}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Avg Rating</p>
          <p className="text-xl font-bold">{stats.avgRating.toFixed(1)}/5</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            Staff performance
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Pending Filings</p>
          <p className="text-xl font-bold">
            {DEMO_ANALYTICS.pendingWork.reduce((acc, item) => acc + item.count, 0)}
          </p>
          <div className="flex items-center gap-1 text-xs text-warning mt-1">
            <AlertTriangle className="h-3 w-3" />
            5 critical
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
