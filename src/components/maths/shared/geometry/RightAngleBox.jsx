// ── RightAngleBox ─────────────────────────────────────────────────────────
// Draws the standard square corner mark indicating a 90° angle.
//
// Props:
//   cx, cy      — the vertex point (corner of the right angle)
//   dir1Deg     — direction of first ray in degrees (SVG: 0=right, 90=down)
//   dir2Deg     — direction of second ray in degrees
//   size        — size of the square in SVG units (default 12)
//   color       — stroke colour (default "#374151")
//   strokeWidth — (default 1.5)
//
// The square is always drawn in the sector between dir1Deg and dir2Deg
// going the short way round (same as AngleArc with sweep="auto").

export default function RightAngleBox({
  cx, cy,
  dir1Deg, dir2Deg,
  size = 12,
  color = "#374151",
  strokeWidth = 1.5,
}) {
  const toRad = deg => deg * Math.PI / 180;

  const r1 = toRad(dir1Deg);
  const r2 = toRad(dir2Deg);

  // Unit vectors along each ray
  const u1x = Math.cos(r1), u1y = Math.sin(r1);
  const u2x = Math.cos(r2), u2y = Math.sin(r2);

  // Three corners of the square (the fourth is the vertex cx,cy)
  const p1x = cx + u1x * size, p1y = cy + u1y * size;
  const p3x = cx + u2x * size, p3y = cy + u2y * size;
  const p2x = p1x + u2x * size, p2y = p1y + u2y * size;

  return (
    <polyline
      points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      strokeLinecap="square"
    />
  );
}