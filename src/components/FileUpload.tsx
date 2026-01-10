import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from "react";
import { Upload, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUpload = () => {
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

    const apiKey = (document.getElementById('api-key-input') as HTMLInputElement)?.value?.trim();
    if (!apiKey) {
      setUploadStatus({ type: 'error', message: 'API Key is required. Please enter it above.' });
      return;
    }

    // Get task and output structure from the prompt builder
    const taskInput = (document.getElementById('task-input') as HTMLTextAreaElement)?.value?.trim() || '';
    const outputStructure = (document.getElementById('output-structure-input') as HTMLTextAreaElement)?.value?.trim() || '';

    // Construct the prompt
    let prompt = `<document_analysis>\n`;
    prompt += `  <system>\n    You are an advanced document analysis AI. Analyze the provided page image.\n  </system>\n`;
    prompt += `  <input>\n    <image_data>Current page image</image_data>\n`;
    prompt += `    <task>${taskInput}</task>\n`;
    prompt += `  </input>\n`;
    prompt += `  <output_format>\n`;
    prompt += `    <format>JSON</format>\n`;
    if (outputStructure) {
      prompt += `    <structure>\n${outputStructure}\n    </structure>\n`;
    }
    prompt += `    <constraints>\n`;
    prompt += `      <constraint>Return ONLY valid JSON, starting with '{' and ending with '}'.</constraint>\n`;
    prompt += `      <constraint>Do not include any text, explanations, or markdown formatting before or after the JSON object.</constraint>\n`;
    if (outputStructure) {
      prompt += `      <constraint>The JSON structure MUST follow the example provided in the structure tag.</constraint>\n`;
    }
    prompt += `    </constraints>\n`;
    prompt += `  </output_format>\n`;
    prompt += `</document_analysis>`;

    setIsUploading(true);
    setUploadStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_prompt', prompt);
    formData.append('output_format', 'json');

    try {
      const response = await fetch('https://everypage-pure.onrender.com/scan', {
        method: 'POST',
        headers: {
          'x-resetdata-key': apiKey,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        let errorDetail = `HTTP error ${response.status}: ${response.statusText}`;
        try {
          const errorJson = await response.json();
          errorDetail = errorJson.detail || JSON.stringify(errorJson);
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      setUploadStatus({ type: 'success', message: `Document submitted successfully! Job ID: ${result.job_id || 'N/A'}` });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Trigger a custom event for the job queue to refresh
      window.dispatchEvent(new CustomEvent('jobSubmitted', { detail: result }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ type: 'error', message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsUploading(false);
    }
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
          className={`drop-zone mb-4 group ${isDragOver ? 'border-accent bg-accent/10' : ''}`}
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
