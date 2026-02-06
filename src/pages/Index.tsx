import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { WelcomeDashboard } from '@/components/WelcomeDashboard';
import { PreTest } from '@/components/PreTest';
import { Lesson1Bioenergetics } from '@/components/Lesson1Bioenergetics';
import { Lesson2Photosynthesis } from '@/components/Lesson2Photosynthesis';
import { ComingSoon } from '@/components/ComingSoon';
import { AuthModal } from '@/components/AuthModal';
import { useProgress } from '@/hooks/useProgress';
import { useProgressSync } from '@/hooks/useProgressSync';
import { useAuth } from '@/contexts/useAuth';
import { Sun, Flame, ClipboardCheck, Lightbulb } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ACTIVE_TAB_STORAGE_KEY = 'bioenergy_active_tab';

const Index = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
  
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || 'welcome';
    } catch {
      return 'welcome';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
    } catch {
      // ignore write errors
    }
  }, [activeTab]);

  // Open auth modal automatically when redirected here by a guard
  useEffect(() => {
    const state = location.state as { openAuth?: boolean; message?: string; fromAdmin?: boolean } | null;
    if (!user && state?.openAuth) {
      setAuthModalOpen(true);
    }
  }, [location.state, user]);

  // Auto-redirect admins straight to the admin dashboard after auth resolves,
  // unless they explicitly navigated here from the admin dashboard.
  useEffect(() => {
    const state = location.state as { openAuth?: boolean; message?: string; fromAdmin?: boolean } | null;
    if (!authLoading && user && isAdmin && !state?.fromAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate, location.state]);

  // Update student name when user logs in or out
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      updateProgress({ studentName: user.user_metadata.full_name });
    } else {
      // Reset to 'user' when logged out
      updateProgress({ studentName: 'user' });
    }
  }, [user, updateProgress]);

  useEffect(() => {
    if (!isTabUnlocked(activeTab)) {
      setActiveTab('welcome');
    }
  }, [activeTab, isTabUnlocked]);

  const handleTabChange = (tabId: string) => {
    if (isTabUnlocked(tabId)) {
      setActiveTab(tabId);
    }
  };

  const handlePreTestComplete = (score: number) => {
    completePreTest(score);
    // After completing the diagnostic pre-test once, move the learner
    // forward to Lesson 1 regardless of score.
    setTimeout(() => setActiveTab('lesson1'), 1500);
  };

  const handleLesson1Complete = (score: number) => {
    const percentage = (score / 5) * 100;
    completeLesson('lesson1', percentage);
    if (percentage >= 80) {
      setTimeout(() => setActiveTab('lesson2'), 1500);
    }
  };

  const handleLesson2Complete = (score: number) => {
    const percentage = (score / 5) * 100;
    completeLesson('lesson2', percentage);
    if (percentage >= 80) {
      setTimeout(() => setActiveTab('lesson3'), 1500);
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
          <Lesson2Photosynthesis
            onComplete={handleLesson2Complete}
            completed={progress.lessons.lesson2.completed}
          />
        );
      case 'lesson3':
        return (
          <ComingSoon
            title="Lesson 3: Cellular Respiration"
            description="Discover how cells break down glucose to produce ATP through glycolysis, Krebs cycle, and electron transport chain."
            icon={<Flame className="w-10 h-10 text-glucose" />}
            locked={!isTabUnlocked('lesson3')}
          />
        );
      case 'posttest':
        return (
          <ComingSoon
            title="Post-Test"
            description="Complete all lessons to unlock the final assessment and compare your growth!"
            icon={<ClipboardCheck className="w-10 h-10 text-primary" />}
            locked={!isTabUnlocked('posttest')}
          />
        );
      case 'project':
        return (
          <ComingSoon
            title="Project Studio"
            description="Apply your knowledge to create a bioenergy project relevant to Bukidnon's agriculture!"
            icon={<Lightbulb className="w-10 h-10 text-atp" />}
            locked={!isTabUnlocked('project')}
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
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Login gate overlay: invisible click-catcher until user logs in */}
      {!user && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setAuthModalOpen(true)}
          role="button"
          aria-label="Open login"
        />
      )}
      
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

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
