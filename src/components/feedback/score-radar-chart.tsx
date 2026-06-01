"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface ScoreRadarChartProps {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  overallScore: number;
}

export function ScoreRadarChart({
  communicationScore,
  technicalScore,
  confidenceScore,
  problemSolvingScore,
  overallScore,
}: ScoreRadarChartProps) {
  const data = [
    { skill: "Communication", score: Math.round(communicationScore) },
    { skill: "Technical", score: Math.round(technicalScore) },
    { skill: "Confidence", score: Math.round(confidenceScore) },
    { skill: "Problem Solving", score: Math.round(problemSolvingScore) },
    { skill: "Overall", score: Math.round(overallScore) },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#0e1e2d", border: "1px solid #1a3048" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
        style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
      >
        Score Profile
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#152636" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#7a9aaa", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#3d6070", fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#00e5a0"
            fill="#00e5a0"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
