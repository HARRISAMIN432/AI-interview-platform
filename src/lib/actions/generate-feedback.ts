"use server";

import prisma from "@/lib/db/prisma";
import {
  generateInterviewFeedback,
  type InterviewFeedbackReport,
  type StructuredAreaToImprove,
  type StructuredStrength,
  type StudyPlanItem,
} from "@/lib/ai/feedback-generator";
import type { Prisma } from "@prisma/client";

export type FeedbackReportPayload = {
  feedback: {
    id: string;
    overallScore: number;
    summary: string;
    communicationScore: number;
    technicalScore: number;
    confidenceScore: number;
    strengths: StructuredStrength[];
    areasToImprove: StructuredAreaToImprove[];
    problemSolvingScore: number;
    studyPlan: StudyPlanItem[];
    interviewReadiness: InterviewFeedbackReport["interviewReadiness"];
    createdAt: Date;
  };
  interview: {
    id: string;
    totalScore: number | null;
    duration: number | null;
    status: string;
    jobDescription: { title: string; company: string } | null;
    resume: { fileName: string } | null;
    questions: Array<{
      id: string;
      orderIndex: number;
      questionText: string;
      questionType: string;
      answer: {
        answerText: string | null;
        score: number | null;
        feedback: string | null;
        strengths: string[];
        improvements: string[];
      } | null;
    }>;
  };
};

type StoredAreasPayload = {
  items: StructuredAreaToImprove[];
  studyPlan: StudyPlanItem[];
  interviewReadiness: InterviewFeedbackReport["interviewReadiness"];
  problemSolvingScore: number;
};

function parseStoredStrengths(value: Prisma.JsonValue | null): StructuredStrength[] {
  if (!value || !Array.isArray(value)) return [];
  return value.filter(
    (item): item is StructuredStrength =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      "description" in item &&
      "example" in item,
  );
}

function parseStoredAreas(value: Prisma.JsonValue | null): StoredAreasPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      items: [],
      studyPlan: [],
      interviewReadiness: "needs-preparation",
      problemSolvingScore: 0,
    };
  }
  const obj = value as Record<string, unknown>;
  const items = Array.isArray(obj.items)
    ? (obj.items as StructuredAreaToImprove[])
    : [];
  const studyPlan = Array.isArray(obj.studyPlan)
    ? (obj.studyPlan as StudyPlanItem[])
    : [];
  const interviewReadiness =
    obj.interviewReadiness === "ready" ||
    obj.interviewReadiness === "almost-ready" ||
    obj.interviewReadiness === "needs-preparation"
      ? obj.interviewReadiness
      : "needs-preparation";
  const problemSolvingScore =
    typeof obj.problemSolvingScore === "number" ? obj.problemSolvingScore : 0;

  return { items, studyPlan, interviewReadiness, problemSolvingScore };
}

export async function generateFeedbackForInterview(
  interviewId: string,
  clerkUserId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId: user.id, status: "COMPLETED" },
    select: { id: true },
  });
  if (!interview) {
    return {
      success: false,
      error: "Interview not found, access denied, or not completed",
    };
  }

  try {
    const report = await generateInterviewFeedback(interviewId);

    const areasPayload: StoredAreasPayload = {
      items: report.areasToImprove,
      studyPlan: report.studyPlan,
      interviewReadiness: report.interviewReadiness,
      problemSolvingScore: report.problemSolvingScore,
    };

    await prisma.feedback.upsert({
      where: { interviewId },
      create: {
        interviewId,
        overallScore: report.overallScore,
        summary: report.executiveSummary,
        communicationScore: report.communicationScore,
        technicalScore: report.technicalScore,
        confidenceScore: report.confidenceScore,
        strengths: report.strengths,
        areasToImprove: areasPayload,
      },
      update: {
        overallScore: report.overallScore,
        summary: report.executiveSummary,
        communicationScore: report.communicationScore,
        technicalScore: report.technicalScore,
        confidenceScore: report.confidenceScore,
        strengths: report.strengths,
        areasToImprove: areasPayload,
      },
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generateFeedbackForInterview]", message);
    return { success: false, error: message };
  }
}

export async function getFeedbackReport(
  interviewId: string,
  clerkUserId: string,
): Promise<FeedbackReportPayload | null> {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) return null;

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId: user.id },
    include: {
      feedback: true,
      jobDescription: { select: { title: true, company: true } },
      resume: { select: { fileName: true } },
      questions: {
        include: {
          answer: {
            select: {
              answerText: true,
              score: true,
              feedback: true,
              strengths: true,
              improvements: true,
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!interview?.feedback) return null;

  const areas = parseStoredAreas(interview.feedback.areasToImprove);
  const strengths = parseStoredStrengths(interview.feedback.strengths);

  return {
    feedback: {
      id: interview.feedback.id,
      overallScore: interview.feedback.overallScore,
      summary: interview.feedback.summary,
      communicationScore: interview.feedback.communicationScore,
      technicalScore: interview.feedback.technicalScore,
      confidenceScore: interview.feedback.confidenceScore,
      strengths,
      areasToImprove: areas.items,
      problemSolvingScore: areas.problemSolvingScore,
      studyPlan: areas.studyPlan,
      interviewReadiness: areas.interviewReadiness,
      createdAt: interview.feedback.createdAt,
    },
    interview: {
      id: interview.id,
      totalScore: interview.totalScore,
      duration: interview.duration,
      status: interview.status,
      jobDescription: interview.jobDescription,
      resume: interview.resume,
      questions: interview.questions.map((q) => ({
        id: q.id,
        orderIndex: q.orderIndex,
        questionText: q.questionText,
        questionType: q.questionType,
        answer: q.answer,
      })),
    },
  };
}
