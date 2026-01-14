import { Sun, Leaf, Menu, RotateCcw } from 'lucide-react';
import { EnergyProgressBar } from './EnergyProgressBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  progress: number;
  onReset: () => void;
}

export function Header({ progress, onReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-nature text-primary-foreground shadow-nature">
      <div className="container py-3 px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sun className="w-5 h-5 text-sunlight" />
              <Leaf className="w-4 h-4 text-white -ml-1" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BioEnergy</h1>
              <p className="text-xs opacity-80 hidden sm:block">Explorer</p>
            </div>
          </div>

          <div className="flex-1 max-w-[200px] hidden sm:block">
            <EnergyProgressBar progress={progress} showLabel={false} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onReset} className="text-destructive">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Progress */}
        <div className="mt-2 sm:hidden">
          <EnergyProgressBar progress={progress} showLabel={false} />
        </div>
      </div>
    </header>
  );
}
