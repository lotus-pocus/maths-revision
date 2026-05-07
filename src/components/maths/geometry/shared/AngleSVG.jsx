import { C, SVG_DEFAULTS } from "../../../../data/angles_data";

const { W, H, stroke, font } = SVG_DEFAULTS;

// ── Maths helpers ─────────────────────────────────────────────────────────
const toRad = (deg) => (deg * Math.PI) / 180;

// Returns the SVG arc path for an angle drawn from the positive x-axis
// cx,cy  = vertex position
// r      = arc radius
// deg    = angle in degrees (measured anticlockwise from positive x-axis)
function arcPath(cx, cy, r, deg) {
  // Always draw from 0° (right) sweeping anticlockwise to deg
  const startX = cx + r;
  const startY = cy;
  const endX   = cx + r * Math.cos(toRad(deg));
  const endY   = cy - r * Math.sin(toRad(deg));
  const large  = deg > 180 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${large} 0 ${endX} ${endY}`;
}

// Returns [x, y] for the tip of a ray from cx,cy at angle deg, length len
function rayEnd(cx, cy, deg, len) {
  return [
    cx + len * Math.cos(toRad(deg)),
    cy - len * Math.sin(toRad(deg)),
  ];
}

// ── Single angle diagram ──────────────────────────────────────────────────
// Props:
//   degrees   — the angle to draw (1–359)
//   colour    — stroke/fill colour for the arc and label
//   colourDim — fill for the arc sweep background
//   label     — text label (e.g. "45°" or "x")
//   showRight — if true, draw a square corner marker instead of arc (for 90°)
//   width     — optional override for SVG width
//   height    — optional override for SVG height
export function AngleSVG({
  degrees   = 60,
  colour    = C.accent,
  colourDim = C.accentDim,
  label     = null,
  showRight = false,
  width     = W,
  height    = H,
}) {
  const cx  = width  * 0.35;   // vertex sits left of centre
  const cy  = height * 0.68;   // vertex sits in lower portion
  const len = Math.min(width, height) * 0.45;  // ray length
  const r   = Math.min(width, height) * 0.18;  // arc radius

  // Base ray always goes right (0°)
  const [bx, by] = rayEnd(cx, cy, 0, len);
  // Second ray at the given angle
  const [rx, ry] = rayEnd(cx, cy, degrees, len);

  // Label position — midpoint of the angle arc, pushed out slightly
  const midDeg  = degrees / 2;
  const labelR  = r + 18;
  const labelX  = cx + labelR * Math.cos(toRad(midDeg));
  const labelY  = cy - labelR * Math.sin(toRad(midDeg));

  // Reflex: draw the minor arc first as a filled sector, then the reflex arc
  const isReflex = degrees > 180;

  // Arc sweep fill — pie-slice from base ray to second ray
  const sweepD = isReflex
    ? `M ${cx} ${cy} L ${bx} ${by} A ${r} ${r} 0 1 0 ${rx} ${ry} Z`
    : `M ${cx} ${cy} L ${bx} ${by} A ${r} ${r} 0 0 0 ${rx} ${ry} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}
      aria-label={`${degrees} degree angle diagram`}
    >
      {/* Filled arc sector */}
      <path d={sweepD} fill={colourDim} stroke="none" />

      {/* Arc outline */}
      {showRight && degrees === 90 ? (
        // Right-angle square marker
        <path
          d={`M ${cx + r} ${cy} L ${cx + r} ${cy - r} L ${cx} ${cy - r}`}
          fill="none" stroke={colour} strokeWidth={stroke}
        />
      ) : (
        <path
          d={arcPath(cx, cy, r, degrees)}
          fill="none" stroke={colour} strokeWidth={stroke}
          strokeLinecap="round"
        />
      )}

      {/* Base ray */}
      <line
        x1={cx} y1={cy} x2={bx} y2={by}
        stroke={C.text} strokeWidth={stroke} strokeLinecap="round"
      />

      {/* Second ray */}
      <line
        x1={cx} y1={cy} x2={rx} y2={ry}
        stroke={C.text} strokeWidth={stroke} strokeLinecap="round"
      />

      {/* Vertex dot */}
      <circle cx={cx} cy={cy} r={3} fill={colour} />

      {/* Angle label */}
      {label && (
        <text
          x={labelX} y={labelY}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={font} fontWeight="700" fill={colour}
        >
          {label}
        </text>
      )}
    </svg>
  );
}

// ── Angle type identification card ────────────────────────────────────────
// Renders the angle with a label below — used in the Learn angle types section
export function AngleTypeCard({ type, active = false, onClick }) {
  const selected = active;
  return (
    <button
      onClick={onClick}
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "6px",
        padding:       "10px 8px",
        borderRadius:  "12px",
        border:        `2px solid ${selected ? type.colour : C.border}`,
        background:    selected ? type.colourDim : C.surface,
        cursor:        onClick ? "pointer" : "default",
        transition:    "all 0.15s",
        minWidth:      "72px",
      }}
    >
      <AngleSVG
        degrees={type.example}
        colour={type.colour}
        colourDim={type.colourDim}
        label={`${type.example}°`}
        showRight={type.id === "right"}
        width={80}
        height={60}
      />
      <span style={{
        fontSize:   "12px",
        fontWeight: "700",
        color:      selected ? type.colour : C.muted,
      }}>
        {type.label}
      </span>
    </button>
  );
}

// ── Named angle SVG (three-letter notation) ───────────────────────────────
// Draws two rays with vertex B, end points A and C, labels A B C
// Used to teach three-letter angle notation: angle ABC
export function NamedAngleSVG({
  degrees   = 60,
  colour    = C.accent,
  colourDim = C.accentDim,
  nameA     = "A",
  nameB     = "B",
  nameC     = "C",
  width     = W,
  height    = H,
}) {
  const cx  = width  * 0.4;
  const cy  = height * 0.65;
  const len = Math.min(width, height) * 0.42;
  const r   = Math.min(width, height) * 0.15;

  const [ax, ay] = rayEnd(cx, cy, 0,       len);    // A along baseline
  const [cx2,cy2] = rayEnd(cx, cy, degrees, len);   // C along second ray

  const sweepD = `M ${cx} ${cy} L ${ax} ${ay} A ${r} ${r} 0 ${degrees > 180 ? 1 : 0} 0 ${cx2} ${cy2} Z`;

  const midDeg = degrees / 2;
  const lR     = r + 16;
  const lx     = cx + lR * Math.cos(toRad(midDeg));
  const ly     = cy - lR * Math.sin(toRad(midDeg));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}
    >
      {/* Arc fill */}
      <path d={sweepD} fill={colourDim} stroke="none" />

      {/* Arc */}
      <path
        d={arcPath(cx, cy, r, degrees)}
        fill="none" stroke={colour} strokeWidth={stroke} strokeLinecap="round"
      />

      {/* Rays */}
      <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={C.text} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx2} y2={cy2} stroke={C.text} strokeWidth={stroke} strokeLinecap="round" />

      {/* Vertex dot */}
      <circle cx={cx} cy={cy} r={3} fill={colour} />

      {/* Point labels */}
      <text x={ax + 10} y={ay + 4}  fontSize={font} fontWeight="700" fill={C.text}>{nameA}</text>
      <text x={cx - 14} y={cy + 4}  fontSize={font} fontWeight="700" fill={colour}>{nameB}</text>
      <text x={cx2 + (cx2 > cx ? 8 : -16)} y={cy2 - 6} fontSize={font} fontWeight="700" fill={C.text}>{nameC}</text>

      {/* Angle value label */}
      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
        fontSize={font - 1} fontWeight="700" fill={colour}>
        {degrees}°
      </text>
    </svg>
  );
}