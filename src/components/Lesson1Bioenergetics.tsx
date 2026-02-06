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
              Continue ✓
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
              Bioenergetics is the study of how living organisms obtain, use, and transform energy. All life processes—such as movement, growth, repair, and metabolism—require energy. Without proper energy transformation, cells cannot function and life cannot be sustained.
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
              <h4 className="font-bold text-primary text-sm">✅ Checkpoint</h4>
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
              The <strong>First Law of Thermodynamics</strong> states that energy cannot be created or destroyed—it can only be transformed from one form to another. When organisms convert food into energy, the total amount of energy remains the same, but its form changes.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              The <strong>Second Law of Thermodynamics</strong> explains that during energy transformations, some energy is lost as heat. This loss increases disorder, or entropy, in the system. As energy is released during cellular respiration, part of it is converted into heat and cannot be used by the cell.
            </p>
            <p className="text-muted-foreground text-sm">
              Because of this, cells cannot convert all the energy from glucose into ATP. They are efficient, but not perfectly efficient.
            </p>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4 space-y-2">
              <h4 className="font-bold text-primary text-sm">✅ Checkpoint</h4>
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
              <h4 className="font-bold text-primary text-sm">✅ Checkpoint</h4>
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
              <h4 className="font-bold text-primary text-sm">✅ Checkpoint</h4>
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
            <h4 className="font-bold mb-2">📝 Assessment</h4>
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
              Continue ✓
            </button>
          </div>
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
