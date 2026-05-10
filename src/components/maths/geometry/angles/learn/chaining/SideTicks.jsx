// ── SideTicks ─────────────────────────────────────────────────────────────
// Draws perpendicular tick marks at the midpoint of a line segment.
// Marks are always perpendicular to the line regardless of its angle.
//
// Props:
//   p1, p2      — { x, y } endpoints of the line
//   count       — 1 or 2 tick marks (default 2)
//   size        — half-length of each tick in SVG units (default 7)
//   colour      — stroke colour
//   strokeWidth — (default 2)
export default function SideTicks({ p1, p2, count = 2, size = 7, colour, strokeWidth = 2 }) {
  const dx  = p2.x - p1.x;
  const dy  = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Unit vector along the line
  const ux = dx / len;
  const uy = dy / len;

  // Perpendicular unit vector (rotated 90°)
  const px = -uy;
  const py =  ux;

  // Midpoint of the segment
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  // For double ticks, offset along the line direction
  const gap     = 5;
  const offsets = count === 1 ? [0] : [-gap / 2, gap / 2];

  return (
    <>
      {offsets.map((off, i) => {
        const cx = mx + ux * off;
        const cy = my + uy * off;
        return (
          <line
            key={i}
            x1={cx + px * size} y1={cy + py * size}
            x2={cx - px * size} y2={cy - py * size}
            stroke={colour} strokeWidth={strokeWidth} strokeLinecap="round"
          />
        );
      })}
    </>
  );
}