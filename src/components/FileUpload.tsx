import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from "react";
import { Upload, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const FileUpload = () => {
  const { submitDocument } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ type: '', message: '' });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus({ type: '', message: '' });

    const result = await submitDocument(selectedFile);

    if (result.success) {
      setUploadStatus({ type: 'success', message: `Document submitted! Job ID: ${result.jobId || 'N/A'}` });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setUploadStatus({ type: 'error', message: `Upload failed: ${result.error}` });
    }

    setIsUploading(false);
  };

  return (
    <div className="card-elevated p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10">
          <Upload className="w-4 h-4 text-success" />
        </div>
        <div>
          <h2 className="section-title">Upload Document</h2>
          <p className="section-description">PDF, images, or scanned documents</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div 
          className={`drop-zone mb-4 group cursor-pointer ${isDragOver ? 'border-accent bg-accent/10' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3 group-hover:bg-accent/10 transition-colors">
              <File className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, PNG, JPG, TIFF, WebP
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50">
          <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </span>
        </div>
        
        <Button
          type="submit"
          disabled={!selectedFile || isUploading}
          className="w-full h-12 text-base bg-accent hover:bg-accent/90 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Process Document
            </>
          )}
        </Button>
        
        {uploadStatus.message && (
          <div className={`mt-4 text-sm p-3 rounded-lg ${
            uploadStatus.type === 'error' 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-success/10 text-success'
          }`}>
            {uploadStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
