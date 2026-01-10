import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from "react";
import { Upload, File, Loader2, ArrowRight } from "lucide-react";
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
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-container-sm">
          <Upload className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="section-title">Upload Document</h2>
          <p className="section-description">PDF, images, or scanned documents</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div 
          className={`drop-zone mb-4 group ${isDragOver ? 'border-primary bg-primary/10' : ''}`}
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
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3 group-hover:bg-primary/15 transition-colors">
              <File className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, PNG, JPG, TIFF, WebP
            </p>
          </div>
        </div>
        
        {/* Selected File Display */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
            <File className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground truncate flex-1">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </span>
          {selectedFile && (
            <span className="text-xs text-primary font-medium">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!selectedFile || isUploading}
          className="w-full h-12 text-base btn-primary-gradient text-primary-foreground border-0 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Document
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        
        {/* Status Message */}
        {uploadStatus.message && (
          <div className={`mt-4 text-sm p-3 rounded-xl flex items-center gap-2 ${
            uploadStatus.type === 'error' 
              ? 'bg-destructive/10 text-destructive border border-destructive/20' 
              : 'bg-success/10 text-success border border-success/20'
          }`}>
            <div className={`status-dot ${uploadStatus.type === 'error' ? '' : 'active'}`} />
            {uploadStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload;