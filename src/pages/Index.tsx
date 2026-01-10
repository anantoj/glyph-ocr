import { useEffect } from "react";
import Header from "@/components/Header";
import ApiKeySection from "@/components/ApiKeySection";
import PromptBuilder from "@/components/PromptBuilder";
import FileUpload from "@/components/FileUpload";
import JobQueue from "@/components/JobQueue";
import JobDetails from "@/components/JobDetails";

const Index = () => {
  useEffect(() => {
    // Dynamically load the web_app.js script
    const existingScript = document.getElementById('everypage-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'everypage-script';
      script.src = '/web_app.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="step-indicator active">1</div>
            <span className="text-sm font-medium text-foreground hidden sm:inline">API Key</span>
          </div>
          <div className="w-8 h-px bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="step-indicator pending">2</div>
            <span className="text-sm text-muted-foreground hidden sm:inline">Configure</span>
          </div>
          <div className="w-8 h-px bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="step-indicator pending">3</div>
            <span className="text-sm text-muted-foreground hidden sm:inline">Upload</span>
          </div>
          <div className="w-8 h-px bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="step-indicator pending">4</div>
            <span className="text-sm text-muted-foreground hidden sm:inline">Results</span>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Configuration & Upload */}
          <div className="space-y-6">
            <ApiKeySection />
            <PromptBuilder />
            <FileUpload />
          </div>
          
          {/* Right Column - Queue & Results */}
          <div className="space-y-6">
            <JobQueue />
            <JobDetails />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 EveryPage Pure. Licensed software by veso.ai</p>
            <p>Running on ResetData Infrastructure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
