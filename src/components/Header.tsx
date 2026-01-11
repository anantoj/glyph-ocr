import { FileText, Zap } from "lucide-react";
import HelpDialog from "@/components/HelpDialog";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="icon-container">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="glyph-logo-sm">Glyph</span>
              <sup className="text-[10px] text-primary font-semibold">™</sup>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-3">
            <HelpDialog />
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <div className="status-dot active" />
              <span className="text-xs text-muted-foreground">#1 OCR Engine</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Zap className="w-3 h-3" />
              <span>CloudRail.ai</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;