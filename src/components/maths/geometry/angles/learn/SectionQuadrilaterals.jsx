import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import { ExamTip, RuleCard, SubTabBar } from "./LearnUI";
import QuadSVG               from "../shared/QuadSVG";
import { SHAPES }            from "./quadrilaterals/QUAD_SHAPES";
import ShapeCard             from "./quadrilaterals/ShapeCard";
import KiteRhombusComparison from "./quadrilaterals/KiteRhombusComparison";
import SumExplainer          from "./quadrilaterals/SumExplainer";
import WorkedExample         from "./quadrilaterals/WorkedExample";
import QuadDrill             from "./quadrilaterals/QuadDrill";

const TABS = [
  { id: "rule",   label: "The rule" },
  { id: "shapes", label: "Shapes"   },
  { id: "drill",  label: "🎯 Drill" },
];

export default function SectionQuadrilaterals({ nav }) {
  const [activeTab,   setActiveTab]   = useState("rule");
  const [activeShape, setActiveShape] = useState("kite");
  const shape = SHAPES.find(s => s.id === activeShape);

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Quadrilateral angle rules appear in almost every multi-step geometry question —
          often combined with triangles, parallel lines, or circle theorems. The kite
          in particular catches students out because its angle property is easy to miss.
        </p>
      </div>

      <SubTabBar tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === "rule" && (
        <div>
          <RuleCard colour={C.accent} colourDim={C.accentDim}
            icon="⬡" title="The rule"
            rule="Angles in any quadrilateral add up to 360°">
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
              It doesn't matter what kind of quadrilateral — square, rectangle, parallelogram,
              kite, rhombus, or any irregular shape. As long as it has <strong>4 sides</strong>,
              the four interior angles always sum to exactly 360°.
            </p>
          </RuleCard>
          <SumExplainer />
          <WorkedExample />
          <ExamTip>
            The reason to write is: <strong>"Angles in a quadrilateral add up to 360°"</strong>.
            Always write the full sentence. On Edexcel, writing "quad = 360" or "4 sides = 360"
            will not get the mark.
          </ExamTip>
        </div>
      )}

      {activeTab === "shapes" && (
        <div>
          <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 10px", lineHeight: 1.6 }}>
            Each quadrilateral has its own special properties. Facts are listed
            <strong> sides first, then angles</strong> so you can always compare them clearly.
          </p>
          <KiteRhombusComparison />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {SHAPES.map(s => (
              <ShapeCard key={s.id} shape={s}
                selected={activeShape === s.id}
                onClick={() => setActiveShape(s.id)} />
            ))}
          </div>
          {shape && (
            <div>
              <div style={{ background: shape.colour + "12",
                border: `1.5px solid ${shape.colour}40`,
                borderRadius: "12px", padding: "14px 16px 28px", marginBottom: "12px" }}>
                <p style={{ fontSize: "14px", fontWeight: "800", color: shape.colour,
                  margin: "0 0 4px" }}>{shape.icon} {shape.name}</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: C.text,
                  margin: "0 0 12px" }}>{shape.rule}</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <QuadSVG
                    points={shape.points} colour={shape.colour}
                    colourDim={shape.colour + "20"}
                    labels={shape.vertexLabels} angles={shape.angleLabels}
                  />
                </div>
                <ul style={{ paddingLeft: "18px", margin: 0 }}>
                  {shape.facts.map((f, i) => (
                    <li key={i} style={{ fontSize: "13px", color: C.text,
                      lineHeight: 1.7, marginBottom: "4px" }}>{f}</li>
                  ))}
                </ul>
              </div>
              <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
                borderRadius: "10px", padding: "10px 14px" }}>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
                  ⭐ <strong>Exam reason to write:</strong> "{shape.examPhrase}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "drill" && <QuadDrill />}

      {nav}
    </div>
  );
}