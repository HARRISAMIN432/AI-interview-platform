import type { StudyPlanItem } from "@/lib/ai/feedback-generator";
import { ExternalLink } from "lucide-react";

const PRIORITY_STYLES = {
  high: {
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    color: "#f87171",
    label: "High",
  },
  medium: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    color: "#f59e0b",
    label: "Medium",
  },
  low: {
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.2)",
    color: "#00e5a0",
    label: "Low",
  },
};

interface StudyPlanProps {
  items: StudyPlanItem[];
}

export function StudyPlan({ items }: StudyPlanProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#4a6a7a" }}>
        No study plan items available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const priority = PRIORITY_STYLES[item.priority];
        return (
          <div
            key={item.topic}
            className="rounded-xl p-4"
            style={{ background: "#0e1e2d", border: "1px solid #1a3048" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p
                className="text-sm font-semibold"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                {item.topic}
              </p>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: priority.bg,
                  border: `1px solid ${priority.border}`,
                  color: priority.color,
                }}
              >
                {priority.label}
              </span>
            </div>
            <ul className="space-y-2">
              {item.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[#00e5a0]"
                    style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
                  >
                    <ExternalLink size={12} />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
