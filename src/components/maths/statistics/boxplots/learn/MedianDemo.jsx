import React, { useState } from "react";
import { C } from "../data";

export default function MedianDemo() {
  const [isOdd, setIsOdd] = useState(true);
  const odd = [22, 31, 38, 45, 51, 57, 63, 71, 80];
  const even = [22, 31, 38, 45, 51, 57, 63, 71, 80, 88];
  const data = isOdd ? odd : even;
  const n = data.length;
  const midL = Math.floor((n - 1) / 2);
  const midR = Math.ceil((n - 1) / 2);
  const median = (data[midL] + data[midR]) / 2;
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {[true, false].map((o) => (
          <button
            key={String(o)}
            onClick={() => setIsOdd(o)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              border: `1.5px solid ${isOdd === o ? C.accent : C.border}`,
              background: isOdd === o ? "#fff" : "transparent",
              color: isOdd === o ? C.accent : C.muted,
            }}
          >
            {o ? "Odd - 9 values" : "Even - 10 values"}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "14px",
        }}
      >
        {data.map((v, i) => {
          const isMiddle = i === midL || i === midR;
          return (
            <div
              key={i}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: isMiddle ? "800" : "500",
                background: isMiddle ? C.accent : C.surface,
                color: isMiddle ? "#fff" : C.muted,
                border: `2px solid ${isMiddle ? C.accent : C.border}`,
                boxShadow: isMiddle ? `0 0 0 3px ${C.accentDim}` : "none",
              }}
            >
              {v}
            </div>
          );
        })}
      </div>
      {isOdd ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: C.text,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: C.accent }}>9 values (odd):</strong> the
            middle one is position 5. Median ={" "}
            <strong style={{ color: C.accent }}>{median}</strong>
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: C.text,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: C.accent }}>10 values (even):</strong>{" "}
            average positions 5 and 6. ({data[midL]} + {data[midR]}) ÷ 2 ={" "}
            <strong style={{ color: C.accent }}>{median}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
