import { Key, Sparkles, Upload, ListTodo, FileSearch, Check, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const steps = [
  { step: 1, icon: Key, label: "API Key" },
  { step: 2, icon: Sparkles, label: "Configure" },
  { step: 3, icon: Upload, label: "Upload" },
  { step: 4, icon: ListTodo, label: "Queue" },
  { step: 5, icon: FileSearch, label: "Results" },
];

const FlowIndicator = () => {
  const { apiKey, taskDescription, jobs, selectedJob } = useApp();

  // Determine completion status for each step
  const isStep1Complete = Boolean(apiKey && apiKey.length > 0);
  const isStep2Complete = Boolean(taskDescription && taskDescription.trim().length > 0);
  const isStep3Complete = jobs.length > 0;
  const isStep4Complete = jobs.some(job => job.status === 'completed' || job.status === 'processing');
  const isStep5Complete = selectedJob?.status === 'completed' && selectedJob?.results;

  const completionStatus = [
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    isStep5Complete,
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between max-w-2xl mx-auto px-4">
        {steps.map((item, index) => {
          const isComplete = completionStatus[index];
          const Icon = item.icon;
          
          return (
            <div key={item.step} className="flex items-start">
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isComplete 
                      ? 'bg-success border-success text-success-foreground' 
                      : 'bg-muted/30 border-border/50 text-muted-foreground'
                    }
                  `}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isComplete ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </div>
              
              {/* Arrow connector - aligned with circle */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex items-center h-10 mx-4">
                  <ChevronRight 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      completionStatus[index]
                        ? 'text-success'
                        : 'text-muted-foreground/50'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlowIndicator;
