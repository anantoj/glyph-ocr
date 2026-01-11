import { useState } from "react";
import { Key, Check, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import StepBadge from "@/components/StepBadge";

const ApiKeySection = () => {
  const { apiKey, setApiKey } = useApp();
  const [inputValue, setInputValue] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setApiKey(inputValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const maskedKey = apiKey && apiKey.length > 4 
    ? `...${apiKey.slice(-4)}` 
    : apiKey || 'None';

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-container-sm">
            <Key className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="section-title">API Key</h2>
            <p className="section-description">Enter your CloudRail API key</p>
          </div>
        </div>
        <StepBadge step={1} />
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="Enter your API key..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-11 bg-background/50 border-border/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button
          onClick={handleSave}
          className="h-11 px-5 btn-primary-gradient text-primary-foreground border-0"
        >
          <Check className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div className="mt-3 text-sm flex items-center gap-2">
        {saved ? (
          <span className="text-success flex items-center gap-1.5">
            <div className="status-dot active" />
            API Key saved for this session
          </span>
        ) : (
          <span className="text-muted-foreground">Using key ending '{maskedKey}'</span>
        )}
      </div>
    </div>
  );
};

export default ApiKeySection;