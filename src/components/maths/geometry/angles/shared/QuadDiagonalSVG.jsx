import { C } from "../../../../../data/angles_data";

// ── QuadDiagonalSVG ───────────────────────────────────────────────────────
export function QuadDiagonalSVG({ W = 260, H = 200 }) {
  const A  = { x: 30,  y: 148 };
  const B  = { x: 60,  y: 38  };
  const Cp = { x: 210, y: 53  };
  const D  = { x: 230, y: 146 };

  const pts  = [A, B, Cp, D].map(p => `${p.x},${p.y}`).join(" ");
  const tri1 = `${A.x},${A.y} ${B.x},${B.y} ${Cp.x},${Cp.y}`;
  const tri2 = `${A.x},${A.y} ${Cp.x},${Cp.y} ${D.x},${D.y}`;
  const lpad = 14;

  const legY = H - 18;
  const t1 = `${W/2 - 70},${legY + 8} ${W/2 - 62},${legY - 4} ${W/2 - 54},${legY + 8}`;
  const t2 = `${W/2 + 10},${legY + 8} ${W/2 + 18},${legY - 4} ${W/2 + 26},${legY + 8}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block" }}>
      <polygon points={tri1} fill={C.amberDim}  stroke="none" />
      <polygon points={tri2} fill={C.accentDim} stroke="none" />
      <polygon points={pts}  fill="none" stroke={C.text} strokeWidth={2} strokeLinejoin="round" />
      <line x1={A.x} y1={A.y} x2={Cp.x} y2={Cp.y}
        stroke={C.text} strokeWidth={1.5} strokeDasharray="6,4" strokeLinecap="round" />

      {/* Triangle 1 angle labels (amber) */}
      <text x={A.x + 22}  y={A.y - 16}   textAnchor="middle" fontSize={10} fontWeight="700" fill={C.amber}>A₁</text>
      <text x={B.x + 18}  y={B.y + 18}   textAnchor="middle" fontSize={10} fontWeight="700" fill={C.amber}>B</text>
      <text x={Cp.x - 22} y={Cp.y + 20}  textAnchor="middle" fontSize={10} fontWeight="700" fill={C.amber}>C₁</text>

      {/* Triangle 2 angle labels (blue) */}
      <text x={A.x + 22}  y={A.y + 14}   textAnchor="middle" fontSize={10} fontWeight="700" fill={C.accent}>A₂</text>
      <text x={Cp.x - 22} y={Cp.y + 6}   textAnchor="middle" fontSize={10} fontWeight="700" fill={C.accent}>C₂</text>
      <text x={D.x - 20}  y={D.y - 6}    textAnchor="middle" fontSize={10} fontWeight="700" fill={C.accent}>D</text>

      {/* Vertex labels */}
      <text x={A.x - lpad}  y={A.y + 4}       textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 6}     y={B.y - lpad + 4} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={Cp.x + lpad} y={Cp.y - 4}       textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
      <text x={D.x + lpad}  y={D.y + 4}        textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>

      {/* Legend at bottom with triangle shapes */}
      <polygon points={t1} fill={C.amberDim}  stroke={C.amber}  strokeWidth={1} />
      <text x={W/2 - 48} y={legY + 5} fontSize={9} fontWeight="600" fill={C.amber}>Triangle ABC</text>
      <polygon points={t2} fill={C.accentDim} stroke={C.accent} strokeWidth={1} />
      <text x={W/2 + 32} y={legY + 5} fontSize={9} fontWeight="600" fill={C.accent}>Triangle ACD</text>
    </svg>
  );
}

// ── WorkedExampleSVG ──────────────────────────────────────────────────────
export function WorkedExampleSVG({ showAnswer = false, W = 260, H = 180 }) {
  const A = { x: 30,  y: 148 };
  const B = { x: 55,  y: 38  };
  const Cv = { x: 210, y: 45  };
  const D = { x: 228, y: 148 };

  const pts  = [A, B, Cv, D].map(p => `${p.x},${p.y}`).join(" ");
  const lpad = 14;

  const angles = [
    { vx: A.x,  vy: A.y,  label: "95°",                     col: C.accent, ox: 22,  oy: -12 },
    { vx: B.x,  vy: B.y,  label: "110°",                    col: C.amber,  ox: 18,  oy:  16 },
    { vx: Cv.x, vy: Cv.y, label: "72°",                     col: C.green,  ox: -20, oy:  16 },
    { vx: D.x,  vy: D.y,  label: showAnswer ? "83°" : "x°", col: showAnswer ? C.purple : C.muted, ox: -22, oy: -12 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block" }}>
      <polygon points={pts} fill={C.accentDim} stroke="none" />
      <polygon points={pts} fill="none" stroke={C.text} strokeWidth={2} strokeLinejoin="round" />

      {angles.map(({ vx, vy, label, col, ox, oy }, i) => (
        <text key={i} x={vx + ox} y={vy + oy}
          textAnchor="middle" fontSize={11} fontWeight="700" fill={col}>
          {label}
        </text>
      ))}

      <text x={A.x - lpad}  y={A.y + 4}        textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>A</text>
      <text x={B.x - 6}     y={B.y - lpad + 4}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>B</text>
      <text x={Cv.x + lpad} y={Cv.y - 4}        textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>C</text>
      <text x={D.x + lpad}  y={D.y + 4}         textAnchor="middle" fontSize={12} fontWeight="800" fill={C.text}>D</text>
    </svg>
  );
}