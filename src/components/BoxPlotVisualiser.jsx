import React, { useState } from "react";

// ── Colour palette ────────────────────────────────────────────────────────
const C = {
  bg:        "#0f1923",
  surface:   "#1a2535",
  card:      "#1e2d40",
  border:    "#2a3f58",
  accent:    "#00d4aa",
  accentDim: "#00d4aa30",
  amber:     "#f59e0b",
  red:       "#ef4444",
  text:      "#e2e8f0",
  muted:     "#64748b",
  white:     "#ffffff",
};

// ── Real world scenarios ──────────────────────────────────────────────────
const HOSPITAL_SCENARIOS = [
  {
    id: "waiting",
    icon: "🏥",
    world: "Hospital",
    title: "A&E Waiting Times",
    subtitle: "Two hospital trusts, one Monday morning",
    unit: "minutes",
    context: "Hospital managers use box plots to compare patient waiting times across different A&E departments. A smaller IQR means more consistent service — patients can roughly predict how long they'll wait. A lower median means shorter waits on average. NHS targets require 95% of patients to be seen within 4 hours, so spotting which trust is struggling matters enormously.",
    whyBoxPlot: "A single average (mean) would be misleading here — one very long wait drags the mean up. The median and IQR give a fairer picture of the typical patient experience.",
    sets: [
      { label: "St. Mary's Hospital", min: 12, q1: 28, median: 41, q3: 67, max: 124, color: "#00d4aa" },
      { label: "Royal Infirmary",     min: 8,  q1: 35, median: 58, q3: 72, max: 98,  color: "#f59e0b" },
    ],
  },
  {
    id: "salaries",
    icon: "💼",
    world: "Business",
    title: "Staff Salaries",
    subtitle: "Two companies in the same industry",
    unit: "£ thousands per year",
    context: "HR departments and job seekers use box plots to compare salary distributions across companies. A higher median means better typical pay. But a large IQR means pay is very unequal — a few people earn a lot while others earn much less. Two companies can have the same median salary but very different experiences for employees depending on the spread.",
    whyBoxPlot: "Salary data almost always has outliers — a CEO earning £500k would inflate the mean wildly. Box plots show what most employees actually earn, not what the average is pulled up to by a handful of very high earners.",
    sets: [
      { label: "TechCorp Ltd",      min: 24, q1: 32, median: 44, q3: 61, max: 148, color: "#00d4aa" },
      { label: "Meridian Services", min: 21, q1: 29, median: 42, q3: 52, max:  78, color: "#f59e0b" },
    ],
  },
  {
    id: "science",
    icon: "🔬",
    world: "Science",
    title: "Plant Growth Experiment",
    subtitle: "Two fertilisers tested on identical seedlings",
    unit: "cm (height after 4 weeks)",
    context: "Scientists use box plots to compare results from two experimental conditions. Here, two fertilisers are tested on 30 identical seedlings each. A higher median means the fertiliser produced taller plants on average. A smaller IQR means the results were more consistent — the fertiliser worked reliably, not just for some plants. Scientists care about both — a treatment that works brilliantly for some but not others is less useful than one that works consistently for all.",
    whyBoxPlot: "In experiments you always get variation — not every plant grows the same. Box plots show both the typical result AND how reliable it was, which a single number like the mean cannot do alone.",
    sets: [
      { label: "Fertiliser A (standard)", min: 8,  q1: 14, median: 19, q3: 25, max: 38, color: "#00d4aa" },
      { label: "Fertiliser B (new)",      min: 11, q1: 18, median: 26, q3: 31, max: 41, color: "#f59e0b" },
    ],
  },
];

// ── Exam practice questions (from MathsGenie style) ───────────────────────
const EXAM_QUESTIONS = [
  {
    id: "q1",
    question: "The table shows information about the heights (cm) of some plants.",
    data: { min: 11, q1: 28, median: 37, q3: 42, max: 51 },
    scaleMin: 0, scaleMax: 60,
    unit: "Height (cm)",
  },
  {
    id: "q2",
    question: "The times (seconds) of 15 students running a race are listed below. Find the 5 values and draw the box plot.",
    rawData: [52, 54, 54, 55, 58, 58, 59, 60, 60, 61, 61, 64, 67, 70, 75],
    data: { min: 52, q1: 56.5, median: 60, q3: 65.5, max: 75 },
    scaleMin: 50, scaleMax: 80,
    unit: "Time (s)",
  },
  {
    id: "q3",
    question: "The weights (kg) of 11 pigs are listed below. Find the 5 values and draw the box plot.",
    rawData: [48, 55, 59, 65, 69, 69, 72, 74, 80, 81, 91],
    data: { min: 48, q1: 59, median: 69, q3: 77, max: 91 },
    scaleMin: 40, scaleMax: 100,
    unit: "Weight (kg)",
  },
];

// ── SVG Box Plot renderer ─────────────────────────────────────────────────
function BoxPlotSVG({ sets, scaleMin, scaleMax, unit, height = 180, showLabels = true }) {
  const W = 560;
  const padL = 20;
  const padR = 20;
  const plotW = W - padL - padR;
  const rowH = showLabels ? 60 : 50;
  const whiskerY = rowH / 2;
  const boxH = 28;

  const toX = (v) => padL + ((v - scaleMin) / (scaleMax - scaleMin)) * plotW;

  // tick marks
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount }, (_, i) =>
    scaleMin + Math.round((i / (tickCount - 1)) * (scaleMax - scaleMin))
  );

  const svgH = sets.length * rowH + 40; // 40 for axis

  return (
    <svg
      viewBox={`0 0 ${W} ${svgH}`}
      style={{ width: "100%", fontFamily: "'DM Mono', monospace", overflow: "visible" }}
    >
      {/* Grid lines */}
      {ticks.map((t) => (
        <line
          key={t}
          x1={toX(t)} y1={0}
          x2={toX(t)} y2={sets.length * rowH}
          stroke={C.border} strokeWidth="1" strokeDasharray="4,4"
        />
      ))}

      {/* Box plots */}
      {sets.map((s, i) => {
        const y = i * rowH + rowH / 2;
        const x1 = toX(s.min);
        const xq1 = toX(s.q1);
        const xm = toX(s.median);
        const xq3 = toX(s.q3);
        const x2 = toX(s.max);
        const bTop = y - boxH / 2;
        const bBot = y + boxH / 2;

        return (
          <g key={s.label}>
            {/* Label */}
            {showLabels && (
              <text x={padL} y={y - boxH / 2 - 6} fill={s.color} fontSize="11" fontWeight="600">
                {s.label}
              </text>
            )}
            {/* Min whisker line */}
            <line x1={x1} y1={y} x2={xq1} y2={y} stroke={s.color} strokeWidth="2" />
            {/* Min cap */}
            <line x1={x1} y1={bTop + 8} x2={x1} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            {/* Max whisker line */}
            <line x1={xq3} y1={y} x2={x2} y2={y} stroke={s.color} strokeWidth="2" />
            {/* Max cap */}
            <line x1={x2} y1={bTop + 8} x2={x2} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            {/* Box */}
            <rect
              x={xq1} y={bTop} width={xq3 - xq1} height={boxH}
              fill={s.color + "25"} stroke={s.color} strokeWidth="2" rx="3"
            />
            {/* Median line */}
            <line x1={xm} y1={bTop} x2={xm} y2={bBot} stroke={s.color} strokeWidth="3" />

            {/* Value labels on hover — shown as small text below */}
            <text x={x1}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.min}</text>
            <text x={xq1} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q1}</text>
            <text x={xm}  y={bBot + 13} fill={s.color} fontSize="9" textAnchor="middle" fontWeight="700">{s.median}</text>
            <text x={xq3} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q3}</text>
            <text x={x2}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.max}</text>
          </g>
        );
      })}

      {/* Axis line */}
      <line
        x1={padL} y1={sets.length * rowH + 2}
        x2={W - padR} y2={sets.length * rowH + 2}
        stroke={C.border} strokeWidth="1.5"
      />
      {/* Axis ticks + labels */}
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={toX(t)} y1={sets.length * rowH + 2}
            x2={toX(t)} y2={sets.length * rowH + 8}
            stroke={C.muted} strokeWidth="1.5"
          />
          <text
            x={toX(t)} y={sets.length * rowH + 20}
            fill={C.muted} fontSize="10" textAnchor="middle"
          >
            {t}
          </text>
        </g>
      ))}
      {/* Axis unit label */}
      <text
        x={W / 2} y={svgH - 2}
        fill={C.muted} fontSize="10" textAnchor="middle"
      >
        {unit}
      </text>
    </svg>
  );
}

// ── Stats comparison table ────────────────────────────────────────────────
function CompareTable({ sets, unit }) {
  const iqr = (s) => s.q3 - s.q1;
  const range = (s) => s.max - s.min;

  return (
    <div style={{ overflowX: "auto", marginTop: "16px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: "500", borderBottom: `1px solid ${C.border}` }}>
              Measure
            </th>
            {sets.map((s) => (
              <th key={s.label} style={{ textAlign: "center", padding: "8px 12px", color: s.color, fontWeight: "600", borderBottom: `1px solid ${C.border}` }}>
                {s.label}
              </th>
            ))}
            <th style={{ textAlign: "center", padding: "8px 12px", color: C.muted, fontWeight: "500", borderBottom: `1px solid ${C.border}` }}>
              Better?
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Median (average)", fn: (s) => s.median, lower: true },
            { label: "IQR (consistency)", fn: iqr, lower: true },
            { label: "Range (total spread)", fn: range, lower: true },
            { label: "Minimum", fn: (s) => s.min, lower: true },
            { label: "Maximum", fn: (s) => s.max, lower: true },
          ].map(({ label, fn, lower }) => {
            const vals = sets.map(fn);
            const bestIdx = lower
              ? vals.indexOf(Math.min(...vals))
              : vals.indexOf(Math.max(...vals));
            return (
              <tr key={label}>
                <td style={{ padding: "8px 12px", color: C.text, borderBottom: `1px solid ${C.border}20` }}>
                  {label}
                </td>
                {vals.map((v, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "8px 12px", color: i === bestIdx ? sets[i].color : C.muted, fontWeight: i === bestIdx ? "700" : "400", borderBottom: `1px solid ${C.border}20` }}>
                    {v} {unit.split(" ")[0] === unit ? "" : ""}
                  </td>
                ))}
                <td style={{ textAlign: "center", padding: "8px 12px", color: sets[bestIdx].color, fontWeight: "600", borderBottom: `1px solid ${C.border}20`, fontSize: "12px" }}>
                  {sets[bestIdx].label.split(" ")[0]} ✓
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Exam sentence builder ─────────────────────────────────────────────────
function ExamSentenceBuilder({ sets }) {
  const iqr = (s) => s.q3 - s.q1;
  const a = sets[0];
  const b = sets[1];
  const medA = a.median;
  const medB = b.median;
  const iqrA = iqr(a);
  const iqrB = iqr(b);
  const higherMed = medA > medB ? a : b;
  const lowerIQR  = iqrA < iqrB ? a : b;

  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px 16px", marginTop: "16px" }}>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
        ✍️ How to write your exam answer
      </p>
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
        <strong style={{ color: C.accent }}>Median:</strong>{" "}
        "{higherMed.label} had a higher median ({Math.max(medA, medB)}) compared to {(higherMed === a ? b : a).label} ({Math.min(medA, medB)}), so {higherMed.label} had a higher average."
      </p>
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
        <strong style={{ color: C.amber }}>IQR:</strong>{" "}
        "{lowerIQR.label} had a smaller IQR ({Math.min(iqrA, iqrB)}) compared to {(lowerIQR === a ? b : a).label} ({Math.max(iqrA, iqrB)}), so {lowerIQR.label} was more consistent."
      </p>
    </div>
  );
}

// ── Exam practice mode ────────────────────────────────────────────────────
function ExamPractice({ question, onBack }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>
        ← Back
      </button>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.muted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Exam Question</p>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.6, marginBottom: "12px" }}>{question.question}</p>
        {question.rawData && (
          <div style={{ background: C.surface, borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: C.accent, fontFamily: "monospace", letterSpacing: "0.03em" }}>
            {question.rawData.join("   ")}
          </div>
        )}
        {!question.rawData && question.data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginTop: "8px" }}>
            {[
              { label: "Min", val: question.data.min },
              { label: "Q1", val: question.data.q1 },
              { label: "Median", val: question.data.median },
              { label: "Q3", val: question.data.q3 },
              { label: "Max", val: question.data.max },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: C.surface, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
                <p style={{ fontSize: "15px", fontWeight: "700", color: C.accent, margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "12px", fontStyle: "italic" }}>
        Try sketching the box plot yourself first, then reveal the answer below.
      </p>

      <button
        onClick={() => setRevealed(!revealed)}
        style={{ width: "100%", padding: "12px", background: revealed ? C.accentDim : C.accent, color: revealed ? C.accent : C.bg, border: `1px solid ${C.accent}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "16px" }}
      >
        {revealed ? "Hide answer" : "Reveal answer & box plot"}
      </button>

      {revealed && (
        <div>
          {/* Show the 5 values if raw data was given */}
          {question.rawData && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: C.muted, fontWeight: "600", textTransform: "uppercase", marginBottom: "10px" }}>Step by step</p>
              <p style={{ fontSize: "13px", color: C.text, marginBottom: "6px" }}>
                <strong style={{ color: C.accent }}>1. Order the data:</strong><br />
                <span style={{ fontFamily: "monospace", color: C.muted }}>
                  {[...question.rawData].sort((a, b) => a - b).join("  ")}
                </span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginTop: "10px" }}>
                {[
                  { label: "Min", val: question.data.min },
                  { label: "Q1", val: question.data.q1 },
                  { label: "Median", val: question.data.median },
                  { label: "Q3", val: question.data.q3 },
                  { label: "Max", val: question.data.max },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: C.surface, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
                    <p style={{ fontSize: "15px", fontWeight: "700", color: C.accent, margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* The actual box plot */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px" }}>
            <BoxPlotSVG
              sets={[{ ...question.data, label: "Your answer", color: C.accent }]}
              scaleMin={question.scaleMin}
              scaleMax={question.scaleMax}
              unit={question.unit}
              showLabels={false}
            />
          </div>
          <div style={{ background: "#052e1c", border: "1px solid #16a34a40", borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", marginBottom: "6px" }}>IQR for this data</p>
            <p style={{ fontSize: "14px", color: C.text, margin: 0 }}>
              IQR = Q3 − Q1 = {question.data.q3} − {question.data.q1} = <strong style={{ color: "#4ade80" }}>{question.data.q3 - question.data.q1}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BUILD IT questions ────────────────────────────────────────────────────
const BUILD_QUESTIONS = [
  {
    id: "b1",
    label: "Starter",
    question: "Heights (cm) of 9 students:",
    rawData: [142, 148, 151, 155, 158, 163, 167, 171, 180],
    answer: { min: 142, q1: 151, median: 158, q3: 167, max: 180 },
    scaleMin: 130, scaleMax: 190, unit: "Height (cm)",
    hint: "9 values — the median is the 5th value. Q1 is the 3rd, Q3 is the 7th.",
  },
  {
    id: "b2",
    label: "Practice",
    question: "Times (seconds) for 11 swimmers to complete a length:",
    rawData: [34, 37, 39, 41, 43, 45, 48, 52, 55, 59, 64],
    answer: { min: 34, q1: 39, median: 45, q3: 55, max: 64 },
    scaleMin: 30, scaleMax: 70, unit: "Time (s)",
    hint: "11 values — the median is the 6th. Q1 is the 3rd, Q3 is the 9th.",
  },
  {
    id: "b3",
    label: "Challenge",
    question: "Scores in a maths test for 13 students:",
    rawData: [12, 18, 22, 25, 28, 31, 34, 36, 41, 45, 48, 52, 58],
    answer: { min: 12, q1: 25, median: 34, q3: 45, max: 58 },
    scaleMin: 0, scaleMax: 70, unit: "Score (marks)",
    hint: "13 values — the median is the 7th. Q1 is the 4th, Q3 is the 10th.",
  },
];

const TOLERANCE = 3; // how many units either side counts as correct

// ── Stage 1: Tap-to-order ─────────────────────────────────────────────────
function StageOrder({ q, onComplete }) {
  const shuffled = React.useMemo(() =>
    [...q.rawData].sort(() => Math.random() - 0.5), [q]);

  const [remaining, setRemaining] = useState(shuffled);
  const [ordered,   setOrdered]   = useState([]);
  const [shake,     setShake]     = useState(null); // index of wrong tile

  const sorted = [...q.rawData].sort((a, b) => a - b);
  const nextCorrect = sorted[ordered.length];

  const handleTap = (val, idx) => {
    if (val === nextCorrect) {
      setOrdered(prev => [...prev, val]);
      setRemaining(prev => prev.filter((_, i) => i !== idx));
    } else {
      setShake(idx);
      setTimeout(() => setShake(null), 500);
    }
  };

  const allDone = ordered.length === q.rawData.length;

  return (
    <div>
      {/* Progress indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Stage 1 of 3 — Order It
        </p>
        <span style={{ fontSize: "12px", color: C.muted }}>{ordered.length} / {q.rawData.length} placed</span>
      </div>

      {/* Instruction */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
          {q.label} — {q.question}
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>
          Tap the numbers <strong>one at a time</strong>, smallest first. Build the ordered list from left to right.
        </p>
      </div>

      {/* Ordered row — fills as she taps */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", minHeight: "56px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ordered list (smallest → largest)</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "32px" }}>
          {ordered.map((val, i) => {
            const isMin    = i === 0;
            const isMax    = i === q.rawData.length - 1;
            const midIdx   = Math.floor(q.rawData.length / 2);
            const isMedian = i === midIdx;
            const q1idx    = Math.floor(q.rawData.length / 4);
            const q3idx    = Math.floor((3 * q.rawData.length) / 4);
            const isQ1     = i === q1idx;
            const isQ3     = i === q3idx;
            const highlight = isMedian ? "#ffffff" : (isQ1 || isQ3) ? C.accent : (isMin || isMax) ? C.muted : null;
            return (
              <div key={i} style={{
                padding: "5px 10px", borderRadius: "6px",
                background: highlight ? highlight + "20" : C.card,
                border: `1px solid ${highlight || C.border}`,
                fontSize: "13px", fontWeight: highlight ? "700" : "400",
                color: highlight || C.text,
                transition: "all 0.2s",
              }}>
                {val}
                {isMin    && <span style={{ fontSize: "9px", display: "block", color: C.muted, lineHeight: 1 }}>min</span>}
                {isQ1     && <span style={{ fontSize: "9px", display: "block", color: C.accent, lineHeight: 1 }}>Q1</span>}
                {isMedian && <span style={{ fontSize: "9px", display: "block", color: "#ffffff", lineHeight: 1 }}>median</span>}
                {isQ3     && <span style={{ fontSize: "9px", display: "block", color: C.accent, lineHeight: 1 }}>Q3</span>}
                {isMax    && <span style={{ fontSize: "9px", display: "block", color: C.muted, lineHeight: 1 }}>max</span>}
              </div>
            );
          })}
          {ordered.length === 0 && (
            <span style={{ fontSize: "12px", color: C.muted, fontStyle: "italic" }}>Tap a number below to start…</span>
          )}
        </div>
      </div>

      {/* Remaining tiles */}
      {!allDone && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {remaining.map((val, i) => (
            <button
              key={i}
              onClick={() => handleTap(val, i)}
              style={{
                padding: "10px 16px", borderRadius: "8px",
                background: shake === i ? "#ef444420" : C.card,
                border: `1px solid ${shake === i ? C.red : C.border}`,
                color: shake === i ? C.red : C.text,
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                transform: shake === i ? "translateX(4px)" : "none",
                transition: "all 0.1s",
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      {/* Success state */}
      {allDone && (
        <div>
          <div style={{ background: "#052e1c", border: "1px solid #16a34a40", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80", margin: "0 0 4px" }}>
              ✓ Perfectly ordered!
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>
              The labels have appeared automatically — notice where Min, Q1, Median, Q3 and Max sit in the list. Now let's use those values.
            </p>
          </div>
          <button
            onClick={onComplete}
            style={{ width: "100%", padding: "14px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
          >
            Continue to Stage 2 →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Stage 2: Identify the 5 values ───────────────────────────────────────
function StageFive({ q, onComplete }) {
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const KEYS = ["min", "q1", "median", "q3", "max"];
  const LABELS = { min: "Minimum", q1: "Q1 (Lower Quartile)", median: "Median", q3: "Q3 (Upper Quartile)", max: "Maximum" };
  const DESCRIPTIONS = {
    min:    "The smallest value in the ordered list",
    q1:     "The middle of the lower half",
    median: "The middle value of the whole list",
    q3:     "The middle of the upper half",
    max:    "The largest value in the ordered list",
  };

  const [inputs, setInputs]   = useState({ min: "", q1: "", median: "", q3: "", max: "" });
  const [checked, setChecked] = useState(false);

  const results = KEYS.map(k => ({
    key: k,
    yours: parseInt(inputs[k]),
    correct: q.answer[k],
    ok: parseInt(inputs[k]) === q.answer[k],
  }));
  const allOk = results.every(r => r.ok);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Stage 2 of 3 — Find the 5 Values
        </p>
      </div>

      {/* Ordered list for reference */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your ordered list</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sorted.map((val, i) => (
            <div key={i} style={{ padding: "5px 10px", borderRadius: "6px", background: C.card, border: `1px solid ${C.border}`, fontSize: "13px", color: C.text }}>
              <span style={{ fontSize: "10px", color: C.muted, display: "block", lineHeight: 1 }}>{i + 1}</span>
              {val}
            </div>
          ))}
        </div>
      </div>

      {/* Input fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {KEYS.map(k => {
          const r = results.find(r => r.key === k);
          const showResult = checked;
          return (
            <div key={k} style={{
              background: showResult ? (r.ok ? "#052e1c" : "#2d0a0a") : C.card,
              border: `1px solid ${showResult ? (r.ok ? "#16a34a60" : "#ef444460") : C.border}`,
              borderRadius: "10px", padding: "12px 14px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 2px" }}>{LABELS[k]}</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>{DESCRIPTIONS[k]}</p>
              </div>
              <input
                type="number"
                value={inputs[k]}
                onChange={e => setInputs(prev => ({ ...prev, [k]: e.target.value }))}
                disabled={checked && r.ok}
                placeholder="?"
                style={{
                  width: "64px", padding: "8px", textAlign: "center",
                  background: C.surface, border: `1px solid ${showResult ? (r.ok ? "#16a34a" : C.red) : C.border}`,
                  borderRadius: "8px", color: showResult ? (r.ok ? "#4ade80" : C.red) : C.text,
                  fontSize: "16px", fontWeight: "700",
                }}
              />
              {showResult && (
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{r.ok ? "✓" : "✗"}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Check */}
      {!checked && (
        <button
          onClick={() => setChecked(true)}
          style={{ width: "100%", padding: "13px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "8px" }}
        >
          Check my answers
        </button>
      )}

      {checked && !allOk && (
        <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>
            Fix the values marked ✗ above, then continue.
          </p>
        </div>
      )}

      {checked && (
        <button
          onClick={() => { if (allOk) onComplete(q.answer); else { setChecked(false); } }}
          style={{ width: "100%", padding: "13px", background: allOk ? C.accent : C.surface, color: allOk ? C.bg : C.muted, border: allOk ? "none" : `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
        >
          {allOk ? "Continue to Stage 3 →" : "Try again"}
        </button>
      )}
    </div>
  );
}

// ── Stage 3: Drag-to-place ────────────────────────────────────────────────
function StageDrag({ q, onBack }) {
  const initVals = (q) => ({
    min:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.15),
    q1:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.30),
    median: q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.50),
    q3:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.70),
    max:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.85),
  });

  const [vals, setVals]           = useState(initVals(q));
  const [dragging, setDragging]   = useState(null);
  const [checked, setChecked]     = useState(false);
  const [showHint, setShowHint]   = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const svgRef = React.useRef(null);

  const reset = () => { setVals(initVals(q)); setChecked(false); setShowHint(false); setShowAnswer(false); };

  const SVG_W = 520; const PAD_L = 24; const PAD_R = 24;
  const PLOT_W = SVG_W - PAD_L - PAD_R;
  const MID_Y = 60; const BOX_H = 32;

  const toX   = (v) => PAD_L + ((v - q.scaleMin) / (q.scaleMax - q.scaleMin)) * PLOT_W;
  const toVal = (x) => q.scaleMin + ((x - PAD_L) / PLOT_W) * (q.scaleMax - q.scaleMin);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onPointerDown = (e, key) => {
    e.preventDefault();
    svgRef.current.setPointerCapture(e.pointerId);
    setDragging({ key });
  };
  const onPointerMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    let newVal = Math.round(toVal(svgX));
    setVals((prev) => {
      const next = { ...prev };
      if (dragging.key === "min")    newVal = clamp(newVal, q.scaleMin, prev.q1 - 1);
      if (dragging.key === "q1")     newVal = clamp(newVal, prev.min + 1, prev.median - 1);
      if (dragging.key === "median") newVal = clamp(newVal, prev.q1 + 1, prev.q3 - 1);
      if (dragging.key === "q3")     newVal = clamp(newVal, prev.median + 1, prev.max - 1);
      if (dragging.key === "max")    newVal = clamp(newVal, prev.q3 + 1, q.scaleMax);
      next[dragging.key] = newVal;
      return next;
    });
  };
  const onPointerUp = () => setDragging(null);

  const HANDLE_LABELS = { min: "Min", q1: "Q1", median: "Med", q3: "Q3", max: "Max" };
  const HANDLE_COLORS = { min: "#64748b", q1: "#00d4aa", median: "#ffffff", q3: "#00d4aa", max: "#64748b" };
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount }, (_, i) =>
    Math.round(q.scaleMin + (i / (tickCount - 1)) * (q.scaleMax - q.scaleMin)));

  const score = Object.keys(q.answer).map((k) => ({
    key: k, correct: Math.abs(vals[k] - q.answer[k]) <= TOLERANCE,
    yours: vals[k], answer: q.answer[k],
  }));
  const allCorrect = score.every(s => s.correct);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Stage 3 of 3 — Place It
        </p>
      </div>

      {/* Reference — the 5 correct values from stage 2 */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {Object.entries(q.answer).map(([k, v]) => (
          <div key={k} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "6px 10px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{HANDLE_LABELS[k]}</p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "13px", color: C.text, marginBottom: "16px" }}>
        Now drag each handle to its correct position on the number line.
      </p>

      {/* Interactive SVG */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px", touchAction: "none" }}>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: "12px", textAlign: "center" }}>
          Drag each handle to the right position ↔
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} 135`}
          style={{ width: "100%", overflow: "visible", cursor: dragging ? "grabbing" : "default", userSelect: "none" }}
          onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        >
          {ticks.map((t) => (
            <line key={t} x1={toX(t)} y1={10} x2={toX(t)} y2={MID_Y + BOX_H / 2 + 4} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
          ))}
          <line x1={toX(vals.min)} y1={MID_Y} x2={toX(vals.q1)} y2={MID_Y} stroke={C.accent} strokeWidth="2" />
          <line x1={toX(vals.min)} y1={MID_Y - 10} x2={toX(vals.min)} y2={MID_Y + 10} stroke={C.accent} strokeWidth="2.5" />
          <line x1={toX(vals.q3)} y1={MID_Y} x2={toX(vals.max)} y2={MID_Y} stroke={C.accent} strokeWidth="2" />
          <line x1={toX(vals.max)} y1={MID_Y - 10} x2={toX(vals.max)} y2={MID_Y + 10} stroke={C.accent} strokeWidth="2.5" />
          <rect x={toX(vals.q1)} y={MID_Y - BOX_H / 2} width={Math.max(0, toX(vals.q3) - toX(vals.q1))} height={BOX_H} fill={C.accent + "20"} stroke={C.accent} strokeWidth="2" rx="3" />
          <line x1={toX(vals.median)} y1={MID_Y - BOX_H / 2} x2={toX(vals.median)} y2={MID_Y + BOX_H / 2} stroke={C.white} strokeWidth="3" />
          <line x1={PAD_L} y1={MID_Y + BOX_H / 2 + 6} x2={SVG_W - PAD_R} y2={MID_Y + BOX_H / 2 + 6} stroke={C.border} strokeWidth="1.5" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={toX(t)} y1={MID_Y + BOX_H / 2 + 6} x2={toX(t)} y2={MID_Y + BOX_H / 2 + 12} stroke={C.muted} strokeWidth="1.5" />
              <text x={toX(t)} y={MID_Y + BOX_H / 2 + 24} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
            </g>
          ))}
          <text x={SVG_W / 2} y={133} fill={C.muted} fontSize="10" textAnchor="middle">{q.unit}</text>
          {Object.entries(HANDLE_LABELS).map(([key, label]) => {
            const x = toX(vals[key]);
            const isActive = dragging?.key === key;
            return (
              <g key={key} style={{ cursor: "grab" }} onPointerDown={(e) => onPointerDown(e, key)}>
                <rect x={x - 14} y={MID_Y - BOX_H / 2 - 22} width={28} height={BOX_H + 44} fill="transparent" />
                <rect x={x - 14} y={MID_Y - BOX_H / 2 - 22} width={28} height={18} fill={isActive ? C.accent : C.surface} stroke={HANDLE_COLORS[key]} strokeWidth="1.5" rx="4" />
                <text x={x} y={MID_Y - BOX_H / 2 - 8} fill={isActive ? C.bg : HANDLE_COLORS[key]} fontSize="9" fontWeight="700" textAnchor="middle">{label}</text>
                <text x={x} y={MID_Y + BOX_H / 2 + 38} fill={isActive ? C.accent : C.muted} fontSize="10" fontWeight={isActive ? "700" : "400"} textAnchor="middle">{vals[key]}</text>
                <polygon points={`${x},${MID_Y - BOX_H / 2 - 4} ${x + 6},${MID_Y} ${x},${MID_Y + BOX_H / 2 + 4} ${x - 6},${MID_Y}`} fill={isActive ? C.accent : C.card} stroke={HANDLE_COLORS[key]} strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hint */}
      <button onClick={() => setShowHint(!showHint)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", color: C.muted, fontSize: "12px", cursor: "pointer", marginBottom: "8px", width: "100%" }}>
        {showHint ? "Hide hint" : "💡 Show hint"}
      </button>
      {showHint && (
        <div style={{ background: C.surface, borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>{q.hint}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={() => setChecked(true)} style={{ flex: 2, padding: "13px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          Check my answer
        </button>
        <button onClick={reset} style={{ flex: 1, padding: "13px", background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
          Reset
        </button>
      </div>

      {checked && (
        <div style={{ background: allCorrect ? "#052e1c" : C.card, border: `1px solid ${allCorrect ? "#16a34a60" : C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: allCorrect ? "#4ade80" : C.amber, marginBottom: "12px" }}>
            {allCorrect ? "🎉 All three stages complete! Great work." : "Here's how you did:"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {score.map(({ key, correct, yours, answer }) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: correct ? "#16a34a15" : "#ef444415", borderRadius: "8px" }}>
                <span style={{ fontSize: "13px", color: C.text, fontWeight: "600" }}>{HANDLE_LABELS[key]}</span>
                <span style={{ fontSize: "13px", color: C.muted }}>Yours: <strong style={{ color: correct ? "#4ade80" : C.red }}>{yours}</strong></span>
                {!correct && <span style={{ fontSize: "13px", color: C.muted }}>Correct: <strong style={{ color: C.accent }}>{answer}</strong></span>}
                <span style={{ fontSize: "16px" }}>{correct ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
          {!allCorrect && (
            <button onClick={() => setShowAnswer(!showAnswer)} style={{ marginTop: "12px", width: "100%", padding: "10px", background: "transparent", border: `1px solid ${C.accent}`, borderRadius: "8px", color: C.accent, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {showAnswer ? "Hide correct box plot" : "Show correct box plot"}
            </button>
          )}
          {showAnswer && !allCorrect && (
            <div style={{ marginTop: "12px", background: C.surface, borderRadius: "10px", padding: "14px" }}>
              <BoxPlotSVG sets={[{ ...q.answer, label: "Correct answer", color: C.accent }]} scaleMin={q.scaleMin} scaleMax={q.scaleMax} unit={q.unit} showLabels={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BuildIt — orchestrates the 3 stages ──────────────────────────────────
function BuildIt() {
  const [qIdx, setQIdx]   = useState(null);
  const [stage, setStage] = useState(1); // 1 | 2 | 3

  const q = qIdx !== null ? BUILD_QUESTIONS[qIdx] : null;

  const startQ = (idx) => { setQIdx(idx); setStage(1); };

  // Question picker
  if (qIdx === null) {
    return (
      <div>
        <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
          Each question has <strong style={{ color: C.text }}>3 stages</strong>: order the data → find the 5 values → drag to build the box plot.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BUILD_QUESTIONS.map((bq, i) => (
            <button key={bq.id} onClick={() => startQ(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "99px", background: i === 0 ? "#ecfdf520" : i === 1 ? "#fffbeb20" : "#fef2f220", color: i === 0 ? C.accent : i === 1 ? C.amber : C.red, border: `1px solid ${i === 0 ? C.accent : i === 1 ? C.amber : C.red}40`, marginRight: "10px" }}>{bq.label}</span>
                <span style={{ fontSize: "13px", color: C.text }}>{bq.question}</span>
              </span>
              <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>→</span>
            </button>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
            💡 <strong style={{ color: C.text }}>Remember:</strong> always order the data first — it's the step most students skip and it's where errors start.
          </p>
        </div>
      </div>
    );
  }

  // Stage progress bar
  const StageBar = () => (
    <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
      {[
        { n: 1, label: "Order It" },
        { n: 2, label: "Find Values" },
        { n: 3, label: "Place It" },
      ].map(({ n, label }) => (
        <div key={n} style={{ flex: 1, padding: "8px 6px", borderRadius: "8px", background: stage >= n ? (stage === n ? C.accent : C.accentDim) : C.surface, border: `1px solid ${stage >= n ? C.accent : C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: stage >= n ? (stage === n ? C.bg : C.accent) : C.muted, margin: 0 }}>{n}. {label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <button onClick={() => setQIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>
        ← Back to questions
      </button>
      <StageBar />
      {stage === 1 && <StageOrder q={q} onComplete={() => setStage(2)} />}
      {stage === 2 && <StageFive  q={q} onComplete={() => setStage(3)} />}
      {stage === 3 && <StageDrag  q={q} onBack={() => setQIdx(null)} />}
    </div>
  );
}

// ── Generate a realistic ordered list of 20 values that hits the 5 key points ──
function generateSampleData(s) {
  // 20 values: positions 1,5,10,15,20 are min,q1,median,q3,max
  // Fill the gaps with evenly spaced values + small jitter
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const vals = [];
  // segment 1: positions 1–5  (min → q1)
  for (let i = 0; i < 5; i++) vals.push(lerp(s.min, s.q1, i / 4));
  // segment 2: positions 6–10 (q1 → median)
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q1, s.median, i / 5));
  // segment 3: positions 11–15 (median → q3)
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.median, s.q3, i / 5));
  // segment 4: positions 16–20 (q3 → max)
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q3, s.max, i / 5));
  return vals; // already ordered, 20 values
}

// ── Ordered data table with highlighted positions ─────────────────────────
function OrderedDataTable({ s, unit }) {
  const [expanded, setExpanded] = useState(false);
  const data = generateSampleData(s);

  // which positions are special (0-indexed)
  const special = {
    0:  { role: "Minimum",        color: C.muted,  bg: "#1e2d4080" },
    4:  { role: "Q1 (lower quartile — 25% below this)", color: s.color, bg: s.color + "15" },
    9:  { role: "Median (middle — 50% below this)",      color: "#ffffff", bg: "#ffffff15" },
    14: { role: "Q3 (upper quartile — 75% below this)", color: s.color, bg: s.color + "15" },
    19: { role: "Maximum",        color: C.muted,  bg: "#1e2d4080" },
  };

  const rowsToShow = expanded ? data : data.slice(0, 20);

  return (
    <div style={{ marginBottom: "8px" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: expanded ? "8px" : "0" }}
      >
        <span style={{ fontSize: "12px", fontWeight: "700", color: s.color }}>
          📋 {s.label} — see all 20 results in order
        </span>
        <span style={{ fontSize: "12px", color: C.muted }}>{expanded ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {expanded && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "40px 60px 1fr 1fr", padding: "8px 12px", borderBottom: `1px solid ${C.border}`, background: C.card }}>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>#</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>{unit.split(" ")[0]}</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>Position in list</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>What this means</span>
          </div>

          {/* Rows */}
          {rowsToShow.map((val, i) => {
            const sp = special[i];
            const isSpecial = !!sp;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 60px 1fr 1fr",
                  padding: "7px 12px",
                  background: isSpecial ? sp.bg : "transparent",
                  borderBottom: `1px solid ${C.border}20`,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "12px", color: C.muted }}>{i + 1}</span>
                <span style={{ fontSize: "13px", fontWeight: isSpecial ? "700" : "400", color: isSpecial ? sp.color : C.text }}>
                  {val}
                </span>
                <span style={{ fontSize: "11px", color: C.muted }}>
                  {i + 1} of 20
                </span>
                <span style={{ fontSize: "11px", color: isSpecial ? sp.color : C.muted, fontWeight: isSpecial ? "600" : "400" }}>
                  {isSpecial ? sp.role : "—"}
                </span>
              </div>
            );
          })}

          {/* Footer explanation */}
          <div style={{ padding: "10px 12px", background: C.card, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>Why these positions?</strong> With 20 values, the median sits between positions 10 and 11 — we average them. Q1 is the median of the bottom 10 (position 5). Q3 is the median of the top 10 (position 15).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Real World tab — clean by default, detail behind expander ─────────────
function HospitalMode({ scenario, scenarioIdx, setScenario }) {
  const [deep, setDeep] = useState(false);

  // reset expander when scenario changes
  React.useEffect(() => setDeep(false), [scenarioIdx]);

  return (
    <div>
      {/* Scenario picker */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {HOSPITAL_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setScenario(i)}
            style={{ padding: "12px 16px", background: scenarioIdx === i ? C.accentDim : C.surface, border: `1px solid ${scenarioIdx === i ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", textAlign: "left", color: scenarioIdx === i ? C.accent : C.muted, fontSize: "13px", fontWeight: scenarioIdx === i ? "700" : "400" }}
          >
            <span style={{ marginRight: "8px" }}>{s.icon}</span>
            <span style={{ fontWeight: 700 }}>{s.world}:</span> {s.title} —{" "}
            <span style={{ fontWeight: 400 }}>{s.subtitle}</span>
          </button>
        ))}
      </div>

      {/* One-line hook — always visible */}
      <div style={{ background: C.surface, borderLeft: `3px solid ${C.accent}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: C.accent }}>{scenario.icon} {scenario.world}:</strong>{" "}
          {scenario.context.split(".")[0]}. A box plot shows the spread at a glance — the chart below compares two sets of data side by side.
        </p>
      </div>

      {/* The box plot — always visible */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>{scenario.title}</p>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: "16px" }}>{scenario.subtitle}</p>
        <BoxPlotSVG
          sets={scenario.sets}
          scaleMin={Math.min(...scenario.sets.map(s => s.min)) - 5}
          scaleMax={Math.max(...scenario.sets.map(s => s.max)) + 5}
          unit={scenario.unit}
        />
      </div>

      {/* Quick key facts — always visible, 2 lines per set */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {scenario.sets.map((s) => (
          <div key={s.label} style={{ background: C.surface, borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "10px 14px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: s.color, minWidth: "120px" }}>{s.label}</span>
            <span style={{ fontSize: "12px", color: C.muted }}>Typical: <strong style={{ color: s.color }}>{s.median} {scenario.unit}</strong></span>
            <span style={{ fontSize: "12px", color: C.muted }}>Middle 50%: <strong style={{ color: s.color }}>{s.q1}–{s.q3}</strong></span>
            <span style={{ fontSize: "12px", color: C.muted }}>IQR: <strong style={{ color: s.color }}>{s.q3 - s.q1}</strong></span>
          </div>
        ))}
      </div>

      {/* Dig deeper expander */}
      <button
        onClick={() => setDeep(!deep)}
        style={{ width: "100%", padding: "12px 16px", background: deep ? C.accentDim : C.surface, border: `1px solid ${deep ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: deep ? "16px" : "0" }}
      >
        <span style={{ fontSize: "13px", fontWeight: "700", color: deep ? C.accent : C.text }}>
          🔍 Dig deeper — understand every number
        </span>
        <span style={{ fontSize: "12px", color: C.muted }}>{deep ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {/* All the detail — hidden by default */}
      {deep && (
        <div>
          {/* Why box plots / why not mean */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
              {scenario.icon} {scenario.world} — why they use box plots
            </p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
              {scenario.context}
            </p>
            <div style={{ background: C.accentDim, borderRadius: "8px", padding: "10px 12px", borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: "12px", color: C.accent, margin: 0, lineHeight: 1.6 }}>
                <strong>Why not just use the mean?</strong> {scenario.whyBoxPlot}
              </p>
            </div>
          </div>

          {/* Plain English per set */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => {
              const iqr = s.q3 - s.q1;
              const unit = scenario.unit;
              return (
                <div key={s.label} style={{ background: C.surface, borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "12px 14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, marginBottom: "6px" }}>
                    {s.label} — what the numbers mean
                  </p>
                  <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.8, margin: 0 }}>
                    🔹 The <strong>shortest</strong> recorded was <strong style={{ color: C.text }}>{s.min} {unit}</strong> — that's the best case.<br />
                    🔹 A <strong>typical</strong> result was around <strong style={{ color: s.color }}>{s.median} {unit}</strong> — half were below this, half above.<br />
                    🔹 The <strong>middle half</strong> of all results fell between <strong style={{ color: s.color }}>{s.q1}</strong> and <strong style={{ color: s.color }}>{s.q3} {unit}</strong> — that's a spread of <strong style={{ color: s.color }}>{iqr} {unit}</strong>. This is the IQR.<br />
                    🔹 The <strong>longest</strong> recorded was <strong style={{ color: C.text }}>{s.max} {unit}</strong> — the worst case.
                  </p>
                </div>
              );
            })}
          </div>

          {/* Ordered data tables */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => (
              <OrderedDataTable key={s.label} s={s} unit={scenario.unit} />
            ))}
          </div>

          {/* 5-number breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => (
              <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, marginBottom: "10px" }}>{s.label}</p>
                {[
                  { label: "Min",    val: s.min,        plain: "Lowest value" },
                  { label: "Q1",     val: s.q1,         plain: "25% below this" },
                  { label: "Median", val: s.median,     plain: "Typical (middle)" },
                  { label: "Q3",     val: s.q3,         plain: "75% below this" },
                  { label: "Max",    val: s.max,        plain: "Highest value" },
                  { label: "IQR",    val: s.q3 - s.q1, plain: "Spread of middle 50%" },
                ].map(({ label, val, plain }) => (
                  <div key={label} style={{ paddingBottom: "6px", marginBottom: "6px", borderBottom: `1px solid ${C.border}20` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: C.muted }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: label === "Median" || label === "IQR" ? s.color : C.text }}>{val}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: C.muted, margin: "1px 0 0", fontStyle: "italic" }}>{plain}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Compare table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "2px" }}>Side-by-side comparison</p>
            <CompareTable sets={scenario.sets} unit={scenario.unit} />
          </div>

          {/* Exam sentence builder */}
          <ExamSentenceBuilder sets={scenario.sets} />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function BoxPlotVisualiser() {
  const [mode, setMode]             = useState("hospital"); // "hospital" | "exam" | "build"
  const [scenarioIdx, setScenario]  = useState(0);
  const [examIdx, setExamIdx]       = useState(null);

  const scenario = HOSPITAL_SCENARIOS[scenarioIdx];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "20px 16px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, margin: "0 0 4px" }}>
            Statistics · Box Plots
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.white, margin: "0 0 4px", lineHeight: 1.2 }}>
            Box Plot Explorer
          </h1>
          <p style={{ fontSize: "14px", color: C.muted, margin: 0 }}>
            See them in the real world, then practise exam questions
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", background: C.surface, borderRadius: "10px", padding: "4px" }}>
          {[
            { id: "hospital", label: "🌍 Real World" },
            { id: "build",    label: "🎯 Build It" },
            { id: "exam",     label: "📝 Exam" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setMode(id); setExamIdx(null); }}
              style={{ flex: 1, padding: "10px 6px", background: mode === id ? C.accent : "transparent", color: mode === id ? C.bg : C.muted, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── HOSPITAL MODE ── */}
        {mode === "hospital" && (
          <HospitalMode scenario={scenario} scenarioIdx={scenarioIdx} setScenario={setScenario} />
        )}

        {/* ── BUILD IT MODE ── */}
        {mode === "build" && <BuildIt />}

        {/* ── EXAM PRACTICE MODE ── */}
        {mode === "exam" && (
          <div>
            {examIdx !== null ? (
              <ExamPractice
                question={EXAM_QUESTIONS[examIdx]}
                onBack={() => setExamIdx(null)}
              />
            ) : (
              <div>
                <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
                  These are Edexcel-style exam questions. Sketch your box plot on paper first, then reveal the answer to check.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {EXAM_QUESTIONS.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setExamIdx(i)}
                      style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span>
                        <span style={{ fontWeight: "700", color: C.accent }}>Q{i + 1}  </span>
                        {q.question.slice(0, 70)}…
                      </span>
                      <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>→</span>
                    </button>
                  ))}
                </div>
                <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
                    💡 <strong style={{ color: C.text }}>Exam tip:</strong> Always order the data first. For an odd number of values the median is the middle one. For an even number, average the two middle values.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}