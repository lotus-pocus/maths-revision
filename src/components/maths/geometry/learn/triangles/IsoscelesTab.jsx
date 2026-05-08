import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import { IsoscelesSVG } from "../../shared/TriangleSVG";
import { ExamTip, RuleCard, StepByStepWorking } from "../LearnUI";

export default function IsoscelesTab() {
  const [apexAngle, setApexAngle] = useState(50);
  const baseAngle = Math.round((180 - apexAngle) / 2);

  return (
    <div>
      <RuleCard colour={C.amber} colourDim={C.amberDim}
        icon="⚖️" title="Isosceles triangle" rule="Two equal sides → two equal base angles">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
          In an isosceles triangle, the two sides of equal length are shown with tick marks.
          The angles opposite those equal sides — the base angles — are always equal.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IsoscelesSVG apexAngle={apexAngle} colour={C.amber} colourDim={C.amberDim}
            unknownAngle={`${baseAngle}°`} unknownAt={null} width={220} height={160} />
        </div>
      </RuleCard>

      {/* Interactive slider */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>
          Try it — drag the apex angle
        </p>
        <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 12px" }}>
          Watch how the base angles change to keep the total at 180°
        </p>
        <input type="range" min={20} max={140} value={apexAngle}
          onChange={e => setApexAngle(Number(e.target.value))}
          style={{ width: "100%", marginBottom: "12px", accentColor: C.amber }} />
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "Apex angle",      value: `${apexAngle}°`,              colour: C.amber },
            { label: "Each base angle", value: `${baseAngle}°`,              colour: C.accent },
            { label: "Total",           value: `180°`, colour: C.green },
          ].map(({ label, value, colour }) => (
            <div key={label} style={{ flex: 1, background: C.surface,
              border: `1.5px solid ${colour}40`, borderRadius: "10px",
              padding: "10px 8px", textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 4px",
                textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <p style={{ fontSize: "18px", fontWeight: "800", color: colour, margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Worked example */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 12px" }}>
          Worked example — find angle x
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <IsoscelesSVG apexAngle={40} colour={C.amber} colourDim={C.amberDim}
            unknownAngle="x" unknownAt="b" width={220} height={160} />
        </div>
        <StepByStepWorking steps={[
          { instruction: "Identify that AB = AC (tick marks), so this is isosceles.",
            working: "Triangle ABC is isosceles with AB = AC",
            reason: "Tick marks show the equal sides" },
          { instruction: "Base angles are equal — both are x.",
            working: "Angle ABC = Angle ACB = x",
            reason: "Base angles of an isosceles triangle are equal" },
          { instruction: "All three angles sum to 180°.",
            working: "40° + x + x = 180°",
            reason: "Angles in a triangle add up to 180°" },
          { instruction: "Solve for x.",
            working: "2x = 140°  →  x = 70°", reason: null },
        ]} />
      </div>

      <ExamTip>
        The reasons to write are: <strong>"Base angles of an isosceles triangle are equal"</strong>{" "}
        AND <strong>"Angles in a triangle add up to 180°"</strong>. You'll almost always need
        both in the same question. The tick marks are your signal that a triangle is isosceles.
      </ExamTip>
    </div>
  );
}