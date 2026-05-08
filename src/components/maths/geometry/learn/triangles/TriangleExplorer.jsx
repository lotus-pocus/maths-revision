import { useState } from "react";
import { C } from "../../../../../data/angles_data";

// ── Geometry helper: given angles A, B (C = 180-A-B), compute triangle vertices
// Scales the triangle to always fit within the viewBox with padding
function computeVertices(angleA, angleB, angleC, W, H) {
  const toRad = d => d * Math.PI / 180;
  const pad = 52;

  const sinA = Math.sin(toRad(angleA));
  const sinB = Math.sin(toRad(angleB));
  const sinC = Math.sin(toRad(angleC));

  // Relative side lengths (BC = 1)
  const c = sinC / sinA; // AB

  // Raw coords: B at origin, C at (1,0), A above
  const bx0 = 0;  const by0 = 0;
  const cx0 = 1;  const cy0 = 0;
  const ax0 = c * Math.cos(toRad(angleB));
  const ay0 = c * Math.sin(toRad(angleB));

  // Bounding box
  const minX = Math.min(bx0, cx0, ax0);
  const maxX = Math.max(bx0, cx0, ax0);
  const minY = Math.min(by0, cy0, ay0);
  const maxY = Math.max(by0, cy0, ay0);

  // Scale to fit
  const availW = W - pad * 2;
  const availH = H - pad * 2;
  const scale = Math.min(availW / (maxX - minX), availH / (maxY - minY)) * 0.72;

  // Translate so triangle is centred horizontally and base is near bottom
  // In SVG coords: y increases downward, so base (y=0 in maths) → near H-pad
  // apex (y=maxY in maths) → near pad
  const transX = (W - (maxX - minX) * scale) / 2 - minX * scale;
  const transY = H - pad; // base y in SVG coords

  const toSVG = (x, y) => [
    x * scale + transX,
    transY - y * scale,   // flip: higher maths y = lower SVG y number
  ];

  const [axF, ayF] = toSVG(ax0, ay0);
  const [bxF, byF] = toSVG(bx0, by0);
  const [cxF, cyF] = toSVG(cx0, cy0);

  return { ax: axF, ay: ayF, bx: bxF, by: byF, cx: cxF, cy: cyF };
}

// ── Dynamic triangle SVG ──────────────────────────────────────────────────
function DynamicTriangleSVG({ angleA, angleB, angleC, type, W = 340, H = 240 }) {
  const { ax, ay, bx, by, cx, cy } = computeVertices(angleA, angleB, angleC, W, H);

  const colour    = type === "isosceles" ? C.amber : type === "equilateral" ? C.green : C.accent;
  const colourDim = type === "isosceles" ? C.amberDim : type === "equilateral" ? C.greenDim : C.accentDim;
  const colB      = type === "scalene" ? C.purple : colour;
  const colC      = type === "scalene" ? C.green  : colour;
  const showTicks = type === "isosceles";

  // Arc — stays inside triangle for all angle sizes
  function Arc({ vx, vy, toP1, toP2, angleDeg, col }) {
    const d1 = Math.hypot(toP1[0] - vx, toP1[1] - vy);
    const d2 = Math.hypot(toP2[0] - vx, toP2[1] - vy);
    const shortSide = Math.min(d1, d2);

    // For obtuse angles the arc spans wide — use a smaller radius
    // For acute/right angles — scale with side length, min 5px
    const r = angleDeg > 100
      ? Math.max(5, Math.min(10, shortSide * 0.10))
      : Math.max(5, Math.min(20, shortSide * 0.22));

    const strokeW = r < 8 ? 1 : 1.5;

    const a1 = Math.atan2(-(toP1[1] - vy), toP1[0] - vx);
    const a2 = Math.atan2(-(toP2[1] - vy), toP2[0] - vx);
    let start = a1, end = a2;
    if (start > end) [start, end] = [end, start];
    let sweep = end - start;
    if (sweep > Math.PI) { sweep = 2 * Math.PI - sweep; [start, end] = [end, start + 2 * Math.PI]; }
    const large = sweep > Math.PI ? 1 : 0;
    const mid = start + sweep / 2;

    // For small acute angles — offset arc up the bisector so it stays visible
    const offset = angleDeg < 35 ? Math.max(0, r - shortSide * 0.18) : 0;
    const ocx = vx + offset * Math.cos(mid);
    const ocy = vy - offset * Math.sin(mid);

    const sx = ocx + r * Math.cos(start); const sy = ocy - r * Math.sin(start);
    const ex = ocx + r * Math.cos(end);   const ey = ocy - r * Math.sin(end);

    return (
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
        fill="none" stroke={col} strokeWidth={strokeW} strokeLinecap="round" />
    );
  }

  function Tick({ x1, y1, x2, y2 }) {
    const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
    const dx = x2 - x1; const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const px = (-dy / len) * 6; const py = (dx / len) * 6;
    return (
      <line x1={mx - px} y1={my - py} x2={mx + px} y2={my + py}
        stroke={colour} strokeWidth={1.5} strokeLinecap="round" />
    );
  }

  const lpad = 16;

  return (
    <div>
      {/* Triangle SVG — clean, no labels inside */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill={colourDim} stroke="none" />
        <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="none" stroke={C.text} strokeWidth={2} strokeLinejoin="round" />

        {showTicks && <Tick x1={ax} y1={ay} x2={bx} y2={by} />}
        {showTicks && <Tick x1={ax} y1={ay} x2={cx} y2={cy} />}
        {type === "equilateral" && <Tick x1={bx} y1={by} x2={cx} y2={cy} />}

        <Arc vx={ax} vy={ay} toP1={[bx,by]} toP2={[cx,cy]} angleDeg={angleA} col={colour} />
        <Arc vx={bx} vy={by} toP1={[ax,ay]} toP2={[cx,cy]} angleDeg={angleB} col={colB} />
        <Arc vx={cx} vy={cy} toP1={[ax,ay]} toP2={[bx,by]} angleDeg={angleC} col={colC} />

        {/* Vertex labels only */}
        <text x={ax} y={ay - lpad} textAnchor="middle" fontSize={13} fontWeight="800" fill={colour}>A</text>
        <text x={bx - lpad} y={by + 4} textAnchor="middle" fontSize={13} fontWeight="800" fill={colB}>B</text>
        <text x={cx + lpad} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight="800" fill={colC}>C</text>
      </svg>

      {/* Colour-coded legend */}
      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
        {[
          { letter: "A", deg: Math.round(angleA), col: colour,
            bg: type === "isosceles" ? C.amberDim : type === "equilateral" ? C.greenDim : C.accentDim },
          { letter: "B", deg: Math.round(angleB), col: colB,
            bg: type === "scalene" ? "#f5f3ff" : type === "isosceles" ? C.amberDim : C.greenDim },
          { letter: "C", deg: Math.round(angleC), col: colC,
            bg: type === "scalene" ? "#f0fdf4" : type === "isosceles" ? C.amberDim : C.greenDim },
        ].map(({ letter, deg, col, bg }) => (
          <div key={letter} style={{
            flex: 1, background: bg, border: `1.5px solid ${col}40`,
            borderRadius: "10px", padding: "8px 6px", textAlign: "center",
          }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: col, marginBottom: "2px" }}>
              Angle {letter}
            </div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: col, lineHeight: 1 }}>
              {deg}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Type card ─────────────────────────────────────────────────────────────
function TypeCard({ id, label, icon, colour, colourDim, description, selected, onClick }) {
  return (
    <button onClick={() => onClick(id)} style={{
      flex: 1, padding: "12px 10px", borderRadius: "12px", cursor: "pointer",
      border: `2px solid ${selected ? colour : colour + "40"}`,
      background: selected ? colourDim : "#fff",
      textAlign: "center", transition: "all 0.15s",
    }}>
      <div style={{ fontSize: "22px", marginBottom: "4px" }}>{icon}</div>
      <div style={{ fontSize: "13px", fontWeight: "700", color: colour, marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.4 }}>{description}</div>
    </button>
  );
}

// ── Main explorer ─────────────────────────────────────────────────────────
export default function TriangleExplorer() {
  const [type,   setType]   = useState("isosceles");
  const [sliderA, setSliderA] = useState(60); // apex for isosceles, angle A for scalene
  const [sliderB, setSliderB] = useState(70); // only used for scalene

  // Derived angles
  let angleA, angleB, angleC;
  if (type === "isosceles") {
    angleA = sliderA;
    angleB = (180 - sliderA) / 2;
    angleC = angleB;
  } else {
    // scalene: A and B free, C derived. Constrain so C stays > 5
    const maxB = 175 - sliderA;
    const safeB = Math.min(sliderB, maxB - 5);
    angleA = sliderA;
    angleB = safeB;
    angleC = 180 - sliderA - safeB;
  }

  const isAllSame = type === "equilateral";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 0 24px" }}>

      {/* Intro */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          📐 Just like a triangle has 3 sides, there are 3 types of triangle
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          Each type has different rules about which angles are free to change and which are
          locked together. Pick a type below and drag the slider to explore.
        </p>
      </div>

      {/* Type selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <TypeCard id="isosceles" label="Isosceles" icon="⚖️"
          colour={C.amber} colourDim={C.amberDim}
          description="2 equal sides"
          selected={type === "isosceles"} onClick={setType} />
        <TypeCard id="scalene" label="Scalene" icon="🔀"
          colour={C.accent} colourDim={C.accentDim}
          description="All sides different"
          selected={type === "scalene"} onClick={setType} />
        <TypeCard id="equilateral" label="Equilateral" icon="⬛"
          colour={C.green} colourDim={C.greenDim}
          description="All sides equal"
          selected={type === "equilateral"} onClick={setType} />
      </div>

      {/* Equilateral explainer */}
      {type === "equilateral" && (
        <div>
          <div style={{ background: C.greenDim, border: `1.5px solid ${C.green}40`,
            borderRadius: "12px", padding: "16px", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🔒</div>
            <p style={{ fontSize: "15px", fontWeight: "800", color: C.green, margin: "0 0 8px" }}>
              No slider needed!
            </p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, margin: "0 0 12px" }}>
              In an equilateral triangle all three sides are equal length — and because of that,
              all three angles are <strong>always exactly 60°</strong>. There's nothing to change.
            </p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, margin: 0 }}>
              It's the most constrained triangle — every single equilateral triangle in the world
              has the same angles. Only the size changes, never the shape.
            </p>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px" }}>
            <DynamicTriangleSVG angleA={60} angleB={60} angleC={60} type="equilateral" />
          </div>
        </div>
      )}

      {/* Isosceles explorer */}
      {type === "isosceles" && (
        <div>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <DynamicTriangleSVG angleA={angleA} angleB={angleB} angleC={angleC} type="isosceles" />
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>
              Drag the apex angle (A)
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px" }}>
              Notice the two base angles always move together — they're locked to each other
            </p>
            <input type="range" min={10} max={160} value={sliderA}
              onChange={e => setSliderA(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.amber }} />
          </div>

          <div style={{ background: C.amberDim, border: `1px solid ${C.amber}40`,
            borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
              💡 <strong>The rule:</strong> the two base angles are always equal and always move together.
              Make the apex bigger → the base angles get smaller. Make the apex tiny →
              the base angles get large. But B and C are always identical.
            </p>
          </div>
        </div>
      )}

      {/* Scalene explorer */}
      {type === "scalene" && (
        <div>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <DynamicTriangleSVG angleA={angleA} angleB={angleB} angleC={angleC} type="scalene" />
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 2px" }}>
              Drag angle A
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px" }}>
              C adjusts automatically to keep the total at 180°
            </p>
            <input type="range" min={10} max={160} value={sliderA}
              onChange={e => setSliderA(Number(e.target.value))}
              style={{ width: "100%", marginBottom: "14px", accentColor: C.accent }} />
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 2px" }}>
              Drag angle B
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px" }}>
              C adjusts automatically to keep the total at 180°
            </p>
            <input type="range" min={10} max={Math.max(11, 170 - sliderA)} value={sliderB}
              onChange={e => setSliderB(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.purple }} />
          </div>

          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
            borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
              💡 <strong>The rule:</strong> in a scalene triangle all three angles are free —
              no two need to be equal. But C is always <em>forced</em> to be whatever's left
              from 180°. You control A and B; the triangle works out C automatically.
              Try making A very large and watch C shrink!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}