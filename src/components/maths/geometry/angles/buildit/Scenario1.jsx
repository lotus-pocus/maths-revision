import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";
import ScenarioShell from "./ScenarioShell";

const { W, H, stroke, font } = SVG_DEFAULTS;

// ── Diagram ───────────────────────────────────────────────────────────────
// Two parallel lines cut by a transversal. Given angle = 118°.
// Find: x = co-interior angle at T2 (180 − 118 = 62°)
//       y = corresponding angle at T2 above-right (= 118°)

function Diagram1({ highlightStep }) {
  const W1 = 260, H1 = 200;
  const yTop = 65, yBot = 140;
  const xL = 20, xR = 240;
  const tvX1 = 60, tvY1 = 15;
  const tvX2 = 200, tvY2 = 190;

  const t = (yTop - tvY1) / (tvY2 - tvY1);
  const ix1 = tvX1 + t * (tvX2 - tvX1);
  const s   = (yBot - tvY1) / (tvY2 - tvY1);
  const ix2 = tvX1 + s * (tvX2 - tvX1);

  const toRad = d => d * Math.PI / 180;
  const tvAngle = Math.atan2(tvY2 - tvY1, tvX2 - tvX1);
  const tvDeg = tvAngle * 180 / Math.PI;

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

  return (
    <svg viewBox={`0 0 ${W1} ${H1}`} width={W1} height={H1}
      style={{ fontFamily: "inherit", overflow: "visible" }}>

      {[yTop, yBot].map((y, i) => (
        <g key={i}>
          <line x1={xL} y1={y} x2={xR} y2={y} stroke={C.accent} strokeWidth={stroke + 0.5} />
          <polygon points={`${xR - 2},${y} ${xR - 10},${y - 4} ${xR - 10},${y + 4}`} fill={C.accent} />
          <polygon points={`${(xL + xR) / 2 + 2},${y} ${(xL + xR) / 2 - 6},${y - 4} ${(xL + xR) / 2 - 6},${y + 4}`} fill={C.accent} />
        </g>
      ))}

      <line x1={tvX1} y1={tvY1} x2={tvX2} y2={tvY2} stroke={C.text} strokeWidth={stroke} />

      {/* Given angle arc at T1 — 118° */}
      <Arc cx={ix1} cy={yTop}
        startDeg={tvDeg - 180} endDeg={0}
        r={24} colour={C.amber} label="118°" labelDist={40} />

      {/* x angle at T2 — above-right, same position as 118° at T1 (corresponding) */}
      <Arc cx={ix2} cy={yBot}
        startDeg={tvDeg - 180} endDeg={0}
        r={24}
        colour={highlightStep >= 1 ? C.green : "#d1d5db"}
        label="x"
        labelDist={38} />

      {/* y angle at T2 — below-left of T2, between the parallel lines (co-interior) */}
      <Arc cx={ix2} cy={yBot}
        startDeg={180} endDeg={tvDeg + 180}
        r={24}
        colour={highlightStep >= 2 ? C.purple : "#d1d5db"}
        label="y"
        labelDist={38} />

      <text x={xL + 2} y={yTop - 8} fontSize={11} fill={C.accent} fontWeight="700">l₁</text>
      <text x={xL + 2} y={yBot - 8} fontSize={11} fill={C.accent} fontWeight="700">l₂</text>
      <text x={tvX2 + 4} y={tvY2} fontSize={11} fill={C.muted} fontWeight="600">t</text>
      <circle cx={ix1} cy={yTop} r={3} fill={C.text} />
      <circle cx={ix2} cy={yBot} r={3} fill={C.text} />
    </svg>
  );
}

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
      answerValue:  118,
      hint: "x is in the same position as the 118° angle — above-right of the intersection — but at the lower parallel line l₂. When a transversal crosses parallel lines, angles in matching positions are called corresponding angles, and they are always equal.",
      working: "Corresponding angles are equal (parallel lines): x = 118°",
      showCalc: false,
      reasonOptions: pick("corr", "alt", "coint", "vert"),
      reasonCorrect: "corr",
    },
    {
      instruction: "Find angle y",
      answerLabel:  "y =",
      answerValue:  62,
      hint: "y and the 118° angle sit on the same side of the transversal, between the two parallel lines — these are co-interior angles (also called allied angles). Co-interior angles always add up to 180°. So y = 180 − 118.",
      working: "Co-interior angles sum to 180° (parallel lines): y = 180 − 118 = 62°",
      showCalc: true,
      reasonOptions: pick("coint", "alt", "corr", "str"),
      reasonCorrect: "coint",
    },
  ];

  return (
    <ScenarioShell
      title="Parallel lines cut by a transversal"
      examNote="Lines l₁ and l₂ are parallel. A transversal t crosses both. The angle marked 118° is given. Find x and y, giving a reason for each answer."
      marks={4}
      difficulty="Foundation & Higher"
      diagram={(activeStep) => <Diagram1 highlightStep={activeStep} />}
      steps={steps}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}