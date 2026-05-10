import { C } from "../../../../../../data/angles_data";

// ── KiteRhombusComparison ─────────────────────────────────────────────────
// Highlights the key difference between kite and rhombus —
// the most common point of confusion in Edexcel questions.
export default function KiteRhombusComparison() {
  const col = C.purple;
  const colDim = C.purpleDim;
  return (
    <div style={{
      background: colDim, border: `1.5px solid ${col}40`,
      borderRadius: "12px", padding: "12px 14px", marginBottom: "16px",
    }}>
      <p style={{ fontSize: "12px", fontWeight: "700", color: col,
        textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
        ⚠️ Common confusion — kite vs rhombus
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{
          flex: 1, background: "#fff", borderRadius: "8px",
          padding: "10px 12px", border: `1px solid ${C.purple}30`,
        }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.purple, margin: "0 0 4px" }}>
            🪁 Kite
          </p>
          <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
            2 pairs of equal <strong>adjacent</strong> sides.<br />
            The two pairs are <strong>different</strong> lengths.
          </p>
        </div>
        <div style={{
          flex: 1, background: "#fff", borderRadius: "8px",
          padding: "10px 12px", border: `1px solid ${C.red}30`,
        }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.red, margin: "0 0 4px" }}>
            ◆ Rhombus
          </p>
          <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
            <strong>All 4</strong> sides equal.<br />
            Opposite sides are parallel.
          </p>
        </div>
      </div>
    </div>
  );
}