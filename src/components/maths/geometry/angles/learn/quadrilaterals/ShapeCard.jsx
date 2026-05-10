// ── ShapeCard ─────────────────────────────────────────────────────────────
// Clickable pill button for selecting a quadrilateral shape.
// shape: object from QUAD_SHAPES with { id, name, icon, colour }
export default function ShapeCard({ shape, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: "80px",
        padding: "10px 6px",
        borderRadius: "12px",
        border: `2px solid ${selected ? shape.colour : shape.colour + "40"}`,
        background: selected ? shape.colour + "18" : "#fff",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{shape.icon}</div>
      <div style={{ fontSize: "11px", fontWeight: "700", color: shape.colour }}>{shape.name}</div>
    </button>
  );
}