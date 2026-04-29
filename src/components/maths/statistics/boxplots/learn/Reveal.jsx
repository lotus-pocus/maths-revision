import React, { useState } from "react";
import { C } from "../data";

export default function Reveal({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: open ? C.accentDim : C.surface,
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "700", color: open ? C.accent : C.text }}>
          {label}
        </span>
        <span style={{ fontSize: "12px", color: C.muted }}>
          {open ? "▲ Hide" : "▼ Show"}
        </span>
      </button>

      {open && (
        <div style={{ padding: "14px", background: C.accentDim, borderTop: `1px solid ${C.border}` }}>
          {children}
        </div>
      )}
    </div>
  );
}