import React, { useState } from "react";
import { C } from "../data";
import BottomNav from "./BottomNav";

export default function StageOrder({ q, onBack, onComplete }) {
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