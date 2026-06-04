import type { QuestionType } from "@prisma/client";

export interface AnswerEvaluationPromptInput {
  questionText: string;
  questionType: QuestionType;
  answerText: string;
  jobTitle: string;
  jobCompany: string;
}

export interface OverallFeedbackPromptInput {
  jobTitle: string;
  jobCompany: string;
  questionSummaries: Array<{
    orderIndex: number;
    questionType: QuestionType;
    questionText: string;
    answerText: string;
    score: number;
    feedback: string;
  }>;
}

const SKIPPED_ANSWER = "[Skipped]";

export function isSkippedAnswer(answerText: string | null | undefined): boolean {
  if (!answerText?.trim()) return true;
  return answerText.trim() === SKIPPED_ANSWER;
}

export function buildAnswerEvaluationPrompt(
  input: AnswerEvaluationPromptInput,
): string {
  const trimmedQuestion = input.questionText.slice(0, 1200);
  const trimmedAnswer = input.answerText.slice(0, 4000);

  return `You are an expert technical interviewer and career coach. Evaluate the candidate's answer to a mock interview question.

Return ONLY valid JSON matching the schema below. No markdown fences or extra text.

## ROLE CONTEXT
Position: ${input.jobTitle}
Company: ${input.jobCompany}

## QUESTION (${input.questionType})
${trimmedQuestion}

## CANDIDATE ANSWER
${trimmedAnswer}

## SCORING RUBRIC (score 0-100)
- 85-100: Excellent — complete, structured, specific examples, directly addresses the question
- 70-84: Good — solid answer with minor gaps or missing depth
- 50-69: Fair — partial answer, vague, or missing key points
- 30-49: Weak — superficial, off-topic, or very brief
- 0-29: Poor — incorrect, irrelevant, or essentially no substance

Consider question type:
- TECHNICAL: accuracy, depth, problem-solving approach, trade-offs
- BEHAVIORAL: STAR structure, specific examples, reflection, outcomes
- SITUATIONAL: judgment, reasoning, stakeholder awareness, actionable plan

**feedback**: 2-4 sentences of constructive, specific feedback. Be direct but encouraging.
**strengths**: JSON array of 2-4 plain strings ONLY (not objects). Example: ["Used a clear STAR structure", "Gave a concrete metric"]
**improvements**: JSON array of 2-4 plain strings ONLY (not objects). Example: ["Add more technical depth", "Quantify the business impact"]

## REQUIRED JSON (strengths and improvements must be string arrays, never objects)
{
  "score": <integer 0-100>,
  "feedback": "<string>",
  "strengths": ["<plain string>", "<plain string>"],
  "improvements": ["<plain string>", "<plain string>"]
}`;
}

export function buildOverallFeedbackPrompt(
  input: OverallFeedbackPromptInput,
): string {
  const summaries = input.questionSummaries
    .map(
      (q) =>
        `Q${q.orderIndex + 1} [${q.questionType}] (score: ${q.score})\n` +
        `Question: ${q.questionText.slice(0, 300)}\n` +
        `Answer: ${q.answerText.slice(0, 500)}\n` +
        `Evaluator note: ${q.feedback.slice(0, 300)}`,
    )
    .join("\n\n");

  return `You are a senior interview coach synthesizing feedback from a completed mock interview.

Return ONLY valid JSON. No markdown fences or extra text.

## ROLE
${input.jobTitle} at ${input.jobCompany}

## PER-QUESTION RESULTS
${summaries}

## YOUR TASK
Produce holistic interview feedback based on all answers above.

**overallScore** (0-100): Weighted average reflecting interview performance. Skipped or empty answers should lower the score appropriately.

**summary**: 3-5 sentences summarizing overall performance, readiness for the role, and the single most important focus area.

**strengths**: JSON array of 3-6 plain strings ONLY (not objects).

**areasToImprove**: JSON array of 3-6 plain strings ONLY (not objects).

**communicationScore** (0-100): Clarity, structure, concision, professionalism of responses.

**technicalScore** (0-100): Domain knowledge, accuracy, depth (for behavioral-heavy interviews, score judgment and frameworks instead).

**confidenceScore** (0-100): Assertiveness, composure signals, decisiveness — inferred from answer tone and completeness.

## REQUIRED JSON
{
  "overallScore": <integer 0-100>,
  "summary": "<string>",
  "strengths": ["<string>", ...],
  "areasToImprove": ["<string>", ...],
  "communicationScore": <integer 0-100>,
  "technicalScore": <integer 0-100>,
  "confidenceScore": <integer 0-100>
}`;
}

export function buildSkippedAnswerEvaluation(): {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
} {
  return {
    score: 0,
    feedback:
      "This question was skipped. Practice answering every question — even a brief structured response is better than skipping.",
    strengths: ["You completed the rest of the interview session"],
    improvements: [
      "Attempt every question, even if unsure — outline your thinking process",
      "Use the STAR method for behavioral questions",
      "Ask for clarification if a question is ambiguous",
    ],
  };
}
