import { C } from "../../../../../data/angles_data";

// ── QuadSVG ───────────────────────────────────────────────────────────────
// Generic polygon renderer used by SectionQuadrilaterals shape cards.
// points: array of [x, y] pairs
// labels: vertex label objects { x, y, text }
// angles: angle label objects  { x, y, text, col? }
export default function QuadSVG({
  points, colour, colourDim,
  angles, labels,
  width = 260, height = 200,
}) {
  const pts = points.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}
    >
      <polygon points={pts} fill={colourDim} stroke="none" />
      <polygon points={pts} fill="none" stroke={colour} strokeWidth={2} strokeLinejoin="round" />
      {labels && labels.map(({ x, y, text }, i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text}>
          {text}
        </text>
      ))}
      {angles && angles.map(({ x, y, text, col }, i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={11} fontWeight="700" fill={col || colour}>
          {text}
        </text>
      ))}
    </svg>
  );
}