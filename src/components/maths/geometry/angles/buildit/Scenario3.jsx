import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";
import ScenarioShell from "./ScenarioShell";

// ── Setup ──────────────────────────────────────────────────────────────────
// Classic Edexcel Higher multi-step:
// AB ∥ CD. Triangle PQR sits between the two parallel lines.
// P is on line AB, R is on line CD.
// Angle APQ = 58° (given, at P on line AB, between AP and PQ)
// Angle QRC = 72° (given, at R on line CD, between QR and RC)
// Find angle PQR (the apex angle of the triangle).
//
// Solution chain:
//   Step 1: angle PQA' — draw line QS through Q parallel to AB and CD
//           Alternate angle at Q with APQ: angle PQS = 58°
//           Reason: alternate angles are equal (QS ∥ AB, parallel lines)
//   Step 2: angle RQS — alternate angle at Q with QRC: angle RQS = 72°
//           Reason: alternate angles are equal (QS ∥ CD, parallel lines)
//   Step 3: angle PQR = PQS + RQS = 58 + 72 = 130°
//           Reason: angle PQR = angle PQS + angle RQS (angles on a straight line / addition)
//
// This requires drawing an auxiliary line — exactly what examiners reward full marks for.

const { stroke } = SVG_DEFAULTS;

function Diagram3({ highlightStep = 3 }) {
  const W = 280, H = 210;

  // Two horizontal parallel lines
  const yTop = 55,  yBot = 160;
  const xL   = 15,  xR   = 265;

  // P on top line, R on bottom line, Q apex in between
  const P = [85,  yTop];
  const R = [195, yBot];
  const Q = [148, 108];

  // Auxiliary line through Q, horizontal (parallel to AB and CD)
  const auxXL = 80, auxXR = 220;

  const toRad = d => d * Math.PI / 180;

  function Arc({ cx, cy, toP1, toP2, r = 24, colour, label }) {
    const a1 = Math.atan2(toP1[1] - cy, toP1[0] - cx);
    const a2 = Math.atan2(toP2[1] - cy, toP2[0] - cx);
    let sweep = a2 - a1;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    while (sweep >  Math.PI) sweep -= 2 * Math.PI;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a1 + sweep), y2 = cy + r * Math.sin(a1 + sweep);
    const midA = a1 + sweep / 2;
    const ld = r + 15;
    const lx = cx + ld * Math.cos(midA), ly = cy + ld * Math.sin(midA);
    return (
      <g>
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep > 0 ? 1 : 0} ${x2} ${y2}`}
          fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" />
        {label && <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fontWeight="700" fill={colour}>{label}</text>}
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: "inherit", overflow: "visible" }}>

      {/* Parallel line AB (top) */}
      <line x1={xL} y1={yTop} x2={xR} y2={yTop} stroke={C.accent} strokeWidth={stroke + 0.5} />
      {/* arrow markers on AB */}
      <polygon points={`${xR - 2},${yTop} ${xR - 10},${yTop - 4} ${xR - 10},${yTop + 4}`} fill={C.accent} />
      <polygon points={`${xL + 50},${yTop} ${xL + 42},${yTop - 4} ${xL + 42},${yTop + 4}`} fill={C.accent} />

      {/* Parallel line CD (bottom) */}
      <line x1={xL} y1={yBot} x2={xR} y2={yBot} stroke={C.accent} strokeWidth={stroke + 0.5} />
      {/* arrow markers on CD */}
      <polygon points={`${xR - 2},${yBot} ${xR - 10},${yBot - 4} ${xR - 10},${yBot + 4}`} fill={C.accent} />
      <polygon points={`${xL + 50},${yBot} ${xL + 42},${yBot - 4} ${xL + 42},${yBot + 4}`} fill={C.accent} />

      {/* Triangle sides PQ and QR */}
      <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke={C.text} strokeWidth={stroke + 0.5} />
      <line x1={Q[0]} y1={Q[1]} x2={R[0]} y2={R[1]} stroke={C.text} strokeWidth={stroke + 0.5} />

      {/* Auxiliary line through Q (drawn in step 1) */}
      {highlightStep >= 1 && (
        <line x1={auxXL} y1={Q[1]} x2={auxXR} y2={Q[1]}
          stroke={C.purple} strokeWidth={1.5} strokeDasharray="5 3" />
      )}

      {/* Given angle at P: angle APQ = 58° */}
      <Arc cx={P[0]} cy={P[1]}
        toP1={[P[0] - 40, P[1]]} toP2={Q}
        r={26} colour={C.amber} label="58°" />

      {/* Given angle at R: angle QRC = 72° */}
      <Arc cx={R[0]} cy={R[1]}
        toP1={Q} toP2={[R[0] + 40, R[1]]}
        r={26} colour={C.amber} label="72°" />

      {/* Step 1: alternate angle PQS at Q left = 58° */}
      {highlightStep >= 1 && (
        <Arc cx={Q[0]} cy={Q[1]}
          toP1={[Q[0] - 40, Q[1]]} toP2={P}
          r={22} colour={C.green} label="58°" />
      )}

      {/* Step 2: alternate angle RQS at Q right = 72° */}
      {highlightStep >= 2 && (
        <Arc cx={Q[0]} cy={Q[1]}
          toP1={R} toP2={[Q[0] + 40, Q[1]]}
          r={22} colour={C.green} label="72°" />
      )}

      {/* Step 3: angle PQR highlighted */}
      {highlightStep >= 3 && (
        <Arc cx={Q[0]} cy={Q[1]}
          toP1={P} toP2={R}
          r={30} colour={C.accent} label="?" />
      )}

      {/* Labels */}
      <text x={xL + 2}    y={yTop - 8} fontSize={12} fontWeight="700" fill={C.accent}>A</text>
      <text x={xR - 14}   y={yTop - 8} fontSize={12} fontWeight="700" fill={C.accent}>B</text>
      <text x={xL + 2}    y={yBot - 8} fontSize={12} fontWeight="700" fill={C.accent}>C</text>
      <text x={xR - 14}   y={yBot - 8} fontSize={12} fontWeight="700" fill={C.accent}>D</text>
      <text x={P[0] - 14} y={P[1] - 4} fontSize={13} fontWeight="700" fill={C.text}>P</text>
      <text x={Q[0] - 14} y={Q[1] - 8} fontSize={13} fontWeight="700" fill={C.text}>Q</text>
      <text x={R[0] + 6}  y={R[1] + 4} fontSize={13} fontWeight="700" fill={C.text}>R</text>
      {highlightStep >= 1 && (
        <text x={auxXR + 3} y={Q[1] + 4} fontSize={11} fontWeight="700" fill={C.purple}>S</text>
      )}
    </svg>
  );
}

const REASONS = [
  { id: "alt",   label: "Alternate angles are equal (parallel lines)" },
  { id: "corr",  label: "Corresponding angles are equal (parallel lines)" },
  { id: "coint", label: "Co-interior angles sum to 180° (parallel lines)" },
  { id: "str",   label: "Angles on a straight line sum to 180°" },
  { id: "tri",   label: "Angles in a triangle sum to 180°" },
  { id: "add",   label: "Angle PQR = angle PQS + angle SQR (angle addition)" },
];

function pick(...ids) {
  return ids.map(id => REASONS.find(r => r.id === id));
}

export default function Scenario3({ onComplete, onBack }) {
  const steps = [
    {
      instruction: "Draw a line QS through Q parallel to AB and CD. Find angle PQS using the alternate angle at P.",
      answerLabel:  "Angle PQS =",
      answerValue:  58,
      reasonOptions: pick("alt", "corr", "coint", "str"),
      reasonCorrect: "alt",
    },
    {
      instruction: "Find angle SQR using the alternate angle at R.",
      answerLabel:  "Angle SQR =",
      answerValue:  72,
      reasonOptions: pick("alt", "corr", "coint", "tri"),
      reasonCorrect: "alt",
    },
    {
      instruction: "Find angle PQR by combining the two angles at Q.",
      answerLabel:  "Angle PQR =",
      answerValue:  130,
      reasonOptions: pick("add", "str", "tri", "coint"),
      reasonCorrect: "add",
    },
  ];

  return (
    <ScenarioShell
      title="Triangle between two parallel lines"
      examNote="AB is parallel to CD. P is on AB, R is on CD, and Q is the apex between them. Angle APQ = 58°. Angle QRC = 72°. Find angle PQR. Give a reason for each step of your working."
      marks={4}
      difficulty="Higher"
      diagram={<Diagram3 highlightStep={3} />}
      steps={steps}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}