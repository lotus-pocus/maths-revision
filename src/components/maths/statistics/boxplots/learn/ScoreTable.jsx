import React, { useState } from "react";
import { C } from "../data";

export default function ScoreTable({ allScores }) {
  const [expanded, setExpanded] = useState(false);

  const specialPos = {
    1: { label: "Min", color: C.muted },
    15: { label: "Q1", color: C.accent },
    16: { label: "Q1", color: C.accent },
    30: { label: "Median", color: C.text },
    31: { label: "Median", color: C.text },
    45: { label: "Q3", color: C.accent },
    46: { label: "Q3", color: C.accent },
    60: { label: "Max", color: C.muted },
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          background: expanded ? C.accentDim : C.surface,
          border: `1px solid ${expanded ? C.accent : C.border}`,
          borderRadius: "12px",
          padding: "12px 16px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: expanded ? C.accent : C.text, margin: 0 }}>
            📋 All 60 scores - sorted lowest to highest
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>
            This is what the teacher collated. Tap to see the full table.
          </p>
        </div>
        <span style={{ fontSize: "12px", color: C.muted }}>
          {expanded ? "▲ Hide" : "▼ Show"}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            marginTop: "8px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              background: "#f9fafb",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: C.accent,
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              How the quartiles are calculated
            </p>

            <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
              With 60 values (an even number), the median = average of positions 30 and 31 = (50 + 52) ÷ 2 = 51.
              <br />
              Q1 = average of positions 15 and 16 = (38 + 39) ÷ 2 = 38.5.
              <br />
              Q3 = average of positions 45 and 46 = (61 + 62) ÷ 2 = 61.5.
            </p>
          </div>

          <div
            style={{
              padding: "16px 12px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {allScores.map((score, i) => {
              const pos = i + 1;
              const sp = specialPos[pos];

              return (
                <div
                  key={i}
                  style={{
                    minWidth: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: sp ? C.accentDim : "transparent",
                    border: `1.5px solid ${sp ? sp.color : C.border}`,
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: sp ? "800" : "500", color: sp ? sp.color : C.text }}>
                    {score}
                  </span>

                  <span style={{ fontSize: "8px", color: C.muted }}>#{pos}</span>

                  {sp && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-14px",
                        fontSize: "8px",
                        fontWeight: "700",
                        color: sp.color,
                        background: "#fff",
                        padding: "0 2px",
                        borderRadius: "3px",
                      }}
                    >
                      {sp.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}