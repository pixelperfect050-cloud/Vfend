"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, FileText, MessageSquare, Bell, 
  BarChart3, Settings, LogOut, Menu, X, Search, Sparkles,
  Plus, Filter, MoreVertical, Calendar, Clock, CheckCircle2,
  AlertCircle, Play, Pause, ArrowRight, User, Mic, Square,
  Trash2, Send, MessageCircle, Mic as MicIcon, Brain, Target,
  Zap, FileCheck, FileX
} from "lucide-react";
import { DEMO_TASKS, DEMO_CLIENTS, DEMO_STAFF_WORKLOAD } from "@/lib/data";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "Reminders", href: "/reminders" },
  { icon: Bell, label: "Tasks", href: "/tasks", active: true },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const priorityColors = {
  urgent: "bg-red-500/20 text-red-400 border border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

const statusColors = {
  pending: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  delayed: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const statusIcons = {
  pending: Clock,
  in_progress: Play,
  completed: CheckCircle2,
  delayed: AlertCircle,
};

const columns = [
  { id: "pending", label: "To Do", color: "bg-slate-500" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { id: "completed", label: "Done", color: "bg-emerald-500" },
  { id: "delayed", label: "Overdue", color: "bg-red-500" },
];

const filingTypeLabels: Record<string, string> = {
  gst: "GST",
  itr: "ITR",
  tds: "TDS",
  audit: "Audit",
  other: "Other",
};

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<Record<string, string>>({});
  const [selectedTaskForVoice, setSelectedTaskForVoice] = useState<string | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTasks = DEMO_TASKS.filter(task => {
    const client = DEMO_CLIENTS.find(c => c.id === task.clientId);
    const searchLower = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(searchLower) ||
      client?.name.toLowerCase().includes(searchLower);
  });

  const startVoiceRecording = (taskId: string) => {
    setSelectedTaskForVoice(taskId);
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    if (selectedTaskForVoice && recordingTime > 0) {
      setVoiceNotes(prev => ({
        ...prev,
        [selectedTaskForVoice]: `Voice note (${recordingTime}s)`
      }));
    }
    setIsRecording(false);
    setRecordingTime(0);
    setSelectedTaskForVoice(null);
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const columnStats = columns.map(col => ({
    ...col,
    count: DEMO_TASKS.filter(t => t.status === col.id).length
  }));

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">CAflow AI</span>
        </Link>
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <Bell className="w-5 h-5 text-white" />
        </button>
      </header>

      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#121A2F] border-r border-white/5 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">CAFlow AI</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              item.active 
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <Target className="w-7 h-7 text-indigo-400" />
                Task Command Center
              </h1>
              <p className="text-slate-400 mt-1">Manage tasks with AI-powered workflow automation</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-glow transition-all">
                <Plus className="w-5 h-5" />
                New Task
              </button>
              <Link href="/chat" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/20 text-green-400 font-semibold hover:bg-green-500/30 transition-all">
                <MessageCircle className="w-5 h-5" />
                Quick Chat
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {columnStats.map((col) => {
              const StatusIcon = statusIcons[col.id as keyof typeof statusIcons];
              return (
                <div key={col.id} className="glass-card rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${col.color}`} />
                    <div>
                      <div className="text-2xl font-bold">{col.count}</div>
                      <div className="text-sm text-slate-400">{col.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 mb-6 border border-white/5">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    viewMode === "kanban" 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                      : "border border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                      : "border border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          {viewMode === "kanban" && (
            <div className="grid lg:grid-cols-4 gap-4">
              {columns.map((column) => {
                const columnTasks = filteredTasks.filter(t => t.status === column.id);
                const StatusIcon = statusIcons[column.id as keyof typeof statusIcons];
                return (
                  <div key={column.id} className="glass-card rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <span className="font-semibold">{column.label}</span>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-white/10 text-xs text-slate-400">
                        {columnTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto hide-scrollbar">
                      {columnTasks.map((task) => {
                        const client = DEMO_CLIENTS.find(c => c.id === task.clientId);
                        return (
                          <motion.div
                            key={task.id}
                            layout
                            className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 group"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </span>
                              {task.filingType && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                                  {filingTypeLabels[task.filingType]}
                                </span>
                              )}
                            </div>
                            <h4 className="font-medium mb-2">{task.title}</h4>
                            <p className="text-sm text-slate-400 mb-3">{client?.name}</p>
                            
                            {/* Voice Note */}
                            {voiceNotes[task.id] && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-lg mb-3">
                                <MicIcon className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-purple-400">{voiceNotes[task.id]}</span>
                              </div>
                            )}
                            
                            {/* Voice Recording */}
                            {selectedTaskForVoice === task.id && isRecording ? (
                              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg mb-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs text-red-400">Recording... {recordingTime}s</span>
                                <button onClick={stopVoiceRecording} className="ml-auto p-1 hover:bg-red-500/30 rounded">
                                  <Square className="w-3 h-3 text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startVoiceRecording(task.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg mb-3 hover:bg-white/10 transition-colors w-full"
                              >
                                <Mic className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-400">Add Voice Note</span>
                              </button>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString('en-IN')}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {DEMO_STAFF_WORKLOAD.find(s => s.staffId === task.assignedTo)?.staffName || 'Unassigned'}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <StatusIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Task</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Due Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTasks.map((task) => {
                    const client = DEMO_CLIENTS.find(c => c.id === task.clientId);
                    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
                    return (
                      <tr key={task.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-slate-400">{task.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{client?.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-slate-400" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(task.dueDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-2 hover:bg-white/10 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/5 flex items-center justify-around px-2 z-50 safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-indigo-400' : 'text-slate-400'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}