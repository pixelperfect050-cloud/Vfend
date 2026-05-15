"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList, Calendar, Flag, User, Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/toast";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask, clients } = useData();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    addTask({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(),
    });

    addToast({
      title: "Task Created",
      message: `Task "${formData.title}" has been added to your pilot.`,
      type: "success"
    });
    onClose();
    setFormData({
      title: "",
      description: "",
      clientId: "",
      priority: "medium",
      dueDate: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">New Task</h2>
                  <p className="text-xs text-slate-500">Assign a new task to your AI Pilot</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 ml-1">Task Title *</span>
                <input
                  required
                  type="text"
                  placeholder="e.g. File GSTR-1 for Ramesh Ind."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 ml-1">Assign to Client</span>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all appearance-none"
                >
                  <option value="">No specific client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 ml-1">Priority</span>
                  <div className="mt-1 relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700 ml-1">Due Date</span>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 ml-1">Description</span>
                <textarea
                  rows={3}
                  placeholder="Additional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all resize-none"
                />
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
