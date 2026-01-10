import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PromptBuilder = () => {
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
          defaultValue="Extract all text content from each page and organize it into structured sections."
          placeholder="Describe what you want to extract or analyze from each page..."
          className="min-h-[100px] bg-background resize-none"
        />
      </div>
      
      {/* JSON Structure */}
      <div id="output-structure-group" className="space-y-2">
        <Label htmlFor="output-structure-input" className="text-sm font-medium">
          JSON Structure (Optional)
        </Label>
        <Textarea
          id="output-structure-input"
          defaultValue='{"title": "...", "content": "...", "sections": ["..."]}'
          placeholder='{"field1": "...", "field2": ["..."]}'
          className="min-h-[80px] bg-background font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Define the expected JSON structure for consistent output formatting
        </p>
      </div>
      
      {/* Hidden inputs for JS compatibility */}
      <input type="hidden" id="user-prompt-input" />
      <input type="hidden" id="format-json" name="output_format" value="json" defaultChecked />
      <select id="prompt-template-select" className="hidden" defaultValue="custom">
        <option value="custom">Custom</option>
      </select>
      <input type="hidden" id="meta-toggle" />
    </div>
  );
};

export default PromptBuilder;
