// ── GeomSVG ───────────────────────────────────────────────────────────────
// Consistent SVG canvas wrapper for all geometry diagrams.
// Gives every diagram the same background, sizing behaviour and overflow.
//
// Props:
//   width       — viewBox width (default 320)
//   height      — viewBox height (default 240)
//   maxWidth    — max rendered width in px (default "100%")
//   background  — fill colour (default "#f8f7f4")
//   children    — SVG content

export default function GeomSVG({
  width = 320,
  height = 240,
  maxWidth = "100%",
  background = "#f8f7f4",
  children,
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: maxWidth, display: "block", overflow: "visible" }}
    >
      <rect width={width} height={height} fill={background} rx={8} />
      {children}
    </svg>
  );
}