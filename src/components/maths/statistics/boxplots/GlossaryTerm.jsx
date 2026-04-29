import { useState, useEffect, useRef } from "react";
import { C } from "./data";

// ── Term definitions ──────────────────────────────────────────────────────
// Add any term here and it becomes tappable wherever GlossaryTerm is used.
const DEFINITIONS = {
  "Q1": {
    full: "Lower Quartile (Q1)",
    definition: "The value that marks the boundary of the bottom 25% of data. One quarter of all values fall below Q1.",
    formula: "Find the median of the lower half of the sorted data.",
    position: "Left edge of the box on a box plot.",
  },
  "Q3": {
    full: "Upper Quartile (Q3)",
    definition: "The value that marks the boundary of the top 25% of data. Three quarters of all values fall below Q3.",
    formula: "Find the median of the upper half of the sorted data.",
    position: "Right edge of the box on a box plot.",
  },
  "Median": {
    full: "Median",
    definition: "The middle value when all data is sorted lowest to highest. Exactly half the values are below it and half are above.",
    formula: "Odd count: middle value. Even count: average the two middle values.",
    position: "Vertical line inside the box on a box plot.",
  },
  "IQR": {
    full: "Interquartile Range (IQR)",
    definition: "The spread of the middle 50% of the data. A small IQR means results are consistent. A large IQR means results vary widely.",
    formula: "IQR = Q3 - Q1",
    position: "The width of the box on a box plot.",
  },
  "Range": {
    full: "Range",
    definition: "The total spread from the lowest to the highest value. Unlike IQR, one extreme result can make it look misleadingly large.",
    formula: "Range = Maximum - Minimum",
    position: "Full width of the box plot diagram.",
  },
  "Minimum": {
    full: "Minimum",
    definition: "The smallest value in the data set. Shown as the left end of the left whisker on a box plot.",
    formula: "Given directly in most exam questions.",
    position: "Left whisker end on a box plot.",
  },
  "Maximum": {
    full: "Maximum",
    definition: "The largest value in the data set. Shown as the right end of the right whisker on a box plot.",
    formula: "Given directly in most exam questions.",
    position: "Right whisker end on a box plot.",
  },
  "Cumulative frequency": {
    full: "Cumulative Frequency",
    definition: "A running total of how many values fall at or below each point. Plotted as an S-shaped curve used to read off the median and quartiles in exam questions.",
    formula: "Add up frequencies from the bottom row upwards.",
    position: "Y-axis of a cumulative frequency graph.",
  },
};

// ── The component ─────────────────────────────────────────────────────────
export default function GlossaryTerm({ term, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const def = DEFINITIONS[term];

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  if (!def) return <span>{children || term}</span>;

  return (
    <span ref={ref} style={{ position: "relative", display: "inline" }}>
      {/* Highlighted tappable term */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "inline",
          background: open ? C.accent : C.accentDim,
          color: C.accent,
          border: `1px solid ${C.accent}60`,
          borderRadius: "4px",
          padding: "1px 5px",
          fontSize: "inherit",
          fontWeight: "700",
          fontFamily: "inherit",
          cursor: "pointer",
          lineHeight: "inherit",
          verticalAlign: "baseline",
          transition: "background 0.15s",
          whiteSpace: "nowrap",
        }}
        aria-expanded={open}
        aria-label={`Definition of ${term}`}
      >
        {children || term}
      </button>

      {/* Definition popup */}
      {open && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            width: "260px",
            background: "#fff",
            border: `2px solid ${C.accent}`,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            display: "block",
          }}
        >
          {/* Arrow */}
          <span style={{
            position: "absolute",
            top: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: `8px solid ${C.accent}`,
          }} />

          <span style={{ display: "block", padding: "12px 14px" }}>
            {/* Header */}
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: C.accent }}>{def.full}</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer",
                  color: C.muted, fontSize: "16px", lineHeight: 1, padding: "0 0 0 8px" }}
                aria-label="Close definition"
              >×</button>
            </span>

            {/* Definition */}
            <span style={{ display: "block", fontSize: "12px", color: "#1a1a2e", lineHeight: 1.65, marginBottom: "8px" }}>
              {def.definition}
            </span>

            {/* Formula */}
            <span style={{ display: "block", background: C.accentDim, borderRadius: "6px",
              padding: "6px 10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: C.accent,
                textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "2px" }}>
                Formula
              </span>
              <span style={{ fontSize: "12px", color: "#1a1a2e", fontWeight: "600" }}>{def.formula}</span>
            </span>

            {/* Position on box plot */}
            <span style={{ display: "block", fontSize: "11px", color: "#6b7280", fontStyle: "italic" }}>
              📍 {def.position}
            </span>
          </span>
        </span>
      )}
    </span>
  );
}