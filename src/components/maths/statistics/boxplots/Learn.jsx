import React, { useState } from "react";
import { C } from "./data";
import GlossaryTerm from "./GlossaryTerm";

// ── Data ──────────────────────────────────────────────────────────────────
// 60 scores: 30 per class, consistent with box plot values
// Class A: min 44, Q1 56, median 63, Q3 69, max 81
// Class B: min 14, Q1 27, median 41, Q3 55, max 91
const CLASS_A_SCORES = [
  44, 48, 51, 53, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 69,
  70, 71, 72, 73, 74, 75, 76, 77, 79, 81,
];
const CLASS_B_SCORES = [
  14, 18, 21, 24, 26, 27, 28, 30, 32, 34,
  36, 38, 40, 41, 42, 44, 46, 48, 50, 52,
  54, 55, 57, 59, 62, 65, 68, 72, 80, 91,
];
const ALL_SCORES = [...CLASS_A_SCORES, ...CLASS_B_SCORES].sort((a, b) => a - b);

const YEAR    = { min: 14, q1: 38, median: 51, q3: 62, max: 91, label: "Whole year group (60 students)", color: C.accent };
const CLASS_A = { min: 44, q1: 56, median: 63, q3: 69, max: 81, label: "Class 11A", color: C.accent };
const CLASS_B = { min: 14, q1: 27, median: 41, q3: 55, max: 91, label: "Class 11B", color: "#d97706" };

// Cumulative frequency points for the whole year (60 students)
const CUM_FREQ_POINTS = [
  [0, 0], [10, 0], [14, 0], [20, 2], [27, 8], [38, 15],
  [41, 18], [51, 30], [55, 36], [62, 45], [72, 52], [81, 57], [91, 60],
];

// Bar chart bands: score ranges and counts
const BAR_BANDS = [
  { label: "0-9",   count: 0 },
  { label: "10-19", count: 2 },
  { label: "20-29", count: 6 },
  { label: "30-39", count: 7 },
  { label: "40-49", count: 9 },
  { label: "50-59", count: 11 },
  { label: "60-69", count: 13 },
  { label: "70-79", count: 7 },
  { label: "80-89", count: 3 },
  { label: "90-99", count: 2 },
];

const PARTS = [
  { id: "min",    label: "Min",    fullLabel: "Minimum" },
  { id: "q1",     label: "Q1",     fullLabel: "Q1 - Lower Quarter" },
  { id: "median", label: "Median", fullLabel: "Median" },
  { id: "q3",     label: "Q3",     fullLabel: "Q3 - Upper Quarter" },
  { id: "iqr",    label: "IQR",    fullLabel: "IQR" },
  { id: "max",    label: "Max",    fullLabel: "Maximum" },
];

const PART_CONTENT = {
  min: {
    definition: "The smallest value in the data set. Shown as the left end of the left whisker.",
    headline: "The lowest score - 14 marks",
    explain: "Someone in the year group scored just 14 out of 100. That's one student - and the long left whisker (from 14 all the way to Q1 at 38) suggests a small number of students are well below everyone else. The minimum on its own doesn't tell you much - but the distance between it and Q1 is worth noticing.",
    examTip: "Min is the left whisker end. You're usually given it directly in the question.",
  },
  q1: {
    definition: "Q1 stands for 'first quarter.' It is the value that splits the bottom 25% of data from the rest. One quarter of all results fall below Q1.",
    headline: "Q1 = 38 - the bottom quarter boundary",
    explain: "One quarter (25%) of students scored below 38. These are the students who need most support. As a teacher, you'd want to know: are they all in the same class? Have they been absent a lot? The box plot gives you the boundary. It's your job to ask why those students are there.",
    examTip: "25% of values fall below Q1. To find it: take the lower half of sorted data and find its median.",
  },
  median: {
    definition: "The median is the middle value when all data is sorted from lowest to highest. Exactly half the values are below it, and half are above it.",
    headline: "Median = 51 - the typical student scored 51%",
    explain: "Half the year scored below 51, half above. This is more useful than a mean because a few very high or very low scores won't distort it. But 51% on its own doesn't tell you whether both classes are similar, or whether one class is dragging the median down. You need to go deeper.",
    examTip: "Odd values: median is the middle one. Even values: average the two middle values.",
  },
  q3: {
    definition: "Q3 stands for 'third quarter.' It is the value that splits the top 25% of data from the rest. Three quarters of all results fall below Q3.",
    headline: "Q3 = 62 - the upper quarter boundary",
    explain: "75% of students scored below 62. Only the top quarter scored higher. If you'd expect strong students to be hitting 75+, a Q3 of 62 suggests even the better-performing students have gaps. The right whisker stretches all the way to 91, which means a small number of students are far ahead of everyone else.",
    examTip: "75% of values fall below Q3. To find it: take the upper half of sorted data and find its median.",
  },
  iqr: {
    definition: "IQR stands for Interquartile Range. It is the distance between Q1 and Q3, calculated as IQR = Q3 - Q1. It measures how spread out the middle 50% of the data is.",
    headline: "IQR = 24 - the middle 50% spread across 24 marks",
    explain: "IQR = Q3 - Q1 = 62 - 38 = 24. The middle half of the year scored anywhere between 38 and 62. That 24-mark gap means results are inconsistent. The big question is: is this because the two classes are very different from each other? Or are both classes equally spread? A single box plot can't answer that - but splitting by class will.",
    examTip: "Always write IQR = Q3 - Q1 and show your working. Smaller IQR = more consistent results.",
  },
  max: {
    definition: "The largest value in the data set. Shown as the right end of the right whisker.",
    headline: "Maximum = 91 - the top score",
    explain: "One student scored 91. The long right whisker (Q3 is 62, max is 91) shows that a small number of high performers are well ahead of the pack. These might be students with tutors, students who find maths easier, or simply students who revised more. The box plot flags the gap - it doesn't explain it.",
    examTip: "Max is the right whisker end. Range = Max - Min = the total spread of all values.",
  },
};

// ── Shared box plot SVG ───────────────────────────────────────────────────
function MiniBoxPlot({ sets, scaleMin, scaleMax, unit, highlightPart }) {
  const W = 520; const padL = 20; const padR = 20;
  const plotW = W - padL - padR;
  const rowH = 72; const boxH = 30;
  const toX = (v) => padL + ((v - scaleMin) / (scaleMax - scaleMin)) * plotW;
  const ticks = Array.from({ length: 6 }, (_, i) => Math.round(scaleMin + (i / 5) * (scaleMax - scaleMin)));
  const svgH = sets.length * rowH + 44;

  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} style={{ width: "100%", overflow: "visible" }}>
      {ticks.map(t => (
        <line key={t} x1={toX(t)} y1={0} x2={toX(t)} y2={sets.length * rowH}
          stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}
      {sets.map((s, si) => {
        const cy = si * rowH + rowH / 2;
        const xMin = toX(s.min); const xQ1 = toX(s.q1); const xM = toX(s.median);
        const xQ3 = toX(s.q3); const xMax = toX(s.max);
        const bTop = cy - boxH / 2; const bBot = cy + boxH / 2;
        const hl = (part) => highlightPart === part && si === 0;
        return (
          <g key={s.label}>
            <text x={padL} y={bTop - 7} fill={s.color} fontSize="11" fontWeight="700">{s.label}</text>
            <line x1={xMin} y1={cy} x2={xQ1} y2={cy} stroke={s.color} strokeWidth={hl("min") ? 3 : 2} opacity={hl("min") ? 1 : 0.7} />
            <line x1={xMin} y1={bTop + 7} x2={xMin} y2={bBot - 7} stroke={s.color} strokeWidth={hl("min") ? 3 : 2} opacity={hl("min") ? 1 : 0.7} />
            <line x1={xQ3} y1={cy} x2={xMax} y2={cy} stroke={s.color} strokeWidth={hl("max") ? 3 : 2} opacity={hl("max") ? 1 : 0.7} />
            <line x1={xMax} y1={bTop + 7} x2={xMax} y2={bBot - 7} stroke={s.color} strokeWidth={hl("max") ? 3 : 2} opacity={hl("max") ? 1 : 0.7} />
            {hl("iqr") && <rect x={xQ1} y={bTop - 4} width={xQ3 - xQ1} height={boxH + 8} fill={C.accent} opacity="0.12" rx="4" />}
            <rect x={xQ1} y={bTop} width={xQ3 - xQ1} height={boxH}
              fill={s.color + "20"} stroke={s.color}
              strokeWidth={hl("q1") || hl("q3") || hl("iqr") ? 2.5 : 1.5} rx="3" />
            <line x1={xM} y1={bTop} x2={xM} y2={bBot}
              stroke={hl("median") ? C.accent : C.text} strokeWidth={hl("median") ? 4 : 3} />
            <text x={xMin} y={bBot+13} textAnchor="middle" fill={hl("min")?C.accent:C.muted} fontSize={hl("min")?"11":"9"} fontWeight={hl("min")?"700":"400"}>{s.min}</text>
            <text x={xQ1}  y={bBot+13} textAnchor="middle" fill={hl("q1")?C.accent:C.muted}  fontSize={hl("q1")?"11":"9"}  fontWeight={hl("q1")?"700":"400"}>{s.q1}</text>
            <text x={xM}   y={bBot+13} textAnchor="middle" fill={hl("median")?C.accent:C.text} fontSize={hl("median")?"11":"9"} fontWeight="700">{s.median}</text>
            <text x={xQ3}  y={bBot+13} textAnchor="middle" fill={hl("q3")?C.accent:C.muted}  fontSize={hl("q3")?"11":"9"}  fontWeight={hl("q3")?"700":"400"}>{s.q3}</text>
            <text x={xMax} y={bBot+13} textAnchor="middle" fill={hl("max")?C.accent:C.muted} fontSize={hl("max")?"11":"9"} fontWeight={hl("max")?"700":"400"}>{s.max}</text>
            {hl("min")    && <text x={xMin} y={bTop-10} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">Min</text>}
            {hl("q1")     && <text x={xQ1}  y={bTop-10} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">Q1</text>}
            {hl("median") && <text x={xM}   y={bTop-10} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">Median</text>}
            {hl("q3")     && <text x={xQ3}  y={bTop-10} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">Q3</text>}
            {hl("max")    && <text x={xMax} y={bTop-10} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">Max</text>}
            {hl("iqr") && <>
              <line x1={xQ1} y1={bTop-16} x2={xQ3} y2={bTop-16} stroke={C.accent} strokeWidth="1.5" />
              <line x1={xQ1} y1={bTop-20} x2={xQ1} y2={bTop-12} stroke={C.accent} strokeWidth="1.5" />
              <line x1={xQ3} y1={bTop-20} x2={xQ3} y2={bTop-12} stroke={C.accent} strokeWidth="1.5" />
              <text x={(xQ1+xQ3)/2} y={bTop-22} textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="700">IQR = {s.q3-s.q1}</text>
            </>}
          </g>
        );
      })}
      <line x1={padL} y1={sets.length*rowH+2} x2={W-padR} y2={sets.length*rowH+2} stroke={C.border} strokeWidth="1.5" />
      {ticks.map(t => (
        <g key={t}>
          <line x1={toX(t)} y1={sets.length*rowH+2} x2={toX(t)} y2={sets.length*rowH+8} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={sets.length*rowH+22} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x={W/2} y={svgH-2} fill={C.muted} fontSize="10" textAnchor="middle">{unit}</text>
    </svg>
  );
}

// ── IQR comparison - same median, different IQR ───────────────────────────
function IQRComparison() {
  const W = 520; const padL = 20; const padR = 20; const plotW = W - padL - padR;
  const toX = (v) => padL + (v / 100) * plotW;
  const rowH = 92; const boxH = 28;
  const examples = [
    { label: "Class A - IQR = 8",  q1: 46, median: 51, q3: 54, min: 38, max: 63, color: C.accent },
    { label: "Class B - IQR = 32", q1: 30, median: 51, q3: 62, min: 15, max: 80, color: "#d97706" },
  ];
  const svgH = examples.length * rowH + 44;
  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} style={{ width: "100%", overflow: "visible" }}>
      {[0,20,40,60,80,100].map(t => (
        <line key={t} x1={toX(t)} y1={0} x2={toX(t)} y2={examples.length*rowH} stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}
      {examples.map((s, si) => {
        const cy = si*rowH+rowH/2;
        const xMin=toX(s.min); const xQ1=toX(s.q1); const xM=toX(s.median); const xQ3=toX(s.q3); const xMax=toX(s.max);
        const bTop=cy-boxH/2; const bBot=cy+boxH/2;
        return (
          <g key={s.label}>
            <text x={padL} y={bTop-7} fill={s.color} fontSize="11" fontWeight="700">{s.label}</text>
            <line x1={xMin} y1={cy} x2={xQ1} y2={cy} stroke={s.color} strokeWidth="2" />
            <line x1={xMin} y1={bTop+7} x2={xMin} y2={bBot-7} stroke={s.color} strokeWidth="2" />
            <line x1={xQ3} y1={cy} x2={xMax} y2={cy} stroke={s.color} strokeWidth="2" />
            <line x1={xMax} y1={bTop+7} x2={xMax} y2={bBot-7} stroke={s.color} strokeWidth="2" />
            <line x1={xQ1} y1={bTop-14} x2={xQ3} y2={bTop-14} stroke={s.color} strokeWidth="1.5" />
            <line x1={xQ1} y1={bTop-18} x2={xQ1} y2={bTop-10} stroke={s.color} strokeWidth="1.5" />
            <line x1={xQ3} y1={bTop-18} x2={xQ3} y2={bTop-10} stroke={s.color} strokeWidth="1.5" />
            <text x={(xQ1+xQ3)/2} y={bTop-20} textAnchor="middle" fill={s.color} fontSize="10" fontWeight="700">IQR = {s.q3-s.q1}</text>
            <rect x={xQ1} y={bTop} width={xQ3-xQ1} height={boxH} fill={s.color+"25"} stroke={s.color} strokeWidth="2" rx="3" />
            <line x1={xM} y1={bTop} x2={xM} y2={bBot} stroke={C.text} strokeWidth="3" />
            <text x={xMin} y={bBot+13} textAnchor="middle" fill={C.muted} fontSize="9">{s.min}</text>
            <text x={xQ1}  y={bBot+13} textAnchor="middle" fill={C.muted} fontSize="9">{s.q1}</text>
            <text x={xM}   y={bBot+13} textAnchor="middle" fill={C.text}  fontSize="9" fontWeight="700">{s.median}</text>
            <text x={xQ3}  y={bBot+13} textAnchor="middle" fill={C.muted} fontSize="9">{s.q3}</text>
            <text x={xMax} y={bBot+13} textAnchor="middle" fill={C.muted} fontSize="9">{s.max}</text>
          </g>
        );
      })}
      <line x1={padL} y1={examples.length*rowH+2} x2={W-padR} y2={examples.length*rowH+2} stroke={C.border} strokeWidth="1.5" />
      {[0,20,40,60,80,100].map(t => (
        <g key={t}>
          <line x1={toX(t)} y1={examples.length*rowH+2} x2={toX(t)} y2={examples.length*rowH+8} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={examples.length*rowH+22} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x={W/2} y={svgH-2} fill={C.muted} fontSize="10" textAnchor="middle">Score (out of 100)</text>
    </svg>
  );
}

// ── Cumulative frequency graph ────────────────────────────────────────────
function CumFreqGraph() {
  const W = 520; const padL = 44; const padR = 16; const padT = 16; const padB = 48;
  const plotW = W - padL - padR; const plotH = 200;
  const toX = (score) => padL + (score / 100) * plotW;
  const toY = (freq)  => padT + plotH - (freq / 60) * plotH;

  // Build SVG path from points
  const pts = CUM_FREQ_POINTS;
  const pathD = pts.map(([s, f], i) => `${i === 0 ? "M" : "L"} ${toX(s)} ${toY(f)}`).join(" ");

  // Key read-off lines: Q1=38/15, Median=51/30, Q3=62/45
  const readOffs = [
    { score: 38, freq: 15, label: "Q1", color: C.accent },
    { score: 51, freq: 30, label: "Median", color: C.text },
    { score: 62, freq: 45, label: "Q3", color: C.accent },
  ];

  const yTicks = [0, 10, 20, 30, 40, 50, 60];
  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <svg viewBox={`0 0 ${W} ${padT + plotH + padB}`} style={{ width: "100%", overflow: "visible" }}>
      {/* Grid */}
      {yTicks.map(f => (
        <line key={f} x1={padL} y1={toY(f)} x2={W-padR} y2={toY(f)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}

      {/* Read-off dashed lines */}
      {readOffs.map(({ score, freq, label, color }) => (
        <g key={label}>
          {/* Horizontal from y-axis to curve */}
          <line x1={padL} y1={toY(freq)} x2={toX(score)} y2={toY(freq)}
            stroke={color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
          {/* Vertical from curve down to x-axis */}
          <line x1={toX(score)} y1={toY(freq)} x2={toX(score)} y2={toY(0)}
            stroke={color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
          {/* Dot at intersection */}
          <circle cx={toX(score)} cy={toY(freq)} r="4" fill={color} />
          {/* Label on x-axis - white bg rect to prevent overlap with regular ticks */}
          <rect x={toX(score)-10} y={toY(0)+20} width="20" height="13" fill="#fff" />
          <text x={toX(score)} y={toY(0)+31} textAnchor="middle" fill={color} fontSize="10" fontWeight="700">{score}</text>
          {/* Label on y-axis - white bg rect to prevent overlap with regular ticks */}
          <rect x={padL-22} y={toY(freq)-7} width="18" height="13" fill="#fff" />
          <text x={padL-5} y={toY(freq)+4} textAnchor="end" fill={color} fontSize="10" fontWeight="700">{freq}</text>
        </g>
      ))}

      {/* Curve */}
      <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />
      <line x1={padL} y1={toY(0)} x2={W-padR} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />

      {/* Y-axis ticks + labels */}
      {yTicks.map(f => (
        <g key={f}>
          <line x1={padL-4} y1={toY(f)} x2={padL} y2={toY(f)} stroke={C.muted} strokeWidth="1.5" />
          <text x={padL-6} y={toY(f)+4} textAnchor="end" fill={C.muted} fontSize="9">{f}</text>
        </g>
      ))}

      {/* X-axis ticks + labels */}
      {xTicks.filter(t => ![38, 51, 62].includes(t)).map(t => (
        <g key={t}>
          <line x1={toX(t)} y1={toY(0)} x2={toX(t)} y2={toY(0)+4} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={toY(0)+14} textAnchor="middle" fill={C.muted} fontSize="9">{t}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={padL-32} y={padT + plotH/2} textAnchor="middle" fill={C.muted} fontSize="10"
        transform={`rotate(-90, ${padL-32}, ${padT + plotH/2})`}>Cumulative frequency</text>
      <text x={padL + plotW/2} y={padT+plotH+padB-4} textAnchor="middle" fill={C.muted} fontSize="10">Score (out of 100)</text>
    </svg>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────────────
function BarChart() {
  const W = 520; const padL = 36; const padR = 16; const padT = 16; const padB = 44;
  const plotW = W - padL - padR; const plotH = 180;
  const maxCount = Math.max(...BAR_BANDS.map(b => b.count));
  const barW = plotW / BAR_BANDS.length;
  const toY = (count) => padT + plotH - (count / maxCount) * plotH;
  const yTicks = [0, 3, 6, 9, 12];

  // highlight bars that contain Q1 (38), median (51), Q3 (62)
  const isKeyBand = (label) => {
    if (label === "30-39") return "q1";
    if (label === "50-59") return "median";
    if (label === "60-69") return "q3";
    return null;
  };

  return (
    <svg viewBox={`0 0 ${W} ${padT + plotH + padB}`} style={{ width: "100%", overflow: "visible" }}>
      {/* Grid */}
      {yTicks.map(f => (
        <line key={f} x1={padL} y1={toY(f)} x2={W-padR} y2={toY(f)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}

      {/* Bars */}
      {BAR_BANDS.map((band, i) => {
        const x = padL + i * barW;
        const y = toY(band.count);
        const h = padT + plotH - y;
        const key = isKeyBand(band.label);
        const barColor = key === "median" ? C.text : key ? C.accent : C.accent + "60";
        return (
          <g key={band.label}>
            <rect x={x+2} y={y} width={barW-4} height={h}
              fill={barColor} rx="3" opacity={key ? 1 : 0.5} />
            {band.count > 0 && (
              <text x={x+barW/2} y={y-4} textAnchor="middle" fill={key ? C.accent : C.muted} fontSize="9" fontWeight={key ? "700" : "400"}>{band.count}</text>
            )}
            <text x={x+barW/2} y={padT+plotH+14} textAnchor="middle" fill={key ? C.accent : C.muted}
              fontSize="8" fontWeight={key ? "700" : "400"}>{band.label}</text>
          </g>
        );
      })}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT+plotH} stroke={C.text} strokeWidth="1.5" />
      <line x1={padL} y1={padT+plotH} x2={W-padR} y2={padT+plotH} stroke={C.text} strokeWidth="1.5" />

      {/* Y ticks */}
      {yTicks.map(f => (
        <g key={f}>
          <line x1={padL-4} y1={toY(f)} x2={padL} y2={toY(f)} stroke={C.muted} strokeWidth="1" />
          <text x={padL-6} y={toY(f)+4} textAnchor="end" fill={C.muted} fontSize="9">{f}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={padL-28} y={padT+plotH/2} textAnchor="middle" fill={C.muted} fontSize="10"
        transform={`rotate(-90, ${padL-28}, ${padT+plotH/2})`}>Number of students</text>
      <text x={padL+plotW/2} y={padT+plotH+padB-4} textAnchor="middle" fill={C.muted} fontSize="10">Score range (out of 100)</text>

      {/* Legend note */}
      <text x={padL+plotW/2} y={padT+plotH+padB-18} textAnchor="middle" fill={C.accent} fontSize="9" fontWeight="600">
        Darker bars = where Q1, Median and Q3 fall
      </text>
    </svg>
  );
}

// ── Score table ───────────────────────────────────────────────────────────
function ScoreTable() {
  const [expanded, setExpanded] = useState(false);
  const rows = [];
  for (let i = 0; i < ALL_SCORES.length; i += 10) {
    rows.push(ALL_SCORES.slice(i, i + 10));
  }

  // Which positions are special (1-indexed)
  const specialPos = {
    1:  { label: "Min",    color: C.muted },
    15: { label: "Q1",     color: C.accent },
    30: { label: "Median", color: C.text },
    31: { label: "Median", color: C.text },
    46: { label: "Q3",     color: C.accent },
    60: { label: "Max",    color: C.muted },
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", background: expanded ? C.accentDim : C.surface,
          border: `1px solid ${expanded ? C.accent : C.border}`, borderRadius: "12px",
          padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: expanded ? C.accent : C.text, margin: 0 }}>
            📋 All 60 scores - sorted lowest to highest
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>
            This is what the teacher collated. Tap to see the full table.
          </p>
        </div>
        <span style={{ fontSize: "12px", color: C.muted, flexShrink: 0, marginLeft: "10px" }}>{expanded ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: "8px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: C.accentDim, padding: "8px 12px", borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontSize: "11px", color: C.accent, margin: 0, fontWeight: "600" }}>
              Highlighted positions: <strong>Q1 = position 15 (38)</strong> · <strong>Median = average of positions 30 and 31 (51)</strong> · <strong>Q3 = position 46 (62)</strong>
            </p>
          </div>

          {/* Grid of scores */}
          <div style={{ padding: "12px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {ALL_SCORES.map((score, i) => {
              const pos = i + 1;
              const sp = specialPos[pos];
              return (
                <div key={i} style={{
                  minWidth: "44px", height: "44px", borderRadius: "8px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: sp ? (sp.color === C.accent ? C.accentDim : sp.color === C.text ? "#f3f4f6" : "#f9fafb") : "transparent",
                  border: `1.5px solid ${sp ? sp.color : C.border}`,
                  position: "relative",
                }}>
                  <span style={{ fontSize: "13px", fontWeight: sp ? "800" : "500", color: sp ? sp.color : C.text, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: "8px", color: sp ? sp.color : C.muted, lineHeight: 1, marginTop: "1px" }}>#{pos}</span>
                  {sp && (
                    <span style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                      fontSize: "8px", fontWeight: "700", color: sp.color, whiteSpace: "nowrap",
                      background: "#fff", padding: "0 2px", borderRadius: "3px" }}>
                      {sp.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "10px 12px", background: "#f9fafb", borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
              With 60 values (even), the median = average of positions 30 and 31 = (50 + 52) ÷ 2 = 51.
              Q1 = position 15 = 38. Q3 = position 46 = 62.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Collapsible ───────────────────────────────────────────────────────────
function Reveal({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "12px 14px", background: open ? C.accentDim : C.surface,
          border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: open ? C.accent : C.text }}>{label}</span>
        <span style={{ fontSize: "12px", color: C.muted }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>
      {open && <div style={{ padding: "14px", background: C.accentDim, borderTop: `1px solid ${C.border}` }}>{children}</div>}
    </div>
  );
}

// ── Median demo ───────────────────────────────────────────────────────────
function MedianDemo() {
  const [isOdd, setIsOdd] = useState(true);
  const odd  = [22, 31, 38, 45, 51, 57, 63, 71, 80];
  const even = [22, 31, 38, 45, 51, 57, 63, 71, 80, 88];
  const data = isOdd ? odd : even;
  const n = data.length;
  const midL = Math.floor((n - 1) / 2);
  const midR = Math.ceil((n - 1) / 2);
  const median = (data[midL] + data[midR]) / 2;
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {[true, false].map(o => (
          <button key={String(o)} onClick={() => setIsOdd(o)}
            style={{ flex: 1, padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600",
              border: `1.5px solid ${isOdd === o ? C.accent : C.border}`,
              background: isOdd === o ? "#fff" : "transparent",
              color: isOdd === o ? C.accent : C.muted }}>
            {o ? "Odd - 9 values" : "Even - 10 values"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "14px" }}>
        {data.map((v, i) => {
          const isMiddle = i === midL || i === midR;
          return (
            <div key={i} style={{ width: "42px", height: "42px", borderRadius: "10px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "13px",
              fontWeight: isMiddle ? "800" : "500",
              background: isMiddle ? C.accent : C.surface,
              color: isMiddle ? "#fff" : C.muted,
              border: `2px solid ${isMiddle ? C.accent : C.border}`,
              boxShadow: isMiddle ? `0 0 0 3px ${C.accentDim}` : "none" }}>
              {v}
            </div>
          );
        })}
      </div>
      {isOdd ? (
        <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px" }}>
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: C.accent }}>9 values (odd):</strong> the middle one is position 5. Median = <strong style={{ color: C.accent }}>{median}</strong>
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px" }}>
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: C.accent }}>10 values (even):</strong> average positions 5 and 6. ({data[midL]} + {data[midR]}) ÷ 2 = <strong style={{ color: C.accent }}>{median}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

// ── Step bubble ───────────────────────────────────────────────────────────
function StepBubble({ n }) {
  return (
    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: C.accent, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", flexShrink: 0 }}>
      {n}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Learn() {
  const [activePart, setActivePart] = useState(null);
  const [activeGraph, setActiveGraph] = useState("cumfreq"); // "cumfreq" | "bar"
  const active = activePart ? PART_CONTENT[activePart] : null;

  return (
    <div>

      {/* The situation */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "16px 18px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>🏫 The situation</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 10px" }}>
          Year 11 has just sat a maths practice paper. There are <strong>60 students</strong> across two classes - 11A and 11B. The results are back. You're the head of maths. What do you do with 60 numbers?
        </p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
          You could list every score. You could find the mean. But neither tells you <em>who</em> is struggling, <em>how spread out</em> the results are, or <em>whether one class is letting the other down</em>. That's where a box plot comes in.
        </p>
      </div>

      {/* ── DATA TABLE ── */}
      <ScoreTable />

      {/* ── STEP 1 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="1" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Look at the whole year group first</p>
      </div>

      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        Instead of reading 60 scores, the box plot gives you <strong style={{ color: C.text }}>5 checkpoints</strong>. Tap any label below to see what it means - and why it matters.
      </p>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Whole year group - maths test (out of 100)</p>
        <MiniBoxPlot sets={[YEAR]} scaleMin={0} scaleMax={100} unit="Score (out of 100)" highlightPart={activePart} />
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
        {PARTS.map(p => (
          <button key={p.id} onClick={() => setActivePart(activePart === p.id ? null : p.id)}
            style={{ padding: "6px 14px", borderRadius: "99px", cursor: "pointer", fontSize: "12px", fontWeight: "700",
              border: `1.5px solid ${activePart === p.id ? C.accent : C.border}`,
              background: activePart === p.id ? C.accentDim : "transparent",
              color: activePart === p.id ? C.accent : C.muted }}>
            {p.label}
          </button>
        ))}
      </div>

      {active && (
        <div style={{ background: C.surface, border: `2px solid ${C.accent}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            {PARTS.find(p => p.id === activePart)?.fullLabel}
          </p>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}50`, borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Definition</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{active.definition}</p>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "800", color: C.text, margin: "0 0 10px" }}>{active.headline}</p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 12px" }}>{active.explain}</p>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>In the exam:</strong> {active.examTip}
            </p>
          </div>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "28px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>What do we know so far?</p>
        {[
          { icon: "📌", jsx: <><GlossaryTerm term="Median">Median</GlossaryTerm> = 51 - the typical student scored about half marks</> },
          { icon: "⚠️", jsx: <><GlossaryTerm term="Q1">Q1</GlossaryTerm> = 38 - a quarter of students scored below 38. These students need support</> },
          { icon: "⚠️", jsx: <><GlossaryTerm term="IQR">IQR</GlossaryTerm> = 24 - the middle 50% are spread across 24 marks. That's inconsistent</> },
          { icon: "📌", jsx: <><GlossaryTerm term="Maximum">Max</GlossaryTerm> = 91 - a few students are well ahead of everyone else</> },
        ].map(({ icon, text, jsx }, idx) => (
          <div key={idx} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
            <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{jsx || text}</p>
          </div>
        ))}
        <div style={{ marginTop: "12px", padding: "12px", background: "#fff8f0", border: "1px solid #d97706", borderRadius: "8px" }}>
          <p style={{ fontSize: "13px", color: "#92400e", margin: 0, lineHeight: 1.7 }}>
            <strong>But here's the problem:</strong> the IQR of 24 tells you results are inconsistent - but why? Is one class dragging the results down? Are both classes equally mixed? You can't tell yet. You need to split the data by class.
          </p>
        </div>
      </div>

      {/* ── STEP 2 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="2" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Split by class - now the picture changes</p>
      </div>

      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        The head of maths now draws <strong style={{ color: C.text }}>two box plots</strong> - one per class, on the same scale. Same test. Same marking. Very different story.
      </p>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Class 11A vs Class 11B - same test, same scale</p>
        <MiniBoxPlot sets={[CLASS_A, CLASS_B]} scaleMin={0} scaleMax={100} unit="Score (out of 100)" highlightPart={null} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[{ ...CLASS_A, iqr: CLASS_A.q3 - CLASS_A.q1 }, { ...CLASS_B, iqr: CLASS_B.q3 - CLASS_B.q1 }].map(s => (
          <div key={s.label} style={{ background: C.surface, border: `2px solid ${s.color}`, borderRadius: "12px", padding: "14px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, margin: "0 0 10px" }}>{s.label}</p>
            {[["Median", s.median], ["Q1", s.q1], ["Q3", s.q3], ["IQR", s.iqr], ["Min", s.min], ["Max", s.max]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: "12px", color: C.muted }}>{k}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: k === "Median" || k === "IQR" ? s.color : C.text }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#15803d", margin: "0 0 12px" }}>💡 Now we can answer the questions you were asking</p>
        {[
          { q: "Is one class doing better overall?", a: "Yes. 11A has a median of 63, 11B has a median of 41. That's a 22-mark gap on the typical student. 11A is clearly stronger." },
          { q: "Is one class more consistent?", a: "11A has an IQR of 13. 11B has an IQR of 28. 11A's students are moving together. In 11B, the middle 50% range from 27 to 55 - some students understand it, others are lost." },
          { q: "Could tutoring be inflating 11A's results?", a: "Possibly - but 11A's small IQR works against that theory. If a few tutored students were pulling the median up, you'd expect a large IQR with a handful of students scoring much higher than everyone else. The tight box suggests the whole class is performing well, not just a few." },
          { q: "What about the bottom quarter in 11B?", a: "Q1 for 11B is just 27. A quarter of that class scored under 27 out of 100. Those students are concentrated in one class - and they need urgent support." },
        ].map(({ q, a }, i) => (
          <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: `1px solid #bbf7d0` }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#15803d", margin: "0 0 3px" }}>Q: {q}</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.65 }}>- {a}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "10px", padding: "14px", marginBottom: "28px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "#92400e", margin: "0 0 8px" }}>⭐ How to write this in an exam</p>
        <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.7, margin: "0 0 8px" }}>
          “Class 11A had a higher <GlossaryTerm term="Median">median</GlossaryTerm> (63) than Class 11B (41), so 11A performed better on average. Class 11A also had a smaller <GlossaryTerm term="IQR">IQR</GlossaryTerm> (13 compared to 28), so their results were more consistent.”
        </p>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
          That structure - <strong>compare medians, draw a conclusion, compare IQRs, draw a conclusion</strong> - is exactly what mark schemes ask for.
        </p>
      </div>

      {/* ── STEP 3 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="3" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Why does IQR matter so much?</p>
      </div>

      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        These two classes have <strong style={{ color: C.text }}>exactly the same median</strong>. But look at what the IQR reveals.
      </p>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <IQRComparison />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>Small IQR = 8 ✓</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: "0 0 8px" }}>The middle 50% all scored between 46 and 54. Everyone is moving together.</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: 0 }}>If the median is too low, you re-teach the topic to the whole class. <strong>Simple plan.</strong></p>
        </div>
        <div style={{ background: "#fff8f0", border: "1px solid #d97706", borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#d97706", margin: "0 0 8px" }}>Large IQR = 32 ⚠️</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: "0 0 8px" }}>The middle 50% ranged from 30 to 62. Same median, completely different problem.</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: 0 }}>Some students are fine. Others are lost. You can't re-teach to everyone and you can't move on. <strong>Much harder to fix.</strong></p>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px", marginBottom: "28px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 6px" }}>The one rule to remember:</p>
        <p style={{ fontSize: "14px", color: C.accent, fontWeight: "700", lineHeight: 1.6, margin: 0 }}>
          Small <GlossaryTerm term="IQR">IQR</GlossaryTerm> = consistent. Large <GlossaryTerm term="IQR">IQR</GlossaryTerm> = something is creating inequality - find out why.
        </p>
      </div>

      {/* ── STEP 4 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="4" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>This is what shows up in an exam</p>
      </div>

      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        In an Edexcel GCSE exam you won't always be given a box plot directly. Often you're given a graph instead and asked to read the values off it yourself. This is the <strong style={{ color: C.text }}>same data</strong> as everything above - just shown in two different ways you'll see in the exam.
      </p>

      {/* Graph toggle */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", background: C.surface, borderRadius: "10px", padding: "4px", border: `1px solid ${C.border}` }}>
        {[
          { id: "cumfreq", label: "📈 Cumulative frequency graph" },
          { id: "bar",     label: "📊 Bar chart" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveGraph(id)}
            style={{ flex: 1, padding: "9px 8px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: activeGraph === id ? C.accent : "transparent",
              color: activeGraph === id ? "#fff" : C.muted,
              fontSize: "12px", fontWeight: "600", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {activeGraph === "cumfreq" && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Cumulative frequency graph - whole year group (60 students)</p>
            <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>Dashed lines show how to read off Q1, Median and Q3</p>
            <CumFreqGraph />
          </div>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>How to read this graph in an exam</p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
              The S-shaped curve shows how many students (cumulative frequency) scored up to each score on the x-axis. To find Q1, Median and Q3:
            </p>
            {[
              { step: "1", text: "Find the frequency you need on the y-axis. For Q1: ¼ × 60 = 15. For Median: ½ × 60 = 30. For Q3: ¾ × 60 = 45." },
              { step: "2", text: "Draw a horizontal line across from that frequency until it hits the curve." },
              { step: "3", text: "Drop straight down to the x-axis. That value is your answer." },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.accent, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{step}</div>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px", marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>Exam tip:</strong> Always read across from the y-axis to the curve first, then drop straight down. Never go the other way round. This is exactly what Questions 8 and 9 on the Edexcel paper ask you to do.
            </p>
          </div>
        </div>
      )}

      {activeGraph === "bar" && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Bar chart - whole year group (60 students)</p>
            <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>Number of students per score range. Darker bars = where Q1, Median and Q3 fall.</p>
            <BarChart />
          </div>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>What this bar chart tells you</p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
              The bar chart shows the shape of the distribution - where most students scored and how spread out the results are. Unlike a box plot, you can see every score band at once.
            </p>
            {[
              { label: "Scores cluster in the 50-69 range", detail: "The tallest bars. Most students scored here - this is where the median sits." },
              { label: "The tail on the left is longer", detail: "More students scored very low (10-29) than very high (80-99). This is why the IQR is pulled downwards." },
              { label: "You can't read Q1 or Q3 directly", detail: "That's the weakness of a bar chart. You need a cumulative frequency graph or the raw data to find quartiles precisely." },
            ].map(({ label, detail }) => (
              <div key={label} style={{ display: "flex", gap: "10px", marginBottom: "8px", paddingBottom: "8px", borderBottom: `1px solid ${C.accent}30` }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px", marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>Exam tip:</strong> Bar charts appear in GCSE questions but you usually can't use them alone to draw a box plot. The examiner will either give you a cumulative frequency graph or the five-number summary. Bar charts help you understand the shape - not the exact quartiles.
            </p>
          </div>
        </div>
      )}

      {/* Collapsibles */}
      <Reveal label="❓ What if there's no middle number? (odd vs even values)">
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
          For GCSE you can get either an odd or even number of values. The method changes slightly.
        </p>
        <MedianDemo />
      </Reveal>

      <Reveal label="📖 Glossary - definitions of every term">
        {[
          { term: "Minimum", abbr: "Min", definition: "The smallest value in the data set.", position: "Left whisker end", formula: "Given directly" },
          { term: "Lower Quartile", abbr: "Q1", definition: "The value that marks the boundary of the bottom 25% of data. One quarter of all values fall below Q1. Q stands for 'quartile' - meaning quarter.", position: "Left edge of the box", formula: "Median of the lower half of data" },
          { term: "Median", abbr: null, definition: "The middle value of a sorted data set. Exactly half the values are below it and half are above it. For an even number of values, average the two middle numbers.", position: "Vertical line inside the box", formula: "Middle value, or (lower middle + upper middle) ÷ 2" },
          { term: "Upper Quartile", abbr: "Q3", definition: "The value that marks the boundary of the top 25% of data. Three quarters of all values fall below Q3.", position: "Right edge of the box", formula: "Median of the upper half of data" },
          { term: "Maximum", abbr: "Max", definition: "The largest value in the data set.", position: "Right whisker end", formula: "Given directly" },
          { term: "Interquartile Range", abbr: "IQR", definition: "The difference between Q3 and Q1. It measures how spread out the middle 50% of data is. A small IQR means consistent results. A large IQR means results vary widely - some much higher, some much lower than typical.", position: "Width of the box", formula: "IQR = Q3 - Q1" },
          { term: "Range", abbr: null, definition: "The total spread from lowest to highest. Unlike IQR, it includes the extremes - so one very high or very low score can make it look misleadingly large.", position: "Full width of the diagram", formula: "Range = Max - Min" },
          { term: "Cumulative frequency", abbr: null, definition: "A running total of how many values fall at or below each point. Plotted as an S-shaped curve. Used in exams to read off the median and quartiles.", position: "Y-axis of cumulative frequency graph", formula: "Add up frequencies from the bottom upwards" },
        ].map(({ term, abbr, definition, position, formula }) => (
          <div key={term} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: C.accent }}>{term}</span>
              {abbr && (
                <span style={{ fontSize: "11px", fontWeight: "700", color: C.accent, background: "#fff",
                  padding: "1px 7px", borderRadius: "99px", border: `1px solid ${C.accent}40` }}>{abbr}</span>
              )}
            </div>
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.65 }}>{definition}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", color: C.muted, fontStyle: "italic" }}>📍 {position}</span>
              <span style={{ fontSize: "11px", color: C.muted, fontStyle: "italic" }}>🧮 {formula}</span>
            </div>
          </div>
        ))}
      </Reveal>

    </div>
  );
}