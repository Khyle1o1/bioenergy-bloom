export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
}

// Pre-Test and Post-Test Questions (30 items based on PDF)
export const preTestQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the energy currency of the cell?",
    options: ["ADP", "ATP", "NADPH", "Glucose"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Where does photosynthesis primarily occur in a plant cell?",
    options: ["Mitochondria", "Nucleus", "Chloroplast", "Cytoplasm"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "Which organelle is responsible for cellular respiration?",
    options: ["Chloroplast", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "What is the primary source of energy for photosynthesis?",
    options: ["Chemical energy", "Heat energy", "Sunlight", "Electrical energy"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "Which molecule captures light energy in photosynthesis?",
    options: ["Glucose", "ATP", "Chlorophyll", "Oxygen"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "What are the products of photosynthesis?",
    options: ["CO₂ and H₂O", "O₂ and glucose", "ATP and NADPH", "ADP and CO₂"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What are the reactants of cellular respiration?",
    options: ["O₂ and glucose", "CO₂ and H₂O", "ATP and NADPH", "Chlorophyll and sunlight"],
    correctAnswer: 0,
  },
  {
    id: 8,
    question: "Which process releases energy from glucose?",
    options: ["Photosynthesis", "Cellular respiration", "Fermentation only", "Photolysis"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "The light-dependent reactions occur in which part of the chloroplast?",
    options: ["Stroma", "Thylakoid membrane", "Outer membrane", "Nucleus"],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "Where does the Calvin cycle take place?",
    options: ["Thylakoid", "Stroma", "Mitochondria", "Cytoplasm"],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "What is produced during the light-dependent reactions?",
    options: ["Glucose", "ATP and NADPH", "CO₂", "Protein"],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: "Which stage of cellular respiration produces the most ATP?",
    options: ["Glycolysis", "Krebs cycle", "Electron transport chain", "Fermentation"],
    correctAnswer: 2,
  },
  {
    id: 13,
    question: "Glycolysis occurs in which part of the cell?",
    options: ["Mitochondria", "Chloroplast", "Cytoplasm", "Nucleus"],
    correctAnswer: 2,
  },
  {
    id: 14,
    question: "How many ATP molecules are produced from one glucose in cellular respiration?",
    options: ["2", "4", "36-38", "100"],
    correctAnswer: 2,
  },
  {
    id: 15,
    question: "What is the byproduct of aerobic respiration?",
    options: ["Oxygen", "Glucose", "Carbon dioxide and water", "Ethanol"],
    correctAnswer: 2,
  },
  {
    id: 16,
    question: "Which type of fermentation produces alcohol?",
    options: ["Lactic acid fermentation", "Alcoholic fermentation", "Aerobic fermentation", "Photosynthetic fermentation"],
    correctAnswer: 1,
  },
  {
    id: 17,
    question: "What happens during photolysis?",
    options: ["Glucose is broken down", "Water molecules are split", "CO₂ is absorbed", "ATP is consumed"],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: "NADPH is produced during which process?",
    options: ["Glycolysis", "Light-dependent reactions", "Krebs cycle", "Fermentation"],
    correctAnswer: 1,
  },
  {
    id: 19,
    question: "The Krebs cycle occurs in which part of the mitochondria?",
    options: ["Outer membrane", "Inner membrane", "Matrix", "Intermembrane space"],
    correctAnswer: 2,
  },
  {
    id: 20,
    question: "What is the role of oxygen in the electron transport chain?",
    options: ["Electron donor", "Final electron acceptor", "Catalyst", "Energy source"],
    correctAnswer: 1,
  },
  {
    id: 21,
    question: "Which process does NOT require oxygen?",
    options: ["Aerobic respiration", "Electron transport chain", "Fermentation", "Krebs cycle"],
    correctAnswer: 2,
  },
  {
    id: 22,
    question: "What connects photosynthesis and cellular respiration?",
    options: ["They are unrelated", "Products of one are reactants of the other", "They occur at the same time", "They use the same organelle"],
    correctAnswer: 1,
  },
  {
    id: 23,
    question: "RuBisCO is an enzyme involved in:",
    options: ["Glycolysis", "Carbon fixation", "Electron transport", "Fermentation"],
    correctAnswer: 1,
  },
  {
    id: 24,
    question: "What is the net ATP gain from glycolysis?",
    options: ["0", "2", "4", "36"],
    correctAnswer: 1,
  },
  {
    id: 25,
    question: "Which pigment absorbs mainly red and blue light?",
    options: ["Carotenoids", "Chlorophyll a", "Xanthophyll", "Anthocyanin"],
    correctAnswer: 1,
  },
  {
    id: 26,
    question: "The electron transport chain is located in:",
    options: ["Thylakoid membrane", "Inner mitochondrial membrane", "Both A and B", "Cytoplasm"],
    correctAnswer: 2,
  },
  {
    id: 27,
    question: "What happens when muscles lack oxygen during exercise?",
    options: ["Aerobic respiration increases", "Lactic acid fermentation occurs", "Photosynthesis starts", "No energy is produced"],
    correctAnswer: 1,
  },
  {
    id: 28,
    question: "Chemiosmosis produces ATP using:",
    options: ["Temperature gradient", "Proton gradient", "Oxygen gradient", "Carbon gradient"],
    correctAnswer: 1,
  },
  {
    id: 29,
    question: "Which statement about bioenergetics is TRUE?",
    options: ["Energy can be created", "Energy can be destroyed", "Energy is transformed", "Energy is not conserved"],
    correctAnswer: 2,
  },
  {
    id: 30,
    question: "Like coffee plants in Bukidnon, what do plants need for photosynthesis?",
    options: ["Only water", "Only CO₂", "Sunlight, water, and CO₂", "Oxygen and glucose"],
    correctAnswer: 2,
  },
];

// Lesson 1 Assessment (Bioenergetics)
export const lesson1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Bioenergetics is the study of:",
    options: ["Cell structure", "Energy flow in living systems", "DNA replication", "Plant anatomy"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which organelle converts light energy to chemical energy?",
    options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "ATP stands for:",
    options: ["Adenosine Triphosphate", "Active Transport Protein", "Amino Tri-Peptide", "Adenine Transfer Process"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "Energy transformation in cells follows the law of:",
    options: ["Gravity", "Thermodynamics", "Motion", "Electricity"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Which is an example of potential energy in cells?",
    options: ["Moving molecules", "ATP bonds", "Heat released", "Light absorbed"],
    correctAnswer: 1,
  },
];

// Lesson 2 Assessment (Photosynthesis)
export const lesson2Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "The overall equation for photosynthesis is:",
    options: [
      "C₆H₁₂O₆ + O₂ → CO₂ + H₂O",
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "ATP → ADP + P",
      "NADPH → NADP⁺"
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Photosystem II splits water to release:",
    options: ["Glucose", "ATP", "Electrons and oxygen", "Carbon dioxide"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "The Calvin cycle fixes which molecule?",
    options: ["Oxygen", "Carbon dioxide", "Water", "Nitrogen"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What factor does NOT affect the rate of photosynthesis?",
    options: ["Light intensity", "CO₂ concentration", "Blood type", "Temperature"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "G3P (glyceraldehyde-3-phosphate) is used to make:",
    options: ["Water", "Oxygen", "Glucose and other sugars", "Carbon dioxide"],
    correctAnswer: 2,
  },
];

// Lesson 3 Assessment (Cellular Respiration)
export const lesson3Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "The equation for cellular respiration is:",
    options: [
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP",
      "ATP → ADP + Energy",
      "H₂O → H₂ + O₂"
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which is the correct order of cellular respiration stages?",
    options: [
      "Krebs → Glycolysis → ETC",
      "ETC → Krebs → Glycolysis",
      "Glycolysis → Krebs → ETC",
      "Glycolysis → ETC → Krebs"
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "Pyruvate is the end product of:",
    options: ["Krebs cycle", "Glycolysis", "Electron transport chain", "Fermentation"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "FADH₂ and NADH are:",
    options: ["Final products", "Electron carriers", "Enzymes", "Waste products"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Yeast produces what during alcoholic fermentation?",
    options: ["Lactic acid", "Ethanol and CO₂", "Oxygen", "Glucose"],
    correctAnswer: 1,
  },
];
