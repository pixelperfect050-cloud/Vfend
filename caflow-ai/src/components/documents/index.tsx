"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDate } from "@/lib/utils";
import { DEMO_CLIENTS } from "@/lib/data";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Image,
  File,
  FolderOpen,
  Sparkles,
  Shield,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

const documentTypes = [
  { value: "gstr1", label: "GSTR-1" },
  { value: "gstr3b", label: "GSTR-3B" },
  { value: "itr_form", label: "ITR Form" },
  { value: "pan_card", label: "PAN Card" },
  { value: "aadhar_card", label: "Aadhar Card" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "balance_sheet", label: "Balance Sheet" },
  { value: "p_l_statement", label: "P&L Statement" },
  { value: "invoice", label: "Invoice" },
  { value: "receipt", label: "Receipt" },
];

interface DocumentCardProps {
  document: {
    id: string;
    name: string;
    type: string;
    status: string;
    clientName?: string;
    uploadedAt?: Date;
    verifiedAt?: Date;
    notes?: string;
  };
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card hover className="group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{document.name}</h4>
            <p className="text-sm text-muted-foreground">{document.clientName}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" size="sm">{document.type.replace("_", " ").toUpperCase()}</Badge>
              <Badge 
                variant={
                  document.status === "verified" ? "success" :
                  document.status === "received" ? "default" :
                  document.status === "rejected" ? "destructive" : "warning"
                }
                size="sm"
                className="gap-1"
              >
                {document.status === "verified" && <CheckCircle2 className="h-3 w-3" />}
                {document.status === "received" && <Clock className="h-3 w-3" />}
                {document.status === "rejected" && <XCircle className="h-3 w-3" />}
                {document.status === "pending" && <AlertTriangle className="h-3 w-3" />}
                {document.status}
              </Badge>
            </div>
            {document.uploadedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Uploaded: {formatDate(document.uploadedAt)}
              </p>
            )}
          </div>
          <Dropdown
            trigger={
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownItem icon={<Eye className="h-4 w-4" />}>Preview</DropdownItem>
            <DropdownItem icon={<Download className="h-4 w-4" />}>Download</DropdownItem>
            <DropdownItem icon={<CheckCircle2 className="h-4 w-4" />}>Verify</DropdownItem>
            <DropdownItem icon={<XCircle className="h-4 w-4" />}>Reject</DropdownItem>
            <DropdownItem divider />
            <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive>Delete</DropdownItem>
          </Dropdown>
        </div>
      </CardContent>
    </Card>
  );
}

export function DocumentList() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");

  const documents = DEMO_CLIENTS.flatMap(client => 
    client.documents.map(doc => ({
      ...doc,
      clientName: client.name,
    }))
  );

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-input bg-background text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-input bg-background text-sm"
        >
          <option value="all">All Types</option>
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-8 w-8" />}
          title="No documents found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <DocumentCard document={doc} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function DocumentUpload() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <File className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button className="w-full mt-4">
              <Upload className="h-4 w-4 mr-2" />
              Upload {files.length} file{files.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MissingDocumentAlert() {
  const missingDocs = [
    { client: "Sharma Trading", type: "Bank Statement", period: "October 2024", daysPending: 15 },
    { client: "Patel Retail", type: "GSTR-1", period: "September 2024", daysPending: 45 },
    { client: "Patel Retail", type: "GSTR-3B", period: "November 2024", daysPending: 15 },
  ];

  return (
    <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Missing Documents
          <Badge variant="warning" size="sm">{missingDocs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {missingDocs.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-card border border-warning/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <FileText className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium">{doc.client}</p>
                <p className="text-xs text-muted-foreground">{doc.type} - {doc.period}</p>
              </div>
            </div>
            <Badge variant="destructive" size="sm">{doc.daysPending} days</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DocumentVerification() {
  const stats = {
    pending: DEMO_CLIENTS.flatMap(c => c.documents).filter(d => d.status === "pending").length,
    received: DEMO_CLIENTS.flatMap(c => c.documents).filter(d => d.status === "received").length,
    verified: DEMO_CLIENTS.flatMap(c => c.documents).filter(d => d.status === "verified").length,
    rejected: DEMO_CLIENTS.flatMap(c => c.documents).filter(d => d.status === "rejected").length,
  };

  const total = stats.pending + stats.received + stats.verified + stats.rejected;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Pending", value: stats.pending, color: "warning", icon: Clock },
          { label: "Received", value: stats.received, color: "default", icon: Upload },
          { label: "Verified", value: stats.verified, color: "success", icon: CheckCircle2 },
          { label: "Rejected", value: stats.rejected, color: "destructive", icon: XCircle },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className={cn("h-4 w-4", `text-${item.color}`)} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
            <Progress value={(item.value / total) * 100} variant={item.color as "warning" | "default" | "success" | "destructive"} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AI_document_detector() {
  const suggestions = [
    { type: "gstr1", label: "GSTR-1", missing: 3, clients: ["Sharma Trading", "Patel Retail", "Mehta & Co"] },
    { type: "bank_statement", label: "Bank Statement", missing: 2, clients: ["Ramesh Industries", "Sharma Trading"] },
    { type: "balance_sheet", label: "Balance Sheet", missing: 1, clients: ["Mehta & Associates"] },
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Document Detection
          <Badge variant="gradient" size="sm">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.type} className="p-4 rounded-xl bg-card border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">{suggestion.label}</span>
              </div>
              <Badge variant="destructive" size="sm">{suggestion.missing} missing</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestion.clients.map((client) => (
                <Badge key={client} variant="outline" size="sm">{client}</Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <RefreshCw className="h-3 w-3 mr-2" />
              Request from Clients
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
