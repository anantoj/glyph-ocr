import { useEffect } from "react";
import { ListTodo, RefreshCw, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, Job } from "@/contexts/AppContext";
import StepBadge from "@/components/StepBadge";

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; dotClass: string; animate?: boolean }> = {
  pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/50', dotClass: '' },
  processing: { icon: Loader2, color: 'text-primary', bg: 'bg-primary/15', dotClass: 'processing', animate: true },
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/15', dotClass: 'active' },
  failed: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/15', dotClass: '' },
};

const JobItem = ({ job, onSelect, isSelected }: { job: Job; onSelect: () => void; isSelected: boolean }) => {
  const config = statusConfig[job.status] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <button
      onClick={onSelect}
      title={`Job ID: ${job.job_id}`}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left border ${
        isSelected 
          ? 'bg-primary/10 border-primary/30' 
          : 'bg-muted/20 border-border/30 hover:bg-muted/40 hover:border-border/50'
      }`}
    >
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">
          {job.document_name || `${job.job_id.substring(0, 8)}...`}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className={`status-dot ${config.dotClass}`} />
          <p className="text-xs text-muted-foreground">
            {job.status} • {job.progress?.toFixed(0) || 0}%
          </p>
        </div>
      </div>
      
      {/* Progress indicator for processing jobs */}
      {job.status === 'processing' && (
        <div className="w-12">
          <div className="confidence-bar">
            <div 
              className="confidence-bar-fill" 
              style={{ width: `${job.progress || 0}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
};

const JobQueue = () => {
  const { jobs, isLoadingJobs, fetchJobs, fetchJobDetails, selectedJob } = useApp();

  // Fetch jobs on mount and set up polling
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-container-sm">
            <ListTodo className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="section-title">Job Queue</h2>
            <p className="section-description">Recent processing jobs</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={fetchJobs}
            disabled={isLoadingJobs}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingJobs ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <StepBadge step={4} />
        </div>
      </div>
      
      <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
        {isLoadingJobs && jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/30 mb-3">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobItem 
              key={job.job_id} 
              job={job} 
              isSelected={selectedJob?.job_id === job.job_id}
              onSelect={() => fetchJobDetails(job.job_id)} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/30 mb-4">
              <Clock className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground/80 mb-1">No jobs in queue</p>
            <p className="text-xs text-muted-foreground">
              Upload a document to start processing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobQueue;