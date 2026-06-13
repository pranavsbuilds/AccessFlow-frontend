'use client';

import { startSession, flagSession, getResults } from '@/lib/api';
import type { Difficulty, SessionResults, Topic } from '@/types';

/**
 * useSession — thin wrapper around the REST API calls.
 * Components import this, not lib/api.ts directly.
 */
export function useSession() {
  const start = async (
    topic: Topic,
    difficulty: Difficulty
  ): Promise<string> => {
    return startSession(topic, difficulty);
  };

  const flag = async (sessionId: string): Promise<void> => {
    return flagSession(sessionId);
  };

  const results = async (sessionId: string): Promise<SessionResults> => {
    return getResults(sessionId);
  };

  return {
    startSession: start,
    flagSession: flag,
    getResults: results,
  };
}
