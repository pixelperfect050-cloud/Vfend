"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDate, getDaysUntil, getPriorityColor, getStatusColor } from "@/lib/utils";
import { DEMO_TASKS, DEMO_CLIENTS, DEMO_DASHBOARD_STATS } from "@/lib/data";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Timer,
  Calendar,
  User,
  MessageSquare,
  Mic,
  Edit,
  Trash2,
  GripVertical,
  ArrowRight,
  Zap,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskCardProps {
  task: typeof DEMO_TASKS[0];
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onEdit, onComplete, onDelete }: TaskCardProps) {
  const client = DEMO_CLIENTS.find(c => c.id === task.clientId);
  const daysLeft = getDaysUntil(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group"
    >
      <Card hover className="cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>
                <Dropdown
                  trigger={
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownItem icon={<Edit className="h-4 w-4" />} onClick={onEdit}>Edit</DropdownItem>
                  {task.status !== "completed" && (
                    <DropdownItem icon={<CheckCircle2 className="h-4 w-4" />} onClick={onComplete}>Mark Complete</DropdownItem>
                  )}
                  <DropdownItem divider />
                  <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive onClick={onDelete}>Delete</DropdownItem>
                </Dropdown>
              </div>

              {client && (
                <div className="flex items-center gap-2 mt-3">
                  <Avatar size="sm" fallback={client.name[0]} />
                  <span className="text-xs text-muted-foreground truncate">{client.name}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Badge className={cn(getPriorityColor(task.priority))} size="sm">
                  {task.priority}
                </Badge>
                <Badge variant="secondary" size="sm" className="capitalize">
                  {task.filingType}
                </Badge>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                <Badge
                  variant={daysLeft < 0 ? "destructive" : daysLeft < 3 ? "warning" : "secondary"}
                  size="sm"
                >
                  {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  icon: React.ReactNode;
  tasks: typeof DEMO_TASKS;
  color: string;
}

function KanbanColumn({ status, title, icon, tasks, color }: KanbanColumnProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="flex-1 min-w-[280px] max-w-[320px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("sticky top-0 z-10 bg-background/80 backdrop-blur-lg px-2 pb-3", isHovered && "")}>
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("p-2 rounded-lg", color)}>
            {icon}
          </div>
          <span className="font-semibold">{title}</span>
          <Badge variant="secondary" size="sm" className="ml-auto">{tasks.length}</Badge>
        </div>
      </div>
      <div className="space-y-3 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => console.log("Edit", task.id)}
              onComplete={() => console.log("Complete", task.id)}
              onDelete={() => console.log("Delete", task.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function TaskKanban() {
  const [tasks, setTasks] = React.useState(DEMO_TASKS);
  const columns: { status: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    { status: "pending", title: "Pending", icon: <Clock className="h-4 w-4" />, color: "bg-muted text-muted-foreground" },
    { status: "in_progress", title: "In Progress", icon: <Timer className="h-4 w-4" />, color: "bg-primary/10 text-primary" },
    { status: "completed", title: "Completed", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-success/10 text-success" },
    { status: "delayed", title: "Delayed", icon: <AlertTriangle className="h-4 w-4" />, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          title={column.title}
          icon={column.icon}
          color={column.color}
          tasks={tasks.filter(t => t.status === column.status)}
        />
      ))}
    </div>
  );
}

export function TaskList() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [tasks, setTasks] = React.useState(DEMO_TASKS);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-input bg-background text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add Task
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-8 w-8" />}
          title="No tasks found"
          description="Create a new task to get started"
          action={<Button leftIcon={<Plus className="h-4 w-4" />}>Create Task</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => console.log("Edit", task.id)}
              onComplete={() => {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, status: "completed" as TaskStatus, completedAt: new Date() } : t));
              }}
              onDelete={() => setTasks(tasks.filter(t => t.id !== task.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskStats() {
  const stats = {
    total: DEMO_TASKS.length,
    pending: DEMO_TASKS.filter(t => t.status === "pending").length,
    inProgress: DEMO_TASKS.filter(t => t.status === "in_progress").length,
    completed: DEMO_TASKS.filter(t => t.status === "completed").length,
    delayed: DEMO_TASKS.filter(t => t.status === "delayed").length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {[
        { label: "Total", value: stats.total, color: "bg-primary/10 text-primary", icon: <Zap className="h-4 w-4" /> },
        { label: "Pending", value: stats.pending, color: "bg-muted text-muted-foreground", icon: <Clock className="h-4 w-4" /> },
        { label: "In Progress", value: stats.inProgress, color: "bg-primary/10 text-primary", icon: <Timer className="h-4 w-4" /> },
        { label: "Completed", value: stats.completed, color: "bg-success/10 text-success", icon: <CheckCircle2 className="h-4 w-4" /> },
        { label: "Delayed", value: stats.delayed, color: "bg-destructive/10 text-destructive", icon: <AlertTriangle className="h-4 w-4" /> },
      ].map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", item.color)}>
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StaffTasks() {
  const staffMembers = [
    { id: "2", name: "Priya Patel", tasks: DEMO_TASKS.filter(t => t.assignedTo === "2") },
    { id: "3", name: "Rahul Verma", tasks: DEMO_TASKS.filter(t => t.assignedTo === "3") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Staff Workload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffMembers.map((staff) => {
          const activeTasks = staff.tasks.filter(t => t.status !== "completed").length;
          const completedTasks = staff.tasks.filter(t => t.status === "completed").length;
          const delayedTasks = staff.tasks.filter(t => t.status === "delayed").length;

          return (
            <div key={staff.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar fallback={staff.name[0]} />
                <div className="flex-1">
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{activeTasks} active tasks</p>
                </div>
                <div className="flex items-center gap-2">
                  {delayedTasks > 0 && (
                    <Badge variant="destructive" size="sm">{delayedTasks} delayed</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {staff.tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium",
                      task.status === "completed" ? "bg-success/20 text-success" :
                      task.status === "delayed" ? "bg-destructive/20 text-destructive" :
                      task.status === "in_progress" ? "bg-primary/20 text-primary" :
                      "bg-muted text-muted-foreground"
                    )}
                    title={task.title}
                  >
                    {task.title[0]}
                  </div>
                ))}
                {staff.tasks.length > 5 && (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    +{staff.tasks.length - 5}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function TaskFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Quick Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[
            { label: "Due Today", count: 2, icon: <Clock className="h-4 w-4" /> },
            { label: "Due This Week", count: 5, icon: <Calendar className="h-4 w-4" /> },
            { label: "High Priority", count: 3, icon: <AlertTriangle className="h-4 w-4" /> },
            { label: "My Tasks", count: 4, icon: <User className="h-4 w-4" /> },
            { label: "Unassigned", count: 1, icon: <User className="h-4 w-4" /> },
          ].map((filter) => (
            <button
              key={filter.label}
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{filter.icon}</span>
                <span className="text-sm font-medium">{filter.label}</span>
              </div>
              <Badge variant="secondary" size="sm">{filter.count}</Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
