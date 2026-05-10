import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import SpotTheAngle  from "./scenarios/SpotTheAngle";
import RoofTruss     from "./scenarios/RoofTruss";
import FootballAngle from "./scenarios/FootballAngle";
import Crossroads    from "./scenarios/Crossroads";
import KiteDesign    from "./scenarios/KiteDesign";

const SCENARIOS = [
  {
    id:    "masts",
    icon:  "📡",
    title: "Signal Coverage Check",
    hook:  "A phone engineer calculates missing angles to verify mast coverage.",
    rules: "Isosceles · Triangle sum · Multi-step chaining",
  },
  {
    id:    "roof",
    icon:  "🏠",
    title: "Roof Truss Design",
    hook:  "A builder checks rafter angles where parallel beams meet diagonal struts.",
    rules: "Alternate · Co-interior · Corresponding angles",
  },
  {
    id:    "football",
    icon:  "⚽",
    title: "Football Formations",
    hook:  "A coach analyses player formations and pitch geometry.",
    rules: "Rectangle · Parallelogram · Quadrilateral sum (360°)",
  },
  {
    id:    "crossroads",
    icon:  "🚦",
    title: "Road Junctions",
    hook:  "A highway engineer calculates angles at crossroads and roundabouts.",
    rules: "Straight line · Around a point · Vertically opposite",
  },
  {
    id:    "kite",
    icon:  "🪁",
    title: "Kite Design",
    hook:  "A kite maker calculates frame angles for a competition kite.",
    rules: "Kite angles · Rhombus · Multi-step with quad sum",
  },
];

export default function RealWorldTriangles() {
  const [selected, setSelected] = useState(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleSelect = (id) => { setSelected(id); scrollToTop(); };
  const handleBack   = ()   => { setSelected(null); scrollToTop(); };

  if (selected === "masts")      return <SpotTheAngle  onBack={handleBack} />;
  if (selected === "roof")       return <RoofTruss     onBack={handleBack} />;
  if (selected === "football")   return <FootballAngle onBack={handleBack} />;
  if (selected === "crossroads") return <Crossroads    onBack={handleBack} />;
  if (selected === "kite")       return <KiteDesign    onBack={handleBack} />;

  return (
    <div>
      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
        Choose a real-world situation. Each one uses the angle rules from Learn —
        pick the scenario that interests you most.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => handleSelect(s.id)} style={{
            padding: "14px 16px", background: "#fff",
            border: `1px solid ${C.border}`, borderRadius: "12px",
            cursor: "pointer", textAlign: "left",
            display: "flex", gap: "14px", alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "26px", flexShrink: 0, marginTop: "2px" }}>{s.icon}</span>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "800", color: C.text, margin: "0 0 3px" }}>
                {s.title}
              </p>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 5px", lineHeight: 1.4 }}>
                {s.hook}
              </p>
              <p style={{ fontSize: "11px", color: C.accent, fontWeight: "600", margin: 0 }}>
                {s.rules}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}