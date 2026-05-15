"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  Circle,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

interface StaffWorkloadItem {
  staffId: string;
  staffName: string;
  activeTasks: number;
  completedTasks: number;
  delayedTasks: number;
  workloadLevel?: "overloaded" | "balanced" | "idle";
}

interface WorkloadHeatmapProps {
  workloads: StaffWorkloadItem[];
  className?: string;
}

export function StaffWorkloadHeatmap({ workloads, className }: WorkloadHeatmapProps) {
  const getWorkloadLevel = (item: StaffWorkloadItem) => {
    const totalWorkload = item.activeTasks + item.completedTasks;
    const activeRatio = item.activeTasks / totalWorkload;
    const urgencyScore = item.delayedTasks * 2 + item.activeTasks;
    
    if (urgencyScore > 8 || activeRatio > 0.5) return "overloaded";
    if (urgencyScore < 3 && item.delayedTasks === 0) return "idle";
    return "balanced";
  };

  const getHeatColor = (level: string) => {
    switch (level) {
      case "overloaded": return "from-destructive to-orange-500";
      case "balanced": return "from-success to-emerald-400";
      case "idle": return "from-slate-400 to-slate-500";
      default: return "from-muted to-muted-foreground";
    }
  };

  const getHeatGlow = (level: string) => {
    switch (level) {
      case "overloaded": return "shadow-glow-critical";
      case "balanced": return "shadow-glow-green";
      default: return "";
    }
  };

  return (
    <div className={cn("grid gap-4", className)}>
      {workloads.map((workload, index) => {
        const level = workload.workloadLevel || getWorkloadLevel(workload);
        const totalTasks = workload.activeTasks + workload.completedTasks;
        const completionRate = totalTasks > 0 
          ? Math.round((workload.completedTasks / totalTasks) * 100) 
          : 0;
        
        return (
          <motion.div
            key={workload.staffId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                "hover:shadow-lg",
                level === "overloaded" && "border-destructive/50",
                level === "balanced" && "border-success/30"
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-5",
                getHeatColor(level)
              )} />
              
              <CardContent className="relative p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size="lg" 
                      fallback={workload.staffName.split(' ').map(n => n[0]).join('')}
                      className={cn(
                        "ring-2",
                        level === "overloaded" && "ring-destructive",
                        level === "balanced" && "ring-success",
                        level === "idle" && "ring-muted-foreground"
                      )}
                    />
                    <div>
                      <h3 className="font-semibold">{workload.staffName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {level === "overloaded" && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <Flame className="w-3 h-3" />
                            Overloaded
                          </Badge>
                        )}
                        {level === "balanced" && (
                          <Badge variant="success" className="gap-1 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Balanced
                          </Badge>
                        )}
                        {level === "idle" && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Circle className="w-3 h-3 fill-current" />
                            Idle
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-2xl font-bold",
                      level === "overloaded" && "text-destructive",
                      level === "balanced" && "text-success",
                      level === "idle" && "text-muted-foreground"
                    )}>
                      {completionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Active Tasks</span>
                        <span className="font-medium">{workload.activeTasks}</span>
                      </div>
                      <Progress 
                        value={(workload.activeTasks / Math.max(totalTasks, 1)) * 100}
                        variant={level === "overloaded" ? "destructive" : "default"}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>{workload.completedTasks} done</span>
                    </div>
                    {workload.delayedTasks > 0 && (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{workload.delayedTasks} delayed</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {level === "overloaded" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <Zap className="w-4 h-4" />
                      <span>Consider redistributing tasks to balance workload</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

interface TaskUrgencyCardProps {
  task: {
    id: string;
    title: string;
    clientName?: string;
    priority: "low" | "medium" | "high" | "urgent";
    dueDate: Date;
    staffName?: string;
  };
  className?: string;
}

export function TaskUrgencyCard({ task, className }: TaskUrgencyCardProps) {
  const getUrgencyStyle = (priority: string) => {
    switch (priority) {
      case "urgent": return { bg: "bg-destructive/10", border: "border-destructive/30", icon: "text-destructive", pulse: true };
      case "high": return { bg: "bg-warning/10", border: "border-warning/30", icon: "text-warning", pulse: false };
      case "medium": return { bg: "bg-primary/10", border: "border-primary/30", icon: "text-primary", pulse: false };
      default: return { bg: "bg-muted", border: "border-border", icon: "text-muted-foreground", pulse: false };
    }
  };
  
  const style = getUrgencyStyle(task.priority);
  const daysUntil = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 rounded-xl border transition-all cursor-pointer",
        style.bg,
        style.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", style.bg)}>
          <Flame className={cn("w-5 h-5", style.icon, style.pulse && "animate-pulse")} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{task.title}</p>
          {task.clientName && (
            <p className="text-xs text-muted-foreground mt-0.5">{task.clientName}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={task.priority === "urgent" ? "destructive" : task.priority === "high" ? "warning" : "secondary"}
              size="sm"
            >
              {task.priority}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "Due today" : `${daysUntil}d left`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface WorkloadAnalyticsProps {
  data: {
    day: string;
    morning: number;
    afternoon: number;
    evening: number;
  }[];
  className?: string;
}

export function WorkloadAnalytics({ data, className }: WorkloadAnalyticsProps) {
  const maxTasks = Math.max(...data.flatMap(d => [d.morning, d.afternoon, d.evening]), 1);
  
  const getHeatIntensity = (value: number) => {
    const ratio = value / maxTasks;
    if (ratio === 0) return "bg-muted";
    if (ratio < 0.3) return "bg-success/30";
    if (ratio < 0.6) return "bg-success/50";
    if (ratio < 0.8) return "bg-warning/50";
    return "bg-destructive/50";
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4" />
          Workload Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="w-12">Day</span>
            <span className="flex-1 text-center">Morning</span>
            <span className="flex-1 text-center">Afternoon</span>
            <span className="flex-1 text-center">Evening</span>
          </div>
          
          {data.map((row, index) => (
            <motion.div
              key={row.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="w-12 text-sm font-medium">{row.day}</span>
              {[row.morning, row.afternoon, row.evening].map((val, i) => (
                <div key={i} className="flex-1 h-8 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(val / maxTasks) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className={cn("h-full rounded-md", getHeatIntensity(val))}
                  />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted" />
            <span className="text-xs text-muted-foreground">None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/30" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/50" />
            <span className="text-xs text-muted-foreground">Med</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning/50" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive/50" />
            <span className="text-xs text-muted-foreground">Peak</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
