import { C } from "../../../../../../data/angles_data";

export default function KiteRhombusComparison() {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${C.border}`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
        🤔 Kite vs Rhombus — what's the difference?
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flex: 1, background: C.purpleDim, border: `1.5px solid ${C.purple}40`,
          borderRadius: "10px", padding: "10px 12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.purple, margin: "0 0 6px" }}>🪁 Kite</p>
          <p style={{ fontSize: "12px", color: C.text, margin: "0 0 4px", lineHeight: 1.5 }}>
            <strong>2 pairs</strong> of equal sides
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 4px", lineHeight: 1.5 }}>
            AB = AD ✓<br />CB = CD ✓<br />AB ≠ CB ✗
          </p>
          <p style={{ fontSize: "11px", color: C.purple, margin: 0, lineHeight: 1.5 }}>
            The two pairs are <strong>different</strong> lengths
          </p>
        </div>
        <div style={{ flex: 1, background: C.redDim, border: `1.5px solid ${C.red}40`,
          borderRadius: "10px", padding: "10px 12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.red, margin: "0 0 6px" }}>◆ Rhombus</p>
          <p style={{ fontSize: "12px", color: C.text, margin: "0 0 4px", lineHeight: 1.5 }}>
            <strong>All 4</strong> sides equal
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 4px", lineHeight: 1.5 }}>
            AB = BC ✓<br />BC = CD ✓<br />CD = DA ✓
          </p>
          <p style={{ fontSize: "11px", color: C.red, margin: 0, lineHeight: 1.5 }}>
            Every side is the <strong>same</strong> length
          </p>
        </div>
      </div>
      <p style={{ fontSize: "11px", color: C.muted, margin: "10px 0 0", lineHeight: 1.5,
        borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>
        💡 A rhombus is like a squashed square. A kite is like two different triangles joined along their base.
      </p>
    </div>
  );
}