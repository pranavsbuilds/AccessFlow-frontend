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
  InterviewPhase,
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
      explanations: [],
      responses: [],
      cheatingCount: 0,
      sessionPenalty: 0,

      interviewPhase: 'idle',

      remainingQuestions: [],
      remainingExplanations: [],
      remainingDifficulties: [],
      currentDifficulty: null,

      setQuestionsAndExplanations: (questions: string[], explanations: string[]) =>
        set({ questions, explanations }),

      setQuestionPool: (questions: string[], explanations: string[], difficulties: string[], initialDifficulty: string) => {
        let firstIndex = difficulties.findIndex(d => d.toUpperCase() === initialDifficulty.toUpperCase());
        if (firstIndex === -1) firstIndex = 0;

        const firstQ = questions[firstIndex] ?? '';
        const firstE = explanations[firstIndex] ?? '';
        const firstD = difficulties[firstIndex] ?? initialDifficulty;

        const remQ = [...questions];
        const remE = [...explanations];
        const remD = [...difficulties];

        if (firstIndex >= 0 && firstIndex < remQ.length) {
          remQ.splice(firstIndex, 1);
          remE.splice(firstIndex, 1);
          remD.splice(firstIndex, 1);
        }

        set({
          questions: [firstQ],
          explanations: [firstE],
          currentDifficulty: firstD,
          remainingQuestions: remQ,
          remainingExplanations: remE,
          remainingDifficulties: remD,
          currentQuestionIndex: 0,
        });
      },

      updateQuestionPool: (nextQuestion: string, nextExplanation: string, nextDifficulty: string, remainingQ: string[], remainingE: string[], remainingD: string[]) => {
        set((state) => {
          const updatedQuestions = [...state.questions];
          const updatedExplanations = [...state.explanations];
          updatedQuestions[state.currentQuestionIndex + 1] = nextQuestion;
          updatedExplanations[state.currentQuestionIndex + 1] = nextExplanation;

          return {
            questions: updatedQuestions,
            explanations: updatedExplanations,
            currentDifficulty: nextDifficulty,
            remainingQuestions: remainingQ,
            remainingExplanations: remainingE,
            remainingDifficulties: remainingD,
          };
        });
      },

      setPhase: (phase: InterviewPhase) => set({ interviewPhase: phase }),

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
          explanations: [],
          responses: [],
          cheatingCount: 0,
          sessionPenalty: 0,
          interviewPhase: 'idle',
          finalScore: null,
          clusterLabel: null,
          remainingQuestions: [],
          remainingExplanations: [],
          remainingDifficulties: [],
          currentDifficulty: null,
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
        explanations: state.explanations,
        responses: state.responses,
        cheatingCount: state.cheatingCount,
        sessionPenalty: state.sessionPenalty,
        finalScore: state.finalScore,
        clusterLabel: state.clusterLabel,
        remainingQuestions: state.remainingQuestions,
        remainingExplanations: state.remainingExplanations,
        remainingDifficulties: state.remainingDifficulties,
        currentDifficulty: state.currentDifficulty,
        // interviewPhase intentionally NOT persisted — always start idle
      }),
    }
  )
);
