import { useEffect, useState } from 'react';
import { Lightbulb, Target, BookOpen, Award, MessageSquare, ClipboardList, ArrowRightCircle } from 'lucide-react';
import { LessonAccordion } from './LessonAccordion';
import { DragDropMatch } from './DragDropMatch';

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

  const [pairData, setPairData] = useState<PairData>(() => {
    try {
      const saved = localStorage.getItem(PAIR_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PairData;
        return { ...initialPairData, ...parsed, stage: Math.min(parsed.stage ?? 1, 6) as PairStage };
      }
      return initialPairData;
    } catch {
      return initialPairData;
    }
  });

  const [showWhatData, setShowWhatData] = useState<ShowWhatData>(() => {
    try {
      const saved = localStorage.getItem(SHOW_WHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ShowWhatData;
        return { ...initialShowWhatData, ...parsed };
      }
      return initialShowWhatData;
    } catch {
      return initialShowWhatData;
    }
  });
  const [showWhatValidationError, setShowWhatValidationError] = useState<string | null>(null);

  const [goFurtherData, setGoFurtherData] = useState<GoFurtherData>(() => {
    try {
      const saved = localStorage.getItem(GO_FURTHER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GoFurtherData;
        return { ...initialGoFurtherData, ...parsed };
      }
      return initialGoFurtherData;
    } catch {
      return initialGoFurtherData;
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

  useEffect(() => {
    try {
      localStorage.setItem(PAIR_DATA_KEY, JSON.stringify(pairData));
    } catch {
      // ignore
    }
  }, [pairData]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOW_WHAT_KEY, JSON.stringify(showWhatData));
    } catch {
      // ignore
    }
  }, [showWhatData]);

  useEffect(() => {
    try {
      localStorage.setItem(GO_FURTHER_KEY, JSON.stringify(goFurtherData));
    } catch {
      // ignore
    }
  }, [goFurtherData]);

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
      setSectionsDone([...sectionsDone, id]);
    }
  };

  const allSectionsCompleted = LESSON1_SECTION_IDS.every((id) =>
    sectionsDone.includes(id)
  );

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
            Got it!
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
            <p className="font-semibold mb-2">Think About This:</p>
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
          
      
          
          <div className="p-4 rounded-xl bg-muted">
            <h4 className="font-bold mb-2">Two Key Processes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-chlorophyll/10 border border-chlorophyll/20">
                <p className="font-semibold text-chlorophyll">Photosynthesis</p>
                <p className="text-xs text-muted-foreground">Light energy → Chemical energy (glucose)</p>
                <p className="text-xs">Chloroplast</p>
              </div>
              <div className="p-3 rounded-lg bg-atp/10 border border-atp/20">
                <p className="font-semibold text-atp">Cellular Respiration</p>
                <p className="text-xs text-muted-foreground">Glucose → ATP energy</p>
                <p className="text-xs">Mitochondria</p>
              </div>
            </div>
          </div>

          {/* Checkpoint questions */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
            <h4 className="font-bold text-primary">Checkpoint</h4>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Q1. In your own words, what does bioenergetics study?
              </p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Q2. What is ATP, and why is it important?
              </p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => markDone('dive-in')} className="btn-nature text-sm py-2">
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'key-concepts',
      title: 'Key Concepts in Bioenergetics',
      icon: <BookOpen className="w-4 h-4" />,
      completed: sectionsDone.includes('key-concepts'),
      content: (
        <div className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Bioenergetics is the study of how living organisms obtain, use, and transform energy. All life processes�such as movement, growth, repair, and metabolism�require energy. Without proper energy transformation, cells cannot function and life cannot be sustained.
            </p>
            <p className="text-muted-foreground">
              One important role of bioenergetics is helping us understand how energy supports cellular activities and how these energy changes follow scientific laws.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Energy Transformations in Living Organisms</h4>
            <p className="text-muted-foreground text-sm mb-3">
              Energy in biological systems exists in different forms. Two important types of energy are <strong>potential energy</strong> and <strong>kinetic energy</strong>.
            </p>
            <ul className="text-muted-foreground text-sm space-y-2 list-disc pl-5">
              <li><strong>Potential energy</strong> is stored energy. In living organisms, this energy is stored in the chemical bonds of molecules, such as glucose.</li>
              <li><strong>Kinetic energy</strong> is the energy of movement. This energy is observed when organisms perform work, such as muscle contraction or the movement of substances inside cells.</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-3">
              Cells continuously transform stored energy into usable energy so that biological processes can occur.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Energy Release During Cellular Respiration</h4>
            <p className="text-muted-foreground text-sm mb-2">
              During cellular respiration, cells break down glucose. The potential energy stored in glucose is released and converted into kinetic energy through chemical reactions.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              This released energy is used to produce <strong>ATP (adenosine triphosphate)</strong>. ATP is the main energy molecule used by cells. It powers cellular activities such as:
            </p>
            <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1">
              <li>Muscle movement</li>
              <li>Synthesis of new molecules</li>
              <li>Transport of substances across cell membranes</li>
            </ul>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4 space-y-2">
              <h4 className="font-bold text-primary text-sm">? Checkpoint</h4>
              <p className="text-sm font-medium">Q3. What type of energy is stored in the chemical bonds of glucose?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Bioenergetics and the Laws of Thermodynamics</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Bioenergetics follows the laws of thermodynamics.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              The <strong>First Law of Thermodynamics</strong> states that energy cannot be created or destroyed�it can only be transformed from one form to another. When organisms convert food into energy, the total amount of energy remains the same, but its form changes.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              The <strong>Second Law of Thermodynamics</strong> explains that during energy transformations, some energy is lost as heat. This loss increases disorder, or entropy, in the system. As energy is released during cellular respiration, part of it is converted into heat and cannot be used by the cell.
            </p>
            <p className="text-muted-foreground text-sm">
              Because of this, cells cannot convert all the energy from glucose into ATP. They are efficient, but not perfectly efficient.
            </p>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4 space-y-2">
              <h4 className="font-bold text-primary text-sm">? Checkpoint</h4>
              <p className="text-sm font-medium">Q4. Explain the First Law of Thermodynamics in your own words. Give an example of energy transformation.</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Why Energy Conversion Is Not 100% Efficient</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Not all the potential energy stored in glucose becomes usable ATP. During chemical reactions, some energy is released as heat instead of being captured in ATP molecules.
            </p>
            <p className="text-muted-foreground text-sm">
              This heat loss is a natural result of energy transformation and explains why organisms must constantly obtain energy from food to maintain their functions.
            </p>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4 space-y-2">
              <h4 className="font-bold text-primary text-sm">? Checkpoint</h4>
              <p className="text-sm font-medium">Q5. Why isn&apos;t all the potential energy in glucose converted into usable ATP?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Photosynthesis and Cellular Respiration</h4>
            <p className="text-muted-foreground text-sm mb-2">
              The metabolic pathways of photosynthesis and cellular respiration clearly demonstrate bioenergetic principles.
            </p>
            <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1 mb-2">
              <li>During <strong>photosynthesis</strong>, plants capture energy from sunlight and store it as chemical energy in glucose.</li>
              <li>During <strong>cellular respiration</strong>, organisms break down glucose to release the stored energy for cellular use.</li>
            </ul>
            <p className="text-muted-foreground text-sm mb-2">
              These two processes are closely connected. Cellular respiration can be considered the reverse of photosynthesis. Together, they show how energy flows through living systems.
            </p>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4 space-y-2">
              <h4 className="font-bold text-primary text-sm">? Checkpoint</h4>
              <p className="text-sm font-medium">Q6. What are the key differences between photosynthesis and cellular respiration?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">Energy Flow in Ecosystems</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Energy flows through ecosystems in a one-way direction. <strong>Autotrophs</strong>, such as plants, capture energy from sunlight. <strong>Heterotrophs</strong>, such as animals, obtain energy by consuming plants or other organisms.
            </p>
            <p className="text-muted-foreground text-sm">
              This continuous flow of energy supports all life on Earth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted border border-border space-y-4">
            <h4 className="font-bold mb-2">Assessment</h4>
            <p className="text-sm text-muted-foreground">Write your answers below.</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">What are the key concepts related to bioenergetics?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">How is energy transformation observed in bioenergetics?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[80px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => markDone('key-concepts')} className="btn-nature text-sm py-2">
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'pair',
      title: 'PAIR: Follow-up on Bioenergetics',
      icon: <MessageSquare className="w-4 h-4" />,
      completed: sectionsDone.includes('pair'),
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Use the PAIR approach (Produce ? Assess ? Improve ? Reflect) to deepen your understanding. Work through each stage in order.
          </p>
          <div className="flex gap-2 flex-wrap">
            {([1, 2, 3, 4, 5, 6] as const).map((s) => (
              <span
                key={s}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  pairData.stage === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {s === 1 && 'Produce'}
                {s === 2 && 'Peer Assess'}
                {s === 3 && 'Improve'}
                {s === 4 && 'Teacher'}
                {s === 5 && 'Reflect'}
                {s === 6 && 'Produce again'}
              </span>
            ))}
          </div>

          {/* Stage 1 � PRODUCE */}
          {pairData.stage === 1 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 1 � Produce (Your initial answer)</h4>
              <p className="text-sm text-muted-foreground">
                Submit a follow-up question about Bioenergetics and write your initial answer using only your current understanding. You will not receive corrections or answers at this stage.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your follow-up question</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                  placeholder="e.g. How does the second law of thermodynamics affect ATP production?"
                  value={pairData.followUpQuestion}
                  onChange={(e) => updatePair({ followUpQuestion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your initial answer</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                  placeholder="Write your answer based on what you know so far..."
                  value={pairData.initialAnswer}
                  onChange={(e) => updatePair({ initialAnswer: e.target.value })}
                />
              </div>
              <button
                onClick={() => advancePairStage(2)}
                className="btn-nature text-sm py-2"
              >
                Submit initial answer
              </button>
            </div>
          )}

          {/* Stage 2 � ASSESS (Peer feedback) */}
          {pairData.stage === 2 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 2 � Assess (Peer feedback)</h4>
              <p className="text-sm text-muted-foreground">
                A peer will review your answer. Feedback must include at least one strength and one suggestion for improvement.
              </p>
              <div className="p-3 rounded-lg bg-background border text-sm space-y-2">
                <p className="font-medium">Question:</p>
                <p className="text-muted-foreground">{pairData.followUpQuestion || '�'}</p>
                <p className="font-medium mt-2">Your initial answer:</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{pairData.initialAnswer || '�'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Peer feedback � Strength</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                  placeholder="What did the student do well?"
                  value={pairData.peerStrength}
                  onChange={(e) => updatePair({ peerStrength: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Peer feedback � Suggestion for improvement</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                  placeholder="What could be clarified or improved?"
                  value={pairData.peerSuggestion}
                  onChange={(e) => updatePair({ peerSuggestion: e.target.value })}
                />
              </div>
              <button
                onClick={() => advancePairStage(3)}
                className="btn-nature text-sm py-2"
              >
                Continue to AI feedback
              </button>
            </div>
          )}

          {/* Stage 3 � IMPROVE (AI feedback) */}
          {pairData.stage === 3 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 3 � Improve (AI feedback)</h4>
              <p className="text-sm text-muted-foreground">
                After peer feedback, you may receive constructive AI feedback. It will suggest what to improve and may ask guiding questions�it will not give a corrected answer or full explanation.
              </p>
              <div className="p-3 rounded-lg bg-background border text-sm space-y-2">
                <p className="font-medium">Peer strength:</p>
                <p className="text-muted-foreground">{pairData.peerStrength || '�'}</p>
                <p className="font-medium">Peer suggestion:</p>
                <p className="text-muted-foreground">{pairData.peerSuggestion || '�'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">AI feedback (coach-style)</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="AI feedback will appear here when provided. It identifies misconceptions, suggests what to improve, and may ask guiding questions�not a model answer."
                  value={pairData.aiFeedback}
                  onChange={(e) => updatePair({ aiFeedback: e.target.value })}
                />
              </div>
              <button
                onClick={() => advancePairStage(4)}
                className="btn-nature text-sm py-2"
              >
                Continue to teacher review
              </button>
            </div>
          )}

          {/* Stage 4 � ASSESS (Teacher feedback) */}
          {pairData.stage === 4 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 4 � Assess (Teacher feedback)</h4>
              <p className="text-sm text-muted-foreground">
                The teacher will review your initial answer, peer feedback, and AI feedback. Their feedback is authoritative and may include corrections or rubric-based evaluation.
              </p>
              <div className="p-3 rounded-lg bg-background border text-sm space-y-2">
                <p className="font-medium">AI feedback:</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{pairData.aiFeedback || '�'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teacher feedback</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="Teacher feedback will appear here when provided."
                  value={pairData.teacherFeedback}
                  onChange={(e) => updatePair({ teacherFeedback: e.target.value })}
                />
              </div>
              <button
                onClick={() => advancePairStage(5)}
                className="btn-nature text-sm py-2"
              >
                Continue to reflection
              </button>
            </div>
          )}

          {/* Stage 5 � REFLECT */}
          {pairData.stage === 5 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 5 � Reflect</h4>
              <p className="text-sm text-muted-foreground">
                Complete a reflection before writing your final answer. Consider:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>What concept was misunderstood initially?</li>
                <li>Which feedback was most helpful and why?</li>
                <li>How has your understanding of bioenergetics changed?</li>
              </ul>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your reflection</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                  placeholder="Write your honest reflection..."
                  value={pairData.reflection}
                  onChange={(e) => updatePair({ reflection: e.target.value })}
                />
              </div>
              <button
                onClick={() => advancePairStage(6)}
                className="btn-nature text-sm py-2"
              >
                Continue to final answer
              </button>
            </div>
          )}

          {/* Stage 6 � PRODUCE AGAIN */}
          {pairData.stage === 6 && (
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
              <h4 className="font-bold text-primary">Stage 6 � Produce again (Final answer)</h4>
              <p className="text-sm text-muted-foreground">
                Write your final answer using insights from peer feedback, AI feedback, teacher feedback, and your reflection. Integrate the feedback and explain concepts clearly. Your final answer must be entirely your own writing.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your final answer</label>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[140px]"
                  placeholder="Write your improved answer..."
                  value={pairData.finalAnswer}
                  onChange={(e) => updatePair({ finalAnswer: e.target.value })}
                />
              </div>
              <button
                onClick={() => {
                  markDone('pair');
                }}
                className="btn-nature text-sm py-2"
              >
                Complete PAIR
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'show-what',
      title: 'Show What You Know!',
      icon: <ClipboardList className="w-4 h-4" />,
      completed: sectionsDone.includes('show-what'),
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Show What You Know!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Now that you discussed Bioenergetics, complete the diagram below, summarizing the important concepts, terms or ideas about what you have learned. Write in your own words from memory.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Need a nudge? Try recalling:</p>
            <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
              <li>What did you learn about how cells obtain and use energy?</li>
              <li>Which processes were emphasized in the lesson?</li>
              <li>What terms appeared repeatedly in the discussion of bioenergetics?</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 font-bold text-primary">
                BIOENERGETICS
              </div>
              <p className="text-sm">
                is defined as{' '}
                <input
                  type="text"
                  className="inline-block w-full max-w-xl mx-auto rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="your definition in your own words..."
                  value={showWhatData.definition}
                  onChange={(e) => updateShowWhat({ definition: e.target.value })}
                />
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-48 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-semibold text-sm text-primary">Key concepts</span>
              </div>
              <div className="w-full max-w-2xl grid grid-cols-[1fr_1fr_1fr] gap-3 items-start justify-items-center">
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Key concept (short phrase)"
                    value={showWhatData.keyConcept1}
                    onChange={(e) => updateShowWhat({ keyConcept1: e.target.value })}
                  />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <input
                    type="text"
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Key concept"
                    value={showWhatData.keyConcept2}
                    onChange={(e) => updateShowWhat({ keyConcept2: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Key concept"
                    value={showWhatData.keyConcept3}
                    onChange={(e) => updateShowWhat({ keyConcept3: e.target.value })}
                  />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <input
                    type="text"
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Key concept"
                    value={showWhatData.keyConcept4}
                    onChange={(e) => updateShowWhat({ keyConcept4: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Key concept"
                    value={showWhatData.keyConcept5}
                    onChange={(e) => updateShowWhat({ keyConcept5: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {showWhatValidationError && (
            <p className="text-sm text-destructive font-medium">{showWhatValidationError}</p>
          )}

          <div className="flex justify-end">
            <button onClick={submitShowWhat} className="btn-nature text-sm py-2">
              Submit
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'go-further',
      title: "Let's Go Further!",
      icon: <ArrowRightCircle className="w-4 h-4" />,
      completed: sectionsDone.includes('go-further'),
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <ArrowRightCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Let&apos;s Go Further!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Now that you have discussed the concept of bioenergetics, you can now start making your <strong>project</strong>!
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Guide questions</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">1. What part/topic of the lesson are you most interested about?</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                  placeholder="Your answer..."
                  value={goFurtherData.guideQ1}
                  onChange={(e) => updateGoFurther({ guideQ1: e.target.value })}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">2. What problems in your body, community or the world is related to the topic you identified above?</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                  placeholder="Your answer..."
                  value={goFurtherData.guideQ2}
                  onChange={(e) => updateGoFurther({ guideQ2: e.target.value })}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">3. What skills do you enjoy using or would like to learn more about?</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                  placeholder="Your answer..."
                  value={goFurtherData.guideQ3}
                  onChange={(e) => updateGoFurther({ guideQ3: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-t-lg bg-primary px-4 py-2">
              <span className="font-bold text-primary-foreground uppercase text-sm">Brainstorming</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 mb-3">
              Considering your answers above, think about different project ideas. Take suggestions from your group, the teacher, ChatGPT, and from your own research.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-border p-3 relative min-h-[100px]">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Yourself</span>
                <textarea
                  className="w-full mt-2 rounded-md border-0 bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0 min-h-[80px] resize-y"
                  placeholder="Your own project ideas..."
                  value={goFurtherData.brainstormYourself}
                  onChange={(e) => updateGoFurther({ brainstormYourself: e.target.value })}
                />
              </div>
              <div className="rounded-lg border border-border p-3 relative min-h-[100px]">
                <span className="text-xs font-semibold text-muted-foreground uppercase">ChatGPT</span>
                <textarea
                  className="w-full mt-2 rounded-md border-0 bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0 min-h-[80px] resize-y"
                  placeholder="Ideas from ChatGPT..."
                  value={goFurtherData.brainstormChatGPT}
                  onChange={(e) => updateGoFurther({ brainstormChatGPT: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3 relative min-h-[100px]">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Teacher</span>
                <textarea
                  className="w-full mt-2 rounded-md border-0 bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0 min-h-[80px] resize-y"
                  placeholder="Ideas from your teacher..."
                  value={goFurtherData.teacherIdeas}
                  onChange={(e) => updateGoFurther({ teacherIdeas: e.target.value })}
                />
              </div>
              <div className="rounded-lg border border-border p-3 relative min-h-[100px]">
                <span className="text-xs font-semibold text-muted-foreground uppercase">From other sources</span>
                <textarea
                  className="w-full mt-2 rounded-md border-0 bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0 min-h-[80px] resize-y"
                  placeholder="Ideas from other sources..."
                  value={goFurtherData.otherSources}
                  onChange={(e) => updateGoFurther({ otherSources: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-1">Narrowing</h4>
            <p className="text-sm text-muted-foreground mb-3">
              From the suggestions gathered, choose the best 3 that fit your <strong>interest</strong> and resources available.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">Project ideas</p>
                <input
                  type="text"
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm"
                  placeholder="1."
                  value={goFurtherData.projectIdea1}
                  onChange={(e) => updateGoFurther({ projectIdea1: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm"
                  placeholder="2."
                  value={goFurtherData.projectIdea2}
                  onChange={(e) => updateGoFurther({ projectIdea2: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm"
                  placeholder="3."
                  value={goFurtherData.projectIdea3}
                  onChange={(e) => updateGoFurther({ projectIdea3: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Reasoning</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm resize-y min-h-[60px]"
                  placeholder="Reasoning for idea 1..."
                  value={goFurtherData.reasoning1}
                  onChange={(e) => updateGoFurther({ reasoning1: e.target.value })}
                />
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm resize-y min-h-[60px]"
                  placeholder="Reasoning for idea 2..."
                  value={goFurtherData.reasoning2}
                  onChange={(e) => updateGoFurther({ reasoning2: e.target.value })}
                />
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm resize-y min-h-[60px]"
                  placeholder="Reasoning for idea 3..."
                  value={goFurtherData.reasoning3}
                  onChange={(e) => updateGoFurther({ reasoning3: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">What is the project idea you have settled on?</p>
            <input
              type="text"
              className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm"
              placeholder="Your chosen project idea..."
              value={goFurtherData.settledIdea}
              onChange={(e) => updateGoFurther({ settledIdea: e.target.value })}
            />
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <h4 className="font-bold mb-3">Reflection</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">1. How did the use of ChatGPT help you in this part of making your project?</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm resize-y min-h-[80px]"
                  placeholder="Your reflection..."
                  value={goFurtherData.reflectionHelp}
                  onChange={(e) => updateGoFurther({ reflectionHelp: e.target.value })}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">2. What challenges did you encounter in using ChatGPT?</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm resize-y min-h-[80px]"
                  placeholder="Your reflection..."
                  value={goFurtherData.reflectionChallenges}
                  onChange={(e) => updateGoFurther({ reflectionChallenges: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => markDone('go-further')} className="btn-nature text-sm py-2">
              Done
            </button>
            {allSectionsCompleted && !completed && (
              <button
                onClick={() => onComplete(5)}
                className="btn-nature text-sm py-2"
              >
                Proceed to next lesson
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  const completedSectionsCount = sectionsDone.filter((id) =>
    sections.some((section) => section.id === id)
  ).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Lesson 1: Bioenergetics
        </h1>
        <p className="text-muted-foreground">
          Understanding energy flow in living systems
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {completedSectionsCount}/{sections.length} sections
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
