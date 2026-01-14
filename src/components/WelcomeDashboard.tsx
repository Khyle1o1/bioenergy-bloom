import { useState } from 'react';
import { Sun, Leaf, BookOpen, Sparkles, HelpCircle, ChevronRight, Zap, Award } from 'lucide-react';
import { EnergyProgressBar } from './EnergyProgressBar';
import { AIGuideModal } from './AIGuideModal';

interface WelcomeDashboardProps {
  studentName: string;
  progress: number;
  onStartPreTest: () => void;
  preTestCompleted: boolean;
  preTestScore: number | null;
}

export function WelcomeDashboard({ 
  studentName, 
  progress, 
  onStartPreTest, 
  preTestCompleted,
  preTestScore 
}: WelcomeDashboardProps) {
  const [showAIGuide, setShowAIGuide] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-nature p-6 sm:p-8 text-primary-foreground mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20">
          <Sun className="w-full h-full glow-sun" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-sunlight" />
            <span className="text-sm font-medium opacity-90">Welcome back!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Hi {studentName}! 🌱
          </h1>
          <p className="text-sm sm:text-base opacity-90 max-w-md">
            Explore the energy in Bukidnon's plants! Discover how sunlight becomes the fuel for life.
          </p>
        </div>
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <EnergyProgressBar progress={progress} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard 
          icon={<BookOpen className="w-5 h-5" />}
          label="Lessons"
          value="3"
          color="primary"
        />
        <StatCard 
          icon={<Zap className="w-5 h-5" />}
          label="Quizzes"
          value="5"
          color="sunlight"
        />
        <StatCard 
          icon={<Leaf className="w-5 h-5" />}
          label="Activities"
          value="8+"
          color="chlorophyll"
        />
        <StatCard 
          icon={<Award className="w-5 h-5" />}
          label="Progress"
          value={`${progress}%`}
          color="atp"
        />
      </div>

      {/* Course Overview */}
      <div className="quiz-card mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          The Energy of Life
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          From Sunlight to Cells — An interactive journey through bioenergetics, photosynthesis, and cellular respiration.
        </p>
        <div className="space-y-2">
          <LessonPreview number={1} title="Bioenergetics" description="Energy flow in living systems" />
          <LessonPreview number={2} title="Photosynthesis" description="How plants capture sunlight" />
          <LessonPreview number={3} title="Cellular Respiration" description="Converting glucose to ATP" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {preTestCompleted ? (
          <div className="quiz-card bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary">Pre-Test Completed! ✨</p>
                <p className="text-sm text-muted-foreground">
                  Score: {preTestScore}/30 ({Math.round((preTestScore || 0) / 30 * 100)}%)
                </p>
              </div>
              <button onClick={onStartPreTest} className="btn-nature text-sm py-2 px-4">
                Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onStartPreTest} className="btn-nature w-full">
            Start Pre-Test <ChevronRight className="w-5 h-5" />
          </button>
        )}
        
        <button 
          onClick={() => setShowAIGuide(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          AI Learning Guide
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>Grade 12 Science • Malaybalay, Bukidnon • January 2026</p>
        <p className="mt-1">Based on "The Energy of Life" by Doreen Khrystel Gonzales</p>
      </footer>

      <AIGuideModal open={showAIGuide} onClose={() => setShowAIGuide(false)} />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: 'text-primary bg-primary/10',
    sunlight: 'text-sunlight bg-sunlight/10',
    chlorophyll: 'text-chlorophyll bg-chlorophyll/10',
    atp: 'text-atp bg-atp/10',
  };

  return (
    <div className="quiz-card text-center p-4">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function LessonPreview({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
