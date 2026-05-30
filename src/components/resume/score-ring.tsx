interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  /** Show the numeric label inside the ring */
  showLabel?: boolean;
  className?: string;
}

/**
 * Pure SVG circular progress ring for score display.
 * No library dependency — renders server-side safely.
 */
export function ScoreRing({
  score,
  size = 88,
  strokeWidth = 6,
  showLabel = true,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const color =
    clampedScore >= 75 ? "#00e5a0" : clampedScore >= 50 ? "#f59e0b" : "#f87171";

  const trackColor = "rgba(255,255,255,0.06)";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`Score: ${clampedScore}`}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
      {showLabel && (
        <>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            dy="-4"
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: size * 0.22,
              fontWeight: 700,
              fill: color,
            }}
          >
            {clampedScore}
          </text>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            dy={size * 0.14}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: size * 0.1,
              fill: "#4a6a7a",
            }}
          >
            / 100
          </text>
        </>
      )}
    </svg>
  );
}
