import React, { useState } from "react";
import { C, BUILD_QUESTIONS, TOLERANCE } from "./data";
import BoxPlotSVG from "./shared/BoxPlotSVG";
import CumFreqGraph from "./shared/CumFreqGraph";


function BottomNav({ onBack, onNext, nextLabel = "Next →", backLabel = "← Back", showBack = true }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      {showBack && (
        <button onClick={onBack} style={{ flex: 1, padding: "14px", background: "transparent", color: C.muted,
          border: `1.5px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          {backLabel}
        </button>
      )}
      {onNext && (
        <button onClick={onNext} style={{ flex: 1, padding: "14px", background: C.accent, color: C.bg,
          border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}

// ── Stage 0: Read the cumulative frequency graph ──────────────────────────
function StageReadGraph({ q, onBack, onComplete }) {
  const [revealed, setRevealed] = useState(false);

  const cf = q.cumFreq;
  const n  = q.rawData.length;

  // Work out which frequencies to read at
  const q1freq     = Math.ceil(n / 4);
  const medFreq    = Math.ceil(n / 2);
  const q3freq     = Math.ceil((3 * n) / 4);

  const readPoints = [
    { freq: q1freq,  label: `Q1 (position ${q1freq} of ${n})`,     value: q.answer.q1,     color: C.accent },
    { freq: medFreq, label: `Median (position ${medFreq} of ${n})`, value: q.answer.median, color: C.text },
    { freq: q3freq,  label: `Q3 (position ${q3freq} of ${n})`,      value: q.answer.q3,     color: C.accent },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 0 of 3 — Read the Graph</p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.purple}40`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, marginBottom: "6px" }}>What is a cumulative frequency graph?</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
          Instead of showing individual values, this graph builds up a running total. The y-axis shows "how many values are at or below this point." You can read off Q1, the median and Q3 directly from it.
        </p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: C.purple }}>How to read it:</strong> Find the frequency on the y-axis → draw a line across to the curve → drop straight down to the x-axis. That value is your answer.
        </p>
      </div>

      {/* The cumulative frequency graph */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>{q.label} — {q.question}</p>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>
          The dashed lines show where to read Q1, Median and Q3. Try reading the values yourself first — then reveal below to check.
        </p>
        <CumFreqGraph
          sets={[{ label: q.unit, color: C.accent, points: cf.points }]}
          totalFreq={cf.totalFreq}
          scaleMin={q.scaleMin}
          scaleMax={q.scaleMax}
          unit={q.unit}
          readPoints={readPoints}
        />
      </div>

      {/* Reveal the read-off values */}
      <button onClick={() => setRevealed(!revealed)} style={{ width: "100%", padding: "12px", background: revealed ? "#a78bfa30" : C.purple, color: revealed ? C.purple : C.bg, border: `1px solid ${C.purple}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "16px" }}>
        {revealed ? "Hide values" : "Reveal values from the graph"}
      </button>

      {revealed && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {readPoints.map((rp) => (
              <div key={rp.freq} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${rp.color}` }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: rp.color, margin: "0 0 2px" }}>{rp.label}</p>
                  <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>Read across from {rp.freq} on the y-axis → drop down to x-axis</p>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "800", color: rp.color, margin: 0 }}>{rp.value}</p>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${C.muted}` }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: C.muted, margin: "0 0 2px" }}>Min and Max — from the raw data</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>First and last values once ordered</p>
              </div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.muted, margin: 0 }}>{q.answer.min} – {q.answer.max}</p>
            </div>
          </div>

          <div style={{ background: "#a78bfa20", border: `1px solid ${C.purple}40`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: C.purple, margin: 0, lineHeight: 1.6 }}>
              💡 <strong>The connection:</strong> In Stage 1 you'll order the raw data and see exactly why these positions give you Q1, Median and Q3 — the graph and the ordered list tell the same story.
            </p>
          </div>

          <BottomNav onBack={onBack} onNext={onComplete} backLabel="← Back to questions" nextLabel="Continue to Stage 1 — Order the data →" />
        </div>
      )}
    </div>
  );
}

// ── Stage 1: Tap to order ─────────────────────────────────────────────────
function StageOrder({ q, onBack, onComplete }) {
  const shuffled = React.useMemo(() => [...q.rawData].sort(() => Math.random() - 0.5), [q]);
  const [remaining, setRemaining] = useState(shuffled);
  const [ordered,   setOrdered]   = useState([]);
  const [shake,     setShake]     = useState(null);
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const n = q.rawData.length;
  const q1idx  = Math.floor(n / 4);
  const midIdx = Math.floor(n / 2);
  const q3idx  = Math.floor((3 * n) / 4);

  const handleTap = (val, idx) => {
    if (val === sorted[ordered.length]) {
      setOrdered(prev => [...prev, val]);
      setRemaining(prev => prev.filter((_, i) => i !== idx));
    } else {
      setShake(idx);
      setTimeout(() => setShake(null), 500);
    }
  };
  const allDone = ordered.length === n;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 1 of 3 — Order It</p>
        <span style={{ fontSize: "12px", color: C.muted }}>{ordered.length} / {n} placed</span>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{q.label} — {q.question}</p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>Tap the numbers <strong>one at a time</strong>, smallest first.</p>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", minHeight: "56px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ordered (smallest → largest)</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "32px" }}>
          {ordered.map((val, i) => {
            const isMin = i === 0; const isMax = i === n - 1;
            const isMedian = i === midIdx; const isQ1 = i === q1idx; const isQ3 = i === q3idx;
            const hl = isMedian ? C.text : (isQ1 || isQ3) ? C.accent : (isMin || isMax) ? C.muted : null;
            return (
              <div key={i} style={{ padding: "5px 10px", borderRadius: "6px", background: hl ? hl + "20" : C.card, border: `1px solid ${hl || C.border}`, fontSize: "13px", fontWeight: hl ? "700" : "400", color: hl || C.text }}>
                {val}
                {isMin    && <span style={{ fontSize: "9px", display: "block", color: C.muted,  lineHeight: 1 }}>min</span>}
                {isQ1     && <span style={{ fontSize: "9px", display: "block", color: C.accent, lineHeight: 1 }}>Q1</span>}
                {isMedian && <span style={{ fontSize: "9px", display: "block", color: C.white,  lineHeight: 1 }}>median</span>}
                {isQ3     && <span style={{ fontSize: "9px", display: "block", color: C.accent, lineHeight: 1 }}>Q3</span>}
                {isMax    && <span style={{ fontSize: "9px", display: "block", color: C.muted,  lineHeight: 1 }}>max</span>}
              </div>
            );
          })}
          {ordered.length === 0 && <span style={{ fontSize: "12px", color: C.muted, fontStyle: "italic" }}>Tap a number below to start…</span>}
        </div>
      </div>
      {!allDone && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {remaining.map((val, i) => (
            <button key={i} onClick={() => handleTap(val, i)} style={{ padding: "10px 16px", borderRadius: "8px", background: shake === i ? "#ef444420" : C.card, border: `1px solid ${shake === i ? C.red : C.border}`, color: shake === i ? C.red : C.text, fontSize: "14px", fontWeight: "600", cursor: "pointer", transform: shake === i ? "translateX(4px)" : "none", transition: "all 0.1s" }}>
              {val}
            </button>
          ))}
        </div>
      )}
      {allDone && (
        <div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#15803d", margin: "0 0 4px" }}>✓ Perfectly ordered!</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>Notice how Min, Q1, Median, Q3 and Max match exactly what the graph told you in Stage 0.</p>
          </div>
          <BottomNav onBack={onBack} onNext={onComplete} nextLabel="Continue to Stage 2 →" />
        </div>
      )}
    </div>
  );
}

// ── Stage 2: Find the 5 values ────────────────────────────────────────────
function StageFive({ q, onBack, onComplete }) {
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const KEYS   = ["min", "q1", "median", "q3", "max"];
  const LABELS = { min: "Minimum", q1: "Q1 (Lower Quartile)", median: "Median", q3: "Q3 (Upper Quartile)", max: "Maximum" };
  const DESCS  = { min: "The smallest value", q1: "The middle of the lower half", median: "The middle value of the whole list", q3: "The middle of the upper half", max: "The largest value" };
  const [inputs,  setInputs]  = useState({ min: "", q1: "", median: "", q3: "", max: "" });
  const [checked, setChecked] = useState(false);
  const results = KEYS.map(k => ({ key: k, ok: parseInt(inputs[k]) === q.answer[k], correct: q.answer[k] }));
  const allOk   = results.every(r => r.ok);

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 2 of 3 — Find the 5 Values</p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your ordered list</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sorted.map((val, i) => (
            <div key={i} style={{ padding: "5px 10px", borderRadius: "6px", background: C.card, border: `1px solid ${C.border}`, fontSize: "13px", color: C.text }}>
              <span style={{ fontSize: "10px", color: C.muted, display: "block", lineHeight: 1 }}>{i + 1}</span>{val}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {KEYS.map(k => {
          const r = results.find(r => r.key === k);
          return (
            <div key={k} style={{ background: checked ? (r.ok ? "#f0fdf4" : "#fff1f2") : C.card, border: `1px solid ${checked ? (r.ok ? "#86efac" : "#fca5a5") : C.border}`, borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 2px" }}>{LABELS[k]}</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>{DESCS[k]}</p>
              </div>
              <input type="number" value={inputs[k]} onChange={e => setInputs(prev => ({ ...prev, [k]: e.target.value }))} disabled={checked && r.ok} placeholder="?" style={{ width: "64px", padding: "8px", textAlign: "center", background: C.surface, border: `1px solid ${checked ? (r.ok ? "#16a34a" : C.red) : C.border}`, borderRadius: "8px", color: checked ? (r.ok ? "#15803d" : C.red) : C.text, fontSize: "16px", fontWeight: "700" }} />
              {checked && <span style={{ fontSize: "18px", flexShrink: 0 }}>{r.ok ? "✓" : "✗"}</span>}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <BottomNav onBack={onBack} onNext={() => setChecked(true)} nextLabel="Check my answers" />
      ) : (
        <BottomNav
          onBack={onBack}
          onNext={() => { if (allOk) onComplete(); else setChecked(false); }}
          nextLabel={allOk ? "Continue to Stage 3 →" : "Try again"}
        />
      )}
    </div>
  );
}

// ── Stage 3: Drag to place ────────────────────────────────────────────────
function StageDrag({ q, onBack }) {
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

// ── BuildIt orchestrator ──────────────────────────────────────────────────
export default function BuildIt() {
  const [qIdx,  setQIdx]  = useState(null);
  const [stage, setStage] = useState(0); // 0=graph, 1=order, 2=find values, 3=place

  const q = qIdx !== null ? BUILD_QUESTIONS[qIdx] : null;

  if (qIdx === null) {
    return (
      <div>
        {/* What is this section for? */}
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
          borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>
            🎯 What are you learning to do?
          </p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 8px" }}>
            In the exam, you'll be given a set of data and asked to <strong>draw a box plot</strong> from scratch. That means finding the five key values — minimum, Q1, median, Q3, maximum — and placing them accurately on a number line.
          </p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
            This section walks you through every step of that process, starting with reading a cumulative frequency graph, just like in the real Edexcel paper.
          </p>
        </div>

        {/* 4 stages explainer */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
            Each question has 4 stages:
          </p>
          {[
            { icon: "📈", label: "Read the graph",   desc: "Read Q1, Median and Q3 off a cumulative frequency graph" },
            { icon: "1️⃣",  label: "Order the data",  desc: "Sort the raw values from smallest to largest" },
            { icon: "🔢", label: "Find the values",  desc: "Identify Min, Q1, Median, Q3 and Max" },
            { icon: "📦", label: "Build the box plot", desc: "Drag the values into place on a number line" },
          ].map(({ icon, label, desc }) => (
            <div key={label} style={{ display: "flex", gap: "10px", padding: "7px 0",
              borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
              <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Question list */}
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
          Choose a question
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BUILD_QUESTIONS.map((bq, i) => (
            <button key={bq.id} onClick={() => { setQIdx(i); setStage(0); }}
              style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: "12px", cursor: "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px",
                  borderRadius: "99px", marginRight: "10px",
                  color: i === 0 ? C.accent : i === 1 ? C.amber : C.red,
                  border: `1px solid ${i === 0 ? C.accent : i === 1 ? C.amber : C.red}40` }}>
                  {bq.label}
                </span>
                <span style={{ fontSize: "13px", color: C.text }}>{bq.question}</span>
              </span>
              <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>→</span>
            </button>
          ))}
        </div>

        {/* Exam connection tip */}
        <div style={{ background: "#fffbeb", border: "1px solid #d97706",
          borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
          <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
            ⭐ <strong>Exam tip:</strong> Each question starts with a cumulative frequency graph — the same type used in Q8 and Q9 of the Edexcel paper. Getting comfortable reading these graphs is one of the highest-value skills you can practise.
          </p>
        </div>
      </div>
    );
  }

  const STAGES = [
    { n: 0, label: "Graph",       color: C.purple },
    { n: 1, label: "Order It",    color: C.accent },
    { n: 2, label: "Find Values", color: C.accent },
    { n: 3, label: "Place It",    color: C.accent },
  ];

  const StageBar = () => (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
      {STAGES.map(({ n, label, color }) => (
        <div key={n} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", background: stage >= n ? (stage === n ? color : color + "30") : C.surface, border: `1px solid ${stage >= n ? color : C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: stage >= n ? (stage === n ? (n === 0 ? C.bg : C.bg) : color) : C.muted, margin: 0, lineHeight: 1.3 }}>{n === 0 ? "📈" : n}. {label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <button onClick={() => setQIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back to questions</button>
      <StageBar />
      {stage === 0 && <StageReadGraph q={q} onBack={() => { setQIdx(null); setStage(0); }} onComplete={() => setStage(1)} />}
      {stage === 1 && <StageOrder     q={q} onBack={() => setStage(0)} onComplete={() => setStage(2)} />}
      {stage === 2 && <StageFive      q={q} onBack={() => setStage(1)} onComplete={() => setStage(3)} />}
      {stage === 3 && <StageDrag      q={q} onBack={() => setStage(2)} />}
    </div>
  );
}