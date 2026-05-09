// src/components/maths/geometry/angles/shared/StraightLineSVG.jsx
import { C } from "../../../../../data/angles_data";

export function StraightLineSVG({ knownAngle = 130, showAnswer = false }) {
  const W = 280; const H = 150;
  const cx = 130; const cy = 100; // vertex position
  const toRad = d => d * Math.PI / 180;
  const unknown = 180 - knownAngle;

  // Ray angle from positive x-axis
  // knownAngle is measured from right (B side) to ray
  // So ray sits at knownAngle degrees above the line from the right
  const rayDeg = knownAngle; // e.g. 130° from right = ray leans left
  const rayX = cx + 70 * Math.cos(toRad(rayDeg));
  const rayY = cy - 70 * Math.sin(toRad(rayDeg));

  // Known angle arc: large arc from 0° (right/B) sweeping up to rayDeg
  // This is the BIG region between B and the ray
  const arcR = 35;
  const knownSx = cx + arcR;            // start at right (0°)
  const knownSy = cy;
  const knownEx = cx + arcR * Math.cos(toRad(rayDeg));
  const knownEy = cy - arcR * Math.sin(toRad(rayDeg));
  // large-arc=1 when knownAngle > 180, sweep=0 (anticlockwise = going up from right to ray)
  const knownLarge = knownAngle > 180 ? 1 : 0;
  const knownPath = `M ${knownSx} ${knownSy} A ${arcR} ${arcR} 0 ${knownLarge} 0 ${knownEx} ${knownEy}`;
  // Label at midpoint of the arc
  const knownMidDeg = knownAngle / 2;
  const knownLx = cx + (arcR + 18) * Math.cos(toRad(knownMidDeg));
  const knownLy = cy - (arcR + 18) * Math.sin(toRad(knownMidDeg));

  // Unknown arc: small arc from rayDeg up to 180° (left/A side)
  const arcR2 = 20;
  const unknownSx = cx + arcR2 * Math.cos(toRad(rayDeg));
  const unknownSy = cy - arcR2 * Math.sin(toRad(rayDeg));
  const unknownEx = cx - arcR2;         // end at left (180°)
  const unknownEy = cy;
  const unknownPath = `M ${unknownSx} ${unknownSy} A ${arcR2} ${arcR2} 0 0 0 ${unknownEx} ${unknownEy}`;
  // Label at midpoint between rayDeg and 180°
  const unknownMidDeg = rayDeg + unknown / 2;
  const unknownLx = cx + (arcR2 + 18) * Math.cos(toRad(unknownMidDeg));
  const unknownLy = cy - (arcR2 + 18) * Math.sin(toRad(unknownMidDeg));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Straight line A to B */}
      <line x1={cx - 110} y1={cy} x2={cx + 110} y2={cy}
        stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round" />
      {/* Ray */}
      <line x1={cx} y1={cy} x2={rayX} y2={rayY}
        stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round" />
      {/* Vertex dot */}
      <circle cx={cx} cy={cy} r={3} fill={C.accent} />

      {/* Known angle arc (large, right side) */}
      <path d={knownPath} fill="none" stroke={C.accent} strokeWidth={1.8} />
      <text x={knownLx} y={knownLy} textAnchor="middle"
        dominantBaseline="middle" fontSize={12} fontWeight="700" fill={C.accent}>
        {knownAngle}°
      </text>

      {/* Unknown angle arc (small, left side) */}
      <path d={unknownPath}
        fill={showAnswer ? C.accentDim : "#f3f4f6"}
        stroke={showAnswer ? C.accent : "#9ca3af"} strokeWidth={1.5} />
      <text x={unknownLx} y={unknownLy} textAnchor="middle"
        dominantBaseline="middle" fontSize={12} fontWeight="700"
        fill={showAnswer ? C.accent : "#9ca3af"}>
        {showAnswer ? `${unknown}°` : "x°"}
      </text>

      {/* Labels */}
      <text x={cx - 100} y={cy - 10} fontSize={11} fill="#9ca3af">A</text>
      <text x={cx + 100} y={cy - 10} fontSize={11} fill="#9ca3af">B</text>
      <text x={rayX + (rayX > cx ? 8 : -16)} y={rayY - 6} fontSize={11} fill="#9ca3af">C</text>
      <text x={cx + 8} y={cy + 16} fontSize={11} fill={C.accent}>O</text>
    </svg>
  );
}