import { Check } from "lucide-react";

interface ProgressTrackerProps {
  totalQuestions: number;
  currentIndex: number;
  answeredCount: number;
}

export function ProgressTracker({
  totalQuestions,
  currentIndex,
  answeredCount,
}: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalQuestions }).map((_, i) => {
        const answered = i < answeredCount;
        const current = i === currentIndex;
        const upcoming = i > currentIndex;

        return (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: current ? 28 : 22,
                height: current ? 28 : 22,
                background: answered
                  ? "#00c98a"
                  : current
                    ? "rgba(0,229,160,0.12)"
                    : "rgba(255,255,255,0.04)",
                border: `2px solid ${
                  answered ? "#00c98a" : current ? "#00e5a0" : "#1a3048"
                }`,
                boxShadow: current ? "0 0 10px rgba(0,229,160,0.4)" : "none",
                flexShrink: 0,
              }}
            >
              {answered ? (
                <Check size={10} color="#050d14" strokeWidth={3} />
              ) : (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: current ? "#00e5a0" : "#2a4050",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            {/* Connector line */}
            {i < totalQuestions - 1 && (
              <div
                className="transition-all duration-500"
                style={{
                  height: 2,
                  width: 16,
                  borderRadius: 1,
                  background: answered ? "#00c98a" : "#152636",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
