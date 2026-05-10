import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import { SubTabBar }  from "./LearnUI";
import HowItWorks     from "./chaining/HowItWorks";
import WorkedExamples from "./chaining/WorkedExamples";
import ReasonDrill    from "./chaining/ReasonDrill";

const TABS = [
  { id: "how",      label: "How it works"    },
  { id: "examples", label: "Worked examples" },
  { id: "drill",    label: "🎯 Reasons drill" },
];

export default function SectionChaining({ nav }) {
  const [activeTab, setActiveTab] = useState("how");

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Multi-step angle questions are the hardest questions in this topic — and the ones
          most students drop marks on, not because they can't do the maths, but because they
          don't write their reasons. On Q10 of the Foundation paper, only{" "}
          <strong>0.6% of candidates</strong> got full marks. Every mark here is winnable
          with the right habits.
        </p>
      </div>

      <SubTabBar tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === "how"      && <HowItWorks />}
      {activeTab === "examples" && <WorkedExamples />}
      {activeTab === "drill"    && <ReasonDrill />}

      {nav}
    </div>
  );
}