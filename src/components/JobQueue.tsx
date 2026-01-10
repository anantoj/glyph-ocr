import { ListTodo, RefreshCw, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const JobQueue = () => {
  return (
    <div id="job-queue-section" className="card-elevated p-5 animate-fade-in">
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
          id="refresh-queue-button"
          variant="ghost"
          size="sm"
          className="h-9 px-3"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div 
        id="job-queue-container" 
        className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No jobs in queue
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Upload a document to start processing
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobQueue;
