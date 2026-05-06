import React, { useState, useRef, useCallback } from "react";
import { C } from "../data";
import BottomNav from "./BottomNav";

// ── Interpolate x value from cumfreq curve at a given x position ──────────
function interpFreqAtX(points, x) {
  // Standard linear interpolation — works correctly with step-function data
  // where each data value x has its cumFreq recorded AT that x
  for (let i = 1; i < points.length; i++) {
    if (x <= points[i][0] && x >= points[i - 1][0]) {
      const t = (x - points[i - 1][0]) / (points[i][0] - points[i - 1][0]);
      return points[i - 1][1] + t * (points[i][1] - points[i - 1][1]);
    }
  }
  if (x <= points[0][0]) return points[0][1];
  return points[points.length - 1][1];
}

// ── Snap ruler x to nearest integer data value on the curve ──────────────
function snapToData(rawX, points, scaleMin, scaleMax) {
  // Snap to nearest whole number within scale
  const snapped = Math.round(rawX);
  return Math.max(scaleMin, Math.min(scaleMax, snapped));
}

export default function StageReadGraph({ q, onBack, onComplete }) {
  const n = q.rawData.length;
  const correctSet = new Set(q.rawData);

  // ── Ruler state ──
  const [rulerX,    setRulerX]    = useState(q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.4));
  const [dragging,  setDragging]  = useState(false);
  const [locked,    setLocked]    = useState(false); // true after user releases drag
  const svgRef = useRef(null);

  // ── Collected answers ──
  const [filled,    setFilled]    = useState([]); // array of numbers added
  const [checked,   setChecked]   = useState(false);
  const [wrongSlots,setWrongSlots]= useState(new Set());
  const [showError, setShowError] = useState(false);
  const [flash,     setFlash]     = useState(false); // brief flash when value added

  // ── SVG layout constants ──
  const W = 520; const H = 285;
  const PAD = { top: 20, right: 20, bottom: 60, left: 52 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const toSvgX = (val) => PAD.left + ((val - q.scaleMin) / (q.scaleMax - q.scaleMin)) * plotW;
  const toSvgY = (freq) => PAD.top + plotH - (freq / q.cumFreq.totalFreq) * plotH;
  const toDataX = (svgX) => q.scaleMin + ((svgX - PAD.left) / plotW) * (q.scaleMax - q.scaleMin);

  const pts = q.cumFreq.points;
  const rulerFreq   = Math.round(interpFreqAtX(pts, rulerX) * 10) / 10;
  const rulerSvgX   = toSvgX(rulerX);
  const rulerSvgY   = toSvgY(rulerFreq);

  // Y-axis ticks — one per data point for small datasets
  const yTicks = Array.from({ length: n + 1 }, (_, i) => i);
  // X-axis ticks
  const xTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(q.scaleMin + (i / 5) * (q.scaleMax - q.scaleMin))
  );

  // Curve path
  const pathD = pts.map((pt, i) =>
    `${i === 0 ? "M" : "L"} ${toSvgX(pt[0]).toFixed(1)} ${toSvgY(pt[1]).toFixed(1)}`
  ).join(" ");
  const areaD = `${pathD} L ${toSvgX(q.scaleMax).toFixed(1)} ${toSvgY(0).toFixed(1)} L ${toSvgX(q.scaleMin).toFixed(1)} ${toSvgY(0).toFixed(1)} Z`;

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e) => {
    if (checked) return;
    e.preventDefault();
    svgRef.current.setPointerCapture(e.pointerId);
    setDragging(true);
    setLocked(false);
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    setRulerX(snapToData(toDataX(svgX), pts, q.scaleMin, q.scaleMax));
  }, [checked, pts, q.scaleMin, q.scaleMax]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging || checked) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    setRulerX(snapToData(toDataX(svgX), pts, q.scaleMin, q.scaleMax));
  }, [dragging, checked, pts, q.scaleMin, q.scaleMax]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setLocked(true);
  }, [dragging]);

  // ── Add locked value to filled slots ──
  const handleAddValue = () => {
    if (!locked || checked) return;
    if (filled.length >= n) return;
    setFilled(prev => [...prev, rulerX]);
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    setLocked(false);
  };

  // ── Remove a slot value ──
  const handleRemove = (idx) => {
    if (checked) return;
    setFilled(prev => prev.filter((_, i) => i !== idx));
    setWrongSlots(new Set());
    setShowError(false);
  };

  // ── Check answers ──
  const handleCheck = () => {
    const wrong = new Set();
    filled.forEach((v, i) => { if (!correctSet.has(v)) wrong.add(i); });
    if (wrong.size === 0) {
      setChecked(true);
      setWrongSlots(new Set());
      setShowError(false);
    } else {
      setWrongSlots(wrong);
      setShowError(true);
    }
  };

  const handleReset = () => {
    setFilled([]);
    setChecked(false);
    setWrongSlots(new Set());
    setShowError(false);
    setLocked(false);
  };

  const allFilled = filled.length === n;
  const alreadyAdded = filled.includes(rulerX);

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Stage 0 of 3 — Read the Graph
      </p>

      {/* Instruction card */}
      <div style={{ background: C.card, border: `1px solid ${C.purple}40`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, marginBottom: "6px" }}>How to read the graph</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            { n: "1", text: "Drag the ruler left or right along the x-axis", icon: true },
            { n: "2", text: "Watch the frequency climb as the ruler passes each data value" },
            { n: "3", text: "When the frequency jumps by 1, you've found a value — tap the box to log it" },
          ].map(({ n: num, text, icon }) => (
            <div key={num} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: C.purple, color: "#fff", fontSize: "10px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{num}</div>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
                {text}
                {icon && (
                  <svg viewBox="0 0 28 14" style={{ width: "28px", height: "14px", display: "inline-block", verticalAlign: "middle", marginLeft: "6px" }}>
                    <path d="M2 7 L7 3 L7 5.5 L21 5.5 L21 3 L26 7 L21 11 L21 8.5 L7 8.5 L7 11 Z"
                      fill={C.purple} opacity="0.85" />
                  </svg>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Graph with built-in draggable ruler ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px", touchAction: "none" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", overflow: "visible", cursor: dragging ? "grabbing" : "ew-resize", userSelect: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid lines — one per whole frequency */}
          {yTicks.map(t => (
            <line key={t} x1={PAD.left} y1={toSvgY(t)} x2={W - PAD.right} y2={toSvgY(t)}
              stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
          ))}

          {/* Filled area under curve */}
          <path d={areaD} fill={C.accent + "12"} />
          {/* Curve */}
          <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" />

          {/* Already-added values — vertical tick marks at bottom */}
          {filled.map((v, i) => (
            <line key={i}
              x1={toSvgX(v)} y1={PAD.top + plotH}
              x2={toSvgX(v)} y2={PAD.top + plotH + 6}
              stroke={C.accent} strokeWidth="2.5" />
          ))}

          {/* ── Ruler ── */}
          {/* Vertical ruler line */}
          <line
            x1={rulerSvgX} y1={PAD.top}
            x2={rulerSvgX} y2={PAD.top + plotH}
            stroke={C.purple} strokeWidth="2"
            strokeDasharray={dragging ? "none" : "5,3"}
            opacity="0.9"
          />
          {/* Horizontal read line from y-axis to curve intersection */}
          <line
            x1={PAD.left} y1={rulerSvgY}
            x2={rulerSvgX} y2={rulerSvgY}
            stroke={C.purple} strokeWidth="1.5"
            strokeDasharray="4,3" opacity="0.7"
          />
          {/* Dot at curve intersection */}
          <circle cx={rulerSvgX} cy={rulerSvgY} r="6"
            fill={C.purple} stroke="#fff" strokeWidth="2" />

          {/* Drag icon — horizontal double-arrow rotated 90°, centred on ruler, hidden while dragging */}
          {!dragging && (
            <g transform={`translate(${rulerSvgX}, ${PAD.top + plotH / 2}) rotate(90)`} opacity="0.55">
              {/* Arrow shaft */}
              <rect x="-1" y="-22" width="2" height="44" rx="1" fill={C.purple} />
              {/* Top arrowhead */}
              <polygon points="0,-28 -5,-20 5,-20" fill={C.purple} />
              {/* Bottom arrowhead */}
              <polygon points="0,28 -5,20 5,20" fill={C.purple} />
              {/* Grip dots */}
              <circle cx="0" cy="-6" r="1.5" fill={C.purple} />
              <circle cx="0" cy="0"  r="1.5" fill={C.purple} />
              <circle cx="0" cy="6"  r="1.5" fill={C.purple} />
            </g>
          )}

          {/* Large x-value label below the handle — easy to read */}
          <text x={rulerSvgX} y={PAD.top + plotH + 28}
            fill={C.purple} fontSize="16" fontWeight="800" textAnchor="middle">{rulerX}</text>

          {/* Y-axis */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH}
            stroke={C.border} strokeWidth="1.5" />
          {yTicks.map(t => (
            <g key={t}>
              <line x1={PAD.left - 4} y1={toSvgY(t)} x2={PAD.left} y2={toSvgY(t)}
                stroke={C.muted} strokeWidth="1.5" />
              <text x={PAD.left - 8} y={toSvgY(t) + 4}
                fill={t === Math.round(rulerFreq) ? C.purple : C.muted}
                fontSize="9" fontWeight={t === Math.round(rulerFreq) ? "700" : "400"}
                textAnchor="end">{t}</text>
            </g>
          ))}
          <text transform={`translate(12, ${PAD.top + plotH / 2}) rotate(-90)`}
            fill={C.muted} fontSize="10" textAnchor="middle">Cumulative Frequency</text>

          {/* X-axis */}
          <line x1={PAD.left} y1={PAD.top + plotH} x2={W - PAD.right} y2={PAD.top + plotH}
            stroke={C.border} strokeWidth="1.5" />
          {xTicks.map(t => (
            <g key={t}>
              <line x1={toSvgX(t)} y1={PAD.top + plotH}
                x2={toSvgX(t)} y2={PAD.top + plotH + 5}
                stroke={C.muted} strokeWidth="1.5" />
              <text x={toSvgX(t)} y={PAD.top + plotH + 16}
                fill={C.muted} fontSize="9" textAnchor="middle">{t}</text>
            </g>
          ))}
          <text x={PAD.left + plotW / 2} y={H - 4}
            fill={C.muted} fontSize="10" textAnchor="middle">{q.unit}</text>
        </svg>

        {/* ── Ruler readout + tap-to-log button ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginTop: "12px",
          padding: "10px 14px", borderRadius: "10px",
          background: locked && !alreadyAdded && !checked ? C.purpleDim : C.surface,
          border: `1.5px solid ${locked && !alreadyAdded && !checked ? C.purple : C.border}`,
          transition: "all 0.2s",
        }}>
          {/* Frequency reading */}
          <div style={{ textAlign: "center", minWidth: "52px" }}>
            <p style={{ fontSize: "9px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cum. freq</p>
            <p style={{ fontSize: "20px", fontWeight: "800", color: C.purple, margin: 0 }}>{rulerFreq}</p>
          </div>
          <div style={{ width: "1px", height: "36px", background: C.border, flexShrink: 0 }} />
          {/* X value reading */}
          <div style={{ textAlign: "center", minWidth: "52px" }}>
            <p style={{ fontSize: "9px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{q.unit.replace(/\(.*\)/, "").trim()}</p>
            <p style={{ fontSize: "20px", fontWeight: "800", color: C.purple, margin: 0 }}>{rulerX}</p>
          </div>
          <div style={{ flex: 1 }} />
          {/* Log button */}
          <button
            onClick={handleAddValue}
            disabled={checked || alreadyAdded || filled.length >= n}
            style={{
              padding: "10px 16px", borderRadius: "10px", border: "none", cursor:
                (checked || alreadyAdded || filled.length >= n) ? "default" : "pointer",
              background: alreadyAdded
                ? C.accentDim
                : (checked || filled.length >= n)
                  ? C.surface
                  : locked ? C.purple : C.border,
              color: alreadyAdded ? C.accent : locked && !checked && filled.length < n ? "#fff" : C.muted,
              fontSize: "13px", fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: locked && !alreadyAdded && !checked && filled.length < n
                ? `0 2px 12px ${C.purple}50` : "none",
            }}
          >
            {alreadyAdded ? "✓ Added" : locked ? "＋ Log this value" : "Drag to read"}
          </button>
        </div>

        {/* Nudge shown while dragging */}
        {!locked && !dragging && !checked && (
          <p style={{ fontSize: "11px", color: C.purple, textAlign: "center", margin: "8px 0 0", opacity: 0.7 }}>
            Drag anywhere on the graph to move the ruler
          </p>
        )}
        {locked && !alreadyAdded && !checked && filled.length < n && (
          <p style={{ fontSize: "11px", color: C.purple, textAlign: "center", margin: "8px 0 0", fontWeight: "700" }}>
            ↑ Tap "Log this value" to record {rulerX}
          </p>
        )}
        {alreadyAdded && !checked && (
          <p style={{ fontSize: "11px", color: C.accent, textAlign: "center", margin: "8px 0 0" }}>
            {rulerX} is already in your list — drag to a different position
          </p>
        )}
      </div>

      {/* ── Collected values strip ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: 0 }}>
          Your readings ({filled.length} of {n})
        </p>
        {filled.length > 0 && !checked && (
          <button onClick={handleReset} style={{ fontSize: "11px", color: C.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Reset all
          </button>
        )}
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px",
        minHeight: "52px", padding: "10px",
        background: checked ? "#ecfdf5" : flash ? C.purpleDim : C.surface,
        border: `1.5px solid ${checked ? C.accent : flash ? C.purple : C.border}`,
        borderRadius: "12px", transition: "background 0.2s, border-color 0.2s",
      }}>
        {Array.from({ length: n }).map((_, i) => {
          const isWrong  = wrongSlots.has(i);
          const isFilled = filled[i] !== undefined;
          const bg     = isFilled ? (checked ? C.accentDim : isWrong ? "#fef2f2" : C.purpleDim) : "#f9fafb";
          const border = isFilled ? (checked ? C.accent    : isWrong ? "#dc2626" : C.purple)     : C.border;
          const color  = isFilled ? (checked ? C.accent    : isWrong ? "#dc2626" : C.purple)     : C.muted;
          return (
            <div key={i} onClick={() => isFilled && !checked && handleRemove(i)}
              style={{
                width: "46px", height: "38px", borderRadius: "8px",
                border: `2px solid ${border}`, background: bg, color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: "700",
                cursor: isFilled && !checked ? "pointer" : "default",
                transition: "all 0.15s",
                boxShadow: isWrong ? "0 0 0 2px #fca5a5" : "none",
              }}
              title={isFilled && !checked ? "Tap to remove" : ""}
            >
              {isFilled ? filled[i] : "?"}
            </div>
          );
        })}
        {filled.length === 0 && (
          <p style={{ fontSize: "12px", color: C.muted, margin: "auto 0", paddingLeft: "4px" }}>
            Log values using the graph above…
          </p>
        )}
      </div>
      {filled.length > 0 && !checked && (
        <p style={{ fontSize: "11px", color: C.muted, margin: "-8px 0 12px", textAlign: "center" }}>
          Tap any value to remove it
        </p>
      )}

      {/* Error message */}
      {showError && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #dc2626", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", color: "#dc2626", margin: 0, lineHeight: 1.6 }}>
            <strong>❌ {[...wrongSlots].map(i => filled[i]).join(", ")} {wrongSlots.size === 1 ? "is" : "are"} not on the graph.</strong>{" "}
            Tap the red value to remove it, then re-read the graph.
          </p>
        </div>
      )}

      {/* Check / success */}
      {!checked ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCheck}
            disabled={!allFilled}
            style={{ flex: 1, padding: "13px", background: allFilled ? C.purple : C.border, color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: allFilled ? "pointer" : "default", transition: "background 0.2s" }}
          >
            {allFilled ? "Check my answers →" : `${n - filled.length} value${n - filled.length !== 1 ? "s" : ""} still to log`}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ background: C.accentDim, border: `1.5px solid ${C.accent}`, borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 6px" }}>✓ All {n} values correct!</p>
            <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.6, margin: 0 }}>
              In the next stage you'll put these values in order — that's when Q1, the median and Q3 will reveal themselves.
            </p>
          </div>
          <BottomNav onBack={onBack} onNext={onComplete} backLabel="← Back to questions" nextLabel="Continue to Stage 1 — Order the data →" />
        </div>
      )}
    </div>
  );
}