import { useEffect, useState } from 'react';
import { Lightbulb, Target, BookOpen, FlaskConical, Award, Rocket } from 'lucide-react';
import { LessonAccordion } from './LessonAccordion';
import { DragDropMatch } from './DragDropMatch';
import { QuizComponent } from './QuizComponent';
import { PhotosynthesisAnimation } from './PhotosynthesisAnimation';
import { lesson1Questions } from '@/data/quizQuestions';

interface Lesson1Props {
  onComplete: (score: number) => void;
  completed: boolean;
}

const MATCH_ITEMS = [
  { id: 'mito', term: 'Mitochondria', definition: 'Carries out cellular respiration' },
  { id: 'chloro', term: 'Chloroplast', definition: 'Site of photosynthesis' },
  { id: 'atp', term: 'ATP', definition: 'Energy currency of cells' },
  { id: 'glucose', term: 'Glucose', definition: 'Simple sugar for energy storage' },
];

const SECTIONS_DONE_KEY = 'lesson1_sections_done';
const OPEN_SECTIONS_KEY = 'lesson1_open_sections';

export function Lesson1Bioenergetics({ onComplete, completed }: Lesson1Props) {
  const [sectionsDone, setSectionsDone] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_DONE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [openSections, setOpenSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(OPEN_SECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SECTIONS_DONE_KEY, JSON.stringify(sectionsDone));
    } catch {
      // ignore write errors
    }
  }, [sectionsDone]);

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_SECTIONS_KEY, JSON.stringify(openSections));
    } catch {
      // ignore write errors
    }
  }, [openSections]);

  const markDone = (id: string) => {
    if (!sectionsDone.includes(id)) {
      setSectionsDone([...sectionsDone, id]);
    }
  };

  const sections = [
    {
      id: 'objectives',
      title: 'Learning Objectives',
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('objectives'),
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">After this lesson, you will be able to:</p>
          <ul className="space-y-2">
            {[
              'Explain how organisms obtain and use energy',
              'Describe the role of ATP in cellular processes',
              'Compare and contrast photosynthesis and cellular respiration',
              'Identify organelles involved in energy transformation',
            ].map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
          <button onClick={() => markDone('objectives')} className="btn-nature text-sm py-2 mt-2">
            Got it! ✓
          </button>
        </div>
      ),
    },
    {
      id: 'start-thinking',
      title: 'Start Thinking!',
      icon: <Lightbulb className="w-4 h-4" />,
      completed: sectionsDone.includes('start-thinking'),
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-sunlight/10 border border-sunlight/20">
            <p className="font-semibold mb-2">🤔 Think About This:</p>
            <p className="text-sm text-muted-foreground">
              Like the coffee plants in Bukidnon's highlands, all living things need energy. 
              But where does this energy come from? How do plants "eat" sunlight?
            </p>
          </div>
          
          <DragDropMatch 
            title="Match Cell Parts to Functions"
            items={MATCH_ITEMS}
            onComplete={() => markDone('start-thinking')}
          />
        </div>
      ),
    },
    {
      id: 'dive-in',
      title: 'Dive In!',
      icon: <BookOpen className="w-4 h-4" />,
      completed: sectionsDone.includes('dive-in'),
      content: (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h4 className="font-bold text-primary">What is Bioenergetics?</h4>
            <p className="text-muted-foreground">
              Bioenergetics is the study of how energy flows through living systems. 
              All organisms transform energy to carry out life processes.
            </p>
            
            <h4 className="font-bold text-primary mt-4">The Energy Currency: ATP</h4>
            <p className="text-muted-foreground">
              <strong>ATP (Adenosine Triphosphate)</strong> is the "energy currency" of cells. 
              When ATP breaks down to ADP, it releases energy for cellular work like:
            </p>
            <ul className="text-muted-foreground list-disc pl-5">
              <li>Muscle contraction</li>
              <li>Active transport</li>
              <li>Protein synthesis</li>
              <li>Cell division</li>
            </ul>
          </div>
          
          <PhotosynthesisAnimation />
          
          <div className="p-4 rounded-xl bg-muted">
            <h4 className="font-bold mb-2">🌿 Two Key Processes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-chlorophyll/10 border border-chlorophyll/20">
                <p className="font-semibold text-chlorophyll">Photosynthesis</p>
                <p className="text-xs text-muted-foreground">Light energy → Chemical energy (glucose)</p>
                <p className="text-xs">📍 Chloroplast</p>
              </div>
              <div className="p-3 rounded-lg bg-atp/10 border border-atp/20">
                <p className="font-semibold text-atp">Cellular Respiration</p>
                <p className="text-xs text-muted-foreground">Glucose → ATP energy</p>
                <p className="text-xs">📍 Mitochondria</p>
              </div>
            </div>
          </div>
          
          <button onClick={() => markDone('dive-in')} className="btn-nature text-sm py-2">
            I understand! ✓
          </button>
        </div>
      ),
    },
    {
      id: 'assessment',
      title: 'Assessment',
      icon: <FlaskConical className="w-4 h-4" />,
      completed: completed,
      content: (
        <QuizComponent
          title="Lesson 1 Quiz"
          questions={lesson1Questions}
          onComplete={(score) => {
            markDone('assessment');
            onComplete(score);
          }}
          passingScore={80}
        />
      ),
    },
    {
      id: 'dig-deeper',
      title: 'Dig Deeper',
      icon: <Rocket className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Want to explore more? Try these activities:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="p-3 rounded-lg bg-muted">
              🔬 Research: How do extremophiles (organisms in extreme environments) manage energy?
            </li>
            <li className="p-3 rounded-lg bg-muted">
              🌱 Observe: Compare a leaf in sunlight vs. shade. What differences do you notice?
            </li>
            <li className="p-3 rounded-lg bg-muted">
              💡 Think: How might bioenergetics apply to Bukidnon's agricultural practices?
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">🔋</span> Lesson 1: Bioenergetics
        </h1>
        <p className="text-muted-foreground">
          Understanding energy flow in living systems
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {sectionsDone.length}/{sections.length - 1} sections
          </span>
          {completed && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
              <Award className="w-4 h-4" /> Completed
            </span>
          )}
        </div>
      </div>
      
      <LessonAccordion
        sections={sections}
        initialOpenSections={openSections}
        onOpenSectionsChange={setOpenSections}
      />
    </div>
  );
}
