export type EventCategory = 'assignment' | 'exam' | 'class' | 'study';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface CalendarEvent {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: EventCategory;
  priority: PriorityLevel;
  completed?: boolean;
  notes?: string;
  location?: string;
}

export interface PriorityMilestone {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  daysLeft: number;
  progress: number; // 0 to 100
  priority: PriorityLevel;
  iconType: 'bulb' | 'alert' | 'book' | 'code';
  subtasks: { id: string; text: string; completed: boolean }[];
  colorTheme: 'emerald' | 'purple' | 'cyan' | 'amber';
}

export interface DayActivity {
  dayName: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  dateStr: string;
  hours: number; // e.g. 10, 12, 14
  targetHours: number;
  completedTasks: number;
  subjects: { name: string; hours: number }[];
}

export interface SubjectBreakdown {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  hours: number;
  percentage: number;
}

export type ThemeMode = 'auto' | 'dark' | 'light';

export type ActiveTab = 'dashboard' | 'calendar' | 'priorities' | 'tracker' | 'timer';
