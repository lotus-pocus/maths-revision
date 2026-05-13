import { useState } from "react";

const STRAND_COLORS = {
  Statistics:  { border: "#059669", bg: "#ecfdf5", text: "#065f46", dim: "#d1fae5" },
  Geometry:    { border: "#2563eb", bg: "#eff6ff", text: "#1e40af", dim: "#dbeafe" },
  Algebra:     { border: "#7c3aed", bg: "#f5f3ff", text: "#4c1d95", dim: "#ede9fe" },
  Number:      { border: "#d97706", bg: "#fffbeb", text: "#78350f", dim: "#fef3c7" },
  Probability: { border: "#db2777", bg: "#fdf2f8", text: "#831843", dim: "#fce7f3" },
  Ratio:       { border: "#0891b2", bg: "#ecfeff", text: "#164e63", dim: "#cffafe" },
};

export default function FormulaCard({ formula, strand, topicTitle, showTopic = false, accentColor }) {
  const [open, setOpen] = useState(false);
  const sc = STRAND_COLORS[strand] || STRAND_COLORS.Statistics;
  const accent = accentColor || sc.border;
  const accentBg = accentColor ? `${accentColor}18` : sc.bg;
  const accentText = accentColor || sc.text;

  return (
    <div style={{
      border: `1px solid ${accent}40`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: "10px",
      background: "#fff",
      overflow: "hidden",
      marginBottom: "8px",
    }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "11px 14px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>{formula.name}</span>
            {showTopic && topicTitle && (
              <span style={{
                fontSize: "10px", fontWeight: "600", padding: "2px 7px",
                borderRadius: "99px", background: accentBg, color: accentText,
              }}>{topicTitle}</span>
            )}
          </div>
          {/* Formula pill */}
          <div style={{
            display: "inline-block", marginTop: "4px",
            background: accentBg, border: `1px solid ${accent}30`,
            borderRadius: "6px", padding: "3px 10px",
          }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: accentText, fontFamily: "monospace" }}>
              {formula.formula}
            </span>
          </div>
        </div>
        <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{
          padding: "0 14px 14px",
          borderTop: `1px solid ${accent}20`,
          background: accentBg,
        }}>
          <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: "10px 0 8px" }}>
            {formula.plain}
          </p>
          <div style={{
            background: "#fffbeb", border: "1px solid #fcd34d",
            borderRadius: "8px", padding: "8px 12px",
          }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#78350f" }}>⭐ When to use: </span>
            <span style={{ fontSize: "12px", color: "#78350f", lineHeight: 1.5 }}>{formula.when}</span>
          </div>
        </div>
      )}
    </div>
  );
}