"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_CLIENTS, DEMO_TASKS, DEMO_ACTIVITIES } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import type { Client, Task, Activity } from "@/types";

interface DataContextType {
  clients: Client[];
  tasks: Task[];
  activities: Activity[];
  addClient: (client: Partial<Client>) => void;
  addTask: (task: Partial<Task>) => void;
  addActivity: (activity: Partial<Activity>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Initialize data based on user type
  useEffect(() => {
    const isDemoUser = user?.email?.endsWith('@caflow.ai') || user?.email === 'demo@caflow.ai';
    
    if (isDemoUser) {
      setClients(DEMO_CLIENTS);
      setTasks(DEMO_TASKS);
      setActivities(DEMO_ACTIVITIES);
    } else {
      // For new users, try to load from local storage or start empty
      const storedClients = localStorage.getItem(`clients_${user?.id}`);
      const storedTasks = localStorage.getItem(`tasks_${user?.id}`);
      const storedActivities = localStorage.getItem(`activities_${user?.id}`);

      if (storedClients) setClients(JSON.parse(storedClients));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedActivities) setActivities(JSON.parse(storedActivities));
    }
  }, [user]);

  const addClient = (client: Partial<Client>) => {
    const newClient: Client = {
      id: Math.random().toString(36).substring(2),
      name: client.name || "Unnamed Client",
      email: client.email || "",
      phone: client.phone || "",
      businessType: client.businessType || "proprietorship",
      status: "active",
      healthScore: 100,
      createdAt: new Date(),
      lastActivity: new Date(),
      documents: [],
      filings: [],
      payments: [],
      ...client
    } as Client;

    const updated = [newClient, ...clients];
    setClients(updated);
    if (user) localStorage.setItem(`clients_${user.id}`, JSON.stringify(updated));
    
    addActivity({
      title: "New Client Added",
      description: `Client ${newClient.name} was successfully registered.`,
      type: "client_updated",
      clientId: newClient.id
    });
  };

  const addTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2),
      title: task.title || "New Task",
      status: "pending",
      priority: "medium",
      dueDate: new Date(),
      createdAt: new Date(),
      ...task
    } as Task;

    const updated = [newTask, ...tasks];
    setTasks(updated);
    if (user) localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updated));
  };

  const addActivity = (activity: Partial<Activity>) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(2),
      title: activity.title || "Activity",
      description: activity.description || "",
      type: activity.type || "info",
      createdAt: new Date(),
      userId: user?.id || "unknown",
      ...activity
    } as Activity;

    const updated = [newActivity, ...activities];
    setActivities(updated);
    if (user) localStorage.setItem(`activities_${user.id}`, JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{ clients, tasks, activities, addClient, addTask, addActivity }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
