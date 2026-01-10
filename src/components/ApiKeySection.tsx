import { useState } from "react";
import { Key, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const ApiKeySection = () => {
  const { apiKey, setApiKey } = useApp();
  const [inputValue, setInputValue] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const maskedKey = apiKey && apiKey.length > 4 
    ? `...${apiKey.slice(-4)}` 
    : apiKey || 'None';

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
          type="password"
          placeholder="Enter your API key..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 h-11 bg-background"
        />
        <Button
          onClick={handleSave}
          className="h-11 px-5 bg-primary hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div className="mt-3 text-sm flex items-center gap-2">
        {saved ? (
          <span className="text-success">API Key saved for this session</span>
        ) : (
          <span className="text-muted-foreground">Using key ending '{maskedKey}'</span>
        )}
      </div>
    </div>
  );
};

export default ApiKeySection;
