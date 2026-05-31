import type { InterviewConfig } from "@/types/interview";

export function buildQuestionGenerationPrompt(config: InterviewConfig): string {
  const typeInstructions = {
    TECHNICAL:
      "All questions must be technical — focus on skills, systems, code, architecture, and domain knowledge directly relevant to the role.",
    BEHAVIORAL:
      "All questions must be behavioral — use STAR-method prompts about past experiences, teamwork, conflict, and leadership.",
    MIXED:
      "Mix question types: roughly 50% technical (skills, architecture, domain knowledge) and 50% behavioral (STAR-method, experiences, soft skills). Distribute them naturally.",
  };

  const difficultyInstructions = {
    JUNIOR:
      "Questions should target 0–2 years experience. Focus on fundamentals, learning mindset, and basic application of skills.",
    MID: "Questions should target 3–5 years experience. Focus on applying skills independently, owning deliverables, and handling complexity.",
    SENIOR:
      "Questions should target 6+ years experience. Focus on system design, leadership, trade-offs, mentoring, and cross-functional impact.",
  };

  const focusSection =
    config.focusAreas.length > 0
      ? `\nFOCUS AREAS (prioritize questions on these topics): ${config.focusAreas.join(", ")}`
      : "";

  const trimmedResume = config.resumeText.slice(0, 4000);
  const trimmedJD = config.jobDescription.slice(0, 1500);
  const trimmedReqs = config.jobRequirements.join("\n").slice(0, 800);

  return `You are an expert technical interviewer at a top-tier company. Generate exactly ${config.questionCount} interview questions tailored to the candidate's resume and the job description.

## INTERVIEW CONFIGURATION
Type: ${config.interviewType} — ${typeInstructions[config.interviewType]}
Difficulty: ${config.difficulty} — ${difficultyInstructions[config.difficulty]}
Question count: ${config.questionCount}${focusSection}

## JOB
Title: ${config.jobTitle}
Company: ${config.jobCompany}
Description: ${trimmedJD}
Requirements: ${trimmedReqs}

## CANDIDATE RESUME
${trimmedResume}

## INSTRUCTIONS
- Questions must be specific to THIS candidate and THIS role — reference actual skills, experiences, or projects from the resume
- Each question should be genuinely challenging at the ${config.difficulty} level
- Behavioral questions must start with "Tell me about a time..." or "Describe a situation where..." or similar STAR prompts
- Technical questions must be precise — no vague "tell me about X" for technical topics
- followUpHint: a brief note the interviewer could use to dig deeper (not shown to candidate)
- expectedTopics: 2-4 keywords/topics a strong answer would cover

## REQUIRED JSON OUTPUT
Return ONLY a JSON array of exactly ${config.questionCount} objects. No preamble, no markdown fences, no extra text.

[
  {
    "questionText": "<full question text>",
    "questionType": "TECHNICAL" | "BEHAVIORAL" | "SITUATIONAL",
    "expectedTopics": ["<topic1>", "<topic2>"],
    "followUpHint": "<brief interviewer hint>"
  }
]`;
}
