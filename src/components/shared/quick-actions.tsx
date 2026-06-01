import Link from "next/link";
import { FileText, Video, BarChart2, CheckCircle2, AlertCircle } from "lucide-react";

interface QuickActionsProps {
  hasResume: boolean;
  hasParsedResume: boolean;
  hasJobDescription: boolean;
}

export function QuickActions({
  hasResume,
  hasParsedResume,
  hasJobDescription,
}: QuickActionsProps) {
  const actions = [
    {
      label: "Upload Resume",
      description: hasParsedResume
        ? "Resume ready for ATS & interviews"
        : hasResume
          ? "Parse your resume to unlock scoring"
          : "Upload a PDF to get started",
      href: "/resume",
      icon: FileText,
      complete: hasParsedResume,
    },
    {
      label: "Start Mock Interview",
      description:
        hasParsedResume && hasJobDescription
          ? "Practice with AI-tailored questions"
          : "Needs a parsed resume and a saved job",
      href: "/interview/new",
      icon: Video,
      complete: hasParsedResume && hasJobDescription,
    },
    {
      label: "View Analytics",
      description: "Track scores and improvement trends",
      href: "/analytics",
      icon: BarChart2,
      complete: hasResume,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map(({ label, description, href, icon: Icon, complete }) => (
        <Link
          key={href}
          href={href}
          className="group rounded-2xl p-5 transition-all hover:border-[rgba(0,229,160,0.25)]"
          style={{
            background: "#0c1a27",
            border: "1px solid #152636",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 40,
                height: 40,
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.12)",
              }}
            >
              <Icon size={18} color="#00e5a0" strokeWidth={1.8} />
            </div>
            {complete ? (
              <CheckCircle2 size={16} color="#00e5a0" />
            ) : (
              <AlertCircle size={16} color="#f59e0b" />
            )}
          </div>
          <p
            className="text-sm font-bold mb-1 group-hover:text-[#dff0ea] transition-colors"
            style={{ color: "#b0ccd8", fontFamily: "var(--font-syne)" }}
          >
            {label}
          </p>
          <p className="text-xs" style={{ color: "#4a6a7a", lineHeight: 1.5 }}>
            {description}
          </p>
        </Link>
      ))}
    </div>
  );
}
