import { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, Circle, AlertCircle, Paperclip, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDocuments } from '@/hooks/useDocuments';
import { useChecklist } from '@/hooks/useChecklist';
import { Document as SupabaseDocument } from '@/lib/supabase';

interface ChecklistItem {
  id: string;
  item_key: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'auth-1',
    item_key: 'auth-1',
    title: 'Register as CBAM Declarant',
    description: 'Complete registration in the EU CBAM Transitional Registry',
    completed: false,
    required: true,
  },
  {
    id: 'auth-2',
    item_key: 'auth-2',
    title: 'Obtain EORI Number',
    description: 'Economic Operators Registration and Identification number',
    completed: false,
    required: true,
  },
  {
    id: 'auth-3',
    item_key: 'auth-3',
    title: 'Declarant Authorization Form',
    description: 'Submit signed authorization to act on behalf of importer',
    completed: false,
    required: true,
  },
  {
    id: 'auth-4',
    item_key: 'auth-4',
    title: 'Supplier Emission Certificates',
    description: 'Collect verified emission data from all suppliers',
    completed: false,
    required: true,
  },
  {
    id: 'auth-5',
    item_key: 'auth-5',
    title: 'Customs Import Documentation',
    description: 'Gather all relevant customs declarations',
    completed: false,
    required: true,
  },
  {
    id: 'auth-6',
    item_key: 'auth-6',
    title: 'Third-Party Verification Report',
    description: 'Optional verification by accredited verifier',
    completed: false,
    required: false,
  },
];

export function DocumentVault() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<SupabaseDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { uploadDocument, getDocuments, downloadDocument, deleteDocument } = useDocuments();
  const { getChecklistItems, initializeChecklist, toggleChecklistItem } = useChecklist();

  // Load checklist and documents on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load or initialize checklist
    const items = await getChecklistItems();
    if (items.length === 0) {
      await initializeChecklist(DEFAULT_CHECKLIST_ITEMS);
      const newItems = await getChecklistItems();
      setChecklist(newItems);
    } else {
      setChecklist(items);
    }

    // Load documents
    const docs = await getDocuments();
    setUploadedFiles(docs);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const requiredCount = checklist.filter((item) => item.required).length;
  const completedRequired = checklist.filter((item) => item.required && item.completed).length;
  const progress = Math.round((completedRequired / requiredCount) * 100);

  const toggleItem = async (itemKey: string) => {
    const item = checklist.find((i) => i.item_key === itemKey);
    if (!item) return;

    const newCompleted = !item.completed;
    const success = await toggleChecklistItem(itemKey, newCompleted);

    if (success) {
      setChecklist((prev) =>
        prev.map((i) =>
          i.item_key === itemKey ? { ...i, completed: newCompleted } : i
        )
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    for (const file of files) {
      const doc = await uploadDocument(file);
      if (doc) {
        setUploadedFiles((prev) => [doc, ...prev]);
      }
    }

    setIsUploading(false);
  };

  const removeFile = async (doc: SupabaseDocument) => {
    const success = await deleteDocument(doc);
    if (success) {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== doc.id));
    }
  };

  const handleDownload = async (doc: SupabaseDocument) => {
    await downloadDocument(doc);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Document Vault & Checklist
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          CBAM Declarant Authorization process tracker
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Checklist */}
        <Card className="data-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Authorization Checklist</CardTitle>
              <span className="text-sm font-mono text-muted-foreground">
                {completedCount}/{checklist.length}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress}% of required items complete
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <button
                key={item.item_key}
                onClick={() => toggleItem(item.item_key)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${item.completed
                  ? 'bg-success/5 border-success/30'
                  : 'bg-muted/20 border-border hover:border-primary/30'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.title}</span>
                      {item.required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card className="data-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
                }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">Drop files here</p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse • Max 10MB
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileInput}
                multiple
              />
              <Button asChild variant="outline" size="sm">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Choose Files
                </label>
              </Button>
            </div>

            <Card className="border-muted mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isUploading && (
                  <p className="text-sm text-muted-foreground text-center py-2">Uploading...</p>
                )}
                {uploadedFiles.length === 0 && !isUploading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents uploaded yet
                  </p>
                ) : (
                  uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.file_size || 0)} • {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="data-card border-warning/30 bg-warning/5">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Compliance Deadline</p>
              <p className="text-xs text-muted-foreground mt-1">
                First CBAM report due by 31 January 2025 for Q4 2024 imports
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
