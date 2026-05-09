import { useState } from "react";
import { C } from "../../../../../../data/angles_data";
import MiniCalc from "../../../../shared/MiniCalc";
import QuadSVG  from "../../shared/QuadSVG";
import { DRILL_Qs } from "./QUAD_SHAPES";

export default function QuadDrill() {
  const [idx,     setIdx]     = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q       = DRILL_Qs[idx];
  const isRight = parseInt(input, 10) === q.answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => {
    if (idx + 1 >= DRILL_Qs.length) setDone(true);
    else { setIdx(i => i + 1); setInput(""); setChecked(false); }
  };
  const handleRestart = () => { setIdx(0); setInput(""); setChecked(false); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / DRILL_Qs.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{pct === 100 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>{score}/{DRILL_Qs.length}</p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100 ? "Perfect — quadrilateral rules nailed!" : "Keep going — 360° every time!"}
        </p>
        <button onClick={handleRestart} style={{ padding: "12px 28px", borderRadius: "10px",
          border: "none", background: C.accent, color: "#fff", fontSize: "14px",
          fontWeight: "700", cursor: "pointer" }}>Try again</button>
      </div>
    );
  }

  const diagramAngles = checked
    ? q.angleLabels.map(a =>
        a.text === "x°" ? { ...a, text: `${q.answer}°`, col: isRight ? C.green : C.red } : a
      )
    : q.angleLabels;

  const sum = q.known.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.muted,
          background: C.accentDim, padding: "3px 10px", borderRadius: "99px", textTransform: "capitalize" }}>
          {q.shape}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>{idx + 1}/{DRILL_Qs.length}</span>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "12px", marginBottom: "14px",
        display: "flex", justifyContent: "center" }}>
        <QuadSVG
          points={q.points} colour={q.colour} colourDim={q.colour + "20"}
          labels={q.vertexLabels} angles={diagramAngles}
        />
      </div>

      <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.6 }}>
        Find angle <strong>x°</strong> in this {q.shape}.
      </p>
      <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 8px" }}>
        Hint: {q.known.join(" + ")} + x = 360°
      </p>

      {!checked && (
        <div>
          <MiniCalc />
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", marginTop: "8px" }}>
            <input type="number" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Your answer"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
                border: `1.5px solid ${C.border}`, fontSize: "16px",
                color: C.text, outline: "none", boxSizing: "border-box" }} />
            <button onClick={handleCheck} style={{ padding: "12px 20px", borderRadius: "10px",
              border: "none", background: C.accent, color: "#fff",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check</button>
          </div>
        </div>
      )}

      {checked && (
        <div>
          <div style={{ background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : `✗ The answer is ${q.answer}°`}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>
              {sum} + x = 360° → x = 360 − {sum} = {q.answer}°
            </p>
          </div>
          <button onClick={handleNext} style={{ width: "100%", padding: "13px",
            borderRadius: "10px", border: "none", background: C.accent,
            color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {idx + 1 >= DRILL_Qs.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}