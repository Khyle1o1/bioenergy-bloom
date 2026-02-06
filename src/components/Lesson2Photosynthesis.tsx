import { useEffect, useState } from 'react';
import { Target, MessageSquare, X } from 'lucide-react';
import { LessonAccordion } from './LessonAccordion';

interface Lesson2Props {
  onComplete: (score: number) => void;
  completed: boolean;
}

// Editable path for the chloroplast animation video.
// Update this string if you replace the file or move it.
const CHLOROPLAST_VIDEO_SRC = '/Chloroplast_GIF_Animation_Request.mp4';

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
            <h4 className="font-bold text-primary">The Main Structures in Photosynthesis</h4>
            <p className="text-sm text-muted-foreground">
              In plants, photosynthesis depends on three key structures in the leaf:
              <strong> chloroplasts</strong>, <strong>mesophyll</strong>, and <strong>stomata</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Chloroplasts</strong> are tiny green organelles inside plant cells where most of
                photosynthesis happens. Each chloroplast is surrounded by a double membrane and filled with a
                fluid called <strong>stroma</strong>, where the Calvin cycle takes place.
              </li>
              <li>
                Inside the chloroplast, flat sacs called <strong>thylakoids</strong> are stacked into columns
                known as <strong>grana</strong>. The thylakoid membranes hold <strong>chlorophyll</strong>, the
                pigment that captures light energy.
              </li>
              <li>
                The <strong>mesophyll</strong> is the inner tissue of the leaf. Palisade mesophyll is packed with
                chloroplasts for maximum light absorption, while spongy mesophyll leaves air spaces for gas
                exchange.
              </li>
              <li>
                <strong>Stomata</strong> are tiny pores on the leaf surface that open and close to let carbon
                dioxide in and release oxygen and water vapor.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Together, these structures allow the plant to capture light, take in carbon dioxide and water, and
              turn them into glucose and oxygen through the <strong>light-dependent reactions</strong> and the
              <strong> light-independent reactions</strong> (Calvin cycle).
            </p>

            <div className="mt-4 space-y-3">
              <h4 className="font-bold text-primary">The Main Structure of Photosynthesis: The Chloroplast</h4>
              <p className="text-sm text-muted-foreground">
                In plants, photosynthesis relies on three closely connected structures: the <strong>chloroplasts</strong>,
                the <strong>mesophyll</strong>, and the <strong>stomata</strong>. Chloroplasts are specialized organelles
                inside mesophyll cells where almost all photosynthesis takes place. Each chloroplast is oval or
                biconvex in shape, typically about 4–6&nbsp;µm in diameter and 1–3&nbsp;µm thick, and is enclosed by a
                double membrane made of an outer membrane, an inner membrane, and a thin intermembrane space.
              </p>
              <p className="text-sm text-muted-foreground">
                Inside the inner membrane is a fluid-filled region called the <strong>stroma</strong>, which is the site
                of the Calvin cycle (light‑independent reactions). Suspended in the stroma are stacks of flattened,
                disc-like sacs called <strong>thylakoids</strong>; a single disc is a thylakoid, while a stack is called
                a <strong>granum</strong>. The thylakoid membranes contain <strong>chlorophyll</strong> and other
                pigments that capture light energy, while the space inside each disc, the <strong>thylakoid lumen</strong>,
                is where important steps of the light‑dependent reactions occur.
              </p>

              {/* Diagram of a chloroplast */}
              <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2 max-w-3xl mx-auto">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Diagram of a Chloroplast</p>
                <button
                  type="button"
                  className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-6 cursor-pointer"
                >
                  Insert detailed chloroplast cross-section diagram here
                </button>
                <p className="text-[11px] text-muted-foreground italic">
                  [Visual Prompt]: A detailed biological diagram of a chloroplast cross-section with an oval or biconvex
                  outline, a double membrane (outer and inner), an internal fluid-filled region labeled &quot;Stroma&quot;,
                  stacks of green coin-shaped discs labeled &quot;Granum (stack of thylakoids)&quot;, a single disc
                  labeled &quot;Thylakoid&quot;, and the inner space of a disc labeled &quot;Thylakoid lumen&quot;.
                </p>
                <p className="text-xs text-muted-foreground">
                  A cross-section of a chloroplast, the site of photosynthesis. This diagram illustrates its
                  double-membrane structure, the stroma (aqueous fluid where the Calvin cycle occurs), and the grana
                  (stacks of thylakoids containing chlorophyll for capturing light energy).
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-bold text-primary">Leaf Anatomy &amp; The Light-Dependent Reaction</h4>
              <p className="text-sm text-muted-foreground">
                Chloroplasts are specialized, oval-shaped organelles found mainly in the mesophyll cells of higher
                plants. Each chloroplast is typically about 4–6&nbsp;µm in diameter and 1–3&nbsp;µm thick and is
                enclosed by a double membrane (outer and inner) with a narrow intermembrane space in between.
              </p>
              <p className="text-sm text-muted-foreground">
                The mesophyll is the inner tissue of the leaf and is organized into two layers with different jobs:
                the <strong>palisade mesophyll</strong>, which is tightly packed with chloroplasts to capture as much
                light as possible, and the <strong>spongy mesophyll</strong>, which has many air spaces to allow
                efficient gas exchange. Small openings on the leaf surface called <strong>stomata</strong> open and
                close to let carbon dioxide enter the leaf and release oxygen as a by-product.
              </p>
              <p className="text-sm text-muted-foreground">
                Photosynthesis can be divided into two main stages: <strong>light-dependent reactions</strong> and
                <strong> light-independent reactions</strong> (Calvin cycle).
              </p>

              {/* Visual placeholders for reference diagrams */}
              <div className="pt-2 space-y-4">
                <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2 max-w-5xl mx-auto">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    The Thylakoid Membrane Diagram
                  </p>
                  <button
                    type="button"
                    className="w-full"
                    onClick={() =>
                      setLightboxImage({
                        src: '/thylakoid membrane.svg',
                        alt: 'Diagram of the thylakoid membrane showing photosystems, electron carriers, and ATP synthase.',
                      })
                    }
                  >
                    <img
                      className="w-full h-auto rounded-md"
                      src="/thylakoid membrane.svg"
                      alt="Diagram of the thylakoid membrane showing photosystems, electron carriers, and ATP synthase."
                    />
                  </button>
                  <p className="text-xs text-muted-foreground">
                    A diagram of the thylakoid membrane where the light-dependent reaction
                    occurs. This shows photosystems II and I, electron carriers, and the ATP synthase protein complex.
                  </p>
                </div>
              </div>

              
            </div>
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

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-primary text-sm md:text-base">Steps for Light-Dependent Reaction</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Photon Absorption</strong>: Chlorophyll and other pigments in the thylakoid membranes absorb
                light energy, primarily in the blue and red wavelengths. This energy excites electrons, which are
                then transferred to a primary electron acceptor.
              </li>
              <li>
                <strong>Water Splitting (Photolysis)</strong>: Water molecules (H₂O) are split into oxygen (O₂),
                protons (H⁺), and electrons. The equation for this process can be summarized as:
                <span className="block font-semibold mt-1 mb-1">2H₂O → 4H⁺ + 4e⁻ + O₂</span>
                The released oxygen is expelled as a by-product.
              </li>
              <li>
                <strong>Electron Transport Chain</strong>: Excited electrons travel through a series of proteins in the
                electron transport chain (ETC). As they move, they lose energy, which is used to pump protons into the
                thylakoid lumen, creating a proton gradient.
              </li>
              <li>
                <strong>ATP and NADPH Formation</strong>: The proton gradient drives ATP synthase to produce ATP from
                ADP and inorganic phosphate (Pi). Concurrently, the electrons reduce NADP⁺ to form NADPH.
              </li>
            </ol>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold">Summary of Products</p>
              <p>
                <strong>ATP</strong>: Energy currency used in the Calvin cycle.
              </p>
              <p>
                <strong>NADPH</strong>: Reducing power for converting carbon dioxide into glucose.
              </p>
              <p>
                <strong>Oxygen (O₂)</strong>: Released into the atmosphere as a by-product.
              </p>
            </div>
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
                <strong>Carbon Fixation</strong>: Carbon dioxide (CO₂) enters the leaf through stomata and diffuses
                into the stroma. Here, it combines with ribulose bisphosphate (RuBP), a five-carbon sugar, catalyzed
                by the enzyme ribulose bisphosphate carboxylase/oxygenase (RuBisCO). This reaction produces two
                molecules of 3-phosphoglycerate (3-PGA), a three-carbon compound.
              </li>
              <li>
                <strong>Reduction Phase</strong>: The 3-PGA molecules are phosphorylated by ATP and reduced by NADPH to
                form glyceraldehyde-3-phosphate (G3P), another three-carbon sugar. Some of these G3P molecules exit the
                cycle to contribute to glucose formation and other carbohydrates.
              </li>
              <li>
                <strong>Regeneration of RuBP</strong>: The remaining G3P molecules are used to regenerate RuBP, allowing
                the cycle to continue. This regeneration step requires additional ATP.
              </li>
            </ol>

            {/* Placeholder for Calvin cycle diagram */}
            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2 max-w-3xl mx-auto">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Calvin Cycle (Light-Independent Reactions) Diagram
              </p>
              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-6 cursor-pointer"
              >
                 <img
                      className="w-full h-auto rounded-md"
                      src="/calvin.png"
                      alt="Diagram of the thylakoid membrane showing photosystems, electron carriers, and ATP synthase."
                  />
              </button>
              <p className="text-xs text-muted-foreground">
              The flow of the reactions in the synthesis of organic molecules from carbon
              dioxide. The diagram also shows how ATP and NADPH fuel the reaction.
              </p>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground pt-1">
              <p className="font-semibold">Summary of Products</p>
              <p>
                <strong>Glucose</strong>: Formed from G3P; serves as an energy source for plants.
              </p>
              <p>
                <strong>Other organic compounds</strong>: Includes starch for storage, cellulose for cell walls, and
                various amino acids and biomolecules needed for growth.
              </p>
            </div>
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
    {
      id: 'activity-2-1',
      title: "Activity 2.1: Let's Dig Deeper!",
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('activity-2-1'),
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-primary">Activity 2.1: Let&apos;s Dig Deeper!</h3>
            <p className="text-sm text-muted-foreground">
              Deepen your understanding of photosynthesis by using our learning assistant, ChatGPT, to explore ideas you
              are still curious or confused about. Ask clear questions about any concepts you want to review or learn
              more about, then use the activity below to organize what ChatGPT tells you and verify it with reliable
              scientific sources.
            </p>
            <p className="text-sm text-muted-foreground">
              Follow the guide in the table: record your questions, summarize ChatGPT&apos;s answers, check those
              answers using textbooks, websites, or journal articles, and then write your final, evidence-based answer.
            </p>
          </div>

          {/* Worksheet table */}
          <div className="overflow-x-auto rounded-xl border border-muted-foreground/30 bg-muted/10">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                    Questions asked to ChatGPT
                  </th>
                  <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                    Generated Answers
                  </th>
                  <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                    Verification of answers through independent research
                    <span className="block font-normal text-[11px] text-muted-foreground">
                      (Include at least 2 sources)
                    </span>
                  </th>
                  <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                    Final answers
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((row) => (
                  <tr key={row} className="align-top">
                    <td className="border-t border-muted-foreground/20 px-3 py-2">
                      <textarea
                        className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                        placeholder="Student to fill"
                      />
                    </td>
                    <td className="border-t border-muted-foreground/20 px-3 py-2">
                      <textarea
                        className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                        placeholder="Student to fill"
                      />
                    </td>
                    <td className="border-t border-muted-foreground/20 px-3 py-2">
                      <textarea
                        className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                        placeholder="Student to fill (list sources and notes)"
                      />
                    </td>
                    <td className="border-t border-muted-foreground/20 px-3 py-2">
                      <textarea
                        className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                        placeholder="Student to fill (evidence-based final answer)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual placeholder for Research & Verification */}
          <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2 max-w-md">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Research &amp; Verification</p>
            <div className="flex items-center gap-3">
              <div className="flex-0 w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2">
                Insert research &amp; verification icon here
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                [Visual Prompt]: An icon or simple illustration showing a magnifying glass over a document or a computer
                screen, symbolizing research and fact-checking.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this activity to verify AI-generated information with credible scientific sources.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'activity-2-2',
      title: 'Activity 2.2: Investigation - Do Plants Consume CO₂?',
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('activity-2-2'),
      content: (
        <div className="space-y-6">
          {/* Introduction & Theory */}
          <div className="space-y-3">
            <h3 className="font-bold text-primary">Activity 2.2: Investigation - Do Plants Consume CO₂?</h3>
            <p className="text-sm text-muted-foreground">
              You may already know the &quot;shortcut&quot; equation for photosynthesis:
              <strong> CO₂ + H₂O + light energy → C₆H₁₂O₆ + O₂ + H₂O</strong>. While this looks simple, it actually
              summarizes two linked stages: the <strong>light-dependent reactions</strong> (which capture light energy)
              and the <strong>light-independent reactions</strong> (Calvin cycle), where carbon dioxide is fixed into
              sugars.
            </p>
            <p className="text-sm text-muted-foreground">
              In this investigation, you will observe a plant fixing carbon using an indicator called
              <strong> phenol red</strong>. Phenol red is <strong>red</strong> when the solution is neutral or basic
              (pH around 7 or higher) and turns <strong>yellow</strong> when the solution becomes acidic (pH below 7).
              When you gently blow bubbles into the solution, the carbon dioxide from your breath dissolves in water,
              forming carbonic acid and lowering the pH—this makes the solution turn yellow.
            </p>
            <p className="text-sm text-muted-foreground">
              If a plant in the solution removes CO₂ during photosynthesis, the amount of carbonic acid decreases, the
              pH rises again, and the indicator returns toward its red color. By comparing test tubes kept in the light
              and in the dark, you will gather evidence for whether plants really consume carbon dioxide.
            </p>
          </div>

          {/* Materials & Procedure */}
          <div className="space-y-3">
            <h4 className="font-bold text-primary text-sm md:text-base">Materials</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Phenol red (0.02 aqueous solution)</li>
              <li>Plants (elodea or kale leaves)</li>
              <li>200 mL Erlenmeyer flask</li>
              <li>3 test tubes with caps (or parafilm)</li>
            </ul>

            <h4 className="font-bold text-primary text-sm md:text-base">Procedure</h4>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
              <li>Fill an Erlenmeyer flask with approximately 100 mL of phenol red solution.</li>
              <li>
                Use a straw to gently blow into the flask until the solution turns yellow. Stop as soon as you see a
                clear color change.
              </li>
              <li>Divide the yellow solution into three test tubes, about 30 mL in each tube.</li>
              <li>
                Add leaves from kale or elodea to <strong>two</strong> of the test tubes. Try to keep the total volume
                in each tube as equal as possible.
              </li>
              <li>
                Place the empty tube (control) and one tube containing a plant under a bright light source. Wrap the
                third tube (containing a plant) completely in foil to keep it in the dark.
              </li>
            </ol>
          </div>

          {/* Visual placeholder for lab setup */}
          <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-3 space-y-2 max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Lab Setup Diagram</p>
            <button
              type="button"
              className="w-full rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 py-6 cursor-pointer"
            >
               <img
                      className="w-full h-auto rounded-md"
                      src="/lab_setup.png"
                      alt="Three test tubes containing phenol red solution. Tube 2 is exposed to light, while
              Tube 3 is kept in the dark."
                />
            </button>
            <p className="text-xs text-muted-foreground">
              Experimental setup: Three test tubes containing phenol red solution. Tube 2 is exposed to light, while
              Tube 3 is kept in the dark.
            </p>
          </div>

          {/* Data & Analysis */}
          <div className="space-y-3">
            <h4 className="font-bold text-primary text-sm md:text-base">Data Table</h4>
            <div className="overflow-x-auto rounded-xl border border-muted-foreground/30 bg-muted/10">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">Test Tube #</th>
                    <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                      Contents of Tube
                    </th>
                    <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                      Initial Color
                    </th>
                    <th className="border-b border-muted-foreground/30 px-3 py-2 text-left font-semibold">
                      Final Color (after 30 mins)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((tube) => (
                    <tr key={tube}>
                      <td className="border-t border-muted-foreground/20 px-3 py-2 align-top">{tube}</td>
                      <td className="border-t border-muted-foreground/20 px-3 py-2 align-top">
                        <input
                          className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder="Student to fill"
                        />
                      </td>
                      <td className="border-t border-muted-foreground/20 px-3 py-2 align-top">
                        <input
                          className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder="Student to fill"
                        />
                      </td>
                      <td className="border-t border-muted-foreground/20 px-3 py-2 align-top">
                        <input
                          className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder="Student to fill"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="font-bold text-primary text-sm md:text-base">Analysis Questions</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                'Why does the phenol red change color when we blow bubbles into the tube?',
                'If carbon fixation occurs during the light-independent stage, why did the procedure call for placing test tubes under light banks?',
                'Did you see a change in color in the test tube with no elodea added? Why or why not?',
                'How does a plant use carbon? What is meant by the term \"carbon fixation\"?',
                'How do plants and animals benefit from photosynthesis?',
              ].map((question) => (
                <div key={question} className="space-y-1">
                  <p className="font-medium">{question}</p>
                  <textarea
                    className="w-full rounded-md border border-muted-foreground/30 bg-background px-2 py-1 text-xs md:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[60px]"
                    placeholder="Write your answer here..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'assessment-show-what-you-know',
      title: 'Assessment: Show What You Know!',
      icon: <Target className="w-4 h-4" />,
      completed: sectionsDone.includes('assessment-show-what-you-know'),
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-primary text-sm md:text-base">
              Assessment: Show What You Know!
            </h3>
            <p className="text-sm text-muted-foreground">
              Let us test your knowledge in this lesson! Read the questions carefully and supply the correct answer in
              the space provided.
            </p>
          </div>

          <div className="space-y-3">
            {[
              '1. What organelle in a plant cell performs photosynthesis?',
              '2. What pigment makes plants green?',
              '3. What part inside the chloroplast actually makes sugar?',
              '4. What process converts light energy into chemical energy?',
              '5. In photosynthesis, light energy is converted into chemical energy; what molecule stores this chemical energy?',
              '6. What are the reactants of photosynthesis?',
              '7. What are the products of photosynthesis?',
            ].map((question) => (
              <div key={question} className="space-y-1">
                <p className="text-sm font-medium">{question}</p>
                <textarea
                  className="w-full rounded-md border border-muted-foreground/30 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[40px]"
                  placeholder="Write your answer here..."
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              8. Fill in the boxes to complete the cycle below regarding the reactants and products for photosynthesis.
            </p>

            <div className="rounded-xl border border-muted-foreground/30 bg-muted/20 p-4 space-y-4">
              <div className="relative max-w-3xl mx-auto">
                <img
                  className="w-full h-auto rounded-md"
                  src="/cycle.png"
                  alt="The cycle of matter showing arrows between animals, plants, and two central blank boxes."
                />

                {/* Left answer box overlay */}
                <input
                  type="text"
                  className="absolute bg-transparent border-b border-muted-foreground/80 text-[11px] md:text-xs text-center text-black placeholder:text-black focus:outline-none focus:border-primary"
                  style={{
                    left: '16%',
                    top: '56%',
                    width: '32%',
                  }}
                  placeholder="Type your answer here"
                />

                {/* Right answer box overlay */}
                <input
                  type="text"
                  className="absolute bg-transparent border-b border-muted-foreground/80 text-[11px] md:text-xs text-center text-black placeholder:text-black focus:outline-none focus:border-primary"
                  style={{
                    right: '16%',
                    top: '56%',
                    width: '32%',
                  }}
                  placeholder="Type your answer here"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => markDone('assessment-show-what-you-know')}
              className="btn-nature text-sm py-2"
            >
              Save assessment
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

