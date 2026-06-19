import axios from 'axios';
import {
  API_SESSION_START,
  API_SESSION_FLAG,
  API_SESSION_RESULTS,
  API_SCORE,
  API_FINAL_INFO,
  API_LOGIN,
} from './constants';
import { getAnonymousUid } from './auth';
import type {
  StartSessionRequest,
  StartSessionResponse,
  SessionResults,
  Difficulty,
  Topic,
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set default Authorization header if token exists in localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('si_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export async function loginAsTestUser(): Promise<string> {
  const res = await api.post(API_LOGIN, {
    username: 'testuser',
    password: '4532pqsdfv@kl',
  });
  if (res.data.status === 'Valid' && res.data.access_token) {
    const token = res.data.access_token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('si_token', token);
    }
    return token;
  }
  throw new Error('Invalid login status from backend');
}

export interface StartSessionResult {
  sid: string;
  questions: string[];
  explanations: string[];
  difficulties: string[];
}

export async function startSession(
  topic: Topic,
  difficulty: Difficulty
): Promise<StartSessionResult> {
  // Login as testuser programmatically first to ensure authentication token is acquired
  try {
    await loginAsTestUser();
  } catch (err) {
    console.error('Programmatic login failed, continuing without token:', err);
  }

  const payload = {
    Field: topic.replace(/_/g, ' '),
    Difficulty: difficulty,
  };

  const res = await api.post(API_SESSION_START, payload);

  // Since Python backend does not return sid, generate a client-side UUID
  const sid = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    sid,
    questions: res.data.questions ?? [],
    explanations: res.data.explanation ?? [],
    difficulties: res.data.difficulty ?? [],
  };
}

export async function flagSession(sessionId: string): Promise<void> {
  try {
    await api.post(API_SESSION_FLAG(sessionId));
  } catch (err) {
    // If the backend has no flagging endpoint, log but do not crash the app
    console.warn('Flagging session failed (usually expected if endpoint not on backend):', err);
  }
}

export async function getResults(sessionId: string): Promise<SessionResults> {
  try {
    const res = await api.get<SessionResults>(API_SESSION_RESULTS(sessionId));
    return res.data;
  } catch (err) {
    console.warn('Backend results fetch failed, throwing error:', err);
    throw err;
  }
}

export interface ScorePayload {
  answer: string;
  explanation: string;
  full_explanation: string[];
  questions: string[];
  difficulty: string[];
  current_difficulty: string;
  previous_question: string;
}

export interface ScoreResponse {
  current_result: number;
  next_question: string;
  next_explanation: string;
  difficulty: string;
  questions: string[];
  explanation: string[];
  difficulty_list: string[];
}

export async function scoreAnswer(payload: ScorePayload): Promise<ScoreResponse> {
  let token = typeof window !== 'undefined' ? localStorage.getItem('si_token') : null;
  if (!token) {
    token = await loginAsTestUser();
  }
  const res = await api.post<ScoreResponse>(API_SCORE, payload);
  return res.data;
}

export async function saveFinalInfo(username: string, score: number, questionLvl: number): Promise<void> {
  let token = typeof window !== 'undefined' ? localStorage.getItem('si_token') : null;
  if (!token) {
    token = await loginAsTestUser();
  }
  await api.post(API_FINAL_INFO, {
    totalinfo: {
      username,
      score,
      question_lvl: questionLvl,
    },
  });
}

export default api;
