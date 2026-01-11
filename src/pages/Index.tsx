import Header from "@/components/Header";
import FlowIndicator from "@/components/FlowIndicator";
import ApiKeySection from "@/components/ApiKeySection";
import PromptBuilder from "@/components/PromptBuilder";
import FileUpload from "@/components/FileUpload";
import JobQueue from "@/components/JobQueue";
import JobDetails from "@/components/JobDetails";
import { AppProvider } from "@/contexts/AppContext";

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Flow Indicator */}
        <FlowIndicator />
        
        <main className="container mx-auto px-4 lg:px-6 py-4 pb-12">
          {/* Demo Card Container - CloudRail style */}
          <div className="corner-brackets p-4 mb-8">
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Configuration & Upload */}
              <div className="space-y-5">
                <ApiKeySection />
                <PromptBuilder />
                <FileUpload />
              </div>
              
              {/* Right Column - Queue & Results */}
              <div className="space-y-5">
                <JobQueue />
                <JobDetails />
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="glyph-logo-sm text-lg">Glyph</span>
                <span>by CloudRail.ai</span>
              </div>
              <p className="text-xs">OCR & Document Intelligence Platform</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default Index;