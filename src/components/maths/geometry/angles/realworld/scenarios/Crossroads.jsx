import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc from "../../../../shared/MiniCalc";

// ── Q1: Vertically opposite ───────────────────────────────────────────────
// Two roads cross. One angle = 65°. Find the vertically opposite angle.
function Q1Diagram({ showAnswer }) {
  const cx = 160, cy = 115;
  const road1 = { x1: 40, y1: 60,  x2: 280, y2: 170 }; // diagonal road 1
  const road2 = { x1: 280, y1: 55, x2: 40,  y2: 175 }; // diagonal road 2
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", display: "block" }}>
      {/* Tarmac background */}
      <rect width={320} height={230} fill="#d1d5db" rx={8} />
      {/* Road 1 */}
      <line x1={road1.x1} y1={road1.y1} x2={road1.x2} y2={road1.y2} stroke="#6b7280" strokeWidth={28} />
      <line x1={road1.x1} y1={road1.y1} x2={road1.x2} y2={road1.y2} stroke="#fff" strokeWidth={2} strokeDasharray="14,10" opacity={0.5} />
      {/* Road 2 */}
      <line x1={road2.x1} y1={road2.y1} x2={road2.x2} y2={road2.y2} stroke="#6b7280" strokeWidth={28} />
      <line x1={road2.x1} y1={road2.y1} x2={road2.x2} y2={road2.y2} stroke="#fff" strokeWidth={2} strokeDasharray="14,10" opacity={0.5} />
      {/* Intersection */}
      <circle cx={cx} cy={cy} r={5} fill="#374151" />
      {/* Known angle — top sector */}
      <text x={cx} y={cy - 28} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>65°</text>
      {/* Vertically opposite — bottom sector */}
      <text x={cx} y={cy + 42} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "65°" : "x°"}
      </text>
      {/* Left/right sectors */}
      <text x={cx - 44} y={cy + 8} textAnchor="middle" fontSize={11} fontWeight="600" fill="#374151">115°</text>
      <text x={cx + 44} y={cy + 8} textAnchor="middle" fontSize={11} fontWeight="600" fill="#374151">115°</text>
    </svg>
  );
}

// ── Q2: Angles on a straight line ─────────────────────────────────────────
// A side road joins a straight main road. Creates two angles on one side.
// Known angles: 43° and 112°. Third angle x on the straight line.
// 43 + 112 + x = 180 → x = 25°. ✓
function Q2Diagram({ showAnswer }) {
  const cy = 130;
  const jx = 160; // junction x
  // Side road angles at junction
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={230} fill="#d1d5db" rx={8} />
      {/* Main road (horizontal) */}
      <rect x={0} y={cy - 18} width={320} height={36} fill="#6b7280" />
      <line x1={0} y1={cy} x2={320} y2={cy} stroke="#fff" strokeWidth={2} strokeDasharray="14,10" opacity={0.5} />
      {/* Side road 1 — left angle 43° */}
      <line x1={jx} y1={cy - 18} x2={jx - 80} y2={cy - 95}
        stroke="#6b7280" strokeWidth={26} strokeLinecap="round" />
      {/* Side road 2 — right angle 112° */}
      <line x1={jx} y1={cy - 18} x2={jx + 60} y2={cy - 95}
        stroke="#6b7280" strokeWidth={26} strokeLinecap="round" />
      {/* Angle labels above the road */}
      <text x={jx - 52} y={cy - 26} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>43°</text>
      <text x={jx + 52} y={cy - 26} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>112°</text>
      {/* x° — the remaining angle */}
      <text x={jx + 20} y={cy - 4} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "25°" : "x°"}
      </text>
      <text x={160} y={cy + 32} textAnchor="middle" fontSize={11} fontWeight="700" fill="#fff">Main road</text>
    </svg>
  );
}

// ── Q3: Angles around a point ─────────────────────────────────────────────
// Roundabout — 4 roads meet. Three angles given. Find x.
// 95 + 82 + 110 + x = 360 → x = 73°. ✓
function Q3Diagram({ showAnswer }) {
  const cx = 160, cy = 115, r = 42;
  // Road directions (angles in degrees from top)
  const roads = [
    { angle: -60,  label: "A", knownAngle: 95  },
    { angle: 30,   label: "B", knownAngle: 82  },
    { angle: 135,  label: "C", knownAngle: 110 },
    { angle: 240,  label: "D", knownAngle: null },
  ];
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={230} fill="#d1d5db" rx={8} />
      {/* Roads */}
      {roads.map((rd, i) => {
        const rad = (rd.angle - 90) * Math.PI / 180;
        const ex = cx + Math.cos(rad) * 110, ey = cy + Math.sin(rad) * 110;
        return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#6b7280" strokeWidth={28} strokeLinecap="round" />;
      })}
      {/* Roundabout circle */}
      <circle cx={cx} cy={cy} r={r} fill="#9ca3af" stroke="#6b7280" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke="#fff" strokeWidth={1} strokeDasharray="6,6" opacity={0.5} />
      {/* Angle labels between roads */}
      {[
        { angle: -15, text: "95°",  col: C.amber },
        { angle: 82,  text: "82°",  col: C.amber },
        { angle: 187, text: "110°", col: C.amber },
        { angle: 298, text: showAnswer ? "73°" : "x°", col: showAnswer ? C.green : C.muted },
      ].map(({ angle, text, col }, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        const lx = cx + Math.cos(rad) * 70, ly = cy + Math.sin(rad) * 70;
        return <text key={i} x={lx} y={ly} textAnchor="middle" fontSize={12} fontWeight="800" fill={col}>{text}</text>;
      })}
    </svg>
  );
}

const QUESTIONS = [
  {
    badge: "Vertically opposite",
    badgeColour: C.accent,
    Diagram: Q1Diagram,
    hook: "Two roads cross at a junction. The highway engineer has measured the top angle as 65°. The opposite angle is needed to place road markings correctly.",
    question: "Two straight roads cross at a point. The angle in the top sector = 65°. Find angle x in the vertically opposite sector.",
    answer: 65,
    reason: "Vertically opposite angles are equal",
    working: "The two roads form an X at the junction.\nThe top and bottom angles are directly opposite.\nx = 65°",
    hint: "When two straight lines cross, the angles directly opposite each other — sharing only the crossing point — are always equal.",
  },
  {
    badge: "Straight line",
    badgeColour: C.amber,
    Diagram: Q2Diagram,
    hook: "Two side roads join a straight main road at the same junction. A traffic engineer needs to know angle x — the gap between them — to plan road markings.",
    question: "Three roads meet on one side of the main road, making angles of 43°, x° and 112° along the straight line. Find x.",
    answer: 25,
    reason: "Angles on a straight line add up to 180°",
    working: "43 + x + 112 = 180°\n155 + x = 180°\nx = 25°",
    hint: "All the angles on one side of a straight road must add up to the same total. What is it?",
  },
  {
    badge: "Around a point",
    badgeColour: C.purple,
    Diagram: Q3Diagram,
    hook: "A roundabout has four exits. A road planner has measured three of the angles between the exits. The fourth angle — between exits C and D — is needed for the design.",
    question: "Four roads leave a roundabout, creating angles of 95°, 82°, 110° and x° around the centre point. Find x.",
    answer: 73,
    reason: "Angles around a point add up to 360°",
    working: "95 + 82 + 110 + x = 360°\n287 + x = 360°\nx = 73°",
    hint: "All the angles around any single point — like the centre of a roundabout — always sum to the same total. What is it?",
  },
];

export default function Crossroads({ onBack }) {
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
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>{score}/{QUESTIONS.length} correct</p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 24px" }}>
          {pct === 100 ? "Road planning approved!" : "Every road junction uses these exact angle rules."}
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
      <div style={{ background: "#f3f4f6", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>🚦 {q.hook}</p>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
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