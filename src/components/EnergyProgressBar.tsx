import { Zap } from 'lucide-react';

interface EnergyProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export function EnergyProgressBar({ progress, showLabel = true }: EnergyProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
            <Zap className="w-4 h-4 text-sunlight" />
            Energy Level
          </span>
          <span className="text-sm font-bold text-primary">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="energy-bar">
        <div 
          className="energy-bar-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
