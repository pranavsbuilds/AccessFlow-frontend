import axios from 'axios';
import {
  API_SESSION_START,
  API_SESSION_FLAG,
  API_SESSION_RESULTS,
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

export interface StartSessionResult {
  sid: string;
  questions: string[];
  explanations: string[];
}

export async function startSession(
  topic: Topic,
  difficulty: Difficulty
): Promise<StartSessionResult> {
  const payload: StartSessionRequest = {
    uid: getAnonymousUid(),
    job: topic,
    level: difficulty,
  };

  const res = await api.post<StartSessionResponse>(API_SESSION_START, payload);

  return {
    sid: res.data.sid,
    questions: res.data.questions ?? [],
    // backend field is "explanation" (singular) per backend_v1 spec
    explanations: res.data.explanation ?? [],
  };
}

export async function flagSession(sessionId: string): Promise<void> {
  await api.post(API_SESSION_FLAG(sessionId));
}

export async function getResults(sessionId: string): Promise<SessionResults> {
  const res = await api.get<SessionResults>(API_SESSION_RESULTS(sessionId));
  return res.data;
}

export default api;
