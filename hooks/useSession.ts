'use client';

import { startSession as apiStartSession, flagSession, getResults } from '@/lib/api';
import type { Difficulty, SessionResults, Topic } from '@/types';
import type { StartSessionResult } from '@/lib/api';

/**
 * useSession — thin wrapper around the REST API calls.
 * Components import this, not lib/api.ts directly.
 */
export function useSession() {
  const start = async (
    topic: Topic,
    difficulty: Difficulty
  ): Promise<StartSessionResult> => {
    return apiStartSession(topic, difficulty);
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
