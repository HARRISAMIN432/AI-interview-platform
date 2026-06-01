import { z } from "zod";

export const JobDescriptionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.array(z.string()),
});

export type JobDescriptionFormInput = z.infer<typeof JobDescriptionFormSchema>;

export const ExtractJdSchema = z.object({
  rawText: z.string().min(80, "Paste a longer job description to extract details"),
});

export type ExtractJdInput = z.infer<typeof ExtractJdSchema>;

export const JdMetadataSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional().default(""),
  salaryRange: z.string().optional().default(""),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  experienceLevel: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
});

export type JdMetadata = z.infer<typeof JdMetadataSchema>;
