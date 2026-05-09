import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";

const { stroke, font } = SVG_DEFAULTS;


// ── Tick mark helper — drawn across a line to show equal sides ────────────
function TickMark({ x1, y1, x2, y2, count = 1, colour = C.muted, offset = 0 }) {
  // Midpoint of the line segment
  const mx = (x1 + x2) / 2 + offset * ((y2 - y1) / Math.hypot(x2 - x1, y2 - y1));
  const my = (y1 + y2) / 2 - offset * ((x2 - x1) / Math.hypot(x2 - x1, y2 - y1));

  // Perpendicular direction
  const dx   = x2 - x1;
  const dy   = y2 - y1;
  const len  = Math.hypot(dx, dy);
  const px   = (-dy / len) * 6;   // perpendicular unit × tick half-length
  const py   = ( dx / len) * 6;

  // Spacing for multiple ticks
  const along = { x: dx / len, y: dy / len };
  const gap   = 4;
  const offsets = count === 1
    ? [0]
    : count === 2
    ? [-gap / 2, gap / 2]
    : [-gap, 0, gap];

  return (
    <>
      {offsets.map((o, i) => (
        <line
          key={i}
          x1={mx + along.x * o - px}
          y1={my + along.y * o - py}
          x2={mx + along.x * o + px}
          y2={my + along.y * o + py}
          stroke={colour} strokeWidth={stroke} strokeLinecap="round"
        />
      ))}
    </>
  );
}

// ── Small arc at a vertex to mark a known angle ───────────────────────────
function VertexArc({ cx, cy, toA, toB, r = 20, colour = C.accent, label = null }) {
  // Angles of the two rays from vertex
  const angA = Math.atan2(-(toA[1] - cy), toA[0] - cx);
  const angB = Math.atan2(-(toB[1] - cy), toB[0] - cx);

  // Normalise so we sweep from smaller to larger angle
  let start = angA;
  let end   = angB;
  if (start > end) [start, end] = [end, start];

  // If the gap is > π we need the reflex sweep, so flip
  let sweep = end - start;
  if (sweep > Math.PI) {
    sweep = 2 * Math.PI - sweep;
    [start, end] = [end, start + 2 * Math.PI];
  }

  const sx = cx + r * Math.cos(start);
  const sy = cy - r * Math.sin(start);
  const ex = cx + r * Math.cos(end);
  const ey = cy - r * Math.sin(end);
  const large = sweep > Math.PI ? 1 : 0;

  // Label at midpoint of arc
  const midAng = start + sweep / 2;
  const lx     = cx + (r + 14) * Math.cos(midAng);
  const ly     = cy - (r + 14) * Math.sin(midAng);

  return (
    <>
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
        fill="none" stroke={colour} strokeWidth={1.5} strokeLinecap="round"
      />
      {label && (
        <text
          x={lx} y={ly}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={font - 1} fontWeight="700" fill={colour}
        >
          {label}
        </text>
      )}
    </>
  );
}

// ── Main triangle SVG ─────────────────────────────────────────────────────
// Props:
//   points      — [[x1,y1],[x2,y2],[x3,y3]] in SVG coords (optional, auto-layout if omitted)
//   labels      — { a, b, c } vertex labels (A at top, B bottom-left, C bottom-right by default)
//   angles      — { a, b, c } angle values to display at each vertex (null = no label)
//   equalSides  — array of pairs indicating equal sides: e.g. [["a","b"],["b","c"]]
//                 sides are named by the vertex OPPOSITE them: side "a" is BC, "b" is AC, "c" is AB
//   tickCounts  — { a, b, c } tick mark counts for each side (1 or 2)
//   colour      — accent colour for angle arcs and tick marks
//   colourDim   — fill for triangle interior
//   width       — SVG width
//   height      — SVG height
//   unknownAngle— label to show at one vertex instead of a number (e.g. "x")
//   unknownAt   — which vertex gets the unknown: "a" | "b" | "c"
export function TriangleSVG({
  labels       = { a: "A", b: "B", c: "C" },
  angles       = { a: null, b: null, c: null },
  tickCounts   = { a: 0, b: 0, c: 0 },
  colour       = C.accent,
  colourDim    = C.accentDim,
  width        = 240,
  height       = 180,
  unknownAngle = null,
  unknownAt    = null,
}) {
  // Default layout: A at top-centre, B at bottom-left, C at bottom-right
  const pad  = 28;
  const ptA  = [width / 2,       pad];
  const ptB  = [pad,             height - pad];
  const ptC  = [width - pad,     height - pad];

  // Side midpoints (for tick marks)
  // Side opposite A = BC, side opposite B = AC, side opposite C = AB
  const midBC = [(ptB[0] + ptC[0]) / 2, (ptB[1] + ptC[1]) / 2];
  const midAC = [(ptA[0] + ptC[0]) / 2, (ptA[1] + ptC[1]) / 2];
  const midAB = [(ptA[0] + ptB[0]) / 2, (ptA[1] + ptB[1]) / 2];

  // Vertex label offsets (push away from triangle interior)
  const labelPad = 14;
  const labelA   = [ptA[0],       ptA[1] - labelPad];
  const labelB   = [ptB[0] - labelPad, ptB[1] + labelPad];
  const labelC   = [ptC[0] + labelPad, ptC[1] + labelPad];

  // Displayed angle text per vertex
  const angTextA = unknownAt === "a" ? unknownAngle : (angles.a != null ? `${angles.a}°` : null);
  const angTextB = unknownAt === "b" ? unknownAngle : (angles.b != null ? `${angles.b}°` : null);
  const angTextC = unknownAt === "c" ? unknownAngle : (angles.c != null ? `${angles.c}°` : null);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}
    >
      {/* Filled interior */}
      <polygon
        points={`${ptA[0]},${ptA[1]} ${ptB[0]},${ptB[1]} ${ptC[0]},${ptC[1]}`}
        fill={colourDim} stroke="none"
      />

      {/* Sides */}
      <polygon
        points={`${ptA[0]},${ptA[1]} ${ptB[0]},${ptB[1]} ${ptC[0]},${ptC[1]}`}
        fill="none" stroke={C.text} strokeWidth={stroke} strokeLinejoin="round"
      />

      {/* Tick marks — side a (BC) */}
      {tickCounts.a > 0 && (
        <TickMark x1={ptB[0]} y1={ptB[1]} x2={ptC[0]} y2={ptC[1]}
          count={tickCounts.a} colour={colour} />
      )}
      {/* Tick marks — side b (AC) */}
      {tickCounts.b > 0 && (
        <TickMark x1={ptA[0]} y1={ptA[1]} x2={ptC[0]} y2={ptC[1]}
          count={tickCounts.b} colour={colour} />
      )}
      {/* Tick marks — side c (AB) */}
      {tickCounts.c > 0 && (
        <TickMark x1={ptA[0]} y1={ptA[1]} x2={ptB[0]} y2={ptB[1]}
          count={tickCounts.c} colour={colour} />
      )}

      {/* Angle arcs */}
      {angTextA && (
        <VertexArc cx={ptA[0]} cy={ptA[1]} toA={ptB} toB={ptC}
          r={22} colour={colour} label={angTextA} />
      )}
      {angTextB && (
        <VertexArc cx={ptB[0]} cy={ptB[1]} toA={ptA} toB={ptC}
          r={22} colour={unknownAt === "b" ? C.amber : colour} label={angTextB} />
      )}
      {angTextC && (
        <VertexArc cx={ptC[0]} cy={ptC[1]} toA={ptA} toB={ptB}
          r={22} colour={unknownAt === "c" ? C.amber : colour} label={angTextC} />
      )}

      {/* Vertex labels */}
      <text x={labelA[0]} y={labelA[1]} textAnchor="middle"
        fontSize={font} fontWeight="700" fill={C.text}>{labels.a}</text>
      <text x={labelB[0]} y={labelB[1]} textAnchor="middle"
        fontSize={font} fontWeight="700" fill={C.text}>{labels.b}</text>
      <text x={labelC[0]} y={labelC[1]} textAnchor="middle"
        fontSize={font} fontWeight="700" fill={C.text}>{labels.c}</text>
    </svg>
  );
}

// ── Isosceles triangle (convenience wrapper) ──────────────────────────────
// AB = AC equal sides, tick marks on both, base angles equal
export function IsoscelesSVG({
  apexAngle    = 40,
  colour       = C.accent,
  colourDim    = C.accentDim,
  unknownAngle = "x",
  unknownAt    = "b",
  width        = 240,
  height       = 180,
}) {
  const baseAngle = (180 - apexAngle) / 2;
  return (
    <TriangleSVG
      labels={{ a: "A", b: "B", c: "C" }}
      angles={{
        a: apexAngle,
        b: unknownAt === "b" ? null : baseAngle,
        c: unknownAt === "c" ? null : baseAngle,
      }}
      tickCounts={{ a: 0, b: 1, c: 1 }}   // tick marks on AB and AC (the equal sides)
      colour={colour}
      colourDim={colourDim}
      unknownAngle={unknownAngle}
      unknownAt={unknownAt}
      width={width}
      height={height}
    />
  );
}

// ── Equilateral triangle (convenience wrapper) ────────────────────────────
export function EquilateralSVG({
  colour    = C.green,
  colourDim = C.greenDim,
  width     = 200,
  height    = 180,
}) {
  return (
    <TriangleSVG
      labels={{ a: "A", b: "B", c: "C" }}
      angles={{ a: 60, b: 60, c: 60 }}
      tickCounts={{ a: 1, b: 1, c: 1 }}
      colour={colour}
      colourDim={colourDim}
      width={width}
      height={height}
    />
  );
}