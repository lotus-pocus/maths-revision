import React, { useState } from "react";
import { C } from "../data";
import BoxPlotSVG from "../shared/BoxPlotSVG";

// ── Scenario bank ─────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "s1",
    emoji: "⚖️",
    profession: "Criminologist",
    title: "Criminal Sentencing",
    context: "A criminologist is comparing sentence lengths (in months) handed down for the same offence at two different Crown Courts. Are sentences consistent? Is one court harsher?",
    sets: [
      { label: "Crown Court A", min: 6,  q1: 14, median: 22, q3: 31, max: 48, color: C.accent },
      { label: "Crown Court B", min: 3,  q1: 9,  median: 18, q3: 35, max: 60, color: "#d97706" },
    ],
    unit: "Sentence length (months)",
    scaleMin: 0, scaleMax: 65,
    // Each sentence has: template parts and a tap choice at the [?] position
    sentences: [
      {
        id: "median",
        label: "Comparing typical sentences (Median)",
        parts: [
          { type: "text", value: "Crown Court A had a " },
          { type: "choice", options: ["higher", "lower"], correct: "higher",
            hint: "Court A median = 22, Court B median = 18. Which is bigger?" },
          { type: "text", value: " median sentence than Crown Court B (22 vs 18 months), so Court A was " },
          { type: "choice", options: ["harsher on average", "more lenient on average"], correct: "harsher on average",
            hint: "A higher median sentence means longer sentences on average." },
          { type: "text", value: "." },
        ],
      },
      {
        id: "iqr",
        label: "Comparing consistency (IQR)",
        parts: [
          { type: "text", value: "Crown Court A had a " },
          { type: "choice", options: ["smaller", "larger"], correct: "smaller",
            hint: "IQR A = 31−14 = 17. IQR B = 35−9 = 26. Which is smaller?" },
          { type: "text", value: " IQR (17 vs 26 months), so Court A's sentences were more " },
          { type: "choice", options: ["consistent and predictable", "varied and unpredictable"], correct: "consistent and predictable",
            hint: "A smaller IQR means less spread — sentences were more similar to each other." },
          { type: "text", value: "." },
        ],
      },
    ],
    insight: "A defence lawyer would note that Court B's sentences are far less predictable — the same offence could result in 3 months or 60 months. The IQR reveals a fairness problem that the median alone would miss.",
  },
  {
    id: "s2",
    emoji: "🧠",
    profession: "Sports Psychologist",
    title: "Reaction Times",
    context: "A sports psychologist is testing reaction times (in milliseconds) of two groups of athletes — one that has completed 8 weeks of mindfulness training, one that hasn't. Lower times are better.",
    sets: [
      { label: "Mindfulness group", min: 180, q1: 210, median: 228, q3: 242, max: 265, color: C.accent },
      { label: "Control group",     min: 165, q1: 205, median: 245, q3: 278, max: 340, color: "#d97706" },
    ],
    unit: "Reaction time (ms)",
    scaleMin: 150, scaleMax: 360,
    sentences: [
      {
        id: "median",
        label: "Comparing typical reaction times (Median)",
        parts: [
          { type: "text", value: "The mindfulness group had a " },
          { type: "choice", options: ["lower", "higher"], correct: "lower",
            hint: "Mindfulness median = 228ms, Control median = 245ms. Lower is faster — which is smaller?" },
          { type: "text", value: " median reaction time than the control group (228ms vs 245ms), suggesting the training " },
          { type: "choice", options: ["improved speed on average", "had no effect on average"], correct: "improved speed on average",
            hint: "A lower reaction time means faster responses — an improvement." },
          { type: "text", value: "." },
        ],
      },
      {
        id: "iqr",
        label: "Comparing consistency (IQR)",
        parts: [
          { type: "text", value: "The mindfulness group also had a " },
          { type: "choice", options: ["smaller", "larger"], correct: "smaller",
            hint: "IQR mindfulness = 242−210 = 32ms. IQR control = 278−205 = 73ms. Which is smaller?" },
          { type: "text", value: " IQR (32ms vs 73ms), meaning reaction times in the trained group were more " },
          { type: "choice", options: ["consistent", "varied"], correct: "consistent",
            hint: "A smaller IQR means the middle 50% of times were closer together — more consistent." },
          { type: "text", value: " — the training reduced both average time and unpredictability." },
        ],
      },
    ],
    insight: "The psychologist can make a strong case: the mindfulness group wasn't just faster on average — their times were far more reliable. The control group's IQR of 73ms suggests some athletes had very slow reactions on the day, possibly due to stress or distraction.",
  },
  {
    id: "s3",
    emoji: "💎",
    profession: "Jewellery Maker",
    title: "Gemstone Weights",
    context: "A jeweller is choosing between two diamond suppliers. They need stones close to 0.54 carats for their standard ring settings — too small or too large wastes materials. Which supplier is more reliable?",
    sets: [
      { label: "Supplier A", min: 0.31, q1: 0.48, median: 0.54, q3: 0.58, max: 0.65, color: C.accent },
      { label: "Supplier B", min: 0.18, q1: 0.42, median: 0.55, q3: 0.71, max: 0.94, color: "#d97706" },
    ],
    unit: "Stone weight (carats)",
    scaleMin: 0.1, scaleMax: 1.0,
    sentences: [
      {
        id: "median",
        label: "Comparing typical stone weights (Median)",
        parts: [
          { type: "text", value: "Both suppliers have a very similar median weight (A: 0.54, B: 0.55 carats), so neither is " },
          { type: "choice", options: ["clearly better on average", "clearly worse on average"], correct: "clearly better on average",
            hint: "The medians are almost identical — 0.54 vs 0.55. Neither is significantly better." },
          { type: "text", value: " for typical stone size." },
        ],
      },
      {
        id: "iqr",
        label: "Comparing consistency (IQR)",
        parts: [
          { type: "text", value: "However, Supplier A has a much " },
          { type: "choice", options: ["smaller", "larger"], correct: "smaller",
            hint: "IQR A = 0.58−0.48 = 0.10. IQR B = 0.71−0.42 = 0.29. Which is smaller?" },
          { type: "text", value: " IQR (0.10 vs 0.29 carats), meaning Supplier A's stones are far more " },
          { type: "choice", options: ["consistent in size", "varied in size"], correct: "consistent in size",
            hint: "A smaller IQR means the middle 50% of stones are much closer in weight." },
          { type: "text", value: " — making them more suitable for standard ring settings." },
        ],
      },
    ],
    insight: "This is a case where the median is almost useless — both suppliers look identical on average. The IQR tells the real story: Supplier B's stones vary so much that many would be unusable. A jeweller who only looked at the median would make an expensive mistake.",
  },
];

// ── Choice tap button ─────────────────────────────────────────────────────
function ChoiceButton({ option, state, onClick }) {
  // state: "idle" | "correct" | "wrong"
  const bg     = state === "correct" ? "#ecfdf5" : state === "wrong" ? "#fef2f2" : "#fff";
  const border = state === "correct" ? "#059669" : state === "wrong" ? "#dc2626" : C.border;
  const color  = state === "correct" ? "#059669" : state === "wrong" ? "#dc2626" : C.text;
  return (
    <button onClick={onClick} disabled={state !== "idle"}
      style={{ padding: "5px 12px", borderRadius: "8px", border: `2px solid ${border}`,
        background: bg, cursor: state === "idle" ? "pointer" : "default",
        fontSize: "13px", fontWeight: "700", color, transition: "all 0.15s",
        display: "inline-flex", alignItems: "center", gap: "4px" }}>
      {state === "correct" && <span>✓ </span>}
      {state === "wrong"   && <span>✗ </span>}
      {option}
    </button>
  );
}

// ── Shuffle helper ────────────────────────────────────────────────────────
function shuffleTwo(a, b) {
  return Math.random() < 0.5 ? [a, b] : [b, a];
}

// ── Sentence builder ──────────────────────────────────────────────────────
function SentenceBuilder({ sentence, onComplete }) {
  const [choices, setChoices] = useState({});
  const [hints, setHints]     = useState({});

  // Randomise option order once per mount, per choice slot
  const [shuffledOptions] = useState(() => {
    const result = {};
    let choiceCounter = 0;
    sentence.parts.forEach(part => {
      if (part.type === "choice") {
        result[choiceCounter] = shuffleTwo(part.options[0], part.options[1]);
        choiceCounter++;
      }
    });
    return result;
  });

  const choiceParts = sentence.parts.filter(p => p.type === "choice");
  const totalChoices = choiceParts.length;

  const handleChoice = (choiceIdx, option, correct) => {
    if (choices[choiceIdx]) return;
    const isCorrect = option === correct;
    setChoices(prev => ({ ...prev, [choiceIdx]: { option, correct: isCorrect } }));
    if (!isCorrect) setHints(prev => ({ ...prev, [choiceIdx]: true }));
    const newChoices = { ...choices, [choiceIdx]: { option, correct: isCorrect } };
    const allDone = Object.keys(newChoices).length === totalChoices;
    if (allDone) {
      const allCorrect = Object.values(newChoices).every(c => c.correct);
      setTimeout(() => onComplete(allCorrect), isCorrect ? 400 : 1200);
    }
  };

  let choiceCounter = 0;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
        {sentence.label}
      </p>
      <div style={{ fontSize: "13px", color: C.text, lineHeight: 2, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
        {sentence.parts.map((part, i) => {
          if (part.type === "text") {
            return <span key={i}>{part.value}</span>;
          }
          const cIdx = choiceCounter++;
          const answered = choices[cIdx];
          const showHint = hints[cIdx];
          const orderedOptions = shuffledOptions[cIdx] || part.options;
          return (
            <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
              <span style={{ display: "inline-flex", gap: "4px", flexWrap: "wrap" }}>
                {answered
                  ? <ChoiceButton option={answered.option} state={answered.correct ? "correct" : "wrong"} onClick={() => {}} />
                  : orderedOptions.map(opt => (
                    <ChoiceButton key={opt} option={opt} state="idle"
                      onClick={() => handleChoice(cIdx, opt, part.correct)} />
                  ))
                }
              </span>
              {showHint && (
                <span style={{ fontSize: "11px", color: "#d97706", fontWeight: "600", lineHeight: 1.4, display: "block", marginTop: "2px" }}>
                  💡 {part.hint}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function InterpretThis({ scenarioIndex = null }) {
  const [sIdx, setSIdx]             = useState(scenarioIndex ?? 0);
  const [completedSentences, setCompletedSentences] = useState(new Set());
  const [correctSentences, setCorrectSentences]     = useState(new Set());
  const [showInsight, setShowInsight] = useState(false);

  const scenario = SCENARIOS[sIdx];
  const totalSentences = scenario.sentences.length;
  const allComplete = completedSentences.size === totalSentences;
  const allCorrect  = correctSentences.size === totalSentences;

  const reset = (newIdx) => {
    setSIdx(newIdx);
    setCompletedSentences(new Set());
    setCorrectSentences(new Set());
    setShowInsight(false);
  };

  const handleSentenceComplete = (sentenceId, wasCorrect) => {
    setCompletedSentences(prev => {
      const next = new Set(prev);
      next.add(sentenceId);
      if (next.size === totalSentences) setShowInsight(true);
      return next;
    });
    if (wasCorrect) {
      setCorrectSentences(prev => {
        const next = new Set(prev);
        next.add(sentenceId);
        return next;
      });
    }
  };

  return (
    <div>
      {/* Scenario counter + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Scenario {sIdx + 1} of {SCENARIOS.length}
        </span>
        <div style={{ display: "flex", gap: "5px" }}>
          {SCENARIOS.map((_, i) => (
            <button key={i} onClick={() => reset(i)}
              style={{ width: i === sIdx ? "18px" : "7px", height: "7px", borderRadius: "99px",
                border: "none", cursor: "pointer", transition: "width 0.2s",
                background: i === sIdx ? "#7c3aed" : i < sIdx ? "#7c3aed50" : C.border }} />
          ))}
        </div>
      </div>

      {/* Context card */}
      <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: "12px", padding: "12px 14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "#7c3aed", margin: "0 0 4px" }}>
          {scenario.emoji} {scenario.profession} — {scenario.title}
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{scenario.context}</p>
      </div>

      {/* Box plots */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 12px", marginBottom: "16px" }}>
        <BoxPlotSVG
          sets={scenario.sets}
          scaleMin={scenario.scaleMin}
          scaleMax={scenario.scaleMax}
          unit={scenario.unit}
        />
      </div>

      {/* Progress indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
          Build the comparison
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {scenario.sentences.map(s => (
            <div key={s.id} style={{ width: "8px", height: "8px", borderRadius: "50%",
              background: completedSentences.has(s.id) ? "#7c3aed" : C.border,
              transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Sentence builders */}
      {scenario.sentences.map(sentence => (
        <SentenceBuilder
          key={`${sIdx}-${sentence.id}`}
          sentence={sentence}
          onComplete={(wasCorrect) => handleSentenceComplete(sentence.id, wasCorrect)}
        />
      ))}

      {/* Insight reveal — shown when all sentences complete */}
      {showInsight && (
        <div style={{ background: allCorrect ? "#f5f3ff" : "#fffbeb",
          border: `2px solid ${allCorrect ? "#7c3aed" : "#d97706"}`,
          borderRadius: "12px", padding: "14px 16px", marginTop: "4px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700",
            color: allCorrect ? "#7c3aed" : "#92400e",
            margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {allCorrect ? "✏️ The bigger picture" : "💡 Here's what the answer should be"}
          </p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
            {scenario.insight}
          </p>
        </div>
      )}

      {/* Navigation */}
      {allComplete && (
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <button onClick={() => reset(sIdx)}
            style={{ flex: 1, padding: "11px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
              background: C.surface, fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer" }}>
            Try again
          </button>
          {sIdx < SCENARIOS.length - 1 && (
            <button onClick={() => reset(sIdx + 1)}
              style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none",
                background: "#7c3aed", fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
              Next scenario →
            </button>
          )}
          {sIdx === SCENARIOS.length - 1 && (
            <button onClick={() => reset(0)}
              style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none",
                background: "#7c3aed", fontSize: "13px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
              Start over →
            </button>
          )}
        </div>
      )}
    </div>
  );
}