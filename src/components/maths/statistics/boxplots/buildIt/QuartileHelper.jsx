import { useState } from "react";
import { C } from "../data";

export default function QuartileHelper({ sorted, which, onClose }) {
  const [tab, setTab] = useState("split"); // "split" | "position"
  const n    = sorted.length;
  const half = Math.floor(n / 2);
  const isQ1 = which === "q1";

  // ── Split-the-list method (Edexcel preferred) ──────────────────────────
  const lowerHalf = sorted.slice(0, half);
  const upperHalf = n % 2 === 0 ? sorted.slice(half) : sorted.slice(half + 1);
  const half2     = isQ1 ? lowerHalf : upperHalf;
  const halfName  = isQ1 ? "lower" : "upper";
  const midIdx    = Math.floor(half2.length / 2);
  const splitResult = half2.length % 2 === 1
    ? half2[midIdx]
    : (half2[midIdx - 1] + half2[midIdx]) / 2;

  // ── Position formula method ────────────────────────────────────────────
  // Q1 pos = (n+1)/4,  Q3 pos = 3(n+1)/4  (1-indexed)
  const posRaw    = isQ1 ? (n + 1) / 4 : 3 * (n + 1) / 4;
  const posLow    = Math.floor(posRaw);   // lower index (1-based → 0-based: posLow-1)
  const posHigh   = Math.ceil(posRaw);
  const isWhole   = posRaw === posLow;
  const posResult = isWhole
    ? sorted[posLow - 1]
    : (sorted[posLow - 1] + sorted[posHigh - 1]) / 2;

  const methodsAgree = splitResult === posResult;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "20px", maxWidth: "400px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.accent, margin: 0 }}>
            How to find {isQ1 ? "Q1" : "Q3"}
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: C.muted, lineHeight: 1 }}>✕</button>
        </div>

        {/* Method tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", background: "#f3f4f6", borderRadius: "10px", padding: "4px" }}>
          {[
            { id: "split",    label: "Split the list" },
            { id: "position", label: "Position formula" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "8px", borderRadius: "7px", border: "none", cursor: "pointer",
              background: tab === id ? C.accent : "transparent",
              color: tab === id ? "#fff" : C.muted,
              fontSize: "12px", fontWeight: "700", transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {/* ── SPLIT METHOD ── */}
        {tab === "split" && (
          <>
            <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`, borderRadius: "8px", padding: "8px 12px", marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Edexcel preferred method</p>
              <p style={{ fontSize: "11px", color: C.text, margin: 0, lineHeight: 1.5 }}>Split the ordered list at the median. Find the middle of the {halfName} half. Use this in your exam.</p>
            </div>

            {/* Step 1 */}
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                Step 1 — ordered list ({n} values)
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {sorted.map((v, i) => {
                  const isMedian = n % 2 === 1 && i === half;
                  const inTarget = isQ1 ? i < half : (n % 2 === 0 ? i >= half : i > half);
                  return (
                    <div key={i} style={{
                      width: "34px", height: "30px", borderRadius: "6px",
                      background: isMedian ? "#e5e7eb" : inTarget ? C.accentDim : "#f9fafb",
                      border: `1.5px solid ${isMedian ? C.muted : inTarget ? C.accent : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700",
                      color: isMedian ? C.muted : inTarget ? C.accent : C.text,
                      opacity: isMedian ? 0.5 : 1,
                    }}>{v}</div>
                  );
                })}
              </div>
              <p style={{ fontSize: "11px", color: C.muted, margin: "5px 0 0" }}>
                Highlighted: the <strong>{halfName} half</strong>{n % 2 === 1 ? " (median excluded)" : ""}
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                Step 2 — middle of the {halfName} half
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                {half2.map((v, i) => {
                  const isMiddle = half2.length % 2 === 1 ? i === midIdx : (i === midIdx - 1 || i === midIdx);
                  return (
                    <div key={i} style={{
                      width: "34px", height: "30px", borderRadius: "6px",
                      background: isMiddle ? C.accentDim : "#f9fafb",
                      border: `1.5px solid ${isMiddle ? C.accent : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700",
                      color: isMiddle ? C.accent : C.text,
                    }}>{v}</div>
                  );
                })}
              </div>
              {half2.length % 2 === 0 && (
                <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 4px" }}>
                  Even number of values → average the two middle ones: ({half2[midIdx - 1]} + {half2[midIdx]}) ÷ 2
                </p>
              )}
            </div>

            {/* Answer */}
            <div style={{ background: C.accentDim, border: `1.5px solid ${C.accent}`, borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: 0 }}>{isQ1 ? "Q1" : "Q3"} =</p>
              <p style={{ fontSize: "22px", fontWeight: "800", color: C.accent, margin: 0 }}>{splitResult}</p>
            </div>
          </>
        )}

        {/* ── POSITION FORMULA ── */}
        {tab === "position" && (
          <>
            <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Shortcut — often seen online & in class</p>
              <p style={{ fontSize: "11px", color: C.text, margin: 0, lineHeight: 1.5 }}>Use a formula to find which <em>position</em> in the list holds {isQ1 ? "Q1" : "Q3"}, then read off the value.</p>
            </div>

            {/* Formula */}
            <div style={{ background: "#fff", border: "1.5px solid #c4b5fd", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {isQ1 ? "Q1" : "Q3"} position
              </p>
              <p style={{ fontSize: "18px", fontWeight: "800", color: C.text, margin: "0 0 4px", fontFamily: "monospace" }}>
                {isQ1 ? "(n + 1) ÷ 4" : "3 × (n + 1) ÷ 4"}
              </p>
              <p style={{ fontSize: "13px", color: C.muted, margin: 0 }}>
                = {isQ1 ? `(${n} + 1) ÷ 4` : `3 × (${n} + 1) ÷ 4`} = <strong style={{ color: "#7c3aed" }}>{posRaw}</strong>
              </p>
            </div>

            {/* What the position means */}
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                Position {posRaw} in the ordered list
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {sorted.map((v, i) => {
                  const pos1 = i + 1; // 1-based
                  const highlight = isWhole ? pos1 === posLow : (pos1 === posLow || pos1 === posHigh);
                  return (
                    <div key={i} style={{
                      width: "34px", height: "30px", borderRadius: "6px",
                      background: highlight ? "#f5f3ff" : "#f9fafb",
                      border: `1.5px solid ${highlight ? "#7c3aed" : C.border}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", fontWeight: "700",
                      color: highlight ? "#7c3aed" : C.text,
                    }}>
                      <span style={{ fontSize: "8px", color: highlight ? "#7c3aed" : C.muted, lineHeight: 1 }}>{pos1}</span>
                      {v}
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "11px", color: C.muted, margin: "5px 0 0" }}>
                {isWhole
                  ? `Position ${posRaw} is a whole number → read off the ${posRaw}${posRaw === 1 ? "st" : posRaw === 2 ? "nd" : posRaw === 3 ? "rd" : "th"} value directly`
                  : `Position ${posRaw} is between positions ${posLow} and ${posHigh} → average those two values`}
              </p>
            </div>

            {!isWhole && (
              <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 10px" }}>
                ({sorted[posLow - 1]} + {sorted[posHigh - 1]}) ÷ 2 = <strong style={{ color: "#7c3aed" }}>{posResult}</strong>
              </p>
            )}

            {/* Answer */}
            <div style={{ background: "#f5f3ff", border: "1.5px solid #7c3aed", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed", margin: 0 }}>{isQ1 ? "Q1" : "Q3"} =</p>
              <p style={{ fontSize: "22px", fontWeight: "800", color: "#7c3aed", margin: 0 }}>{posResult}</p>
            </div>

            {/* Agree / disagree callout */}
            {methodsAgree ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "10px 12px" }}>
                <p style={{ fontSize: "12px", color: "#15803d", margin: 0, lineHeight: 1.6 }}>
                  ✓ <strong>Both methods agree</strong> — for this list (n = {n}), the position formula and the split method give the same answer: <strong>{splitResult}</strong>.
                </p>
              </div>
            ) : (
              <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px" }}>
                <p style={{ fontSize: "12px", color: "#92400e", margin: "0 0 4px", fontWeight: "700" }}>⚠️ The two methods give different answers here</p>
                <p style={{ fontSize: "12px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>
                  Split method → <strong>{splitResult}</strong> &nbsp;|&nbsp; Position formula → <strong>{posResult}</strong><br />
                  This happens with certain list sizes. <strong>In a GCSE exam, use the split method</strong> — Edexcel mark schemes are written around it. Either answer would likely be accepted, but split is safer.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}