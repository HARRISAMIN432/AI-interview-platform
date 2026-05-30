export function buildAtsScoringPrompt(
  resumeText: string,
  jobTitle: string,
  jobCompany: string,
  jobDescription: string,
  jobRequirements: string,
): string {
  // Trim inputs to prevent token overflow while keeping the most important content
  const trimmedResume = resumeText.slice(0, 6000);
  const trimmedJD = jobDescription.slice(0, 2000);
  const trimmedReqs = jobRequirements.slice(0, 1500);

  return `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Your task is to evaluate how well a candidate's resume matches a specific job description.

Analyze the resume against the job description and return a JSON object. Do not include any text outside the JSON.

## JOB DETAILS
Title: ${jobTitle}
Company: ${jobCompany}

## JOB DESCRIPTION
${trimmedJD}

## JOB REQUIREMENTS
${trimmedReqs}

## CANDIDATE RESUME
${trimmedResume}

## SCORING RUBRICS

**overallScore** (0-100): Weighted composite. Formula: (keywordScore * 0.40) + (experienceScore * 0.35) + (formatScore * 0.25). Round to nearest integer.

**keywordScore** (0-100): Percentage of important job keywords/skills found in the resume. Count matches across skills, technologies, certifications, methodologies. 100 = all critical keywords present.

**experienceScore** (0-100): How well the candidate's experience level and domain matches the role. Consider years of experience, seniority signals, relevant projects, industry fit. 100 = perfect match.

**formatScore** (0-100): Resume structure quality for ATS parsing. Penalize: missing contact info, no clear sections (Experience/Education/Skills), excessive graphics/tables (unreadable by ATS), inconsistent date formats, very long or very short resumes. 100 = clean, well-structured, ATS-friendly.

**matchedKeywords**: Array of specific keywords/skills/technologies from the JD that appear in the resume. Be specific (e.g. "React", "PostgreSQL", "Agile", "P&L management"). Max 20 items.

**missingKeywords**: Array of important keywords/skills from the JD that are absent in the resume. Focus on the most impactful gaps. Max 15 items.

**suggestions**: Array of 3-8 actionable, specific improvement suggestions. Each suggestion should be concrete (not generic). Examples: "Add a Skills section listing React, TypeScript, and Node.js which appear in the JD but not your resume", "Quantify your achievements — e.g. 'Reduced load time by 40%' instead of 'Improved performance'". Do NOT suggest removing honest experience.

**summary**: 2-3 sentence summary of the resume-to-JD match. Mention the strongest alignment point and the most critical gap. Be direct and useful to the candidate.

## REQUIRED JSON STRUCTURE
{
  "overallScore": <integer 0-100>,
  "keywordScore": <integer 0-100>,
  "formatScore": <integer 0-100>,
  "experienceScore": <integer 0-100>,
  "matchedKeywords": [<string>, ...],
  "missingKeywords": [<string>, ...],
  "suggestions": [<string>, ...],
  "summary": "<string>"
}`;
}
