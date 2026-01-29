import { Progress } from '@/components/ui/progress';

export function GCPStatusWidget() {
  const readiness = 68;

  return (
    <div className="data-card space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">GCP Status</h2>
        <span className="text-xs text-muted-foreground">India Green Credit</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{readiness}%</span>
          <span className="text-xs text-muted-foreground">Readiness</span>
        </div>
        <Progress value={readiness} className="h-2" />
      </div>

      <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Registered Projects</span>
          <span className="text-foreground font-medium">4/6</span>
        </div>
        <div className="flex justify-between">
          <span>Credits Issued</span>
          <span className="text-foreground font-medium">55,500</span>
        </div>
      </div>
    </div>
  );
}