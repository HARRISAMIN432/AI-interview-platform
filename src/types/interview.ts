import type { Prisma } from "@prisma/client";

export type InterviewQuestionWithAnswer = Prisma.InterviewQuestionGetPayload<{
  include: { answer: true };
}>;

export type InterviewWithQuestions = Prisma.InterviewGetPayload<{
  include: {
    questions: {
      include: { answer: true };
      orderBy: { orderIndex: "asc" };
    };
    resume: { select: { id: true; fileName: true } };
    jobDescription: { select: { id: true; title: true; company: true } };
  };
}>;

export type SessionStage = "ready" | "answering" | "submitting" | "completed";

export interface SessionAnswer {
  questionId: string;
  answerText: string;
  submittedAt: number;
  elapsedSeconds: number;
}

export interface SessionState {
  stage: SessionStage;
  currentQuestionIndex: number;
  answers: SessionAnswer[];
  totalElapsedSeconds: number;
  questionElapsedSeconds: number;
}

export interface InterviewConfig {
  resumeText: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
  jobRequirements: string[];
  interviewType: "TECHNICAL" | "BEHAVIORAL" | "MIXED";
  difficulty: "JUNIOR" | "MID" | "SENIOR";
  questionCount: 5 | 10 | 15;
  focusAreas: string[];
}

export interface GeneratedQuestion {
  questionText: string;
  questionType: "TECHNICAL" | "BEHAVIORAL" | "SITUATIONAL";
  expectedTopics: string[];
  followUpHint: string;
}
