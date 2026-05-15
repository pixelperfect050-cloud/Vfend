"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDate } from "@/lib/utils";
import { DEMO_REMINDERS, DEMO_CLIENTS } from "@/lib/data";
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Trash2,
  RefreshCw,
  Zap,
  Globe,
  Languages,
  Volume2,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

interface ReminderTemplate {
  id: string;
  label: string;
  day: string;
  message: {
    en: string;
    hi: string;
  };
}

const reminderTemplates: ReminderTemplate[] = [
  {
    id: "doc-1",
    label: "Document Request",
    day: "Day 1",
    message: {
      en: "Dear Client, kindly upload the required documents at your earliest convenience for smooth processing.",
      hi: "प्रिय ग्राहक, कृपया आवश्यक दस्तावेज़ जल्द से जल्द अपलोड करें।",
    },
  },
  {
    id: "doc-5",
    label: "Follow-up Reminder",
    day: "Day 5",
    message: {
      en: "Kind reminder: Some documents are still pending. Delay may affect filing deadlines.",
      hi: "कुछ दस्तावेज़ अभी भी लंबित हैं। विलंब से फाइलिंग प्रभावित हो सकती है।",
    },
  },
  {
    id: "doc-10",
    label: "Urgent Notice",
    day: "Day 10",
    message: {
      en: "Important: Missing documents may lead to penalty. Please upload them immediately.",
      hi: "महत्वपूर्ण: अपूर्ण दस्तावेज़ों के कारण जुर्माना लग सकता है।",
    },
  },
  {
    id: "pay-1",
    label: "Payment Reminder",
    day: "Day 1",
    message: {
      en: "Dear Client, a payment is pending. Please clear the dues at the earliest.",
      hi: "प्रिय ग्राहक, भुगतान राशि बकाया है।",
    },
  },
  {
    id: "filing-1",
    label: "Filing Deadline",
    day: "Day 1",
    message: {
      en: "Dear Client, filing deadline is approaching. Please ensure all documents are ready.",
      hi: "प्रिय ग्राहक, फाइलिंग की समय सीमा आ रही है।",
    },
  },
];

interface ReminderCardProps {
  reminder: typeof DEMO_REMINDERS[0];
}

function ReminderCard({ reminder }: ReminderCardProps) {
  const client = DEMO_CLIENTS.find(c => c.id === reminder.clientId);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card hover className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {client && <Avatar size="sm" fallback={client.name[0]} />}
                <div>
                  <p className="font-medium text-sm">{client?.name}</p>
                  <p className="text-xs text-muted-foreground">{client?.phone}</p>
                </div>
                <Badge 
                  variant={reminder.status === "sent" ? "success" : reminder.status === "failed" ? "destructive" : "warning"}
                  size="sm"
                  className="ml-auto"
                >
                  {reminder.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{reminder.message}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(reminder.scheduledFor)}
                  </span>
                  <Badge variant="outline" size="sm" className="gap-1">
                    <Globe className="h-3 w-3" />
                    {reminder.language === "both" ? "EN+HI" : reminder.language.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ReminderList() {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredReminders = DEMO_REMINDERS.filter(reminder => {
    const client = DEMO_CLIENTS.find(c => c.id === reminder.clientId);
    return client?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Create Reminder
        </Button>
      </div>

      {filteredReminders.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No reminders found"
          description="Create a new reminder to get started"
          action={<Button leftIcon={<Plus className="h-4 w-4" />}>Create Reminder</Button>}
        />
      ) : (
        <div className="space-y-4">
          {filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ReminderTemplates() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<ReminderTemplate | null>(null);
  const [language, setLanguage] = React.useState<"en" | "hi" | "both">("both");
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Quick Templates
        </h3>
        {reminderTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={cn(
              "w-full p-4 rounded-xl text-left transition-all border",
              selectedTemplate?.id === template.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{template.label}</span>
              <Badge variant="secondary" size="sm">{template.day}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{template.message.en}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTemplate ? (
            <>
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedTemplate.day}</Badge>
                  <span className="text-sm font-medium">{selectedTemplate.label}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">English</p>
                    <p className="text-sm">{selectedTemplate.message.en}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">हिन्दी</p>
                    <p className="text-sm">{selectedTemplate.message.hi}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <div className="flex gap-2">
                  {(["en", "hi", "both"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize",
                        language === lang ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {lang === "both" ? "EN + HI" : lang === "en" ? "English" : "हिन्दी"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Clients</label>
                <div className="flex flex-wrap gap-2">
                  {DEMO_CLIENTS.slice(0, 4).map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClients(prev =>
                          prev.includes(client.id)
                            ? prev.filter(id => id !== client.id)
                            : [...prev, client.id]
                        );
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedClients.includes(client.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      <Avatar size="sm" fallback={client.name[0]} />
                      {client.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" leftIcon={<MessageCircle className="h-4 w-4" />}>
                  Preview
                </Button>
                <Button className="flex-1" leftIcon={<Send className="h-4 w-4" />}>
                  Send All
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select a template to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function WhatsAppStylePreview() {
  const messages = [
    { id: 1, type: "received", text: "Hello, I need help with my GST filing" },
    { id: 2, type: "sent", text: "Sure! Please share your GST credentials and we will proceed." },
    { id: 3, type: "received", text: "Sent via email" },
    { id: 4, type: "sent", text: "Thank you! We have received the documents. Filing will be done by tomorrow." },
    { id: 5, type: "template", text: "Dear Client, this is a reminder that GSTR-3B for December 2024 is due on 11th January. Please ensure all documents are ready." },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-success" />
          WhatsApp Style Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-[#111b21] rounded-2xl p-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-2xl text-sm",
                  msg.type === "received" ? "bg-[#202c33] text-white self-start rounded-bl-none" :
                  msg.type === "sent" ? "bg-[#005c4b] text-white self-end rounded-br-none ml-auto" :
                  "bg-[#005c4b]/50 text-white/80 self-start rounded-bl-none border border-primary/20"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AutoReminders() {
  const [autoReminders, setAutoReminders] = React.useState([
    { id: 1, type: "document", day: 1, enabled: true, message: "Documents reminder" },
    { id: 2, type: "document", day: 5, enabled: true, message: "Follow-up reminder" },
    { id: 3, type: "document", day: 10, enabled: true, message: "Urgent notice" },
    { id: 4, type: "payment", day: 1, enabled: true, message: "Payment reminder" },
    { id: 5, type: "filing", day: 7, enabled: false, message: "Filing deadline alert" },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Auto Reminder Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {autoReminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <Bell className={cn("h-5 w-5", reminder.enabled ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-medium capitalize">{reminder.type} - Day {reminder.day}</p>
                <p className="text-xs text-muted-foreground">{reminder.message}</p>
              </div>
            </div>
            <button
              onClick={() => setAutoReminders(autoReminders.map(r => 
                r.id === reminder.id ? { ...r, enabled: !r.enabled } : r
              ))}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                reminder.enabled ? "bg-primary" : "bg-muted"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                reminder.enabled ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
