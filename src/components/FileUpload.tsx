import { Upload, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUpload = () => {
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
      
      <form id="upload-form" encType="multipart/form-data">
        <div className="drop-zone mb-4 group">
          <input
            type="file"
            id="file-input"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
          <span id="file-name-display" className="text-sm text-muted-foreground truncate">
            No file selected
          </span>
        </div>
        
        <Button
          id="submit-button"
          type="submit"
          disabled
          className="w-full h-12 text-base bg-accent hover:bg-accent/90 disabled:opacity-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Process Document
        </Button>
        
        <div id="upload-status" className="mt-4 text-sm"></div>
      </form>
    </div>
  );
};

export default FileUpload;
