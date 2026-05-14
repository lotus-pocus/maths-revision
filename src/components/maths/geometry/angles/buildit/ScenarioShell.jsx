import { useState, useRef, useEffect } from "react";
import { C } from "../../../../../data/angles_data";
import MiniCalc from "../../../shared/MiniCalc";

// ── Reason picker ─────────────────────────────────────────────────────────
export function ReasonPicker({ options, correct, onCorrect, locked }) {
  const [chosen, setChosen] = useState(null);

  const pick = (id) => {
    // Allow re-selection until the correct answer is chosen (or locked after correct)
    if (locked) return;
    if (chosen === correct) return;  // already got it right, don't re-pick
    setChosen(id);
    if (id === correct) onCorrect();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "14px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "#fffbeb", border: `1.5px solid ${C.amber}`,
        borderRadius: "9px", padding: "9px 12px", marginBottom: "2px",
      }}>
        <span style={{ fontSize: "18px", animation: "bounce 1s infinite" }}>👇</span>
        <p style={{
          fontSize: "13px", fontWeight: "700", color: "#92400e", margin: 0,
        }}>
          Select the reason to move on
        </p>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }`}</style>
      {options.map(({ id, label }) => {
        const isChosen  = chosen === id;
        const isCorrect = id === correct;
        let bg = "#f9fafb", border = C.border, color = C.text;
        if (isChosen && isCorrect)  { bg = C.greenDim;  border = C.green;  color = C.green;  }
        if (isChosen && !isCorrect) { bg = "#fef2f2";   border = C.red;    color = C.red;    }
        if (chosen && !isChosen && isCorrect) { bg = C.greenDim; border = C.green; color = C.green; }
        return (
          <button key={id} onClick={() => pick(id)} style={{
            padding: "10px 14px", borderRadius: "9px", border: `1.5px solid ${border}`,
            background: bg, color, fontSize: "13px", fontWeight: "600",
            textAlign: "left", cursor: (locked || chosen === correct) ? "default" : "pointer",
            transition: "all 0.15s",
          }}>
            {isChosen && isCorrect  && "✓ "}
            {isChosen && !isCorrect && "✗ "}
            {chosen && !isChosen && isCorrect && "✓ "}
            {label}
          </button>
        );
      })}
      {chosen && chosen !== correct && (
        <p style={{ fontSize: "12px", color: C.red, margin: "4px 0 0", fontWeight: "600" }}>
          Not quite — the correct reason is highlighted above.
        </p>
      )}
      {chosen === correct && (
        <p style={{ fontSize: "12px", color: C.green, margin: "4px 0 0", fontWeight: "600" }}>
          ✓ Perfect — that's the reason the examiner is looking for.
        </p>
      )}
    </div>
  );
}

// ── Hint bubble ────────────────────────────────────────────────────────────
function HintBubble({ text }) {
  return (
    <div style={{
      background: "#fffbeb", border: `1.5px solid ${C.amber}`,
      borderRadius: "10px", padding: "10px 13px", marginTop: "10px",
      display: "flex", gap: "8px", alignItems: "flex-start",
    }}>
      <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
      <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

// ── Worked answer reveal ───────────────────────────────────────────────────
function WorkedReveal({ label, value, working }) {
  return (
    <div style={{
      background: C.accentDim, border: `1.5px solid ${C.accent}`,
      borderRadius: "10px", padding: "12px 14px",
    }}>
      {working && (
        <p style={{ fontSize: "12px", color: C.accent, margin: "0 0 8px", lineHeight: 1.6 }}>
          {working}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: "22px", fontWeight: "800", color: C.accent, margin: 0 }}>
          {value}°
        </p>
      </div>
    </div>
  );
}

// ── Single interactive step card ───────────────────────────────────────────
function StepCard({
  number, instruction, answerLabel, answerValue,
  reasonOptions, reasonCorrect,
  hint, working, showCalc,
  isActive, isDone,
  onStepComplete,
}) {
  const [inputVal,    setInputVal]    = useState("");
  const [attempts,    setAttempts]    = useState(0);
  const [showHint,    setShowHint]    = useState(false);
  const [revealed,    setRevealed]    = useState(false);
  const [correct,     setCorrect]     = useState(false);
  const [reasonDone,  setReasonDone]  = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus();
  }, [isActive]);

  const needsReason = !!reasonOptions;

  // Called when the answer is confirmed (either correct entry or revealed)
  const completeAnswer = (wasCorrect) => {
    setRevealed(true);
    setCorrect(wasCorrect);
    // If no reason picker, we're done — advance immediately
    if (!needsReason) {
      setTimeout(() => onStepComplete && onStepComplete(), 500);
    }
  };

  // Called when reason is correctly selected
  const completeReason = () => {
    setReasonDone(true);
    setTimeout(() => onStepComplete && onStepComplete(), 500);
  };

  const handleCheck = () => {
    const entered = parseFloat(inputVal);
    if (isNaN(entered)) return;
    const next = attempts + 1;
    setAttempts(next);
    if (entered === answerValue) {
      completeAnswer(true);
    } else {
      if (next >= 2 && hint) setShowHint(true);
    }
  };

  const handleReveal = () => {
    completeAnswer(false);
  };

  const wrongAnswer = attempts > 0 && !revealed;

  return (
    <div style={{
      border: `1.5px solid ${isDone ? C.green : isActive ? C.accent : C.border}`,
      borderRadius: "12px", overflow: "hidden", marginBottom: "12px",
      background: isDone ? C.greenDim : "#fff",
      opacity: !isActive && !isDone ? 0.45 : 1,
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 14px",
        borderBottom: `1px solid ${isDone ? "#86efac" : isActive ? C.accent + "30" : C.border}`,
      }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
          background: isDone ? C.green : isActive ? C.accent : C.border,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "800",
        }}>
          {isDone ? "✓" : number}
        </div>
        <p style={{
          fontSize: "13px", fontWeight: "700",
          color: isDone ? C.green : isActive ? C.accent : C.muted,
          margin: 0, flex: 1,
        }}>
          {instruction}
        </p>
        {isDone && (
          <span style={{ fontSize: "15px", fontWeight: "800", color: C.green, flexShrink: 0 }}>
            {answerValue}°
          </span>
        )}
      </div>

      {/* Body — only shown when active */}
      {isActive && (
        <div style={{ padding: "14px" }}>

          {/* ── Input mode (answer not yet confirmed) ── */}
          {!revealed && (
            <>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <label style={{
                  fontSize: "13px", fontWeight: "700", color: C.text,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {answerLabel}
                </label>
                <input
                  ref={inputRef}
                  type="number"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCheck()}
                  placeholder="°"
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: "9px",
                    border: `1.5px solid ${wrongAnswer ? C.red : C.border}`,
                    fontSize: "16px", fontWeight: "700", color: C.text,
                    outline: "none", minWidth: 0,
                    background: wrongAnswer ? "#fef2f2" : "#fff",
                    appearance: "textfield",
                  }}
                />
                <button onClick={handleCheck} style={{
                  padding: "10px 16px", borderRadius: "9px",
                  background: C.accent, color: "#fff", border: "none",
                  fontSize: "13px", fontWeight: "700", cursor: "pointer", flexShrink: 0,
                }}>
                  Check
                </button>
              </div>

              {wrongAnswer && (
                <p style={{ fontSize: "12px", color: C.red, margin: "8px 0 0", fontWeight: "600" }}>
                  {attempts === 1
                    ? "Not quite — try again. Think about which angle relationship applies here."
                    : "Still not right — here's a hint to help you."}
                </p>
              )}

              {showHint && hint && <HintBubble text={hint} />}

              {showCalc && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => setCalcVisible(v => !v)} style={{
                    padding: "7px 13px", borderRadius: "8px",
                    border: "1.5px solid #7c3aed",
                    background: calcVisible ? "#f5f3ff" : "#fff",
                    color: "#7c3aed", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                  }}>
                    🧮 {calcVisible ? "Hide calculator" : "Use calculator"}
                  </button>
                  {calcVisible && <div style={{ marginTop: "10px" }}><MiniCalc defaultOpen={true} /></div>}
                </div>
              )}

              {attempts >= 2 && (
                <button onClick={handleReveal} style={{
                  marginTop: "12px", width: "100%", padding: "10px",
                  borderRadius: "9px", border: `1.5px solid ${C.border}`,
                  background: "#f9fafb", color: C.muted,
                  fontSize: "12px", fontWeight: "600", cursor: "pointer",
                }}>
                  Show me the answer →
                </button>
              )}
            </>
          )}

          {/* ── Answer confirmed — show result + reason picker ── */}
          {revealed && (
            <>
              {correct ? (
                <div style={{
                  background: C.greenDim, border: `1.5px solid ${C.green}`,
                  borderRadius: "10px", padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: C.green, margin: 0 }}>
                    ✓ {answerLabel}
                  </p>
                  <p style={{ fontSize: "22px", fontWeight: "800", color: C.green, margin: 0 }}>
                    {answerValue}°
                  </p>
                </div>
              ) : (
                <WorkedReveal label={answerLabel} value={answerValue} working={working} />
              )}

              {needsReason && !reasonDone && (
                <ReasonPicker
                  options={reasonOptions}
                  correct={reasonCorrect}
                  onCorrect={completeReason}
                  locked={false}
                />
              )}

              {needsReason && reasonDone && (
                <div style={{
                  marginTop: "14px", padding: "10px 13px", borderRadius: "9px",
                  background: C.greenDim, border: `1.5px solid ${C.green}`,
                }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: C.green, margin: 0 }}>
                    ✓ Correct reason given — moving to next step…
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Scenario shell ─────────────────────────────────────────────────────────
export default function ScenarioShell({
  title, examNote, marks, difficulty,
  diagram,
  steps,
  onComplete, onBack,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps,  setDoneSteps]  = useState(new Set());

  const handleStepComplete = (idx) => {
    setDoneSteps(prev => new Set([...prev, idx]));
    if (idx + 1 < steps.length) {
      setActiveStep(idx + 1);
    } else {
      setTimeout(() => onComplete && onComplete(), 700);
    }
  };

  const allDone = doneSteps.size === steps.length;
  const diagramNode = typeof diagram === "function" ? diagram(activeStep) : diagram;

  return (
    <div>
      {/* Scenario header */}
      <div style={{
        background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: "8px", marginBottom: "6px",
        }}>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.accent, margin: 0, flex: 1 }}>
            {title}
          </p>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <span style={{
              fontSize: "11px", fontWeight: "700", padding: "2px 8px",
              borderRadius: "99px", background: C.accent + "20", color: C.accent,
            }}>
              {marks} marks
            </span>
            <span style={{
              fontSize: "11px", fontWeight: "700", padding: "2px 8px",
              borderRadius: "99px",
              background: difficulty === "Foundation" ? "#ecfdf5" : "#fffbeb",
              color: difficulty === "Foundation" ? C.green : C.amber,
            }}>
              {difficulty}
            </span>
          </div>
        </div>
        <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          {examNote}
        </p>
      </div>

      {/* Diagram */}
      <div style={{
        background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center",
      }}>
        {diagramNode}
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "5px", borderRadius: "99px",
            background: doneSteps.has(i) ? C.green : i === activeStep ? C.accent : C.border,
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Step cards */}
      {steps.map((step, i) => (
        <StepCard
          key={i}
          number={i + 1}
          instruction={step.instruction}
          answerLabel={step.answerLabel}
          answerValue={step.answerValue}
          reasonOptions={step.reasonOptions || null}
          reasonCorrect={step.reasonCorrect || null}
          hint={step.hint || null}
          working={step.working || null}
          showCalc={step.showCalc || false}
          isActive={activeStep === i}
          isDone={doneSteps.has(i)}
          onStepComplete={() => handleStepComplete(i)}
        />
      ))}

      {/* Completion banner */}
      {allDone && (
        <div style={{
          background: C.greenDim, border: `2px solid ${C.green}`,
          borderRadius: "12px", padding: "16px", textAlign: "center", marginBottom: "16px",
        }}>
          <p style={{ fontSize: "20px", margin: "0 0 6px" }}>🎯</p>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.green, margin: "0 0 4px" }}>
            Scenario complete!
          </p>
          <p style={{ fontSize: "13px", color: C.green, margin: 0, lineHeight: 1.5 }}>
            You found every angle <strong>and</strong> gave the correct reason for each step.
            That's exactly what the examiner wants to see.
          </p>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button onClick={onBack} style={{
          flex: 1, padding: "12px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
          background: "#fff", color: C.muted, fontSize: "13px", fontWeight: "600",
          cursor: "pointer",
        }}>
          ← Back to scenarios
        </button>
        {allDone && onComplete && (
          <button onClick={onComplete} style={{
            flex: 1, padding: "12px", borderRadius: "10px", border: "none",
            background: C.green, color: "#fff", fontSize: "13px", fontWeight: "700",
            cursor: "pointer",
          }}>
            Next scenario →
          </button>
        )}
      </div>
    </div>
  );
}