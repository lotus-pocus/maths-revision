import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import MiniCalc  from "../../../shared/MiniCalc";
import SideTicks from "../learn/chaining/SideTicks";

// ── Map constants ─────────────────────────────────────────────────────────
const W = 320;
const H = 260;
const MASTS = [
  { id: "A", x: 70,  y: 50,  label: "Mast A", color: C.accent },
  { id: "B", x: 260, y: 70,  label: "Mast B", color: C.amber  },
  { id: "C", x: 160, y: 215, label: "Mast C", color: C.purple },
];

// ── Geometry helpers ──────────────────────────────────────────────────────
function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function angleBetween(vx, vy, p1, p2) {
  const a1 = Math.atan2(p1.y - vy, p1.x - vx);
  const a2 = Math.atan2(p2.y - vy, p2.x - vx);
  let diff = Math.abs(a1 - a2);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return Math.round((diff * 180) / Math.PI);
}

// Clamp a point to inside (or on edge of) triangle using barycentric coords.
// Returns the nearest point inside the triangle.
function clampToTriangle(px, py, [A, B, Cv]) {
  // Barycentric coordinates
  const dX  = px - Cv.x,  dY  = py - Cv.y;
  const dX21 = Cv.x - B.x, dY12 = B.y - Cv.y;
  const D = dY12 * (A.x - Cv.x) + dX21 * (A.y - Cv.y);
  const s = dY12 * dX + dX21 * dY;
  const t = (Cv.y - A.y) * dX + (A.x - Cv.x) * dY;
  const u = s / D, v = t / D, w = 1 - u - v;

  if (u >= 0 && v >= 0 && w >= 0) return { x: px, y: py }; // already inside

  // Find nearest point on each edge and return closest
  const clampEdge = (p1, p2) => {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return p1;
    const t = Math.max(0, Math.min(1, ((px - p1.x) * dx + (py - p1.y) * dy) / len2));
    return { x: p1.x + t * dx, y: p1.y + t * dy };
  };

  const candidates = [
    clampEdge(A, B),
    clampEdge(B, Cv),
    clampEdge(Cv, A),
  ];
  let best = candidates[0];
  let bestD = dist(px, py, best.x, best.y);
  for (const c of candidates.slice(1)) {
    const d = dist(px, py, c.x, c.y);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

function triangleType(a, b, c) {
  const sorted = [a, b, c].sort((x, y) => x - y);
  if (sorted[0] === sorted[1] && sorted[1] === sorted[2]) return "equilateral";
  if (sorted[0] === sorted[1] || sorted[1] === sorted[2]) return "isosceles";
  return "scalene";
}

// ── Map SVG ───────────────────────────────────────────────────────────────
function MapSVG({ youX, youY, onDrag }) {
  const [dragging, setDragging] = useState(false);

  const getRawPos = (e) => {
    const svg = e.currentTarget.closest("svg") || e.target.closest("svg");
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const raw = {
      x: ((clientX - rect.left) / rect.width)  * W,
      y: ((clientY - rect.top)  / rect.height) * H,
    };
    return clampToTriangle(raw.x, raw.y, MASTS);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", display: "block", cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={e => { setDragging(true); onDrag(getRawPos(e)); }}
      onMouseMove={e => { if (dragging) onDrag(getRawPos(e)); }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchStart={e => { setDragging(true); onDrag(getRawPos(e)); }}
      onTouchMove={e => { e.preventDefault(); if (dragging) onDrag(getRawPos(e)); }}
      onTouchEnd={() => setDragging(false)}
    >
      {/* Background */}
      <rect x={0} y={0} width={W} height={H} fill="#f0f9ff" rx={8} />
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1={0} y1={i*H/8} x2={W} y2={i*H/8} stroke="#bfdbfe" strokeWidth={0.5} />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`v${i}`} x1={i*W/10} y1={0} x2={i*W/10} y2={H} stroke="#bfdbfe" strokeWidth={0.5} />
      ))}

      {/* Signal radius circles */}
      {MASTS.map(m => (
        <circle key={`r${m.id}`} cx={m.x} cy={m.y}
          r={dist(m.x, m.y, youX, youY)}
          fill="none" stroke={m.color} strokeWidth={1} strokeDasharray="4,4" opacity={0.35} />
      ))}

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

      {/* Masts */}
      {MASTS.map(m => (
        <g key={m.id}>
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

// ── Explore tab ───────────────────────────────────────────────────────────
function ExploreTab() {
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
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          📱 How does your phone know where you are?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Your phone connects to phone masts. One mast alone can't pinpoint you —
          it only knows your distance, not your direction. Three masts together
          form a triangle and locate you exactly. This is called <strong>triangulation</strong>.
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

      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "0 0 8px", fontWeight: "600" }}>
          👆 Drag YOU inside the triangle — you can't escape the masts!
        </p>
        <MapSVG youX={pos.x} youY={pos.y} onDrag={setPos} />
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <AngleBadge label="At Mast A" deg={angleA} color={C.accent} />
        <AngleBadge label="At Mast B" deg={angleB} color={C.amber}  />
        <AngleBadge label="At Mast C" deg={angleC} color={C.purple} />
      </div>

      <div style={{ background: typeInfo.color + "15", border: `1.5px solid ${typeInfo.color}40`,
        borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: typeInfo.color, margin: "0 0 4px" }}>
          Triangle type: {typeInfo.label}
        </p>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>{typeInfo.text}</p>
      </div>

      <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
        borderRadius: "10px", padding: "12px 14px" }}>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          ⭐ <strong>Exam connection:</strong> The angles at YOUR location always add up to 360°
          — angles around a point. Notice how moving you changes the triangle type between
          scalene, isosceles and equilateral.
        </p>
      </div>
    </div>
  );
}

// ── Spot the Angle tab ────────────────────────────────────────────────────
// Three scenario questions using the angle rules taught in Learn.
// Each has a fixed diagram based on the mast triangle.

// ── Scenario 1 diagram ────────────────────────────────────────────────────
// Triangle: Mast A (top-left), Mast B (top-right), YOU (bottom-centre).
// Mast A–YOU = Mast B–YOU (equal sides, tick marks shown).
// Known: angle at Mast A = 48°. Unknown: angle x at Mast B.
// Angle at YOU = 180 − 48 − 48 = 84° (not asked, but geometrically correct).
function S1Diagram({ showAnswer }) {
  const A   = { x: 60,  y: 50  };
  const B   = { x: 260, y: 50  };
  const YOU = { x: 160, y: 210 };
  return (
    <svg viewBox="0 0 320 250" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={250} fill="#f0f9ff" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" />
      {/* Tick marks on the two equal sides (A–YOU and B–YOU) */}
      <SideTicks p1={A}   p2={YOU} count={2} colour={C.accent} />
      <SideTicks p1={B}   p2={YOU} count={2} colour={C.accent} />
      {/* Known angle at A */}
      <text x={A.x + 32} y={A.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>48°</text>
      {/* Unknown angle at B */}
      <text x={B.x - 32} y={B.y + 22} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "48°" : "x°"}
      </text>
      {/* Angle at YOU (not the question — shown dimly for context) */}
      <text x={YOU.x} y={YOU.y - 16} textAnchor="middle" fontSize={11} fontWeight="600" fill={C.border}>84°</text>
      {/* Labels */}
      <text x={A.x - 4}   y={A.y - 10}   textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}   y={B.y - 10}   textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>Mast B</text>
      <circle cx={YOU.x} cy={YOU.y} r={7} fill={C.green} />
      <text x={YOU.x} y={YOU.y + 20} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.green}>YOU</text>
    </svg>
  );
}

// ── Scenario 2 diagram ────────────────────────────────────────────────────
// Triangle: Mast A (top-left), Mast B (top-right), Mast C (bottom-centre).
// Known: 64° at A, 72° at B. Unknown: x° at C. Sum = 180°, so x = 44°.
function S2Diagram({ showAnswer }) {
  const A  = { x: 60,  y: 50  };
  const B  = { x: 260, y: 50  };
  const Cv = { x: 160, y: 210 };
  return (
    <svg viewBox="0 0 320 250" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={250} fill="#f0f9ff" rx={8} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill={C.accentDim} stroke="none" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" />
      {/* Known angles */}
      <text x={A.x + 32} y={A.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>64°</text>
      <text x={B.x - 32} y={B.y + 22} textAnchor="middle" fontSize={13} fontWeight="800" fill={C.amber}>72°</text>
      {/* Unknown at C */}
      <text x={Cv.x} y={Cv.y - 16} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "44°" : "x°"}
      </text>
      {/* Labels */}
      <text x={A.x - 4}   y={A.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}   y={B.y - 10}  textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>Mast B</text>
      <text x={Cv.x}      y={Cv.y + 20} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.purple}>Mast C</text>
    </svg>
  );
}

// ── Scenario 3 diagram ────────────────────────────────────────────────────
// A phone engineer needs to check the angle of Mast C's coverage zone.
// The triangle Mast A – Mast B – YOU is isosceles (YOU equidistant from A and B).
// This lets us find angle ABY (at Mast B in the small triangle).
// That same angle ABY is part of the larger triangle Mast A – Mast B – Mast C,
// so angle ABC (at Mast B in the large triangle) = angle ABY = 64°.
// Large triangle: angle at Mast A = 48°, angle at Mast B = 64°, x at Mast C.
//
// Layout: keep the two triangles clearly separate.
// Small isosceles triangle: top-left (A–B–YOU, amber).
// Large triangle: A–B–C where C is to the right (blue).
// Mast B is shared — the angle at B carries across.
function S3Diagram({ showAnswer }) {
  // Small isosceles triangle: Mast A (left), Mast B (right), YOU (below between them)
  const A   = { x: 45,  y: 55  };
  const B   = { x: 175, y: 55  };
  const YOU = { x: 110, y: 160 };
  // Large outer triangle: same A and B, Mast C far right
  const Cv  = { x: 285, y: 160 };

  return (
    <svg viewBox="0 0 320 210" style={{ width: "100%", display: "block" }}>
      <rect width={320} height={210} fill="#f0f9ff" rx={8} />

      {/* Large triangle fill: A–B–C (blue, drawn first so amber sits on top) */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
        fill={C.accentDim} stroke="none" opacity={0.6} />

      {/* Small isosceles triangle fill: A–B–YOU (amber) */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${YOU.x},${YOU.y}`}
        fill={C.amberDim} stroke="none" opacity={0.8} />

      {/* Large triangle sides */}
      <line x1={A.x}  y1={A.y}  x2={Cv.x} y2={Cv.y} stroke={C.accent} strokeWidth={1.5} strokeDasharray="5,3" strokeLinecap="round" />
      <line x1={B.x}  y1={B.y}  x2={Cv.x} y2={Cv.y} stroke={C.accent} strokeWidth={2}   strokeLinecap="round" />
      <line x1={A.x}  y1={A.y}  x2={B.x}  y2={B.y}  stroke={C.accent} strokeWidth={2}   strokeLinecap="round" />

      {/* Small isosceles triangle sides */}
      <line x1={A.x}   y1={A.y}   x2={YOU.x} y2={YOU.y} stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
      <line x1={B.x}   y1={B.y}   x2={YOU.x} y2={YOU.y} stroke={C.amber} strokeWidth={2} strokeLinecap="round" />

      {/* Equal side tick marks */}
      <SideTicks p1={A}   p2={YOU} count={2} colour={C.amber} />
      <SideTicks p1={B}   p2={YOU} count={2} colour={C.amber} />

      {/* ── Angle labels ── */}

      {/* Mast A: 58° — inside isosceles triangle (amber) */}
      <text x={A.x + 34} y={A.y + 22} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.amber}>58°</text>

      {/* Mast A: 48° — inside large triangle (blue), offset lower */}
      <text x={A.x + 52} y={A.y + 42} textAnchor="middle" fontSize={12} fontWeight="800" fill={C.accent}>48°</text>

      {/* Mast B: ? or 64° — the angle carried across from step 1 */}
      <text x={B.x - 16} y={B.y + 24} textAnchor="middle" fontSize={12} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "64°" : "?°"}
      </text>

      {/* Mast C: x° */}
      <text x={Cv.x - 12} y={Cv.y - 14} textAnchor="middle" fontSize={13} fontWeight="800"
        fill={showAnswer ? C.green : C.muted}>
        {showAnswer ? "68°" : "x°"}
      </text>

      {/* Step label for YOU angle (not asked, greyed) */}
      <text x={YOU.x} y={YOU.y - 12} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.border}>64°</text>

      {/* Vertex labels */}
      <text x={A.x - 6}   y={A.y - 10}  textAnchor="middle" fontSize={11} fontWeight="800" fill={C.accent}>Mast A</text>
      <text x={B.x + 4}   y={B.y - 10}  textAnchor="middle" fontSize={11} fontWeight="800" fill={C.amber}>Mast B</text>
      <circle cx={YOU.x} cy={YOU.y} r={6} fill={C.green} />
      <text x={YOU.x}     y={YOU.y + 18} textAnchor="middle" fontSize={10} fontWeight="800" fill={C.green}>YOU</text>
      <text x={Cv.x + 8}  y={Cv.y + 16} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.purple}>Mast C</text>
    </svg>
  );
}

// ── Scenario data ─────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "s1",
    badge: "Isosceles",
    badgeColour: C.amber,
    Diagram: S1Diagram,
    hook: "You are equidistant from Mast A and Mast B — the two dashed lines to you are the same length. This makes triangle Mast A – Mast B – YOU isosceles.",
    question: "The angle at Mast A = 48°. Find angle x at Mast B.",
    answer: 48,
    reason: "Base angles of an isosceles triangle are equal",
    working: "Mast A–YOU = Mast B–YOU, so the triangle is isosceles.\nBase angles at Mast A and Mast B are equal.\nx = 48°",
    hint: "When two sides of a triangle are equal, what can you say about the base angles?",
  },
  {
    id: "s2",
    badge: "Triangle sum",
    badgeColour: C.accent,
    Diagram: S2Diagram,
    hook: "The three masts form a triangle. A surveyor has measured two of the angles — can you find the third?",
    question: "The triangle formed by Mast A, Mast B and Mast C has angles 64° at A, 72° at B, and x° at C. Find x.",
    answer: 44,
    reason: "Angles in a triangle add up to 180°",
    working: "64 + 72 + x = 180°\n136 + x = 180°\nx = 180 − 136 = 44°",
    hint: "The interior angles of any triangle always sum to the same total. What is it?",
  },
  {
    id: "s3",
    badge: "Multi-step",
    badgeColour: C.purple,
    Diagram: S3Diagram,
    hook: "A phone engineer is planning a new Mast C and needs to calculate angle x — the coverage angle at Mast C — to check the signal reaches the right area. Two steps are needed.",
    question: "Step 1: The amber triangle (Mast A – Mast B – YOU) is isosceles, with equal sides from A and B to YOU. The angle at Mast A = 58°. Use this to find the angle at Mast B.\n\nStep 2: Use the angle at Mast B you just found in the larger blue triangle (Mast A – Mast B – Mast C), where the angle at Mast A = 48°. Find angle x at Mast C.",
    answer: 68,
    reason: "Step 1: Base angles of an isosceles triangle are equal. Step 2: Angles in a triangle add up to 180°.",
    working: "Step 1: angle at Mast B = 180 − 58 − 58 = 64°  (isosceles base angles equal, triangle sum)\nStep 2: 48 + 64 + x = 180°\nx = 180 − 112 = 68°",
    hint: "Work inside the amber triangle first. The angle at Mast B there equals the angle at Mast A (58°)... wait, does it? Check: if both base angles are 58°, what does the angle at Mast B come out as using the triangle sum?",
  },
];

function SpotTheAngle() {
  const [idx,     setIdx]     = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);
  const [showHint, setShowHint] = useState(false);

  const sc      = SCENARIOS[idx];
  const isRight = parseInt(input, 10) === sc.answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => {
    if (idx + 1 >= SCENARIOS.length) setDone(true);
    else { setIdx(i => i + 1); setInput(""); setChecked(false); setShowHint(false); }
  };
  const handleRestart = () => { setIdx(0); setInput(""); setChecked(false); setScore(0); setDone(false); setShowHint(false); };

  if (done) {
    const pct = Math.round((score / SCENARIOS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{SCENARIOS.length} correct
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100 ? "All three — the masts are impressed." : "Real-world angle problems solved with real rules!"}
        </p>
        <button onClick={handleRestart} style={{
          padding: "12px 28px", borderRadius: "10px", border: "none",
          background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
        }}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{
          fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px",
          background: sc.badgeColour + "20", color: sc.badgeColour,
          border: `1px solid ${sc.badgeColour}40`,
        }}>{sc.badge}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {idx + 1}/{SCENARIOS.length}
        </span>
      </div>

      {/* Context hook */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          🗺️ {sc.hook}
        </p>
      </div>

      {/* Diagram */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
        <sc.Diagram showAnswer={checked} />
      </div>

      {/* Question */}
      <div style={{ background: C.accentDim, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        {sc.question.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: C.text, margin: i > 0 ? "8px 0 0" : 0, lineHeight: 1.6 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Hint */}
      {!checked && (
        <button onClick={() => setShowHint(h => !h)} style={{
          background: "none", border: "none", color: C.amber,
          fontSize: "12px", fontWeight: "700", cursor: "pointer",
          padding: "0 0 10px", textDecoration: "underline",
        }}>
          {showHint ? "Hide hint ▲" : "Show hint ▾"}
        </button>
      )}
      {showHint && !checked && (
        <div style={{ background: C.amberDim, border: `1px solid ${C.amber}30`,
          borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
          <p style={{ fontSize: "12px", color: C.text, margin: 0 }}>💡 {sc.hint}</p>
        </div>
      )}

      {/* Input */}
      {!checked && (
        <>
          <MiniCalc label="Calculator" />
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", marginTop: "10px" }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            placeholder="Your answer (degrees)"
            style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
              border: `1.5px solid ${C.border}`, fontSize: "16px",
              color: C.text, outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={handleCheck} style={{
            padding: "12px 20px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>Check</button>
          </div>
        </>
      )}

      {/* Feedback */}
      {checked && (
        <div>
          <div style={{
            background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "8px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 6px" }}>
              {isRight ? `✓ Correct! x = ${sc.answer}°` : `✗ The answer is ${sc.answer}°`}
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 4px", fontWeight: "700" }}>
              Reason: <span style={{ color: C.text, fontWeight: "400" }}>{sc.reason}</span>
            </p>
            {sc.working.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: "12px", color: C.text, margin: i > 0 ? "4px 0 0" : 0, fontFamily: "monospace" }}>
                {line}
              </p>
            ))}
          </div>
          <button onClick={handleNext} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>
            {idx + 1 >= SCENARIOS.length ? "See my score →" : "Next scenario →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
const TABS = [
  { id: "explore", label: "🗺️ Explore"       },
  { id: "spot",    label: "🎯 Spot the angle" },
];

export default function RealWorldTriangles() {
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <div>
      <div style={{ display: "flex", gap: "4px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "10px",
        padding: "4px", marginBottom: "20px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "9px 6px", borderRadius: "7px", border: "none",
            cursor: "pointer", fontSize: "13px", fontWeight: "600",
            transition: "all 0.15s",
            background: activeTab === t.id ? C.accent : "transparent",
            color:      activeTab === t.id ? "#fff"   : C.muted,
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "explore" && <ExploreTab />}
      {activeTab === "spot"    && <SpotTheAngle />}
    </div>
  );
}