import { HelpCircle, Key, Sparkles, Upload, ListTodo, FileText, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const steps = [
  {
    step: 1,
    icon: Key,
    title: "Enter API Key",
    description: "Add your CloudRail API key to authenticate requests.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "Configure Task",
    description: "Choose a template or describe what data to extract from your document.",
  },
  {
    step: 3,
    icon: Upload,
    title: "Upload Document",
    description: "Drop your PDF, image, or scanned document to start processing.",
  },
  {
    step: 4,
    icon: ListTodo,
    title: "Monitor Queue",
    description: "Track your job's progress in real-time as it processes.",
  },
  {
    step: 5,
    icon: FileText,
    title: "View Results",
    description: "Click a completed job to see extracted data in JSON or text format.",
  },
];

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">How to Use</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="glyph-logo-sm">Glyph</span>
            <span className="text-foreground">Quick Start</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <item.icon className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[15px] top-[44px] w-0.5 h-3 bg-border" />
              )}
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-border/50 mt-4">
          <DialogClose asChild>
            <Button className="w-full btn-primary-gradient text-primary-foreground border-0">
              Got it, let's start!
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
