import React from "react";

// score: "correct" | "struggled" | "not_attempted"
export default function ScoreDot({ score }) {
  const styles = {
    correct:       { bg: "#059669", title: "Correct"       },
    struggled:     { bg: "#f59e0b", title: "Needs practice" },
    not_attempted: { bg: "#d1d5db", title: "Not attempted"  },
  };
  const s = styles[score] || styles.not_attempted;
  return (
    <div
      title={s.title}
      style={{
        width: "10px", height: "10px",
        borderRadius: "50%",
        background: s.bg,
        flexShrink: 0,
        boxShadow: score !== "not_attempted" ? `0 0 0 2px ${s.bg}30` : "none",
      }}
    />
  );
}