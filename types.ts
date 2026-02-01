
export interface Habit {
  id: string;
  name: string;
  completions: Record<string, number[]>; 
  color: string;
  weekendsOff: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface CalendarEntry {
  todos: Todo[];
  isImportant: boolean;
  note?: string;
}

export type CalendarData = Record<string, CalendarEntry>;

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  onboarded: boolean;
  themeColor?: string;
}

export interface CycleLog {
  id: string; // Unique identifier for reliable editing/deleting
  startDate: string; // YYYY-MM-DD
  duration: number;
}

export interface CycleData {
  logs: CycleLog[];
  avgLength: number;
}

// Wrapper for all data associated with a single user
export interface UserData {
  habits: Habit[];
  calendarData: CalendarData;
  cycleData: CycleData;
}
