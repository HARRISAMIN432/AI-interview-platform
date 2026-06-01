import { z } from "zod";
import { getEvaluationModel } from "@/lib/ai/gemini";
import prisma from "@/lib/db/prisma";

const StudyResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

const StudyPlanItemSchema = z.object({
  topic: z.string(),
  resources: z.array(StudyResourceSchema).min(1).max(5),
  priority: z.enum(["high", "medium", "low"]),
});

const StrengthItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  example: z.string(),
});

const AreaToImproveItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  actionPlan: z.string(),
});

export const InterviewFeedbackReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  executiveSummary: z.string().min(20),
  communicationScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  problemSolvingScore: z.number().min(0).max(100),
  strengths: z.array(StrengthItemSchema).min(1).max(6),
  areasToImprove: z.array(AreaToImproveItemSchema).min(1).max(6),
  studyPlan: z.array(StudyPlanItemSchema).min(1).max(8),
  interviewReadiness: z.enum([
    "ready",
    "almost-ready",
    "needs-preparation",
  ]),
});

export type InterviewFeedbackReport = z.infer<
  typeof InterviewFeedbackReportSchema
>;

export type StructuredStrength = z.infer<typeof StrengthItemSchema>;
export type StructuredAreaToImprove = z.infer<typeof AreaToImproveItemSchema>;
export type StudyPlanItem = z.infer<typeof StudyPlanItemSchema>;

export interface FeedbackReportExtras {
  problemSolvingScore: number;
  studyPlan: StudyPlanItem[];
  interviewReadiness: InterviewFeedbackReport["interviewReadiness"];
}

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function generateInterviewFeedback(
  interviewId: string,
): Promise<InterviewFeedbackReport> {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      jobDescription: {
        select: { title: true, company: true, description: true },
      },
      resume: { select: { fileName: true, parsedText: true } },
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
      feedback: true,
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  const questionBlocks = interview.questions
    .map((q, i) => {
      const answer = q.answer;
      return [
        `### Question ${i + 1} (${q.questionType})`,
        q.questionText.slice(0, 600),
        `Answer: ${answer?.answerText?.slice(0, 800) ?? "(no answer)"}`,
        `Score: ${answer?.score ?? "N/A"}`,
        answer?.feedback ? `Evaluator note: ${answer.feedback.slice(0, 400)}` : "",
      ].join("\n");
    })
    .join("\n\n");

  const resumeSnippet = interview.resume?.parsedText?.slice(0, 2000) ?? "";
  const jdSnippet = interview.jobDescription?.description?.slice(0, 1500) ?? "";

  const prompt = `You are a senior interview coach producing a comprehensive post-interview feedback report.

Return ONLY valid JSON matching the schema below. No markdown fences.

## ROLE
${interview.jobDescription?.title ?? "Role"} at ${interview.jobDescription?.company ?? "Company"}

## JOB DESCRIPTION (excerpt)
${jdSnippet}

## RESUME CONTEXT (excerpt)
${resumeSnippet}

## INTERVIEW Q&A WITH SCORES
${questionBlocks}

## INSTRUCTIONS
Synthesize holistic feedback from all answers. Scores are 0-100 integers.
**strengths**: 3-5 items with title, description, and a concrete example from their answers.
**areasToImprove**: 3-5 items with title, description, and a specific actionPlan.
**studyPlan**: 4-6 topics with priority (high/medium/low) and 1-3 real resource URLs (documentation, courses, articles).
**interviewReadiness**: "ready" | "almost-ready" | "needs-preparation"

## REQUIRED JSON
{
  "overallScore": <integer 0-100>,
  "executiveSummary": "<string>",
  "communicationScore": <integer 0-100>,
  "technicalScore": <integer 0-100>,
  "confidenceScore": <integer 0-100>,
  "problemSolvingScore": <integer 0-100>,
  "strengths": [{"title":"","description":"","example":""}],
  "areasToImprove": [{"title":"","description":"","actionPlan":""}],
  "studyPlan": [{"topic":"","resources":[{"title":"","url":""}],"priority":"high|medium|low"}],
  "interviewReadiness": "ready|almost-ready|needs-preparation"
}`;

  const model = getEvaluationModel();

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[FeedbackGenerator] Gemini API call failed: ${message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(rawText));
  } catch {
    throw new Error(
      `[FeedbackGenerator] Failed to parse JSON. Raw: ${rawText.slice(0, 200)}`,
    );
  }

  const validated = InterviewFeedbackReportSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `[FeedbackGenerator] Schema validation failed: ${JSON.stringify(
        validated.error.flatten().fieldErrors,
      )}`,
    );
  }

  return validated.data;
}
