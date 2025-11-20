export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  INSANE = 'INSANE'
}

export enum Category {
  CRYPTO = 'CRYPTOGRAPHY',
  WEB = 'WEB EXPLOITATION',
  FORENSICS = 'FORENSICS',
  REVERSE = 'REVERSE ENGINEERING',
  OSINT = 'OSINT',
  LOGIC = 'LOGIC'
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  flag: string; // The answer
  hint: string;
  content?: string; // Optional specific content (e.g., ciphertext)
  isAiGenerated?: boolean;
}

export enum AIPersonality {
  DRILL_SERGEANT = 'DRILL_SERGEANT',
  ENIGMATIC_HACKER = 'ENIGMATIC_HACKER',
  FRIENDLY_TUTOR = 'FRIENDLY_TUTOR',
  CHAOTIC_AI = 'CHAOTIC_AI'
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
}

export interface UserState {
  username: string;
  personality: AIPersonality;
  solvedChallenges: string[]; // IDs
  score: number;
  rank: string;
}