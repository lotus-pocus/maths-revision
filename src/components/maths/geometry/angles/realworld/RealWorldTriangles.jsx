import { useState } from "react";
import { C } from "../../../../../data/angles_data";

const W = 320;
const H = 260;
const MASTS = [
  { id: "A", x: 60,  y: 50,  label: "Mast A", color: C.accent  },
  { id: "B", x: 260, y: 70,  label: "Mast B", color: C.amber   },
  { id: "C", x: 160, y: 220, label: "Mast C", color: C.purple  },
];

function angleBetween(vx, vy, p1, p2) {
  const a1 = Math.atan2(p1.y - vy, p1.x - vx);
  const a2 = Math.atan2(p2.y - vy, p2.x - vx);
  let diff = Math.abs(a1 - a2);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return Math.round((diff * 180) / Math.PI);
}

function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function triangleType(a, b, c) {
  const sorted = [a, b, c].sort((x, y) => x - y);
  if (sorted[0] === sorted[1] && sorted[1] === sorted[2]) return "equilateral";
  if (sorted[0] === sorted[1] || sorted[1] === sorted[2]) return "isosceles";
  return "scalene";
}

function MapSVG({ youX, youY, onDrag }) {
  const [dragging, setDragging] = useState(false);

  const getPos = (e) => {
    const svg = e.currentTarget.closest("svg") || e.target.closest("svg");
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(10, Math.min(W - 10, ((clientX - rect.left) / rect.width) * W)),
      y: Math.max(10, Math.min(H - 10, ((clientY - rect.top) / rect.height) * H)),
    };
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", display: "block", cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={e => { setDragging(true); onDrag(getPos(e)); }}
      onMouseMove={e => { if (dragging) onDrag(getPos(e)); }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchStart={e => { setDragging(true); onDrag(getPos(e)); }}
      onTouchMove={e => { e.preventDefault(); if (dragging) onDrag(getPos(e)); }}
      onTouchEnd={() => setDragging(false)}
    >
      {/* Map background grid */}
      <rect x={0} y={0} width={W} height={H} fill="#f0f9ff" rx={8} />
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1={0} y1={i * H/8} x2={W} y2={i * H/8}
          stroke="#bfdbfe" strokeWidth={0.5} />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`v${i}`} x1={i * W/10} y1={0} x2={i * W/10} y2={H}
          stroke="#bfdbfe" strokeWidth={0.5} />
      ))}

      {/* Signal radius circles */}
      {MASTS.map(m => {
        const d = dist(m.x, m.y, youX, youY);
        return (
          <circle key={`r${m.id}`} cx={m.x} cy={m.y} r={d}
            fill="none" stroke={m.color} strokeWidth={1}
            strokeDasharray="4,4" opacity={0.35} />
        );
      })}

      {/* Triangle between masts */}
      <polygon
        points={MASTS.map(m => `${m.x},${m.y}`).join(" ")}
        fill={C.accentDim} fillOpacity={0.5}
        stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />

      {/* Lines from masts to YOU */}
      {MASTS.map(m => (
        <line key={`l${m.id}`} x1={m.x} y1={m.y} x2={youX} y2={youY}
          stroke={m.color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.7} />
      ))}

      {/* Mast icons */}
      {MASTS.map(m => (
        <g key={m.id}>
          <circle cx={m.x} cy={m.y} r={10} fill={m.color} opacity={0.15} />
          <circle cx={m.x} cy={m.y} r={5}  fill={m.color} />
          <line x1={m.x} y1={m.y - 5} x2={m.x} y2={m.y - 18}
            stroke={m.color} strokeWidth={2} />
          <line x1={m.x - 6} y1={m.y - 8} x2={m.x + 6} y2={m.y - 8}
            stroke={m.color} strokeWidth={1.5} />
          <line x1={m.x - 4} y1={m.y - 13} x2={m.x + 4} y2={m.y - 13}
            stroke={m.color} strokeWidth={1.5} />
          <text x={m.x} y={m.y + 18} textAnchor="middle"
            fontSize={10} fontWeight="800" fill={m.color}>{m.label}</text>
        </g>
      ))}

      {/* YOU dot */}
      <circle cx={youX} cy={youY} r={14} fill={C.green} opacity={0.15} />
      <circle cx={youX} cy={youY} r={7}  fill={C.green} />
      <circle cx={youX} cy={youY} r={3}  fill="#fff" />
      <text x={youX} y={youY + 22} textAnchor="middle"
        fontSize={10} fontWeight="800" fill={C.green}>YOU</text>
    </svg>
  );
}

function AngleBadge({ label, deg, color }) {
  return (
    <div style={{ flex: 1, background: "#fff", border: `2px solid ${color}30`,
      borderRadius: "10px", padding: "8px 6px", textAlign: "center" }}>
      <div style={{ fontSize: "10px", fontWeight: "700", color, marginBottom: "2px",
        textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: "900", color, lineHeight: 1 }}>{deg}°</div>
    </div>
  );
}

export default function RealWorldTriangles() {
  const [pos, setPos] = useState({ x: 160, y: 130 });

  const angleA = angleBetween(MASTS[0].x, MASTS[0].y, MASTS[1], pos);
  const angleB = angleBetween(MASTS[1].x, MASTS[1].y, MASTS[0], pos);
  const angleC = angleBetween(MASTS[2].x, MASTS[2].y, MASTS[0], pos);
  const type   = triangleType(angleA, angleB, angleC);

  const typeInfo = {
    equilateral: { label: "Equilateral-ish!", color: C.green,
      text: "You're almost equidistant from all three masts — rare but perfectly balanced." },
    isosceles:   { label: "Isosceles",        color: C.amber,
      text: "You're equidistant from two masts — two angles at your location are equal." },
    scalene:     { label: "Scalene",          color: C.accent,
      text: "All three distances are different — a unique scalene triangle locates you exactly." },
  }[type];

  return (
    <div>
      {/* Hook */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          📱 How does your phone know where you are?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Your phone connects to phone masts. One mast alone can't pinpoint you —
          it only knows how far you are, not which direction. But three masts together
          form a triangle and locate you exactly. This is called <strong>triangulation</strong>.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
        {[
          { n: "1", col: C.accent, text: "Mast A knows you're a certain distance away — you could be anywhere on a circle around it." },
          { n: "2", col: C.amber,  text: "Mast B draws its own circle. Now you must be at one of the two points where both circles cross." },
          { n: "3", col: C.purple, text: "Mast C's circle crosses at exactly ONE of those points. Found you!" },
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

      {/* Interactive map */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center",
          margin: "0 0 8px", fontWeight: "600" }}>
          👆 Drag the YOU dot anywhere on the map
        </p>
        <MapSVG youX={pos.x} youY={pos.y} onDrag={setPos} />
      </div>

      {/* Angle readout */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <AngleBadge label="At Mast A" deg={angleA} color={C.accent} />
        <AngleBadge label="At Mast B" deg={angleB} color={C.amber}  />
        <AngleBadge label="At Mast C" deg={angleC} color={C.purple} />
      </div>

      {/* Triangle type */}
      <div style={{ background: typeInfo.color + "15",
        border: `1.5px solid ${typeInfo.color}40`,
        borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: typeInfo.color, margin: "0 0 4px" }}>
          Triangle type: {typeInfo.label}
        </p>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>
          {typeInfo.text}
        </p>
      </div>

      {/* Exam connection */}
      <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
        borderRadius: "10px", padding: "12px 14px" }}>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          ⭐ <strong>Exam connection:</strong> GCSE questions often give you two angles in a
          triangle and ask for the third. In triangulation, the three angles at your location
          must always add to 360° — just like angles around a point. Both rules come from the
          same triangle maths you've been learning.
        </p>
      </div>
    </div>
  );
}