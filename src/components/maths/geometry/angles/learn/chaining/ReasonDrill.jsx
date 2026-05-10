import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import SideTicks from "./SideTicks";

// ── Drill SVGs ────────────────────────────────────────────────────────────
// One small diagram per question, matching exactly what the question describes.

// Q1: Isosceles triangle ABD, AB = AD, angle ABD = 70°, find angle ADB
function DiagramQ1() {
  const A = { x: 130, y: 25  };
  const B = { x: 30,  y: 155 };
  const D = { x: 230, y: 155 };
  return (
    <svg viewBox="0 0 260 180" style={{ width: "100%", maxWidth: 240, display: "block" }}>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`} fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`} fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" />
      <SideTicks p1={A} p2={B} count={2} colour={C.accent} />
      <SideTicks p1={A} p2={D} count={2} colour={C.accent} />
      <text x={B.x + 30} y={B.y - 8}  textAnchor="middle" fontSize={12} fontWeight="700" fill={C.text}>70°</text>
      <text x={D.x - 30} y={D.y - 8}  textAnchor="middle" fontSize={12} fontWeight="700" fill={C.muted}>?°</text>
      <text x={A.x}      y={A.y - 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 14} y={B.y + 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={D.x + 14} y={D.y + 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>
    </svg>
  );
}

// Q2: Co-interior angles — transversal crosses two parallel lines.
// BCE = 42° (acute, above-right at C), CEA = 138° (obtuse, below-left at E).
// Both angles are on the LEFT side of the transversal — making the C-shape visible.
// Transversal slopes from top-right (C) to bottom-left (E) so the co-interior
// region between the lines is clearly on the same side.
function DiagramQ2() {
  // Parallel lines: horizontal
  const lineY1 = 55;   // top line y
  const lineY2 = 155;  // bottom line y
  // Transversal: slopes top-right → bottom-left
  // C is on the top line (right side), E is on the bottom line (left of C)
  const Cx = 210; const Cy = lineY1;
  const Ex = 90;  const Ey = lineY2;
  // Extend parallel lines well past the transversal intersection points
  const lineX1 = 20; const lineX2 = 260;

  // The co-interior region: shade the area between the lines, between the
  // transversal and the left side — to make the C-shape obvious
  const shadePts = `${Ex},${Ey} ${Cx},${Cy} ${lineX1},${lineY1} ${lineX1},${lineY2}`;

  return (
    <svg viewBox="0 0 280 200" style={{ width: "100%", maxWidth: 260, display: "block" }}>
      {/* Co-interior region shading (light) */}
      <polygon points={shadePts} fill={C.amberDim} stroke="none" opacity={0.6} />

      {/* Parallel lines */}
      <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY1} stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <line x1={lineX1} y1={lineY2} x2={lineX2} y2={lineY2} stroke={C.accent} strokeWidth={2} strokeLinecap="round" />

      {/* Parallel direction arrows */}
      <text x={lineX2 + 6} y={lineY1 + 4} fontSize={11} fontWeight="700" fill={C.accent}>›</text>
      <text x={lineX2 + 6} y={lineY2 + 4} fontSize={11} fontWeight="700" fill={C.accent}>›</text>

      {/* Transversal C → E */}
      <line x1={Cx} y1={Cy} x2={Ex} y2={Ey} stroke={C.text} strokeWidth={2} strokeLinecap="round" />

      {/* Angle BCE = 42° — acute angle at C, on the LEFT of the transversal,
          below the top line. Label sits in that wedge. */}
      <text x={Cx - 44} y={Cy + 24} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>42°</text>

      {/* Angle CEA = ?° — obtuse angle at E, on the LEFT of the transversal,
          above the bottom line. Label sits in that wide wedge. */}
      <text x={Ex - 36} y={Ey - 14} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.muted}>?°</text>

      {/* Vertex labels */}
      <text x={lineX1 + 10} y={lineY1 - 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={Cx + 16}     y={Cy - 10}     textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
      <text x={lineX1 + 10} y={lineY2 + 16} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={Ex + 16}     y={Ey + 16}     textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>E</text>
    </svg>
  );
}

// Q3: Triangle ADB above a straight line BDC, angle ADB = 55°, angle BDC = ?
function DiagramQ3() {
  const A  = { x: 110, y: 25  };
  const B  = { x: 30,  y: 145 };
  const D  = { x: 180, y: 145 };
  const Cv = { x: 260, y: 145 };
  return (
    <svg viewBox="0 0 290 175" style={{ width: "100%", maxWidth: 270, display: "block" }}>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`} fill={C.accentDim} stroke="none" />
      <line x1={B.x} y1={B.y} x2={Cv.x} y2={Cv.y} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      <text x={D.x - 32} y={D.y - 10} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>55°</text>
      <text x={D.x + 28} y={D.y - 10} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.muted}>?°</text>
      <text x={A.x}       y={A.y - 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 14}  y={B.y + 12} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={D.x}       y={D.y + 16} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>
      <text x={Cv.x + 12} y={Cv.y + 12} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
    </svg>
  );
}

// Q4: Triangle with 65°, 65°, p° — equal base angles, find p at apex
function DiagramQ4() {
  const A  = { x: 130, y: 25  };
  const B  = { x: 30,  y: 155 };
  const C2 = { x: 230, y: 155 };
  return (
    <svg viewBox="0 0 260 180" style={{ width: "100%", maxWidth: 240, display: "block" }}>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C2.x},${C2.y}`} fill={C.amberDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C2.x},${C2.y}`} fill="none" stroke={C.amber} strokeWidth={2} strokeLinejoin="round" />
      <SideTicks p1={A} p2={B}  count={2} colour={C.amber} />
      <SideTicks p1={A} p2={C2} count={2} colour={C.amber} />
      <text x={A.x}        y={A.y + 24} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.muted}>p°</text>
      <text x={B.x + 30}   y={B.y - 8}  textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>65°</text>
      <text x={C2.x - 30}  y={C2.y - 8} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>65°</text>
      <text x={A.x}        y={A.y - 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 14}   y={B.y + 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={C2.x + 14}  y={C2.y + 10} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
    </svg>
  );
}

// Q5: Two straight lines crossing at P.
// Line 1: A ── P ── B (top-left to bottom-right)
// Line 2: C ── P ── D (top-right to bottom-left)
// Angle APC = 48° (acute sector top), angle DPB = ?° (vertically opposite, bottom)
function DiagramQ5() {
  const P = { x: 140, y: 105 };
  // Line 1: A top-left, B bottom-right — one straight line through P
  const A = { x: 40,  y: 30  };
  const B = { x: 240, y: 180 };
  // Line 2: C top-right, D bottom-left — second straight line through P
  const Cv = { x: 240, y: 30  };
  const D  = { x: 40,  y: 180 };
  return (
    <svg viewBox="0 0 280 210" style={{ width: "100%", maxWidth: 260, display: "block" }}>
      {/* Line 1: A through P to B */}
      <line x1={A.x}  y1={A.y}  x2={B.x}  y2={B.y}  stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      {/* Line 2: C through P to D */}
      <line x1={Cv.x} y1={Cv.y} x2={D.x}  y2={D.y}  stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
      {/* 48° in the APC sector — top, between the two lines */}
      <text x={P.x}      y={P.y - 26} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.amber}>48°</text>
      {/* ?° in the DPB sector — bottom, vertically opposite to APC */}
      <text x={P.x}      y={P.y + 38} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.muted}>?°</text>
      {/* Centre point */}
      <circle cx={P.x} cy={P.y} r={3} fill={C.text} />
      {/* Vertex labels */}
      <text x={A.x - 10}  y={A.y - 4}   textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x + 12}  y={B.y + 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={Cv.x + 12} y={Cv.y - 4}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
      <text x={D.x - 12}  y={D.y + 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>
      <text x={P.x + 12}  y={P.y - 8}   textAnchor="middle" fontSize={11} fontWeight="800" fill={C.text}>P</text>
    </svg>
  );
}

// ── Question data ─────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    svg: DiagramQ1,
    q: "AB = AD. Angle ABD = 70°. Which reason justifies writing angle ADB = 70°?",
    options: [
      "Angles in a triangle add up to 180°",
      "Base angles of an isosceles triangle are equal",
      "Alternate angles are equal (parallel lines)",
      "Angles on a straight line add up to 180°",
    ],
    answer: 1,
    explain: "AB = AD makes this an isosceles triangle. The base angles at B and D are therefore equal.",
  },
  {
    svg: DiagramQ2,
    q: "BC is parallel to AE. Angle BCE = 42°. Which reason justifies angle CEA = 138°?",
    options: [
      "Alternate angles are equal (parallel lines)",
      "Co-interior angles add up to 180° (parallel lines)",
      "Corresponding angles are equal (parallel lines)",
      "Vertically opposite angles are equal",
    ],
    answer: 1,
    explain: "BCE and CEA are on the same side of the transversal CE, between the parallel lines — these are co-interior angles. They add up to 180°, so CEA = 180 − 42 = 138°.",
  },
  {
    svg: DiagramQ3,
    q: "Angle ADB = 55°. BDC is a straight line. Which reason justifies angle BDC = 125°?",
    options: [
      "Angles in a triangle add up to 180°",
      "Angles around a point add up to 360°",
      "Angles on a straight line add up to 180°",
      "Vertically opposite angles are equal",
    ],
    answer: 2,
    explain: "ADB and BDC sit on a straight line through D. Two angles on a straight line always sum to 180°, so BDC = 180 − 55 = 125°.",
  },
  {
    svg: DiagramQ4,
    q: "A triangle has angles 65°, 65° and p°. Which reason justifies p = 50°?",
    options: [
      "Base angles of an isosceles triangle are equal",
      "Angles in a triangle add up to 180°",
      "Angles on a straight line add up to 180°",
      "Corresponding angles are equal (parallel lines)",
    ],
    answer: 1,
    explain: "We use the fact that all three angles in any triangle must total 180°. 65 + 65 + p = 180, so p = 50°.",
  },
  {
    svg: DiagramQ5,
    q: "Two straight lines cross at point P. Angle APC = 48°. Which reason gives angle DPB = 48°?",
    options: [
      "Alternate angles are equal (parallel lines)",
      "Angles on a straight line add up to 180°",
      "Vertically opposite angles are equal",
      "Angles in a triangle add up to 180°",
    ],
    answer: 2,
    explain: "APC and DPB are directly across the intersection from each other — A and B are on the same straight line through P, and C and D are on the other. The angles in opposite sectors are always equal: vertically opposite angles.",
  },
];

// ── ReasonDrill ───────────────────────────────────────────────────────────
export default function ReasonDrill() {
  const [idx,    setIdx]    = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score,  setScore]  = useState(0);
  const [done,   setDone]   = useState(false);

  const q       = QUESTIONS[idx];
  const checked = chosen !== null;
  const isRight = chosen === q.answer;

  const handleChoose  = (i) => { if (checked) return; setChosen(i); if (i === q.answer) setScore(s => s + 1); };
  const handleNext    = () => {
    if (idx + 1 >= QUESTIONS.length) setDone(true);
    else { setIdx(i => i + 1); setChosen(null); }
  };
  const handleRestart = () => { setIdx(0); setChosen(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{QUESTIONS.length} reasons correct
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100
            ? "Perfect — you know your reasons cold."
            : "Keep going — the reasons are where marks are made or lost."}
        </p>
        <button onClick={handleRestart} style={{
          padding: "12px 28px", borderRadius: "10px", border: "none",
          background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
        }}>
          Try again
        </button>
      </div>
    );
  }

  const Diagram = q.svg;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.muted, margin: 0 }}>
          Pick the correct reason to justify this step
        </p>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {idx + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Diagram */}
      <div style={{
        display: "flex", justifyContent: "center",
        background: "#fff", borderRadius: "10px", padding: "12px",
        border: `1px solid ${C.border}`, marginBottom: "12px",
      }}>
        <Diagram />
      </div>

      {/* Question text */}
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {q.options.map((opt, i) => {
          let bg = "#fff", border = C.border, col = C.text;
          if (checked) {
            if (i === q.answer)    { bg = C.greenDim; border = C.green; col = C.green; }
            else if (i === chosen) { bg = C.redDim;   border = C.red;   col = C.red;   }
          } else if (chosen === i) { bg = C.accentDim; border = C.accent; }

          return (
            <button key={i} onClick={() => handleChoose(i)} style={{
              padding: "11px 14px", borderRadius: "10px", border: `1.5px solid ${border}`,
              background: bg, color: col, fontSize: "13px", fontWeight: "600",
              textAlign: "left", cursor: checked ? "default" : "pointer",
              lineHeight: 1.5, transition: "all 0.15s",
            }}>
              {checked && i === q.answer && "✓ "}{opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {checked && (
        <div>
          <div style={{
            background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "12px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : "✗ Not quite"}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
              {q.explain}
            </p>
          </div>
          <button onClick={handleNext} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>
            {idx + 1 >= QUESTIONS.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}