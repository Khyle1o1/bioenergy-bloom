import { useEffect, useState } from 'react';
import { Target, MessageSquare, X, Sun, Leaf, FlaskConical, ClipboardCheck, Lightbulb, FileText } from 'lucide-react';
import { LessonSlideLayout, LessonIntro, useLessonNavigation } from './lesson';

interface Lesson2Props {
  onComplete: (score: number) => void;
  completed: boolean;
}

const CHLOROPLAST_VIDEO_SRC = '/Chloroplast_GIF_Animation_Request.mp4';

const SECTIONS_DONE_KEY = 'lesson2_sections_done';

const LESSON2_SECTION_IDS = [
  'start-thinking',
  'dive-in',
  'activity-2-1',
  'activity-2-2',
  'assessment',
  'lets-go-further',
  'feedback-reflection',
] as const;

const SECTION_TITLES: Record<string, string> = {
  'start-thinking': 'Objectives & Start Thinking',
  'dive-in': 'Dive In! Structures & Process',
  'activity-2-1': "Activity 2.1: Let's Dig Deeper",
  'activity-2-2': 'Activity 2.2: CO₂ Investigation',
  'assessment': 'Show What You Know!',
  'lets-go-further': 'Project Planning',
  'feedback-reflection': 'Feedback & Reflection',
};

export function Lesson2Photosynthesis({ onComplete, completed }: Lesson2Props) {
  const [sectionsDone, setSectionsDone] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_DONE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const {
    isLessonStarted,
    currentSectionIndex,
    currentSectionId,
    completedSectionsCount,
    isFirstSection,
    isLastSection,
    startLesson,
    exitLesson,
    goToNext,
    goToPrevious,
  } = useLessonNavigation({
    lessonId: 'lesson2',
    totalSections: LESSON2_SECTION_IDS.length,
    sectionsDone,
    sectionIds: LESSON2_SECTION_IDS,
  });

  useEffect(() => {
    try {
      localStorage.setItem(SECTIONS_DONE_KEY, JSON.stringify(sectionsDone));
    } catch {
      // ignore
    }
  }, [sectionsDone]);

  const markDone = (id: string) => {
    if (!sectionsDone.includes(id)) {
      setSectionsDone([...sectionsDone, id]);
    }
  };

  const allSectionsCompleted = LESSON2_SECTION_IDS.every((id) =>
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
        title="Photosynthesis"
        subtitle="Lesson 2"
        description="Explore how plants convert sunlight into chemical energy through the remarkable process of photosynthesis."
        icon={<Sun className="w-10 h-10" />}
        totalSections={LESSON2_SECTION_IDS.length}
        completedSections={completedSectionsCount}
        onStartLesson={startLesson}
      />
    );
  }

  const renderSectionContent = () => {
    switch (currentSectionId) {
      case 'start-thinking':
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

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold mb-3">At the end of this lesson, you will be able to:</p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Describe the main structures involved in photosynthesis.</li>
                <li>Investigate carbon fixation of plants through an experiment.</li>
                <li>Explain the significance of photosynthesis to other living organisms.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sunlight/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-sunlight" />
                </div>
                <h4 className="font-semibold text-lg">Start Thinking!</h4>
              </div>
              <p className="text-muted-foreground">
                Let's explore what you already know about photosynthesis. Compare your knowledge with ChatGPT to identify misconceptions and build a strong foundation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm font-semibold">YOURSELF: What do you know about photosynthesis?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                  placeholder="In your own words, describe everything you already know..."
                />
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm font-semibold">ChatGPT: Ask ChatGPT and summarize here.</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                  placeholder="Summarize ChatGPT's explanation..."
                />
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <p className="text-sm font-semibold">Reflection:</p>
              <p className="text-sm text-muted-foreground">
                How would you compare your answers to ChatGPT's? Which is more understandable?
              </p>
              <textarea
                className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                placeholder="Reflect on the similarities and differences..."
              />
            </div>

            <button onClick={() => markDone('start-thinking')} className="btn-nature text-sm py-2">
              Save and continue
            </button>
          </div>
        );

      case 'dive-in':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-chlorophyll/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-chlorophyll" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Dive In!</h3>
                <p className="text-sm text-muted-foreground">Structures and process of photosynthesis</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none space-y-4">
              <p className="text-muted-foreground">
                Plants, algae, and <strong>cyanobacteria</strong> are the only organisms that can carry out photosynthesis. They are called <strong>photoautotrophs</strong>—literally "self-feeders using light."
              </p>
              <p className="text-muted-foreground">
                Animals, including humans, are <strong>heterotrophs</strong> because we must eat plants or other animals to meet our energy needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-lg overflow-hidden"
                  onClick={() => setLightboxImage({ src: '/green_algae.png', alt: 'Green algae cells' })}
                >
                  <img src="/green_algae.png" alt="Green algae" className="w-full h-32 object-cover" />
                </button>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Algae (Photoautotrophs)</p>
                <p className="text-xs text-muted-foreground">Use sunlight, water, and CO₂ to make food.</p>
              </div>

              <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-lg overflow-hidden"
                  onClick={() => setLightboxImage({ src: '/bear.jpg', alt: 'Bear eating salmon' })}
                >
                  <img src="/bear.jpg" alt="Bear eating salmon" className="w-full h-32 object-cover" />
                </button>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Bear (Heterotroph)</p>
                <p className="text-xs text-muted-foreground">Must eat other organisms for energy.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary">The Main Structures</h4>
              <div className="grid gap-3">
                {[
                  { name: 'Chloroplasts', desc: 'Tiny green organelles where photosynthesis occurs.' },
                  { name: 'Thylakoids', desc: 'Flat sacs stacked into grana, containing chlorophyll.' },
                  { name: 'Stroma', desc: 'Fluid-filled space where the Calvin cycle takes place.' },
                  { name: 'Stomata', desc: 'Tiny pores that let CO₂ in and release O₂.' },
                ].map((item) => (
                  <div key={item.name} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Thylakoid Membrane</p>
              <button
                type="button"
                className="w-full"
                onClick={() => setLightboxImage({ src: '/thylakoid membrane.svg', alt: 'Thylakoid membrane diagram' })}
              >
                <img className="w-full h-auto rounded-md" src="/thylakoid membrane.svg" alt="Thylakoid membrane" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="font-bold text-primary">Checkpoint</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">Q1. What is the primary function of the chloroplast?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                  placeholder="Write your answer here..."
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Q2. What are the main structures within a chloroplast?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                  placeholder="Write your answer here..."
                />
              </div>
            </div>

            <button onClick={() => markDone('dive-in')} className="btn-nature text-sm py-2">
              I've completed this section
            </button>
          </div>
        );

      case 'activity-2-1':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Activity 2.1: Let's Dig Deeper!</h3>
                <p className="text-sm text-muted-foreground">Use ChatGPT to explore and verify</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Ask ChatGPT questions about photosynthesis, then verify the answers with reliable scientific sources.
            </p>

            <div className="overflow-x-auto rounded-xl border border-muted-foreground/30 bg-muted/10">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="border-b border-muted-foreground/30 px-4 py-3 text-left font-semibold">Question to ChatGPT</th>
                    <th className="border-b border-muted-foreground/30 px-4 py-3 text-left font-semibold">ChatGPT's Answer</th>
                    <th className="border-b border-muted-foreground/30 px-4 py-3 text-left font-semibold">Verified Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2].map((row) => (
                    <tr key={row}>
                      <td className="border-t border-muted-foreground/20 px-4 py-3">
                        <textarea
                          className="w-full rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                          placeholder="Your question..."
                        />
                      </td>
                      <td className="border-t border-muted-foreground/20 px-4 py-3">
                        <textarea
                          className="w-full rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                          placeholder="ChatGPT's response..."
                        />
                      </td>
                      <td className="border-t border-muted-foreground/20 px-4 py-3">
                        <textarea
                          className="w-full rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                          placeholder="Your verified answer with sources..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => markDone('activity-2-1')} className="btn-nature text-sm py-2">
              Complete Activity
            </button>
          </div>
        );

      case 'activity-2-2':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Activity 2.2: CO₂ Investigation</h3>
                <p className="text-sm text-muted-foreground">Do plants consume carbon dioxide?</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none space-y-3">
              <p className="text-muted-foreground">
                In this investigation, you'll observe a plant fixing carbon using <strong>phenol red</strong> indicator. Phenol red is red when neutral and yellow when acidic.
              </p>
              <p className="text-muted-foreground">
                When you blow CO₂ into the solution, it becomes acidic (yellow). If a plant removes CO₂ during photosynthesis, the solution returns to red.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-primary">Materials</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Phenol red solution (0.02%)</li>
                <li>Elodea or kale leaves</li>
                <li>3 test tubes with caps</li>
                <li>200 mL Erlenmeyer flask</li>
              </ul>
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4">
              <img src="/lab_setup.png" alt="Lab setup" className="w-full h-auto rounded-md" />
              <p className="text-xs text-muted-foreground mt-2">Three test tubes with phenol red solution.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-primary">Data Table</h4>
              <div className="overflow-x-auto rounded-xl border border-muted-foreground/30 bg-muted/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="border-b border-muted-foreground/30 px-4 py-2 text-left font-semibold">Tube #</th>
                      <th className="border-b border-muted-foreground/30 px-4 py-2 text-left font-semibold">Contents</th>
                      <th className="border-b border-muted-foreground/30 px-4 py-2 text-left font-semibold">Initial Color</th>
                      <th className="border-b border-muted-foreground/30 px-4 py-2 text-left font-semibold">Final Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((tube) => (
                      <tr key={tube}>
                        <td className="border-t border-muted-foreground/20 px-4 py-2">{tube}</td>
                        <td className="border-t border-muted-foreground/20 px-4 py-2">
                          <input className="w-full rounded border border-muted-foreground/30 bg-background px-2 py-1 text-sm" placeholder="Fill in..." />
                        </td>
                        <td className="border-t border-muted-foreground/20 px-4 py-2">
                          <input className="w-full rounded border border-muted-foreground/30 bg-background px-2 py-1 text-sm" placeholder="Fill in..." />
                        </td>
                        <td className="border-t border-muted-foreground/20 px-4 py-2">
                          <input className="w-full rounded border border-muted-foreground/30 bg-background px-2 py-1 text-sm" placeholder="Fill in..." />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="font-bold text-primary">Analysis Questions</h4>
              {[
                'Why does phenol red change color when we blow bubbles into it?',
                'Why did we place test tubes under light if carbon fixation happens in the light-independent stage?',
                'What happened to the tube with no plant? Why?',
              ].map((q) => (
                <div key={q} className="space-y-2">
                  <p className="text-sm font-medium">{q}</p>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[80px]"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>

            <button onClick={() => markDone('activity-2-2')} className="btn-nature text-sm py-2">
              Complete Investigation
            </button>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Show What You Know!</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Read the questions carefully and provide the correct answers.
            </p>

            <div className="space-y-4">
              {[
                '1. What organelle in a plant cell performs photosynthesis?',
                '2. What pigment makes plants green?',
                '3. What part inside the chloroplast makes sugar?',
                '4. What process converts light energy into chemical energy?',
                '5. What molecule stores the chemical energy from photosynthesis?',
                '6. What are the reactants of photosynthesis?',
                '7. What are the products of photosynthesis?',
              ].map((question) => (
                <div key={question} className="space-y-2">
                  <p className="text-sm font-medium">{question}</p>
                  <textarea
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4">
              <p className="text-sm font-medium mb-3">8. Complete the cycle diagram:</p>
              <img src="/cycle.png" alt="Cycle diagram" className="w-full max-w-lg mx-auto h-auto rounded-md" />
            </div>

            <button onClick={() => markDone('assessment')} className="btn-nature text-sm py-2">
              Save Assessment
            </button>
          </div>
        );

      case 'lets-go-further':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Project Planning</h3>
                <p className="text-sm text-muted-foreground">Structure your project</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Now that you've completed the conceptualization, design the structure of your project by planning procedures and identifying materials.
            </p>

            <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Project Name:</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your project name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Project Goals:</label>
                {[1, 2, 3].map((i) => (
                  <textarea
                    key={i}
                    className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[60px]"
                    placeholder={`Goal ${i}...`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Short Description:</label>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="Describe your project..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <h5 className="font-semibold text-sm">Procedures</h5>
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-start gap-2">
                    <span className="text-sm font-medium mt-1">{step}.</span>
                    <textarea
                      className="flex-1 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[50px]"
                      placeholder="Describe this step..."
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <h5 className="font-semibold text-sm">Materials</h5>
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-sm font-medium mt-1">•</span>
                    <input
                      className="flex-1 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="List a material..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => markDone('lets-go-further')} className="btn-nature text-sm py-2">
              Save and continue
            </button>
          </div>
        );

      case 'feedback-reflection':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Feedback & Reflection</h3>
                <p className="text-sm text-muted-foreground">Refine your project with feedback</p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Ask your teacher and ChatGPT for comments and feedback to refine your work.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h5 className="font-semibold text-sm text-center">ChatGPT Feedback</h5>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[150px]"
                  placeholder="Record ChatGPT's feedback..."
                />
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h5 className="font-semibold text-sm text-center">Teacher Feedback</h5>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[150px]"
                  placeholder="Record your teacher's feedback..."
                />
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-center text-muted-foreground">
                From the given feedback, improve your project procedures and materials below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h5 className="font-semibold text-sm text-center">Improved Procedures</h5>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[150px]"
                  placeholder="Your improved procedures..."
                />
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h5 className="font-semibold text-sm text-center">Improved Materials</h5>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[150px]"
                  placeholder="Your improved materials list..."
                />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-6">
              <h4 className="font-semibold">Reflection</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">How did ChatGPT help you with your project?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="Your reflection..."
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">What challenges did you encounter?</p>
                <textarea
                  className="w-full rounded-lg border border-muted-foreground/30 bg-background px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[100px]"
                  placeholder="Your reflection..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => markDone('feedback-reflection')} className="btn-nature text-sm py-2">
                Complete Section
              </button>
              {allSectionsCompleted && !completed && (
                <button onClick={() => onComplete(5)} className="btn-nature text-sm py-2">
                  Mark Lesson 2 as Complete
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Lightbox for images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-muted-foreground transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.src} alt={lightboxImage.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      <LessonSlideLayout
        currentSection={currentSectionIndex}
        totalSections={LESSON2_SECTION_IDS.length}
        sectionTitle={SECTION_TITLES[currentSectionId] || ''}
        onNext={goToNext}
        onBack={goToPrevious}
        onFinish={handleFinishLesson}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        canProceed={true}
      >
        {renderSectionContent()}
      </LessonSlideLayout>
    </>
  );
}
