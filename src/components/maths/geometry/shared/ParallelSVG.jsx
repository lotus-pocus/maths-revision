import { C, SVG_DEFAULTS } from "../../../../data/angles_data";

const { stroke, font } = SVG_DEFAULTS;
const toRad = (deg) => (deg * Math.PI) / 180;

// ── Arrow head helper — shows parallel line direction ─────────────────────
function ArrowHead({ x, y, angle, colour = C.muted }) {
  const size = 8;
  const rad  = toRad(angle);
  const tip  = [x, y];
  const l    = [
    x - size * Math.cos(rad) + (size / 2) * Math.sin(rad),
    y - size * Math.sin(rad) - (size / 2) * Math.cos(rad),
  ];
  const r    = [
    x - size * Math.cos(rad) - (size / 2) * Math.sin(rad),
    y - size * Math.sin(rad) + (size / 2) * Math.cos(rad),
  ];
  return (
    <polygon
      points={`${tip[0]},${tip[1]} ${l[0]},${l[1]} ${r[0]},${r[1]}`}
      fill={colour} stroke="none"
    />
  );
}

// ── Angle arc at intersection point ───────────────────────────────────────
function IntersectionArc({ cx, cy, fromDeg, toDeg, r = 18, colour, fill, label }) {
  const startRad = toRad(fromDeg);
  const endRad   = toRad(toDeg);

  const sx = cx + r * Math.cos(startRad);
  const sy = cy - r * Math.sin(startRad);
  const ex = cx + r * Math.cos(endRad);
  const ey = cy - r * Math.sin(endRad);

  // Determine sweep
  let diff = toDeg - fromDeg;
  while (diff < 0)   diff += 360;
  while (diff > 360) diff -= 360;
  const large = diff > 180 ? 1 : 0;

  // Label midpoint
  const midRad = toRad(fromDeg + diff / 2);
  const lx     = cx + (r + 14) * Math.cos(midRad);
  const ly     = cy - (r + 14) * Math.sin(midRad);

  return (
    <>
      {/* Filled sector */}
      <path
        d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`}
        fill={fill} stroke="none"
      />
      {/* Arc outline */}
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
        fill="none" stroke={colour} strokeWidth={1.5} strokeLinecap="round"
      />
      {/* Label */}
      {label && (
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize={font - 1} fontWeight="700" fill={colour}>
          {label}
        </text>
      )}
    </>
  );
}

// ── Core parallel lines diagram ───────────────────────────────────────────
// Two horizontal parallel lines crossed by a transversal
// highlightRule: "alternate" | "cointerior" | "corresponding" | null
// transversalAngle: angle of transversal from horizontal (degrees, 0–89)
// showArrows: show parallel line direction arrows
// topAngle / bottomAngle: values to display at intersections
function ParallelCore({
  width            = 280,
  height           = 200,
  transversalAngle = 55,
  highlightRule    = null,
  topValue         = null,
  bottomValue      = null,
  unknownLabel     = "x",
  topColour        = C.accent,
  bottomColour     = C.amber,
}) {
  // Parallel lines sit at 1/3 and 2/3 of height
  const yTop = height * 0.33;
  const yBot = height * 0.67;
  const padX = 20;

  // Transversal angle from horizontal (in SVG, y increases downward)
  // We fix transversal to cross at x = 40% and 60% of width
  const t   = toRad(transversalAngle);
  const run = height * 0.5;   // vertical run between parallel lines

  // Top intersection
  const ix1 = width * 0.42;
  const iy1 = yTop;

  // Bottom intersection — shift x based on transversal slope
  const ix2 = ix1 + run / Math.tan(t);
  const iy2 = yBot;

  // Transversal extension beyond intersections
  const ext = 40;
  const tEnd1 = [ix1 - ext * Math.cos(toRad(180 - transversalAngle)),
                 iy1 - ext * Math.sin(toRad(transversalAngle))];
  const tEnd2 = [ix2 + ext * Math.cos(toRad(180 - transversalAngle)),
                 iy2 + ext * Math.sin(toRad(transversalAngle))];

  // ── Angle regions at each intersection ────────────────────────────────
  // At each intersection, four regions are formed.
  // We name them by their position: NW, NE, SW, SE (in screen coords, y down)
  // The transversal comes from top-left to bottom-right (angle < 90)
  //
  // Top intersection angles (measured from positive x-axis, anticlockwise in maths):
  //   NE region: 0° to transversalAngle
  //   NW region: transversalAngle to 180°
  //   SW region: 180° to (180 + transversalAngle)
  //   SE region: (180 + transversalAngle) to 360°
  //
  // In SVG (y flipped):
  const tvA = transversalAngle; // e.g. 55

  const TOP = {
    NE: { from: 0,           to: tvA,           label: topValue ? `${topValue}°` : null   },
    NW: { from: tvA,         to: 180,           label: null                                },
    SW: { from: 180,         to: 180 + tvA,     label: null                                },
    SE: { from: 180 + tvA,   to: 360,           label: null                                },
  };

  const BOT = {
    NE: { from: 0,           to: tvA,           label: null                                },
    NW: { from: tvA,         to: 180,           label: null                                },
    SW: { from: 180,         to: 180 + tvA,     label: bottomValue ? `${bottomValue}°` : null },
    SE: { from: 180 + tvA,   to: 360,           label: unknownLabel                        },
  };

  // ── Which regions to highlight based on the rule ───────────────────────
  let topHL   = null;  // { from, to, colour, fill, label }
  let botHL   = null;

  if (highlightRule === "alternate") {
    // Top NE + Bottom SW  (equal, same side = Z shape)
    topHL = { ...TOP.NE, colour: topColour,    fill: topColour + "30"    };
    botHL = { ...BOT.SW, colour: topColour,    fill: topColour + "30"    };
  } else if (highlightRule === "cointerior") {
    // Top SE + Bottom NE  (same side, add to 180 = C shape)
    topHL = { ...TOP.SE, colour: topColour,    fill: topColour + "30",    label: topValue   ? `${topValue}°`   : null };
    botHL = { ...BOT.NE, colour: bottomColour, fill: bottomColour + "30", label: bottomValue ? `${bottomValue}°` : unknownLabel };
  } else if (highlightRule === "corresponding") {
    // Top NE + Bottom NE  (same position at each intersection = F shape)
    topHL = { ...TOP.NE, colour: topColour,    fill: topColour + "30"    };
    botHL = { ...BOT.NE, colour: topColour,    fill: topColour + "30"    };
  }

  const r = 20; // arc radius

  return (
    <svg viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}>

      {/* Parallel lines */}
      <line x1={padX} y1={yTop} x2={width - padX} y2={yTop}
        stroke={C.muted} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={padX} y1={yBot} x2={width - padX} y2={yBot}
        stroke={C.muted} strokeWidth={stroke} strokeLinecap="round" />

      {/* Direction arrows */}
      <ArrowHead x={width * 0.7} y={yTop} angle={0} colour={C.muted} />
      <ArrowHead x={width * 0.7} y={yBot} angle={0} colour={C.muted} />

      {/* Transversal */}
      <line x1={tEnd1[0]} y1={tEnd1[1]} x2={tEnd2[0]} y2={tEnd2[1]}
        stroke={C.text} strokeWidth={stroke} strokeLinecap="round" />

      {/* Highlighted angle arcs */}
      {topHL && (
        <IntersectionArc
          cx={ix1} cy={iy1}
          fromDeg={topHL.from} toDeg={topHL.to}
          r={r}
          colour={topHL.colour} fill={topHL.fill}
          label={topHL.label}
        />
      )}
      {botHL && (
        <IntersectionArc
          cx={ix2} cy={iy2}
          fromDeg={botHL.from} toDeg={botHL.to}
          r={r}
          colour={botHL.colour} fill={botHL.fill}
          label={botHL.label}
        />
      )}

      {/* Intersection dots */}
      <circle cx={ix1} cy={iy1} r={3} fill={C.text} />
      <circle cx={ix2} cy={iy2} r={3} fill={C.text} />

    </svg>
  );
}

// ── Public exports — one component per rule ───────────────────────────────

// Alternate angles diagram (Z-shape)
export function AlternateSVG({
  topValue    = 65,
  width       = 280,
  height      = 200,
  showAnswer  = true,
}) {
  return (
    <ParallelCore
      width={width} height={height}
      transversalAngle={55}
      highlightRule="alternate"
      topValue={topValue}
      bottomValue={showAnswer ? topValue : null}
      unknownLabel={showAnswer ? `${topValue}°` : "x"}
      topColour={C.accent}
    />
  );
}

// Co-interior angles diagram (C-shape, add to 180°)
export function CoInteriorSVG({
  topValue   = 65,
  width      = 280,
  height     = 200,
  showAnswer = true,
}) {
  const bottom = 180 - topValue;
  return (
    <ParallelCore
      width={width} height={height}
      transversalAngle={55}
      highlightRule="cointerior"
      topValue={topValue}
      bottomValue={showAnswer ? bottom : null}
      unknownLabel={showAnswer ? `${bottom}°` : "x"}
      topColour={C.amber}
      bottomColour={C.accent}
    />
  );
}

// Corresponding angles diagram (F-shape)
export function CorrespondingSVG({
  topValue   = 65,
  width      = 280,
  height     = 200,
  showAnswer = true,
}) {
  return (
    <ParallelCore
      width={width} height={height}
      transversalAngle={55}
      highlightRule="corresponding"
      topValue={topValue}
      bottomValue={showAnswer ? topValue : null}
      unknownLabel={showAnswer ? `${topValue}°` : "x"}
      topColour={C.green}
    />
  );
}

// Unlabelled parallel lines — for Build It drag stage
export function BlankParallelSVG({
  width  = 280,
  height = 200,
  rule   = "alternate",
}) {
  return (
    <ParallelCore
      width={width} height={height}
      transversalAngle={55}
      highlightRule={rule}
      topValue={65}
      bottomValue={null}
      unknownLabel="?"
      topColour={C.accent}
      bottomColour={C.amber}
    />
  );
}