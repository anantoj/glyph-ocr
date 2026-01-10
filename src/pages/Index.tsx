import Header from "@/components/Header";
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
        
        <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
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
    </AppProvider>
  );
};

export default Index;
