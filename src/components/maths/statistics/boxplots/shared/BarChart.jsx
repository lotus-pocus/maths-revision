import React from "react";
import { C } from "../data";

const BAR_BANDS = [
  { label: "0-9", count: 0 },
  { label: "10-19", count: 2 },
  { label: "20-29", count: 7 },
  { label: "30-39", count: 7 },
  { label: "40-49", count: 13 },
  { label: "50-59", count: 10 },
  { label: "60-69", count: 15 },
  { label: "70-79", count: 4 },
  { label: "80-89", count: 1 },
  { label: "90-99", count: 1 },
];

export default function BarChart() {
  const W = 520;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 44;

  const plotW = W - padL - padR;
  const plotH = 180;
  const maxCount = Math.max(...BAR_BANDS.map((b) => b.count));
  const barW = plotW / BAR_BANDS.length;

  const toY = (count) => padT + plotH - (count / maxCount) * plotH;
  const yTicks = [0, 3, 6, 9, 12];

  const isKeyBand = (label) => {
    if (label === "30-39") return "q1";
    if (label === "50-59") return "median";
    if (label === "60-69") return "q3";
    return null;
  };

  return (
    <svg viewBox={`0 0 ${W} ${padT + plotH + padB}`} style={{ width: "100%", overflow: "visible" }}>
      {yTicks.map((f) => (
        <line key={f} x1={padL} y1={toY(f)} x2={W - padR} y2={toY(f)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}

      {BAR_BANDS.map((band, i) => {
        const x = padL + i * barW;
        const y = toY(band.count);
        const h = padT + plotH - y;
        const key = isKeyBand(band.label);
        const barColor = key === "median" ? C.text : key ? C.accent : C.accent + "60";

        return (
          <g key={band.label}>
            <rect x={x + 2} y={y} width={barW - 4} height={h} fill={barColor} rx="3" opacity={key ? 1 : 0.5} />

            {band.count > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill={key ? C.accent : C.muted} fontSize="9" fontWeight={key ? "700" : "400"}>
                {band.count}
              </text>
            )}

            <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle" fill={key ? C.accent : C.muted} fontSize="8" fontWeight={key ? "700" : "400"}>
              {band.label}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={C.text} strokeWidth="1.5" />
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={C.text} strokeWidth="1.5" />

      {yTicks.map((f) => (
        <g key={f}>
          <line x1={padL - 4} y1={toY(f)} x2={padL} y2={toY(f)} stroke={C.muted} strokeWidth="1" />
          <text x={padL - 6} y={toY(f) + 4} textAnchor="end" fill={C.muted} fontSize="9">
            {f}
          </text>
        </g>
      ))}

      <text x={padL - 28} y={padT + plotH / 2} textAnchor="middle" fill={C.muted} fontSize="10" transform={`rotate(-90, ${padL - 28}, ${padT + plotH / 2})`}>
        Number of students
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + padB - 4} textAnchor="middle" fill={C.muted} fontSize="10">
        Score range (out of 100)
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + padB - 18} textAnchor="middle" fill={C.accent} fontSize="9" fontWeight="600">
        Darker bars = where Q1, Median and Q3 fall
      </text>
    </svg>
  );
}