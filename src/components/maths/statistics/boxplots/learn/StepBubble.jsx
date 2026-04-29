import React from "react";
import { C } from "../data";

export default function StepBubble({ n }) {
  return (
    <div
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        background: C.accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "800",
        flexShrink: 0,
      }}
    >
      {n}
    </div>
  );
}