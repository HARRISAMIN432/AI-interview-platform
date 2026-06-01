"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { UserAnalytics } from "@/lib/actions/analytics";

interface SkillRadarProps {
  current: UserAnalytics["currentPeriodSkills"];
  previous: UserAnalytics["previousPeriodSkills"];
}

export function SkillRadar({ current, previous }: SkillRadarProps) {
  const hasData = Object.values(current).some((v) => v > 0);

  if (!hasData) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <p className="text-sm" style={{ color: "#4a6a7a" }}>
          Complete interviews with feedback to compare skill averages.
        </p>
      </div>
    );
  }

  const data = [
    { skill: "Communication", current: current.communication, previous: previous.communication },
    { skill: "Technical", current: current.technical, previous: previous.technical },
    { skill: "Confidence", current: current.confidence, previous: previous.confidence },
    { skill: "Problem Solving", current: current.problemSolving, previous: previous.problemSolving },
    { skill: "Structure", current: current.structure, previous: previous.structure },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
        style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
      >
        Skill Comparison (30-day vs prior 30-day)
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#152636" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "#7a9aaa", fontSize: 11 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#3d6070", fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#00e5a0"
            fill="#00e5a0"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Previous"
            dataKey="previous"
            stroke="#7a9aaa"
            fill="#7a9aaa"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#7a9aaa" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
