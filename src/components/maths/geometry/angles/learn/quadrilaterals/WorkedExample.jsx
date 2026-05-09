import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import { WorkedExampleSVG } from "../../shared/QuadDiagonalSVG";

export default function WorkedExample() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
        Worked example — find angle x
      </p>
      <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
        A quadrilateral has angles 95°, 110°, 72° and x°. Find x.
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px",
        background: "#fff", borderRadius: "8px", padding: "8px",
        border: `1px solid ${C.border}` }}>
        <WorkedExampleSVG showAnswer={show} />
      </div>
      <button onClick={() => setShow(s => !s)} style={{
        padding: "8px 16px", borderRadius: "8px", border: `1.5px solid ${C.accent}`,
        background: show ? C.accentDim : "#fff", color: C.accent,
        fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: show ? "12px" : 0,
      }}>
        {show ? "Hide working" : "Show working ▾"}
      </button>
      {show && (
        <div>
          {[
            { step: "All angles in a quadrilateral add up to 360°", working: "95° + 110° + 72° + x° = 360°" },
            { step: "Add the known angles",                         working: "277° + x° = 360°"             },
            { step: "Solve for x",                                  working: "x = 360° − 277° = 83°"        },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: "8px", padding: "10px 12px", marginBottom: "6px" }}>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 2px" }}>{s.step}</p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: 0,
                fontFamily: "monospace" }}>{s.working}</p>
            </div>
          ))}
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`,
            borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.green, margin: 0 }}>✓ x = 83°</p>
          </div>
        </div>
      )}
    </div>
  );
}