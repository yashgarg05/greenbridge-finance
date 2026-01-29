import { useState } from 'react';
import { FileText, Upload, CheckCircle2, Circle, AlertCircle, Paperclip, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
  type: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'auth-1',
    title: 'Register as CBAM Declarant',
    description: 'Complete registration in the EU CBAM Transitional Registry',
    completed: true,
    required: true,
  },
  {
    id: 'auth-2',
    title: 'Obtain EORI Number',
    description: 'Economic Operators Registration and Identification number',
    completed: true,
    required: true,
  },
  {
    id: 'auth-3',
    title: 'Declarant Authorization Form',
    description: 'Submit signed authorization to act on behalf of importer',
    completed: false,
    required: true,
  },
  {
    id: 'auth-4',
    title: 'Supplier Emission Certificates',
    description: 'Collect verified emission data from all suppliers',
    completed: false,
    required: true,
  },
  {
    id: 'auth-5',
    title: 'Customs Import Documentation',
    description: 'Gather all relevant customs declarations',
    completed: false,
    required: true,
  },
  {
    id: 'auth-6',
    title: 'Third-Party Verification Report',
    description: 'Optional verification by accredited verifier',
    completed: false,
    required: false,
  },
];

export function DocumentVault() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'file-1',
      name: 'EORI_Certificate_2024.pdf',
      size: '245 KB',
      uploadedAt: new Date('2024-01-15'),
      type: 'pdf',
    },
    {
      id: 'file-2',
      name: 'Supplier_Emissions_Steel_Q1.xlsx',
      size: '1.2 MB',
      uploadedAt: new Date('2024-02-20'),
      type: 'xlsx',
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const completedCount = checklist.filter((item) => item.completed).length;
  const requiredCount = checklist.filter((item) => item.required).length;
  const completedRequired = checklist.filter((item) => item.required && item.completed).length;
  const progress = Math.round((completedRequired / requiredCount) * 100);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date(),
      type: file.name.split('.').pop() || 'unknown',
    }));
    
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date(),
      type: file.name.split('.').pop() || 'unknown',
    }));
    
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
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
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-success/5 border-success/30'
                    : 'bg-muted/20 border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </span>
                      {item.required && !item.completed && (
                        <span className="status-badge status-badge-warning text-[10px]">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* File Upload */}
        <div className="space-y-4">
          <Card className="data-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supplier certificates, customs forms, verification reports
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Browse Files
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card className="data-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {uploadedFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No documents uploaded yet
                </p>
              ) : (
                uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
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
    </div>
  );
}
