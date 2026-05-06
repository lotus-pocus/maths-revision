import { useState } from "react";

// ── MiniCalc — a compact collapsible calculator ───────────────────────────
// Self-contained colours so this component works anywhere in the maths app
// without coupling to a topic-specific data.js
const MC = {
  purple:    "#7c3aed",
  purpleDim: "#f5f3ff",
  surface:   "#ffffff",
  border:    "#e5e7eb",
  text:      "#1a1a2e",
  muted:     "#6b7280",
};
// Designed to sit inline in StageFive when averaging is needed.
// Props:
//   defaultOpen — whether to start open (default false)
//   label       — button label (default "Calculator")

export default function MiniCalc({ defaultOpen = false, label = "Calculator" }) {
  const [open,    setOpen]    = useState(defaultOpen);
  const [display, setDisplay] = useState("0");
  const [stored,  setStored]  = useState(null);  // left operand
  const [op,      setOp]      = useState(null);   // pending operator
  const [fresh,   setFresh]   = useState(true);   // next digit replaces display

  const MAX_LEN = 10;

  const pressDigit = (d) => {
    setDisplay(prev => {
      if (fresh) return d === "." ? "0." : d;
      if (d === "." && prev.includes(".")) return prev;
      if (prev === "0" && d !== ".") return d;
      if (prev.replace("-", "").replace(".", "").length >= MAX_LEN) return prev;
      return prev + d;
    });
    setFresh(false);
  };

  const pressOp = (nextOp) => {
    const val = parseFloat(display);
    if (stored !== null && op && !fresh) {
      const result = calculate(stored, val, op);
      setDisplay(fmt(result));
      setStored(result);
    } else {
      setStored(val);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const pressEquals = () => {
    if (stored === null || op === null) return;
    const val = parseFloat(display);
    const result = calculate(stored, val, op);
    setDisplay(fmt(result));
    setStored(null);
    setOp(null);
    setFresh(true);
  };

  const pressClear = () => {
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  };

  const pressToggleSign = () => {
    setDisplay(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);
  };

  function calculate(a, b, operator) {
    switch (operator) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default:  return b;
    }
  }

  function fmt(n) {
    if (isNaN(n) || !isFinite(n)) return "Error";
    // Round to avoid floating point noise, keep up to 8 sig figs
    const s = parseFloat(n.toPrecision(8)).toString();
    return s.length > MAX_LEN ? parseFloat(n.toFixed(4)).toString() : s;
  }

  // Layout: rows of buttons
  const rows = [
    [
      { label: "C",   action: pressClear,           bg: "#fef2f2", color: "#dc2626", fw: "700" },
      { label: "+/−", action: pressToggleSign,       bg: MC.surface, color: MC.muted,   fw: "600" },
      { label: "÷",   action: () => pressOp("÷"),   bg: MC.purpleDim, color: MC.purple, fw: "700" },
      { label: "×",   action: () => pressOp("×"),   bg: MC.purpleDim, color: MC.purple, fw: "700" },
    ],
    [
      { label: "7", action: () => pressDigit("7") },
      { label: "8", action: () => pressDigit("8") },
      { label: "9", action: () => pressDigit("9") },
      { label: "−", action: () => pressOp("−"),     bg: MC.purpleDim, color: MC.purple, fw: "700" },
    ],
    [
      { label: "4", action: () => pressDigit("4") },
      { label: "5", action: () => pressDigit("5") },
      { label: "6", action: () => pressDigit("6") },
      { label: "+", action: () => pressOp("+"),     bg: MC.purpleDim, color: MC.purple, fw: "700" },
    ],
    [
      { label: "1", action: () => pressDigit("1") },
      { label: "2", action: () => pressDigit("2") },
      { label: "3", action: () => pressDigit("3") },
      { label: "=", action: pressEquals,            bg: MC.purple,   color: "#fff",   fw: "800", rowSpan: 2 },
    ],
    [
      { label: "0",  action: () => pressDigit("0"), wide: true },
      { label: ".",  action: () => pressDigit(".") },
    ],
  ];

  const btnStyle = ({ bg, color, fw, wide } = {}) => ({
    flex: wide ? 2 : 1,
    padding: "11px 4px",
    borderRadius: "8px",
    border: `1px solid ${MC.border}`,
    background: bg || MC.surface,
    color: color || MC.text,
    fontSize: "15px",
    fontWeight: fw || "600",
    cursor: "pointer",
    transition: "opacity 0.1s",
    minWidth: 0,
  });

  return (
    <div style={{ marginTop: "8px" }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "none", border: `1px solid ${MC.border}`,
          borderRadius: "8px", padding: "7px 12px",
          fontSize: "12px", fontWeight: "600", color: MC.muted,
          cursor: "pointer", width: "100%", justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>🧮</span>
          {label}
          {op && stored !== null && (
            <span style={{ fontSize: "11px", color: MC.purple, fontWeight: "700" }}>
              {stored} {op} …
            </span>
          )}
        </span>
        <span style={{ fontSize: "10px", color: MC.muted }}>{open ? "▲ hide" : "▼ show"}</span>
      </button>

      {/* Calculator body */}
      {open && (
        <div style={{
          marginTop: "6px",
          background: MC.surface,
          border: `1px solid ${MC.border}`,
          borderRadius: "12px",
          padding: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          {/* Display */}
          <div style={{
            background: MC.text,
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "8px",
            textAlign: "right",
            minHeight: "52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}>
            {/* Pending operation hint */}
            {op && stored !== null && (
              <p style={{ fontSize: "10px", color: "#6b7280", margin: "0 0 2px", fontFamily: "monospace" }}>
                {stored} {op}
              </p>
            )}
            <p style={{
              fontSize: display.length > 8 ? "18px" : "26px",
              fontWeight: "700",
              color: "#f9fafb",
              margin: 0,
              fontFamily: "monospace",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              {display}
            </p>
          </div>

          {/* Button grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "5px" }}>
                {row.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    style={btnStyle(btn)}
                    onPointerDown={e => e.currentTarget.style.opacity = "0.7"}
                    onPointerUp={e => e.currentTarget.style.opacity = "1"}
                    onPointerLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}