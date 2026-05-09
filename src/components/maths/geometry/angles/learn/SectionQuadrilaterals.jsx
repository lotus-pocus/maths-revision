import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import { ExamTip, RuleCard, SubTabBar } from "./LearnUI";
import { QuadDiagonalSVG, WorkedExampleSVG } from "../shared/QuadDiagonalSVG";

// ── Quadrilateral SVG ─────────────────────────────────────────────────────
function QuadSVG({ points, colour, colourDim, angles, labels, width = 260, height = 200 }) {
  const pts = points.map(([x,y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width, overflow: "visible" }}>
      <polygon points={pts} fill={colourDim} stroke="none" />
      <polygon points={pts} fill="none" stroke={colour} strokeWidth={2} strokeLinejoin="round" />
      {labels && labels.map(({ x, y, text }, i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text}>{text}</text>
      ))}
      {angles && angles.map(({ x, y, text, col }, i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={11} fontWeight="700" fill={col || colour}>{text}</text>
      ))}
    </svg>
  );
}

// ── Shape data ────────────────────────────────────────────────────────────
const SHAPES = [
  {
    id: "square", name: "Square", icon: "⬛",
    colour: C.accent, colourDim: C.accentDim,
    rule: "All 4 angles are 90°. All 4 sides equal.",
    examPhrase: "Angles in a square are 90°",
    points: [[60,30],[180,30],[180,130],[60,130]],
    angleLabels: [
      { x: 75,  y: 48,  text: "90°" }, { x: 165, y: 48,  text: "90°" },
      { x: 165, y: 118, text: "90°" }, { x: 75,  y: 118, text: "90°" },
    ],
    vertexLabels: [
      { x: 50,  y: 25,  text: "A" }, { x: 190, y: 25,  text: "B" },
      { x: 190, y: 145, text: "C" }, { x: 50,  y: 145, text: "D" },
    ],
    facts: [
      "All four angles are exactly 90°",
      "Opposite sides are parallel",
      "All four sides are equal length",
      "Diagonals bisect each other at 90°",
    ],
  },
  {
    id: "rectangle", name: "Rectangle", icon: "▬",
    colour: C.accent, colourDim: C.accentDim,
    rule: "All 4 angles are 90°. Opposite sides equal.",
    examPhrase: "Angles in a rectangle are 90°",
    points: [[40,55],[220,55],[220,145],[40,145]],
    angleLabels: [
      { x: 58,  y: 74,  text: "90°" }, { x: 202, y: 74,  text: "90°" },
      { x: 202, y: 134, text: "90°" }, { x: 58,  y: 134, text: "90°" },
    ],
    vertexLabels: [
      { x: 28,  y: 48,  text: "A" }, { x: 232, y: 48,  text: "B" },
      { x: 232, y: 158, text: "C" }, { x: 28,  y: 158, text: "D" },
    ],
    facts: [
      "All four angles are exactly 90°",
      "Opposite sides are parallel and equal",
      "Diagonals are equal in length",
      "A square is a special rectangle",
    ],
  },
  {
    id: "parallelogram", name: "Parallelogram", icon: "▱",
    colour: C.amber, colourDim: C.amberDim,
    rule: "Opposite angles are equal. Adjacent angles add to 180°.",
    examPhrase: "Opposite angles in a parallelogram are equal",
    points: [[60,155],[155,40],[215,40],[120,155]],
    angleLabels: [
      { x: 82,  y: 138, text: "a°" }, { x: 154, y: 58,  text: "a°" },
      { x: 206, y: 58,  text: "b°" }, { x: 112, y: 138, text: "b°" },
    ],
    vertexLabels: [
      { x: 46,  y: 168, text: "A" }, { x: 154, y: 28,  text: "B" },
      { x: 228, y: 28,  text: "C" }, { x: 124, y: 168, text: "D" },
    ],
    facts: [
      "Opposite angles are equal (a = a, b = b)",
      "Adjacent angles add up to 180° (a + b = 180°)",
      "Opposite sides are parallel and equal",
      "Rectangles and squares are special parallelograms",
    ],
  },
  {
    id: "trapezium", name: "Trapezium", icon: "⏢",
    colour: C.green, colourDim: C.greenDim,
    rule: "One pair of parallel sides. Co-interior angles add to 180°.",
    examPhrase: "Co-interior angles add up to 180° (parallel lines)",
    points: [[55,145],[135,45],[185,45],[220,145]],
    angleLabels: [
      { x: 76,  y: 130, text: "c°" },
      { x: 146, y: 64,  text: "c°", col: C.accent },
      { x: 180, y: 64,  text: "d°", col: C.accent },
      { x: 204, y: 130, text: "d°" },
    ],
    vertexLabels: [
      { x: 40,  y: 158, text: "A" }, { x: 134, y: 32,  text: "B" },
      { x: 188, y: 32,  text: "C" }, { x: 234, y: 158, text: "D" },
    ],
    facts: [
      "One pair of parallel sides (AB ∥ DC in an isosceles trapezium)",
      "Co-interior angles between parallel sides add to 180°",
      "The two angles on the same side always sum to 180°",
      "This is a direct application of the parallel lines rule",
    ],
  },
  {
    id: "kite", name: "Kite", icon: "🪁",
    colour: C.purple, colourDim: C.purpleDim,
    rule: "One pair of opposite angles equal. The other pair are different.",
    examPhrase: "The two angles between unequal sides of a kite are equal",
    points: [[130,18],[215,95],[130,172],[45,95]],
    angleLabels: [
      { x: 130, y: 40,  text: "a°" }, { x: 196, y: 95,  text: "b°" },
      { x: 130, y: 154, text: "c°" }, { x: 64,  y: 95,  text: "b°" },
    ],
    vertexLabels: [
      { x: 130, y: 8,   text: "A" }, { x: 228, y: 95,  text: "B" },
      { x: 130, y: 186, text: "C" }, { x: 32,  y: 95,  text: "D" },
    ],
    facts: [
      "Two pairs of equal adjacent sides (AB=AD, CB=CD)",
      "The angles between UNEQUAL sides are equal (B = D)",
      "The other two angles (A and C) are different",
      "This is the rule Edexcel tests — spot the tick marks!",
    ],
  },
  {
    id: "rhombus", name: "Rhombus", icon: "◆",
    colour: C.red, colourDim: C.redDim,
    rule: "All sides equal. Opposite angles equal. Diagonals bisect at 90°.",
    examPhrase: "Opposite angles in a rhombus are equal",
    points: [[130,18],[215,95],[130,172],[45,95]],
    angleLabels: [
      { x: 130, y: 40,  text: "a°" }, { x: 196, y: 95,  text: "b°" },
      { x: 130, y: 154, text: "a°" }, { x: 64,  y: 95,  text: "b°" },
    ],
    vertexLabels: [
      { x: 130, y: 8,   text: "A" }, { x: 228, y: 95,  text: "B" },
      { x: 130, y: 186, text: "C" }, { x: 32,  y: 95,  text: "D" },
    ],
    facts: [
      "All four sides are equal length",
      "Opposite angles are equal (like a parallelogram)",
      "Diagonals cross at right angles (90°)",
      "A square is a special rhombus with all right angles",
    ],
  },
];

// ── Shape card ────────────────────────────────────────────────────────────
function ShapeCard({ shape, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: "80px", padding: "10px 6px", borderRadius: "12px",
      border: `2px solid ${selected ? shape.colour : shape.colour + "40"}`,
      background: selected ? shape.colour + "18" : "#fff",
      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
    }}>
      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{shape.icon}</div>
      <div style={{ fontSize: "11px", fontWeight: "700", color: shape.colour }}>{shape.name}</div>
    </button>
  );
}

// ── 360° explainer ────────────────────────────────────────────────────────
function SumExplainer() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
        💡 Why do quadrilateral angles add to 360°?
      </p>
      <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
        Draw a diagonal across any quadrilateral — it splits into <strong>two triangles</strong>.
        Each triangle's angles sum to 180°. Two triangles = 2 × 180° = <strong>360°</strong>.
      </p>
      <button onClick={() => setRevealed(r => !r)} style={{
        padding: "8px 16px", borderRadius: "8px", border: `1.5px solid ${C.accent}`,
        background: revealed ? C.accentDim : "#fff", color: C.accent,
        fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: revealed ? "12px" : 0,
      }}>
        {revealed ? "Hide working" : "Show me ▾"}
      </button>
      {revealed && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px",
            background: "#fff", borderRadius: "8px", padding: "8px",
            border: `1px solid ${C.border}` }}>
            <QuadDiagonalSVG />
          </div>
          <div style={{ background: C.accentDim, borderRadius: "8px", padding: "12px" }}>
            {[
              "Draw diagonal AC across quadrilateral ABCD.",
              "Triangle ABC: angles A₁ + B + C₁ = 180°",
              "Triangle ACD: angles A₂ + C₂ + D = 180°",
              "Total: (A₁+A₂) + B + (C₁+C₂) + D = 360°",
              "Which is: angle A + B + C + D = 360° ✓",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%",
                  background: C.accent, color: "#fff", fontSize: "10px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Worked example ────────────────────────────────────────────────────────
function WorkedExample() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
        Worked example — find angle x
      </p>
      <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
        A quadrilateral has angles 95°, 110°, 72° and x°. Find x.
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px",
        background: "#fff", borderRadius: "8px", padding: "8px",
        border: `1px solid ${C.border}` }}>
        <WorkedExampleSVG showAnswer={show} />
      </div>
      <button onClick={() => setShow(s => !s)} style={{
        padding: "8px 16px", borderRadius: "8px", border: `1.5px solid ${C.accent}`,
        background: show ? C.accentDim : "#fff", color: C.accent,
        fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: show ? "12px" : 0,
      }}>
        {show ? "Hide working" : "Show working ▾"}
      </button>
      {show && (
        <div>
          {[
            { step: "All angles in a quadrilateral add up to 360°", working: "95° + 110° + 72° + x° = 360°" },
            { step: "Add the known angles",                         working: "277° + x° = 360°"             },
            { step: "Solve for x",                                  working: "x = 360° − 277° = 83°"        },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: "8px", padding: "10px 12px", marginBottom: "6px" }}>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 2px" }}>{s.step}</p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: 0,
                fontFamily: "monospace" }}>{s.working}</p>
            </div>
          ))}
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}40`,
            borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.green, margin: 0 }}>✓ x = 83°</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Drill ─────────────────────────────────────────────────────────────────
const DRILL_Qs = [
  { known: [90, 90, 90],   answer: 90, shape: "rectangle"     },
  { known: [110, 85, 70],  answer: 95, shape: "quadrilateral" },
  { known: [120, 60, 120], answer: 60, shape: "parallelogram" },
  { known: [95, 105, 75],  answer: 85, shape: "quadrilateral" },
  { known: [130, 50, 130], answer: 50, shape: "kite"          },
];

function Drill() {
  const [idx,     setIdx]     = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q       = DRILL_Qs[idx];
  const isRight = parseInt(input, 10) === q.answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => {
    if (idx + 1 >= DRILL_Qs.length) setDone(true);
    else { setIdx(i => i + 1); setInput(""); setChecked(false); }
  };
  const handleRestart = () => { setIdx(0); setInput(""); setChecked(false); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / DRILL_Qs.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>{score}/{DRILL_Qs.length}</p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100 ? "Perfect — quadrilateral rules nailed!" : "Keep going — 360° every time!"}
        </p>
        <button onClick={handleRestart} style={{ padding: "12px 28px", borderRadius: "10px",
          border: "none", background: C.accent, color: "#fff", fontSize: "14px",
          fontWeight: "700", cursor: "pointer" }}>Try again</button>
      </div>
    );
  }

  const sum = q.known.reduce((a, b) => a + b, 0);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.muted,
          background: C.accentDim, padding: "3px 10px", borderRadius: "99px", textTransform: "capitalize" }}>
          {q.shape}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>{idx + 1}/{DRILL_Qs.length}</span>
      </div>
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 8px", lineHeight: 1.6 }}>
          A {q.shape} has angles{" "}
          {q.known.map((a, i) => <strong key={i}>{a}°{i < q.known.length - 1 ? ", " : ""}</strong>)}{" "}
          and <strong>x°</strong>. Find x.
        </p>
        <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
          Hint: {q.known.join(" + ")} + x = 360°
        </p>
      </div>
      {!checked && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input type="number" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            placeholder="Your answer"
            style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
              border: `1.5px solid ${C.border}`, fontSize: "16px",
              color: C.text, outline: "none", boxSizing: "border-box" }} />
          <button onClick={handleCheck} style={{ padding: "12px 20px", borderRadius: "10px",
            border: "none", background: C.accent, color: "#fff",
            fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check</button>
        </div>
      )}
      {checked && (
        <div>
          <div style={{ background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : `✗ The answer is ${q.answer}°`}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>
              {sum} + x = 360° → x = 360 − {sum} = {q.answer}°
            </p>
          </div>
          <button onClick={handleNext} style={{ width: "100%", padding: "13px",
            borderRadius: "10px", border: "none", background: C.accent,
            color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {idx + 1 >= DRILL_Qs.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
const TABS = [
  { id: "rule",   label: "The rule" },
  { id: "shapes", label: "Shapes"   },
  { id: "drill",  label: "🎯 Drill" },
];

export default function SectionQuadrilaterals({ nav }) {
  const [activeTab,   setActiveTab]   = useState("rule");
  const [activeShape, setActiveShape] = useState("kite");
  const shape = SHAPES.find(s => s.id === activeShape);

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Quadrilateral angle rules appear in almost every multi-step geometry question —
          often combined with triangles, parallel lines, or circle theorems. The kite
          in particular catches students out because its angle property is easy to miss.
        </p>
      </div>

      <SubTabBar tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === "rule" && (
        <div>
          <RuleCard colour={C.accent} colourDim={C.accentDim}
            icon="⬡" title="The rule"
            rule="Angles in any quadrilateral add up to 360°">
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
              It doesn't matter what kind of quadrilateral — square, rectangle, parallelogram,
              kite, rhombus, or any irregular shape. As long as it has <strong>4 sides</strong>,
              the four interior angles always sum to exactly 360°.
            </p>
          </RuleCard>
          <SumExplainer />
          <WorkedExample />
          <ExamTip>
            The reason to write is: <strong>"Angles in a quadrilateral add up to 360°"</strong>.
            Always write the full sentence. On Edexcel, writing "quad = 360" or "4 sides = 360"
            will not get the mark.
          </ExamTip>
        </div>
      )}

      {activeTab === "shapes" && (
        <div>
          <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 10px", lineHeight: 1.6 }}>
            Each quadrilateral has its own special angle properties on top of the 360° rule.
            Tap a shape to explore — the <strong>kite</strong> is the one Edexcel loves to test.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {SHAPES.map(s => (
              <ShapeCard key={s.id} shape={s}
                selected={activeShape === s.id}
                onClick={() => setActiveShape(s.id)} />
            ))}
          </div>
          {shape && (
            <div>
              <div style={{ background: shape.colour + "12",
                border: `1.5px solid ${shape.colour}40`,
                borderRadius: "12px", padding: "14px 16px 28px", marginBottom: "12px" }}>
                <p style={{ fontSize: "14px", fontWeight: "800", color: shape.colour,
                  margin: "0 0 4px" }}>{shape.icon} {shape.name}</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: C.text,
                  margin: "0 0 12px" }}>{shape.rule}</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <QuadSVG
                    points={shape.points}
                    colour={shape.colour}
                    colourDim={shape.colour + "20"}
                    labels={shape.vertexLabels}
                    angles={shape.angleLabels}
                  />
                </div>
                <ul style={{ paddingLeft: "18px", margin: 0 }}>
                  {shape.facts.map((f, i) => (
                    <li key={i} style={{ fontSize: "13px", color: C.text,
                      lineHeight: 1.7, marginBottom: "4px" }}>{f}</li>
                  ))}
                </ul>
              </div>
              <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
                borderRadius: "10px", padding: "10px 14px" }}>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
                  ⭐ <strong>Exam reason to write:</strong> "{shape.examPhrase}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "drill" && <Drill />}

      {nav}
    </div>
  );
}