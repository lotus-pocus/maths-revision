import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";
import ScenarioShell from "./ScenarioShell";

const { W, H, stroke, font } = SVG_DEFAULTS;

// ── Diagram ───────────────────────────────────────────────────────────────
// Two parallel lines cut by a transversal. Given angle = 118°.
// Find: x (alternate), y (corresponding or co-interior)
//
//  Top parallel line: intersects transversal at T1
//  Bot parallel line: intersects transversal at T2
//  Given: angle above-right at T1 = 118°
//  Step 1: find angle below-left at T1 (vertically opposite) = 118°  [NOT needed]
//          actually: find x = angle below-right at T2 (co-interior) → 180−118 = 62°
//          Reason: co-interior angles sum to 180° (parallel lines)
//  Step 2: find y = angle above-right at T2 (corresponding to given) → 118°
//          Reason: corresponding angles are equal (parallel lines)

function Diagram1({ highlightStep }) {
  const W1 = 260, H1 = 200;
  const yTop = 65, yBot = 140;
  const xL = 20, xR = 240;
  // transversal: from (50, 20) to (210, 185)
  const tvX1 = 60,  tvY1 = 15;
  const tvX2 = 200, tvY2 = 190;

  // intersection points
  const t = (yTop - tvY1) / (tvY2 - tvY1);
  const ix1 = tvX1 + t * (tvX2 - tvX1); // ~109
  const s   = (yBot - tvY1) / (tvY2 - tvY1);
  const ix2 = tvX1 + s * (tvX2 - tvX1); // ~148

  const toRad = d => d * Math.PI / 180;
  const tvAngle = Math.atan2(tvY2 - tvY1, tvX2 - tvX1); // angle of transversal

  // Arc helper for a corner
  function Arc({ cx, cy, startDeg, endDeg, r = 22, colour, label, labelDist = 36 }) {
    const s1 = toRad(startDeg), e1 = toRad(endDeg);
    const x1 = cx + r * Math.cos(s1), y1 = cy + r * Math.sin(s1);
    const x2 = cx + r * Math.cos(e1), y2 = cy + r * Math.sin(e1);
    let sweep = endDeg - startDeg;
    while (sweep < 0) sweep += 360;
    while (sweep > 360) sweep -= 360;
    const large = sweep > 180 ? 1 : 0;
    const mid = toRad(startDeg + sweep / 2);
    const lx = cx + labelDist * Math.cos(mid);
    const ly = cy + labelDist * Math.sin(mid);
    return (
      <g>
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" />
        {label && <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fontWeight="700" fill={colour}>{label}</text>}
      </g>
    );
  }

  // transversal angle in degrees (measured from positive x axis)
  const tvDeg = tvAngle * 180 / Math.PI; // ~46°

  // At T1: given angle is top-right = between 0° (rightward) and tvDeg going upward
  // "above right" of T1 — between the right direction (0°) and the upward transversal (tvDeg - 180)
  // We'll just draw arcs for the labelled angles

  return (
    <svg viewBox={`0 0 ${W1} ${H1}`} width={W1} height={H1}
      style={{ fontFamily: "inherit", overflow: "visible" }}>

      {/* Parallel markers */}
      {[yTop, yBot].map((y, i) => (
        <g key={i}>
          <line x1={xL} y1={y} x2={xR} y2={y} stroke={C.accent} strokeWidth={stroke + 0.5} />
          {/* Arrow markers */}
          <polygon points={`${xR - 2},${y} ${xR - 10},${y - 4} ${xR - 10},${y + 4}`} fill={C.accent} />
          <polygon points={`${(xL + xR) / 2 + 2},${y} ${(xL + xR) / 2 - 6},${y - 4} ${(xL + xR) / 2 - 6},${y + 4}`} fill={C.accent} />
        </g>
      ))}

      {/* Transversal */}
      <line x1={tvX1} y1={tvY1} x2={tvX2} y2={tvY2}
        stroke={C.text} strokeWidth={stroke} />

      {/* Given angle arc at T1 — "118°" above right */}
      <Arc cx={ix1} cy={yTop}
        startDeg={tvDeg - 180} endDeg={0}
        r={24} colour={C.amber}
        label="118°" labelDist={40} />

      {/* Step 1 highlight — x angle at T2 below-left (co-interior with given) */}
      {highlightStep >= 1 && (
        <Arc cx={ix2} cy={yBot}
          startDeg={tvDeg - 180} endDeg={0}
          r={24} colour={C.green}
          label="x" labelDist={38} />
      )}

      {/* Step 2 highlight — y angle at T1 below-right (co-interior at T1 bottom) */}
      {highlightStep >= 2 && (
        <Arc cx={ix2} cy={yBot}
          startDeg={0} endDeg={tvDeg}
          r={24} colour={C.purple}
          label="y" labelDist={38} />
      )}

      {/* Labels for lines */}
      <text x={xL + 2} y={yTop - 8} fontSize={11} fill={C.accent} fontWeight="700">l₁</text>
      <text x={xL + 2} y={yBot - 8} fontSize={11} fill={C.accent} fontWeight="700">l₂</text>
      <text x={tvX2 + 4} y={tvY2} fontSize={11} fill={C.muted} fontWeight="600">t</text>

      {/* Intersection dots */}
      <circle cx={ix1} cy={yTop} r={3} fill={C.text} />
      <circle cx={ix2} cy={yBot} r={3} fill={C.text} />
    </svg>
  );
}

// ── Reason options pool ────────────────────────────────────────────────────
const REASONS = [
  { id: "alt",   label: "Alternate angles are equal (parallel lines)" },
  { id: "corr",  label: "Corresponding angles are equal (parallel lines)" },
  { id: "coint", label: "Co-interior angles sum to 180° (parallel lines)" },
  { id: "str",   label: "Angles on a straight line sum to 180°" },
  { id: "vert",  label: "Vertically opposite angles are equal" },
  { id: "tri",   label: "Angles in a triangle sum to 180°" },
];

function pick(...ids) {
  return ids.map(id => REASONS.find(r => r.id === id));
}

export default function Scenario1({ onComplete, onBack }) {
  const steps = [
    {
      instruction: "Find angle x",
      answerLabel:  "x =",
      answerValue:  62,
      reasonOptions: pick("coint", "alt", "corr", "str"),
      reasonCorrect: "coint",
    },
    {
      instruction: "Find angle y",
      answerLabel:  "y =",
      answerValue:  118,
      reasonOptions: pick("corr", "alt", "coint", "vert"),
      reasonCorrect: "corr",
    },
  ];

  return (
    <ScenarioShell
      title="Parallel lines cut by a transversal"
      examNote="Lines l₁ and l₂ are parallel. A transversal t crosses both. The angle marked 118° is given. Find x and y. Give a reason for each answer."
      marks={4}
      difficulty="Foundation & Higher"
      diagram={<Diagram1 highlightStep={2} />}
      steps={steps}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}