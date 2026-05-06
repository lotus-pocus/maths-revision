import { useState } from "react";
import { C } from "../data";
import BottomNav from "./BottomNav";
import QuartileHelper from "./QuartileHelper";
import MiniCalc from "../../../shared/MiniCalc";

export default function StageFive({ q, onBack, onComplete }) {
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const KEYS   = ["min", "q1", "median", "q3", "max"];
  const LABELS = { min: "Minimum", q1: "Q1 (Lower Quartile)", median: "Median", q3: "Q3 (Upper Quartile)", max: "Maximum" };
  const DESCS  = { min: "The smallest value", q1: "The middle of the lower half", median: "The middle value of the whole list", q3: "The middle of the upper half", max: "The largest value" };
  const [inputs,  setInputs]  = useState({ min: "", q1: "", median: "", q3: "", max: "" });
  const [checked, setChecked] = useState(false);
  const [helper,  setHelper]  = useState(null); // "q1" | "q3" | null
  const results = KEYS.map(k => ({ key: k, ok: parseFloat(inputs[k]) === q.answer[k], correct: q.answer[k] }));
  const allOk   = results.every(r => r.ok);

  // Detect if Q1, median or Q3 answers are decimals — drives the nudge hints
  const q1IsDecimal     = q.answer.q1    % 1 !== 0;
  const medianIsDecimal = q.answer.median % 1 !== 0;
  const q3IsDecimal     = q.answer.q3    % 1 !== 0;

  return (
    <div>
      {helper && <QuartileHelper sorted={sorted} which={helper} onClose={() => setHelper(null)} />}
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 2 of 3 — Find the 5 Values</p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your ordered list</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sorted.map((val, i) => (
            <div key={i} style={{ padding: "5px 10px", borderRadius: "6px", background: C.card, border: `1px solid ${C.border}`, fontSize: "13px", color: C.text }}>
              <span style={{ fontSize: "10px", color: C.muted, display: "block", lineHeight: 1 }}>{i + 1}</span>{val}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {KEYS.map(k => {
          const r = results.find(r => r.key === k);
          const showHelper  = (k === "q1" || k === "q3") && !checked;
          const isDecimal   = (k === "q1" && q1IsDecimal) || (k === "q3" && q3IsDecimal) || (k === "median" && medianIsDecimal);
          const inputEmpty  = inputs[k] === "";

          return (
            <div key={k} style={{ background: checked ? (r.ok ? "#f0fdf4" : "#fff1f2") : C.card, border: `1px solid ${checked ? (r.ok ? "#86efac" : "#fca5a5") : C.border}`, borderRadius: "10px", padding: "12px 14px" }}>
              {/* Top row: label + ? button + input + tick/cross */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0 }}>{LABELS[k]}</p>
                    {showHelper && (
                      <button
                        onClick={() => setHelper(k)}
                        style={{
                          width: isDecimal ? "auto" : "18px",
                          height: "18px",
                          padding: isDecimal ? "0 8px" : "0",
                          borderRadius: isDecimal ? "99px" : "50%",
                          border: `1.5px solid ${isDecimal ? C.purple : C.accent}`,
                          background: isDecimal ? C.purpleDim : C.accentDim,
                          color: isDecimal ? C.purple : C.accent,
                          fontSize: "11px", fontWeight: "800", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, lineHeight: 1, gap: "3px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isDecimal ? <>? <span style={{ fontWeight: "400" }}>How to calculate</span></> : "?"}
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>{DESCS[k]}</p>
                </div>
                <input
                  type="number" step="0.5"
                  value={inputs[k]}
                  onChange={e => setInputs(prev => ({ ...prev, [k]: e.target.value }))}
                  disabled={checked && r.ok}
                  placeholder="?"
                  style={{ width: "64px", padding: "8px", textAlign: "center", background: C.surface, border: `1px solid ${checked ? (r.ok ? "#16a34a" : C.red) : C.border}`, borderRadius: "8px", color: checked ? (r.ok ? "#15803d" : C.red) : C.text, fontSize: "16px", fontWeight: "700" }}
                />
                {checked && !r.ok && <span style={{ fontSize: "11px", color: C.muted, flexShrink: 0 }}>→ {r.correct}</span>}
                {checked && r.ok  && <span style={{ fontSize: "18px", flexShrink: 0 }}>✓</span>}
              </div>

              {/* Decimal nudge + calculator — shown when averaging is needed */}
              {isDecimal && !checked && inputEmpty && (
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px",
                  background: C.purpleDim, border: `1px solid ${C.purple}30`,
                  borderRadius: "8px", padding: "7px 10px" }}>
                  <span style={{ fontSize: "13px", flexShrink: 0 }}>💡</span>
                  <p style={{ fontSize: "11px", color: C.purple, margin: 0, lineHeight: 1.5 }}>
                    <strong>Heads up:</strong> the lower half of this list has an even number of values — so you'll need to average the two middle ones. Your answer may be a decimal.
                  </p>
                </div>
              )}
              {/* Calculator — shown for Q1 and Q3 always (may need averaging or checking working) */}
              {(k === "q1" || k === "q3") && !checked && (
                <MiniCalc label="Need to calculate? Use the calculator" />
              )}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <BottomNav onBack={onBack} onNext={() => setChecked(true)} nextLabel="Check my answers" />
      ) : (
        <BottomNav
          onBack={onBack}
          onNext={() => { if (allOk) onComplete(); else setChecked(false); }}
          nextLabel={allOk ? "Continue to Stage 3 →" : "Try again"}
        />
      )}
    </div>
  );
}