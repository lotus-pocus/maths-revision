import { C } from "../data";

// ── Reusable cumulative frequency graph ───────────────────────────────────
// Props:
//   sets         — array of { label, color, points: [[x, cumFreq], ...] }
//   totalFreq    — total number of values (y-axis max)
//   scaleMin     — x-axis min
//   scaleMax     — x-axis max
//   unit         — x-axis label
//   readPoints   — optional array of { freq, label, value, color } to show reader lines
//   showReadLines — whether to draw the dashed reader lines (default true if readPoints given)
//   height       — SVG height (default 280)

export default function CumFreqGraph({
  sets,
  totalFreq,
  scaleMin,
  scaleMax,
  unit,
  readPoints = [],
  showReadLines = true,
  height = 280,
}) {
  const W = 520; const H = height;
  const PAD = { top: 20, right: 20, bottom: 48, left: 52 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const toSvgX = (val) =>
    PAD.left + ((val - scaleMin) / (scaleMax - scaleMin)) * plotW;
  const toSvgY = (freq) =>
    PAD.top + plotH - (freq / totalFreq) * plotH;

  // Interpolate x on a set's curve for a given cumFreq
  const interpX = (pts, targetFreq) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][1] >= targetFreq && pts[i - 1][1] <= targetFreq) {
        const t = (targetFreq - pts[i - 1][1]) / (pts[i][1] - pts[i - 1][1]);
        return pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]);
      }
    }
    return pts[pts.length - 1][0];
  };

  // Y-axis ticks — sensible intervals based on totalFreq
  const yTickCount = Math.min(totalFreq, 6);
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round((i / yTickCount) * totalFreq)
  );

  // X-axis ticks
  const xTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(scaleMin + (i / 5) * (scaleMax - scaleMin))
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", fontFamily: "inherit", overflow: "visible" }}
    >
      {/* Horizontal grid lines */}
      {yTicks.map((t) => (
        <line key={t}
          x1={PAD.left} y1={toSvgY(t)}
          x2={W - PAD.right} y2={toSvgY(t)}
          stroke={C.border} strokeWidth="1" strokeDasharray="3,3"
        />
      ))}

      {/* Each curve + shaded area */}
      {sets.map((s) => {
        const pathD = s.points.map((pt, i) =>
          `${i === 0 ? "M" : "L"} ${toSvgX(pt[0]).toFixed(1)} ${toSvgY(pt[1]).toFixed(1)}`
        ).join(" ");

        const areaD = `${pathD} L ${toSvgX(scaleMax).toFixed(1)} ${toSvgY(0).toFixed(1)} L ${toSvgX(scaleMin).toFixed(1)} ${toSvgY(0).toFixed(1)} Z`;

        return (
          <g key={s.label}>
            <path d={areaD} fill={s.color + "10"} />
            <path d={pathD} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
            {/* Legend label at end of curve */}
            <text
              x={toSvgX(s.points[s.points.length - 1][0]) + 4}
              y={toSvgY(s.points[s.points.length - 1][1]) + 4}
              fill={s.color} fontSize="9" fontWeight="600"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Reader lines — drawn on the first set's curve by default */}
      {showReadLines && readPoints.length > 0 && sets[0] && readPoints.map((rp) => {
        const xVal = interpX(sets[0].points, rp.freq);
        const svgX = toSvgX(xVal);
        const svgY = toSvgY(rp.freq);
        return (
          <g key={rp.freq}>
            {/* Horizontal line from y-axis to curve */}
            <line x1={PAD.left} y1={svgY} x2={svgX} y2={svgY}
              stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.85" />
            {/* Vertical drop to x-axis */}
            <line x1={svgX} y1={svgY} x2={svgX} y2={toSvgY(0)}
              stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.85" />
            {/* Dot on the curve */}
            <circle cx={svgX} cy={svgY} r="5" fill={rp.color} stroke={C.bg} strokeWidth="2" />
            {/* Y-axis frequency label */}
            <text x={PAD.left - 6} y={svgY + 4}
              fill={rp.color} fontSize="9" textAnchor="end" fontWeight="700">{rp.freq}</text>
          </g>
        );
      })}

      {/* Y-axis */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH}
        stroke={C.border} strokeWidth="1.5" />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PAD.left - 4} y1={toSvgY(t)} x2={PAD.left} y2={toSvgY(t)}
            stroke={C.muted} strokeWidth="1.5" />
          <text x={PAD.left - 8} y={toSvgY(t) + 4}
            fill={C.muted} fontSize="9" textAnchor="end">{t}</text>
        </g>
      ))}
      <text
        transform={`translate(12, ${PAD.top + plotH / 2}) rotate(-90)`}
        fill={C.muted} fontSize="10" textAnchor="middle"
      >
        Cumulative Frequency
      </text>

      {/* X-axis */}
      <line x1={PAD.left} y1={PAD.top + plotH} x2={W - PAD.right} y2={PAD.top + plotH}
        stroke={C.border} strokeWidth="1.5" />
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={toSvgX(t)} y1={PAD.top + plotH}
            x2={toSvgX(t)} y2={PAD.top + plotH + 5}
            stroke={C.muted} strokeWidth="1.5" />
          <text x={toSvgX(t)} y={PAD.top + plotH + 16}
            fill={C.muted} fontSize="9" textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x={PAD.left + plotW / 2} y={H - 4}
        fill={C.muted} fontSize="10" textAnchor="middle">{unit}</text>
    </svg>
  );
}