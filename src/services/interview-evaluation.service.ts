import prisma from "@/lib/db/prisma";
import { evaluateAnswer, evaluateOverallFeedback } from "@/lib/evaluation";
import {
  buildSkippedAnswerEvaluation,
  isSkippedAnswer,
} from "@/lib/prompts/answer-evaluation";
import type { AnswerEvaluationResult } from "@/lib/validators/evaluation";
import type { OverallFeedbackResult } from "@/lib/validators/evaluation";
import type { Feedback, InterviewQuestion } from "@prisma/client";

type QuestionWithAnswer = InterviewQuestion & {
  answer: {
    id: string;
    answerText: string | null;
    score: number | null;
  } | null;
};

export interface EvaluatedQuestion {
  questionId: string;
  orderIndex: number;
  questionType: InterviewQuestion["questionType"];
  questionText: string;
  answerText: string;
  evaluation: AnswerEvaluationResult;
}

export interface InterviewEvaluationResult {
  evaluatedQuestions: EvaluatedQuestion[];
  overallFeedback: OverallFeedbackResult;
  averageAnswerScore: number;
}

const EVALUATION_CONCURRENCY = 3;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Runs AI evaluation for every interview question and persists scores on InterviewAnswer.
 * Does not create Feedback or update Interview status — callers handle that.
 */
export async function evaluateInterviewAnswers(
  interviewId: string,
  clerkUserId: string,
): Promise<InterviewEvaluationResult> {
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      user: { clerkId: clerkUserId },
    },
    include: {
      jobDescription: {
        select: { title: true, company: true },
      },
      questions: {
        include: {
          answer: {
            select: { id: true, answerText: true, score: true },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!interview) {
    throw new Error("Interview not found or access denied");
  }

  const jobTitle = interview.jobDescription?.title ?? "Role";
  const jobCompany = interview.jobDescription?.company ?? "";

  const evaluatedQuestions = await mapWithConcurrency(
    interview.questions as QuestionWithAnswer[],
    EVALUATION_CONCURRENCY,
    async (question) => {
      const rawAnswer = question.answer?.answerText ?? "";
      let evaluation: AnswerEvaluationResult;

      if (isSkippedAnswer(rawAnswer) || !rawAnswer.trim()) {
        evaluation = buildSkippedAnswerEvaluation();
      } else {
        try {
          evaluation = await evaluateAnswer({
            questionText: question.questionText,
            questionType: question.questionType,
            answerText: rawAnswer,
            jobTitle,
            jobCompany,
          });
        } catch (err) {
          console.error(
            `[evaluateInterviewAnswers] Question ${question.id} evaluation failed:`,
            err,
          );
          evaluation = {
            score: 50,
            feedback:
              "Your answer was saved, but automated scoring could not complete for this question. Review it manually and try again in a future session.",
            strengths: ["Answer submitted and recorded"],
            improvements: [
              "Retry this question with a structured, specific response",
            ],
          };
        }
      }

      await prisma.interviewAnswer.upsert({
        where: { questionId: question.id },
        create: {
          questionId: question.id,
          answerText: rawAnswer || null,
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        },
        update: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        },
      });

      return {
        questionId: question.id,
        orderIndex: question.orderIndex,
        questionType: question.questionType,
        questionText: question.questionText,
        answerText: rawAnswer || "(no answer)",
        evaluation,
      };
    },
  );

  const averageAnswerScore =
    evaluatedQuestions.length > 0
      ? evaluatedQuestions.reduce((sum, q) => sum + q.evaluation.score, 0) /
        evaluatedQuestions.length
      : 0;

  const overallFeedback = await evaluateOverallFeedback({
    jobTitle,
    jobCompany,
    questionSummaries: evaluatedQuestions.map((q) => ({
      orderIndex: q.orderIndex,
      questionType: q.questionType,
      questionText: q.questionText,
      answerText: q.answerText,
      score: q.evaluation.score,
      feedback: q.evaluation.feedback,
    })),
  });

  return {
    evaluatedQuestions,
    overallFeedback,
    averageAnswerScore,
  };
}

export async function persistInterviewFeedback(
  interviewId: string,
  overallFeedback: OverallFeedbackResult,
): Promise<Feedback> {
  return prisma.feedback.upsert({
    where: { interviewId },
    create: {
      interviewId,
      overallScore: overallFeedback.overallScore,
      summary: overallFeedback.summary,
      strengths: overallFeedback.strengths,
      areasToImprove: overallFeedback.areasToImprove,
      communicationScore: overallFeedback.communicationScore,
      technicalScore: overallFeedback.technicalScore,
      confidenceScore: overallFeedback.confidenceScore,
    },
    update: {
      overallScore: overallFeedback.overallScore,
      summary: overallFeedback.summary,
      strengths: overallFeedback.strengths,
      areasToImprove: overallFeedback.areasToImprove,
      communicationScore: overallFeedback.communicationScore,
      technicalScore: overallFeedback.technicalScore,
      confidenceScore: overallFeedback.confidenceScore,
    },
  });
}
