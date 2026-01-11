interface StepBadgeProps {
  step: number;
  label?: string;
}

const StepBadge = ({ step, label }: StepBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step}
      </div>
      {label && <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>}
    </div>
  );
};

export default StepBadge;
