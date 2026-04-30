import React, { useState } from "react";
import { C } from "../data";

// ── Question bank ─────────────────────────────────────────────────────────
// Each question defines:
//   values      — the sorted list shown to the student
//   ask         — which stat to find: "median" | "q1" | "q3" | "all"
//   label       — short display name shown in the question
//   explanation — shown after a correct answer

const QUESTIONS = [
  {
    id: "q1",
    label: "Find the Median",
    instruction: "Tap the value that is the median.",
    values: [12, 15, 18, 22, 25, 31, 37],
    ask: "median",
    targets: { median: [3] }, // 0-indexed positions that are correct
    explanation: "7 values — odd number. The median is the middle value at position 4. No averaging needed.",
  },
  {
    id: "q2",
    label: "Find Q1 and Q3",
    instruction: "Tap all the values needed for Q1 and Q3. Hint: there are 4 taps total.",
    values: [8, 11, 14, 17, 19, 23, 26, 28, 33],
    ask: "q1q3",
    targets: { q1: [1, 2], q3: [6, 7] },
    isEven: true,
    evenResult: { q1: (11 + 14) / 2, q3: (26 + 28) / 2 },
    explanation: "9 values — odd. Median is position 5 (19). Lower half is positions 1–4 (8, 11, 14, 17) — an even group, so Q1 = average of positions 2 and 3 = (11+14)÷2 = 12.5. Upper half is positions 6–9 (23, 26, 28, 33) — also even, so Q3 = average of positions 7 and 8 = (26+28)÷2 = 27.",
  },
  {
    id: "q3",
    label: "Find the Median",
    instruction: "Tap the TWO values needed to calculate the median.",
    values: [5, 9, 13, 16, 21, 24, 28, 34],
    ask: "median",
    targets: { median: [3, 4] }, // even — need both middle values
    isEven: true,
    evenResult: (16 + 21) / 2,
    explanation: "8 values — even number. The two middle values are positions 4 and 5 (16 and 21). Average them: (16 + 21) ÷ 2 = 18.5",
  },
  {
    id: "q4",
    label: "Find Q1 and Q3",
    instruction: "Tap the values for Q1 and Q3. Watch out — this is an even-sized list.",
    values: [3, 7, 10, 14, 18, 22, 25, 29, 31, 35],
    ask: "q1q3",
    targets: { q1: [1, 2], q3: [7, 8] },
    isEven: true,
    evenResult: { q1: (7 + 10) / 2, q3: (29 + 31) / 2 },
    explanation: "10 values — even. Median splits at positions 5 and 6. Lower half: positions 1–5, so Q1 = average of positions 2 and 3 = (7+10)÷2 = 8.5. Upper half: positions 6–10, so Q3 = average of positions 8 and 9 = (29+31)÷2 = 30.",
  },
  {
    id: "q5",
    label: "Find Median, Q1 and Q3",
    instruction: "Tap all values needed: median, Q1, and Q3.",
    values: [6, 10, 14, 17, 21, 25, 28, 32, 36, 39, 44, 48],
    ask: "all",
    targets: { median: [5, 6], q1: [2], q3: [9] },
    isEven: true,
    evenResult: { median: (25 + 28) / 2 },
    explanation: "12 values — even. Median = average of positions 6 and 7 = (25+28)÷2 = 26.5. Lower half positions 1–6: Q1 = position 3 = 14. Upper half positions 7–12: Q3 = position 10 = 39.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function getAllTargetPositions(q) {
  return Object.values(q.targets).flat();
}

function getTargetLabel(q, idx) {
  for (const [key, positions] of Object.entries(q.targets)) {
    if (positions.includes(idx)) {
      if (key === "median") return "Median";
      if (key === "q1")     return "Q1";
      if (key === "q3")     return "Q3";
    }
  }
  return null;
}

// ── Cell component ────────────────────────────────────────────────────────
function ValueCell({ value, index, state, onClick, label }) {
  // state: "idle" | "correct" | "wrong" | "missed"
  const bg = {
    idle:    "#fff",
    correct: "#ecfdf5",
    wrong:   "#fef2f2",
    missed:  "#fffbeb",
  }[state];
  const border = {
    idle:    C.border,
    correct: "#059669",
    wrong:   "#dc2626",
    missed:  "#d97706",
  }[state];
  const textColor = {
    idle:    C.text,
    correct: "#059669",
    wrong:   "#dc2626",
    missed:  "#d97706",
  }[state];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      {/* Position label */}
      <span style={{ fontSize: "9px", color: C.muted, fontWeight: "500" }}>#{index + 1}</span>
      {/* Value tile */}
      <button
        onClick={onClick}
        disabled={state !== "idle"}
        style={{
          width: "44px", height: "44px",
          borderRadius: "10px",
          border: `2px solid ${border}`,
          background: bg,
          cursor: state === "idle" ? "pointer" : "default",
          fontSize: "14px", fontWeight: "700",
          color: textColor,
          transition: "all 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: state === "idle" ? "none" : `0 0 0 3px ${border}30`,
        }}
      >
        {value}
      </button>
      {/* Label below on reveal */}
      {label && (
        <span style={{ fontSize: "9px", fontWeight: "800", color: textColor, letterSpacing: "0.04em" }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ── Even-number follow-up question ────────────────────────────────────────
function EvenFollowUp({ label, twoValues, onAnswer }) {
  const [chosen, setChosen] = useState(null);
  const correct = "average";
  const avg = ((twoValues[0] + twoValues[1]) / 2);

  const handle = (choice) => {
    setChosen(choice);
    setTimeout(() => onAnswer(choice === correct), 600);
  };

  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px", marginTop: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", margin: "0 0 10px" }}>
        {label ? `For ${label}: ` : ""}You found {twoValues[0]} and {twoValues[1]}. Now what?
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { id: "average", label: `(${twoValues[0]} + ${twoValues[1]}) ÷ 2 = ${avg}` },
          { id: "higher",  label: `Pick the higher one = ${Math.max(...twoValues)}` },
        ].map(({ id, label: optLabel }) => {
          const isChosen = chosen === id;
          const isCorrect = id === correct;
          const bg = !isChosen ? "#fff" : isCorrect ? "#ecfdf5" : "#fef2f2";
          const border = !isChosen ? "#e5e7eb" : isCorrect ? "#059669" : "#dc2626";
          return (
            <button key={id} onClick={() => !chosen && handle(id)}
              style={{ flex: 1, padding: "10px 8px", borderRadius: "10px", border: `2px solid ${border}`,
                background: bg, cursor: chosen ? "default" : "pointer",
                fontSize: "12px", fontWeight: "600", color: "#1a1a2e", lineHeight: 1.4, transition: "all 0.15s" }}>
              {optLabel}
              {isChosen && (
                <span style={{ display: "block", fontSize: "11px", marginTop: "4px",
                  color: isCorrect ? "#059669" : "#dc2626", fontWeight: "700" }}>
                  {isCorrect ? "✓ Correct" : "✗ Not quite"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function FindTheValue({ questionIndex = null }) {
  const [qIdx, setQIdx]               = useState(questionIndex ?? 0);
  const [cellStates, setCellStates]   = useState({});
  const [tapped, setTapped]           = useState([]);
  const [phase, setPhase]             = useState("tapping"); // "tapping" | "evenFollowUp" | "done"
  const [followUpQueue, setFollowUpQueue] = useState([]); // [{label, values}]
  const [followUpResults, setFollowUpResults] = useState([]); // booleans
  const [showExplanation, setShowExplanation] = useState(false);

  const q = QUESTIONS[qIdx];
  const allTargets = getAllTargetPositions(q);
  const totalTargets = allTargets.length;

  const reset = (newIdx) => {
    setQIdx(newIdx);
    setCellStates({});
    setTapped([]);
    setPhase("tapping");
    setFollowUpQueue([]);
    setFollowUpResults([]);
    setShowExplanation(false);
  };

  const handleTap = (idx) => {
    if (phase !== "tapping") return;
    if (tapped.includes(idx)) return;

    const isCorrect = allTargets.includes(idx);
    const newStates = { ...cellStates, [idx]: isCorrect ? "correct" : "wrong" };
    const newTapped = [...tapped, idx];

    setCellStates(newStates);
    setTapped(newTapped);

    if (!isCorrect) {
      // Wrong — reveal missed targets and end
      setTimeout(() => {
        const missed = {};
        allTargets.forEach(t => { if (!newTapped.includes(t)) missed[t] = "missed"; });
        setCellStates(prev => ({ ...prev, ...missed }));
        setPhase("done");
        setShowExplanation(true);
      }, 500);
      return;
    }

    const correctSoFar = newTapped.filter(t => allTargets.includes(t));
    if (correctSoFar.length === totalTargets) {
      if (q.isEven) {
        // Build follow-up queue — one step per stat that needs averaging
        const queue = [];
        for (const [key, positions] of Object.entries(q.targets)) {
          if (positions.length === 2) {
            const vals = positions.map(p => q.values[p]).sort((a, b) => a - b);
            const label = key === "median" ? "Median" : key === "q1" ? "Q1" : "Q3";
            queue.push({ label, values: vals });
          }
        }
        if (queue.length > 0) {
          setFollowUpQueue(queue);
          setPhase("evenFollowUp");
        } else {
          setPhase("done");
          setShowExplanation(true);
        }
      } else {
        setPhase("done");
        setShowExplanation(true);
      }
    }
  };

  const handleFollowUpAnswer = (passed) => {
    setFollowUpResults(prev => {
      const newResults = [...prev, passed];
      if (newResults.length === followUpQueue.length) {
        setTimeout(() => {
          setPhase("done");
          setShowExplanation(true);
        }, 400);
      }
      return newResults;
    });
  };

  const currentFollowUp = phase === "evenFollowUp"
    ? followUpQueue[followUpResults.length]
    : null;

  const allCorrect = phase === "done"
    && tapped.every(t => allTargets.includes(t))
    && (followUpResults.length === 0 || followUpResults.every(Boolean));

  return (
    <div>
      {/* Question counter + navigation dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Question {qIdx + 1} of {QUESTIONS.length}
        </span>
        <div style={{ display: "flex", gap: "5px" }}>
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => reset(i)}
              style={{ width: i === qIdx ? "18px" : "7px", height: "7px", borderRadius: "99px", border: "none",
                cursor: "pointer", transition: "width 0.2s",
                background: i === qIdx ? C.accent : i < qIdx ? C.accent + "50" : C.border }} />
          ))}
        </div>
      </div>

      {/* Question label + instruction */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "800", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
          🎯 {q.label}
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{q.instruction}</p>
      </div>

      {/* Sorted list */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 12px", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
          Sorted list — {q.values.length} values ({q.values.length % 2 === 0 ? "even" : "odd"})
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
          {q.values.map((val, idx) => (
            <ValueCell
              key={idx}
              value={val}
              index={idx}
              state={cellStates[idx] || "idle"}
              onClick={() => handleTap(idx)}
              label={phase === "done" ? getTargetLabel(q, idx) : null}
            />
          ))}
        </div>
      </div>

      {/* Even follow-up — one step at a time */}
      {phase === "evenFollowUp" && currentFollowUp && (
        <EvenFollowUp
          key={followUpResults.length}
          label={currentFollowUp.label}
          twoValues={currentFollowUp.values}
          onAnswer={handleFollowUpAnswer}
        />
      )}

      {/* Explanation */}
      {showExplanation && (
        <div style={{
          background: allCorrect ? "#ecfdf5" : "#fef2f2",
          border: `1px solid ${allCorrect ? "#6ee7b7" : "#fca5a5"}`,
          borderRadius: "12px", padding: "14px", marginTop: "12px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: allCorrect ? "#059669" : "#dc2626", margin: "0 0 6px" }}>
            {allCorrect ? "✓ Correct!" : "Not quite — here's how it works:"}
          </p>
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>{q.explanation}</p>
        </div>
      )}

      {/* Next / Try again */}
      {phase === "done" && (
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <button onClick={() => reset(qIdx)}
            style={{ flex: 1, padding: "11px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
              background: C.surface, fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer" }}>
            Try again
          </button>
          {qIdx < QUESTIONS.length - 1 && (
            <button onClick={() => reset(qIdx + 1)}
              style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none",
                background: C.accent, fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
              Next question →
            </button>
          )}
          {qIdx === QUESTIONS.length - 1 && (
            <button onClick={() => reset(0)}
              style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none",
                background: C.accent, fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
              Start over →
            </button>
          )}
        </div>
      )}
    </div>
  );
}