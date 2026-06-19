// Session and setup

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic =
  | 'programming'
  | 'devops-and-cloud'
  | 'cybersecurity'
  | 'database'
  | 'python'
  | 'frontend';

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
  questions: string[];    // all 10 question texts, returned upfront
  explanation: string[];  // parallel array of ideal answers
}

// Interview

export interface WebSocketMessage {
  transcript: string;
  score: number;
  text: string[];
}

export interface QuestionResponse {
  questionIndex: number;
  transcript: string;
  score: number;
}

// Interview phase — single source of truth for interview screen state
export type InterviewPhase =
  | 'idle'        // before interview starts / between questions
  | 'speaking'    // TTS is playing the question
  | 'listening'   // mic is open, audio streaming to backend
  | 'processing'  // WS closed, waiting for backend response
  | 'complete';   // all 10 questions answered

// Results

export type ClusterLabel = 'top' | 'average' | 'poor';

export interface QuestionResult {
  qid: number;
  question_text: string;
  user_transcript: string;
  ideal_answer: string;
  similarity_score: number;
  wikipedia_link: {
    title: string;
    url: string;
  } | null;
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
  questions: string[];          // question texts, loaded from POST /api/sessions/start
  explanations: string[];       // ideal answers, parallel array to questions
  responses: QuestionResponse[];
  cheatingCount: number;
  sessionPenalty: number;

  interviewPhase: InterviewPhase;

  remainingQuestions: string[];
  remainingExplanations: string[];
  remainingDifficulties: string[];
  currentDifficulty: string | null;

  setQuestionsAndExplanations: (questions: string[], explanations: string[]) => void;
  setQuestionPool: (questions: string[], explanations: string[], difficulties: string[], initialDifficulty: string) => void;
  updateQuestionPool: (nextQuestion: string, nextExplanation: string, nextDifficulty: string, remainingQ: string[], remainingE: string[], remainingD: string[]) => void;
  setPhase: (phase: InterviewPhase) => void;
  addResponse: (response: QuestionResponse) => void;
  incrementCheating: () => void;

  finalScore: number | null;
  clusterLabel: ClusterLabel | null;
  setResults: (score: number, cluster: ClusterLabel) => void;

  resetSession: () => void;
}
