import React, { useState } from "react";
import { C } from "../data";

const MIN = 14;
const REAL_MAX = 91;
const MEDIAN = 51; // fixed — removing outliers barely changes it

export default function MidrangeExplorer() {
  const [maxVal, setMaxVal] = useState(REAL_MAX);

  const midrange = Math.round((MIN + maxVal) / 2);
  const midrangeShift = midrange - Math.round((MIN + REAL_MAX) / 2);

  return (
    <div>
      <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.7, margin: "0 0 16px" }}>
        The <strong>midrange</strong> is the simplest possible "average" — just the highest and lowest score divided by 2. Let's see why it's a bad idea.
      </p>

      {/* Starting values */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
        <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: "12px", padding: "12px 14px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Min (fixed)</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: C.text, margin: 0 }}>{MIN}</p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>1 student scored this</p>
        </div>
        <div style={{ background: "#fff", border: `2px solid #d97706`, borderRadius: "12px", padding: "12px 14px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#d97706", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Max (drag me)</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "#d97706", margin: 0 }}>{maxVal}</p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>1 student scored this</p>
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#d97706", margin: 0 }}>Drag to change the top score</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>91 → 200</p>
        </div>
        <input
          type="range"
          min={91}
          max={200}
          value={maxVal}
          onChange={e => setMaxVal(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#d97706", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: C.muted }}>91 (real max)</span>
          <span style={{ fontSize: "11px", color: C.muted }}>200</span>
        </div>
      </div>

      {/* Result comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
        {/* Midrange */}
        <div style={{
          background: midrangeShift > 10 ? "#fef2f2" : "#fff8f0",
          border: `2px solid ${midrangeShift > 10 ? "#fca5a5" : "#d97706"}`,
          borderRadius: "12px", padding: "14px", textAlign: "center"
        }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#d97706", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Midrange</p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px" }}>({MIN} + {maxVal}) ÷ 2</p>
          <p style={{ fontSize: "30px", fontWeight: "800", color: midrangeShift > 10 ? "#dc2626" : "#d97706", margin: "0 0 6px" }}>{midrange}</p>
          {midrangeShift !== 0 && (
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626", margin: 0 }}>
              ↑ {midrangeShift} more than before
            </p>
          )}
          {midrangeShift === 0 && (
            <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>the "typical" score?</p>
          )}
        </div>

        {/* Median */}
        <div style={{ background: "#ecfdf5", border: `2px solid #6ee7b7`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Median</p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px" }}>middle of all 60 scores</p>
          <p style={{ fontSize: "30px", fontWeight: "800", color: C.accent, margin: "0 0 6px" }}>{MEDIAN}</p>
          <p style={{ fontSize: "12px", color: "#059669", margin: 0, fontWeight: "700" }}>✓ unchanged</p>
        </div>
      </div>

      {/* Explanation */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
          <strong>One student</strong> — the highest scorer — is doing all the work in the midrange calculation. The other 59 students have no say. Move that one score from 91 to 200 and the "typical" result jumps by {Math.round((MIN + 200) / 2) - Math.round((MIN + REAL_MAX) / 2)} marks.
        </p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
          The median stays at {MEDIAN} because it's anchored to the <strong>middle of the data</strong>, not the extremes. It represents the student in position 30 — a real result, from a real student, unaffected by outliers.
        </p>
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px" }}>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
          ⭐ <strong>The rule:</strong> Any measure that depends only on the extreme values (min and max) is fragile. One unusual result can make it meaningless. The box plot is built around the median and quartiles — values that represent the bulk of your data.
        </p>
      </div>
    </div>
  );
}