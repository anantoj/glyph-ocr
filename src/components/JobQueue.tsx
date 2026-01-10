import { useEffect } from "react";
import { ListTodo, RefreshCw, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, Job } from "@/contexts/AppContext";

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; animate?: boolean }> = {
  pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
  processing: { icon: Loader2, color: 'text-processing', bg: 'bg-processing/10', animate: true },
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  failed: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

const JobItem = ({ job, onSelect }: { job: Job; onSelect: () => void }) => {
  const config = statusConfig[job.status] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
    >
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {job.filename || job.job_id}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {job.status}
        </p>
      </div>
    </button>
  );
};

const JobQueue = () => {
  const { jobs, isLoadingJobs, fetchJobs, fetchJobDetails } = useApp();

  // Fetch jobs on mount and set up polling
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchJobs]);

  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-processing/10">
            <ListTodo className="w-4 h-4 text-processing" />
          </div>
          <div>
            <h2 className="section-title">Job Queue</h2>
            <p className="section-description">Recent processing jobs</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3"
          onClick={fetchJobs}
          disabled={isLoadingJobs}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingJobs ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {isLoadingJobs && jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground/50 mb-3 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobItem 
              key={job.job_id} 
              job={job} 
              onSelect={() => fetchJobDetails(job.job_id)} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No jobs in queue</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Upload a document to start processing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobQueue;
