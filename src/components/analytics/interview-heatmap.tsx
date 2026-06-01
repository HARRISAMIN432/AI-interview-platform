import type { UserAnalytics } from "@/lib/actions/analytics";

interface InterviewHeatmapProps {
  data: UserAnalytics["heatmapData"];
}

export function InterviewHeatmap({ data }: InterviewHeatmapProps) {
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <p className="text-sm" style={{ color: "#4a6a7a" }}>
          No interview activity yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-4"
        style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
      >
        Interview Frequency
      </p>
      <div className="flex flex-wrap gap-1.5">
        {data.map(({ date, count }) => {
          const intensity = count / maxCount;
          const bg =
            intensity >= 0.75
              ? "rgba(0,229,160,0.45)"
              : intensity >= 0.5
                ? "rgba(0,229,160,0.28)"
                : intensity >= 0.25
                  ? "rgba(0,229,160,0.14)"
                  : "rgba(0,229,160,0.06)";

          return (
            <div
              key={date}
              title={`${date}: ${count} interview${count !== 1 ? "s" : ""}`}
              className="rounded-md flex flex-col items-center justify-center"
              style={{
                width: 44,
                height: 44,
                background: bg,
                border: "1px solid #152636",
              }}
            >
              <span className="text-[9px]" style={{ color: "#3d6070" }}>
                {new Date(date).getDate()}
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: count > 0 ? "#00e5a0" : "#2a4050" }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
