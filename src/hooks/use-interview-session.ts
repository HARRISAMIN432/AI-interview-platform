"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import type { SessionState, SessionAnswer } from "@/types/interview";

type SessionAction =
  | { type: "START" }
  | { type: "TICK_TOTAL" }
  | { type: "TICK_QUESTION" }
  | { type: "SUBMIT_ANSWER"; payload: SessionAnswer }
  | { type: "NEXT_QUESTION" }
  | { type: "SET_SUBMITTING" }
  | { type: "COMPLETE" };

function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case "START":
      return { ...state, stage: "answering", questionElapsedSeconds: 0 };

    case "TICK_TOTAL":
      return { ...state, totalElapsedSeconds: state.totalElapsedSeconds + 1 };

    case "TICK_QUESTION":
      return {
        ...state,
        questionElapsedSeconds: state.questionElapsedSeconds + 1,
      };

    case "SET_SUBMITTING":
      return { ...state, stage: "submitting" };

    case "SUBMIT_ANSWER":
      return {
        ...state,
        stage: "submitting",
        answers: [...state.answers, action.payload],
      };

    case "NEXT_QUESTION": {
      const nextIndex = state.currentQuestionIndex + 1;
      return {
        ...state,
        stage: "answering",
        currentQuestionIndex: nextIndex,
        questionElapsedSeconds: 0,
      };
    }

    case "COMPLETE":
      return { ...state, stage: "completed" };

    default:
      return state;
  }
}

const initialState: SessionState = {
  stage: "ready",
  currentQuestionIndex: 0,
  answers: [],
  totalElapsedSeconds: 0,
  questionElapsedSeconds: 0,
};

interface UseInterviewSessionOptions {
  totalQuestions: number;
  onComplete: (answers: SessionAnswer[], totalSeconds: number) => void;
}

export function useInterviewSession({
  totalQuestions,
  onComplete,
}: UseInterviewSessionOptions) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCompletedRef = useRef(false);

  useEffect(() => {
    if (state.stage === "answering" || state.stage === "submitting") {
      totalTimerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TOTAL" });
      }, 1000);
    } else {
      if (totalTimerRef.current) {
        clearInterval(totalTimerRef.current);
        totalTimerRef.current = null;
      }
    }
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [state.stage]);

  useEffect(() => {
    if (state.stage === "answering") {
      questionTimerRef.current = setInterval(() => {
        dispatch({ type: "TICK_QUESTION" });
      }, 1000);
    } else {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    }
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [state.stage]);

  const startSession = useCallback(() => {
    dispatch({ type: "START" });
  }, []);

  const submitAnswer = useCallback(
    async (questionId: string, answerText: string): Promise<void> => {
      const elapsed = state.questionElapsedSeconds;

      dispatch({ type: "SET_SUBMITTING" });

      const answer: SessionAnswer = {
        questionId,
        answerText,
        submittedAt: Date.now(),
        elapsedSeconds: elapsed,
      };

      try {
        await fetch("/api/interview/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, answerText }),
        });
      } catch {
        console.warn(
          "[useInterviewSession] Failed to persist answer:",
          questionId,
        );
      }

      const isLastQuestion = state.currentQuestionIndex === totalQuestions - 1;

      if (isLastQuestion) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          const allAnswers = [...state.answers, answer];
          dispatch({ type: "COMPLETE" });
          onComplete(allAnswers, state.totalElapsedSeconds);
        }
      } else {
        setTimeout(() => {
          dispatch({ type: "SUBMIT_ANSWER", payload: answer });
          dispatch({ type: "NEXT_QUESTION" });
        }, 400);
        dispatch({ type: "SUBMIT_ANSWER", payload: answer });
      }
    },
    [state, totalQuestions, onComplete],
  );

  const skipQuestion = useCallback(
    async (questionId: string): Promise<void> => {
      await submitAnswer(questionId, "[Skipped]");
    },
    [submitAnswer],
  );

  return {
    state,
    startSession,
    submitAnswer,
    skipQuestion,
  };
}

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
