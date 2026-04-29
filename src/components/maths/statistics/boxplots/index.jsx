import { useState } from "react";
import { C } from "./data";
import Learn    from "./Learn";
import RealWorld from "./RealWorld";
import BuildIt   from "./BuildIt";
import Exam      from "./Exam";

export default function BoxPlotVisualiser() {
  const [mode, setMode] = useState("learn");

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "8px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: C.accent, margin: "0 0 6px" }}>
            Statistics · Box Plots
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: C.text, margin: "0 0 6px", lineHeight: 1.2 }}>
            Box Plot Explorer
          </h1>
          <p style={{ fontSize: "15px", color: C.muted, margin: 0 }}>
            Learn what they are, see them in the real world, then practise exam questions
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", background: C.surface, borderRadius: "12px", padding: "5px", boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
          {[
            { id: "learn",    label: "📖 Learn" },
            { id: "hospital", label: "🌍 Real World" },
            { id: "build",    label: "🎯 Build It" },
            { id: "exam",     label: "📝 Exam" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                flex: 1, padding: "9px 4px",
                background: mode === id ? C.accent : "transparent",
                color: mode === id ? "#fff" : C.muted,
                border: "none", borderRadius: "8px",
                fontSize: "12px", fontWeight: "600",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {mode === "learn"    && <Learn />}
        {mode === "hospital" && <RealWorld />}
        {mode === "build"    && <BuildIt />}
        {mode === "exam"     && <Exam />}

      </div>
    </div>
  );
}