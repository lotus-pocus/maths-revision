import { C } from "../../../../../../data/angles_data";
import { ExamTip, RuleCard } from "../LearnUI";
import SideTicks from "./SideTicks";

// ── HabitDiagramSVG ───────────────────────────────────────────────────────
// Isosceles triangle ABD: AB = AD, base angles 70°, apex angle 40°.
// Used as the reference diagram for the 3 habits section.
function HabitDiagramSVG() {
  const A = { x: 130, y: 28  };
  const B = { x: 30,  y: 158 };
  const D = { x: 230, y: 158 };
  return (
    <svg viewBox="0 0 260 185" style={{ width: "100%", maxWidth: 220, display: "block" }}>
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`}
        fill={C.accentDim} stroke="none"
      />
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`}
        fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round"
      />
      <SideTicks p1={A} p2={B} count={2} colour={C.accent} />
      <SideTicks p1={A} p2={D} count={2} colour={C.accent} />
      <text x={A.x}      y={A.y + 22} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>40°</text>
      <text x={B.x + 28} y={B.y - 8}  textAnchor="middle" fontSize={12} fontWeight="700" fill={C.text}>70°</text>
      <text x={D.x - 28} y={D.y - 8}  textAnchor="middle" fontSize={12} fontWeight="700" fill={C.text}>70°</text>
      <text x={A.x}      y={A.y - 10} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 14} y={B.y + 8}  textAnchor="middle" fontSize={13} fontWeight="800" fill={C.text}>B</text>
      <text x={D.x + 14} y={D.y + 8}  textAnchor="middle" fontSize={13} fontWeight="800" fill={C.text}>D</text>
    </svg>
  );
}

// ── Habit data ────────────────────────────────────────────────────────────
const HABITS = [
  {
    n: "1", colour: C.accent,
    title: "Reason with each step — not at the end",
    bad:  "70 + 70 = 140, 180 − 140 = 40. Angles in a triangle = 180°.",
    good: "Angle DAB = 180 − 70 − 70 = 40°  (angles in a triangle add up to 180°)",
    why:  "Edexcel's examiner reports explicitly note that reasons written at the end, without linking them to a calculation, do not score the communication mark.",
  },
  {
    n: "2", colour: C.amber,
    title: "Use three-letter notation for every angle",
    bad:  "The angle = 70°",
    good: "Angle ADB = 70°",
    why:  "When a diagram has many angles, 'the angle' is ambiguous. Three letters pin down exactly which angle you mean — the middle letter is always the vertex.",
  },
  {
    n: "3", colour: C.purple,
    title: "Write the full reason — not a shorthand",
    bad:  '"Z angles", "triangle = 180", "isosceles"',
    good: '"Alternate angles are equal (parallel lines)", "Angles in a triangle add up to 180°", "Base angles of an isosceles triangle are equal"',
    why:  "Examiners are told not to award marks for shorthand. The full sentence is required every time.",
  },
];

// ── HowItWorks ────────────────────────────────────────────────────────────
export default function HowItWorks() {
  return (
    <div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px 16px", marginBottom: "16px",
      }}>
        <p style={{
          fontSize: "12px", fontWeight: "700", color: C.muted, margin: "0 0 4px",
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          Reference diagram — used in the examples below
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
          Triangle ABD is isosceles with AB = AD. Angle ABD = 70°. Find angle A.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HabitDiagramSVG />
        </div>
      </div>

      <RuleCard colour={C.accent} colourDim={C.accentDim}
        icon="🔗" title="What is chaining?"
        rule="Use two or more angle rules in sequence, writing a reason at each step">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
          A multi-step question gives you a diagram with several angles and asks you to find
          one that requires more than one rule to reach. You must work through intermediate
          angles — each one unlocking the next.
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          The key is that <strong>every single step needs its own reason written next to it</strong>,
          not collected at the end. Edexcel awards marks for reasons attached to the correct calculation.
        </p>
      </RuleCard>

      <p style={{
        fontSize: "12px", fontWeight: "700", color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px",
      }}>
        The 3 habits that get full marks
      </p>

      {HABITS.map(({ n, colour, title, bad, good, why }) => (
        <div key={n} style={{
          background: "#fff", border: `1.5px solid ${colour}30`,
          borderRadius: "12px", padding: "14px 16px", marginBottom: "10px",
        }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: colour, color: "#fff", fontSize: "12px", fontWeight: "800",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>{n}</div>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, margin: 0 }}>{title}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "8px 12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.red, margin: "0 0 2px" }}>✗ Will lose marks</p>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, fontFamily: "monospace" }}>{bad}</p>
            </div>
            <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`,
              borderRadius: "8px", padding: "8px 12px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.green, margin: "0 0 2px" }}>✓ Will score marks</p>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, fontFamily: "monospace" }}>{good}</p>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
            📋 <em>{why}</em>
          </p>
        </div>
      ))}

      <ExamTip>
        The examiner's report for Q10 (isosceles + parallel lines) noted that only
        <strong> 0.6% of candidates</strong> could state all the reasons correctly —
        yet 10% found the right answer. Most students lost marks purely on the reasons,
        not the maths. Writing reasons correctly is the biggest single mark-saver in
        angle questions.
      </ExamTip>

    </div>
  );
}