import type { OsceCase } from "@/lib/types";

export const sampleCases: OsceCase[] = [
  {
    id: "chest-pain",
    title: "Chest Pain",
    stationType: "Focused history and initial management",
    setting: "Emergency department triage room",
    difficulty: "Intermediate",
    patientName: "Martin Chen",
    patientAge: 56,
    emotionalState: "anxious",
    openingPrompt: "Doctor, I have this tight feeling in my chest and I am worried.",
    candidateInstructions:
      "Take a focused history, identify red flags, explain your initial impression, and outline immediate next steps.",
    visibleInfo: [
      "56-year-old patient with chest discomfort for 45 minutes",
      "Vitals: BP 148/92, HR 98, RR 20, SpO2 97% on room air",
      "No ECG has been completed yet"
    ],
    hiddenFacts: {
      presentingConcern: "Central chest tightness radiating to the left arm",
      facts: [
        "Pain started while shoveling snow",
        "Pain is pressure-like and 8 out of 10",
        "Associated shortness of breath and sweating",
        "Past history of hypertension and high cholesterol",
        "Smokes half a pack per day",
        "Father had a heart attack at age 59",
        "Took no medication before arrival"
      ],
      redFlags: [
        "Exertional crushing chest pain",
        "Radiation to left arm",
        "Diaphoresis",
        "Cardiac risk factors"
      ],
      patientQuestions: [
        "Am I having a heart attack?",
        "Can I go home if the pain settles?"
      ],
      disclosureRules: [
        "Only mention radiation if asked about location or spread",
        "Only mention family history if asked",
        "Do not volunteer smoking history unless asked about risk factors"
      ]
    },
    checklist: [
      { id: "pain-onset", label: "Clarifies onset, trigger, character, radiation, severity, and duration", domain: "history", weight: 3 },
      { id: "associated", label: "Asks about dyspnea, diaphoresis, nausea, syncope, and palpitations", domain: "history", weight: 2 },
      { id: "risk-factors", label: "Explores cardiac risk factors and relevant past history", domain: "clinical-reasoning", weight: 2 },
      { id: "red-flags", label: "Identifies possible acute coronary syndrome and urgent red flags", domain: "clinical-reasoning", weight: 3 },
      { id: "management", label: "Requests ECG, troponins, aspirin consideration, monitoring, and senior help", domain: "management", weight: 3 },
      { id: "communication", label: "Acknowledges anxiety and explains need for urgent assessment", domain: "communication", weight: 2 }
    ],
    suggestedNextCaseIds: ["abdominal-pain", "breaking-bad-news"]
  },
  {
    id: "abdominal-pain",
    title: "Abdominal Pain",
    stationType: "Focused history",
    setting: "Family medicine urgent visit",
    difficulty: "Beginner",
    patientName: "Sara Patel",
    patientAge: 34,
    emotionalState: "confused",
    openingPrompt: "I have had stomach pain since last night and I am not sure what is going on.",
    candidateInstructions:
      "Take a focused abdominal pain history and state the most important differentials and safety-net advice.",
    visibleInfo: [
      "34-year-old patient with lower abdominal pain",
      "Vitals: BP 112/72, HR 88, Temp 37.8 C",
      "No known chronic illnesses"
    ],
    hiddenFacts: {
      presentingConcern: "Right lower abdominal pain that migrated from the periumbilical area",
      facts: [
        "Pain began near the belly button then moved to the right lower abdomen",
        "Loss of appetite",
        "Nausea without vomiting",
        "Last menstrual period was six weeks ago",
        "Sexually active with inconsistent contraception",
        "No urinary burning",
        "No previous abdominal surgery"
      ],
      redFlags: [
        "Migratory right lower quadrant pain",
        "Possible pregnancy",
        "Fever"
      ],
      patientQuestions: [
        "Could this just be food poisoning?",
        "Do I need to go to the hospital?"
      ],
      disclosureRules: [
        "Only reveal menstrual history if asked about gynecologic history",
        "Only reveal sexual history if asked in a respectful, private way"
      ]
    },
    checklist: [
      { id: "pain-analysis", label: "Covers onset, migration, site, character, severity, and progression", domain: "history", weight: 3 },
      { id: "gi-gu-gyn", label: "Screens gastrointestinal, urinary, gynecologic, and pregnancy features", domain: "history", weight: 3 },
      { id: "differential", label: "Considers appendicitis, ectopic pregnancy, ovarian, urinary, and GI causes", domain: "clinical-reasoning", weight: 3 },
      { id: "safety", label: "Advises urgent assessment if worsening, fever, fainting, bleeding, or severe pain", domain: "management", weight: 2 },
      { id: "privacy", label: "Uses privacy, consent, and nonjudgmental language for sexual history", domain: "communication", weight: 2 }
    ],
    suggestedNextCaseIds: ["prenatal-counselling", "chest-pain"]
  },
  {
    id: "depression",
    title: "Depression",
    stationType: "Mental health assessment",
    setting: "Primary care clinic",
    difficulty: "Intermediate",
    patientName: "Jordan Miller",
    patientAge: 28,
    emotionalState: "sad",
    openingPrompt: "I have not been myself for weeks. I am tired of feeling this way.",
    candidateInstructions:
      "Assess mood symptoms, safety, function, supports, and propose an initial plan.",
    visibleInfo: [
      "28-year-old patient presenting with low mood",
      "No acute medical concerns documented",
      "Appointment booked after repeated missed work days"
    ],
    hiddenFacts: {
      presentingConcern: "Six weeks of depressed mood and loss of interest",
      facts: [
        "Poor sleep with early morning awakening",
        "Low appetite and 4 kg weight loss",
        "Difficulty concentrating at work",
        "Passive thoughts that life is not worth living",
        "No active plan or prior attempt",
        "Drinks alcohol most nights",
        "Supportive sister nearby"
      ],
      redFlags: [
        "Suicidal ideation",
        "Functional decline",
        "Alcohol use"
      ],
      patientQuestions: [
        "Will I have to take medication forever?",
        "Are you going to tell my employer?"
      ],
      disclosureRules: [
        "Do not reveal passive suicidal thoughts unless directly asked about self-harm or safety",
        "Only discuss alcohol if asked about substances or coping"
      ]
    },
    checklist: [
      { id: "depressive-symptoms", label: "Asks about mood, anhedonia, sleep, appetite, energy, guilt, and concentration", domain: "history", weight: 3 },
      { id: "safety", label: "Assesses suicidal thoughts, plan, intent, means, protective factors, and supports", domain: "clinical-reasoning", weight: 4 },
      { id: "substances", label: "Screens substances, medical contributors, medications, and mania/psychosis", domain: "history", weight: 2 },
      { id: "empathy", label: "Validates distress and maintains confidentiality with safety limits", domain: "communication", weight: 3 },
      { id: "initial-plan", label: "Offers safety plan, follow-up, therapy, lifestyle supports, and medication discussion", domain: "management", weight: 3 }
    ],
    suggestedNextCaseIds: ["breaking-bad-news", "prenatal-counselling"]
  },
  {
    id: "pediatric-fever",
    title: "Pediatric Fever",
    stationType: "Parent counselling and focused history",
    setting: "Community clinic",
    difficulty: "Beginner",
    patientName: "Avery Thompson",
    patientAge: 3,
    emotionalState: "anxious",
    openingPrompt: "My child has a fever and I am scared something serious is happening.",
    candidateInstructions:
      "Speak with the parent, identify serious features, and provide practical fever advice.",
    visibleInfo: [
      "Parent of a 3-year-old child with fever for one day",
      "Vitals: Temp 38.7 C, HR 124, RR 24",
      "Child appears tired but interactive"
    ],
    hiddenFacts: {
      presentingConcern: "Fever with cough and runny nose",
      facts: [
        "Fever began yesterday evening",
        "Child is drinking less but still urinating",
        "No neck stiffness, rash, trouble breathing, seizure, or persistent vomiting",
        "Immunizations are up to date",
        "No significant medical history",
        "Parent gave acetaminophen once"
      ],
      redFlags: [
        "Reduced intake",
        "Need to screen for respiratory distress, dehydration, rash, altered level, and seizure"
      ],
      patientQuestions: [
        "Do antibiotics help fever?",
        "Should I wake my child to give medicine?"
      ],
      disclosureRules: [
        "Answer as the parent",
        "Do not volunteer immunization status unless asked"
      ]
    },
    checklist: [
      { id: "fever-history", label: "Clarifies duration, temperature measurement, pattern, and antipyretic use", domain: "history", weight: 2 },
      { id: "serious-features", label: "Screens hydration, breathing, rash, neck stiffness, seizure, lethargy, and vomiting", domain: "clinical-reasoning", weight: 4 },
      { id: "immunization", label: "Asks immunization status, exposures, travel, and medical history", domain: "history", weight: 2 },
      { id: "advice", label: "Explains fluids, comfort, antipyretic dosing safety, and return precautions", domain: "management", weight: 3 },
      { id: "parent-empathy", label: "Reassures without dismissing and checks caregiver understanding", domain: "communication", weight: 2 }
    ],
    suggestedNextCaseIds: ["abdominal-pain", "prenatal-counselling"]
  },
  {
    id: "prenatal-counselling",
    title: "Prenatal Counselling",
    stationType: "Counselling",
    setting: "Family medicine prenatal visit",
    difficulty: "Intermediate",
    patientName: "Leah Brooks",
    patientAge: 31,
    emotionalState: "calm",
    openingPrompt: "This is my first pregnancy, and I want to know what I should be doing now.",
    candidateInstructions:
      "Provide early pregnancy counselling, screen for risk factors, and outline next steps.",
    visibleInfo: [
      "31-year-old patient, estimated 8 weeks pregnant",
      "First prenatal appointment",
      "No symptoms of pain or bleeding today"
    ],
    hiddenFacts: {
      presentingConcern: "First trimester counselling and reassurance",
      facts: [
        "Taking no prenatal vitamins yet",
        "Occasional wine before learning about pregnancy",
        "Nausea in the mornings",
        "Partner is supportive",
        "No intimate partner violence disclosed unless asked privately",
        "Works as a daycare educator",
        "Unsure about genetic screening"
      ],
      redFlags: [
        "Need to ask about bleeding or pain",
        "Need to screen for safety and intimate partner violence",
        "Occupational infection exposures"
      ],
      patientQuestions: [
        "Is my past alcohol use going to harm the baby?",
        "What foods should I avoid?"
      ],
      disclosureRules: [
        "Only discuss workplace exposure if asked about occupation",
        "Only answer safety questions if asked privately"
      ]
    },
    checklist: [
      { id: "dating-risk", label: "Confirms dates, symptoms, medical history, medications, and pregnancy risk factors", domain: "history", weight: 3 },
      { id: "safety-screen", label: "Screens mental health, substance use, supports, and intimate partner violence", domain: "communication", weight: 3 },
      { id: "health-advice", label: "Covers folic acid, nutrition, alcohol/smoking, exercise, vaccines, and food safety", domain: "management", weight: 3 },
      { id: "tests", label: "Discusses prenatal labs, ultrasound dating, blood type, and screening options", domain: "management", weight: 2 },
      { id: "shared-decision", label: "Uses shared decision-making and checks patient priorities", domain: "communication", weight: 2 }
    ],
    suggestedNextCaseIds: ["pediatric-fever", "depression"]
  },
  {
    id: "breaking-bad-news",
    title: "Breaking Bad News",
    stationType: "Communication",
    setting: "Outpatient consultation room",
    difficulty: "Advanced",
    patientName: "Helen Roy",
    patientAge: 62,
    emotionalState: "sad",
    openingPrompt: "You said my test results were back. Is everything okay?",
    candidateInstructions:
      "Disclose serious imaging results sensitively, respond to emotion, and discuss immediate next steps.",
    visibleInfo: [
      "62-year-old patient returning for CT results",
      "CT shows a suspicious lung mass requiring urgent specialist assessment",
      "You are not expected to discuss detailed staging or prognosis"
    ],
    hiddenFacts: {
      presentingConcern: "Receiving unexpected serious imaging result",
      facts: [
        "Patient came alone",
        "History of smoking, quit five years ago",
        "Has noticed weight loss and cough but hoped it was stress",
        "Fears becoming a burden to family",
        "Wants clear next steps before leaving",
        "No current suicidal thoughts"
      ],
      redFlags: [
        "High emotional distress",
        "Possible malignancy",
        "Needs urgent referral and support"
      ],
      patientQuestions: [
        "Are you saying I have cancer?",
        "How long do I have?"
      ],
      disclosureRules: [
        "React emotionally after the serious result is named",
        "Do not provide a definitive cancer diagnosis or prognosis"
      ]
    },
    checklist: [
      { id: "setup", label: "Sets up privacy, asks what the patient understands, and invites support person", domain: "communication", weight: 3 },
      { id: "warning-shot", label: "Uses a warning statement before sharing serious news", domain: "communication", weight: 2 },
      { id: "clear-language", label: "Explains result clearly without overclaiming diagnosis or prognosis", domain: "clinical-reasoning", weight: 3 },
      { id: "emotion", label: "Allows silence, names emotion, validates, and responds empathetically", domain: "communication", weight: 4 },
      { id: "next-steps", label: "Arranges urgent referral, follow-up, symptom safety-netting, and supports", domain: "management", weight: 3 }
    ],
    suggestedNextCaseIds: ["depression", "chest-pain"]
  }
];

export function getCaseById(id: string) {
  return sampleCases.find((osceCase) => osceCase.id === id);
}
