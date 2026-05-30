import { FileText } from "lucide-react";

interface EmptyResumesProps {
  /** When true, shows the "no resume selected" variant for the detail panel */
  variant?: "no-resumes" | "no-selection";
}

export function EmptyResumes({ variant = "no-resumes" }: EmptyResumesProps) {
  if (variant === "no-selection") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center">
        <div
          className="flex items-center justify-center rounded-2xl mb-4"
          style={{
            width: 56,
            height: 56,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #152636",
          }}
        >
          <FileText size={22} color="#2a4050" strokeWidth={1.5} />
        </div>
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
        >
          No resume selected
        </p>
        <p
          className="text-xs max-w-[180px]"
          style={{ color: "#2a4050", fontFamily: "var(--font-dm-sans)" }}
        >
          Click a resume on the left to view details and ATS analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{
          width: 56,
          height: 56,
          background: "rgba(0,229,160,0.05)",
          border: "1px solid rgba(0,229,160,0.1)",
        }}
      >
        <FileText size={22} color="#00e5a0" strokeWidth={1.5} />
      </div>
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
      >
        No resumes uploaded yet
      </p>
      <p
        className="text-xs"
        style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
      >
        Upload your first resume above to get started.
      </p>
    </div>
  );
}
