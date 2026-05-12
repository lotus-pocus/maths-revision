// ── Test: Q1 Alternate Angles using geometry helpers ─────────────────────
// Rafter at 58° from the horizontal beam.
// Shows 58° arc below top beam (right of rafter),
// and alternate x° arc above bottom beam (left of rafter).
//
// Import path from realworld/scenarios/:
// import AngleArc       from "../../../../shared/geometry/AngleArc";
// import ParallelArrows from "../../../../shared/geometry/ParallelArrows";
// import GeomSVG        from "../../../../shared/geometry/GeomSVG";

import AngleArc       from "../../../../shared/geometry/AngleArc";
import ParallelArrows from "../../../../shared/geometry/ParallelArrows";
import GeomSVG        from "../../../../shared/geometry/GeomSVG";

// SVG angle convention: 0°=right, 90°=DOWN, 180°=left, 270°=up
// Beam is horizontal: goes right (0°) and left (180°).
// Rafter at 58° from beam means it slopes downward at 58° below horizontal.
// In SVG: rafter going DOWN-RIGHT = 58° (since y increases downward ✓)
// Rafter going UP-LEFT = 58° + 180° = 238°

export default function Q1DiagramNew({ showAnswer }) {
  const W = 320, H = 265;

  // Beam y-positions
  const topY = 90, botY = 218;

  // Rafter crossing points (computed for exactly 58° angle)
  // At top beam: rafter crosses at topCx
  // Rafter goes at 58° from horizontal (SVG: 58° = down-right ✓)
  // For vertical span (botY - topY) = 128:
  //   horizontal span = 128 / tan(58°) = 128 / 1.6003 ≈ 80
  const topCx = 88;
  const botCx = topCx + 80; // = 168

  // Beam colour
  const beamColor = "#92400e";

  // The 58° arc at top crossing:
  //   between beam-going-RIGHT (0°) and rafter-going-DOWN-RIGHT (58°)
  //   sweep clockwise (CW) from 0° to 58° = short 58° arc below beam ✓
  const arcColor58  = "#d97706"; // amber
  const arcColorX   = showAnswer ? "#059669" : "#9ca3af";
  const xLabel      = showAnswer ? "58°" : "x°";

  return (
    <GeomSVG width={W} height={H}>
      {/* Top beam */}
      <line x1={35} y1={topY} x2={W - 30} y2={topY}
        stroke={beamColor} strokeWidth={5} strokeLinecap="round" />

      {/* Bottom beam */}
      <line x1={35} y1={botY} x2={W - 30} y2={botY}
        stroke={beamColor} strokeWidth={5} strokeLinecap="round" />

      {/* Parallel arrows on each beam */}
      <ParallelArrows x={55} y={topY} angleDeg={0} count={1} color="#2563eb" />
      <ParallelArrows x={55} y={botY} angleDeg={0} count={1} color="#2563eb" />

      {/* Rafter — extended past both beams */}
      <line
        x1={topCx - 28} y1={topY - 28 * Math.tan(58 * Math.PI / 180)}
        x2={botCx + 28} y2={botY + 28 * Math.tan(58 * Math.PI / 180)}
        stroke="#374151" strokeWidth={3} strokeLinecap="round"
      />

      {/* 58° arc at top crossing — between beam-right (0°) and rafter-down (58°) */}
      <AngleArc
        cx={topCx} cy={topY}
        fromDeg={0} toDeg={58}
        sweep="cw"
        radius={26}
        color={arcColor58}
        label="58°"
        labelRadius={42}
        labelSize={13}
        showArmLines={true}
        armLength={26}
        fillOpacity={0.2}
      />

      {/* Alternate angle at bottom crossing */}
      {/* Alternate to the top arc: between beam-LEFT (180°) and rafter-UP (238°) */}
      {/* Same 58° arc, CW from 180° to 238° */}
      <AngleArc
        cx={botCx} cy={botY}
        fromDeg={180} toDeg={238}
        sweep="cw"
        radius={26}
        color={arcColorX}
        label={xLabel}
        labelRadius={42}
        labelSize={13}
        showArmLines={true}
        armLength={26}
        fillOpacity={0.15}
      />

      {/* Beam labels — right side */}
      <text x={W - 32} y={topY - 10} textAnchor="end"
        fontSize={10} fontWeight="700" fill="#2563eb">Top beam (parallel)</text>
      <text x={W - 32} y={botY + 20} textAnchor="end"
        fontSize={10} fontWeight="700" fill="#2563eb">Bottom beam (parallel)</text>
      <text x={botCx + 36} y={botY + 40}
        fontSize={10} fontWeight="600" fill="#374151">Rafter</text>
    </GeomSVG>
  );
}