import { useEffect, useRef } from "react";
import { FileSearch, FileJson, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, PageResult } from "@/contexts/AppContext";
import StepBadge from "@/components/StepBadge";

const PageResultItem = ({ page }: { page: PageResult }) => {
  const isSuccess = page.status === 'success';
  
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-background/30">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/30">
        <span className="text-sm font-medium text-foreground">Page {page.page_number}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          isSuccess 
            ? 'bg-success/15 text-success' 
            : 'bg-destructive/15 text-destructive'
        }`}>
          {isSuccess ? 'Success' : 'Error'}
        </span>
      </div>
      <div className="p-4">
        {isSuccess && page.data ? (
          <div>
            {typeof page.data === 'string' ? (
              <>
                <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Result (Text)</h5>
                <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-x-auto max-h-[200px] whitespace-pre-wrap border border-border/30 text-foreground/90">
                  {page.data}
                </pre>
              </>
            ) : typeof page.data === 'object' ? (
              <>
                <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Result (JSON)</h5>
                <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-x-auto max-h-[200px] border border-border/30 text-foreground/90 font-mono">
                  {JSON.stringify(page.data, null, 2)}
                </pre>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Received unexpected data type.</p>
            )}
          </div>
        ) : page.error_message ? (
          <div>
            <p className="text-sm text-destructive mb-2">{page.error_message}</p>
            {page.raw_response && (
              <>
                <h6 className="text-xs font-medium text-muted-foreground mb-1">Raw Response Snippet:</h6>
                <pre className="text-xs bg-background/50 p-2 rounded-lg overflow-x-auto max-h-[100px] border border-border/30">
                  {page.raw_response}
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
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-container-sm">
            <FileSearch className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="section-title">Extracted Data</h2>
            <p className="section-description">Analysis results</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isCompleted && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-transparent border-border/50 hover:bg-muted/50 hover:border-border"
                onClick={downloadJobJson}
              >
                <FileJson className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-transparent border-border/50 hover:bg-muted/50 hover:border-border"
                onClick={downloadJobCsv}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </>
          )}
          <StepBadge step={5} />
        </div>
      </div>
      
      <div className="min-h-[280px] max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar pr-1">
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/30 mb-3">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading job details...</p>
          </div>
        ) : selectedJob ? (
          <div className="space-y-4">
            {/* Job Info */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate text-foreground" title={selectedJob.job_id}>
                  Job: {selectedJob.job_id.substring(0, 13)}...
                </h3>
                {isCompleted && (
                  <div className="flex items-center gap-1.5 text-success text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </div>
                )}
              </div>
              {selectedJob.document_name && (
                <p className="text-muted-foreground">{selectedJob.document_name}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <div className={`status-dot ${selectedJob.status === 'completed' ? 'active' : selectedJob.status === 'processing' ? 'processing' : ''}`} />
                <span className={`font-medium ${
                  selectedJob.status === 'completed' ? 'text-success' : 
                  selectedJob.status === 'error' ? 'text-destructive' : 
                  selectedJob.status === 'processing' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {selectedJob.status}
                </span>
                <span className="text-muted-foreground">• {selectedJob.progress?.toFixed(0) || 0}%</span>
              </div>
            </div>

            {/* Confidence Bar for Completed Jobs */}
            {isCompleted && (
              <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-sm font-medium text-primary">
                    {((selectedJob.results?.processing_summary?.successful_pages || 0) / 
                      (selectedJob.results?.processing_summary?.total_pages || 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="confidence-bar h-1.5">
                  <div 
                    className="confidence-bar-fill" 
                    style={{ 
                      width: `${(selectedJob.results?.processing_summary?.successful_pages || 0) / 
                        (selectedJob.results?.processing_summary?.total_pages || 1) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {isError && selectedJob.errors && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <h4 className="text-sm font-medium text-destructive mb-2">Errors:</h4>
                {selectedJob.errors.map((err, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-destructive"><strong>{err.code}:</strong> {err.message}</p>
                    {err.context && (
                      <pre className="text-xs bg-background/50 p-2 rounded-lg mt-1 overflow-x-auto border border-border/30">
                        {JSON.stringify(err.context, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Processing state */}
            {selectedJob.status !== 'completed' && selectedJob.status !== 'error' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/20" />
                  <div 
                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{selectedJob.progress?.toFixed(0) || 0}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Processing document...</p>
              </div>
            )}
            
            {/* Summary */}
            {isCompleted && selectedJob.results && (
              <>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                  <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Processing Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedJob.results.processing_summary?.total_pages || 0}</p>
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
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Page Transcriptions</h4>
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
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
              <FileSearch className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground/80 mb-1">No results yet</p>
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