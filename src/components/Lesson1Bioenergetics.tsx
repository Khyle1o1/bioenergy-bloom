import { useEffect, useState } from 'react';
import { Lightbulb, Target, BookOpen, Award, MessageSquare, ClipboardList, ArrowRightCircle, Zap } from 'lucide-react';
import { DragDropMatch } from './DragDropMatch';
import { LessonSlideLayout, LessonIntro, useLessonNavigation } from './lesson';
import { useProgress } from '@/hooks/useProgress';
import { useProgressSync } from '@/hooks/useProgressSync';

interface Lesson1Props {
  onComplete: (score: number) => void;
  completed: boolean;
  onBackToHome?: () => void;
}

const MATCH_ITEMS = [
  { id: 'mito', term: 'Mitochondria', definition: 'Carries out cellular respiration' },
  { id: 'chloro', term: 'Chloroplast', definition: 'Site of photosynthesis' },
  { id: 'atp', term: 'ATP', definition: 'Energy currency of cells' },
  { id: 'glucose', term: 'Glucose', definition: 'Simple sugar for energy storage' },
];

const SECTIONS_DONE_KEY = 'lesson1_sections_done';
const PAIR_DATA_KEY = 'lesson1_pair_data';
const SHOW_WHAT_KEY = 'lesson1_show_what_data';
const GO_FURTHER_KEY = 'lesson1_go_further_data';

interface GoFurtherData {
  guideQ1: string;
  guideQ2: string;
  guideQ3: string;
  brainstormYourself: string;
  brainstormChatGPT: string;
  teacherIdeas: string;
  otherSources: string;
  projectIdea1: string;
  projectIdea2: string;
  projectIdea3: string;
  reasoning1: string;
  reasoning2: string;
  reasoning3: string;
  settledIdea: string;
  reflectionHelp: string;
  reflectionChallenges: string;
}

const initialGoFurtherData: GoFurtherData = {
  guideQ1: '',
  guideQ2: '',
  guideQ3: '',
  brainstormYourself: '',
  brainstormChatGPT: '',
  teacherIdeas: '',
  otherSources: '',
  projectIdea1: '',
  projectIdea2: '',
  projectIdea3: '',
  reasoning1: '',
  reasoning2: '',
  reasoning3: '',
  settledIdea: '',
  reflectionHelp: '',
  reflectionChallenges: '',
};

interface ShowWhatData {
  definition: string;
  keyConcept1: string;
  keyConcept2: string;
  keyConcept3: string;
  keyConcept4: string;
  keyConcept5: string;
}

const initialShowWhatData: ShowWhatData = {
  definition: '',
  keyConcept1: '',
  keyConcept2: '',
  keyConcept3: '',
  keyConcept4: '',
  keyConcept5: '',
};

type PairStage = 1 | 2 | 3 | 4 | 5 | 6;

interface PairData {
  stage: PairStage;
  followUpQuestion: string;
  initialAnswer: string;
  peerStrength: string;
  peerSuggestion: string;
  aiFeedback: string;
  teacherFeedback: string;
  reflection: string;
  finalAnswer: string;
}

const initialPairData: PairData = {
  stage: 1,
  followUpQuestion: '',
  initialAnswer: '',
  peerStrength: '',
  peerSuggestion: '',
  aiFeedback: '',
  teacherFeedback: '',
  reflection: '',
  finalAnswer: '',
};

const LESSON1_SECTION_IDS = [
  'objectives',
  'start-thinking',
  'dive-in',
  'key-concepts',
  'pair',
  'show-what',
  'go-further',
] as const;

const SECTION_TITLES: Record<string, string> = {
  'objectives': 'Learning Objectives',
  'start-thinking': 'Start Thinking!',
  'dive-in': 'Dive In!',
  'key-concepts': 'Key Concepts in Bioenergetics',
  'pair': 'PAIR: Follow-up Activity',
  'show-what': 'Show What You Know!',
  'go-further': "Let's Go Further!",
};

export function Lesson1Bioenergetics({ onComplete, completed, onBackToHome }: Lesson1Props) {
  // Get progress to resume from last section
  const { progress, updateProgress } = useProgress();
  const { forceSyncNow } = useProgressSync(progress, updateProgress);
  
  // Debug: log progress on mount
  useEffect(() => {
    console.log('[Lesson1] Progress loaded:', {
      currentSection: progress.lessons.lesson1.currentSection,
      sectionsDone: progress.lessons.lesson1.sectionsDone,
      completed: progress.lessons.lesson1.completed
    });
  }, []);
  
  // Initialize from database, not localStorage
  // If sectionsDone is empty but currentSection > 0, reconstruct the completed sections
  const getInitialSectionsDone = () => {
    const savedSections = progress.lessons.lesson1.sectionsDone || [];
    const currentSection = progress.lessons.lesson1.currentSection || 0;
    
    // If we have saved sections, use them
    if (savedSections.length > 0) {
      return savedSections;
    }
    
    // If currentSection > 0 but no saved sections, reconstruct from currentSection
    // This handles the case where user had progress before the sectionsDone feature
    if (currentSection > 0) {
      const reconstructed: string[] = [];
      for (let i = 0; i < currentSection; i++) {
        if (LESSON1_SECTION_IDS[i]) {
          reconstructed.push(LESSON1_SECTION_IDS[i]);
        }
      }
      return reconstructed;
    }
    
    return [];
  };
  
  const [sectionsDone, setSectionsDone] = useState<string[]>(getInitialSectionsDone());

  // NO localStorage - always start fresh
  const [pairData, setPairData] = useState<PairData>(initialPairData);

  // NO localStorage - always start fresh
  const [showWhatData, setShowWhatData] = useState<ShowWhatData>(initialShowWhatData);
  const [showWhatValidationError, setShowWhatValidationError] = useState<string | null>(null);

  // NO localStorage - always start fresh
  const [goFurtherData, setGoFurtherData] = useState<GoFurtherData>(initialGoFurtherData);

  // Callback to save current section when navigating
  const handleSectionChange = (sectionIndex: number) => {
    updateProgress({
      lessons: {
        ...progress.lessons,
        lesson1: {
          ...progress.lessons.lesson1,
          currentSection: sectionIndex
        }
      }
    });
  };

  // Navigation hook
  const {
    isLessonStarted,
    currentSectionIndex,
    currentSectionId,
    completedSectionsCount,
    hasLessonEverStarted,
    isFirstSection,
    isLastSection,
    startLesson,
    exitLesson,
    goToNext,
    goToPrevious,
  } = useLessonNavigation({
    lessonId: 'lesson1',
    totalSections: LESSON1_SECTION_IDS.length,
    sectionsDone,
    sectionIds: LESSON1_SECTION_IDS,
    initialSection: progress.lessons.lesson1.currentSection,
    onSectionChange: handleSectionChange,
    // Pass current section so hasLessonEverStarted can check it too
    savedCurrentSection: progress.lessons.lesson1.currentSection,
  });

  const handleExitToHome = async () => {
    console.log('[Lesson1] Exiting - forcing immediate sync...');
    await forceSyncNow();
    console.log('[Lesson1] Sync complete, exiting lesson');
    exitLesson();
    onBackToHome?.();
  };

  // Save reconstructed sections to database on mount if they were reconstructed
  useEffect(() => {
    const savedSections = progress.lessons.lesson1.sectionsDone || [];
    const currentSection = progress.lessons.lesson1.currentSection || 0;
    
    // If we reconstructed sections (currentSection > 0 but no saved sections)
    if (currentSection > 0 && savedSections.length === 0 && sectionsDone.length > 0) {
      updateProgress({
        lessons: {
          ...progress.lessons,
          lesson1: {
            ...progress.lessons.lesson1,
            sectionsDone: sectionsDone
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to save reconstructed progress

  // Sync sectionsDone from database when progress updates (e.g., after login or admin reset)
  useEffect(() => {
    const dbSections = progress.lessons.lesson1.sectionsDone || [];
    if (dbSections.length > 0) {
      setSectionsDone(dbSections);
    }
  }, [progress.lessons.lesson1.sectionsDone]);

  // REMOVED: No more localStorage saving - database only

  const updateGoFurther = (updates: Partial<GoFurtherData>) => {
    setGoFurtherData((prev) => ({ ...prev, ...updates }));
  };

  const updatePair = (updates: Partial<PairData>) => {
    setPairData((prev) => ({ ...prev, ...updates }));
  };

  const advancePairStage = (next: PairStage) => {
    setPairData((prev) => ({ ...prev, stage: next }));
  };

  const updateShowWhat = (updates: Partial<ShowWhatData>) => {
    setShowWhatData((prev) => ({ ...prev, ...updates }));
    setShowWhatValidationError(null);
  };

  const countFilledKeyConcepts = () => {
    return [showWhatData.keyConcept1, showWhatData.keyConcept2, showWhatData.keyConcept3, showWhatData.keyConcept4, showWhatData.keyConcept5]
      .filter((s) => s.trim().length > 0).length;
  };

  const submitShowWhat = () => {
    const defTrimmed = showWhatData.definition.trim();
    const count = countFilledKeyConcepts();
    if (!defTrimmed) {
      setShowWhatValidationError('Please write a definition of Bioenergetics in your own words.');
      return;
    }
    if (count < 3) {
      setShowWhatValidationError('Please fill in at least three key concepts.');
      return;
    }
    setShowWhatValidationError(null);
    markDone('show-what');
  };

  const markDone = (id: string) => {
    if (!sectionsDone.includes(id)) {
      const newSectionsDone = [...sectionsDone, id];
      setSectionsDone(newSectionsDone);
      
      // Save to database
      updateProgress({
        lessons: {
          ...progress.lessons,
          lesson1: {
            ...progress.lessons.lesson1,
            sectionsDone: newSectionsDone
          }
        }
      });
    }
  };

  // Removed auto-mark on view - sections complete when clicking Next button

  const allSectionsCompleted = LESSON1_SECTION_IDS.every((id) =>
    sectionsDone.includes(id)
  );

  const handleFinishLesson = () => {
    if (allSectionsCompleted && !completed) {
      onComplete(5);
    }
    exitLesson();
  };

  // Show intro screen if lesson not started
  if (!isLessonStarted) {
    return (
      <LessonIntro
        title="Bioenergetics"
        subtitle="Lesson 1"
        description="Understanding how energy flows through living systems — from ATP to photosynthesis and cellular respiration."
        icon={<Zap className="w-10 h-10" />}
        totalSections={LESSON1_SECTION_IDS.length}
        completedSections={completedSectionsCount}
        onStartLesson={startLesson}
        isLessonCompleted={completed}
        hasLessonEverStarted={hasLessonEverStarted}
        onBack={onBackToHome}
      />
    );
  }

  // Render current section content
  const renderSectionContent = () => {
    switch (currentSectionId) {
      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Learning Objectives</h3>
                <p className="text-sm text-muted-foreground">What you'll learn in this lesson</p>
              </div>
            </div>
            
            <p className="text-muted-foreground">After this lesson, you will be able to:</p>
            <ul className="space-y-4">
              {[
                'Explain how organisms obtain and use energy',
                'Describe the role of ATP in cellular processes',
                'Compare and contrast photosynthesis and cellular respiration',
                'Identify organelles involved in energy transformation',
              ].map((obj, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-base pt-1">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'start-thinking':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sunlight/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-sunlight" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Start Thinking!</h3>
                <p className="text-sm text-muted-foreground">Activate your prior knowledge</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-sunlight/10 border border-sunlight/20">
              <p className="font-semibold mb-3 text-lg">Think About This:</p>
              <p className="text-muted-foreground">
                Like the coffee plants in Bukidnon's highlands, all living things need energy. 
                But where does this energy come from? How do plants "eat" sunlight?
              </p>
            </div>
            
            <DragDropMatch 
              title="Match Cell Parts to Functions"
              items={MATCH_ITEMS}
              onComplete={() => markDone('start-thinking')}
              activityName="Lesson 1 - Match Cell Parts to Functions"
              lessonId="lesson1"
            />
          </div>
        );

      case 'dive-in':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Dive In!</h3>
                <p className="text-sm text-muted-foreground">Core concepts explained</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="font-bold text-primary text-lg">What is Bioenergetics?</h4>
              <p className="text-muted-foreground">
                Bioenergetics is the study of how energy flows through living systems. 
                All organisms transform energy to carry out life processes.
              </p>
              
              <h4 className="font-bold text-primary mt-6 text-lg">The Energy Currency: ATP</h4>
              <p className="text-muted-foreground">
                <strong>ATP (Adenosine Triphosphate)</strong> is the "energy currency" of cells. 
                When ATP breaks down to ADP, it releases energy for cellular work like:
              </p>
              <ul className="text-muted-foreground list-disc pl-5 space-y-1">
                <li>Muscle contraction</li>
                <li>Active transport</li>
                <li>Protein synthesis</li>
                <li>Cell division</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-2xl bg-muted">
              <h4 className="font-bold mb-4 text-lg">Two Key Processes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-chlorophyll/10 border border-chlorophyll/20">
                  <p className="font-semibold text-chlorophyll text-lg">Photosynthesis</p>
                  <p className="text-sm text-muted-foreground mt-1">Light energy → Chemical energy (glucose)</p>
                  <p className="text-sm mt-2">📍 Chloroplast</p>
                </div>
                <div className="p-4 rounded-xl bg-atp/10 border border-atp/20">
                  <p className="font-semibold text-atp text-lg">Cellular Respiration</p>
                  <p className="text-sm text-muted-foreground mt-1">Glucose → ATP energy</p>
                  <p className="text-sm mt-2">📍 Mitochondria</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="font-bold text-primary">Checkpoint</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">Q1. In your own words, what does bioenergetics study?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[100px]"
                  placeholder="Write your answer here..."
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Q2. What is ATP, and why is it important?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[100px]"
                  placeholder="Write your answer here..."
                />
              </div>
            </div>

            {/* Section auto-completes when clicking Next */}
          </div>
        );

      case 'key-concepts':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Key Concepts</h3>
                <p className="text-sm text-muted-foreground">Deeper understanding of bioenergetics</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none space-y-4">
              <p className="text-muted-foreground">
                Bioenergetics is the study of how living organisms obtain, use, and transform energy. All life processes—such as movement, growth, repair, and metabolism—require energy.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary">Energy Transformations</h4>
              <ul className="text-muted-foreground text-sm space-y-3">
                <li className="p-4 rounded-xl bg-muted/50 border border-border">
                  <strong className="text-foreground">Potential energy</strong> is stored energy. In living organisms, this energy is stored in the chemical bonds of molecules, such as glucose.
                </li>
                <li className="p-4 rounded-xl bg-muted/50 border border-border">
                  <strong className="text-foreground">Kinetic energy</strong> is the energy of movement. This energy is observed when organisms perform work, such as muscle contraction.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary">Laws of Thermodynamics</h4>
              <div className="grid gap-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="font-semibold text-sm mb-2">First Law</p>
                  <p className="text-sm text-muted-foreground">Energy cannot be created or destroyed—it can only be transformed from one form to another.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="font-semibold text-sm mb-2">Second Law</p>
                  <p className="text-sm text-muted-foreground">During energy transformations, some energy is lost as heat, increasing entropy (disorder) in the system.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="font-bold text-primary">Checkpoint</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">Explain the First Law of Thermodynamics and give an example.</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="Write your answer here..."
                />
              </div>
            </div>

            {/* Section auto-completes when clicking Next */}
          </div>
        );

      case 'pair':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">PAIR Activity</h3>
                <p className="text-sm text-muted-foreground">Produce → Assess → Improve → Reflect</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Use the PAIR approach to deepen your understanding. Work through each stage in order.
            </p>

            <div className="flex gap-2 flex-wrap">
              {([1, 2, 3, 4, 5, 6] as const).map((s) => (
                <span
                  key={s}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    pairData.stage === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s === 1 && 'Produce'}
                  {s === 2 && 'Peer Assess'}
                  {s === 3 && 'Improve'}
                  {s === 4 && 'Teacher'}
                  {s === 5 && 'Reflect'}
                  {s === 6 && 'Final'}
                </span>
              ))}
            </div>

            {pairData.stage === 1 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 1 — Produce</h4>
                <p className="text-sm text-muted-foreground">
                  Submit a follow-up question about Bioenergetics and write your initial answer.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your follow-up question</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                    placeholder="e.g. How does the second law of thermodynamics affect ATP production?"
                    value={pairData.followUpQuestion}
                    onChange={(e) => updatePair({ followUpQuestion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your initial answer</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                    placeholder="Write your answer based on what you know so far..."
                    value={pairData.initialAnswer}
                    onChange={(e) => updatePair({ initialAnswer: e.target.value })}
                  />
                </div>
                <button onClick={() => advancePairStage(2)} className="btn-nature text-sm py-2">
                  Submit initial answer
                </button>
              </div>
            )}

            {pairData.stage === 2 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 2 — Peer Assess</h4>
                <p className="text-sm text-muted-foreground">
                  A peer will review your answer. Provide feedback with at least one strength and one suggestion.
                </p>
                <div className="p-4 rounded-xl bg-background border text-sm space-y-2">
                  <p className="font-medium">Your question:</p>
                  <p className="text-muted-foreground">{pairData.followUpQuestion || '—'}</p>
                  <p className="font-medium mt-3">Your initial answer:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{pairData.initialAnswer || '—'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peer feedback — Strength</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                    placeholder="What did the student do well?"
                    value={pairData.peerStrength}
                    onChange={(e) => updatePair({ peerStrength: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peer feedback — Suggestion</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                    placeholder="What could be improved?"
                    value={pairData.peerSuggestion}
                    onChange={(e) => updatePair({ peerSuggestion: e.target.value })}
                  />
                </div>
                <button onClick={() => advancePairStage(3)} className="btn-nature text-sm py-2">
                  Continue to AI feedback
                </button>
              </div>
            )}

            {pairData.stage === 3 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 3 — Improve (AI Feedback)</h4>
                <p className="text-sm text-muted-foreground">
                  Receive constructive AI feedback with guiding questions.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">AI feedback</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                    placeholder="AI feedback will appear here when provided..."
                    value={pairData.aiFeedback}
                    onChange={(e) => updatePair({ aiFeedback: e.target.value })}
                  />
                </div>
                <button onClick={() => advancePairStage(4)} className="btn-nature text-sm py-2">
                  Continue to teacher review
                </button>
              </div>
            )}

            {pairData.stage === 4 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 4 — Teacher Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  The teacher will provide authoritative feedback and corrections.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teacher feedback</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                    placeholder="Teacher feedback will appear here when provided..."
                    value={pairData.teacherFeedback}
                    onChange={(e) => updatePair({ teacherFeedback: e.target.value })}
                  />
                </div>
                <button onClick={() => advancePairStage(5)} className="btn-nature text-sm py-2">
                  Continue to reflection
                </button>
              </div>
            )}

            {pairData.stage === 5 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 5 — Reflect</h4>
                <p className="text-sm text-muted-foreground">
                  Complete a reflection before writing your final answer.
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>What concept was misunderstood initially?</li>
                  <li>Which feedback was most helpful and why?</li>
                  <li>How has your understanding of bioenergetics changed?</li>
                </ul>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your reflection</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[140px]"
                    placeholder="Write your honest reflection..."
                    value={pairData.reflection}
                    onChange={(e) => updatePair({ reflection: e.target.value })}
                  />
                </div>
                <button onClick={() => advancePairStage(6)} className="btn-nature text-sm py-2">
                  Continue to final answer
                </button>
              </div>
            )}

            {pairData.stage === 6 && (
              <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-primary">Stage 6 — Final Answer</h4>
                <p className="text-sm text-muted-foreground">
                  Write your final answer using insights from all feedback. It must be entirely your own writing.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your final answer</label>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[160px]"
                    placeholder="Write your improved answer..."
                    value={pairData.finalAnswer}
                    onChange={(e) => updatePair({ finalAnswer: e.target.value })}
                  />
                </div>
                {/* PAIR activity auto-completes when clicking Next */}
              </div>
            )}
          </div>
        );

      case 'show-what':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Show What You Know!</h3>
                <p className="text-sm text-muted-foreground">Summarize your learning</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Complete the diagram below, summarizing the important concepts about Bioenergetics. Write in your own words from memory.
            </p>

            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-block px-6 py-3 rounded-xl bg-primary/15 border border-primary/30 font-bold text-primary text-lg">
                  BIOENERGETICS
                </div>
                <p className="text-sm">is defined as:</p>
                <textarea
                  className="w-full max-w-xl mx-auto rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                  placeholder="Your definition in your own words..."
                  value={showWhatData.definition}
                  onChange={(e) => updateShowWhat({ definition: e.target.value })}
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="font-semibold text-sm text-primary">Key Concepts</span>
                </div>
                <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'keyConcept1', value: showWhatData.keyConcept1 },
                    { key: 'keyConcept2', value: showWhatData.keyConcept2 },
                    { key: 'keyConcept3', value: showWhatData.keyConcept3 },
                    { key: 'keyConcept4', value: showWhatData.keyConcept4 },
                    { key: 'keyConcept5', value: showWhatData.keyConcept5 },
                  ].map((item, i) => (
                    <input
                      key={item.key}
                      type="text"
                      className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Key concept ${i + 1}`}
                      value={item.value}
                      onChange={(e) => updateShowWhat({ [item.key]: e.target.value } as Partial<ShowWhatData>)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {showWhatValidationError && (
              <p className="text-sm text-destructive font-medium">{showWhatValidationError}</p>
            )}

            <button onClick={submitShowWhat} className="btn-nature text-sm py-2">
              Submit
            </button>
          </div>
        );

      case 'go-further':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowRightCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Let's Go Further!</h3>
                <p className="text-sm text-muted-foreground">Start your project</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Now that you have discussed the concept of bioenergetics, you can start making your <strong>project</strong>!
            </p>

            <div className="space-y-4">
              <h4 className="font-bold">Guide Questions</h4>
              {[
                { q: '1. What part of the lesson are you most interested about?', key: 'guideQ1' as const },
                { q: '2. What problems in your community relate to this topic?', key: 'guideQ2' as const },
                { q: '3. What skills do you enjoy or want to learn?', key: 'guideQ3' as const },
              ].map((item) => (
                <div key={item.key}>
                  <p className="text-sm font-medium mb-2">{item.q}</p>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                    placeholder="Your answer..."
                    value={goFurtherData[item.key]}
                    onChange={(e) => updateGoFurther({ [item.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-t-xl bg-primary px-4 py-2">
                <span className="font-bold text-primary-foreground uppercase text-sm">Brainstorming</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Yourself', key: 'brainstormYourself' as const },
                  { label: 'ChatGPT', key: 'brainstormChatGPT' as const },
                  { label: 'Teacher', key: 'teacherIdeas' as const },
                  { label: 'Other Sources', key: 'otherSources' as const },
                ].map((item) => (
                  <div key={item.key} className="rounded-xl border border-border p-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{item.label}</span>
                    <textarea
                      className="w-full mt-2 rounded-lg border-0 bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0 min-h-[80px] resize-y"
                      placeholder={`Ideas from ${item.label.toLowerCase()}...`}
                      value={goFurtherData[item.key]}
                      onChange={(e) => updateGoFurther({ [item.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">What is the project idea you have settled on?</p>
              <input
                type="text"
                className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm"
                placeholder="Your chosen project idea..."
                value={goFurtherData.settledIdea}
                onChange={(e) => updateGoFurther({ settledIdea: e.target.value })}
              />
            </div>

            {/* Section auto-completes when clicking Next */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LessonSlideLayout
      currentSection={currentSectionIndex}
      totalSections={LESSON1_SECTION_IDS.length}
      sectionTitle={SECTION_TITLES[currentSectionId] || ''}
      lessonLabel="Lesson 1: Bioenergetics"
      onNext={goToNext}
      onBack={goToPrevious}
      onFinish={handleFinishLesson}
      onExit={handleExitToHome}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      canProceed={true}
      currentSectionId={currentSectionId}
      onMarkSectionComplete={markDone}
    >
      {renderSectionContent()}
    </LessonSlideLayout>
  );
}
