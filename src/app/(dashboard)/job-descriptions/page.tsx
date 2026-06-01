import { redirect } from "next/navigation";

/** Convenience redirect — sidebar legacy path → canonical route */
export default function JobDescriptionsRedirect() {
  redirect("/resume/job-descriptions");
}
