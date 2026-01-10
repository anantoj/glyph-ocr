import { useEffect, useRef } from "react";
import { FileSearch, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, PageResult } from "@/contexts/AppContext";

const escapeHtml = (unsafe: unknown): string => {
  if (unsafe === null || typeof unsafe === 'undefined') return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const PageResultItem = ({ page }: { page: PageResult }) => {
  const isSuccess = page.status === 'success';
  const statusClass = page.status.replace('error_', 'error').replace('mock_', 'mock');
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
        <span className="text-sm font-medium">Page {page.page_number}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          isSuccess ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          {statusClass}
        </span>
      </div>
      <div className="p-4">
        {isSuccess && page.data ? (
          <div>
            {typeof page.data === 'string' ? (
              <>
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Result (Text):</h5>
                <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto max-h-[200px] whitespace-pre-wrap">
                  {page.data}
                </pre>
              </>
            ) : typeof page.data === 'object' ? (
              <>
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Result (JSON):</h5>
                <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto max-h-[200px]">
                  {JSON.stringify(page.data, null, 2)}
                </pre>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Received unexpected data type.</p>
            )}
          </div>
        ) : page.error_message ? (
          <div>
            <p className="text-sm text-destructive mb-2">{escapeHtml(page.error_message)}</p>
            {page.raw_response && (
              <>
                <h6 className="text-xs font-medium text-muted-foreground mb-1">Raw Response Snippet:</h6>
                <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto max-h-[100px]">
                  {escapeHtml(page.raw_response)}
                </pre>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No transcription data or error message available.</p>
        )}
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { selectedJob, isLoadingDetails, fetchJobDetails, downloadJobJson, downloadJobCsv } = useApp();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for updates while job is processing
  useEffect(() => {
    if (selectedJob && selectedJob.status !== 'completed' && selectedJob.status !== 'error') {
      pollingRef.current = setInterval(() => {
        fetchJobDetails(selectedJob.job_id);
      }, 3000);
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [selectedJob?.job_id, selectedJob?.status, fetchJobDetails]);

  const isCompleted = selectedJob?.status === 'completed' && selectedJob?.results;
  const isError = selectedJob?.status === 'error';

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
        
        {isCompleted && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={downloadJobJson}
            >
              <FileJson className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={downloadJobCsv}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
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
            {/* Job Info */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
              <h3 className="font-medium truncate" title={selectedJob.job_id}>
                Job: {selectedJob.job_id.substring(0, 13)}...
              </h3>
              {selectedJob.document_name && (
                <p><span className="text-muted-foreground">File:</span> {selectedJob.document_name}</p>
              )}
              <p>
                <span className="text-muted-foreground">Status:</span>{' '}
                <span className={`font-medium ${
                  selectedJob.status === 'completed' ? 'text-success' : 
                  selectedJob.status === 'error' ? 'text-destructive' : 
                  selectedJob.status === 'processing' ? 'text-processing' : ''
                }`}>
                  {selectedJob.status}
                </span>
              </p>
              <p><span className="text-muted-foreground">Progress:</span> {selectedJob.progress?.toFixed(1) || 0}%</p>
              <p><span className="text-muted-foreground">Created:</span> {new Date(selectedJob.created_at).toLocaleString()}</p>
              {selectedJob.updated_at && (
                <p><span className="text-muted-foreground">Updated:</span> {new Date(selectedJob.updated_at).toLocaleString()}</p>
              )}
              {selectedJob.completed_at && (
                <p><span className="text-muted-foreground">Completed:</span> {new Date(selectedJob.completed_at).toLocaleString()}</p>
              )}
            </div>

            {/* Error Display */}
            {isError && selectedJob.errors && (
              <div className="p-4 bg-destructive/10 rounded-lg">
                <h4 className="text-sm font-medium text-destructive mb-2">Errors:</h4>
                {selectedJob.errors.map((err, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-destructive"><strong>{err.code}:</strong> {escapeHtml(err.message)}</p>
                    {err.context && (
                      <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(err.context, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Processing state */}
            {selectedJob.status !== 'completed' && selectedJob.status !== 'error' && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-processing animate-spin mr-3" />
                <p className="text-sm text-muted-foreground">Processing... ({selectedJob.progress?.toFixed(1) || 0}%)</p>
              </div>
            )}
            
            {/* Summary */}
            {isCompleted && selectedJob.results && (
              <>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Processing Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{selectedJob.results.processing_summary?.total_pages || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Pages</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{selectedJob.results.processing_summary?.successful_pages || 0}</p>
                      <p className="text-xs text-muted-foreground">Successful</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive">{selectedJob.results.processing_summary?.failed_pages || 0}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </div>
                
                {/* Page Results */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Page Transcriptions:</h4>
                  {selectedJob.results.pages?.length > 0 ? (
                    selectedJob.results.pages.map((page) => (
                      <PageResultItem key={page.page_number} page={page} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No page results found.</p>
                  )}
                </div>
              </>
            )}
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
