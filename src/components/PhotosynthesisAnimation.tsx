import { useState } from 'react';
import { Sun, Droplets, Wind, Zap, Play, Pause } from 'lucide-react';

export function PhotosynthesisAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 overflow-hidden">
      {/* Sun */}
      <div className={`absolute top-4 right-4 ${isPlaying ? 'glow-sun' : ''}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-energy flex items-center justify-center">
          <Sun className="w-8 h-8 text-amber-800" />
        </div>
      </div>

      {/* Energy Flow Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {isPlaying && (
          <>
            {/* Sunlight to Plant */}
            <path
              d="M350 30 Q300 60 200 100"
              stroke="url(#sunGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="flow-photosynthesis"
              style={{ animationDuration: '2s' }}
            />
            {/* Plant to ATP */}
            <path
              d="M200 100 Q150 130 100 160"
              stroke="url(#atpGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="flow-photosynthesis"
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#4CAF50" />
              </linearGradient>
              <linearGradient id="atpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#9C27B0" />
              </linearGradient>
            </defs>
          </>
        )}
      </svg>

      {/* Plant/Chloroplast */}
      <div className="relative z-10 mt-8">
        <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-nature flex items-center justify-center ${isPlaying ? 'pulse-energy' : ''}`}>
          <span className="text-4xl">🌿</span>
        </div>
        <p className="text-center mt-2 font-semibold text-primary">Chloroplast</p>
      </div>

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto rounded-full bg-water/20 flex items-center justify-center ${isPlaying ? 'float-gentle' : ''}`}>
            <Droplets className="w-6 h-6 text-water" />
          </div>
          <p className="text-xs mt-1 font-medium">H₂O</p>
          <p className="text-xs text-muted-foreground">Water</p>
        </div>
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto rounded-full bg-atp/20 flex items-center justify-center ${isPlaying ? 'pulse-energy' : ''}`}>
            <Zap className="w-6 h-6 text-atp" />
          </div>
          <p className="text-xs mt-1 font-medium">ATP</p>
          <p className="text-xs text-muted-foreground">Energy</p>
        </div>
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center ${isPlaying ? 'float-gentle' : ''}`} style={{ animationDelay: '0.5s' }}>
            <Wind className="w-6 h-6 text-co2" />
          </div>
          <p className="text-xs mt-1 font-medium">CO₂</p>
          <p className="text-xs text-muted-foreground">Carbon</p>
        </div>
      </div>

      {/* Control */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="mt-4 w-full py-2 rounded-lg bg-white/80 dark:bg-black/20 font-medium text-sm flex items-center justify-center gap-2"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlaying ? 'Pause Animation' : 'Play Animation'}
      </button>

      {/* Equation */}
      <div className="mt-4 p-3 rounded-lg bg-white/80 dark:bg-black/20 text-center">
        <p className="text-sm font-mono">
          <span className="text-water">6H₂O</span> + <span className="text-co2">6CO₂</span> 
          <span className="mx-2">→</span>
          <span className="text-glucose">C₆H₁₂O₆</span> + <span className="text-primary">6O₂</span>
        </p>
      </div>
    </div>
  );
}
