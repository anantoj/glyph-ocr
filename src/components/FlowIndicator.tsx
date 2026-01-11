import { Key, Sparkles, Upload, ListTodo, FileSearch, Check } from "lucide-react";
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
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {steps.map((item, index) => {
          const isComplete = completionStatus[index];
          const Icon = item.icon;
          
          return (
            <div key={item.step} className="flex items-center">
              {/* Step circle */}
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
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="flex items-center mx-3 hidden sm:flex">
                  <div 
                    className={`w-8 h-0.5 transition-colors duration-300 ${
                      completionStatus[index]
                        ? 'bg-success'
                        : 'bg-border/50'
                    }`} 
                  />
                  <div 
                    className={`w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] transition-colors duration-300 ${
                      completionStatus[index]
                        ? 'border-l-success'
                        : 'border-l-border/50'
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
