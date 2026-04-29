import { useState } from "react";
import { C } from "../data";

export default function FrequencyTableDropdown({ rows, label, color = C.accent }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: open ? C.accentDim : C.surface,
          border: `1px solid ${open ? color : C.border}`,
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "800", color: open ? color : C.text }}>
          Frequency table — {label}
        </span>
        <span style={{ fontSize: "12px", color: C.muted }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {open && (
        <div style={{ marginTop: "8px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: "6px", textAlign: "left", color: C.muted }}>Height</th>
                <th style={{ padding: "6px", textAlign: "center", color: C.muted }}>Frequency</th>
                <th style={{ padding: "6px", textAlign: "center", color: C.muted }}>Cumulative frequency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.interval} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "6px", color: C.text }}>{row.interval}</td>
                  <td style={{ padding: "6px", textAlign: "center", color: C.text }}>{row.freq}</td>
                  <td style={{ padding: "6px", textAlign: "center", color: C.text }}>{row.cumFreq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}