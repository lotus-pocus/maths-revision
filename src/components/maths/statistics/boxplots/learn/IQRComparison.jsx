import React from "react";
import { C } from "../data";

export default function IQRComparison() {
  const W = 520;
  const padL = 20;
  const padR = 20;
  const plotW = W - padL - padR;
  const toX = (v) => padL + (v / 100) * plotW;
  const rowH = 92;
  const boxH = 28;
  const examples = [
    {
      label: "Class A - IQR = 8",
      q1: 46,
      median: 51,
      q3: 54,
      min: 38,
      max: 63,
      color: C.accent,
    },
    {
      label: "Class B - IQR = 32",
      q1: 30,
      median: 51,
      q3: 62,
      min: 15,
      max: 80,
      color: "#d97706",
    },
  ];
  const svgH = examples.length * rowH + 44;
  return (
    <svg
      viewBox={`0 0 ${W} ${svgH}`}
      style={{ width: "100%", overflow: "visible" }}
    >
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <line
          key={t}
          x1={toX(t)}
          y1={0}
          x2={toX(t)}
          y2={examples.length * rowH}
          stroke={C.border}
          strokeWidth="1"
          strokeDasharray="3,4"
        />
      ))}
      {examples.map((s, si) => {
        const cy = si * rowH + rowH / 2;
        const xMin = toX(s.min);
        const xQ1 = toX(s.q1);
        const xM = toX(s.median);
        const xQ3 = toX(s.q3);
        const xMax = toX(s.max);
        const bTop = cy - boxH / 2;
        const bBot = cy + boxH / 2;
        return (
          <g key={s.label}>
            <text
              x={padL}
              y={bTop - 7}
              fill={s.color}
              fontSize="11"
              fontWeight="700"
            >
              {s.label}
            </text>
            <line
              x1={xMin}
              y1={cy}
              x2={xQ1}
              y2={cy}
              stroke={s.color}
              strokeWidth="2"
            />
            <line
              x1={xMin}
              y1={bTop + 7}
              x2={xMin}
              y2={bBot - 7}
              stroke={s.color}
              strokeWidth="2"
            />
            <line
              x1={xQ3}
              y1={cy}
              x2={xMax}
              y2={cy}
              stroke={s.color}
              strokeWidth="2"
            />
            <line
              x1={xMax}
              y1={bTop + 7}
              x2={xMax}
              y2={bBot - 7}
              stroke={s.color}
              strokeWidth="2"
            />
            <line
              x1={xQ1}
              y1={bTop - 14}
              x2={xQ3}
              y2={bTop - 14}
              stroke={s.color}
              strokeWidth="1.5"
            />
            <line
              x1={xQ1}
              y1={bTop - 18}
              x2={xQ1}
              y2={bTop - 10}
              stroke={s.color}
              strokeWidth="1.5"
            />
            <line
              x1={xQ3}
              y1={bTop - 18}
              x2={xQ3}
              y2={bTop - 10}
              stroke={s.color}
              strokeWidth="1.5"
            />
            <text
              x={(xQ1 + xQ3) / 2}
              y={bTop - 20}
              textAnchor="middle"
              fill={s.color}
              fontSize="10"
              fontWeight="700"
            >
              IQR = {s.q3 - s.q1}
            </text>
            <rect
              x={xQ1}
              y={bTop}
              width={xQ3 - xQ1}
              height={boxH}
              fill={s.color + "25"}
              stroke={s.color}
              strokeWidth="2"
              rx="3"
            />
            <line
              x1={xM}
              y1={bTop}
              x2={xM}
              y2={bBot}
              stroke={C.text}
              strokeWidth="3"
            />
            <text
              x={xMin}
              y={bBot + 13}
              textAnchor="middle"
              fill={C.muted}
              fontSize="9"
            >
              {s.min}
            </text>
            <text
              x={xQ1}
              y={bBot + 13}
              textAnchor="middle"
              fill={C.muted}
              fontSize="9"
            >
              {s.q1}
            </text>
            <text
              x={xM}
              y={bBot + 13}
              textAnchor="middle"
              fill={C.text}
              fontSize="9"
              fontWeight="700"
            >
              {s.median}
            </text>
            <text
              x={xQ3}
              y={bBot + 13}
              textAnchor="middle"
              fill={C.muted}
              fontSize="9"
            >
              {s.q3}
            </text>
            <text
              x={xMax}
              y={bBot + 13}
              textAnchor="middle"
              fill={C.muted}
              fontSize="9"
            >
              {s.max}
            </text>
          </g>
        );
      })}
      <line
        x1={padL}
        y1={examples.length * rowH + 2}
        x2={W - padR}
        y2={examples.length * rowH + 2}
        stroke={C.border}
        strokeWidth="1.5"
      />
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <g key={t}>
          <line
            x1={toX(t)}
            y1={examples.length * rowH + 2}
            x2={toX(t)}
            y2={examples.length * rowH + 8}
            stroke={C.muted}
            strokeWidth="1.5"
          />
          <text
            x={toX(t)}
            y={examples.length * rowH + 22}
            fill={C.muted}
            fontSize="10"
            textAnchor="middle"
          >
            {t}
          </text>
        </g>
      ))}
      <text
        x={W / 2}
        y={svgH - 2}
        fill={C.muted}
        fontSize="10"
        textAnchor="middle"
      >
        Score (out of 100)
      </text>
    </svg>
  );
}
