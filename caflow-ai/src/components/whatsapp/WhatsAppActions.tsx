"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Phone, 
  FileText, 
  Send,
  Mic,
  Clock,
  CheckCheck,
  Check,
  MoreVertical,
  Paperclip,
  Image,
  Camera,
  StickyNote,
  Bell,
  Zap,
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface WhatsAppQuickActionsProps {
  phone?: string;
  whatsapp?: string;
  clientName: string;
  onSendMessage: (message: string) => void;
  onRequestDocs: () => void;
  onScheduleCall: () => void;
  onSetReminder: () => void;
  className?: string;
}

export function WhatsAppQuickActions({
  phone,
  whatsapp,
  clientName,
  onSendMessage,
  onRequestDocs,
  onScheduleCall,
  onSetReminder,
  className
}: WhatsAppQuickActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showReminder, setShowReminder] = React.useState(false);
  const [quickReply, setQuickReply] = React.useState("");
  const [sentMessages, setSentMessages] = React.useState<{ status: "sent" | "delivered" | "seen" }[]>([]);
  const { addToast } = useToast();

  const quickActions = [
    { icon: <FileText className="h-4 w-4" />, label: "Request Docs", color: "bg-amber-400", action: onRequestDocs },
    { icon: <Bell className="h-4 w-4" />, label: "Reminder", color: "bg-amber-500", action: () => setShowReminder(true) },
    { icon: <Phone className="h-4 w-4" />, label: "Call", color: "bg-green-500", action: onScheduleCall },
    { icon: <Zap className="h-4 w-4" />, label: "Quick Msg", color: "bg-amber-600", action: () => setIsOpen(true) },
  ];

  const messageTemplates = [
    "📄 Kindly send the pending documents",
    "⏰ Reminder: Filing deadline approaching",
    "💰 Payment reminder: Amount pending",
    "📞 Please call us at your convenience",
    "✅ Documents received. Thank you!",
  ];

  const handleSendMessage = (template: string) => {
    onSendMessage(template);
    setSentMessages([...sentMessages, { status: "sent" }]);
    setIsOpen(false);
    
    addToast({
      title: "Message Sent",
      message: `WhatsApp message sent to ${clientName}`,
      type: "success"
    });

    setTimeout(() => {
      setSentMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) updated[updated.length - 1] = { status: "delivered" };
        return updated;
      });
    }, 1500);
    setTimeout(() => {
      setSentMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) updated[updated.length - 1] = { status: "seen" };
        return updated;
      });
    }, 3000);
  };

  const getStatusIcon = (status: "sent" | "delivered" | "seen") => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case "seen":
        return <CheckCheck className="h-3 w-3 text-primary" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.action}
            className={cn(
              "relative p-3 rounded-xl text-white shadow-lg hover:shadow-xl transition-all hover:scale-110",
              action.color
            )}
            whileTap={{ scale: 0.95 }}
          >
            {action.icon}
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(255,255,255,0)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {sentMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 flex justify-center"
          >
            <Badge variant="outline" className="bg-success/10 text-success">
              {getStatusIcon(sentMessages[sentMessages.length - 1].status)}
              <span className="ml-1">
                {sentMessages[sentMessages.length - 1].status === "sent" && "Sent"}
                {sentMessages[sentMessages.length - 1].status === "delivered" && "Delivered"}
                {sentMessages[sentMessages.length - 1].status === "seen" && "Seen"}
              </span>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              Quick WhatsApp Message
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Send a quick message to {clientName}</p>
            
            {messageTemplates.map((template, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSendMessage(template)}
                className="w-full p-3 rounded-xl bg-muted/50 hover:bg-muted text-left text-sm transition-colors flex items-center gap-3 group"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="flex-1">{template}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}

            <div className="relative">
              <Input
                placeholder="Type custom message..."
                value={quickReply}
                onChange={(e) => setQuickReply(e.target.value)}
                className="pr-20"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => {
                  if (quickReply.trim()) {
                    handleSendMessage(quickReply);
                    setQuickReply("");
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReminder} onOpenChange={setShowReminder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Schedule Reminder
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {["Document", "Payment", "Filing"].map((type) => (
                <button
                  key={type}
                  className="p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["Today", "Tomorrow", "Custom"].map((time) => (
                <button
                  key={time}
                  className="p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  {time}
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Reminder message..."
              className="h-20"
            />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="whatsapp" checked className="rounded" />
              <label htmlFor="whatsapp" className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                Send via WhatsApp
              </label>
            </div>

            <Button 
              variant="gradient" 
              className="w-full"
              onClick={() => {
                setShowReminder(false);
                addToast({
                  title: "Reminder Scheduled",
                  message: `Reminder for ${clientName} set successfully`,
                  type: "success"
                });
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function WhatsAppFloatingButton({ onClick }: { onClick?: () => void }) {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <motion.div
      className="fixed bottom-20 right-6 z-50 lg:hidden"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.button
        onClick={onClick}
        className="relative w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        animate={{ 
          boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 20px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle className="h-7 w-7" />
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  );
}

export function BulkFollowUpSelector({ 
  clients, 
  selectedClients, 
  onSelect 
}: { 
  clients: { id: string; name: string }[];
  selectedClients: string[];
  onSelect: (ids: string[]) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleClient = (id: string) => {
    if (selectedClients.includes(id)) {
      onSelect(selectedClients.filter(c => c !== id));
    } else {
      onSelect([...selectedClients, id]);
    }
  };

  const sendBulkMessage = () => {
    console.log("Sending bulk message to:", selectedClients);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        leftIcon={<MessageCircle className="h-4 w-4 text-green-500" />}
      >
        Bulk Follow-up ({selectedClients.length})
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Clients for Bulk Follow-up</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clients.map((client) => (
              <label
                key={client.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                  selectedClients.includes(client.id) 
                    ? "bg-green-500/10 border border-green-500/30" 
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => toggleClient(client.id)}
                  className="rounded"
                />
                <span className="font-medium">{client.name}</span>
                {selectedClients.includes(client.id) && (
                  <MessageCircle className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </label>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button 
              variant="gradient" 
              onClick={sendBulkMessage}
              disabled={selectedClients.length === 0}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function VoiceNoteRecorder({ 
  onRecordingComplete 
}: { 
  onRecordingComplete: (audioBlob: Blob) => void;
}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={() => {
          if (isRecording) {
            setIsRecording(false);
            onRecordingComplete(new Blob());
          } else {
            setIsRecording(true);
            setRecordingTime(0);
          }
        }}
        className={cn(
          "p-4 rounded-full transition-colors",
          isRecording 
            ? "bg-destructive text-white animate-pulse" 
            : "bg-muted hover:bg-muted/80"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <Mic className={cn("h-5 w-5", isRecording && "animate-pulse")} />
      </motion.button>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
          <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
          <span className="text-xs text-muted-foreground">Recording...</span>
        </motion.div>
      )}
    </div>
  );
}

export function WhatsAppStatusIndicator({ status }: { status: "typing" | "online" | "offline" | "last_seen" }) {
  const statusConfig = {
    typing: { color: "bg-green-500", label: "typing...", animate: true },
    online: { color: "bg-green-500", label: "online", animate: false },
    offline: { color: "bg-zinc-400", label: "offline", animate: false },
    last_seen: { color: "bg-zinc-400", label: "last seen 5m ago", animate: false },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <motion.span
        animate={config.animate ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {config.label}
      </motion.span>
    </div>
  );
}