import { useState } from "react";
import statistics from "./data/statistics";
import MathsTopicsView from "./components/MathsTopicsView";
import "./App.css";

function App() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" }}>
        Maths Revision
      </h1>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
        Edexcel GCSE · Year 10 · Higher Tier
      </p>
      <MathsTopicsView allTopics={statistics} />
    </div>
  );
}

export default App;