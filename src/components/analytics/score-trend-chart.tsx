"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsInterviewPoint } from "@/lib/actions/analytics";

interface ScoreTrendChartProps {
  data: AnalyticsInterviewPoint[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <p className="text-sm" style={{ color: "#4a6a7a" }}>
          Complete interviews to see your score trend over time.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-4 px-1"
        style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
      >
        Interview Score Trend
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#152636" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#4a6a7a", fontSize: 11 }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis domain={[0, 100]} tick={{ fill: "#4a6a7a", fontSize: 11 }} />
          <ReferenceLine
            y={70}
            stroke="#00e5a0"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: "Target 70",
              position: "insideTopRight",
              fill: "#00e5a0",
              fontSize: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#0e1e2d",
              border: "1px solid #1a3048",
              borderRadius: 8,
              color: "#dff0ea",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}`, "Score"]}
            labelFormatter={(_, payload) => {
              const point = payload?.[0]?.payload as AnalyticsInterviewPoint | undefined;
              if (!point) return "";
              return `${point.jobTitle}${point.company ? ` · ${point.company}` : ""}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="overallScore"
            stroke="#00e5a0"
            strokeWidth={2}
            dot={{ fill: "#00e5a0", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
