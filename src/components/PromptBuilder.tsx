import { Sparkles, Code, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
      
      {/* Template Selection */}
      <div className="space-y-2 mb-5">
        <Label htmlFor="prompt-template-select" className="text-sm font-medium">
          Quick Templates
        </Label>
        <select
          id="prompt-template-select"
          defaultValue=""
          className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">-- Select Template --</option>
          <option value="transcribe">📝 Transcribe Text</option>
          <option value="summarize">📋 Summarize Content</option>
          <option value="translate_es">🇪🇸 Translate to Spanish</option>
          <option value="translate_zh">🇨🇳 Translate to Chinese</option>
          <option value="qa">❓ Question &amp; Answer</option>
          <option value="custom">✨ Custom Task</option>
        </select>
      </div>
      
      {/* Task Description */}
      <div className="space-y-2 mb-5">
        <Label htmlFor="task-input" className="text-sm font-medium">
          Task Description
        </Label>
        <Textarea
          id="task-input"
          placeholder="Describe what you want to extract or analyze from each page..."
          className="min-h-[100px] bg-background resize-none"
        />
      </div>
      
      {/* Output Format */}
      <div className="space-y-3 mb-5">
        <Label className="text-sm font-medium">Output Format</Label>
        <div className="flex gap-4">
          <label
            htmlFor="format-json"
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background cursor-pointer transition-all hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
          >
            <input 
              type="radio" 
              id="format-json" 
              name="output_format" 
              value="json" 
              defaultChecked 
              className="w-4 h-4 text-accent border-border focus:ring-accent"
            />
            <Code className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">JSON</span>
          </label>
          <label
            htmlFor="format-text"
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background cursor-pointer transition-all hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
          >
            <input 
              type="radio" 
              id="format-text" 
              name="output_format" 
              value="text" 
              className="w-4 h-4 text-accent border-border focus:ring-accent"
            />
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Plain Text</span>
          </label>
        </div>
      </div>
      
      {/* JSON Structure */}
      <div id="output-structure-group" className="space-y-2 mb-5">
        <Label htmlFor="output-structure-input" className="text-sm font-medium">
          JSON Structure (Optional)
        </Label>
        <Textarea
          id="output-structure-input"
          placeholder='{"field1": "...", "field2": ["..."]}'
          className="min-h-[80px] bg-background font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Define the expected JSON structure for consistent output formatting
        </p>
      </div>
      
      {/* Meta Intelligence Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <div>
            <Label htmlFor="meta-toggle" className="text-sm font-medium cursor-pointer">
              Meta Intelligence
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable advanced document understanding
            </p>
          </div>
        </div>
        <Switch id="meta-toggle" />
      </div>
      
      {/* Hidden input for constructed prompt */}
      <input type="hidden" id="user-prompt-input" />
    </div>
  );
};

export default PromptBuilder;
