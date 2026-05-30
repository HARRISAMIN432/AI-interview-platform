import { Lightbulb } from "lucide-react";
import type { JsonValue } from "@prisma/client/runtime/library";

interface SuggestionsPanelProps {
  suggestions: JsonValue;
}

function parseSuggestions(raw: JsonValue): string[] {
  if (!raw) return [];
  // suggestions may be string[] stored as Json
  if (Array.isArray(raw)) {
    return raw.filter((s): s is string => typeof s === "string");
  }
  return [];
}

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const items = parseSuggestions(suggestions);

  if (items.length === 0) {
    return (
      <p
        className="text-xs"
        style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
      >
        No suggestions available.
      </p>
    );
  }

  return (
    <ol className="space-y-2.5">
      {items.map((suggestion, i) => (
        <li key={i} className="flex items-start gap-3">
          {/* Number bubble */}
          <span
            className="shrink-0 flex items-center justify-center rounded-lg text-xs font-bold mt-0.5"
            style={{
              width: 22,
              height: 22,
              background: "rgba(0,229,160,0.08)",
              border: "1px solid rgba(0,229,160,0.15)",
              color: "#00e5a0",
              fontFamily: "var(--font-syne)",
              fontSize: 10,
            }}
          >
            {i + 1}
          </span>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#7a9aaa", fontFamily: "var(--font-dm-sans)" }}
          >
            {suggestion}
          </p>
        </li>
      ))}
    </ol>
  );
}
