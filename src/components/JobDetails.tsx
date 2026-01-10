import { FileSearch, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

const JobDetails = () => {
  return (
    <div id="job-details-container" className="card-elevated p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10">
            <FileSearch className="w-4 h-4 text-success" />
          </div>
          <div>
            <h2 className="section-title">Results</h2>
            <p className="section-description">Extracted data and analysis</p>
          </div>
        </div>
        
        <div id="download-buttons" className="flex gap-2" style={{ display: 'none' }}>
          <Button
            id="download-json-button"
            variant="outline"
            size="sm"
            className="h-9"
          >
            <FileJson className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button
            id="download-csv-button"
            variant="outline"
            size="sm"
            className="h-9"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>
      
      <div 
        id="job-details-content" 
        className="min-h-[300px] max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar"
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <FileSearch className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            No results yet
          </p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Upload and process a document to see extracted data here
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
