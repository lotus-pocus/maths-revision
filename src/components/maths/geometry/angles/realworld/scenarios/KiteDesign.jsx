import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc from "../../../../shared/MiniCalc";
import SideTicks from "../../learn/chaining/SideTicks";

// ── Q1: Kite angle property ───────────────────────────────────────────────
// Kite ABCD: AB=AD (top pair), CB=CD (bottom pair).
// Known: top angle A = 98°, equal angles B = D = 54°.
// Find bottom angle C. 98 + 54 + 54 + x = 360 → x = 154°. ✓
function Q1Diagram({ showAnswer }) {
  const A = { x: 160, y: 25  }; // top
  const B = { x: 255, y: 105 }; // right
  const Cv = { x: 160, y: 195 }; // bottom
  const D = { x: 65,  y: 105 }; // left
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={220} fill="#f0fdf4" rx={8} />
      {/* Kite shape */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill={C.purpleDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill="none" stroke={C.purple} strokeWidth={2.5} strokeLinejoin="round" />
      {/* Equal side ticks — top pair AB=AD */}
      <SideTicks p1={A} p2={B} count={1} colour={C.purple} />
      <SideTicks p1={A} p2={D} count={1} colour={C.purple} />
      {/* Equal side ticks — bottom pair CB=CD */}
      <SideTicks p1={Cv} p2={B} count={2} colour={C.amber} />
      <SideTicks p1={Cv} p2={D} count={2} colour={C.amber} />
      {/* Angles */}
      <text x={A.x} y={A.y + 26} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.purple}>98°</text>
      <text x={B.x - 34} y={B.y + 6} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>54°</text>
      <text x={D.x + 34} y={D.y + 6} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>54°</text>
      <text x={Cv.x} y={Cv.y - 16} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>{showAnswer ? "154°" : "x°"}</text>
      {/* Labels */}
      <text x={A.x} y={A.y - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.purple}>A (spine)</text>
      <text x={Cv.x} y={Cv.y + 16} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>C (tail)</text>
      <text x={B.x + 14} y={B.y} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.accent}>B</text>
      <text x={D.x - 14} y={D.y} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.accent}>D</text>
    </svg>
  );
}

// ── Q2: Rhombus — opposite equal, adjacent add to 180° ───────────────────
// Kite frame cross-struts form a rhombus. One angle = 124°.
// Find adjacent angle x. 124 + x = 180 → x = 56°. ✓
function Q2Diagram({ showAnswer }) {
  const A = { x: 160, y: 30  };
  const B = { x: 275, y: 115 };
  const Cv = { x: 160, y: 200 };
  const D = { x: 45,  y: 115 };
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={230} fill="#f0fdf4" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinejoin="round" />
      {/* All sides equal — 1 tick on each */}
      <SideTicks p1={A} p2={B}  count={1} colour={C.accent} />
      <SideTicks p1={B} p2={Cv} count={1} colour={C.accent} />
      <SideTicks p1={Cv} p2={D} count={1} colour={C.accent} />
      <SideTicks p1={D} p2={A}  count={1} colour={C.accent} />
      {/* Known: angle at B = 124° */}
      <text x={B.x - 44} y={B.y + 6} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>124°</text>
      {/* Opposite angle at D = 124° (shown after) */}
      {showAnswer && (
        <text x={D.x + 44} y={D.y + 6} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>124°</text>
      )}
      {/* Adjacent x° at A */}
      <text x={A.x} y={A.y + 28} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>{showAnswer ? "56°" : "x°"}</text>
      <text x={A.x}    y={A.y - 10}  textAnchor="middle" fontSize={11} fontWeight="700" fill={C.accent}>A</text>
      <text x={B.x + 14} y={B.y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>B</text>
      <text x={Cv.x}   y={Cv.y + 16} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.accent}>C</text>
      <text x={D.x - 14} y={D.y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>D</text>
      <text x={160} y={215} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.muted}>Cross-strut frame (rhombus)</text>
    </svg>
  );
}

// ── Q3: Multi-step — isosceles + kite quad sum ────────────────────────────
// Kite ABCD. AB = AD (isosceles at A). Angle A = 110°.
// Step 1: base angles of isosceles triangle ABD: (180−110)÷2 = 35° each.
//         So angle ABD = angle ADB = 35°.
// The kite has B = D (equal angles between unequal sides).
// Full angle at B in the kite = angle ABD + angle DBC.
// We know B = D = 35° + something.
// Actually simpler: kite angles B = D. Full kite: A + B + C + D = 360.
// Known: A = 110°, B = D, C = 80° (given on diagram).
// 110 + 2B + 80 = 360 → 2B = 170 → B = 85°. ✓
function Q3Diagram({ showAnswer }) {
  const A = { x: 160, y: 22  };
  const B = { x: 262, y: 108 };
  const Cv = { x: 160, y: 200 };
  const D = { x: 58,  y: 108 };
  return (
    <svg viewBox="0 0 320 222" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={222} fill="#f0fdf4" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill={C.purpleDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill="none" stroke={C.purple} strokeWidth={2.5} strokeLinejoin="round" />
      {/* Ticks: AB = AD (top pair) */}
      <SideTicks p1={A} p2={B} count={1} colour={C.purple} />
      <SideTicks p1={A} p2={D} count={1} colour={C.purple} />
      {/* Ticks: CB = CD (bottom pair, different) */}
      <SideTicks p1={Cv} p2={B} count={2} colour={C.amber} />
      <SideTicks p1={Cv} p2={D} count={2} colour={C.amber} />
      {/* Known angles */}
      <text x={A.x} y={A.y + 26} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.purple}>110°</text>
      <text x={Cv.x} y={Cv.y - 14} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>80°</text>
      {/* x° at B (and equal x° at D) */}
      <text x={B.x - 38} y={B.y + 6} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>{showAnswer ? "85°" : "x°"}</text>
      <text x={D.x + 38} y={D.y + 6} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>{showAnswer ? "85°" : "x°"}</text>
      <text x={A.x}    y={A.y - 8}   textAnchor="middle" fontSize={11} fontWeight="700" fill={C.purple}>A</text>
      <text x={B.x + 14} y={B.y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.purple}>B</text>
      <text x={Cv.x}   y={Cv.y + 16} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>C</text>
      <text x={D.x - 14} y={D.y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.purple}>D</text>
    </svg>
  );
}

const QUESTIONS = [
  {
    badge: "Kite angles",
    badgeColour: C.purple,
    Diagram: Q1Diagram,
    hook: "A kite maker is designing a diamond-shaped kite. The frame must be precise — if the angles are wrong, the kite won't fly straight. The top angle at A = 98°, and the two side angles B and D are equal at 54° each.",
    question: "The kite has angles 98° at A, 54° at B and 54° at D. Find angle x at the tail point C.",
    answer: 154,
    reason: "Angles in a quadrilateral add up to 360°",
    working: "98 + 54 + 54 + x = 360°\n206 + x = 360°\nx = 154°",
    hint: "A kite is a quadrilateral — all four angles must sum to 360°. You have three of them.",
  },
  {
    badge: "Rhombus",
    badgeColour: C.accent,
    Diagram: Q2Diagram,
    hook: "The cross-struts inside the kite frame form a rhombus — all four sides are equal. The angle at corner B = 124°. The kite maker needs to cut corner A to the correct angle.",
    question: "The frame is a rhombus. The angle at B = 124°. Find angle x at A (adjacent to B).",
    answer: 56,
    reason: "Adjacent angles in a rhombus add up to 180°",
    working: "Adjacent angles in a rhombus are co-interior → sum to 180°.\n124 + x = 180°\nx = 56°",
    hint: "A rhombus has two pairs of equal opposite angles. But adjacent angles (next to each other) behave like co-interior angles — what do they add up to?",
  },
  {
    badge: "Multi-step",
    badgeColour: C.amber,
    Diagram: Q3Diagram,
    hook: "A competition kite has a symmetric design — AB = AD, making B and D equal. The top angle A = 110° and the tail angle C = 80°. The manufacturer needs both side angles to cut the frame correctly.",
    question: "The kite has AB = AD so angles B and D are equal (both = x°). Angle A = 110° and angle C = 80°. Find x.",
    answer: 85,
    reason: "Angles in a quadrilateral add up to 360°; angles B and D are equal (kite property)",
    working: "110 + x + 80 + x = 360°\n190 + 2x = 360°\n2x = 170°\nx = 85°",
    hint: "Because B = D, write the equation as 110 + x + 80 + x = 360°. Collect the x terms together.",
  },
];

export default function KiteDesign({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const q = QUESTIONS[idx];
  const isRight = parseInt(input, 10) === q.answer;

  const handleCheck = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext = () => {
    if (idx + 1 >= QUESTIONS.length) setDone(true);
    else { setIdx(i => i + 1); setInput(""); setChecked(false); setShowHint(false); }
  };
  const handleRestart = () => { setIdx(0); setInput(""); setChecked(false); setScore(0); setDone(false); setShowHint(false); };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{pct === 100 ? "🎉" : pct >= 60 ? "🪁" : "💪"}</div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>{score}/{QUESTIONS.length} correct</p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 24px" }}>
          {pct === 100 ? "Perfect kite — it'll fly beautifully." : "Kite and rhombus rules are worth knowing cold!"}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleRestart} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Try again</button>
          <button onClick={onBack} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: C.surface, fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer" }}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px", background: q.badgeColour + "20", color: q.badgeColour, border: `1px solid ${q.badgeColour}40` }}>{q.badge}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>{idx + 1}/{QUESTIONS.length}</span>
      </div>
      <div style={{ background: C.purpleDim, border: `1px solid ${C.purple}30`, borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>🪁 {q.hook}</p>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
        <q.Diagram showAnswer={checked} />
      </div>
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{q.question}</p>
      </div>
      {!checked && (
        <>
          <button onClick={() => setShowHint(h => !h)} style={{ background: "none", border: "none", color: C.amber, fontSize: "12px", fontWeight: "700", cursor: "pointer", padding: "0 0 10px", textDecoration: "underline" }}>
            {showHint ? "Hide hint ▲" : "Show hint ▾"}
          </button>
          {showHint && (
            <div style={{ background: C.amberDim, border: `1px solid ${C.amber}30`, borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
              <p style={{ fontSize: "12px", color: C.text, margin: 0 }}>💡 {q.hint}</p>
            </div>
          )}
          <MiniCalc />
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", marginBottom: "12px" }}>
            <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCheck()} placeholder="Angle x in degrees" style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: `1.5px solid ${C.border}`, fontSize: "16px", color: C.text, outline: "none", boxSizing: "border-box" }} />
            <button onClick={handleCheck} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check</button>
          </div>
        </>
      )}
      {checked && (
        <div>
          <div style={{ background: isRight ? C.greenDim : C.redDim, border: `1px solid ${isRight ? C.green : C.red}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: isRight ? C.green : C.red, margin: "0 0 6px" }}>
              {isRight ? `✓ Correct! x = ${q.answer}°` : `✗ The answer is ${q.answer}°`}
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 6px", fontWeight: "700" }}>
              Reason: <span style={{ color: C.text, fontWeight: "400" }}>{q.reason}</span>
            </p>
            {q.working.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: "12px", color: C.text, margin: i > 0 ? "4px 0 0" : 0, fontFamily: "monospace" }}>{line}</p>
            ))}
          </div>
          <button onClick={handleNext} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {idx + 1 >= QUESTIONS.length ? "See my score →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}