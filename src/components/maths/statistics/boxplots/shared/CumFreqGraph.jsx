import { C } from "../data";
import { useState, useRef, useCallback } from "react";

// ── Reusable cumulative frequency graph ───────────────────────────────────
// Props:
//   sets          — array of { label, color, points: [[x, cumFreq], ...] }
//   totalFreq     — total number of values (y-axis max)
//   scaleMin      — x-axis min
//   scaleMax      — x-axis max
//   unit          — x-axis label
//   readPoints    — optional array of { freq, label, value, color }
//   showReadLines — whether to draw the dashed reader lines
//   showRuler     — whether to show the draggable ruler (default false)
//   height        — SVG height (default 280)

export default function CumFreqGraph({
  sets,
  totalFreq,
  scaleMin,
  scaleMax,
  unit,
  readPoints = [],
  showReadLines = true,
  showRuler = false,
  height = 280,
}) {
  const W = 520; const H = height;
  const PAD = { top: 20, right: 20, bottom: 48, left: 52 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const svgRef = useRef(null);
  const [rulerX, setRulerX] = useState(null); // SVG x coordinate of ruler

  const toSvgX = (val) =>
    PAD.left + ((val - scaleMin) / (scaleMax - scaleMin)) * plotW;
  const toSvgY = (freq) =>
    PAD.top + plotH - (freq / totalFreq) * plotH;

  // Convert SVG x → data x value
  const svgXToVal = (svgX) =>
    scaleMin + ((svgX - PAD.left) / plotW) * (scaleMax - scaleMin);

  // Given a data x value, interpolate cumFreq on the curve
  const interpFreq = (pts, targetX) => {
    if (targetX <= pts[0][0]) return pts[0][1];
    if (targetX >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][0] >= targetX && pts[i - 1][0] <= targetX) {
        const t = (targetX - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
        return pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]);
      }
    }
    return pts[pts.length - 1][1];
  };

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

  // ── Ruler drag handling ───────────────────────────────────────────────
  const getSvgXFromEvent = useCallback((e) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    // Scale from DOM pixels to SVG viewBox coordinates
    const svgX = ((clientX - rect.left) / rect.width) * W;
    // Clamp within plot area
    return Math.max(PAD.left, Math.min(W - PAD.right, svgX));
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!showRuler) return;
    e.preventDefault();
    const x = getSvgXFromEvent(e);
    if (x !== null) setRulerX(x);
  }, [showRuler, getSvgXFromEvent]);

  const handlePointerLeave = useCallback(() => {
    // Keep ruler visible on mouse leave — only reset on explicit action
  }, []);

  // Ruler derived values
  const rulerDataX = rulerX !== null ? svgXToVal(rulerX) : null;
  const rulerFreq  = (rulerDataX !== null && sets[0])
    ? interpFreq(sets[0].points, rulerDataX)
    : null;
  const rulerFreqRounded = rulerFreq !== null ? Math.round(rulerFreq) : null;
  const rulerSvgY  = rulerFreq !== null ? toSvgY(rulerFreq) : null;
  const rulerValDisplay = rulerDataX !== null ? Math.round(rulerDataX) : null;

  // Y-axis ticks — every integer for small datasets, sensible intervals for large
  const yTicks = totalFreq <= 20
    ? Array.from({ length: totalFreq + 1 }, (_, i) => i)
    : Array.from({ length: 7 }, (_, i) => Math.round((i / 6) * totalFreq));
  const yTickCount = yTicks.length - 1;

  // X-axis ticks
  const xTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(scaleMin + (i / 5) * (scaleMax - scaleMin))
  );

  return (
    <div style={{ position: "relative" }}>
      {showRuler && (
        <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px", textAlign: "center" }}>
          👆 Drag or tap anywhere on the graph to read off values
        </p>
      )}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", fontFamily: "inherit", overflow: "visible", touchAction: "none", cursor: showRuler ? "crosshair" : "default" }}
        onMouseMove={showRuler ? handlePointerMove : undefined}
        onTouchMove={showRuler ? handlePointerMove : undefined}
        onMouseDown={showRuler ? handlePointerMove : undefined}
        onTouchStart={showRuler ? handlePointerMove : undefined}
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
              <text
                x={toSvgX(s.points[s.points.length - 1][0]) + 4}
                y={toSvgY(s.points[s.points.length - 1][1]) + 4}
                fill={s.color} fontSize="9" fontWeight="600"
              >{s.label}</text>
            </g>
          );
        })}

        {/* ── Draggable ruler ── */}
        {showRuler && rulerX !== null && rulerSvgY !== null && (
          <g>
            {/* Vertical ruler line */}
            <line
              x1={rulerX} y1={PAD.top}
              x2={rulerX} y2={PAD.top + plotH}
              stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"
            />
            {/* Horizontal reading line to y-axis */}
            <line
              x1={PAD.left} y1={rulerSvgY}
              x2={rulerX} y2={rulerSvgY}
              stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"
            />
            {/* Dot on the curve */}
            <circle
              cx={rulerX} cy={rulerSvgY} r="6"
              fill="#7c3aed" stroke="#fff" strokeWidth="2"
            />
            {/* X value label below ruler line */}
            <rect
              x={rulerX - 18} y={PAD.top + plotH + 6}
              width="36" height="16" rx="4"
              fill="#7c3aed"
            />
            <text
              x={rulerX} y={PAD.top + plotH + 18}
              fill="#fff" fontSize="9" textAnchor="middle" fontWeight="700"
            >{rulerValDisplay}</text>
            {/* Cumulative frequency label on y-axis */}
            <rect
              x={PAD.left - 38} y={rulerSvgY - 9}
              width="34" height="16" rx="4"
              fill="#7c3aed"
            />
            <text
              x={PAD.left - 21} y={rulerSvgY + 3}
              fill="#fff" fontSize="9" textAnchor="middle" fontWeight="700"
            >{rulerFreqRounded}</text>
          </g>
        )}

        {/* Static reader lines */}
        {showReadLines && readPoints.length > 0 && sets[0] && readPoints.map((rp) => {
          const xVal = interpX(sets[0].points, rp.freq);
          const svgX = toSvgX(xVal);
          const svgY = toSvgY(rp.freq);
          return (
            <g key={rp.freq}>
              <line x1={PAD.left} y1={svgY} x2={svgX} y2={svgY}
                stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.85" />
              <line x1={svgX} y1={svgY} x2={svgX} y2={toSvgY(0)}
                stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.85" />
              <circle cx={svgX} cy={svgY} r="5" fill={rp.color} stroke={C.bg} strokeWidth="2" />
              <text x={PAD.left - 6} y={svgY + 4}
                fill={rp.color} fontSize="9" textAnchor="end" fontWeight="700">{rp.freq}</text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH}
          stroke={C.border} strokeWidth="1.5" />
        {yTicks.map((t) => {
          const clashes = readPoints.some(rp => Math.abs(rp.freq - t) <= (totalFreq / yTickCount) * 0.4);
          // For datasets with 10-20 values, only label every 2nd tick to avoid crowding
          const skipLabel = totalFreq > 9 && totalFreq <= 20 && t % 2 !== 0;
          return (
            <g key={t}>
              <line x1={PAD.left - 4} y1={toSvgY(t)} x2={PAD.left} y2={toSvgY(t)}
                stroke={C.muted} strokeWidth="1.5" />
              {!clashes && !skipLabel && (
                <text x={PAD.left - 8} y={toSvgY(t) + 4}
                  fill={C.muted} fontSize="9" textAnchor="end">{t}</text>
              )}
            </g>
          );
        })}
        <text
          transform={`translate(12, ${PAD.top + plotH / 2}) rotate(-90)`}
          fill={C.muted} fontSize="10" textAnchor="middle"
        >Cumulative Frequency</text>

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

      {/* Live readout below graph */}
      {showRuler && (
        <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
          <div style={{ flex: 1, background: "#f5f3ff", border: "1.5px solid #c4b5fd", borderRadius: "10px", padding: "10px 14px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{unit || "Value"}</p>
            <p style={{ fontSize: "22px", fontWeight: "800", color: "#7c3aed", margin: 0 }}>
              {rulerValDisplay !== null ? rulerValDisplay : "—"}
            </p>
          </div>
          <div style={{ flex: 1, background: "#f5f3ff", border: "1.5px solid #c4b5fd", borderRadius: "10px", padding: "10px 14px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Cumulative Freq</p>
            <p style={{ fontSize: "22px", fontWeight: "800", color: "#7c3aed", margin: 0 }}>
              {rulerFreqRounded !== null ? rulerFreqRounded : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}