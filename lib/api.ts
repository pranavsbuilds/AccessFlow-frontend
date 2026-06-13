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

export async function startSession(
  topic: Topic,
  difficulty: Difficulty
): Promise<string> {
  const payload: StartSessionRequest = {
    uid: getAnonymousUid(),
    job: topic,
    level: difficulty,
  };

  const res = await api.post<StartSessionResponse>(API_SESSION_START, payload);
  return res.data.sid;
}

export async function flagSession(sessionId: string): Promise<void> {
  await api.post(API_SESSION_FLAG(sessionId));
}

export async function getResults(sessionId: string): Promise<SessionResults> {
  const res = await api.get<SessionResults>(API_SESSION_RESULTS(sessionId));
  return res.data;
}

export default api;
