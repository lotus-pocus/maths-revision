import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc        from "../../../../shared/MiniCalc";
import AngleArc        from "../../../../shared/geometry/AngleArc";
import RightAngleBox   from "../../../../shared/geometry/RightAngleBox";
import ParallelArrows  from "../../../../shared/geometry/ParallelArrows";
import GeomSVG         from "../../../../shared/geometry/GeomSVG";

// SVG angle convention used throughout:
//   0°   = right
//   90°  = DOWN  (y increases downward in SVG)
//   180° = left
//   270° = up

const BEAM  = "#92400e"; // brown beam colour
const RAFTER = "#374151"; // dark rafter colour
const STRUT  = "#7c3aed"; // purple strut

// ── Q1: Alternate angles ──────────────────────────────────────────────────
// Rafter at 58° from horizontal (SVG 58° = down-right ✓).
// Top beam y=90, bottom beam y=218.
// Top crossing at x=88, bottom crossing at x=88+80=168 (80 = 128/tan58°).
// 58° arc at top: CW from beam-right(0°) to rafter-down(58°).
// Alternate 58° arc at bottom: CW from beam-left(180°) to rafter-up-left(238°).
function Q1Diagram({ showAnswer }) {
  const topY = 90, botY = 218;
  const topX = 88, botX = 168;
  const xCol = showAnswer ? C.green : C.muted;

  return (
    <GeomSVG width={320} height={275}>
      {/* Beams */}
      <line x1={35} y1={topY} x2={290} y2={topY} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <line x1={35} y1={botY} x2={290} y2={botY} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <ParallelArrows x={55} y={topY} angleDeg={0} count={1} color={C.accent} />
      <ParallelArrows x={55} y={botY} angleDeg={0} count={1} color={C.accent} />

      {/* Rafter — extended past both beams */}
      <line
        x1={topX - 28} y1={topY - 28 * Math.tan(58 * Math.PI / 180)}
        x2={botX + 28} y2={botY + 28 * Math.tan(58 * Math.PI / 180)}
        stroke={RAFTER} strokeWidth={3} strokeLinecap="round"
      />

      {/* 58° arc at top: beam-right(0°) → rafter-down(58°), clockwise */}
      <AngleArc
        cx={topX} cy={topY}
        fromDeg={0} toDeg={58} sweep="cw"
        radius={26} color={C.amber}
        label="58°" labelRadius={44} labelSize={13}
        showArmLines armLength={26} fillOpacity={0.2}
      />

      {/* Alternate x° at bottom: beam-left(180°) → rafter-down-left(238°), clockwise */}
      <AngleArc
        cx={botX} cy={botY}
        fromDeg={180} toDeg={238} sweep="cw"
        radius={26} color={xCol}
        label={showAnswer ? "58°" : "x°"} labelRadius={44} labelSize={13}
        showArmLines armLength={26} fillOpacity={0.15}
      />

      {/* Labels */}
      <text x={288} y={topY - 10} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Top beam (parallel)</text>
      <text x={288} y={botY + 20} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam (parallel)</text>
      <text x={botX + 38} y={botY + 46} fontSize={10} fontWeight="600" fill={RAFTER}>Rafter</text>
    </GeomSVG>
  );
}

// ── Q2: Co-interior angles ────────────────────────────────────────────────
// Rafter at 65° from horizontal.
// Top beam y=80, bottom beam y=209.
// Top crossing at x=90, bottom crossing at x=90+57=147 (57 = 129/tan65°).
// 65° arc at top: CW from beam-right(0°) to rafter-down(65°).
// Co-interior 115° arc at bottom: CW from rafter-up-right(245°) to beam-right(360°=0°).
// Both on the RIGHT side of the rafter → C-shape.
function Q2Diagram({ showAnswer }) {
  const topY = 80, botY = 209;
  const topX = 90;
  // horizontal span for 65° rafter over (botY-topY)=129px: 129/tan(65°)=60
  const botX = topX + 60;
  const xCol = showAnswer ? C.green : C.muted;

  // Co-interior shading polygon: right side between beams
  const shadePts = `${topX},${topY} ${botX},${botY} 290,${botY} 290,${topY}`;

  return (
    <GeomSVG width={320} height={268}>
      {/* Co-interior shading */}
      <polygon points={shadePts} fill={C.amberDim} stroke="none" opacity={0.6} />

      {/* Beams */}
      <line x1={35} y1={topY} x2={290} y2={topY} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <line x1={35} y1={botY} x2={290} y2={botY} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <ParallelArrows x={55} y={topY} angleDeg={0} count={1} color={C.accent} />
      <ParallelArrows x={55} y={botY} angleDeg={0} count={1} color={C.accent} />

      {/* Rafter */}
      <line
        x1={topX - 25} y1={topY - 25 * Math.tan(65 * Math.PI / 180)}
        x2={botX + 25} y2={botY + 25 * Math.tan(65 * Math.PI / 180)}
        stroke={RAFTER} strokeWidth={3} strokeLinecap="round"
      />

      {/* 65° arc at top: beam-right(0°) → rafter-down(65°), CW */}
      <AngleArc
        cx={topX} cy={topY}
        fromDeg={0} toDeg={65} sweep="cw"
        radius={26} color={C.amber}
        label="65°" labelRadius={44} labelSize={13}
        showArmLines armLength={26} fillOpacity={0.2}
      />

      {/* 115° co-interior arc at bottom: rafter-up(245°) → beam-right(360°), CW */}
      {/* 245° + 115° = 360° ✓ — sweeps the obtuse sector on the right side */}
      <AngleArc
        cx={botX} cy={botY}
        fromDeg={245} toDeg={360} sweep="cw"
        radius={26} color={xCol}
        label={showAnswer ? "115°" : "x°"} labelRadius={48} labelSize={13}
        showArmLines armLength={26} fillOpacity={0.15}
      />

      {/* Labels */}
      <text x={288} y={topY - 10} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Top beam (parallel)</text>
      <text x={288} y={botY + 20} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam (parallel)</text>
    </GeomSVG>
  );
}

// ── Q3: Multi-step — corresponding angles + triangle sum ──────────────────
// Triangle: 90° at top-left (strut+beam), 72° at top-right (rafter+beam),
// x=18° at bottom-left (rafter+strut). 90+72+18=180 ✓
// Strut at strX=60, rafter top at rX1=118, top beam y=30, bottom beam y=210.
// Rafter angle from horizontal = 72° (SVG: rafter goes down-left = 180°+72°=252°... 
// Wait: rafter goes from top-right DOWN to bottom-left.
// Direction from (118,30) toward (60,210): atan2(180, -58) ≈ 108° from +x.
// 108° from +x = 18° below the leftward horizontal... 
// The angle at top-right INSIDE the triangle (between beam-left and rafter-down-left):
// beam-left = 180°, rafter = 108°, angle between = 180-108 = 72° ✓
function Q3Diagram({ showAnswer }) {
  const y1 = 30, y2 = 210;
  const rX1 = 118, strX = 60;
  // Rafter direction in SVG degrees: atan2(y2-y1, strX-rX1) in degrees
  const rafterDeg = Math.atan2(y2 - y1, strX - rX1) * 180 / Math.PI; // ≈ 108°
  const xCol = showAnswer ? C.green : C.muted;

  return (
    <GeomSVG width={320} height={250}>
      {/* Triangle fill */}
      <polygon points={`${rX1},${y1} ${strX},${y1} ${strX},${y2}`}
        fill={C.accentDim} stroke="none" opacity={0.5} />

      {/* Beams */}
      <line x1={35} y1={y1} x2={290} y2={y1} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <line x1={35} y1={y2} x2={290} y2={y2} stroke={BEAM} strokeWidth={5} strokeLinecap="round" />
      <ParallelArrows x={22} y={y1} angleDeg={0} count={1} color={C.accent} />
      <ParallelArrows x={22} y={y2} angleDeg={0} count={1} color={C.accent} />

      {/* Rafter */}
      <line x1={rX1} y1={y1} x2={strX} y2={y2} stroke={RAFTER} strokeWidth={3} strokeLinecap="round" />

      {/* Vertical strut */}
      <line x1={strX} y1={y1} x2={strX} y2={y2} stroke={STRUT} strokeWidth={3} strokeLinecap="round" />

      {/* Right angle at top-left: strut(90°=down) and beam(0°=right) */}
      <RightAngleBox cx={strX} cy={y1} dir1Deg={0} dir2Deg={90} size={12} color={STRUT} />

      {/* Right angle at bottom-left: strut(270°=up) and beam(0°=right) */}
      <RightAngleBox cx={strX} cy={y2} dir1Deg={270} dir2Deg={0} size={12} color={STRUT} />

      {/* 72° arc at top-right: auto picks the short 72° arc inside triangle */}
      <AngleArc
        cx={rX1} cy={y1}
        fromDeg={108} toDeg={180} sweep="auto"
        radius={22} color={C.amber}
        label="72°" labelRadius={36} labelSize={11}
        showArmLines armLength={22} fillOpacity={0.2}
      />

      {/* x=18° arc at bottom-left: strut-up(270°) → rafter-up(rafterDeg+180°), CCW */}
      {/* rafter going UP from bottom = rafterDeg - 180° = 108-180 = -72° = 288° */}
      <AngleArc
        cx={strX} cy={y2}
        fromDeg={270} toDeg={288} sweep="cw"
        radius={28} color={xCol}
        label={showAnswer ? "18°" : "x°"} labelRadius={46} labelSize={12}
        showArmLines armLength={28} fillOpacity={0.15}
      />

      {/* Corresponding 72° at bottom revealed after answer */}
      {showAnswer && (
        <AngleArc
          cx={strX} cy={y2}
          fromDeg={108} toDeg={180} sweep="auto"
          radius={20} color={C.amber}
          label="72°" labelRadius={34} labelSize={11}
          showArmLines armLength={20} fillOpacity={0.15}
        />
      )}

      {/* Labels */}
      <text x={288} y={y1 - 8}  textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Top beam (parallel)</text>
      <text x={288} y={y2 + 18} textAnchor="end" fontSize={10} fontWeight="700" fill={C.accent}>Bottom beam (parallel)</text>
    </GeomSVG>
  );
}

// ── Question data ─────────────────────────────────────────────────────────
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
    hint: "The angles are on opposite sides of the rafter — they make a Z-shape. What do alternate angles always equal?",
  },
  {
    badge: "Co-interior angles",
    badgeColour: C.amber,
    Diagram: Q2Diagram,
    hook: "Same roof truss — but now both angles are on the same side of the rafter. The shaded region between the beams shows where the co-interior angles sit.",
    question: "The rafter meets the top beam at 65° (below the beam, to the right). Find angle x at the bottom beam on the same side.",
    answer: 115,
    reason: "Co-interior angles add up to 180° (parallel lines)",
    working: "Both angles are on the same side → co-interior (C-shape).\n65 + x = 180°\nx = 115°",
    hint: "Both angles are on the RIGHT side of the rafter between the two beams — C-shape. What do co-interior angles sum to?",
  },
  {
    badge: "Multi-step",
    badgeColour: C.purple,
    Diagram: Q3Diagram,
    hook: "A vertical support strut meets both beams at 90°. The rafter makes a 72° angle where it meets the top beam. They form a triangle — find angle x between the rafter and the strut at the bottom.",
    question: "Step 1: The rafter crosses two parallel beams. Use corresponding angles to find the angle it makes with the bottom beam.\n\nStep 2: The triangle has a 90° angle (top-left), 72° (top-right) and x° at the bottom where the rafter meets the strut. Find x.",
    answer: 18,
    reason: "Step 1: Corresponding angles are equal (parallel lines). Step 2: Angles in a triangle add up to 180°.",
    working: "Step 1: corresponding angle at bottom beam = 72°\nStep 2: 90 + 72 + x = 180°\nx = 18°",
    hint: "The triangle has a right angle at the top-left and 72° at the top-right. Three angles must sum to 180°.",
  },
];

// ── RoofTruss ─────────────────────────────────────────────────────────────
export default function RoofTruss({ onBack }) {
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
          {pct === 100 ? "Roof structurally sound!" : "Parallel line rules keep real roofs standing!"}
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

      <div style={{ background: C.amberDim, border: `1px solid ${C.amber}30`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>🏠 {q.hook}</p>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
        <q.Diagram showAnswer={checked} />
      </div>

      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        {q.question.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: C.text, margin: i > 0 ? "8px 0 0" : 0, lineHeight: 1.6 }}>
            {para}
          </p>
        ))}
      </div>

      {!checked && (
        <>
          <button onClick={() => setShowHint(h => !h)} style={{
            background: "none", border: "none", color: C.amber, fontSize: "12px",
            fontWeight: "700", cursor: "pointer", padding: "0 0 10px", textDecoration: "underline",
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
              type="number" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Angle x in degrees"
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
              Reason: <span style={{ color: C.text, fontWeight: "400" }}>{q.reason}</span>
            </p>
            {q.working.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: "12px", color: C.text,
                margin: i > 0 ? "4px 0 0" : 0, fontFamily: "monospace" }}>{line}</p>
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