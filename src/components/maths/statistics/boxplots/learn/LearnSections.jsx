import React from "react";
import { C } from "../data";
import GlossaryTerm from "../GlossaryTerm";
import ScoreTable from "./ScoreTable";
import StepBubble from "./StepBubble";
import MedianDemo from "./MedianDemo";
import IQRComparison from "./IQRComparison";
import Reveal from "./Reveal";
import GroupedDataReveal from "./GroupedDataReveal";
import BarChart from "../shared/BarChart";
import { MiniBoxPlot, CumFreqGraph } from "./LearnCharts";

// ── Data ──────────────────────────────────────────────────────────────────
const CLASS_A_SCORES = [
  42, 44, 52, 53, 54, 55, 56, 56, 57, 58,
  59, 60, 60, 61, 61, 61, 61, 62, 63, 64,
  65, 66, 67, 68, 68, 69, 70, 71, 72, 74,
];
const CLASS_B_SCORES = [
  14, 18, 21, 24, 26, 27, 27, 27, 28, 30,
  32, 34, 35, 36, 38, 39, 41, 44, 46, 46,
  47, 48, 48, 49, 49, 49, 49, 50, 80, 91,
];
const ALL_SCORES = [...CLASS_A_SCORES, ...CLASS_B_SCORES].sort((a, b) => a - b);

function medianOfSorted(arr) {
  const n = arr.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

function fiveNumberSummary(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  return {
    min:    sorted[0],
    q1:     medianOfSorted(sorted.slice(0, n / 2)),
    median: medianOfSorted(sorted),
    q3:     medianOfSorted(sorted.slice(n / 2)),
    max:    sorted[sorted.length - 1],
  };
}

export const YEAR    = { ...fiveNumberSummary(ALL_SCORES),       label: "Whole year group (60 students)", color: C.accent   };
export const CLASS_A = { ...fiveNumberSummary(CLASS_A_SCORES),   label: "Class 11A",                     color: C.accent   };
export const CLASS_B = { ...fiveNumberSummary(CLASS_B_SCORES),   label: "Class 11B",                     color: "#d97706"  };

// ── Part explorer data ────────────────────────────────────────────────────
export const PARTS = [
  { id: "min",    label: "Min",    fullLabel: "Minimum"          },
  { id: "q1",     label: "Q1",     fullLabel: "Q1 - Lower Quarter" },
  { id: "median", label: "Median", fullLabel: "Median"           },
  { id: "q3",     label: "Q3",     fullLabel: "Q3 - Upper Quarter" },
  { id: "iqr",    label: "IQR",    fullLabel: "IQR"              },
  { id: "max",    label: "Max",    fullLabel: "Maximum"          },
];

export const PART_CONTENT = {
  min: {
    definition: "The smallest value in the data set. Shown as the left end of the left whisker.",
    headline: "The lowest score - 14 marks",
    explain: "Someone in the year group scored just 14 out of 100. That's one student - and the long left whisker (from 14 all the way to Q1 at 38) suggests a small number of students are well below everyone else. The minimum on its own doesn't tell you much - but the distance between it and Q1 is worth noticing.",
    examTip: "Min is the left whisker end. You're usually given it directly in the question.",
  },
  q1: {
    definition: "Q1 stands for 'first quarter.' It is the value that splits the bottom 25% of data from the rest. One quarter of all results fall below Q1.",
    headline: "Q1 = 38.5 - the bottom quarter boundary",
    explain: "One quarter (25%) of students scored below 38.5. These are the students who need most support. As a teacher, you'd want to know: are they all in the same class? Have they been absent a lot? The box plot gives you the boundary. It's your job to ask why those students are there.",
    examTip: "25% of values fall below Q1. To find it: take the lower half of sorted data and find its median.",
  },
  median: {
    definition: "The median is the middle value when all data is sorted from lowest to highest. Exactly half the values are below it, and half are above it.",
    headline: "Median = 51 - the typical student scored 51%",
    explain: "Half the year scored below 51, half above. This is more useful than a mean because a few very high or very low scores won't distort it. But 51% on its own doesn't tell you whether both classes are similar, or whether one class is dragging the median down. You need to go deeper.",
    examTip: "Odd values: median is the middle one. Even values: average the two middle values.",
  },
  q3: {
    definition: "Q3 stands for 'third quarter.' It is the value that splits the top 25% of data from the rest. Three quarters of all results fall below Q3.",
    headline: "Q3 = 61.5 - the upper quarter boundary",
    explain: "75% of students scored below 61.5. Only the top quarter scored higher. If you'd expect strong students to be hitting 75+, a Q3 of 62 suggests even the better-performing students have gaps. The right whisker stretches all the way to 91, which means a small number of students are far ahead of everyone else.",
    examTip: "75% of values fall below Q3. To find it: take the upper half of sorted data and find its median.",
  },
  iqr: {
    definition: "IQR stands for Interquartile Range. It is the distance between Q1 and Q3, calculated as IQR = Q3 - Q1. It measures how spread out the middle 50% of the data is.",
    headline: "IQR = 23 - the middle 50% spread across 23 marks",
    explain: "IQR = Q3 - Q1 = 61.5 - 38.5 = 23. The middle half of the year scored anywhere between 38.5 and 61.5. That 23-mark gap means results are quite spread out. The big question is: is this because the two classes are very different from each other? Or are both classes equally spread? A single box plot can't answer that - but splitting by class will.",
    examTip: "Always write IQR = Q3 - Q1 and show your working. Smaller IQR = more consistent results.",
  },
  max: {
    definition: "The largest value in the data set. Shown as the right end of the right whisker.",
    headline: "Maximum = 91 - the top score",
    explain: "One student scored 91. The long right whisker (Q3 is 61.5, max is 91) shows that a small number of high performers are well ahead of the pack. These might be students with tutors, students who find maths easier, or simply students who revised more. The box plot flags the gap - it doesn't explain it.",
    examTip: "Max is the right whisker end. Range = Max - Min = the total spread of all values.",
  },
};

// ── Glossary entries ──────────────────────────────────────────────────────
const GLOSSARY = [
  { term: "Minimum",            abbr: "Min", definition: "The smallest value in the data set.",                                                                    position: "Left whisker end",              formula: "Given directly"                            },
  { term: "Lower Quartile",     abbr: "Q1",  definition: "The value that marks the boundary of the bottom 25% of data.",                                           position: "Left edge of the box",          formula: "Median of the lower half of data"          },
  { term: "Median",             abbr: null,  definition: "The middle value of a sorted data set. For an even number of values, average the two middle numbers.",    position: "Vertical line inside the box",  formula: "Middle value, or (lower middle + upper middle) ÷ 2" },
  { term: "Upper Quartile",     abbr: "Q3",  definition: "The value that marks the boundary of the top 25% of data.",                                              position: "Right edge of the box",         formula: "Median of the upper half of data"          },
  { term: "Maximum",            abbr: "Max", definition: "The largest value in the data set.",                                                                     position: "Right whisker end",             formula: "Given directly"                            },
  { term: "Interquartile Range",abbr: "IQR", definition: "The difference between Q3 and Q1. Measures how spread out the middle 50% of data is.",                  position: "Width of the box",              formula: "IQR = Q3 - Q1"                             },
  { term: "Range",              abbr: null,  definition: "The total spread from lowest to highest. One extreme value can make it misleadingly large.",              position: "Full width of the diagram",     formula: "Range = Max - Min"                         },
  { term: "Cumulative frequency",abbr: null, definition: "A running total of how many values fall at or below each point. Plotted as an S-shaped curve.",          position: "Y-axis of cumulative frequency graph", formula: "Add up frequencies from the bottom upwards" },
];

// ── Section 1: The data ───────────────────────────────────────────────────
export function SectionData({ nav, showAll, openMidrange, BreakoutPill }) {
  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "16px 18px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>🏫 The situation</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 10px" }}>
          Year 11 has just sat a maths practice paper. There are <strong>60 students</strong> across two classes - 11A and 11B. The results are back. You're the head of maths. What do you do with 60 numbers?
        </p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
          You could list every score. You could find the mean. But neither tells you <em>who</em> is struggling, <em>how spread out</em> the results are, or <em>whether one class is letting the other down</em>. That's where a box plot comes in.
        </p>
      </div>
      <ScoreTable allScores={ALL_SCORES} />
      {showAll && <BreakoutPill type="concept" label="Why not just use midrange?" onClick={openMidrange} />}
      {nav}
    </div>
  );
}

// ── Section 2: Box plot anatomy ───────────────────────────────────────────
export function SectionAnatomy({ nav, activePart, setActivePart, showAll, openDrill, BreakoutPill }) {
  const active = activePart ? PART_CONTENT[activePart] : null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="1" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Look at the whole year group first</p>
      </div>
      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        Instead of reading 60 scores, the box plot gives you <strong style={{ color: C.text }}>5 checkpoints</strong>. Tap any label below to see what it means - and why it matters.
      </p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Whole year group - maths test (out of 100)</p>
        <MiniBoxPlot sets={[YEAR]} scaleMin={0} scaleMax={100} unit="Score (out of 100)" highlightPart={activePart} />
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
        {PARTS.map(p => (
          <button key={p.id} onClick={() => setActivePart(activePart === p.id ? null : p.id)}
            style={{ padding: "6px 14px", borderRadius: "99px", cursor: "pointer", fontSize: "12px", fontWeight: "700",
              border: `1.5px solid ${activePart === p.id ? C.accent : C.border}`,
              background: activePart === p.id ? C.accentDim : "transparent",
              color: activePart === p.id ? C.accent : C.muted }}>
            {p.label}
          </button>
        ))}
      </div>
      {active && (
        <div style={{ background: C.surface, border: `2px solid ${C.accent}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            {PARTS.find(p => p.id === activePart)?.fullLabel}
          </p>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}50`, borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Definition</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{active.definition}</p>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "800", color: C.text, margin: "0 0 10px" }}>{active.headline}</p>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 12px" }}>{active.explain}</p>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>In the exam:</strong> {active.examTip}
            </p>
          </div>
        </div>
      )}
      {showAll && openDrill && BreakoutPill && (
        <BreakoutPill type="drill" label="Find the value — test yourself" onClick={openDrill} />
      )}
      {nav}
    </div>
  );
}

// ── Section 3: Whole year summary ─────────────────────────────────────────
export function SectionWhole({ nav }) {
  return (
    <div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "28px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>What do we know so far?</p>
        {[
          { icon: "📌", jsx: <><GlossaryTerm term="Median">Median</GlossaryTerm> = 51 — the typical student scored about half marks</> },
          { icon: "⚠️", jsx: <><GlossaryTerm term="Q1">Q1</GlossaryTerm> = 38.5 — a quarter of students scored below 38.5</> },
          { icon: "⚠️", jsx: <><GlossaryTerm term="IQR">IQR</GlossaryTerm> = 23 — the middle 50% spread across 23 marks</> },
          { icon: "📌", jsx: <><GlossaryTerm term="Maximum">Max</GlossaryTerm> = 91 — a few students are well ahead of everyone else</> },
        ].map(({ icon, jsx }, idx) => (
          <div key={idx} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
            <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{jsx}</p>
          </div>
        ))}
        <div style={{ marginTop: "12px", padding: "12px", background: "#fff8f0", border: "1px solid #d97706", borderRadius: "8px" }}>
          <p style={{ fontSize: "13px", color: "#92400e", margin: 0, lineHeight: 1.7 }}>
            <strong>But here's the problem:</strong> the IQR of 23 tells you results are spread out — but why? Is one class dragging results down? You can't tell yet.
          </p>
        </div>
      </div>
      {nav}
    </div>
  );
}

// ── Section 4: Split by class ─────────────────────────────────────────────
export function SectionSplit({ nav, showAll, openInterpret, BreakoutPill }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="2" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Split by class - now the picture changes</p>
      </div>
      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        The head of maths draws <strong style={{ color: C.text }}>two box plots</strong> on the same scale. Same test. Same marking. Very different story.
      </p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Class 11A vs Class 11B - same test, same scale</p>
        <MiniBoxPlot sets={[CLASS_A, CLASS_B]} scaleMin={0} scaleMax={100} unit="Score (out of 100)" highlightPart={null} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[{ ...CLASS_A, iqr: CLASS_A.q3 - CLASS_A.q1 }, { ...CLASS_B, iqr: CLASS_B.q3 - CLASS_B.q1 }].map(s => (
          <div key={s.label} style={{ background: C.surface, border: `2px solid ${s.color}`, borderRadius: "12px", padding: "14px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, margin: "0 0 10px" }}>{s.label}</p>
            {[["Median", s.median], ["Q1", s.q1], ["Q3", s.q3], ["IQR", s.iqr], ["Min", s.min], ["Max", s.max]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: "12px", color: C.muted }}>{k}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: k === "Median" || k === "IQR" ? s.color : C.text }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#15803d", margin: "0 0 12px" }}>💡 Now we can answer the questions</p>
        {[
          { q: "Is one class doing better overall?",  a: "Yes. 11A has a median of 61, 11B has a median of 38.5. That's a 22.5-mark gap on the typical student." },
          { q: "Is one class more consistent?",       a: "11A has an IQR of 11. 11B has an IQR of 21. 11A's students are moving together." },
          { q: "What about the bottom quarter in 11B?", a: "Q1 for 11B is just 27. A quarter of that class scored under 27. Those students need urgent support." },
        ].map(({ q, a }, i) => (
          <div key={i} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#15803d", margin: "0 0 3px" }}>Q: {q}</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.65 }}>— {a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "10px", padding: "14px", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "#92400e", margin: "0 0 6px" }}>⭐ How to write this in an exam</p>
        <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.7, margin: "0 0 6px" }}>
          "Class 11A had a higher <GlossaryTerm term="Median">median</GlossaryTerm> (61) than Class 11B (38.5), so 11A performed better on average. Class 11A also had a smaller <GlossaryTerm term="IQR">IQR</GlossaryTerm> (11 vs 21), so their results were more consistent."
        </p>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
          Structure: <strong>compare medians → conclusion. Compare IQRs → conclusion.</strong>
        </p>
      </div>
      {showAll && openInterpret && BreakoutPill && (
        <BreakoutPill type="interpret" label="Now interpret it yourself" onClick={openInterpret} />
      )}
      {nav}
    </div>
  );
}

// ── Section 5: Why IQR matters ────────────────────────────────────────────
export function SectionIQR({ nav }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="3" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>Why does IQR matter so much?</p>
      </div>
      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        These two classes have <strong style={{ color: C.text }}>exactly the same median</strong>. But look at what the IQR reveals.
      </p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <IQRComparison />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>Small IQR = 8 ✓</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: 0 }}>The middle 50% all scored between 46 and 54. Everyone is moving together. <strong>Simple to address.</strong></p>
        </div>
        <div style={{ background: "#fff8f0", border: "1px solid #d97706", borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#d97706", margin: "0 0 8px" }}>Large IQR = 32 ⚠️</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.65, margin: 0 }}>The middle 50% ranged from 30 to 62. Some students are fine. Others are lost. <strong>Much harder to fix.</strong></p>
        </div>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px", marginBottom: "8px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 6px" }}>The one rule to remember:</p>
        <p style={{ fontSize: "14px", color: C.accent, fontWeight: "700", lineHeight: 1.6, margin: 0 }}>
          Small <GlossaryTerm term="IQR">IQR</GlossaryTerm> = consistent. Large <GlossaryTerm term="IQR">IQR</GlossaryTerm> = something is creating inequality — find out why.
        </p>
      </div>
      {nav}
    </div>
  );
}

// ── Section 6: In the exam ────────────────────────────────────────────────
export function SectionExam({ nav, activeGraph, setActiveGraph, showAll, openInterpret, BreakoutPill }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <StepBubble n="4" />
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>This is what shows up in an exam</p>
      </div>
      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "14px" }}>
        In an Edexcel GCSE exam you won't always be given a box plot directly. Often you're given a graph and asked to read the values yourself. This is the <strong style={{ color: C.text }}>same data</strong> — just shown differently.
      </p>

      {/* Graph toggle */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", background: C.surface, borderRadius: "10px", padding: "4px", border: `1px solid ${C.border}` }}>
        {[{ id: "cumfreq", label: "📈 Cumulative frequency graph" }, { id: "bar", label: "📊 Bar chart" }].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveGraph(id)}
            style={{ flex: 1, padding: "9px 8px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: activeGraph === id ? C.accent : "transparent",
              color: activeGraph === id ? "#fff" : C.muted,
              fontSize: "12px", fontWeight: "600", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {activeGraph === "cumfreq" && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Cumulative frequency graph — whole year group (60 students)</p>
            <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>Dashed lines show how to read off Q1, Median and Q3</p>
            <CumFreqGraph />
          </div>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>How to read this graph in an exam</p>
            {[
              { step: "1", text: "Find the frequency you need on the y-axis. Q1: ¼ × 60 = 15. Median: ½ × 60 = 30. Q3: ¾ × 60 = 45." },
              { step: "2", text: "Draw a horizontal line across from that frequency until it hits the curve." },
              { step: "3", text: "Drop straight down to the x-axis. That value is your answer." },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{step}</div>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>Exam tip:</strong> Always read across from the y-axis first, then drop straight down. Never go the other way round.
            </p>
          </div>
        </div>
      )}

      {activeGraph === "bar" && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Bar chart — whole year group (60 students)</p>
            <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>Number of students per score range.</p>
            <BarChart />
          </div>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 8px" }}>What this bar chart tells you</p>
            {[
              { label: "Scores cluster in the 50–69 range", detail: "The tallest bars. Most students scored here — this is where the median sits." },
              { label: "The tail on the left is longer",    detail: "More students scored very low (10–29) than very high (80–99)." },
              { label: "You can't read Q1 or Q3 directly",  detail: "That's the weakness of a bar chart. You need a cumulative frequency graph to find quartiles precisely." },
            ].map(({ label, detail }) => (
              <div key={label} style={{ display: "flex", gap: "10px", marginBottom: "8px", paddingBottom: "8px", borderBottom: `1px solid ${C.accent}30` }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>Exam tip:</strong> Bar charts help you understand the shape — not the exact quartiles. The examiner will give you a cumulative frequency graph if they want you to find Q1, Median, Q3.
            </p>
          </div>
        </div>
      )}

      {/* Reference collapsibles — always visible, not gated */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "20px", marginTop: "8px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>Reference — always available</p>
        <GroupedDataReveal />
        <Reveal label="🔢 Position formula — the shortcut method (seen online & in class)">
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 12px" }}>
            Some teachers and websites find quartiles using a <strong>position formula</strong> instead of splitting the list. Both methods are valid — but they can give slightly different answers, which is why you might see a different result online.
          </p>

          {/* Formula cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
            {[
              { label: "Median", formula: "(n + 1) ÷ 2", color: C.accent },
              { label: "Q1", formula: "(n + 1) ÷ 4", color: "#7c3aed" },
              { label: "Q3", formula: "3(n + 1) ÷ 4", color: "#0891b2" },
            ].map(({ label, formula, color }) => (
              <div key={label} style={{ background: "#fff", border: `2px solid ${color}30`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ fontSize: "12px", fontWeight: "800", color: C.text, margin: 0 }}>{formula}</p>
              </div>
            ))}
          </div>

          {/* Worked example — n=25 like the stem & leaf question */}
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 10px" }}>
              📋 Worked example — n = 25 (like a stem &amp; leaf with 25 values)
            </p>
            {[
              {
                label: "Median position",
                calc: "(25 + 1) ÷ 2 = 13",
                result: "→ The 13th value in the ordered list",
                color: C.accent,
              },
              {
                label: "Q1 position",
                calc: "(25 + 1) ÷ 4 = 6.5",
                result: "→ Average the 6th and 7th values",
                color: "#7c3aed",
              },
              {
                label: "Q3 position",
                calc: "3 × (25 + 1) ÷ 4 = 19.5",
                result: "→ Average the 19th and 20th values",
                color: "#0891b2",
              },
            ].map(({ label, calc, result, color }) => (
              <div key={label} style={{ display: "flex", gap: "10px", marginBottom: "10px", paddingBottom: "10px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: "8px", borderRadius: "4px", background: color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, margin: "0 0 2px", fontFamily: "monospace" }}>{calc}</p>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>{result}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Why methods can differ */}
          <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#92400e", margin: "0 0 4px" }}>⭐ Why do I sometimes get a different answer online?</p>
            <p style={{ fontSize: "12px", color: "#78350f", lineHeight: 1.6, margin: 0 }}>
              With certain list sizes, the two methods land on slightly different values. <strong>Neither answer is mathematically wrong</strong> — they use different conventions. However, <strong>Edexcel exam questions are designed around the split method</strong>, and mark schemes include a range of acceptable values to cover both. In practice, both answers would be marked correct. But to be safe in an exam: use the split method.
            </p>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ fontSize: "12px", color: "#15803d", margin: 0, lineHeight: 1.6 }}>
              ✓ <strong>Quick check:</strong> For n = 25, the position formula gives Q1 at position 6.5 — meaning average the 6th and 7th values in your ordered list. Count carefully up the stem &amp; leaf!
            </p>
          </div>
        </Reveal>

        <Reveal label="❓ What if there's no middle number? (odd vs even values)">
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
            For GCSE you can get either an odd or even number of values. The method changes slightly.
          </p>
          <MedianDemo />
        </Reveal>
        <Reveal label="📖 Glossary — definitions of every term">
          {GLOSSARY.map(({ term, abbr, definition, position, formula }) => (
            <div key={term} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: C.accent }}>{term}</span>
                {abbr && <span style={{ fontSize: "11px", fontWeight: "700", color: C.accent, background: "#fff", padding: "1px 7px", borderRadius: "99px", border: `1px solid ${C.accent}40` }}>{abbr}</span>}
              </div>
              <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.65 }}>{definition}</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: C.muted, fontStyle: "italic" }}>📍 {position}</span>
                <span style={{ fontSize: "11px", color: C.muted, fontStyle: "italic" }}>🧮 {formula}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      {showAll && openInterpret && BreakoutPill && (
        <BreakoutPill type="interpret" label="Now interpret it yourself" onClick={openInterpret} />
      )}

      {nav}
    </div>
  );
}