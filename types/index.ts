// Session and setup

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic =
  | 'machine_learning'
  | 'computer_science'
  | 'system_design'
  | 'data_structures'
  | 'databases'
  | 'operating_systems';

export interface TopicOption {
  id: Topic;
  label: string;
  description: string;
}

export interface StartSessionRequest {
  uid: string;
  job: Topic; // Backend field name pending final confirmation.
  level: Difficulty; // Backend field name pending final confirmation.
}

export interface StartSessionResponse {
  sid: string;
  status: string;
}

// Interview

export interface Question {
  qid: number;
  text: string;
  order: number;
}

export interface WebSocketMessage {
  transcript: string;
  score: number;
}

export interface QuestionResponse {
  qid: number;
  transcript: string;
  score: number;
  attempt: number;
}

// Results

export type ClusterLabel = 'top' | 'average' | 'poor';

export interface QuestionResult {
  qid: number;
  question_text: string;
  user_transcript: string;
  ideal_answer: string;
  similarity_score: number;
  wikipedia_link?: {
    title: string;
    url: string;
    snippet?: string;
  };
}

export interface SessionResults {
  sid: string;
  final_score: number;
  cluster_label: ClusterLabel;
  questions: QuestionResult[];
  cheating_count: number;
}

// Store

export interface InterviewStore {
  selectedTopic: Topic | null;
  selectedDifficulty: Difficulty | null;
  setTopic: (topic: Topic) => void;
  setDifficulty: (d: Difficulty) => void;

  sessionId: string | null;
  setSessionId: (sid: string) => void;

  currentQuestionIndex: number;
  totalQuestions: number;
  questions: Question[];
  responses: QuestionResponse[];
  cheatingCount: number;
  sessionPenalty: number;

  addResponse: (response: QuestionResponse) => void;
  incrementCheating: () => void;

  finalScore: number | null;
  clusterLabel: ClusterLabel | null;
  setResults: (score: number, cluster: ClusterLabel) => void;

  resetSession: () => void;
}
