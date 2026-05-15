"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate, formatCurrency, getDaysUntil, getRiskColor, getHealthScoreColor } from "@/lib/utils";
import { DEMO_CLIENTS, DEMO_TASKS, DEMO_ACTIVITIES } from "@/lib/data";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Building2,
  Calendar,
  UserX,
  Sparkles,
  ArrowUpRight,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface ClientCardProps {
  client: typeof DEMO_CLIENTS[0];
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ClientCard({ client, onView, onEdit, onDelete }: ClientCardProps) {
  const pendingDocs = client.documents.filter(d => d.status === "pending").length;
  const overdueFilings = client.filings.filter(f => f.status === "overdue").length;

  return (
    <motion.div variants={itemVariants}>
      <Card hover className="h-full group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg" fallback={client.name[0]} />
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.businessName}</p>
              </div>
            </div>
            <Dropdown
              trigger={
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
            >
              <DropdownItem icon={<Eye className="h-4 w-4" />} onClick={onView}>View Details</DropdownItem>
              <DropdownItem icon={<Edit className="h-4 w-4" />} onClick={onEdit}>Edit Client</DropdownItem>
              <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive onClick={onDelete}>Delete</DropdownItem>
            </Dropdown>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">GST:</span>
              <span className="font-medium truncate">{client.gstNumber || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline" size="sm" className="capitalize">{client.businessType.replace("_", " ")}</Badge>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Health Score</span>
              <span className={cn("text-sm font-semibold", getHealthScoreColor(client.healthScore))}>
                {client.healthScore}%
              </span>
            </div>
            <Progress value={client.healthScore} showLabel={false} />
          </div>

          <div className="flex items-center gap-2">
            {pendingDocs > 0 && (
              <Badge variant="warning" size="sm" className="gap-1">
                <FileText className="h-3 w-3" />
                {pendingDocs} pending
              </Badge>
            )}
            {overdueFilings > 0 && (
              <Badge variant="destructive" size="sm" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {overdueFilings} overdue
              </Badge>
            )}
            {client.riskLevel === "high" && (
              <Badge variant="destructive" size="sm" className="gap-1">
                <Sparkles className="h-3 w-3" />
                High Risk
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <a href={`tel:${client.phone}`} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
              <Phone className="h-4 w-4" />
            </a>
            <a href={`mailto:${client.email}`} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
              <Mail className="h-4 w-4" />
            </a>
            {client.whatsapp && (
              <a href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
                <MessageCircle className="h-4 w-4 text-green-500" />
              </a>
            )}
            <Button variant="ghost" size="sm" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" onClick={onView}>
              View <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ClientListProps {
  searchQuery: string;
  statusFilter: string;
  riskFilter: string;
}

export function ClientList({ searchQuery, statusFilter, riskFilter }: ClientListProps) {
  const [clients, setClients] = React.useState(DEMO_CLIENTS);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesRisk = riskFilter === "all" || client.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {filteredClients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onView={() => console.log("View", client.id)}
          onEdit={() => console.log("Edit", client.id)}
          onDelete={() => setClients(clients.filter(c => c.id !== client.id))}
        />
      ))}
    </motion.div>
  );
}

export function ClientStats() {
  const stats = {
    total: DEMO_CLIENTS.length,
    active: DEMO_CLIENTS.filter(c => c.status === "active").length,
    inactive: DEMO_CLIENTS.filter(c => c.status === "inactive").length,
    highRisk: DEMO_CLIENTS.filter(c => c.riskLevel === "high").length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Clients</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-success/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-warning/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <UserX className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-destructive/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.highRisk}</p>
              <p className="text-xs text-muted-foreground">High Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const client = DEMO_CLIENTS.find(c => c.id === clientId);
  const tasks = DEMO_TASKS.filter(t => t.clientId === clientId);
  const activities = DEMO_ACTIVITIES.filter(a => a.clientId === clientId);

  if (!client) return null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to Clients
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar size="xl" fallback={client.name[0]} />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{client.name}</h2>
                  <p className="text-muted-foreground">{client.businessName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={client.status === "active" ? "success" : "warning"}>
                      {client.status}
                    </Badge>
                    <Badge variant={client.riskLevel === "high" ? "destructive" : client.riskLevel === "medium" ? "warning" : "secondary"}>
                      {client.riskLevel} risk
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className={cn("text-3xl font-bold", getHealthScoreColor(client.healthScore))}>
                    {client.healthScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <p className="font-medium">{client.gstNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PAN Number</p>
                  <p className="font-medium">{client.panNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-medium capitalize">{client.businessType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{client.city}, {client.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {client.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type.replace("_", " ").toUpperCase()}</p>
                      </div>
                    </div>
                    <Badge variant={
                      doc.status === "verified" ? "success" :
                      doc.status === "received" ? "default" :
                      doc.status === "rejected" ? "destructive" : "warning"
                    }>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" leftIcon={<MessageCircle className="h-4 w-4" />}>
                Send WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start" leftIcon={<FileText className="h-4 w-4" />}>
                Request Documents
              </Button>
              <Button variant="outline" className="w-full justify-start" leftIcon={<DollarSign className="h-4 w-4" />}>
                View Payments
              </Button>
              <Button variant="outline" className="w-full justify-start" leftIcon={<Calendar className="h-4 w-4" />}>
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Filings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.filings.filter(f => f.status !== "filed").map((filing) => (
                <div key={filing.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{filing.type.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{filing.period}</p>
                  </div>
                  <Badge variant={filing.status === "overdue" ? "destructive" : "warning"}>
                    {filing.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4 pb-4">
                <div className="absolute left-2 top-0 bottom-4 w-px bg-border" />
                {activities.slice(0, 4).map((activity, index) => (
                  <div key={activity.id} className="flex gap-3 pl-6 relative">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
