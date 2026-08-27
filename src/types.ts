export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export type ExportFormat = 'markdown' | 'txt';

export interface StarterQuestion {
  id: string;
  category: string;
  badge: string;
  title: string;
  prompt: string;
}

export interface ExportOptions {
  format: ExportFormat;
  includeReviewNotes: boolean;
  includeTimestamp: boolean;
  studentName?: string;
  courseName?: string;
}
