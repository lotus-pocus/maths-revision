// ── ParallelArrows ────────────────────────────────────────────────────────
// Draws the standard tick-arrow marks (›› or >) on a line to show it is
// parallel to another line with the same number of marks.
//
// Props:
//   x, y        — centre point where the arrow sits on the line
//   angleDeg    — angle of the line in degrees (0 = horizontal going right)
//   count       — number of arrow marks: 1 (single ›) or 2 (double ››)
//   size        — size of each arrow in SVG units (default 8)
//   color       — stroke colour
//   strokeWidth — (default 2)

export default function ParallelArrows({
  x, y,
  angleDeg = 0,
  count = 1,
  size = 8,
  color = "#2563eb",
  strokeWidth = 2,
}) {
  const toRad = deg => deg * Math.PI / 180;
  const r = toRad(angleDeg);

  // Unit vector along the line and perpendicular
  const ux = Math.cos(r), uy = Math.sin(r);
  const px = -uy, py = ux; // perpendicular (rotated 90° CCW)

  // Spacing between double arrows
  const gap = 5;
  const offsets = count === 1 ? [0] : [-gap / 2, gap / 2];

  return (
    <g>
      {offsets.map((off, i) => {
        // Centre of this arrow mark
        const ax = x + ux * off, ay = y + uy * off;
        // Arrow chevron: two lines meeting at a point
        // Point of arrow is in the +direction, base is behind
        const tipX  = ax + ux * size * 0.5;
        const tipY  = ay + uy * size * 0.5;
        const baseL = { x: ax - ux * size * 0.5 + px * size * 0.5,
                        y: ay - uy * size * 0.5 + py * size * 0.5 };
        const baseR = { x: ax - ux * size * 0.5 - px * size * 0.5,
                        y: ay - uy * size * 0.5 - py * size * 0.5 };
        return (
          <g key={i}>
            <line x1={baseL.x} y1={baseL.y} x2={tipX} y2={tipY}
              stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <line x1={baseR.x} y1={baseR.y} x2={tipX} y2={tipY}
              stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}