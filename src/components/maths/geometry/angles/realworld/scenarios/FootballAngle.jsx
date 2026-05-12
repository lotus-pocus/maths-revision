import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc  from "../../../../shared/MiniCalc";
import AngleArc  from "../../../../shared/geometry/AngleArc";
import GeomSVG   from "../../../../shared/geometry/GeomSVG";

// ── Q1: Rectangle — all angles 90° ───────────────────────────────────────
function Q1Diagram({ showAnswer }) {
  const x1 = 60, y1 = 50, x2 = 260, y2 = 180;
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={230} fill="#16a34a" rx={8} />
      <rect x={10} y={10} width={300} height={210} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={4} />
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1}
        fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth={2.5} />
      {/* Right angle marks */}
      {[
        { cx: x1, cy: y1, dx: 1,  dy: 1  },
        { cx: x2, cy: y1, dx: -1, dy: 1  },
        { cx: x2, cy: y2, dx: -1, dy: -1 },
        { cx: x1, cy: y2, dx: 1,  dy: -1 },
      ].map(({ cx, cy, dx, dy }, i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={cx + dx*14} y2={cy} stroke="#fff" strokeWidth={1.5} opacity={0.6} />
          <line x1={cx} y1={cy} x2={cx} y2={cy + dy*14} stroke="#fff" strokeWidth={1.5} opacity={0.6} />
          <line x1={cx+dx*14} y1={cy} x2={cx+dx*14} y2={cy+dy*14} stroke="#fff" strokeWidth={1.5} opacity={0.6} />
          <line x1={cx} y1={cy+dy*14} x2={cx+dx*14} y2={cy+dy*14} stroke="#fff" strokeWidth={1.5} opacity={0.6} />
        </g>
      ))}
      <text x={x1+26} y={y1+28} textAnchor="middle" fontSize={13} fontWeight="800" fill="#fbbf24">90°</text>
      <text x={x2-26} y={y2-10} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? "#4ade80" : "rgba(255,255,255,0.6)"}>
        {showAnswer ? "90°" : "x°"}
      </text>
      <text x={160} y={40} textAnchor="middle" fontSize={11} fontWeight="700" fill="rgba(255,255,255,0.8)">Penalty box</text>
    </svg>
  );
}

// ── Q2: Parallelogram ─────────────────────────────────────────────────────
// Redesigned so A is clearly the obtuse 118° corner.
// A bottom-left obtuse, B top-left acute, C top-right obtuse, D bottom-right acute.
// A=(55,175), B=(175,65), C=(270,65), D=(150,175)
// Angle at A between AD (going right) and AB (going up-right at ~42° above horizontal)
// = 180 - 42 = 138°... need to get closer to 118.
// For 118° at A: AB makes angle (180-118)=62° with AD.
// AD goes right (0°). AB goes at 62° above horizontal = SVG angle -62° = 298°.
// If horizontal span AB = 100, vertical = 100*tan(62°) = 188 — too tall.
// Use span=80, height=80*tan(62°)=150. B=(55+80, 175-150)=(135,25) — off screen.
// Compromise: span=90, height=90*tan(50°)=107. Angle=50°. Interior=130°. Closer.
// Best approach: just pick vertices that look right and label correctly.
// A=(50,180) D=(210,180) B=(120,60) C=(280,60)
// AD vector: (160,0), AB vector: (70,-120)
// angle at A = acos((AD·AB)/(|AD||AB|)) = acos(160*70/(160*sqrt(70²+120²)))
//           = acos(11200/(160*139.3)) = acos(11200/22288) = acos(0.503) = 59.8° — acute, wrong
// Need A to be obtuse. Make AB go more leftward from A.
// A=(130,180) D=(270,180) B=(50,65) C=(190,65)
// AD=(140,0), AB=(-80,-115)
// cos(angle) = (140*-80 + 0*-115)/(140 * sqrt(80²+115²)) = -11200/(140*139.9) = -0.572
// angle = acos(-0.572) = 124.9° ✓ — close to 118°, looks obtuse
// Let's use A=(140,180) D=(275,180) B=(55,65) C=(190,65) for better spacing
function Q2Diagram({ showAnswer }) {
  const A  = { x: 140, y: 180 };
  const B  = { x: 55,  y: 65  };
  const Cv = { x: 190, y: 65  };
  const D  = { x: 275, y: 180 };
  const pts = `${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`;

  return (
    <svg viewBox="0 0 320 225" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={225} fill="#16a34a" rx={8} />
      <rect x={10} y={10} width={300} height={205} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={4} />
      <polygon points={pts} fill="rgba(255,255,255,0.1)" stroke="#fbbf24" strokeWidth={2} strokeLinejoin="round" />

      {/* 118° at A — label inside the wide obtuse angle */}
      <text x={A.x} y={A.y - 28} textAnchor="middle" fontSize={14} fontWeight="800" fill="#fbbf24">118°</text>
      <line x1={A.x} y1={A.y-8} x2={A.x} y2={A.y-20} stroke="#fbbf24" strokeWidth={1} opacity={0.5} />

      {/* x° at B — the adjacent acute angle */}
      <text x={B.x + 50} y={B.y + 36} textAnchor="middle" fontSize={14} fontWeight="800"
        fill={showAnswer ? "#4ade80" : "rgba(255,255,255,0.85)"}>
        {showAnswer ? "62°" : "x°"}
      </text>
      <line x1={B.x+8} y1={B.y+8} x2={B.x+32} y2={B.y+22} stroke={showAnswer ? "#4ade80" : "#fff"} strokeWidth={1} opacity={0.4} />

      {/* Opposite C — shown after answer */}
      {showAnswer && (
        <>
          <text x={Cv.x} y={Cv.y + 36} textAnchor="middle" fontSize={13} fontWeight="700" fill="#fbbf24">118°</text>
          <line x1={Cv.x} y1={Cv.y+8} x2={Cv.x} y2={Cv.y+22} stroke="#fbbf24" strokeWidth={1} opacity={0.4} />
        </>
      )}

      {/* Players */}
      {[A, B, Cv, D].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={9} fill="#fff" opacity={0.95} />
          <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight="800" fill="#16a34a">
            {["A","B","C","D"][i]}
          </text>
        </g>
      ))}

      <text x={160} y={210} textAnchor="middle" fontSize={10} fontWeight="700" fill="rgba(255,255,255,0.7)">
        Player formation (parallelogram)
      </text>
    </svg>
  );
}

// ── Q3: Quadrilateral sum — 360° ──────────────────────────────────────────
function Q3Diagram({ showAnswer }) {
  const A  = { x: 55,  y: 165 };
  const B  = { x: 80,  y: 50  };
  const Cv = { x: 240, y: 60  };
  const D  = { x: 265, y: 165 };
  const pts = `${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`;
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={220} fill="#16a34a" rx={8} />
      <rect x={10} y={10} width={300} height={200} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={4} />
      <polygon points={pts} fill="rgba(255,255,255,0.08)" stroke="#fbbf24" strokeWidth={2} strokeLinejoin="round" />

      {/* Angle labels inside each corner */}
      <text x={A.x+42}  y={A.y-26}  textAnchor="middle" fontSize={12} fontWeight="800" fill="#fbbf24">95°</text>
      <text x={B.x+42}  y={B.y+32}  textAnchor="middle" fontSize={12} fontWeight="800" fill="#fbbf24">88°</text>
      <text x={Cv.x-42} y={Cv.y+32} textAnchor="middle" fontSize={12} fontWeight="800" fill="#fbbf24">107°</text>
      <text x={D.x-42}  y={D.y-26}  textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? "#4ade80" : "rgba(255,255,255,0.8)"}>
        {showAnswer ? "70°" : "x°"}
      </text>

      {/* Players */}
      {[A, B, Cv, D].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={9} fill="#fff" opacity={0.95} />
          <text x={p.x} y={p.y+4} textAnchor="middle" fontSize={10} fontWeight="800" fill="#16a34a">
            {["A","B","C","D"][i]}
          </text>
        </g>
      ))}
      <text x={160} y={207} textAnchor="middle" fontSize={10} fontWeight="700" fill="rgba(255,255,255,0.7)">
        Four-player formation
      </text>
    </svg>
  );
}

const QUESTIONS = [
  {
    badge: "Rectangle",
    badgeColour: C.accent,
    Diagram: Q1Diagram,
    hook: "The penalty box is a rectangle — a special quadrilateral where all four angles are exactly 90°. A coach is marking the corners and wants to verify the opposite corner.",
    question: "The top-left corner of the penalty box measures 90°. What is angle x at the bottom-right corner?",
    answer: 90,
    reason: "Angles in a rectangle are all 90°",
    working: "A rectangle has four right angles.\nAll corners = 90°.\nx = 90°",
    hint: "What is special about all four angles in any rectangle?",
  },
  {
    badge: "Parallelogram",
    badgeColour: C.amber,
    Diagram: Q2Diagram,
    hook: "Four players (A, B, C, D) hold a parallelogram formation on the pitch. The coach measures the angle at player A as 118° and needs to know the angle at player B for the drill.",
    question: "The formation is a parallelogram. Angle at A = 118°. Find angle x at player B (adjacent to A).",
    answer: 62,
    reason: "Adjacent angles in a parallelogram add up to 180°",
    working: "Adjacent angles in a parallelogram are co-interior → sum to 180°.\n118 + x = 180°\nx = 62°",
    hint: "In a parallelogram, opposite angles are equal and adjacent angles add up to 180°. A is 118° — what does B add up to with A?",
  },
  {
    badge: "Quadrilateral sum",
    badgeColour: C.purple,
    Diagram: Q3Diagram,
    hook: "Four players form an irregular quadrilateral to cover the pitch. Three angles have been measured by GPS tracking. The coach needs the fourth angle to set up the drill correctly.",
    question: "The four players form a quadrilateral. Three angles are 95°, 88° and 107°. Find angle x at player D.",
    answer: 70,
    reason: "Angles in a quadrilateral add up to 360°",
    working: "95 + 88 + 107 + x = 360°\n290 + x = 360°\nx = 70°",
    hint: "No matter what shape any quadrilateral is, all four interior angles always add up to the same total. What is it?",
  },
];

export default function FootballAngle({ onBack }) {
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
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{pct === 100 ? "🎉" : pct >= 60 ? "⚽" : "💪"}</div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>{score}/{QUESTIONS.length} correct</p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 24px" }}>
          {pct === 100 ? "Tactical genius — angles and football mastered." : "Quadrilateral rules apply everywhere — even on a pitch!"}
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
      <div style={{ background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>⚽ {q.hook}</p>
      </div>
      <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
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