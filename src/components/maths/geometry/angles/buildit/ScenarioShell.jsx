import { useState } from "react";
import { C } from "../../../../../data/angles_data";

// ── Reason picker ─────────────────────────────────────────────────────────
export function ReasonPicker({ options, correct, onCorrect, locked }) {
  const [chosen, setChosen] = useState(null);

  const pick = (id) => {
    if (locked || chosen) return;
    setChosen(id);
    if (id === correct) onCorrect();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>
        Select the reason:
      </p>
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
            textAlign: "left", cursor: locked || chosen ? "default" : "pointer",
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
    </div>
  );
}

// ── Single step card ───────────────────────────────────────────────────────
export function StepCard({ number, total, instruction, diagram, answerLabel,
  answerValue, reasonOptions, reasonCorrect, isActive, isDone, onAnswerReveal }) {

  const [showAnswer, setShowAnswer] = useState(false);
  const [reasonDone, setReasonDone] = useState(false);

  const handleReveal = () => {
    setShowAnswer(true);
    if (onAnswerReveal) onAnswerReveal();
  };

  const needsReason = !!reasonOptions;
  const stepComplete = showAnswer && (!needsReason || reasonDone);

  return (
    <div style={{
      border: `1.5px solid ${isDone ? C.green : isActive ? C.accent : C.border}`,
      borderRadius: "12px", overflow: "hidden", marginBottom: "12px",
      background: isDone ? C.greenDim : "#fff",
      opacity: !isActive && !isDone ? 0.45 : 1,
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 14px", borderBottom: `1px solid ${isDone ? "#86efac" : C.border}` }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
          background: isDone ? C.green : isActive ? C.accent : C.border,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "800",
        }}>
          {isDone ? "✓" : number}
        </div>
        <p style={{ fontSize: "13px", fontWeight: "700",
          color: isDone ? C.green : isActive ? C.accent : C.muted, margin: 0, flex: 1 }}>
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
          {diagram && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              {diagram}
            </div>
          )}

          {!showAnswer ? (
            <button onClick={handleReveal} style={{
              width: "100%", padding: "11px", borderRadius: "9px",
              background: C.accent, color: "#fff", border: "none",
              fontSize: "13px", fontWeight: "700", cursor: "pointer",
            }}>
              Show me the answer
            </button>
          ) : (
            <>
              <div style={{
                background: C.accentDim, border: `1.5px solid ${C.accent}`,
                borderRadius: "10px", padding: "12px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: needsReason ? "0" : "0",
              }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: 0 }}>
                  {answerLabel}
                </p>
                <p style={{ fontSize: "22px", fontWeight: "800", color: C.accent, margin: 0 }}>
                  {answerValue}°
                </p>
              </div>

              {needsReason && (
                <ReasonPicker
                  options={reasonOptions}
                  correct={reasonCorrect}
                  onCorrect={() => setReasonDone(true)}
                  locked={reasonDone}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Scenario shell ─────────────────────────────────────────────────────────
export default function ScenarioShell({ title, examNote, marks, difficulty,
  diagram, steps, onComplete, onBack }) {

  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps,  setDoneSteps]  = useState(new Set());

  const handleStepReady = (idx) => {
    setDoneSteps(prev => new Set([...prev, idx]));
    if (idx + 1 < steps.length) {
      setActiveStep(idx + 1);
    } else {
      // all done — slight delay then trigger complete
      setTimeout(() => onComplete && onComplete(), 600);
    }
  };

  const allDone = doneSteps.size === steps.length;

  return (
    <div>
      {/* Scenario header */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.accent, margin: 0, flex: 1 }}>
            {title}
          </p>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px",
              borderRadius: "99px", background: C.accent + "20", color: C.accent }}>
              {marks} marks
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px",
              borderRadius: "99px",
              background: difficulty === "Foundation" ? "#ecfdf5" : "#fffbeb",
              color: difficulty === "Foundation" ? C.green : C.amber }}>
              {difficulty}
            </span>
          </div>
        </div>
        <p style={{ fontSize: "12px", color: C.text, margin: "0 0 6px", lineHeight: 1.6 }}>
          {examNote}
        </p>
      </div>

      {/* Main diagram */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        {diagram}
      </div>

      {/* Step cards */}
      <div>
        {steps.map((step, i) => (
          <StepCard
            key={i}
            number={i + 1}
            total={steps.length}
            instruction={step.instruction}
            diagram={step.diagram || null}
            answerLabel={step.answerLabel}
            answerValue={step.answerValue}
            reasonOptions={step.reasonOptions || null}
            reasonCorrect={step.reasonCorrect || null}
            isActive={activeStep === i}
            isDone={doneSteps.has(i)}
            onAnswerReveal={() => handleStepReady(i)}
          />
        ))}
      </div>

      {/* Completion banner */}
      {allDone && (
        <div style={{ background: C.greenDim, border: `2px solid ${C.green}`,
          borderRadius: "12px", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "20px", margin: "0 0 6px" }}>🎯</p>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.green, margin: "0 0 4px" }}>
            Scenario complete!
          </p>
          <p style={{ fontSize: "13px", color: C.green, margin: 0, lineHeight: 1.5 }}>
            You found every angle <strong>and</strong> gave the correct reason for each step.
            That's full marks in an exam.
          </p>
        </div>
      )}

      {/* Nav buttons */}
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