import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import { QuadDiagonalSVG } from "../../shared/QuadDiagonalSVG";

export default function SumExplainer() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
        💡 Why do quadrilateral angles add to 360°?
      </p>
      <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
        Draw a diagonal across any quadrilateral — it splits into <strong>two triangles</strong>.
        Each triangle's angles sum to 180°. Two triangles = 2 × 180° = <strong>360°</strong>.
      </p>
      <button onClick={() => setRevealed(r => !r)} style={{
        padding: "8px 16px", borderRadius: "8px", border: `1.5px solid ${C.accent}`,
        background: revealed ? C.accentDim : "#fff", color: C.accent,
        fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: revealed ? "12px" : 0,
      }}>
        {revealed ? "Hide working" : "Show me ▾"}
      </button>
      {revealed && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px",
            background: "#fff", borderRadius: "8px", padding: "8px",
            border: `1px solid ${C.border}` }}>
            <QuadDiagonalSVG />
          </div>
          <div style={{ background: C.accentDim, borderRadius: "8px", padding: "12px" }}>
            {[
              "Draw diagonal AC across quadrilateral ABCD.",
              "Triangle ABC: angles A₁ + B + C₁ = 180°",
              "Triangle ACD: angles A₂ + C₂ + D = 180°",
              "Total: (A₁+A₂) + B + (C₁+C₂) + D = 360°",
              "Which is: angle A + B + C + D = 360° ✓",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%",
                  background: C.accent, color: "#fff", fontSize: "10px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}