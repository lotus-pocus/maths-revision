import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import { TriangleSVG } from "../../shared/TriangleSVG";
import { ExamTip, RuleCard } from "../LearnUI";

export default function TriangleSumTab() {
  const [showWorking, setShowWorking] = useState(false);
  return (
    <div>
      <RuleCard colour={C.accent} colourDim={C.accentDim}
        icon="📐" title="The rule" rule="Angles in any triangle add up to 180°">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
          It doesn't matter what shape the triangle is — scalene, isosceles, equilateral,
          right-angled — the three interior angles always sum to exactly 180°.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TriangleSVG angles={{ a: 70, b: 55, c: 55 }}
            colour={C.accent} colourDim={C.accentDim} width={220} height={160} />
        </div>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "8px 0 0" }}>
          70° + 55° + 55° = 180° ✓
        </p>
      </RuleCard>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 12px" }}>
          Worked example — find angle x
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <TriangleSVG angles={{ a: 48, b: 75, c: null }} unknownAngle="x" unknownAt="c"
            colour={C.accent} colourDim={C.accentDim} width={220} height={160} />
        </div>
        <button onClick={() => setShowWorking(w => !w)}
          style={{ width: "100%", padding: "10px", borderRadius: "10px",
            border: `1.5px solid ${C.accent}`,
            background: showWorking ? C.accentDim : C.surface,
            fontSize: "13px", fontWeight: "700", color: C.accent, cursor: "pointer",
            marginBottom: showWorking ? "12px" : "0" }}>
          {showWorking ? "Hide working" : "Show working ▾"}
        </button>
        {showWorking && (
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
            borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.6 }}>
              Angles in a triangle add up to 180°:
            </p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent,
              margin: "0 0 4px", fontFamily: "monospace" }}>x = 180° − 48° − 75°</p>
            <p style={{ fontSize: "16px", fontWeight: "800", color: C.accent,
              margin: 0, fontFamily: "monospace" }}>x = 57°</p>
          </div>
        )}
      </div>

      <ExamTip>
        The reason to write is: <strong>"Angles in a triangle add up to 180°"</strong>.
        Always subtract the known angles from 180 — never add them and hope they reach 180.
      </ExamTip>
    </div>
  );
}