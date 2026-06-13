'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TOTAL_QUESTIONS, CHEAT_PENALTY } from '@/lib/constants';
import type {
  InterviewStore,
  Topic,
  Difficulty,
  QuestionResponse,
  ClusterLabel,
} from '@/types';

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      selectedTopic: null,
      selectedDifficulty: null,
      setTopic: (topic: Topic) => set({ selectedTopic: topic }),
      setDifficulty: (d: Difficulty) => set({ selectedDifficulty: d }),

      sessionId: null,
      setSessionId: (sid: string) => set({ sessionId: sid }),

      currentQuestionIndex: 0,
      totalQuestions: TOTAL_QUESTIONS,
      questions: [],
      responses: [],
      cheatingCount: 0,
      sessionPenalty: 0,

      addResponse: (response: QuestionResponse) =>
        set((state) => ({
          responses: [...state.responses, response],
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),

      incrementCheating: () =>
        set((state) => ({
          cheatingCount: state.cheatingCount + 1,
          sessionPenalty: state.sessionPenalty - CHEAT_PENALTY,
        })),

      finalScore: null,
      clusterLabel: null,
      setResults: (score: number, cluster: ClusterLabel) =>
        set({ finalScore: score, clusterLabel: cluster }),

      resetSession: () =>
        set({
          selectedTopic: null,
          selectedDifficulty: null,
          sessionId: null,
          currentQuestionIndex: 0,
          totalQuestions: TOTAL_QUESTIONS,
          questions: [],
          responses: [],
          cheatingCount: 0,
          sessionPenalty: 0,
          finalScore: null,
          clusterLabel: null,
        }),
    }),
    {
      name: 'smart-interviewer-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedTopic: state.selectedTopic,
        selectedDifficulty: state.selectedDifficulty,
        sessionId: state.sessionId,
        currentQuestionIndex: state.currentQuestionIndex,
        totalQuestions: state.totalQuestions,
        questions: state.questions,
        responses: state.responses,
        cheatingCount: state.cheatingCount,
        sessionPenalty: state.sessionPenalty,
        finalScore: state.finalScore,
        clusterLabel: state.clusterLabel,
      }),
    }
  )
);
