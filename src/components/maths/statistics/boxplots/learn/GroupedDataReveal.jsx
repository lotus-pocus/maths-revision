import React from "react";
import { C } from "../data";
import Reveal from "./Reveal";

export default function GroupedDataReveal() {
  return (
    <Reveal label="📋 What if data is in a frequency table? (grouped data)">
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
        With a frequency table, you don't know exact values — only which interval they fall in. Here's what that looks like:
      </p>

      {/* Example frequency table */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{ padding: "8px 12px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            Example — daily steps (thousands) for 40 people
          </p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {["Interval", "Frequency", "Cumulative freq."].map(h => (
                <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: C.muted, fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { interval: "0 < s ≤ 2",   freq: 2,  cum: 2,  isFirst: true  },
              { interval: "2 < s ≤ 4",   freq: 4,  cum: 6  },
              { interval: "4 < s ≤ 6",   freq: 5,  cum: 11 },
              { interval: "6 < s ≤ 8",   freq: 7,  cum: 18 },
              { interval: "8 < s ≤ 10",  freq: 8,  cum: 26 },
              { interval: "10 < s ≤ 12", freq: 6,  cum: 32 },
              { interval: "12 < s ≤ 14", freq: 5,  cum: 37 },
              { interval: "14 < s ≤ 16", freq: 3,  cum: 40, isLast: true   },
            ].map((row, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${C.border}`,
                background: row.isFirst ? "#ecfdf5" : row.isLast ? "#eff6ff" : "transparent",
              }}>
                <td style={{ padding: "7px 10px", fontWeight: row.isFirst || row.isLast ? "700" : "400", color: row.isFirst ? "#059669" : row.isLast ? "#2563eb" : C.text }}>
                  {row.interval}
                  {row.isFirst && <span style={{ fontSize: "10px", fontWeight: "700", color: "#059669", marginLeft: "6px" }}>← Min row</span>}
                  {row.isLast  && <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563eb", marginLeft: "6px" }}>← Max row</span>}
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", color: C.muted }}>{row.freq}</td>
                <td style={{ padding: "7px 10px", textAlign: "center", color: C.muted }}>{row.cum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Annotations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
        <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "10px 12px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#059669", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Min</p>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#059669", margin: "0 0 4px" }}>= 1 thousand</p>
          <p style={{ fontSize: "11px", color: "#065f46", margin: 0, lineHeight: 1.5 }}>
            First interval is <strong>0 &lt; s ≤ 2</strong>. We use 1 as our estimate — just above the lower boundary of 0.
          </p>
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: "8px", padding: "10px 12px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Max</p>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#2563eb", margin: "0 0 4px" }}>= 16 thousand</p>
          <p style={{ fontSize: "11px", color: "#1e3a8a", margin: 0, lineHeight: 1.5 }}>
            Last interval is <strong>14 &lt; s ≤ 16</strong>. Upper boundary = <strong>16</strong>.
          </p>
        </div>
      </div>

      {/* The rule */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>The rule to remember</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
            <strong>Min</strong> = estimate from the lower boundary of the first interval (use the midpoint or just above 0)
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
            <strong>Max</strong> = upper boundary of the last interval
          </p>
        </div>
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px" }}>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
          ⭐ <strong>Exam tip:</strong> Q1, Median and Q3 come from the cumulative frequency column as usual. Min and max are the only values that use interval boundaries.
        </p>
      </div>
    </Reveal>
  );
}