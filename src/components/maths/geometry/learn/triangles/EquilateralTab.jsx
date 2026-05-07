import { C } from "../../../../../data/angles_data";
import { EquilateralSVG } from "../../shared/TriangleSVG";
import { ExamTip, RuleCard } from "../LearnUI";

export default function EquilateralTab() {
  return (
    <div>
      <RuleCard colour={C.green} colourDim={C.greenDim}
        icon="🔺" title="Equilateral triangle" rule="Three equal sides → all angles are 60°">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
          An equilateral triangle has all three sides equal (shown by single tick marks on
          all three sides) and all three angles equal to exactly 60°. No calculation needed
          — if you see three tick marks, write 60°.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EquilateralSVG width={200} height={160} />
        </div>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "8px 0 0" }}>
          60° + 60° + 60° = 180° ✓
        </p>
      </RuleCard>

      <ExamTip>
        The reason to write is: <strong>"All angles in an equilateral triangle are 60°"</strong>.
        This is a one-line answer — no algebra needed. If a question gives you an equilateral
        triangle and asks for an angle, the answer is always 60°.
      </ExamTip>
    </div>
  );
}