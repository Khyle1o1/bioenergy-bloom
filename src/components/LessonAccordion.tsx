import { useState } from 'react';
import { ChevronDown, CheckCircle, BookOpen } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  completed?: boolean;
}

interface LessonAccordionProps {
  sections: Section[];
}

export function LessonAccordion({ sections }: LessonAccordionProps) {
  const [openSections, setOpenSections] = useState<string[]>([sections[0]?.id]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isOpen = openSections.includes(section.id);
        
        return (
          <div 
            key={section.id} 
            className="lesson-section animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="lesson-header w-full"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  section.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {section.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    section.icon || <BookOpen className="w-4 h-4" />
                  )}
                </div>
                <span className="font-semibold text-left">{section.title}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {isOpen && (
              <div className="lesson-content animate-fade-in">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
