
export interface Certification {
  id: string;
  name: string;
  provider: string;
  icon: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "3-6 months"
  rating: number; // e.g., 4.5
  reviewCount: number;
}

export interface CertificationCategory {
  name: string;
  icon: string;
}

export interface CertificationCategories {
  [key: string]: CertificationCategory;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DailyPlan {
  day: string; // e.g., "Monday"
  hours: number;
  tasks: string[];
}

export interface WeeklyPlan {
  week: number;
  weeklySummary: string;
  dailyBreakdown: DailyPlan[];
}

export interface StudyPlan {
  introduction: string;
  weeklyPlan: WeeklyPlan[];
  conclusion: string;
}

export type Page = 'feed' | 'bookmarks' | 'scheduler' | 'studyPlan';

export interface PathwayStep {
  step: number;
  title: string;
  description: string;
  detailedDescription: string;
  keyTopics: string[];
  prerequisites: string[];
  resources: Certification[];
}