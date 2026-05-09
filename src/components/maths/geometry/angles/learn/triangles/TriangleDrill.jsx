import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import { TriangleSVG } from "../../shared/TriangleSVG";
import MiniCalc from "../../../../shared/MiniCalc";

// ── Drill questions ───────────────────────────────────────────────────────
const QUESTIONS = [
  { a: 70,  b: 55,  type: "scalene",     label: "Angle sum" },
  { a: 90,  b: 35,  type: "right",       label: "Angle sum" },
  { a: 50,  b: 50,  type: "isosceles",   label: "Isosceles" },
  { a: 60,  b: 60,  type: "equilateral", label: "Equilateral" },
  { a: 110, b: 40,  type: "obtuse",      label: "Angle sum" },
  { a: 72,  b: 36,  type: "isosceles",   label: "Isosceles" },
  { a: 90,  b: 62,  type: "right",       label: "Angle sum" },
  { a: 48,  b: 75,  type: "scalene",     label: "Angle sum" },
];

function getHint(q) {
  const ans = 180 - q.a - q.b;
  if (q.type === "equilateral") return "All angles in an equilateral triangle are 60°.";
  if (q.type === "isosceles" && q.a === q.b) return `Two base angles are equal (${q.a}°). x = 180 − ${q.a} − ${q.b} = ${ans}°.`;
  if (q.type === "right") return `One angle is 90°. x = 180 − ${q.a} − ${q.b} = ${ans}°.`;
  return `Angles in a triangle sum to 180°. x = 180 − ${q.a} − ${q.b} = ${ans}°.`;
}

export default function TriangleDrill() {
  const [index,   setIndex]   = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q      = QUESTIONS[index];
  const answer = 180 - q.a - q.b;
  const isRight = parseInt(input, 10) === answer;

  const handleCheck = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext  = () => {
    if (index + 1 >= QUESTIONS.length) { setDone(true); }
    else { setIndex(i => i + 1); setInput(""); setChecked(false); }
  };
  const handleRestart = () => { setIndex(0); setInput(""); setChecked(false); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 75 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 6px" }}>
          {score}/{QUESTIONS.length}
        </p>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>
          {pct === 100 ? "Perfect — triangle angle rules are solid!" : "Keep practising — these appear in almost every geometry question."}
        </p>
        <button onClick={handleRestart}
          style={{ padding: "12px 28px", borderRadius: "10px", border: "none",
            background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280",
          background: "#eff6ff", padding: "3px 10px", borderRadius: "99px" }}>
          {q.label}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb" }}>
          {index + 1}/{QUESTIONS.length}
        </span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        <TriangleSVG
          angles={{ a: q.a, b: q.b, c: checked ? answer : null }}
          unknownAngle="x" unknownAt="c"
          colour="#2563eb" colourDim="#eff6ff"
          width={220} height={160}
        />
      </div>

      <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", margin: "0 0 12px" }}>
        Two angles of this triangle are {q.a}° and {q.b}°. Find x.
      </p>

      {!checked && (
        <div style={{ marginBottom: "12px" }}>
          <MiniCalc label="Calculator" />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input type="number" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            placeholder="Your answer"
            style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
              border: "1.5px solid #e5e7eb", fontSize: "16px", color: "#1a1a2e",
              outline: "none", boxSizing: "border-box" }} />
          <button onClick={handleCheck}
            style={{ padding: "12px 20px", borderRadius: "10px", border: "none",
              background: "#2563eb", color: "#fff", fontSize: "14px",
              fontWeight: "700", cursor: "pointer" }}>
            Check
          </button>
        </div>
        </div>
      )}

      {checked && (
        <div>
          <div style={{ background: isRight ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${isRight ? "#059669" : "#dc2626"}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? "#059669" : "#dc2626", margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : `✗ Not quite — the answer is ${answer}°`}
            </p>
            <p style={{ fontSize: "13px", color: "#1a1a2e", margin: 0, lineHeight: 1.5 }}>
              {getHint(q)}
            </p>
          </div>
          <button onClick={handleNext}
            style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              background: "#2563eb", color: "#fff", fontSize: "14px",
              fontWeight: "700", cursor: "pointer" }}>
            {index + 1 >= QUESTIONS.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}