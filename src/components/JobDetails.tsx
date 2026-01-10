import { FileSearch, Download, FileJson, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, PageResult } from "@/contexts/AppContext";

const PageResultItem = ({ page }: { page: PageResult }) => {
  const isSuccess = page.status === 'success';
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
        <span className="text-sm font-medium">Page {page.page_number}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          isSuccess ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          {page.status}
        </span>
      </div>
      <div className="p-4">
        {isSuccess && page.data ? (
          <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto max-h-[200px]">
            {typeof page.data === 'string' 
              ? page.data 
              : JSON.stringify(page.data, null, 2)}
          </pre>
        ) : page.error_message ? (
          <p className="text-sm text-destructive">{page.error_message}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { selectedJob, isLoadingDetails } = useApp();

  const handleDownloadJson = () => {
    if (!selectedJob) return;
    const blob = new Blob([JSON.stringify(selectedJob, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob.job_id}-results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-elevated p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
        
        {selectedJob && (
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleDownloadJson}
          >
            <FileJson className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        )}
      </div>
      
      <div className="min-h-[300px] max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground/50 mb-3 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading job details...</p>
          </div>
        ) : selectedJob ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Processing Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{selectedJob.processing_summary?.total_pages || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Pages</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{selectedJob.processing_summary?.successful_pages || 0}</p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{selectedJob.processing_summary?.failed_pages || 0}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>
            
            {/* Page Results */}
            <div className="space-y-3">
              {selectedJob.pages?.map((page) => (
                <PageResultItem key={page.page_number} page={page} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <FileSearch className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No results yet</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Select a job from the queue to view results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
