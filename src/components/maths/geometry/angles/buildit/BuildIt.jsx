import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import Scenario1 from "./Scenario1";
import Scenario2 from "./Scenario2";
import Scenario3 from "./Scenario3";

const SCENARIOS = [
  {
    id: 1,
    title: "Parallel lines cut by a transversal",
    summary: "Find two missing angles. Give a reason for each.",
    marks: 4,
    difficulty: "Foundation & Higher",
    difficultyColor: C.accent,
    icon: "〰️",
    examNote: "Appears on virtually every Edexcel paper",
  },
  {
    id: 2,
    title: "Isosceles triangle on a straight line",
    summary: "Three-step chain — base angles, apex angle, exterior angle.",
    marks: 3,
    difficulty: "Foundation",
    difficultyColor: C.green,
    icon: "△",
    examNote: "Examiner reports: most students get the numbers but lose marks on reasons",
  },
  {
    id: 3,
    title: "Triangle between two parallel lines",
    summary: "Multi-step: draw an auxiliary line, use alternate angles twice.",
    marks: 4,
    difficulty: "Higher",
    difficultyColor: C.amber,
    icon: "⫲",
    examNote: "Only 0.6% of candidates state all reasons correctly — high value question",
  },
];

function ScenarioPicker({ completed, onSelect }) {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          🎯 Build It — Angles
        </p>
        <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Three exam-style scenarios based on real Edexcel past paper patterns.
          Each one asks you to find the missing angles <strong>and</strong> give the correct reason —
          exactly what the examiner marks.
        </p>
      </div>

      <div style={{ background: "#fef2f2", border: "2px solid #fca5a5",
        borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: "800", color: "#991b1b", margin: "0 0 4px" }}>
          🚫 Remember: "Z angles", "F angles" and "C angles" are NOT accepted
        </p>
        <p style={{ fontSize: "12px", color: "#7f1d1d", margin: 0, lineHeight: 1.55 }}>
          Always write the full mathematical name: <strong>alternate angles are equal</strong>,{" "}
          <strong>corresponding angles are equal</strong>, or{" "}
          <strong>co-interior angles sum to 180°</strong>.
          Writing the letter-shape name scores zero for the reason mark.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {SCENARIOS.map((s) => {
          const done = completed.has(s.id);
          return (
            <button key={s.id} onClick={() => onSelect(s.id)} style={{
              display: "flex", alignItems: "flex-start", gap: "14px",
              padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
              background: done ? C.greenDim : "#fff",
              border: `1.5px solid ${done ? C.green : C.border}`,
              textAlign: "left", width: "100%",
              borderLeft: `4px solid ${done ? C.green : s.difficultyColor}`,
              transition: "all 0.15s",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                background: done ? C.greenDim : C.accentDim,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", border: `1px solid ${done ? C.green : C.accent}30`,
              }}>
                {done ? "✓" : s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center",
                  gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700",
                    color: done ? C.green : C.text }}>{s.title}</span>
                  <span style={{
                    fontSize: "10px", fontWeight: "700", padding: "2px 7px",
                    borderRadius: "99px",
                    background: s.difficulty === "Higher" ? "#fffbeb"
                      : s.difficulty === "Foundation" ? "#ecfdf5" : C.accentDim,
                    color: s.difficulty === "Higher" ? C.amber
                      : s.difficulty === "Foundation" ? C.green : C.accent,
                  }}>{s.difficulty}</span>
                  <span style={{
                    fontSize: "10px", fontWeight: "600", padding: "2px 7px",
                    borderRadius: "99px", background: C.accentDim, color: C.accent,
                  }}>{s.marks} marks</span>
                </div>
                <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 4px", lineHeight: 1.5 }}>
                  {s.summary}
                </p>
                <p style={{ fontSize: "11px", color: "#d97706", margin: 0, fontStyle: "italic" }}>
                  📋 {s.examNote}
                </p>
              </div>
              <span style={{ fontSize: "18px", color: done ? C.green : C.muted,
                flexShrink: 0, alignSelf: "center" }}>
                {done ? "✓" : "→"}
              </span>
            </button>
          );
        })}
      </div>

      {completed.size > 0 && (
        <div style={{ marginTop: "20px", background: C.greenDim,
          border: `1px solid ${C.green}40`, borderRadius: "10px", padding: "12px 14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: C.green, margin: 0 }}>
            {completed.size} of {SCENARIOS.length} scenarios complete
            {completed.size === SCENARIOS.length && " — full set done! 🎉"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BuildIt() {
  const [active,    setActive]    = useState(null);
  const [completed, setCompleted] = useState(new Set());

  const handleComplete = (id) => {
    setCompleted(prev => new Set([...prev, id]));
    const next = id < SCENARIOS.length ? id + 1 : null;
    setActive(next);
  };

  const handleBack = () => setActive(null);

  if (active === 1) return <Scenario1 onComplete={() => handleComplete(1)} onBack={handleBack} />;
  if (active === 2) return <Scenario2 onComplete={() => handleComplete(2)} onBack={handleBack} />;
  if (active === 3) return <Scenario3 onComplete={() => handleComplete(3)} onBack={handleBack} />;

  return <ScenarioPicker completed={completed} onSelect={setActive} />;
}