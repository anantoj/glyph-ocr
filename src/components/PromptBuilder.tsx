import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";

const PromptBuilder = () => {
  const { taskDescription, setTaskDescription, outputStructure, setOutputStructure } = useApp();

  return (
    <div className="card-elevated p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="section-title">Task Configuration</h2>
          <p className="section-description">Define what to extract from your document</p>
        </div>
      </div>
      
      {/* Task Description */}
      <div className="space-y-2 mb-5">
        <Label htmlFor="task-input" className="text-sm font-medium">
          Task Description
        </Label>
        <Textarea
          id="task-input"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe what you want to extract or analyze from each page..."
          className="min-h-[100px] bg-background resize-none"
        />
      </div>
      
      {/* JSON Structure */}
      <div className="space-y-2">
        <Label htmlFor="output-structure-input" className="text-sm font-medium">
          JSON Structure (Optional)
        </Label>
        <Textarea
          id="output-structure-input"
          value={outputStructure}
          onChange={(e) => setOutputStructure(e.target.value)}
          placeholder='{"field1": "...", "field2": ["..."]}'
          className="min-h-[80px] bg-background font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Define the expected JSON structure for consistent output formatting
        </p>
      </div>
    </div>
  );
};

export default PromptBuilder;
