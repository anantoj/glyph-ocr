import { Key, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ApiKeySection = () => {
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Key className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="section-title">API Key</h2>
          <p className="section-description">Enter your ResetData API key</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input
          id="api-key-input"
          type="password"
          placeholder="Enter your API key..."
          defaultValue="demo-api-key-12345"
          className="flex-1 h-11 bg-background"
        />
        <Button
          id="save-api-key-button"
          className="h-11 px-5 bg-primary hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div 
        id="api-key-status" 
        className="mt-3 text-sm flex items-center gap-2"
      >
        <span id="api-key-hint" className="text-muted-foreground"></span>
      </div>
    </div>
  );
};

export default ApiKeySection;
