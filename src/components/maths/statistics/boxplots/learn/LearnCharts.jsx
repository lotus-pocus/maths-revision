import React from "react";
import { C } from "../data";

// ── Cumulative frequency points for the whole year (60 students) ──────────
const CUM_FREQ_POINTS = [
  [0, 0], [10, 0], [14, 1], [20, 2], [27, 8], [38, 15],
  [41, 17], [50, 30], [55, 34], [62, 46], [72, 57], [81, 59], [91, 60],
];

// ── Mini box plot SVG ─────────────────────────────────────────────────────
export function MiniBoxPlot({ sets, scaleMin, scaleMax, unit, highlightPart }) {
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

// ── Cumulative frequency graph ────────────────────────────────────────────
export function CumFreqGraph() {
  const W = 520; const padL = 44; const padR = 16; const padT = 16; const padB = 48;
  const plotW = W - padL - padR; const plotH = 200;
  const toX = (score) => padL + (score / 100) * plotW;
  const toY = (freq)  => padT + plotH - (freq / 60) * plotH;

  const pts = CUM_FREQ_POINTS;
  const pathD = pts.map(([s, f], i) => `${i === 0 ? "M" : "L"} ${toX(s)} ${toY(f)}`).join(" ");

  const readOffs = [
    { score: 38, freq: 15, label: "Q1",     color: C.accent },
    { score: 50, freq: 30, label: "Median", color: C.text   },
    { score: 62, freq: 45, label: "Q3",     color: C.accent },
  ];

  const yTicks = [0, 10, 20, 30, 40, 50, 60];
  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <svg viewBox={`0 0 ${W} ${padT + plotH + padB}`} style={{ width: "100%", overflow: "visible" }}>
      {yTicks.map(f => (
        <line key={f} x1={padL} y1={toY(f)} x2={W-padR} y2={toY(f)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}
      {readOffs.map(({ score, freq, label, color }) => (
        <g key={label}>
          <line x1={padL} y1={toY(freq)} x2={toX(score)} y2={toY(freq)} stroke={color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
          <line x1={toX(score)} y1={toY(freq)} x2={toX(score)} y2={toY(0)} stroke={color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
          <circle cx={toX(score)} cy={toY(freq)} r="4" fill={color} />
          <rect x={toX(score)-10} y={toY(0)+20} width="20" height="13" fill="#fff" />
          <text x={toX(score)} y={toY(0)+31} textAnchor="middle" fill={color} fontSize="10" fontWeight="700">{score}</text>
          <rect x={padL-22} y={toY(freq)-7} width="18" height="13" fill="#fff" />
          <text x={padL-5} y={toY(freq)+4} textAnchor="end" fill={color} fontSize="10" fontWeight="700">{freq}</text>
        </g>
      ))}
      <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <line x1={padL} y1={padT} x2={padL} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />
      <line x1={padL} y1={toY(0)} x2={W-padR} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />
      {yTicks.map(f => (
        <g key={f}>
          <line x1={padL-4} y1={toY(f)} x2={padL} y2={toY(f)} stroke={C.muted} strokeWidth="1.5" />
          <text x={padL-6} y={toY(f)+4} textAnchor="end" fill={C.muted} fontSize="9">{f}</text>
        </g>
      ))}
      {xTicks.filter(t => ![38, 50, 62].includes(t)).map(t => (
        <g key={t}>
          <line x1={toX(t)} y1={toY(0)} x2={toX(t)} y2={toY(0)+4} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={toY(0)+14} textAnchor="middle" fill={C.muted} fontSize="9">{t}</text>
        </g>
      ))}
      <text x={padL-32} y={padT + plotH/2} textAnchor="middle" fill={C.muted} fontSize="10"
        transform={`rotate(-90, ${padL-32}, ${padT + plotH/2})`}>Cumulative frequency</text>
      <text x={padL + plotW/2} y={padT+plotH+padB-4} textAnchor="middle" fill={C.muted} fontSize="10">Score (out of 100)</text>
    </svg>
  );
}