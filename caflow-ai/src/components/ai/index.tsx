"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";
import { DEMO_AI_SUGGESTIONS, DEMO_CLIENTS } from "@/lib/data";
import { 
  Sparkles,
  Zap,
  AlertTriangle,
  TrendingUp,
  Clock,
  User,
  MessageCircle,
  CheckCircle2,
  FileText,
  DollarSign,
  Calendar,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Brain,
  Shield,
  TrendingDown,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export function AISuggestionCard({ suggestion }: { suggestion: typeof DEMO_AI_SUGGESTIONS[0] }) {
  const client = DEMO_CLIENTS.find(c => c.id === suggestion.clientId);

  const iconMap: Record<string, React.ReactNode> = {
    client_inactive: <User className="h-4 w-4" />,
    deadline_approaching: <Calendar className="h-4 w-4" />,
    document_missing: <FileText className="h-4 w-4" />,
    payment_overdue: <DollarSign className="h-4 w-4" />,
    risk_alert: <AlertTriangle className="h-4 w-4" />,
  };

  const colorMap: Record<string, string> = {
    urgent: "bg-destructive/10 text-destructive",
    high: "bg-warning/10 text-warning",
    medium: "bg-primary/10 text-primary",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg mt-0.5", colorMap[suggestion.priority])}>
          {iconMap[suggestion.type] || <Sparkles className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-sm">{suggestion.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
            </div>
            <Badge 
              variant={suggestion.priority === "urgent" ? "destructive" : suggestion.priority === "high" ? "warning" : "secondary"}
              size="sm"
            >
              {suggestion.priority}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3">
            {client && (
              <div className="flex items-center gap-2">
                <Avatar size="sm" fallback={client.name[0]} />
                <span className="text-xs text-muted-foreground">{client.name}</span>
              </div>
            )}
            <button className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {suggestion.actionRequired} <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AISuggestionList() {
  return (
    <div className="space-y-3">
      {DEMO_AI_SUGGESTIONS.map((suggestion) => (
        <AISuggestionCard key={suggestion.id} suggestion={suggestion} />
      ))}
    </div>
  );
}

export function ClientRiskScore() {
  const clientsWithRisk = DEMO_CLIENTS.map(client => ({
    ...client,
    riskFactors: [
      { factor: "Late replies", score: client.lastActivity && getDaysSince(client.lastActivity) > 14 ? -15 : 0 },
      { factor: "Pending fees", score: client.payments?.some(p => p.status === "overdue") ? -20 : 0 },
      { factor: "Missing documents", score: client.documents.filter(d => d.status === "pending").length * -5 },
      { factor: "Filing delays", score: client.filings.filter(f => f.status === "overdue").length * -10 },
    ],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Client Risk Analysis
          <Badge variant="gradient" size="sm">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clientsWithRisk.map((client) => {
          const activeRiskFactors = client.riskFactors.filter(f => f.score < 0);
          
          return (
            <div key={client.id} className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" fallback={client.name[0]} />
                  <div>
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Health: {client.healthScore}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    client.healthScore >= 70 ? "text-success" : client.healthScore >= 40 ? "text-warning" : "text-destructive"
                  )}>
                    {client.healthScore}%
                  </p>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                </div>
              </div>
              {activeRiskFactors.length > 0 && (
                <div className="space-y-1">
                  {activeRiskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{factor.factor}</span>
                      <span className="text-destructive font-medium">{factor.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function getDaysSince(date: Date): number {
  const diffTime = Math.abs(new Date().getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function AINoticeExplainer() {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysisResult(`
**Notice Analysis Result:**

📋 **Notice Type:** GST Penalty Notice

⚠️ **Issue:** Late filing of GSTR-3B for October 2024

💰 **Penalty Amount:** ₹500 (₹200 per day late filing × 2.5 days average delay)

📅 **Due Date:** November 20, 2024

📌 **Suggested Action:**
1. File the pending GSTR-3B immediately
2. Pay the penalty amount online via GST portal
3. Keep the payment receipt for records
4. Set up reminder for future filings

💡 **AI Tip:** "To avoid this penalty in future, enable auto-reminders 3 days before the due date."
    `);
    setIsAnalyzing(false);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Notice Explainer
          <Badge variant="gradient" size="sm">New</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload any GST/IT notice image or PDF and our AI will explain it in simple language.
        </p>
        
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            className="hidden"
            id="notice-upload"
          />
          <label htmlFor="notice-upload" className="cursor-pointer">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Click to upload notice</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
          </label>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button size="sm" onClick={handleAnalyze} isLoading={isAnalyzing}>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        )}

        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 whitespace-pre-wrap text-sm"
          >
            {analysisResult}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export function AIQuickReply() {
  const [context, setContext] = React.useState("");
  const [tone, setTone] = React.useState<"formal" | "friendly" | "urgent">("friendly");
  const [generatedReply, setGeneratedReply] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const templates = {
    document_request: "Kindly send the following documents: {documents} at your earliest convenience to proceed with your {filing_type} filing.",
    reminder: "This is a gentle reminder regarding the pending {document_type} for {period}. Please upload it by {due_date} to avoid any delay.",
    payment_reminder: "We hope this message finds you well. This is to inform you that a payment of ₹{amount} is pending. Please clear the dues at your earliest convenience.",
    follow_up: "We haven't received a response regarding {topic}. This is a follow-up message. Please let us know if you need any assistance.",
  };

  const handleGenerate = async () => {
    if (!context) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const replies = {
      formal: `Dear Client,

We hope this message finds you well.

${context}

Please feel free to contact us if you have any questions.

Best regards,
CAFlow AI Team`,
      friendly: `Hi there! 

${context}

Let us know if you need any help!

Best,
Team CAFlow AI 😊`,
      urgent: `URGENT: ${context}

Please take immediate action to avoid penalties or delays.

Regards,
CAFlow AI Team`,
    };

    setGeneratedReply(replies[tone]);
    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          AI Quick Reply Generator
          <Badge variant="gradient" size="sm">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe what you want to communicate..."
            className="w-full h-24 px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Tone</label>
          <div className="flex gap-2">
            {(["formal", "friendly", "urgent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize",
                  tone === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={handleGenerate} isLoading={isGenerating} leftIcon={<Sparkles className="h-4 w-4" />}>
          Generate Reply
        </Button>
        {generatedReply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-muted/50 border border-border"
          >
            <p className="text-sm whitespace-pre-wrap">{generatedReply}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedReply)}>
                Copy
              </Button>
              <Button variant="outline" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
                Send via WhatsApp
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export function AIDashboard() {
  const stats = {
    suggestionsGenerated: 156,
    clientsAnalyzed: 24,
    noticesExplained: 12,
    repliesGenerated: 89,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Suggestions", value: stats.suggestionsGenerated, icon: <Lightbulb className="h-5 w-5" />, color: "from-primary to-purple-600" },
          { label: "Clients Analyzed", value: stats.clientsAnalyzed, icon: <Activity className="h-5 w-5" />, color: "from-success to-emerald-600" },
          { label: "Notices Explained", value: stats.noticesExplained, icon: <FileText className="h-5 w-5" />, color: "from-warning to-amber-600" },
          { label: "Replies Generated", value: stats.repliesGenerated, icon: <MessageCircle className="h-5 w-5" />, color: "from-blue-500 to-cyan-600" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-gradient-to-br from-transparent to-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br", stat.color)}>
                  <span className="text-white">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Active AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AISuggestionList />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AINoticeExplainer />
          <AIQuickReply />
        </div>
      </div>
    </div>
  );
}
