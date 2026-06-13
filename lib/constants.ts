// ─── API Endpoint Placeholders ───────────────────────────────────────────────
// ALL endpoint strings live here. When Uwais confirms final FastAPI routes,
// update this file only — never hardcode strings in components or hooks.

export const API_SESSION_START =
  '/api/sessions/start'; // PLACEHOLDER — field names "job" + "level" pending final confirm

export const API_SESSION_FLAG = (sid: string) =>
  `/api/interview/${sid}/flag`; // PLACEHOLDER

export const API_SESSION_RESULTS = (sid: string) =>
  `/api/interview/${sid}/results`; // PLACEHOLDER

export const WS_INTERVIEW_STREAM = (sid: string) =>
  `${process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'}/api/interview/${sid}/stream`; // PLACEHOLDER

// ─── Interview Config ────────────────────────────────────────────────────────

export const TOTAL_QUESTIONS = 10;

// ─── Gaze Tracking ───────────────────────────────────────────────────────────

export const GAZE_LEFT_THRESHOLD = 0.35;
export const GAZE_RIGHT_THRESHOLD = 0.65;
export const DISTRACTION_TIMEOUT_MS = 3000;

// ─── Object Detection ────────────────────────────────────────────────────────

export const YOLO_FRAME_INTERVAL = 20;   // run inference every Nth frame
export const YOLO_INPUT_SIZE = 512;      // confirmed: 512×512
export const COCO_PHONE_CLASS = 67;
export const COCO_LAPTOP_CLASS = 63;

// ─── Scoring ─────────────────────────────────────────────────────────────────

export const CHEAT_PENALTY = 0.2;
export const SCORE_PASS_THRESHOLD = 0.5;

// ─── Audio ───────────────────────────────────────────────────────────────────

export const AUDIO_SAMPLE_RATE = 16000; // Vosk expects 16kHz
export const AUDIO_CHUNK_FRAMES = 1024; // ~64ms per chunk

// ─── Topics ──────────────────────────────────────────────────────────────────

import type { TopicOption } from '@/types';

export const TOPICS: TopicOption[] = [
  {
    id: 'machine_learning',
    label: 'Machine Learning',
    description: 'Models, training, evaluation, and ML fundamentals',
  },
  {
    id: 'computer_science',
    label: 'CS Fundamentals',
    description: 'Algorithms, complexity, and core CS theory',
  },
  {
    id: 'system_design',
    label: 'System Design',
    description: 'Scalability, architecture, and distributed systems',
  },
  {
    id: 'data_structures',
    label: 'Data Structures',
    description: 'Arrays, trees, graphs, and problem solving',
  },
  {
    id: 'databases',
    label: 'Databases',
    description: 'SQL, NoSQL, indexing, and query optimisation',
  },
  {
    id: 'operating_systems',
    label: 'Operating Systems',
    description: 'Processes, memory, concurrency, and scheduling',
  },
];

// ─── Motivational Quotes ─────────────────────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
  { text: 'Every expert was once a beginner.', author: 'Helen Hayes' },
  { text: "The secret of getting ahead is getting started.", author: 'Mark Twain' },
  { text: 'Confidence is not a prerequisite for competence.', author: null },
  { text: 'Preparation is the foundation of confidence.', author: null },
  { text: 'You don\'t rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Hard questions have good answers. You just need to find them.', author: null },
  { text: 'The interview is just a conversation. You already know this material.', author: null },
  { text: 'Pressure is a privilege.', author: 'Billie Jean King' },
  { text: 'Done is better than perfect. Answered is better than silent.', author: null },
  { text: 'You\'ve prepared for this. Trust the process.', author: null },
];
