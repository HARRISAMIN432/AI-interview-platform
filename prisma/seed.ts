import { PrismaClient, InterviewStatus, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a mock user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      clerkId: "mock_clerk_id_123",
      email: "test@example.com",
      name: "Test User",
      imageUrl: "https://example.com/avatar.png",
    },
  });

  // Create a mock job description
  const job = await prisma.jobDescription.create({
    data: {
      userId: user.id,
      title: "Frontend Engineer",
      company: "Tech Corp",
      description: "Looking for an experienced Frontend Engineer with Next.js and React expertise.",
      requirements: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
  });

  // Create a mock resume
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      fileName: "test_resume.pdf",
      s3Key: "resumes/test_resume.pdf",
      s3Url: "https://s3.example.com/resumes/test_resume.pdf",
      parsedText: "Experienced Frontend Engineer skilled in React, Next.js, and TypeScript.",
    },
  });

  // Create ATS Score
  await prisma.aTSScore.create({
    data: {
      resumeId: resume.id,
      jobDescriptionId: job.id,
      overallScore: 85.5,
      keywordScore: 90,
      formatScore: 80,
      experienceScore: 85,
      missingKeywords: ["GraphQL"],
      matchedKeywords: ["React", "Next.js", "TypeScript"],
      suggestions: {
        format: "Good formatting",
        content: "Add more details about GraphQL experience.",
      },
    },
  });

  // Create an Interview
  const interview = await prisma.interview.create({
    data: {
      userId: user.id,
      resumeId: resume.id,
      jobDescriptionId: job.id,
      status: InterviewStatus.COMPLETED,
      totalScore: 88,
      duration: 1200,
    },
  });

  // Create an Interview Question and Answer
  const question = await prisma.interviewQuestion.create({
    data: {
      interviewId: interview.id,
      questionText: "Tell me about a time you optimized a React application.",
      questionType: QuestionType.TECHNICAL,
      orderIndex: 0,
    },
  });

  await prisma.interviewAnswer.create({
    data: {
      questionId: question.id,
      answerText: "I used React.memo and useMemo to prevent unnecessary re-renders in a complex dashboard, improving performance by 30%.",
      score: 9,
      feedback: "Great specific example demonstrating deep understanding of React performance.",
      strengths: ["Clear problem statement", "Specific metrics"],
      improvements: ["Could mention measuring tools like React Profiler"],
    },
  });

  // Create Feedback
  await prisma.feedback.create({
    data: {
      interviewId: interview.id,
      overallScore: 88,
      summary: "Strong candidate with good technical knowledge and clear communication.",
      communicationScore: 90,
      technicalScore: 85,
      confidenceScore: 90,
      strengths: ["Communication", "React expertise"],
      areasToImprove: ["Deeper knowledge of testing"],
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
