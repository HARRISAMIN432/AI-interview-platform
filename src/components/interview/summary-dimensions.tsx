interface DimensionBarProps {
  label: string;
  score: number;
  description: string;
}

function DimensionBar({ label, score, description }: DimensionBarProps) {
  const rounded = Math.round(score);
  const color =
    rounded >= 75 ? "#00e5a0" : rounded >= 50 ? "#f59e0b" : "#f87171";

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "#0e1e2d",
        border: "1px solid #1a3048",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-sm font-semibold"
          style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
        >
          {label}
        </span>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color, fontFamily: "var(--font-syne)" }}
        >
          {rounded}
        </span>
      </div>
      <p
        className="text-xs mb-3"
        style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)", lineHeight: 1.5 }}
      >
        {description}
      </p>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 5, background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${rounded}%`,
            background:
              rounded >= 75
                ? "linear-gradient(90deg, #00c98a, #00e5a0)"
                : rounded >= 50
                  ? "linear-gradient(90deg, #d97706, #f59e0b)"
                  : "linear-gradient(90deg, #dc2626, #f87171)",
          }}
        />
      </div>
    </div>
  );
}

interface SummaryDimensionsProps {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
}

export function SummaryDimensions({
  communicationScore,
  technicalScore,
  confidenceScore,
}: SummaryDimensionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DimensionBar
        label="Communication"
        score={communicationScore}
        description="Clarity, structure, and professionalism of your responses."
      />
      <DimensionBar
        label="Technical"
        score={technicalScore}
        description="Domain knowledge, accuracy, and depth of your answers."
      />
      <DimensionBar
        label="Confidence"
        score={confidenceScore}
        description="Assertiveness and decisiveness inferred from your delivery."
      />
    </div>
  );
}
