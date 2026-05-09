import { useState } from "react";
import { HookBox, SubTabBar } from "./LearnUI";
import TriangleSumTab   from "./triangles/TriangleSumTab";
import IsoscelesTab     from "./triangles/IsoscelesTab";
import EquilateralTab   from "./triangles/EquilateralTab";
import CirclePreviewTab from "./triangles/CirclePreviewTab";
import TriangleDrill    from "./triangles/TriangleDrill";
import TriangleExplorer from "./triangles/TriangleExplorer";

const TABS = [
  { id: "sum",         label: "Angle sum"   },
  { id: "isosceles",   label: "Isosceles"   },
  { id: "equilateral", label: "Equilateral" },
  { id: "explorer",    label: "🔭 Explorer" },
  { id: "circle",      label: "🔮 Preview"  },
  { id: "drill",       label: "🎯 Drill"    },
];

export default function SectionTriangles({ nav }) {
  const [activeTab, setActiveTab] = useState("sum");
  const [drillKey,  setDrillKey]  = useState(0);

  const handleTabSelect = (id) => {
    setActiveTab(id);
    if (id === "drill") setDrillKey(k => k + 1);
  };

  return (
    <div>
      <HookBox>
        Triangle rules appear in almost every multi-step angle question on the Edexcel
        paper. Isosceles triangles are especially important — they are the hidden engine
        inside most circle theorem proofs. Master this section and circle theorems will
        make sense immediately.
      </HookBox>

      <SubTabBar tabs={TABS} activeTab={activeTab} onSelect={handleTabSelect} />

      {activeTab === "sum"         && <TriangleSumTab />}
      {activeTab === "isosceles"   && <IsoscelesTab />}
      {activeTab === "equilateral" && <EquilateralTab />}
      {activeTab === "explorer"    && <TriangleExplorer />}
      {activeTab === "circle"      && <CirclePreviewTab />}
      {activeTab === "drill"       && <TriangleDrill key={drillKey} />}

      {activeTab !== "drill" && nav}
    </div>
  );
}