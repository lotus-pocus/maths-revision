import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";
import ScenarioShell from "./ScenarioShell";

// ── Setup ──────────────────────────────────────────────────────────────────
// ABC is an isosceles triangle with AB = AC, sitting on straight line BCD.
// Angle ABC = 64°. Find:
//   Step 1: angle ACB (isosceles → base angles equal) = 64°
//   Step 2: angle BAC (angles in triangle) = 180 − 64 − 64 = 52°
//   Step 3: angle ACD (angles on straight line at C) = 180 − 64 = 116°
//
// This is a classic 3-mark Edexcel Foundation question pattern.

const { stroke } = SVG_DEFAULTS;

function Diagram2({ highlightStep = 3 }) {
  const W = 280, H = 200;

  // Points
  // B bottom-left, D bottom-right, C bottom-middle, A apex
  const B  = [30,  168];
  const D  = [250, 168];
  const C1 = [165, 168]; // C on line BD
  const A  = [105, 55];  // apex — equidistant from B and C1

  const toRad = d => d * Math.PI / 180;

  function Arc({ cx, cy, toP1, toP2, r = 22, colour, label, flip = false }) {
    const a1 = Math.atan2(toP1[1] - cy, toP1[0] - cx);
    const a2 = Math.atan2(toP2[1] - cy, toP2[0] - cx);
    let start = a1, end = a2;
    // ensure we sweep the interior angle (smaller sweep)
    let sweep = end - start;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    while (sweep >  Math.PI) sweep -= 2 * Math.PI;
    const large = 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(start + sweep), y2 = cy + r * Math.sin(start + sweep);
    const midA = start + sweep / 2;
    const ld = r + 16;
    const lx = cx + ld * Math.cos(midA);
    const ly = cy + ld * Math.sin(midA);
    return (
      <g>
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep > 0 ? 1 : 0} ${x2} ${y2}`}
          fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" />
        {label && <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fontWeight="700" fill={colour}>{label}</text>}
      </g>
    );
  }

  // Tick marks for equal sides AB = AC
  function TickMark({ p1, p2, colour = C.accent }) {
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);
    const px = -dy / len * 7, py = dx / len * 7;
    return <line x1={mx - px} y1={my - py} x2={mx + px} y2={my + py}
      stroke={colour} strokeWidth={2.5} strokeLinecap="round" />;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: "inherit", overflow: "visible" }}>

      {/* Straight line BCD */}
      <line x1={B[0] - 10} y1={B[1]} x2={D[0] + 10} y2={D[1]}
        stroke={C.accent} strokeWidth={stroke + 0.5} />

      {/* Triangle sides */}
      <line x1={B[0]} y1={B[1]} x2={A[0]} y2={A[1]} stroke={C.text} strokeWidth={stroke + 0.5} />
      <line x1={A[0]} y1={A[1]} x2={C1[0]} y2={C1[1]} stroke={C.text} strokeWidth={stroke + 0.5} />

      {/* Equal side ticks */}
      <TickMark p1={B} p2={A} />
      <TickMark p1={A} p2={C1} />

      {/* Angle arcs */}
      {/* Given: angle ABC = 64° */}
      <Arc cx={B[0]} cy={B[1]} toP1={[B[0] + 40, B[1]]} toP2={A}
        r={26} colour={C.amber} label="64°" />

      {/* Step 1: angle ACB (base angle = 64°) */}
      {highlightStep >= 1 && (
        <Arc cx={C1[0]} cy={C1[1]} toP1={A} toP2={[C1[0] - 40, C1[1]]}
          r={26} colour={C.green} label="x" />
      )}

      {/* Step 2: angle BAC at apex */}
      {highlightStep >= 2 && (
        <Arc cx={A[0]} cy={A[1]} toP1={B} toP2={C1}
          r={22} colour={C.purple} label="y" />
      )}

      {/* Step 3: angle ACD (outside triangle on straight line) */}
      {highlightStep >= 3 && (
        <Arc cx={C1[0]} cy={C1[1]} toP1={A} toP2={[C1[0] + 50, C1[1]]}
          r={30} colour="#d97706" label="z" />
      )}

      {/* Vertex labels */}
      <text x={B[0] - 14} y={B[1] + 4} fontSize={13} fontWeight="700" fill={C.text}>B</text>
      <text x={A[0] - 6}  y={A[1] - 10} fontSize={13} fontWeight="700" fill={C.text}>A</text>
      <text x={C1[0] + 4} y={C1[1] + 14} fontSize={13} fontWeight="700" fill={C.text}>C</text>
      <text x={D[0] + 4}  y={D[1] + 4}  fontSize={13} fontWeight="700" fill={C.text}>D</text>
    </svg>
  );
}

const REASONS = [
  { id: "iso",   label: "Base angles of an isosceles triangle are equal" },
  { id: "tri",   label: "Angles in a triangle sum to 180°" },
  { id: "str",   label: "Angles on a straight line sum to 180°" },
  { id: "coint", label: "Co-interior angles sum to 180° (parallel lines)" },
  { id: "vert",  label: "Vertically opposite angles are equal" },
  { id: "quad",  label: "Angles in a quadrilateral sum to 360°" },
];

function pick(...ids) {
  return ids.map(id => REASONS.find(r => r.id === id));
}

export default function Scenario2({ onComplete, onBack }) {
  const steps = [
    {
      instruction: "Find angle ACB (marked x)",
      answerLabel:  "Angle ACB =",
      answerValue:  64,
      reasonOptions: pick("iso", "tri", "str", "vert"),
      reasonCorrect: "iso",
    },
    {
      instruction: "Find angle BAC at the apex (marked y)",
      answerLabel:  "Angle BAC =",
      answerValue:  52,
      reasonOptions: pick("tri", "iso", "str", "quad"),
      reasonCorrect: "tri",
    },
    {
      instruction: "Find angle ACD (marked z) — the angle outside the triangle",
      answerLabel:  "Angle ACD =",
      answerValue:  116,
      reasonOptions: pick("str", "tri", "iso", "coint"),
      reasonCorrect: "str",
    },
  ];

  return (
    <ScenarioShell
      title="Isosceles triangle on a straight line"
      examNote="ABC is an isosceles triangle with AB = AC. BCD is a straight line. Angle ABC = 64°. Find angles x, y and z. Give a reason for each step."
      marks={3}
      difficulty="Foundation"
      diagram={<Diagram2 highlightStep={3} />}
      steps={steps}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}