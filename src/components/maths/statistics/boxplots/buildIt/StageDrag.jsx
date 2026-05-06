import React, { useState } from "react";
import { C, TOLERANCE } from "../data";
import BoxPlotSVG from "../shared/BoxPlotSVG";

export default function StageDrag({ q, onBack }) {
  const initVals = () => ({
    min:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.15),
    q1:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.30),
    median: q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.50),
    q3:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.70),
    max:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.85),
  });
  const [vals, setVals]             = useState(initVals);
  const [dragging, setDragging]     = useState(null);
  const [checked, setChecked]       = useState(false);
  const [showHint, setShowHint]     = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const svgRef = React.useRef(null);
  const reset  = () => { setVals(initVals()); setChecked(false); setShowHint(false); setShowAnswer(false); };

  const SVG_W = 520; const PAD_L = 24; const PAD_R = 24; const PLOT_W = SVG_W - PAD_L - PAD_R;
  const MID_Y = 60; const BOX_H = 32;
  const toX   = (v) => PAD_L + ((v - q.scaleMin) / (q.scaleMax - q.scaleMin)) * PLOT_W;
  const toVal = (x) => q.scaleMin + ((x - PAD_L) / PLOT_W) * (q.scaleMax - q.scaleMin);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onPointerDown = (e, key) => { e.preventDefault(); svgRef.current.setPointerCapture(e.pointerId); setDragging({ key }); };
  const onPointerMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    let nv = Math.round(toVal(svgX));
    setVals((prev) => {
      const next = { ...prev };
      if (dragging.key === "min")    nv = clamp(nv, q.scaleMin,      prev.q1 - 1);
      if (dragging.key === "q1")     nv = clamp(nv, prev.min + 1,    prev.median - 1);
      if (dragging.key === "median") nv = clamp(nv, prev.q1 + 1,     prev.q3 - 1);
      if (dragging.key === "q3")     nv = clamp(nv, prev.median + 1, prev.max - 1);
      if (dragging.key === "max")    nv = clamp(nv, prev.q3 + 1,     q.scaleMax);
      next[dragging.key] = nv; return next;
    });
  };
  const onPointerUp = () => setDragging(null);

  const HL = { min: "Min", q1: "Q1", median: "Med", q3: "Q3", max: "Max" };
  const HC = { min: "#64748b", q1: "#00d4aa", median: "#ffffff", q3: "#00d4aa", max: "#64748b" };
  const ticks = Array.from({ length: 6 }, (_, i) => Math.round(q.scaleMin + (i / 5) * (q.scaleMax - q.scaleMin)));
  const score = Object.keys(q.answer).map((k) => ({ key: k, correct: Math.abs(vals[k] - q.answer[k]) <= TOLERANCE, yours: vals[k], answer: q.answer[k] }));
  const allCorrect = score.every(s => s.correct);

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 3 of 3 — Place It</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {Object.entries(q.answer).map(([k, v]) => (
          <div key={k} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "6px 10px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{HL[k]}</p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "13px", color: C.text, marginBottom: "16px" }}>Drag each handle to its correct position on the number line.</p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px", touchAction: "none" }}>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: "12px", textAlign: "center" }}>Drag each handle ↔</p>
        <svg ref={svgRef} viewBox={`0 0 ${SVG_W} 135`} style={{ width: "100%", overflow: "visible", cursor: dragging ? "grabbing" : "default", userSelect: "none" }} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
          {ticks.map((t) => <line key={t} x1={toX(t)} y1={10} x2={toX(t)} y2={MID_Y + BOX_H / 2 + 4} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />)}
          <line x1={toX(vals.min)} y1={MID_Y} x2={toX(vals.q1)} y2={MID_Y} stroke={C.accent} strokeWidth="2" />
          <line x1={toX(vals.min)} y1={MID_Y-10} x2={toX(vals.min)} y2={MID_Y+10} stroke={C.accent} strokeWidth="2.5" />
          <line x1={toX(vals.q3)} y1={MID_Y} x2={toX(vals.max)} y2={MID_Y} stroke={C.accent} strokeWidth="2" />
          <line x1={toX(vals.max)} y1={MID_Y-10} x2={toX(vals.max)} y2={MID_Y+10} stroke={C.accent} strokeWidth="2.5" />
          <rect x={toX(vals.q1)} y={MID_Y-BOX_H/2} width={Math.max(0,toX(vals.q3)-toX(vals.q1))} height={BOX_H} fill={C.accent+"20"} stroke={C.accent} strokeWidth="2" rx="3" />
          <line x1={toX(vals.median)} y1={MID_Y-BOX_H/2} x2={toX(vals.median)} y2={MID_Y+BOX_H/2} stroke={C.text} strokeWidth="3" />
          <line x1={PAD_L} y1={MID_Y+BOX_H/2+6} x2={SVG_W-PAD_R} y2={MID_Y+BOX_H/2+6} stroke={C.border} strokeWidth="1.5" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={toX(t)} y1={MID_Y+BOX_H/2+6} x2={toX(t)} y2={MID_Y+BOX_H/2+12} stroke={C.muted} strokeWidth="1.5" />
              <text x={toX(t)} y={MID_Y+BOX_H/2+24} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
            </g>
          ))}
          <text x={SVG_W/2} y={133} fill={C.muted} fontSize="10" textAnchor="middle">{q.unit}</text>
          {Object.entries(HL).map(([key, label]) => {
            const x = toX(vals[key]); const isActive = dragging?.key === key;
            return (
              <g key={key} style={{ cursor: "grab" }} onPointerDown={(e) => onPointerDown(e, key)}>
                <rect x={x-14} y={MID_Y-BOX_H/2-22} width={28} height={BOX_H+44} fill="transparent" />
                <rect x={x-14} y={MID_Y-BOX_H/2-22} width={28} height={18} fill={isActive?C.accent:C.surface} stroke={HC[key]} strokeWidth="1.5" rx="4" />
                <text x={x} y={MID_Y-BOX_H/2-8} fill={isActive?C.bg:HC[key]} fontSize="9" fontWeight="700" textAnchor="middle">{label}</text>
                <text x={x} y={MID_Y+BOX_H/2+38} fill={isActive?C.accent:C.muted} fontSize="10" fontWeight={isActive?"700":"400"} textAnchor="middle">{vals[key]}</text>
                <polygon points={`${x},${MID_Y-BOX_H/2-4} ${x+6},${MID_Y} ${x},${MID_Y+BOX_H/2+4} ${x-6},${MID_Y}`} fill={isActive?C.accent:C.card} stroke={HC[key]} strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      </div>
      <button onClick={() => setShowHint(!showHint)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", color: C.muted, fontSize: "12px", cursor: "pointer", marginBottom: "8px", width: "100%" }}>
        {showHint ? "Hide hint" : "💡 Show hint"}
      </button>
      {showHint && <div style={{ background: C.surface, borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}><p style={{ fontSize: "13px", color: C.text, margin: 0 }}>{q.hint}</p></div>}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={onBack} style={{ flex: 1, padding: "13px", background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>← Back</button>
        <button onClick={() => setChecked(true)} style={{ flex: 2, padding: "13px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check my answer</button>
        <button onClick={reset} style={{ flex: 1, padding: "13px", background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>Reset</button>
      </div>
      {checked && (
        <div style={{ background: allCorrect ? "#f0fdf4" : C.card, border: `1px solid ${allCorrect ? "#86efac" : C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: allCorrect ? "#15803d" : C.amber, marginBottom: "12px" }}>
            {allCorrect ? "🎉 All four stages complete! Great work." : "Here's how you did:"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {score.map(({ key, correct, yours, answer }) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: correct ? "#f0fdf4" : "#fff1f2", borderRadius: "8px" }}>
                <span style={{ fontSize: "13px", color: C.text, fontWeight: "600" }}>{HL[key]}</span>
                <span style={{ fontSize: "13px", color: C.muted }}>Yours: <strong style={{ color: correct ? "#15803d" : C.red }}>{yours}</strong></span>
                {!correct && <span style={{ fontSize: "13px", color: C.muted }}>Correct: <strong style={{ color: C.accent }}>{answer}</strong></span>}
                <span style={{ fontSize: "16px" }}>{correct ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
          {!allCorrect && (
            <button onClick={() => setShowAnswer(!showAnswer)} style={{ marginTop: "12px", width: "100%", padding: "10px", background: "transparent", border: `1px solid ${C.accent}`, borderRadius: "8px", color: C.accent, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {showAnswer ? "Hide correct box plot" : "Show correct box plot"}
            </button>
          )}
          {showAnswer && !allCorrect && (
            <div style={{ marginTop: "12px", background: C.surface, borderRadius: "10px", padding: "14px" }}>
              <BoxPlotSVG sets={[{ ...q.answer, label: "Correct answer", color: C.accent }]} scaleMin={q.scaleMin} scaleMax={q.scaleMax} unit={q.unit} showLabels={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}