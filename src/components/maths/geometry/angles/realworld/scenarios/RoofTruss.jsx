import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc from "../../../../shared/MiniCalc";

// ── Q1: Alternate angles ──────────────────────────────────────────────────
// Rafter from (88,90) to (168,218) = exactly 58° from horizontal.
// Arc at top: 58° sector below top beam, right of rafter crossing.
// Arc at bottom: alternate 58° sector above bottom beam, left of rafter crossing.
function Q1Diagram({ showAnswer }) {
  const xCol = showAnswer ? C.green : C.muted;
  // Rafter: (88,90)→(168,218), extended to (68,58)→(188,250)
  // Top beam crossing at (88,90), bottom beam crossing at (168,218)
  return (
    <svg viewBox="0 0 320 275" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={275} fill="#f8f7f4" rx={8} />

      {/* Parallel beams */}
      <line x1={35} y1={90}  x2={290} y2={90}  stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <line x1={35} y1={218} x2={290} y2={218} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <text x={22} y={95}  fontSize={13} fill={C.accent} fontWeight="800">›</text>
      <text x={22} y={223} fontSize={13} fill={C.accent} fontWeight="800">›</text>

      {/* Rafter — extended past both beams */}
      <line x1={68} y1={58} x2={188} y2={250} stroke="#374151" strokeWidth={3} strokeLinecap="round" />

      {/* TOP arc: 58° sector, clockwise from beam-right to rafter-down */}
      {/* Two thin reference lines showing which sector */}
      <line x1={88} y1={90} x2={115} y2={90}  stroke={C.amber} strokeWidth={1.5} opacity={0.7} />
      <line x1={88} y1={90} x2={100} y2={109} stroke={C.amber} strokeWidth={1.5} opacity={0.7} />
      <path d="M 110.0 90.0 A 22 22 0 0 1 99.7 108.7"
        fill="none" stroke={C.amber} strokeWidth={2.5} strokeLinecap="round" />
      <text x={119} y={112} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>58°</text>

      {/* BOTTOM arc: alternate 58° sector, CCW from rafter-up to beam-left */}
      <line x1={168} y1={218} x2={156} y2={199} stroke={xCol} strokeWidth={1.5} opacity={0.7} />
      <line x1={168} y1={218} x2={145} y2={218} stroke={xCol} strokeWidth={1.5} opacity={0.7} />
      <path d="M 156.3 199.3 A 22 22 0 0 0 146.0 218.0"
        fill="none" stroke={xCol} strokeWidth={2.5} strokeLinecap="round" />
      <text x={134} y={202} textAnchor="middle" fontSize={13} fontWeight="800" fill={xCol}>
        {showAnswer ? "58°" : "x°"}
      </text>

      <text x={290} y={76}  textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Top beam (parallel)</text>
      <text x={290} y={236} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam (parallel)</text>
      <text x={200} y={255} fontSize={10} fontWeight="600" fill="#374151">Rafter</text>
    </svg>
  );
}

// ── Q2: Co-interior angles ────────────────────────────────────────────────
// Rafter from (90,80) to (150,209) = exactly 65° from horizontal.
// Top: 65° arc below top beam right of rafter.
// Bottom: 115° co-interior arc above bottom beam right of rafter (same side).
// 65 + 115 = 180 ✓
function Q2Diagram({ showAnswer }) {
  const xCol = showAnswer ? C.green : C.muted;
  // Rafter extended: from ~(70,47) to ~(170,242)
  return (
    <svg viewBox="0 0 320 270" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={270} fill="#f8f7f4" rx={8} />

      {/* Co-interior shading — right side between beams (same side as both angles) */}
      <polygon points="90,80 150,209 290,209 290,80"
        fill={C.amberDim} stroke="none" opacity={0.5} />

      {/* Parallel beams */}
      <line x1={35} y1={80}  x2={290} y2={80}  stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <line x1={35} y1={209} x2={290} y2={209} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <text x={22} y={85}  fontSize={13} fill={C.accent} fontWeight="800">›</text>
      <text x={22} y={214} fontSize={13} fill={C.accent} fontWeight="800">›</text>

      {/* Rafter */}
      <line x1={70} y1={47} x2={170} y2={242} stroke="#374151" strokeWidth={3} strokeLinecap="round" />

      {/* TOP arc: 65° CW from beam-right to rafter-down */}
      <line x1={90} y1={80} x2={117} y2={80}  stroke={C.amber} strokeWidth={1.5} opacity={0.6} />
      <line x1={90} y1={80} x2={99}  y2={100} stroke={C.amber} strokeWidth={1.5} opacity={0.6} />
      <path d="M 112 80 A 22 22 0 0 1 99.3 99.9"
        fill="none" stroke={C.amber} strokeWidth={2.5} strokeLinecap="round" />
      <text x={124} y={104} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>65°</text>

      {/* BOTTOM arc: 115° CW from rafter-up to beam-right — correct short arc */}
      <line x1={150} y1={209} x2={177} y2={209} stroke={xCol} strokeWidth={1.5} opacity={0.6} />
      <line x1={150} y1={209} x2={141} y2={189} stroke={xCol} strokeWidth={1.5} opacity={0.6} />
      <path d="M 140.7 189.1 A 22 22 0 0 1 172 209"
        fill="none" stroke={xCol} strokeWidth={2.5} strokeLinecap="round" />
      <text x={170} y={177} textAnchor="middle" fontSize={13} fontWeight="800" fill={xCol}>
        {showAnswer ? "115°" : "x°"}
      </text>

      <text x={290} y={66}  textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Top beam (parallel)</text>
      <text x={290} y={225} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam (parallel)</text>
    </svg>
  );
}

// ── Q3: Multi-step — corresponding + triangle sum ─────────────────────────
// Rafter makes 72° with top beam. Vertical strut meets bottom beam at 90°.
// Step 1: corresponding angle at bottom = 72°.
// Step 2: 72 + 90 + x = 180 → x = 18°. ✓
function Q3Diagram({ showAnswer }) {
  const y1 = 55, y2 = 178;
  const rX1 = 228, rX2 = 100;
  const strX = 100;
  return (
    <svg viewBox="0 0 320 235" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={235} fill="#f8f7f4" rx={8} />
      {/* Triangle fill */}
      <polygon points={`${rX1},${y1} ${strX},${y1} ${strX},${y2}`}
        fill={C.accentDim} stroke="none" opacity={0.6} />
      <line x1={40} y1={y1} x2={285} y2={y1} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <line x1={40} y1={y2} x2={285} y2={y2} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
      <text x={26} y={y1 + 5} fontSize={13} fill={C.accent} fontWeight="800">›</text>
      <text x={26} y={y2 + 5} fontSize={13} fill={C.accent} fontWeight="800">›</text>
      {/* Rafter */}
      <line x1={rX1} y1={y1} x2={rX2} y2={y2} stroke="#374151" strokeWidth={3} strokeLinecap="round" />
      {/* Vertical strut */}
      <line x1={strX} y1={y1} x2={strX} y2={y2} stroke={C.purple} strokeWidth={3} strokeLinecap="round" />
      {/* Right angle mark */}
      <rect x={strX} y={y2 - 13} width={13} height={13} fill="none" stroke={C.purple} strokeWidth={1.5} />
      {/* Known 72° at top-right of rafter */}
      <text x={rX1 - 34} y={y1 + 22} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>72°</text>
      {/* Corresponding 72° revealed after check */}
      {showAnswer && (
        <text x={rX2 + 38} y={y2 - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.amber}>72°</text>
      )}
      {/* x° at top where rafter meets strut */}
      <text x={rX1 - 8} y={y1 - 10} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>{showAnswer ? "18°" : "x°"}</text>
      <text x={44} y={y1 - 12} fontSize={10} fontWeight="700" fill={C.accent}>Top beam</text>
      <text x={44} y={y2 + 18} fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam</text>
    </svg>
  );
}

const QUESTIONS = [
  {
    badge: "Alternate angles",
    badgeColour: C.accent,
    Diagram: Q1Diagram,
    hook: "The two horizontal beams of a roof truss run parallel to each other. A diagonal rafter crosses both beams — just like a transversal crossing parallel lines.",
    question: "The rafter meets the top beam creating a 58° angle (below the beam, to the right of the rafter). Find angle x where the rafter meets the bottom beam on the opposite side.",
    answer: 58,
    reason: "Alternate angles are equal (parallel lines)",
    working: "The two angles are on opposite sides of the rafter between parallel beams.\nThey form a Z-shape → alternate angles.\nx = 58°",
    hint: "The angles are on opposite sides of the rafter — one above the top beam, one below the bottom beam. They make a Z-shape.",
  },
  {
    badge: "Co-interior angles",
    badgeColour: C.amber,
    Diagram: Q2Diagram,
    hook: "Same roof truss — but now both angles are on the same side of the rafter. The shaded region between the beams shows where the co-interior angles sit.",
    question: "The rafter meets the top beam at 65° (below the beam, to the right of the rafter). Find angle x at the bottom beam on the same side.",
    answer: 115,
    reason: "Co-interior angles add up to 180° (parallel lines)",
    working: "Both angles are on the same side → co-interior (C-shape).\n65 + x = 180°\nx = 115°",
    hint: "Both angles are on the RIGHT side of the rafter, between the two beams. They form a C-shape — what do co-interior angles sum to?",
  },
  {
    badge: "Multi-step",
    badgeColour: C.purple,
    Diagram: Q3Diagram,
    hook: "A vertical support strut meets the bottom beam at exactly 90°. The rafter makes a 72° angle at the top beam. Together they form a triangle — find angle x at the top.",
    question: "Step 1: Use corresponding angles to find the angle the rafter makes with the bottom beam.\n\nStep 2: The triangle has angles 72°, 90° and x°. Find x.",
    answer: 18,
    reason: "Step 1: Corresponding angles are equal (parallel lines). Step 2: Angles in a triangle add up to 180°.",
    working: "Step 1: corresponding angle at bottom beam = 72°\nStep 2: 72 + 90 + x = 180°\nx = 18°",
    hint: "The rafter crosses both parallel beams — use corresponding angles to carry the 72° to the bottom. Then apply triangle sum with the 90° strut.",
  },
];

export default function RoofTruss({ onBack }) {
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
          {pct === 100 ? "Roof structurally sound!" : "Parallel line rules keep real roofs standing!"}
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
      <div style={{ background: C.amberDim, border: `1px solid ${C.amber}30`, borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>🏠 {q.hook}</p>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
        <q.Diagram showAnswer={checked} />
      </div>
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        {q.question.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: C.text, margin: i > 0 ? "8px 0 0" : 0, lineHeight: 1.6 }}>{para}</p>
        ))}
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