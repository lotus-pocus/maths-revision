import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import SideTicks    from "./SideTicks";
import ReasonBadge  from "./ReasonBadge";

// ── WorkedSVG1 ────────────────────────────────────────────────────────────
// Isosceles triangle ABD (AB=AD, angle ABD=70°) with BDC a straight line.
// Reveals angles step by step as `step` increases.
function WorkedSVG1({ step }) {
  const A  = { x: 130, y: 30  };
  const B  = { x: 40,  y: 160 };
  const D  = { x: 220, y: 160 };
  const Cp = { x: 290, y: 160 };

  const showA   = step >= 1;
  const showADB = step >= 2;
  const showX   = step >= 3;

  return (
    <svg viewBox="0 0 320 190" style={{ width: "100%", maxWidth: 320, display: "block" }}>
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`}
        fill={C.accentDim} stroke="none"
      />
      <line x1={B.x} y1={B.y} x2={Cp.x} y2={Cp.y}
        stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
        stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={D.x} y2={D.y}
        stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <SideTicks p1={A} p2={B} count={2} colour={C.accent} />
      <SideTicks p1={A} p2={D} count={2} colour={C.accent} />
      <text x={60} y={152} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text}>70°</text>
      {showA && (
        <text x={A.x} y={A.y + 22} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>40°</text>
      )}
      {showADB && (
        <text x={D.x - 28} y={D.y - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>70°</text>
      )}
      {showX && (
        <text x={D.x + 22} y={D.y - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.green}>110°</text>
      )}
      {!showX && (
        <text x={D.x + 22} y={D.y - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.muted}>x°</text>
      )}
      <text x={A.x}       y={A.y - 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 12}  y={B.y + 8}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={D.x}       y={D.y + 16} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>
      <text x={Cp.x + 10} y={Cp.y + 8} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
    </svg>
  );
}

// ── WorkedSVG2 ────────────────────────────────────────────────────────────
// Trapezium ABCE: BC parallel to AE, AB=BC (isosceles), angle ABC=110°.
function WorkedSVG2({ step }) {
  const A  = { x: 30,  y: 155 };
  const B  = { x: 80,  y: 45  };
  const Cv = { x: 220, y: 45  };
  const E  = { x: 280, y: 155 };

  const showIsosceles = step >= 1;
  const showAlternate = step >= 2;
  const showX         = step >= 3;

  return (
    <svg viewBox="0 0 310 195" style={{ width: "100%", maxWidth: 310, display: "block" }}>
      <line x1={20} y1={45}  x2={290} y2={45}  stroke={C.border} strokeWidth={1.5} strokeDasharray="5,4" />
      <line x1={20} y1={155} x2={290} y2={155} stroke={C.border} strokeWidth={1.5} strokeDasharray="5,4" />
      <text x={298} y={49}  fontSize={9} fill={C.muted} fontWeight="600">l₁</text>
      <text x={298} y={159} fontSize={9} fill={C.muted} fontWeight="600">l₂</text>
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${E.x},${E.y}`}
        fill={C.accentDim} stroke="none"
      />
      {[[A, B], [B, Cv], [Cv, E], [E, A]].map(([p1, p2], i) => (
        <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      ))}
      <SideTicks p1={A} p2={B}  count={2} colour={C.accent} />
      <SideTicks p1={B} p2={Cv} count={2} colour={C.accent} />
      <text x={B.x + 30} y={B.y + 18} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text}>110°</text>
      {showIsosceles && (
        <>
          <text x={A.x + 28}  y={A.y - 10}  textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>35°</text>
          <text x={Cv.x - 28} y={Cv.y + 18} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>35°</text>
        </>
      )}
      {showAlternate && (
        <text x={E.x - 28} y={E.y - 10} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.purple}>35°</text>
      )}
      {showX && (
        <text x={E.x + 10} y={E.y - 10} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.green}>145°</text>
      )}
      {!showX && (
        <text x={E.x + 10} y={E.y - 10} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.muted}>x°</text>
      )}
      <text x={A.x - 12}  y={A.y + 6}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 12}  y={B.y - 8}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={Cv.x + 12} y={Cv.y - 8} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
      <text x={E.x + 14}  y={E.y + 6}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>E</text>
    </svg>
  );
}

// ── Example data ──────────────────────────────────────────────────────────
// SVG components are referenced directly — add new examples here as needed.
const EXAMPLES = [
  {
    id: "ex1",
    title: "Example 1 — Isosceles triangle + straight line",
    difficulty: "2 steps",
    diffColour: C.green,
    setup: "Triangle ABD has AB = AD (isosceles). Angle ABD = 70°. BDC is a straight line. Find angle x (angle BDC).",
    steps: [
      {
        n: "1", colour: C.amber,
        angle: "Angle ADB",
        working: "70°",
        reason: "Base angles of an isosceles triangle are equal",
        explain: "AB = AD, so the base angles at B and D are equal. Angle ABD = 70°, so angle ADB = 70° too.",
      },
      {
        n: "2", colour: C.accent,
        angle: "Angle DAB",
        working: "180 − 70 − 70 = 40°",
        reason: "Angles in a triangle add up to 180°",
        explain: "Now we know two angles (70° and 70°), the third must make the total 180°.",
      },
      {
        n: "3", colour: C.green,
        angle: "Angle x (BDC)",
        working: "180 − 70 = 110°",
        reason: "Angles on a straight line add up to 180°",
        explain: "BDC is a straight line. Angle ADB = 70° is on one side, so x = 180 − 70 = 110°.",
      },
    ],
    SVG: WorkedSVG1,
    answer: "x = 110°",
  },
  {
    id: "ex2",
    title: "Example 2 — Isosceles triangle + parallel lines",
    difficulty: "3 steps",
    diffColour: C.amber,
    setup: "ABCE is a trapezium with BC parallel to AE. AB = BC (isosceles). Angle ABC = 110°. Find angle x (angle CEA).",
    steps: [
      {
        n: "1", colour: C.amber,
        angle: "Angle BAC = Angle BCA",
        working: "(180 − 110) ÷ 2 = 35°",
        reason: "Base angles of an isosceles triangle are equal",
        explain: "AB = BC so the base angles are equal. The remaining 70° splits equally: 35° each.",
      },
      {
        n: "2", colour: C.purple,
        angle: "Angle CEA",
        working: "35°",
        reason: "Alternate angles are equal (parallel lines)",
        explain: "BC is parallel to AE. Angle BCA and angle CEA are alternate angles — they are equal.",
      },
      {
        n: "3", colour: C.green,
        angle: "Angle x",
        working: "180 − 35 = 145°",
        reason: "Angles on a straight line add up to 180°",
        explain: "Angle CEA = 35° sits on a straight line with x. So x = 180 − 35 = 145°.",
      },
    ],
    SVG: WorkedSVG2,
    answer: "x = 145°",
  },
];

// ── WorkedExamples ────────────────────────────────────────────────────────
export default function WorkedExamples() {
  const [activeEx, setActiveEx] = useState("ex1");
  const [step,     setStep]     = useState(0);

  const ex = EXAMPLES.find(e => e.id === activeEx);
  const handleSwitch = (id) => { setActiveEx(id); setStep(0); };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {EXAMPLES.map(e => (
          <button key={e.id} onClick={() => handleSwitch(e.id)} style={{
            flex: 1, padding: "10px 8px", borderRadius: "10px", cursor: "pointer",
            border: `2px solid ${activeEx === e.id ? C.accent : C.border}`,
            background: activeEx === e.id ? C.accentDim : "#fff",
            textAlign: "left", transition: "all 0.15s",
          }}>
            <p style={{ fontSize: "12px", fontWeight: "800", color: C.accent, margin: "0 0 2px" }}>
              {e.title.split("—")[0].trim()}
            </p>
            <span style={{
              fontSize: "10px", fontWeight: "700", padding: "1px 7px", borderRadius: "99px",
              background: e.diffColour + "20", color: e.diffColour,
            }}>{e.difficulty}</span>
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px 14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.muted, margin: "0 0 4px",
          textTransform: "uppercase", letterSpacing: "0.05em" }}>The question</p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{ex.setup}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px",
        background: "#fff", borderRadius: "10px", padding: "10px",
        border: `1px solid ${C.border}` }}>
        <ex.SVG step={step} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        {ex.steps.map((s, i) => i < step ? (
          <div key={i} style={{
            background: "#fff", border: `1px solid ${s.colour}30`,
            borderRadius: "10px", padding: "10px 12px", marginBottom: "8px",
          }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: s.colour, color: "#fff",
                fontSize: "11px", fontWeight: "800",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{s.n}</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: C.text,
                  margin: "0 0 3px", fontFamily: "monospace" }}>
                  {s.angle} = {s.working}
                </p>
                <ReasonBadge text={s.reason} colour={s.colour} />
                <p style={{ fontSize: "12px", color: C.muted, margin: "6px 0 0", lineHeight: 1.5 }}>
                  {s.explain}
                </p>
              </div>
            </div>
          </div>
        ) : null)}
      </div>

      {step < ex.steps.length ? (
        <button onClick={() => setStep(s => s + 1)} style={{
          width: "100%", padding: "13px", borderRadius: "10px", border: "none",
          background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
        }}>
          {step === 0 ? "Show first step →" : `Show step ${step + 1} →`}
        </button>
      ) : (
        <div>
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "15px", fontWeight: "800", color: C.green, margin: 0 }}>
              ✓ {ex.answer}
            </p>
          </div>
          <button onClick={() => setStep(0)} style={{
            width: "100%", padding: "11px", borderRadius: "10px",
            border: `1.5px solid ${C.border}`, background: C.surface,
            fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer",
          }}>
            ↺ Restart this example
          </button>
        </div>
      )}
    </div>
  );
}