import { useState, useRef } from "react";
import { C } from "../../../../../../data/angles_data";

const W = 320;
const H = 260;

const A_MAST  = { x: 70,  y: 50,  label: "Mast A", color: C.accent };
const B_MAST  = { x: 260, y: 70,  label: "Mast B", color: C.amber  };
const C_MAST  = { x: 160, y: 215, label: "Mast C", color: C.purple };
const MASTS   = [A_MAST, B_MAST, C_MAST];

function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function interiorAngle(vx, vy, p1x, p1y, p2x, p2y) {
  const a1 = Math.atan2(p1y - vy, p1x - vx);
  const a2 = Math.atan2(p2y - vy, p2x - vx);
  let diff = Math.abs(a1 - a2);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return Math.round((diff * 180) / Math.PI);
}

function clampToTriangle(px, py) {
  const A = A_MAST, B = B_MAST, Cv = C_MAST;
  const dX = px - Cv.x, dY = py - Cv.y;
  const dX21 = Cv.x - B.x, dY12 = B.y - Cv.y;
  const D = dY12 * (A.x - Cv.x) + dX21 * (A.y - Cv.y);
  const s = dY12 * dX + dX21 * dY;
  const t = (Cv.y - A.y) * dX + (A.x - Cv.x) * dY;
  const u = s / D, v = t / D, w = 1 - u - v;
  if (u >= 0 && v >= 0 && w >= 0) return { x: px, y: py };

  const clampEdge = (p1, p2) => {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return { x: p1.x, y: p1.y };
    const tc = Math.max(0, Math.min(1, ((px - p1.x) * dx + (py - p1.y) * dy) / len2));
    return { x: p1.x + tc * dx, y: p1.y + tc * dy };
  };

  const candidates = [clampEdge(A, B), clampEdge(B, Cv), clampEdge(Cv, A)];
  let best = candidates[0];
  let bestD = dist(px, py, best.x, best.y);
  for (const c of candidates.slice(1)) {
    const d = dist(px, py, c.x, c.y);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

function triangleType(a, b, c) {
  const s = [a, b, c].sort((x, y) => x - y);
  if (Math.abs(s[0] - s[2]) <= 2) return "equilateral";
  if (Math.abs(s[0] - s[1]) <= 2 || Math.abs(s[1] - s[2]) <= 2) return "isosceles";
  return "scalene";
}

function AngleBadge({ label, sublabel, deg, color }) {
  return (
    <div style={{ flex: 1, background: "#fff", border: `2px solid ${color}30`,
      borderRadius: "10px", padding: "8px 6px", textAlign: "center" }}>
      <div style={{ fontSize: "10px", fontWeight: "700", color,
        textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1px" }}>{label}</div>
      <div style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "3px" }}>{sublabel}</div>
      <div style={{ fontSize: "20px", fontWeight: "900", color, lineHeight: 1 }}>{deg}°</div>
    </div>
  );
}

export default function ExploreScenario({ onBack }) {
  const [pos, setPos] = useState({ x: 163, y: 112 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);

  const getPos = (clientX, clientY) => {
    if (!svgRef.current) return pos;
    const rect = svgRef.current.getBoundingClientRect();
    const raw = {
      x: ((clientX - rect.left) / rect.width)  * W,
      y: ((clientY - rect.top)  / rect.height) * H,
    };
    return clampToTriangle(raw.x, raw.y);
  };

  const handleMouseDown = (e) => { setDragging(true); setPos(getPos(e.clientX, e.clientY)); };
  const handleMouseMove = (e) => { if (dragging) setPos(getPos(e.clientX, e.clientY)); };
  const handleMouseUp   = () => setDragging(false);
  const handleTouchStart = (e) => { setDragging(true); setPos(getPos(e.touches[0].clientX, e.touches[0].clientY)); };
  const handleTouchMove  = (e) => { e.preventDefault(); if (dragging) setPos(getPos(e.touches[0].clientX, e.touches[0].clientY)); };
  const handleTouchEnd   = () => setDragging(false);

  const youX = pos.x, youY = pos.y;

  const angleAtA = interiorAngle(A_MAST.x, A_MAST.y, B_MAST.x, B_MAST.y, youX, youY);
  const angleAtB = interiorAngle(B_MAST.x, B_MAST.y, A_MAST.x, A_MAST.y, youX, youY);
  const angleAtY = interiorAngle(youX, youY, A_MAST.x, A_MAST.y, B_MAST.x, B_MAST.y);
  const sum      = angleAtA + angleAtB + angleAtY;

  const type = triangleType(angleAtA, angleAtB, angleAtY);
  const typeInfo = {
    equilateral: { label: "Equilateral-ish!", color: C.green,
      text: "You're nearly equidistant from both masts — the triangle is almost equilateral." },
    isosceles:   { label: "Isosceles",        color: C.amber,
      text: "Two angles are equal — two sides of this triangle are the same length." },
    scalene:     { label: "Scalene",          color: C.accent,
      text: "All three angles are different — a unique scalene triangle pinpoints you exactly." },
  }[type];

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          📱 How does your phone know where you are?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Your phone connects to phone masts. One mast knows your distance but not direction.
          Three masts together form a triangle and pinpoint your location exactly —
          this is called <strong>triangulation</strong>.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
        {[
          { n: "1", col: C.accent, text: "Mast A knows your distance — you could be anywhere on its circle." },
          { n: "2", col: C.amber,  text: "Mast B's circle narrows it to two crossing points." },
          { n: "3", col: C.purple, text: "Mast C's circle crosses at exactly ONE of those. Found you!" },
        ].map(({ n, col, text }) => (
          <div key={n} style={{ display: "flex", gap: "10px", alignItems: "flex-start",
            background: "#fff", border: `1px solid ${col}30`, borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: col,
              color: "#fff", fontSize: "12px", fontWeight: "800", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center",
          margin: "0 0 8px", fontWeight: "600" }}>
          👆 Drag YOU inside the triangle
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", display: "block",
            cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid */}
          <rect x={0} y={0} width={W} height={H} fill="#f0f9ff" rx={8} />
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <line key={`h${i}`} x1={0} y1={i*H/8} x2={W} y2={i*H/8} stroke="#bfdbfe" strokeWidth={0.5} />
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <line key={`v${i}`} x1={i*W/10} y1={0} x2={i*W/10} y2={H} stroke="#bfdbfe" strokeWidth={0.5} />
          ))}

          {/* Signal radius circles */}
          {MASTS.map(m => (
            <circle key={`r${m.id || m.label}`} cx={m.x} cy={m.y}
              r={dist(m.x, m.y, youX, youY)}
              fill="none" stroke={m.color} strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
          ))}

          {/* Mast triangle */}
          <polygon
            points={MASTS.map(m => `${m.x},${m.y}`).join(" ")}
            fill={C.accentDim} fillOpacity={0.4}
            stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />

          {/* Lines to YOU */}
          {MASTS.map(m => (
            <line key={`l${m.label}`} x1={m.x} y1={m.y} x2={youX} y2={youY}
              stroke={m.color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8} />
          ))}

          {/* Mast icons */}
          {MASTS.map(m => (
            <g key={`g${m.label}`}>
              <circle cx={m.x} cy={m.y} r={10} fill={m.color} opacity={0.15} />
              <circle cx={m.x} cy={m.y} r={5}  fill={m.color} />
              <line x1={m.x} y1={m.y-5}  x2={m.x} y2={m.y-18} stroke={m.color} strokeWidth={2} />
              <line x1={m.x-6} y1={m.y-8}  x2={m.x+6} y2={m.y-8}  stroke={m.color} strokeWidth={1.5} />
              <line x1={m.x-4} y1={m.y-13} x2={m.x+4} y2={m.y-13} stroke={m.color} strokeWidth={1.5} />
              <text x={m.x} y={m.y+18} textAnchor="middle" fontSize={10} fontWeight="800" fill={m.color}>
                {m.label}
              </text>
            </g>
          ))}

          {/* YOU dot */}
          <circle cx={youX} cy={youY} r={14} fill={C.green} opacity={0.15} />
          <circle cx={youX} cy={youY} r={7}  fill={C.green} />
          <circle cx={youX} cy={youY} r={3}  fill="#fff" />
          <text x={youX} y={youY+22} textAnchor="middle" fontSize={10} fontWeight="800" fill={C.green}>YOU</text>
        </svg>
      </div>

      {/* Angles */}
      <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px", fontWeight: "600",
        textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Interior angles of triangle Mast A – Mast B – YOU
      </p>
      <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
        <AngleBadge label="Mast A" sublabel="angle at A" deg={angleAtA} color={C.accent} />
        <AngleBadge label="Mast B" sublabel="angle at B" deg={angleAtB} color={C.amber}  />
        <AngleBadge label="YOU"    sublabel="angle at you" deg={angleAtY} color={C.green}  />
      </div>

      {/* Sum */}
      <div style={{
        background: sum === 180 ? C.greenDim : C.accentDim,
        border: `1px solid ${sum === 180 ? C.green : C.accent}30`,
        borderRadius: "8px", padding: "8px 14px", marginBottom: "12px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "12px", color: C.text, fontWeight: "600" }}>
          {angleAtA}° + {angleAtB}° + {angleAtY}° =
        </span>
        <span style={{ fontSize: "15px", fontWeight: "900",
          color: sum === 180 ? C.green : C.accent }}>
          {sum}° {sum === 180 ? "✓" : ""}
        </span>
      </div>

      {/* Triangle type */}
      <div style={{ background: typeInfo.color + "15", border: `1.5px solid ${typeInfo.color}40`,
        borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: typeInfo.color, margin: "0 0 4px" }}>
          Triangle type: {typeInfo.label}
        </p>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>{typeInfo.text}</p>
      </div>

      {/* Exam tip */}
      <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
        borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          ⭐ <strong>Exam connection:</strong> No matter where you drag, the three interior
          angles always add to exactly 180°. That's the triangle angle sum rule used in
          every multi-step geometry question.
        </p>
      </div>

      <button onClick={onBack} style={{
        width: "100%", padding: "11px", borderRadius: "10px",
        border: `1.5px solid ${C.border}`, background: C.surface,
        fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer",
      }}>
        ← Back to scenarios
      </button>
    </div>
  );
}