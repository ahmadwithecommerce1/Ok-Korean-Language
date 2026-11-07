export interface Course {
  id: string;
  level: string;
  koreanTitle: string;
  title: string;
  topikLevel: string;
  duration: string;
  hoursPerWeek: string;
  description: string;
  outcomes: string[];
  syllabus: {
    week: string;
    topic: string;
    grammar: string;
  }[];
  tag: 'beginner' | 'intermediate' | 'advanced' | 'specialized';
  featured?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  displayPrice?: string;
  billingPeriod?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface FaqItem {
  question: string;
  koreanHint?: string;
  answer: string;
}

export interface HangulChar {
  id?: string;
  char: string;
  name: string;
  romaja: string;
  meaning: string;
  type: 'consonant' | 'double_consonant' | 'vowel' | 'compound_vowel' | 'batchim' | 'word';
  ipa: string;
  soundFile?: string;
  speechText?: string;
  audioPath?: string;
}


