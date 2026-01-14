import { Lock, Home, FileQuestion, Leaf, Sun, Flame, ClipboardCheck, Lightbulb } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'welcome', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'pretest', label: 'Pre-Test', icon: <FileQuestion className="w-4 h-4" /> },
  { id: 'lesson1', label: 'Bioenergetics', icon: <Leaf className="w-4 h-4" /> },
  { id: 'lesson2', label: 'Photosynthesis', icon: <Sun className="w-4 h-4" /> },
  { id: 'lesson3', label: 'Respiration', icon: <Flame className="w-4 h-4" /> },
  { id: 'posttest', label: 'Post-Test', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'project', label: 'Project', icon: <Lightbulb className="w-4 h-4" /> },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  unlockedTabs: string[];
}

export function TabNavigation({ activeTab, onTabChange, unlockedTabs }: TabNavigationProps) {
  return (
    <nav className="tab-nav" role="tablist">
      {TABS.map((tab) => {
        const isLocked = !unlockedTabs.includes(tab.id);
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isLocked}
            onClick={() => !isLocked && onTabChange(tab.id)}
            className={`tab-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
