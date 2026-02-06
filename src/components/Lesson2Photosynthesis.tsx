import { useEffect, useState } from 'react';
import { Target, MessageSquare, X } from 'lucide-react';
import { LessonAccordion } from './LessonAccordion';

interface Lesson2Props {
  onComplete: (score: number) => void;
  completed: boolean;
}

const SECTIONS_DONE_KEY = 'lesson2_sections_done';
const OPEN_SECTIONS_KEY = 'lesson2_open_sections';

const LESSON2_SECTION_IDS = [
  'start-thinking',
  'dive-in',
] as const;

export function Lesson2Photosynthesis({ onComplete, completed }: Lesson2Props) {
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

  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SECTIONS_DONE_KEY, JSON.stringify(sectionsDone));
    } catch {
      // ignore
    }
  }, [sectionsDone]);

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_SECTIONS_KEY, JSON.stringify(openSections));
    } catch {
      // ignore
    }
  }, [openSections]);

  const markDone = (id: string) => {
    if (!sectionsDone.includes(id)) {
      setSectionsDone([...sectionsDone, id]);
    }
  };

  const allSectionsCompleted = LESSON2_SECTION_IDS.every((id) =>
    sectionsDone.includes(id)
  );

  const sections = [
    {
      id: 'start-thinking',
      title: 'A Synthesis on Photosynthesis – Objectives & Start Thinking',
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('start-thinking'),
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Lesson 2: A Synthesis on Photosynthesis</h2>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold mb-2">
                Objectives: At the end of this lesson, learners will be able to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Describe the main structures involved in photosynthesis.</li>
                <li>Investigate carbon fixation of plants through an experiment.</li>
                <li>Explain the significance of photosynthesis to other living organisms.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sunlight" />
              Start Thinking!
            </h3>
            <p className="text-sm text-muted-foreground">
              Let us explore what we know about photosynthesis. This activity aims to surface your existing
              knowledge about photosynthesis and compare it with information provided by ChatGPT. This will
              help us identify what you already know, uncover any misconceptions, and build a strong
              foundation for learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <p className="text-sm font-semibold">YOURSELF: Write here everything you know about photosynthesis:</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[140px]"
                placeholder="In your own words, describe everything you already know about photosynthesis..."
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <p className="text-sm font-semibold">
                ChatGPT: Ask ChatGPT about photosynthesis and write a short summary here.
              </p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[140px]"
                placeholder="After chatting with ChatGPT, summarize its explanation of photosynthesis here..."
              />
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-sm font-semibold">
              Question:
            </p>
            <p className="text-sm text-muted-foreground">
              1. How would you compare your answers to ChatGPT&apos;s? Which is more complex or more
              understandable? Which do you prefer?
            </p>
            <textarea
              className="mt-2 w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[100px]"
              placeholder="Reflect on the similarities and differences between your answer and ChatGPT's..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => markDone('start-thinking')}
              className="btn-nature text-sm py-2"
            >
              Save and continue
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'dive-in',
      title: 'Dive In! Structures and Process of Photosynthesis',
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('dive-in'),
      content: (
        <div className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <h3 className="font-bold text-primary">Dive In!</h3>
            <p className="text-muted-foreground">
              Plants, algae, and a special group of bacteria called <strong>cyanobacteria</strong> are the only
              organisms that can carry out photosynthesis. Even so, the process of photosynthesis supplies
              energy for almost all life on Earth. By capturing light energy and turning it into chemical
              energy, these organisms power food chains and support ecosystems worldwide.
            </p>
            <p className="text-muted-foreground">
              At first glance, photosynthesis sounds simple: it is the capture of light energy by living
              organisms. In reality, studying it brings together ideas from <strong>chemistry</strong> (molecules
              and reactions), <strong>physics</strong> (light and energy), and <strong>biology</strong> (cells,
              organelles, and ecosystems).
            </p>
            <p className="text-muted-foreground">
              Organisms that use light to build their own food are called
              <strong> photoautotrophs</strong>—literally “self-feeders using light.” Animals, including humans,
              are <strong>heterotrophs</strong> or “other feeders” because we must eat plants or other animals to
              meet our energy needs. A third group, the <strong>chemoautotrophs</strong>, includes certain
              bacteria that cannot use sunlight at all. Instead, they tap into energy from inorganic chemicals
              deep underground or in extreme environments.
            </p>
          </div>

          {/* Visual placeholders for key examples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-2 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: '/green_algae.png',
                    alt: 'Close-up image of green algae cells showing chloroplasts',
                  })
                }
              >
                <img
                  src="/green_algae.png"
                  alt="Close-up image of green algae cells showing chloroplasts"
                  className="w-full h-auto max-h-40 object-contain"
                />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Algae (Photoautotrophs)</p>
                <p className="text-xs text-muted-foreground">
                  These organisms are <strong>autotrophs</strong> because they can perform photosynthesis. They use
                  sunlight, water, and carbon dioxide to make their own food and release oxygen.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-2 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: '/bear.jpg',
                    alt: 'A bear catching and eating a salmon in a river.',
                  })
                }
              >
                <img
                  src="/bear.jpg"
                  alt="A bear catching and eating a salmon in a river."
                  className="w-full h-auto max-h-40 object-contain"
                />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Bear eating Salmon (Heterotroph)</p>
                <p className="text-xs text-muted-foreground">
                  Bears are <strong>heterotrophs</strong>. They cannot make their own food, so they obtain energy by
                  eating other organisms, such as salmon that ultimately depend on plants and algae.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-2 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: '/nitrosomonas.jpg',
                    alt: 'Microscopic image of rod-shaped Nitrosomonas bacteria.',
                  })
                }
              >
                <img
                  src="/nitrosomonas.jpg"
                  alt="Microscopic image of rod-shaped Nitrosomonas bacteria."
                  className="w-full h-auto max-h-40 object-contain"
                />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Nitrosomonas (Chemoautotroph)</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Nitrosomonas</strong> bacteria are <strong>chemoautotrophs</strong>. They use energy from
                  toxic chemicals like ammonia and convert them into materials that support life in soil and water.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-2 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: '/Methanogen.jpg',
                    alt: 'Microscopic cluster of round Methanogen cells in an oxygen-free environment.',
                  })
                }
              >
                <img
                  src="/Methanogen.jpg"
                  alt="Microscopic cluster of round Methanogen cells in an oxygen-free environment."
                  className="w-full h-auto max-h-40 object-contain"
                />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Methanogens (e.g., Methanosarcina barkeri)</p>
                <p className="text-xs text-muted-foreground">
                  These microorganisms live in <strong>anoxic</strong> (oxygen-free) environments and produce
                  <strong> methane gas</strong> as a metabolic byproduct, playing a role in global carbon and energy
                  cycles.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-primary">The Main Structure and Process of Photosynthesis</h4>
            <p className="text-sm text-muted-foreground">
              In plants, photosynthesis primarily involves three main structures:
              <strong> chloroplasts</strong>, <strong>mesophyll</strong>, and <strong>stomata</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Chloroplasts</strong> are specialized organelles where photosynthesis takes place. They
                contain stacks of thylakoids and the surrounding fluid called stroma.
              </li>
              <li>
                The <strong>mesophyll</strong> is the inner tissue of the leaf. Palisade mesophyll is packed with
                chloroplasts for maximum light absorption, while spongy mesophyll leaves space for gas exchange.
              </li>
              <li>
                <strong>Stomata</strong> are small openings on the leaf surface that allow carbon dioxide to enter
                and oxygen to exit.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Photosynthesis occurs in two major stages: the <strong>light-dependent reactions</strong> and the
              <strong> light-independent reactions</strong> (Calvin cycle).
            </p>
          </div>

          {/* Checkpoint 1–2 */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <h4 className="font-bold text-primary text-sm">Checkpoint</h4>
            <div className="space-y-2">
              <p className="text-sm font-medium">Q1. What is the primary function of the chloroplast?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[70px]"
                placeholder="Write your answer here..."
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Q2. What are the main structures within a chloroplast, and what are their roles in photosynthesis?
              </p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[70px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-primary">Steps for the Light-Dependent Reactions</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Photon absorption</strong>: Chlorophyll and other pigments in the thylakoid membranes absorb
                light energy and excite electrons.
              </li>
              <li>
                <strong>Water splitting (photolysis)</strong>: Water molecules are split into oxygen, protons, and
                electrons. Oxygen is released as a by-product.
              </li>
              <li>
                <strong>Electron transport chain (ETC)</strong>: Excited electrons move through carrier proteins,
                creating a proton gradient across the thylakoid membrane.
              </li>
              <li>
                <strong>ATP and NADPH formation</strong>: The proton gradient powers ATP synthase to produce ATP,
                while electrons reduce NADP⁺ to NADPH.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              The main products of the light-dependent reactions are ATP, NADPH, and oxygen.
            </p>
          </div>

          {/* Checkpoint 3–5 */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <h4 className="font-bold text-primary text-sm">Checkpoint</h4>
            <div className="space-y-2">
              <p className="text-sm font-medium">Q3. Where do the light-dependent reactions take place?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                placeholder="Write your answer here..."
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Q4. What is the role of chlorophyll in the light-dependent reactions?</p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                placeholder="Write your answer here..."
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Q5. What are the products of the light-dependent reactions, and what are their roles in the next stage
                of photosynthesis?
              </p>
              <textarea
                className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                placeholder="Write your answer here..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-primary">Steps for the Light-Independent Reactions (Calvin Cycle)</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Carbon fixation</strong>: CO₂ enters the leaf through stomata and binds to RuBP, producing
                3‑PGA molecules.
              </li>
              <li>
                <strong>Reduction phase</strong>: ATP and NADPH from the light-dependent reactions convert 3‑PGA into
                G3P, a three‑carbon sugar.
              </li>
              <li>
                <strong>Regeneration of RuBP</strong>: Some G3P leaves to form glucose and other organic molecules,
                while the rest is used to regenerate RuBP so the cycle can continue.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              The Calvin cycle&apos;s main products include glucose (for energy and storage) and other organic
              compounds needed for plant growth.
            </p>
          </div>

          {/* Checkpoint 6–12 */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <h4 className="font-bold text-primary text-sm">Checkpoint</h4>
            {[
              'Q6. Where does the Calvin cycle take place?',
              'Q7. What is the main purpose of the Calvin cycle?',
              'Q8. Why is it called a "cycle"?',
              'Q9. What enzyme catalyzes the carbon fixation step?',
              'Q10. How are ATP and NADPH used in the reduction phase?',
              'Q11. What molecule is regenerated in the Calvin cycle?',
              'Q12. What happens to the G3P molecules that exit the cycle?',
            ].map((question) => (
              <div key={question} className="space-y-2">
                <p className="text-sm font-medium">{question}</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[50px]"
                  placeholder="Write your answer here..."
                />
              </div>
            ))}
          </div>

          {/* Assessment */}
          <div className="p-4 rounded-xl bg-muted border border-border space-y-3">
            <h4 className="font-bold">Assessment</h4>
            {[
              '1. What "things" are needed in order for photosynthesis to occur?',
              '2. What are the products of photosynthesis?',
              '3. Where in the plant does photosynthesis occur?',
              '4. Why do plants need water in order to survive?',
            ].map((question) => (
              <div key={question} className="space-y-1">
                <p className="text-sm font-medium">{question}</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                  placeholder="Write your answer here..."
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => markDone('dive-in')}
              className="btn-nature text-sm py-2"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },
  ];

  const completedSectionsCount = sectionsDone.filter((id) =>
    sections.some((section) => section.id === id)
  ).length;

  return (
    <div className="animate-fade-in relative">
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image view"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-muted-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Lesson 2: Photosynthesis
        </h1>
        <p className="text-muted-foreground">
          Exploring how plants convert sunlight into chemical energy
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {completedSectionsCount}/{sections.length} sections
          </span>
          {completed && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Completed
            </span>
          )}
        </div>
      </div>

      <LessonAccordion
        sections={sections}
        initialOpenSections={openSections}
        onOpenSectionsChange={setOpenSections}
      />

      {/* Placeholder for future assessment and completion logic */}
      {allSectionsCompleted && !completed && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onComplete(5)}
            className="btn-nature text-sm py-2"
          >
            Mark Lesson 2 as complete
          </button>
        </div>
      )}
    </div>
  );
}

