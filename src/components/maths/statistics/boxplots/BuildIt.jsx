import { useState } from "react";
import { C, BUILD_QUESTIONS } from "./data";
import StageReadGraph from "./buildIt/StageReadGraph";
import StageOrder     from "./buildIt/StageOrder";
import StageFive      from "./buildIt/StageFive";
import StageDrag      from "./buildIt/StageDrag";

const STAGES = [
  { n: 0, label: "Graph",       color: C.purple },
  { n: 1, label: "Order It",    color: C.accent },
  { n: 2, label: "Find Values", color: C.accent },
  { n: 3, label: "Place It",    color: C.accent },
];

function StageBar({ stage }) {
  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
      {STAGES.map(({ n, label, color }) => (
        <div key={n} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", background: stage >= n ? (stage === n ? color : color + "30") : C.surface, border: `1px solid ${stage >= n ? color : C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: stage >= n ? (stage === n ? C.bg : color) : C.muted, margin: 0, lineHeight: 1.3 }}>{n === 0 ? "📈" : n}. {label}</p>
        </div>
      ))}
    </div>
  );
}

export default function BuildIt() {
  const [qIdx,  setQIdx]  = useState(null);
  const [stage, setStage] = useState(0); // 0=graph, 1=order, 2=find values, 3=place

  const q = qIdx !== null ? BUILD_QUESTIONS[qIdx] : null;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goStage   = (n) => { setStage(n); scrollTop(); };

  if (qIdx === null) {
    return (
      <div>
        {/* What is this section for? */}
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
          borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>
            🎯 What are you learning to do?
          </p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 8px" }}>
            In the exam, you'll be given a set of data and asked to <strong>draw a box plot</strong> from scratch. That means finding the five key values — minimum, Q1, median, Q3, maximum — and placing them accurately on a number line.
          </p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
            This section walks you through every step of that process, starting with reading a cumulative frequency graph, just like in the real Edexcel paper.
          </p>
        </div>

        {/* 4 stages explainer */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
            Each question has 4 stages:
          </p>
          {[
            { icon: "📈", label: "Read the graph",    desc: "Read Q1, Median and Q3 off a cumulative frequency graph" },
            { icon: "1️⃣",  label: "Order the data",   desc: "Sort the raw values from smallest to largest" },
            { icon: "🔢", label: "Find the values",   desc: "Identify Min, Q1, Median, Q3 and Max" },
            { icon: "📦", label: "Build the box plot", desc: "Drag the values into place on a number line" },
          ].map(({ icon, label, desc }) => (
            <div key={label} style={{ display: "flex", gap: "10px", padding: "7px 0",
              borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
              <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Question list */}
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
          Choose a question
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BUILD_QUESTIONS.map((bq, i) => (
            <button key={bq.id} onClick={() => { setQIdx(i); setStage(0); scrollTop(); }}
              style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: "12px", cursor: "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px",
                  borderRadius: "99px", marginRight: "10px",
                  color: i === 0 ? C.accent : i === 1 ? C.amber : C.red,
                  border: `1px solid ${i === 0 ? C.accent : i === 1 ? C.amber : C.red}40` }}>
                  {bq.label}
                </span>
                <span style={{ fontSize: "13px", color: C.text }}>{bq.question}</span>
              </span>
              <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>→</span>
            </button>
          ))}
        </div>

        {/* Exam connection tip */}
        <div style={{ background: "#fffbeb", border: "1px solid #d97706",
          borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
          <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
            ⭐ <strong>Exam tip:</strong> Each question starts with a cumulative frequency graph — the same type used in Q8 and Q9 of the Edexcel paper. Getting comfortable reading these graphs is one of the highest-value skills you can practise.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => { setQIdx(null); scrollTop(); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>← Back to questions</button>

      {/* Context strip — always visible */}
      <div style={{ background: qIdx === 0 ? C.accentDim : qIdx === 1 ? "#fffbeb" : "#fef2f2", border: `1.5px solid ${qIdx === 0 ? C.accent : qIdx === 1 ? C.amber : C.red}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px", flexShrink: 0,
          color: qIdx === 0 ? C.accent : qIdx === 1 ? C.amber : C.red,
          border: `1.5px solid ${qIdx === 0 ? C.accent : qIdx === 1 ? C.amber : C.red}`,
          background: "#fff",
        }}>{q.label}</span>
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0, lineHeight: 1.5 }}>{q.question}</p>
      </div>

      <StageBar stage={stage} />
      {stage === 0 && <StageReadGraph q={q} onBack={() => { setQIdx(null); goStage(0); }} onComplete={() => goStage(1)} />}
      {stage === 1 && <StageOrder     q={q} onBack={() => goStage(0)}                    onComplete={() => goStage(2)} />}
      {stage === 2 && <StageFive      q={q} onBack={() => goStage(1)}                    onComplete={() => goStage(3)} />}
      {stage === 3 && <StageDrag      q={q} onBack={() => goStage(2)} />}
    </div>
  );
}