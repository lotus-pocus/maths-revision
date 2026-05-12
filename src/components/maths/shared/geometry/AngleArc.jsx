// ── AngleArc ──────────────────────────────────────────────────────────────
// Draws an angle arc between two rays from a vertex, with optional label.
// Uses polygon point generation instead of SVG arc commands — no sweep flag bugs.
//
// Props:
//   cx, cy        — vertex point in SVG coordinates
//   fromDeg       — start angle in degrees (SVG: 0=right, 90=DOWN, 180=left, 270=up)
//   toDeg         — end angle in degrees
//   radius        — arc radius in SVG units (default 24)
//   color         — stroke/fill colour
//   label         — text label (e.g. "58°" or "x°")
//   labelRadius   — distance from centre for label (default radius + 16)
//   labelSize     — font size (default 12)
//   labelWeight   — font weight (default "700")
//   sweep         — "auto" = shorter arc, "cw" = clockwise, "ccw" = anticlockwise
//   showArmLines  — draw the two arm lines (default false)
//   armLength     — length of arm lines (default = radius)
//   fillOpacity   — fill opacity (default 0.15)
//   steps         — number of polygon steps for arc smoothness (default 32)

export default function AngleArc({
  cx, cy,
  fromDeg, toDeg,
  radius = 24,
  color = "#d97706",
  label,
  labelRadius,
  labelSize = 12,
  labelWeight = "700",
  sweep = "auto",
  showArmLines = false,
  armLength,
  fillOpacity = 0.15,
  steps = 32,
}) {
  const toRad = d => d * Math.PI / 180;
  const norm  = d => ((d % 360) + 360) % 360;

  const fromN = norm(fromDeg);
  const toN   = norm(toDeg);

  // Compute the angular span in each direction
  const cwSpan  = norm(toN - fromN);   // clockwise span (0–360)
  const ccwSpan = norm(fromN - toN);   // counter-clockwise span (0–360)

  // Choose direction
  let span, dir;
  if (sweep === "cw") {
    span = cwSpan; dir = 1;
  } else if (sweep === "ccw") {
    span = ccwSpan; dir = -1;
  } else {
    // auto: shorter arc
    if (cwSpan <= ccwSpan) { span = cwSpan; dir = 1; }
    else                   { span = ccwSpan; dir = -1; }
  }

  // Generate arc points as a polygon (centre + arc points)
  const arcPts = [];
  arcPts.push(`${cx},${cy}`); // start from centre
  for (let i = 0; i <= steps; i++) {
    const angle = toRad(fromN + dir * span * (i / steps));
    arcPts.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  const polyPoints = arcPts.join(" ");

  // Arc stroke points (just the arc, not the fill wedge)
  const strokePts = [];
  for (let i = 0; i <= steps; i++) {
    const angle = toRad(fromN + dir * span * (i / steps));
    strokePts.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  const strokePolyline = strokePts.join(" ");

  // Label position: midpoint of the arc
  const midAngle = toRad(fromN + dir * span / 2);
  const lr = labelRadius ?? radius + 16;
  const lx = cx + lr * Math.cos(midAngle);
  const ly = cy + lr * Math.sin(midAngle);

  // Arm line endpoints
  const al = armLength ?? radius;
  const ax1 = cx + al * Math.cos(toRad(fromN));
  const ay1 = cy + al * Math.sin(toRad(fromN));
  const ax2 = cx + al * Math.cos(toRad(toN));
  const ay2 = cy + al * Math.sin(toRad(toN));

  return (
    <g>
      {/* Sector fill */}
      <polygon
        points={polyPoints}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
      />
      {/* Arc stroke */}
      <polyline
        points={strokePolyline}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arm lines */}
      {showArmLines && (
        <>
          <line x1={cx} y1={cy} x2={ax1} y2={ay1}
            stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
          <line x1={cx} y1={cy} x2={ax2} y2={ay2}
            stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
        </>
      )}
      {/* Label */}
      {label && (
        <text
          x={lx} y={ly}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={labelSize}
          fontWeight={labelWeight}
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}