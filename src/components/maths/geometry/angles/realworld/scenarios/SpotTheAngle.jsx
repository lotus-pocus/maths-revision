import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc  from "../../../../shared/MiniCalc";
import SideTicks from "../../learn/chaining/SideTicks";

// ── Scenario 1 diagram ────────────────────────────────────────────────────
// Isosceles triangle: Mast A (top-left), Mast B (top-right), YOU (bottom-centre).
// Equal sides: A–YOU = B–YOU. Known: 48° at A. Unknown: x° at B.
// Check: 48 + 48 + 84 = 180 ✓
function S1Diagram({ showAnswer }) {
  const A   = { x: 60,  y: 50  };
  const B   = { x: 260, y: 50  };
  const YOU = { x: 160, y: 210 };
  return (
    <svg viewBox="0 0 320 250" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={250} fill="#f0f9ff" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" />
      <SideTicks p1={A}   p2={YOU} count={2} colour={C.accent} />
      <SideTicks p1={B}   p2={YOU} count={2} colour={C.accent} />
      <text x={A.x + 32} y={A.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>48°</text>
      <text x={B.x - 32} y={B.y + 22} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "48°" : "x°"}
      </text>
      <text x={YOU.x} y={YOU.y - 16} textAnchor="middle" fontSize={11} fontWeight="600" fill={C.border}>84°</text>
      <text x={A.x - 4}   y={A.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}   y={B.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>Mast B</text>
      <circle cx={YOU.x} cy={YOU.y} r={7} fill={C.green} />
      <text x={YOU.x} y={YOU.y + 20} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.green}>YOU</text>
    </svg>
  );
}

// ── Scenario 2 diagram ────────────────────────────────────────────────────
// Triangle: Mast A (top-left), Mast B (top-right), Mast C (bottom-centre).
// Known: 64° at A, 72° at B. Unknown: x° at C.
// Check: 64 + 72 + 44 = 180 ✓
function S2Diagram({ showAnswer }) {
  const A  = { x: 60,  y: 50  };
  const B  = { x: 260, y: 50  };
  const Cv = { x: 160, y: 210 };
  return (
    <svg viewBox="0 0 320 250" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={250} fill="#f0f9ff" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" />
      <text x={A.x + 32} y={A.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>64°</text>
      <text x={B.x - 32} y={B.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>72°</text>
      <text x={Cv.x} y={Cv.y - 16} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "44°" : "x°"}
      </text>
      <text x={A.x - 4}  y={A.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}  y={B.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>Mast B</text>
      <text x={Cv.x}     y={Cv.y + 20} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.purple}>Mast C</text>
    </svg>
  );
}

// ── Scenario 3 diagram ────────────────────────────────────────────────────
// Two triangles sharing edge A–B.
// Amber (small): A–B–YOU isosceles, equal sides to YOU.
//   Angle at A = 58°, angle at YOU = 58° (base angles equal).
//   Angle at B = 180 − 58 − 58 = 64°.
// Blue (large): A–B–Mast C.
//   Angle at A = 48°, angle at B = 64° (from step 1), x at C = 180 − 48 − 64 = 68°.
// Check: 58+58+64=180 ✓  48+64+68=180 ✓
function S3Diagram({ showAnswer }) {
  const A   = { x: 45,  y: 55  };
  const B   = { x: 175, y: 55  };
  const YOU = { x: 110, y: 160 };
  const Cv  = { x: 285, y: 160 };
  return (
    <svg viewBox="0 0 320 210" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={210} fill="#f0f9ff" rx={8} />
      {/* Large blue triangle A–B–C (drawn first) */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill={C.accentDim} stroke="none" opacity={0.6} />
      {/* Small amber triangle A–B–YOU (drawn on top) */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill={C.amberDim} stroke="none" opacity={0.8} />
      {/* Large triangle sides */}
      <line x1={A.x} y1={A.y} x2={Cv.x} y2={Cv.y}
        stroke={C.accent} strokeWidth={1.5} strokeDasharray="5,3" strokeLinecap="round" />
      <line x1={B.x} y1={B.y} x2={Cv.x} y2={Cv.y}
        stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={B.x}  y2={B.y}
        stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      {/* Small isosceles triangle sides */}
      <line x1={A.x} y1={A.y} x2={YOU.x} y2={YOU.y}
        stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
      <line x1={B.x} y1={B.y} x2={YOU.x} y2={YOU.y}
        stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
      {/* Equal side ticks */}
      <SideTicks p1={A} p2={YOU} count={2} colour={C.amber} />
      <SideTicks p1={B} p2={YOU} count={2} colour={C.amber} />
      {/* Angle at A: 58° (amber, inside isosceles triangle) */}
      <text x={A.x + 34} y={A.y + 22} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>58°</text>
      {/* Angle at A: 48° (blue, inside large triangle — slightly lower) */}
      <text x={A.x + 52} y={A.y + 42} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>48°</text>
      {/* Angle at B: found in step 1, greyed until answer shown */}
      <text x={B.x - 16} y={B.y + 24} textAnchor="middle" fontSize={12} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "64°" : "?°"}
      </text>
      {/* Angle at YOU (greyed — not part of the question) */}
      <text x={YOU.x} y={YOU.y - 12} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.border}>64°</text>
      {/* Angle x at Mast C */}
      <text x={Cv.x - 12} y={Cv.y - 14} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "68°" : "x°"}
      </text>
      {/* Vertex labels */}
      <text x={A.x - 6}  y={A.y - 10}  textAnchor="middle" fontSize={11} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}  y={B.y - 10}  textAnchor="middle" fontSize={11} fontWeight="800" fill={C.amber}>Mast B</text>
      <circle cx={YOU.x} cy={YOU.y} r={6} fill={C.green} />
      <text x={YOU.x}    y={YOU.y + 18} textAnchor="middle" fontSize={10} fontWeight="800" fill={C.green}>YOU</text>
      <text x={Cv.x + 8} y={Cv.y + 16} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.purple}>Mast C</text>
    </svg>
  );
}

// ── Question data ─────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    badge: "Isosceles",
    badgeColour: C.amber,
    Diagram: S1Diagram,
    hook: "You are equidistant from Mast A and Mast B — the signal travel time is identical. This makes the triangle Mast A – Mast B – YOU isosceles.",
    question: "The angle at Mast A = 48°. Find angle x at Mast B.",
    answer: 48,
    reason: "Base angles of an isosceles triangle are equal",
    working: "Mast A–YOU = Mast B–YOU  →  triangle is isosceles\nAngle at Mast B = angle at Mast A = 48°\nx = 48°",
    hint: "When two sides of a triangle are equal, what can you say about the two base angles?",
  },
  {
    badge: "Triangle sum",
    badgeColour: C.accent,
    Diagram: S2Diagram,
    hook: "A surveyor has measured two angles in the triangle formed by the three masts. Your job is to find the third angle at Mast C — needed to verify the coverage map.",
    question: "The triangle formed by the three masts has angle 64° at Mast A and 72° at Mast B. Find angle x at Mast C.",
    answer: 44,
    reason: "Angles in a triangle add up to 180°",
    working: "64 + 72 + x = 180°\n136 + x = 180°\nx = 180 − 136 = 44°",
    hint: "All three interior angles of any triangle always sum to the same number. What is it?",
  },
  {
    badge: "Multi-step",
    badgeColour: C.purple,
    Diagram: S3Diagram,
    hook: "An engineer is planning a new Mast C and needs angle x — the coverage angle at Mast C — to check the signal reaches the right area. Two steps are needed.",
    question: "Step 1: The amber triangle (Mast A – Mast B – YOU) is isosceles with equal sides from A and B to YOU. The angle at Mast A = 58°. Find the angle at Mast B.\n\nStep 2: Use that angle at Mast B in the larger blue triangle (Mast A – Mast B – Mast C), where the angle at Mast A = 48°. Find angle x at Mast C.",
    answer: 68,
    reason: "Step 1: Base angles of an isosceles triangle are equal. Step 2: Angles in a triangle add up to 180°.",
    working: "Step 1: angle at Mast B = 180 − 58 − 58 = 64°  (isosceles + triangle sum)\nStep 2: 48 + 64 + x = 180°\nx = 180 − 112 = 68°",
    hint: "Work inside the amber isosceles triangle first. Both base angles equal 58°, so what does the angle at Mast B come out as using the triangle sum?",
  },
];

// ── SpotTheAngle ──────────────────────────────────────────────────────────
export default function SpotTheAngle({ onBack }) {
  const [idx,      setIdx]      = useState(0);
  const [input,    setInput]    = useState("");
  const [checked,  setChecked]  = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [showHint, setShowHint] = useState(false);

  const q       = QUESTIONS[idx];
  const isRight = parseInt(input, 10) === q.answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => {
    if (idx + 1 >= QUESTIONS.length) setDone(true);
    else { setIdx(i => i + 1); setInput(""); setChecked(false); setShowHint(false); }
  };
  const handleRestart = () => {
    setIdx(0); setInput(""); setChecked(false);
    setScore(0); setDone(false); setShowHint(false);
  };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{QUESTIONS.length} correct
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 24px" }}>
          {pct === 100
            ? "All three — the masts are impressed."
            : "Real angle rules, real context. Keep practising!"}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleRestart} style={{
            flex: 1, padding: "12px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>Try again</button>
          <button onClick={onBack} style={{
            flex: 1, padding: "12px", borderRadius: "10px",
            border: `1.5px solid ${C.border}`, background: C.surface,
            fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer",
          }}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{
          fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px",
          background: q.badgeColour + "20", color: q.badgeColour,
          border: `1px solid ${q.badgeColour}40`,
        }}>{q.badge}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {idx + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Context hook */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          🗺️ {q.hook}
        </p>
      </div>

      {/* Diagram */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
        <q.Diagram showAnswer={checked} />
      </div>

      {/* Question */}
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        {q.question.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: C.text, margin: i > 0 ? "8px 0 0" : 0, lineHeight: 1.6 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Hint + calculator + input (hidden after check) */}
      {!checked && (
        <>
          <button onClick={() => setShowHint(h => !h)} style={{
            background: "none", border: "none", color: C.amber,
            fontSize: "12px", fontWeight: "700", cursor: "pointer",
            padding: "0 0 10px", textDecoration: "underline",
          }}>
            {showHint ? "Hide hint ▲" : "Show hint ▾"}
          </button>

          {showHint && (
            <div style={{ background: C.amberDim, border: `1px solid ${C.amber}30`,
              borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
              <p style={{ fontSize: "12px", color: C.text, margin: 0 }}>💡 {q.hint}</p>
            </div>
          )}

          <MiniCalc />

          <div style={{ display: "flex", gap: "8px", marginTop: "10px", marginBottom: "12px" }}>
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Your answer (degrees)"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
                border: `1.5px solid ${C.border}`, fontSize: "16px",
                color: C.text, outline: "none", boxSizing: "border-box" }}
            />
            <button onClick={handleCheck} style={{
              padding: "12px 20px", borderRadius: "10px", border: "none",
              background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
            }}>Check</button>
          </div>
        </>
      )}

      {/* Feedback */}
      {checked && (
        <div>
          <div style={{
            background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "8px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 6px" }}>
              {isRight ? `✓ Correct! x = ${q.answer}°` : `✗ The answer is ${q.answer}°`}
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 6px", fontWeight: "700" }}>
              Reason:{" "}
              <span style={{ color: C.text, fontWeight: "400" }}>{q.reason}</span>
            </p>
            {q.working.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: "12px", color: C.text,
                margin: i > 0 ? "4px 0 0" : 0, fontFamily: "monospace" }}>
                {line}
              </p>
            ))}
          </div>
          <button onClick={handleNext} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>
            {idx + 1 >= QUESTIONS.length ? "See my score →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}