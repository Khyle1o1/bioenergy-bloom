import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { WelcomeDashboard } from '@/components/WelcomeDashboard';
import { PreTest } from '@/components/PreTest';
import { Lesson1Bioenergetics } from '@/components/Lesson1Bioenergetics';
import { ComingSoon } from '@/components/ComingSoon';
import { useProgress } from '@/hooks/useProgress';
import { useProgressSync } from '@/hooks/useProgressSync';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Flame, ClipboardCheck, Lightbulb } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { 
    progress, 
    completePreTest, 
    completeLesson, 
    resetProgress, 
    isTabUnlocked,
    updateProgress
  } = useProgress();
  
  // Sync progress with database when logged in
  useProgressSync(progress, updateProgress);
  
  const [activeTab, setActiveTab] = useState('welcome');

  // Update student name when user logs in
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      updateProgress({ studentName: user.user_metadata.full_name });
    }
  }, [user]);

  const handleTabChange = (tabId: string) => {
    if (isTabUnlocked(tabId)) {
      setActiveTab(tabId);
    }
  };

  const handlePreTestComplete = (score: number) => {
    completePreTest(score);
    if (score >= 15) {
      // Auto-navigate to lesson 1 after passing
      setTimeout(() => setActiveTab('lesson1'), 1500);
    }
  };

  const handleLesson1Complete = (score: number) => {
    const percentage = (score / 5) * 100;
    completeLesson('lesson1', percentage);
    if (percentage >= 80) {
      setTimeout(() => setActiveTab('lesson2'), 1500);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'welcome':
        return (
          <WelcomeDashboard
            studentName={progress.studentName}
            progress={progress.totalProgress}
            onStartPreTest={() => setActiveTab('pretest')}
            preTestCompleted={progress.preTestCompleted}
            preTestScore={progress.preTestScore}
          />
        );
      case 'pretest':
        return (
          <PreTest
            onComplete={handlePreTestComplete}
            completed={progress.preTestCompleted}
            score={progress.preTestScore}
          />
        );
      case 'lesson1':
        return (
          <Lesson1Bioenergetics
            onComplete={handleLesson1Complete}
            completed={progress.lessons.lesson1.completed}
          />
        );
      case 'lesson2':
        return (
          <ComingSoon
            title="Lesson 2: Photosynthesis"
            description="Explore how plants convert sunlight into glucose through light-dependent and light-independent reactions."
            icon={<Sun className="w-10 h-10 text-sunlight" />}
          />
        );
      case 'lesson3':
        return (
          <ComingSoon
            title="Lesson 3: Cellular Respiration"
            description="Discover how cells break down glucose to produce ATP through glycolysis, Krebs cycle, and electron transport chain."
            icon={<Flame className="w-10 h-10 text-glucose" />}
          />
        );
      case 'posttest':
        return (
          <ComingSoon
            title="Post-Test"
            description="Complete all lessons to unlock the final assessment and compare your growth!"
            icon={<ClipboardCheck className="w-10 h-10 text-primary" />}
          />
        );
      case 'project':
        return (
          <ComingSoon
            title="Project Studio"
            description="Apply your knowledge to create a bioenergy project relevant to Bukidnon's agriculture!"
            icon={<Lightbulb className="w-10 h-10 text-atp" />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        progress={progress.totalProgress} 
        onReset={resetProgress}
      />
      
      <div className="container py-4 px-4">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unlockedTabs={progress.unlockedTabs}
        />
        
        <main className="mt-6 pb-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
