import { Sparkles, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp, promptTemplates } from "@/contexts/AppContext";
import StepBadge from "@/components/StepBadge";

const PromptBuilder = () => {
  const { 
    taskDescription, 
    setTaskDescription, 
    outputFormat,
    setOutputFormat,
    outputStructure, 
    setOutputStructure,
    useMetaIntelligence,
    setUseMetaIntelligence,
    selectedTemplate,
    loadTemplate
  } = useApp();

  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-container-sm">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="section-title">Task Configuration</h2>
            <p className="section-description">Define what to extract from your document</p>
          </div>
        </div>
        <StepBadge step={2} />
      </div>
      
      {/* Template Selection */}
      <div className="space-y-2 mb-5">
        <Label htmlFor="prompt-template" className="text-sm font-medium text-foreground/80">
          Quick Templates
        </Label>
        <Select value={selectedTemplate || undefined} onValueChange={loadTemplate}>
          <SelectTrigger id="prompt-template" className="bg-background/50 border-border/50">
            <SelectValue placeholder="-- Select a template --" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="transcribe">Transcribe Text</SelectItem>
            <SelectItem value="summarize">Summarize Content</SelectItem>
            <SelectItem value="translate_es">Translate to Spanish</SelectItem>
            <SelectItem value="translate_zh">Translate to Chinese</SelectItem>
            <SelectItem value="qa">Question & Answer</SelectItem>
            <SelectItem value="extract_entities">Extract Entities</SelectItem>
            <SelectItem value="custom">Custom (Edit Below)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Task Description */}
      <div className="space-y-2 mb-5">
        <Label htmlFor="task-input" className="text-sm font-medium text-foreground/80">
          Task Description
        </Label>
        <Textarea
          id="task-input"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe what you want to extract or analyze from each page..."
          className="min-h-[100px] bg-background/50 border-border/50 resize-none"
        />
      </div>
      
      {/* Output Format */}
      <div className="space-y-3 mb-5">
        <Label className="text-sm font-medium text-foreground/80">Output Format</Label>
        <RadioGroup 
          value={outputFormat} 
          onValueChange={(value) => setOutputFormat(value as 'json' | 'text')}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="format-json" className="border-border text-primary" />
            <Label htmlFor="format-json" className="font-normal cursor-pointer text-foreground/80">JSON</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="format-text" className="border-border text-primary" />
            <Label htmlFor="format-text" className="font-normal cursor-pointer text-foreground/80">Plain Text</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* JSON Structure (only shown when JSON format is selected) */}
      {outputFormat === 'json' && (
        <div className="space-y-2 mb-5">
          <Label htmlFor="output-structure-input" className="text-sm font-medium text-foreground/80">
            JSON Structure (Optional)
          </Label>
          <Textarea
            id="output-structure-input"
            value={outputStructure}
            onChange={(e) => setOutputStructure(e.target.value)}
            placeholder='{"field1": "/* description */", "field2": ["..."]}'
            className="min-h-[100px] bg-background/50 border-border/50 font-mono text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Define the expected JSON structure. Use /* comments */ for semantic guidance.
          </p>
        </div>
      )}
      
      {/* Meta Intelligence Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Meta Intelligence</p>
            <p className="text-xs text-muted-foreground">Enhanced AI processing for complex documents</p>
          </div>
        </div>
        <Switch
          id="meta-toggle"
          checked={useMetaIntelligence}
          onCheckedChange={setUseMetaIntelligence}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
};

export default PromptBuilder;