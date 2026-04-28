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
    context: "Hospital managers use box plots to compare patient waiting times across different A&E departments. A lower median means shorter waits on average. The box in the middle shows where most waiting times fall — a narrow box means patients all wait roughly the same time, a wide box means it's unpredictable. NHS targets require 95% of patients to be seen within 4 hours, so spotting which trust is struggling matters enormously. (The width of that box is what we call the IQR — explained in the comparison table below.)",
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
    context: "Scientists use box plots to compare results from two experimental conditions. Here, two fertilisers are tested on 30 identical seedlings each. A higher median means the fertiliser produced taller plants on average. A smaller IQR means the results were more consistent — the fertiliser worked reliably, not just for some plants.",
    whyBoxPlot: "In experiments you always get variation — not every plant grows the same. Box plots show both the typical result AND how reliable it was, which a single number like the mean cannot do alone.",
    sets: [
      { label: "Fertiliser A (standard)", min: 8,  q1: 14, median: 19, q3: 25, max: 38, color: "#00d4aa" },
      { label: "Fertiliser B (new)",      min: 11, q1: 18, median: 26, q3: 31, max: 41, color: "#f59e0b" },
    ],
  },
];

// ── Exam: draw a box plot ─────────────────────────────────────────────────
const EXAM_QUESTIONS = [
  {
    id: "q1",
    question: "The table shows information about the heights (cm) of some plants.",
    data: { min: 11, q1: 28, median: 37, q3: 42, max: 51 },
    scaleMin: 0, scaleMax: 60, unit: "Height (cm)",
  },
  {
    id: "q2",
    question: "The times (seconds) of 15 students running a race are listed below. Find the 5 values and draw the box plot.",
    rawData: [52, 54, 54, 55, 58, 58, 59, 60, 60, 61, 61, 64, 67, 70, 75],
    data: { min: 52, q1: 56.5, median: 60, q3: 65.5, max: 75 },
    scaleMin: 50, scaleMax: 80, unit: "Time (s)",
  },
  {
    id: "q3",
    question: "The weights (kg) of 11 pigs are listed below. Find the 5 values and draw the box plot.",
    rawData: [48, 55, 59, 65, 69, 69, 72, 74, 80, 81, 91],
    data: { min: 48, q1: 59, median: 69, q3: 77, max: 91 },
    scaleMin: 40, scaleMax: 100, unit: "Weight (kg)",
  },
];

// ── Exam: compare two box plots ───────────────────────────────────────────
const COMPARE_QUESTIONS = [
  {
    id: "c1",
    label: "Q5 — Tomato plants",
    question: "The table shows heights (cm) of Maggie's tomato plants. The box plot below shows Nigel's. Draw Maggie's box plot on the same scale, then compare the two distributions.",
    yours:  { min: 12, q1: 27, median: 35, q3: 42, max: 55 },
    theirs: { min: 8,  q1: 20, median: 30, q3: 45, max: 60 },
    theirsLabel: "Nigel's plants", yoursLabel: "Maggie's plants",
    scaleMin: 0, scaleMax: 65, unit: "Height (cm)", marks: 4,
    modelAnswer: {
      median: "Maggie's plants have a higher median (35 cm) than Nigel's (30 cm), so Maggie's plants are taller on average.",
      iqr: "Maggie's plants have a smaller IQR (15 cm) than Nigel's (25 cm), so Maggie's heights are more consistent.",
    },
  },
  {
    id: "c2",
    label: "Q6 — Maths scores",
    question: "The table shows maths scores for Class A. The box plot below shows Class B. Draw Class A's box plot, then compare the two distributions.",
    yours:  { min: 9,  q1: 15, median: 19, q3: 31, max: 43 },
    theirs: { min: 14, q1: 22, median: 32, q3: 40, max: 55 },
    theirsLabel: "Class B", yoursLabel: "Class A",
    scaleMin: 0, scaleMax: 65, unit: "Maths Score", marks: 4,
    modelAnswer: {
      median: "Class B has a higher median score (32) than Class A (19), so Class B performed better on average.",
      iqr: "Class A has a smaller IQR (16) than Class B (18), so Class A's scores were slightly more consistent.",
    },
  },
  {
    id: "c3",
    label: "Q7 — Puzzle times",
    question: "Boys' times: IQR = 8, Min = 12, Median = 18, Upper Quartile = 23, Max = 29. The box plot below shows the girls' times. Draw the boys' box plot, then compare.",
    yours:  { min: 12, q1: 15, median: 18, q3: 23, max: 29 },
    theirs: { min: 8,  q1: 12, median: 16, q3: 21, max: 27 },
    theirsLabel: "Girls", yoursLabel: "Boys",
    scaleMin: 0, scaleMax: 35, unit: "Time (minutes)", marks: 4,
    note: "Q1 is not given directly — work it out: Q1 = Q3 − IQR = 23 − 8 = 15",
    modelAnswer: {
      median: "Boys have a higher median time (18 min) than girls (16 min), so girls completed the puzzle faster on average.",
      iqr: "Boys have a larger IQR (8 min) than girls (9 min) — both groups had similar consistency.",
    },
  },
];

// ── Build It questions ────────────────────────────────────────────────────
const BUILD_QUESTIONS = [
  {
    id: "b1", label: "Starter",
    question: "Heights (cm) of 9 students:",
    rawData: [142, 148, 151, 155, 158, 163, 167, 171, 180],
    answer: { min: 142, q1: 151, median: 158, q3: 167, max: 180 },
    scaleMin: 130, scaleMax: 190, unit: "Height (cm)",
    hint: "9 values — the median is the 5th. Q1 is the 3rd, Q3 is the 7th.",
  },
  {
    id: "b2", label: "Practice",
    question: "Times (seconds) for 11 swimmers to complete a length:",
    rawData: [34, 37, 39, 41, 43, 45, 48, 52, 55, 59, 64],
    answer: { min: 34, q1: 39, median: 45, q3: 55, max: 64 },
    scaleMin: 30, scaleMax: 70, unit: "Time (s)",
    hint: "11 values — the median is the 6th. Q1 is the 3rd, Q3 is the 9th.",
  },
  {
    id: "b3", label: "Challenge",
    question: "Scores in a maths test for 13 students:",
    rawData: [12, 18, 22, 25, 28, 31, 34, 36, 41, 45, 48, 52, 58],
    answer: { min: 12, q1: 25, median: 34, q3: 45, max: 58 },
    scaleMin: 0, scaleMax: 70, unit: "Score (marks)",
    hint: "13 values — the median is the 7th. Q1 is the 4th, Q3 is the 10th.",
  },
];

const TOLERANCE = 3;

// ── SVG Box Plot ──────────────────────────────────────────────────────────
function BoxPlotSVG({ sets, scaleMin, scaleMax, unit, showLabels = true }) {
  const W = 560; const padL = 20; const padR = 20;
  const plotW = W - padL - padR;
  const rowH = showLabels ? 60 : 50;
  const boxH = 28;
  const toX = (v) => padL + ((v - scaleMin) / (scaleMax - scaleMin)) * plotW;
  const ticks = Array.from({ length: 6 }, (_, i) =>
    scaleMin + Math.round((i / 5) * (scaleMax - scaleMin)));
  const svgH = sets.length * rowH + 40;

  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} style={{ width: "100%", fontFamily: "inherit", overflow: "visible" }}>
      {ticks.map((t) => (
        <line key={t} x1={toX(t)} y1={0} x2={toX(t)} y2={sets.length * rowH} stroke={C.border} strokeWidth="1" strokeDasharray="4,4" />
      ))}
      {sets.map((s, i) => {
        const y = i * rowH + rowH / 2;
        const x1 = toX(s.min); const xq1 = toX(s.q1); const xm = toX(s.median);
        const xq3 = toX(s.q3); const x2 = toX(s.max);
        const bTop = y - boxH / 2; const bBot = y + boxH / 2;
        return (
          <g key={s.label}>
            {showLabels && <text x={padL} y={y - boxH / 2 - 6} fill={s.color} fontSize="11" fontWeight="600">{s.label}</text>}
            <line x1={x1} y1={y} x2={xq1} y2={y} stroke={s.color} strokeWidth="2" />
            <line x1={x1} y1={bTop + 8} x2={x1} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            <line x1={xq3} y1={y} x2={x2} y2={y} stroke={s.color} strokeWidth="2" />
            <line x1={x2} y1={bTop + 8} x2={x2} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            <rect x={xq1} y={bTop} width={xq3 - xq1} height={boxH} fill={s.color + "25"} stroke={s.color} strokeWidth="2" rx="3" />
            <line x1={xm} y1={bTop} x2={xm} y2={bBot} stroke={s.color} strokeWidth="3" />
            <text x={x1}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.min}</text>
            <text x={xq1} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q1}</text>
            <text x={xm}  y={bBot + 13} fill={s.color} fontSize="9" textAnchor="middle" fontWeight="700">{s.median}</text>
            <text x={xq3} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q3}</text>
            <text x={x2}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.max}</text>
          </g>
        );
      })}
      <line x1={padL} y1={sets.length * rowH + 2} x2={W - padR} y2={sets.length * rowH + 2} stroke={C.border} strokeWidth="1.5" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={toX(t)} y1={sets.length * rowH + 2} x2={toX(t)} y2={sets.length * rowH + 8} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={sets.length * rowH + 20} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x={W / 2} y={svgH - 2} fill={C.muted} fontSize="10" textAnchor="middle">{unit}</text>
    </svg>
  );
}

// ── Compare table ─────────────────────────────────────────────────────────
function CompareTable({ sets }) {
  const iqr = (s) => s.q3 - s.q1;
  const range = (s) => s.max - s.min;
  return (
    <div style={{ overflowX: "auto", marginTop: "16px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: "500", borderBottom: `1px solid ${C.border}` }}>Measure</th>
            {sets.map((s) => <th key={s.label} style={{ textAlign: "center", padding: "8px 12px", color: s.color, fontWeight: "600", borderBottom: `1px solid ${C.border}` }}>{s.label}</th>)}
            <th style={{ textAlign: "center", padding: "8px 12px", color: C.muted, fontWeight: "500", borderBottom: `1px solid ${C.border}` }}>Better?</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Median (average)",    fn: (s) => s.median, lower: true },
            { label: "IQR (consistency)",   fn: iqr,             lower: true },
            { label: "Range (total spread)",fn: range,           lower: true },
            { label: "Minimum",             fn: (s) => s.min,    lower: true },
            { label: "Maximum",             fn: (s) => s.max,    lower: true },
          ].map(({ label, fn, lower }) => {
            const vals = sets.map(fn);
            const bestIdx = lower ? vals.indexOf(Math.min(...vals)) : vals.indexOf(Math.max(...vals));
            return (
              <tr key={label}>
                <td style={{ padding: "8px 12px", color: C.text, borderBottom: `1px solid ${C.border}20` }}>{label}</td>
                {vals.map((v, i) => (
                  <td key={i} style={{ textAlign: "center", padding: "8px 12px", color: i === bestIdx ? sets[i].color : C.muted, fontWeight: i === bestIdx ? "700" : "400", borderBottom: `1px solid ${C.border}20` }}>{v}</td>
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
  const a = sets[0]; const b = sets[1];
  const iqrA = iqr(a); const iqrB = iqr(b);
  const higherMed = a.median > b.median ? a : b;
  const lowerIQR  = iqrA < iqrB ? a : b;
  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "14px 16px", marginTop: "16px" }}>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>✍️ How to write your exam answer</p>
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
        <strong style={{ color: C.accent }}>Median:</strong> "{higherMed.label} had a higher median ({Math.max(a.median, b.median)}) compared to {(higherMed === a ? b : a).label} ({Math.min(a.median, b.median)}), so {higherMed.label} had a higher average."
      </p>
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
        <strong style={{ color: C.amber }}>IQR:</strong> "{lowerIQR.label} had a smaller IQR ({Math.min(iqrA, iqrB)}) compared to {(lowerIQR === a ? b : a).label} ({Math.max(iqrA, iqrB)}), so {lowerIQR.label} was more consistent."
      </p>
    </div>
  );
}

// ── Ordered data table ────────────────────────────────────────────────────
function generateSampleData(s) {
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const vals = [];
  for (let i = 0; i < 5; i++)  vals.push(lerp(s.min, s.q1, i / 4));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q1, s.median, i / 5));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.median, s.q3, i / 5));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q3, s.max, i / 5));
  return vals;
}

function OrderedDataTable({ s, unit }) {
  const [expanded, setExpanded] = useState(false);
  const data = generateSampleData(s);
  const special = {
    0:  { role: "Minimum",                             color: C.muted,   bg: "#1e2d4080" },
    4:  { role: "Q1 — 25% of results below this",     color: s.color,   bg: s.color + "15" },
    9:  { role: "Median — 50% of results below this", color: "#ffffff", bg: "#ffffff15" },
    14: { role: "Q3 — 75% of results below this",     color: s.color,   bg: s.color + "15" },
    19: { role: "Maximum",                             color: C.muted,   bg: "#1e2d4080" },
  };
  return (
    <div style={{ marginBottom: "8px" }}>
      <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: expanded ? "8px" : "0" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: s.color }}>📋 {s.label} — see all 20 results in order</span>
        <span style={{ fontSize: "12px", color: C.muted }}>{expanded ? "▲ Hide" : "▼ Show"}</span>
      </button>
      {expanded && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "40px 60px 1fr 1fr", padding: "8px 12px", borderBottom: `1px solid ${C.border}`, background: C.card }}>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>#</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>{unit.split(" ")[0]}</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>Position</span>
            <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>What this means</span>
          </div>
          {data.map((val, i) => {
            const sp = special[i];
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 60px 1fr 1fr", padding: "7px 12px", background: sp ? sp.bg : "transparent", borderBottom: `1px solid ${C.border}20`, alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: C.muted }}>{i + 1}</span>
                <span style={{ fontSize: "13px", fontWeight: sp ? "700" : "400", color: sp ? sp.color : C.text }}>{val}</span>
                <span style={{ fontSize: "11px", color: C.muted }}>{i + 1} of 20</span>
                <span style={{ fontSize: "11px", color: sp ? sp.color : C.muted, fontWeight: sp ? "600" : "400" }}>{sp ? sp.role : "—"}</span>
              </div>
            );
          })}
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

// ── Real World tab ────────────────────────────────────────────────────────
function HospitalMode({ scenario, scenarioIdx, setScenario }) {
  const [deep, setDeep] = useState(false);
  React.useEffect(() => setDeep(false), [scenarioIdx]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {HOSPITAL_SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => setScenario(i)} style={{ padding: "12px 16px", background: scenarioIdx === i ? C.accentDim : C.surface, border: `1px solid ${scenarioIdx === i ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", textAlign: "left", color: scenarioIdx === i ? C.accent : C.muted, fontSize: "13px", fontWeight: scenarioIdx === i ? "700" : "400" }}>
            <span style={{ marginRight: "8px" }}>{s.icon}</span>
            <span style={{ fontWeight: 700 }}>{s.world}:</span> {s.title} — <span style={{ fontWeight: 400 }}>{s.subtitle}</span>
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, borderLeft: `3px solid ${C.accent}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: C.accent }}>{scenario.icon} {scenario.world}:</strong>{" "}
          {scenario.context.split(".")[0]}. A box plot shows the spread at a glance — the chart below compares two sets of data side by side.
        </p>
      </div>

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

      <button onClick={() => setDeep(!deep)} style={{ width: "100%", padding: "12px 16px", background: deep ? C.accentDim : C.surface, border: `1px solid ${deep ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: deep ? "16px" : "0" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: deep ? C.accent : C.text }}>🔍 Dig deeper — understand every number</span>
        <span style={{ fontSize: "12px", color: C.muted }}>{deep ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {deep && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{scenario.icon} {scenario.world} — why they use box plots</p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>{scenario.context}</p>
            <div style={{ background: C.accentDim, borderRadius: "8px", padding: "10px 12px", borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: "12px", color: C.accent, margin: 0, lineHeight: 1.6 }}>
                <strong>Why not just use the mean?</strong> {scenario.whyBoxPlot}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => {
              const iqr = s.q3 - s.q1;
              return (
                <div key={s.label} style={{ background: C.surface, borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "12px 14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, marginBottom: "6px" }}>{s.label} — what the numbers mean</p>
                  <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.8, margin: 0 }}>
                    🔹 The <strong>shortest</strong> recorded was <strong style={{ color: C.text }}>{s.min} {scenario.unit}</strong> — best case.<br />
                    🔹 A <strong>typical</strong> result was around <strong style={{ color: s.color }}>{s.median} {scenario.unit}</strong> — half below, half above.<br />
                    🔹 The <strong>middle half</strong> fell between <strong style={{ color: s.color }}>{s.q1}</strong> and <strong style={{ color: s.color }}>{s.q3} {scenario.unit}</strong> — a spread of <strong style={{ color: s.color }}>{iqr} {scenario.unit}</strong>. This is the IQR.<br />
                    🔹 The <strong>longest</strong> recorded was <strong style={{ color: C.text }}>{s.max} {scenario.unit}</strong> — worst case.
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => <OrderedDataTable key={s.label} s={s} unit={scenario.unit} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => (
              <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: s.color, marginBottom: "10px" }}>{s.label}</p>
                {[
                  { label: "Min",    val: s.min,       plain: "Lowest value" },
                  { label: "Q1",     val: s.q1,        plain: "25% below this" },
                  { label: "Median", val: s.median,    plain: "Typical (middle)" },
                  { label: "Q3",     val: s.q3,        plain: "75% below this" },
                  { label: "Max",    val: s.max,       plain: "Highest value" },
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

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "2px" }}>Side-by-side comparison</p>
            <CompareTable sets={scenario.sets} />
          </div>

          <ExamSentenceBuilder sets={scenario.sets} />
        </div>
      )}
    </div>
  );
}

// ── Exam: Draw a box plot ─────────────────────────────────────────────────
function ExamPractice({ question, onBack }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back</button>
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
            {[{label:"Min",val:question.data.min},{label:"Q1",val:question.data.q1},{label:"Median",val:question.data.median},{label:"Q3",val:question.data.q3},{label:"Max",val:question.data.max}].map(({ label, val }) => (
              <div key={label} style={{ background: C.surface, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
                <p style={{ fontSize: "15px", fontWeight: "700", color: C.accent, margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "12px", fontStyle: "italic" }}>Try sketching the box plot yourself first, then reveal the answer below.</p>
      <button onClick={() => setRevealed(!revealed)} style={{ width: "100%", padding: "12px", background: revealed ? C.accentDim : C.accent, color: revealed ? C.accent : C.bg, border: `1px solid ${C.accent}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "16px" }}>
        {revealed ? "Hide answer" : "Reveal answer & box plot"}
      </button>
      {revealed && (
        <div>
          {question.rawData && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: C.muted, fontWeight: "600", textTransform: "uppercase", marginBottom: "10px" }}>Step by step</p>
              <p style={{ fontSize: "13px", color: C.text, marginBottom: "6px" }}>
                <strong style={{ color: C.accent }}>1. Order the data:</strong><br />
                <span style={{ fontFamily: "monospace", color: C.muted }}>{[...question.rawData].sort((a, b) => a - b).join("  ")}</span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginTop: "10px" }}>
                {[{label:"Min",val:question.data.min},{label:"Q1",val:question.data.q1},{label:"Median",val:question.data.median},{label:"Q3",val:question.data.q3},{label:"Max",val:question.data.max}].map(({ label, val }) => (
                  <div key={label} style={{ background: C.surface, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
                    <p style={{ fontSize: "15px", fontWeight: "700", color: C.accent, margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px" }}>
            <BoxPlotSVG sets={[{ ...question.data, label: "Answer", color: C.accent }]} scaleMin={question.scaleMin} scaleMax={question.scaleMax} unit={question.unit} showLabels={false} />
          </div>
          <div style={{ background: "#052e1c", border: "1px solid #16a34a40", borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", marginBottom: "6px" }}>IQR</p>
            <p style={{ fontSize: "14px", color: C.text, margin: 0 }}>
              IQR = Q3 − Q1 = {question.data.q3} − {question.data.q1} = <strong style={{ color: "#4ade80" }}>{question.data.q3 - question.data.q1}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Exam: Compare two box plots ───────────────────────────────────────────
function CompareQuestion({ question, onBack }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [comparison, setComparison] = useState("");
  const [checked, setChecked]       = useState(false);
  const a = question.yours; const b = question.theirs;
  const iqrA = a.q3 - a.q1; const iqrB = b.q3 - b.q1;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back</button>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", margin: 0 }}>Exam Question</p>
          <span style={{ fontSize: "11px", background: C.accentDim, color: C.accent, padding: "2px 8px", borderRadius: "99px", fontWeight: "700" }}>{question.marks} marks</span>
        </div>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.6, margin: "0 0 12px" }}>{question.question}</p>
        {question.note && (
          <div style={{ background: "#fffbeb30", border: "1px solid #f59e0b40", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: C.amber, margin: 0 }}>💡 {question.note}</p>
          </div>
        )}
        <p style={{ fontSize: "11px", color: C.muted, fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>{question.yoursLabel} — your values to plot</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
          {[{l:"Min",v:a.min},{l:"Q1",v:a.q1},{l:"Med",v:a.median},{l:"Q3",v:a.q3},{l:"Max",v:a.max}].map(({l,v}) => (
            <div key={l} style={{ background: C.surface, borderRadius: "8px", padding: "8px 4px", textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px" }}>{l}</p>
              <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.amber, marginBottom: "12px" }}>Already drawn: {question.theirsLabel}</p>
        <BoxPlotSVG sets={[{ ...b, label: question.theirsLabel, color: C.amber }]} scaleMin={question.scaleMin} scaleMax={question.scaleMax} unit={question.unit} showLabels={false} />
      </div>
      <p style={{ fontSize: "12px", color: C.muted, marginBottom: "16px", fontStyle: "italic", textAlign: "center" }}>
        ↑ Sketch {question.yoursLabel} on paper on the same scale, then reveal below.
      </p>

      <button onClick={() => setShowAnswer(!showAnswer)} style={{ width: "100%", padding: "12px", background: showAnswer ? C.accentDim : C.accent, color: showAnswer ? C.accent : C.bg, border: `1px solid ${C.accent}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "16px" }}>
        {showAnswer ? "Hide answer" : "Reveal both box plots"}
      </button>

      {showAnswer && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "12px" }}>Both on the same scale</p>
            <BoxPlotSVG sets={[{...a,label:question.yoursLabel,color:C.accent},{...b,label:question.theirsLabel,color:C.amber}]} scaleMin={question.scaleMin} scaleMax={question.scaleMax} unit={question.unit} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[{label:question.yoursLabel,s:a,color:C.accent,iqr:iqrA},{label:question.theirsLabel,s:b,color:C.amber,iqr:iqrB}].map(({label,s,color,iqr}) => (
              <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color, marginBottom: "8px" }}>{label}</p>
                {[{k:"Median",v:s.median},{k:"IQR",v:iqr},{k:"Range",v:s.max-s.min}].map(({k,v}) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: C.muted }}>{k}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>
              Part (b) — Write your comparison <span style={{ color: C.muted, fontWeight: 400 }}>(2 marks)</span>
            </p>
            <p style={{ fontSize: "12px", color: C.muted, marginBottom: "10px" }}>Two statements — one about the median, one about the IQR. Always include the actual numbers.</p>
            <textarea value={comparison} onChange={e => setComparison(e.target.value)} placeholder="Write your two comparison sentences here..." style={{ width: "100%", minHeight: "80px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "10px 12px", color: C.text, fontSize: "13px", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
            <button onClick={() => setChecked(!checked)} style={{ marginTop: "8px", padding: "10px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {checked ? "Hide model answer" : "Show model answer"}
            </button>
          </div>

          {checked && (
            <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>✍️ Model answer</p>
              <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
                <strong style={{ color: C.accent }}>Median (1 mark):</strong> {question.modelAnswer.median}
              </p>
              <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: C.amber }}>IQR (1 mark):</strong> {question.modelAnswer.iqr}
              </p>
              <div style={{ background: C.surface, borderRadius: "8px", padding: "10px 12px", marginTop: "12px" }}>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  ⭐ Each statement needs the <strong style={{ color: C.text }}>actual number</strong> and a <strong style={{ color: C.text }}>conclusion</strong> — without both you lose the mark.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Build It: Stage 1 ─────────────────────────────────────────────────────
function StageOrder({ q, onComplete }) {
  const shuffled = React.useMemo(() => [...q.rawData].sort(() => Math.random() - 0.5), [q]);
  const [remaining, setRemaining] = useState(shuffled);
  const [ordered,   setOrdered]   = useState([]);
  const [shake,     setShake]     = useState(null);
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const n = q.rawData.length;
  const q1idx = Math.floor(n / 4);
  const midIdx = Math.floor(n / 2);
  const q3idx = Math.floor((3 * n) / 4);

  const handleTap = (val, idx) => {
    if (val === sorted[ordered.length]) {
      setOrdered(prev => [...prev, val]);
      setRemaining(prev => prev.filter((_, i) => i !== idx));
    } else {
      setShake(idx);
      setTimeout(() => setShake(null), 500);
    }
  };
  const allDone = ordered.length === n;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 1 of 3 — Order It</p>
        <span style={{ fontSize: "12px", color: C.muted }}>{ordered.length} / {n} placed</span>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{q.label} — {q.question}</p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>Tap the numbers <strong>one at a time</strong>, smallest first.</p>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", minHeight: "56px" }}>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ordered (smallest → largest)</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "32px" }}>
          {ordered.map((val, i) => {
            const isMin = i === 0; const isMax = i === n - 1;
            const isMedian = i === midIdx; const isQ1 = i === q1idx; const isQ3 = i === q3idx;
            const hl = isMedian ? "#ffffff" : (isQ1 || isQ3) ? C.accent : (isMin || isMax) ? C.muted : null;
            return (
              <div key={i} style={{ padding: "5px 10px", borderRadius: "6px", background: hl ? hl + "20" : C.card, border: `1px solid ${hl || C.border}`, fontSize: "13px", fontWeight: hl ? "700" : "400", color: hl || C.text }}>
                {val}
                {isMin    && <span style={{ fontSize: "9px", display: "block", color: C.muted,   lineHeight: 1 }}>min</span>}
                {isQ1     && <span style={{ fontSize: "9px", display: "block", color: C.accent,  lineHeight: 1 }}>Q1</span>}
                {isMedian && <span style={{ fontSize: "9px", display: "block", color: "#ffffff", lineHeight: 1 }}>median</span>}
                {isQ3     && <span style={{ fontSize: "9px", display: "block", color: C.accent,  lineHeight: 1 }}>Q3</span>}
                {isMax    && <span style={{ fontSize: "9px", display: "block", color: C.muted,   lineHeight: 1 }}>max</span>}
              </div>
            );
          })}
          {ordered.length === 0 && <span style={{ fontSize: "12px", color: C.muted, fontStyle: "italic" }}>Tap a number below to start…</span>}
        </div>
      </div>
      {!allDone && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {remaining.map((val, i) => (
            <button key={i} onClick={() => handleTap(val, i)} style={{ padding: "10px 16px", borderRadius: "8px", background: shake === i ? "#ef444420" : C.card, border: `1px solid ${shake === i ? C.red : C.border}`, color: shake === i ? C.red : C.text, fontSize: "14px", fontWeight: "600", cursor: "pointer", transform: shake === i ? "translateX(4px)" : "none", transition: "all 0.1s" }}>
              {val}
            </button>
          ))}
        </div>
      )}
      {allDone && (
        <div>
          <div style={{ background: "#052e1c", border: "1px solid #16a34a40", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80", margin: "0 0 4px" }}>✓ Perfectly ordered!</p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>Notice where Min, Q1, Median, Q3 and Max sit in the list. Now let's use those values.</p>
          </div>
          <button onClick={onComplete} style={{ width: "100%", padding: "14px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Continue to Stage 2 →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Build It: Stage 2 ─────────────────────────────────────────────────────
function StageFive({ q, onComplete }) {
  const sorted = [...q.rawData].sort((a, b) => a - b);
  const KEYS = ["min", "q1", "median", "q3", "max"];
  const LABELS = { min: "Minimum", q1: "Q1 (Lower Quartile)", median: "Median", q3: "Q3 (Upper Quartile)", max: "Maximum" };
  const DESCS  = { min: "The smallest value", q1: "The middle of the lower half", median: "The middle value of the whole list", q3: "The middle of the upper half", max: "The largest value" };
  const [inputs,  setInputs]  = useState({ min: "", q1: "", median: "", q3: "", max: "" });
  const [checked, setChecked] = useState(false);
  const results = KEYS.map(k => ({ key: k, ok: parseInt(inputs[k]) === q.answer[k], correct: q.answer[k] }));
  const allOk = results.every(r => r.ok);

  return (
    <div>
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
          return (
            <div key={k} style={{ background: checked ? (r.ok ? "#052e1c" : "#2d0a0a") : C.card, border: `1px solid ${checked ? (r.ok ? "#16a34a60" : "#ef444460") : C.border}`, borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 2px" }}>{LABELS[k]}</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>{DESCS[k]}</p>
              </div>
              <input type="number" value={inputs[k]} onChange={e => setInputs(prev => ({ ...prev, [k]: e.target.value }))} disabled={checked && r.ok} placeholder="?" style={{ width: "64px", padding: "8px", textAlign: "center", background: C.surface, border: `1px solid ${checked ? (r.ok ? "#16a34a" : C.red) : C.border}`, borderRadius: "8px", color: checked ? (r.ok ? "#4ade80" : C.red) : C.text, fontSize: "16px", fontWeight: "700" }} />
              {checked && <span style={{ fontSize: "18px", flexShrink: 0 }}>{r.ok ? "✓" : "✗"}</span>}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => setChecked(true)} style={{ width: "100%", padding: "13px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check my answers</button>
        : <button onClick={() => { if (allOk) onComplete(); else setChecked(false); }} style={{ width: "100%", padding: "13px", background: allOk ? C.accent : C.surface, color: allOk ? C.bg : C.muted, border: allOk ? "none" : `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {allOk ? "Continue to Stage 3 →" : "Try again"}
          </button>
      }
    </div>
  );
}

// ── Build It: Stage 3 ─────────────────────────────────────────────────────
function StageDrag({ q }) {
  const initVals = () => ({
    min:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.15),
    q1:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.30),
    median: q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.50),
    q3:     q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.70),
    max:    q.scaleMin + Math.round((q.scaleMax - q.scaleMin) * 0.85),
  });
  const [vals, setVals]             = useState(initVals);
  const [dragging, setDragging]     = useState(null);
  const [checked, setChecked]       = useState(false);
  const [showHint, setShowHint]     = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const svgRef = React.useRef(null);
  const reset = () => { setVals(initVals()); setChecked(false); setShowHint(false); setShowAnswer(false); };

  const SVG_W = 520; const PAD_L = 24; const PAD_R = 24; const PLOT_W = SVG_W - PAD_L - PAD_R;
  const MID_Y = 60; const BOX_H = 32;
  const toX   = (v) => PAD_L + ((v - q.scaleMin) / (q.scaleMax - q.scaleMin)) * PLOT_W;
  const toVal = (x) => q.scaleMin + ((x - PAD_L) / PLOT_W) * (q.scaleMax - q.scaleMin);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onPointerDown = (e, key) => { e.preventDefault(); svgRef.current.setPointerCapture(e.pointerId); setDragging({ key }); };
  const onPointerMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    let nv = Math.round(toVal(svgX));
    setVals((prev) => {
      const next = { ...prev };
      if (dragging.key === "min")    nv = clamp(nv, q.scaleMin,   prev.q1 - 1);
      if (dragging.key === "q1")     nv = clamp(nv, prev.min + 1, prev.median - 1);
      if (dragging.key === "median") nv = clamp(nv, prev.q1 + 1,  prev.q3 - 1);
      if (dragging.key === "q3")     nv = clamp(nv, prev.median + 1, prev.max - 1);
      if (dragging.key === "max")    nv = clamp(nv, prev.q3 + 1,  q.scaleMax);
      next[dragging.key] = nv; return next;
    });
  };
  const onPointerUp = () => setDragging(null);

  const HL = { min: "Min", q1: "Q1", median: "Med", q3: "Q3", max: "Max" };
  const HC = { min: "#64748b", q1: "#00d4aa", median: "#ffffff", q3: "#00d4aa", max: "#64748b" };
  const ticks = Array.from({ length: 6 }, (_, i) => Math.round(q.scaleMin + (i / 5) * (q.scaleMax - q.scaleMin)));
  const score = Object.keys(q.answer).map((k) => ({ key: k, correct: Math.abs(vals[k] - q.answer[k]) <= TOLERANCE, yours: vals[k], answer: q.answer[k] }));
  const allCorrect = score.every(s => s.correct);

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage 3 of 3 — Place It</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {Object.entries(q.answer).map(([k, v]) => (
          <div key={k} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "6px 10px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{HL[k]}</p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "13px", color: C.text, marginBottom: "16px" }}>Drag each handle to its correct position on the number line.</p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px", touchAction: "none" }}>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: "12px", textAlign: "center" }}>Drag each handle ↔</p>
        <svg ref={svgRef} viewBox={`0 0 ${SVG_W} 135`} style={{ width: "100%", overflow: "visible", cursor: dragging ? "grabbing" : "default", userSelect: "none" }} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
          {ticks.map((t) => <line key={t} x1={toX(t)} y1={10} x2={toX(t)} y2={MID_Y + BOX_H / 2 + 4} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />)}
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
          {Object.entries(HL).map(([key, label]) => {
            const x = toX(vals[key]); const isActive = dragging?.key === key;
            return (
              <g key={key} style={{ cursor: "grab" }} onPointerDown={(e) => onPointerDown(e, key)}>
                <rect x={x - 14} y={MID_Y - BOX_H / 2 - 22} width={28} height={BOX_H + 44} fill="transparent" />
                <rect x={x - 14} y={MID_Y - BOX_H / 2 - 22} width={28} height={18} fill={isActive ? C.accent : C.surface} stroke={HC[key]} strokeWidth="1.5" rx="4" />
                <text x={x} y={MID_Y - BOX_H / 2 - 8} fill={isActive ? C.bg : HC[key]} fontSize="9" fontWeight="700" textAnchor="middle">{label}</text>
                <text x={x} y={MID_Y + BOX_H / 2 + 38} fill={isActive ? C.accent : C.muted} fontSize="10" fontWeight={isActive ? "700" : "400"} textAnchor="middle">{vals[key]}</text>
                <polygon points={`${x},${MID_Y - BOX_H / 2 - 4} ${x + 6},${MID_Y} ${x},${MID_Y + BOX_H / 2 + 4} ${x - 6},${MID_Y}`} fill={isActive ? C.accent : C.card} stroke={HC[key]} strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      </div>

      <button onClick={() => setShowHint(!showHint)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", color: C.muted, fontSize: "12px", cursor: "pointer", marginBottom: "8px", width: "100%" }}>
        {showHint ? "Hide hint" : "💡 Show hint"}
      </button>
      {showHint && <div style={{ background: C.surface, borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}><p style={{ fontSize: "13px", color: C.text, margin: 0 }}>{q.hint}</p></div>}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={() => setChecked(true)} style={{ flex: 2, padding: "13px", background: C.accent, color: C.bg, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Check my answer</button>
        <button onClick={reset} style={{ flex: 1, padding: "13px", background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>Reset</button>
      </div>

      {checked && (
        <div style={{ background: allCorrect ? "#052e1c" : C.card, border: `1px solid ${allCorrect ? "#16a34a60" : C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: allCorrect ? "#4ade80" : C.amber, marginBottom: "12px" }}>
            {allCorrect ? "🎉 All three stages complete!" : "Here's how you did:"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {score.map(({ key, correct, yours, answer }) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: correct ? "#16a34a15" : "#ef444415", borderRadius: "8px" }}>
                <span style={{ fontSize: "13px", color: C.text, fontWeight: "600" }}>{HL[key]}</span>
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

// ── Build It orchestrator ─────────────────────────────────────────────────
function BuildIt() {
  const [qIdx,  setQIdx]  = useState(null);
  const [stage, setStage] = useState(1);
  const q = qIdx !== null ? BUILD_QUESTIONS[qIdx] : null;

  if (qIdx === null) {
    return (
      <div>
        <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
          Each question has <strong style={{ color: C.text }}>3 stages</strong>: order the data → find the 5 values → drag to build the box plot.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BUILD_QUESTIONS.map((bq, i) => (
            <button key={bq.id} onClick={() => { setQIdx(i); setStage(1); }} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "99px", color: i === 0 ? C.accent : i === 1 ? C.amber : C.red, border: `1px solid ${i === 0 ? C.accent : i === 1 ? C.amber : C.red}40`, marginRight: "10px" }}>{bq.label}</span>
                <span style={{ fontSize: "13px", color: C.text }}>{bq.question}</span>
              </span>
              <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginLeft: "12px" }}>→</span>
            </button>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
            💡 <strong style={{ color: C.text }}>Remember:</strong> always order the data first — it's the step most students skip.
          </p>
        </div>
      </div>
    );
  }

  const StageBar = () => (
    <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
      {[{ n: 1, label: "Order It" }, { n: 2, label: "Find Values" }, { n: 3, label: "Place It" }].map(({ n, label }) => (
        <div key={n} style={{ flex: 1, padding: "8px 6px", borderRadius: "8px", background: stage >= n ? (stage === n ? C.accent : C.accentDim) : C.surface, border: `1px solid ${stage >= n ? C.accent : C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: stage >= n ? (stage === n ? C.bg : C.accent) : C.muted, margin: 0 }}>{n}. {label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <button onClick={() => setQIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back to questions</button>
      <StageBar />
      {stage === 1 && <StageOrder q={q} onComplete={() => setStage(2)} />}
      {stage === 2 && <StageFive  q={q} onComplete={() => setStage(3)} />}
      {stage === 3 && <StageDrag  q={q} />}
    </div>
  );
}

// ── Read the graph questions (Q8, Q9 from MathsGenie) ────────────────────
const READ_GRAPH_QUESTIONS = [
  {
    id: "rg1",
    label: "Q8 — Pears",
    question: "The cumulative frequency graph shows the weight (in grams) of 60 pears. The minimum weight is 112g and the maximum is 149g. Use the graph to find Q1, the median and Q3, then draw the box plot.",
    totalFreq: 60,
    unit: "Weight (g)",
    scaleMin: 100, scaleMax: 155,
    // Points on the cumulative frequency curve: [x (weight), y (cumFreq)]
    curvePoints: [
      [100, 0], [112, 0], [115, 2], [118, 5], [121, 9],
      [124, 15], [127, 22], [130, 30], [133, 38], [136, 45],
      [139, 51], [142, 56], [145, 59], [149, 60], [155, 60],
    ],
    answer: { min: 112, q1: 124, median: 130, q3: 136, max: 149 },
    readPoints: [
      { freq: 15, label: "Q1 (¼ × 60 = 15th value)", value: 124, color: "#00d4aa" },
      { freq: 30, label: "Median (½ × 60 = 30th value)", value: 130, color: "#ffffff" },
      { freq: 45, label: "Q3 (¾ × 60 = 45th value)", value: 136, color: "#00d4aa" },
    ],
    examTip: "Always read across from the y-axis (cumulative frequency) to the curve, then drop straight down to the x-axis. Never read it the other way round.",
  },
  {
    id: "rg2",
    label: "Q9 — Apples",
    question: "The cumulative frequency graph shows the weight (in grams) of 60 apples. The minimum weight is 163g and the maximum is 188g. Use the graph to find Q1, the median and Q3, then draw the box plot.",
    totalFreq: 60,
    unit: "Weight (g)",
    scaleMin: 155, scaleMax: 195,
    curvePoints: [
      [155, 0], [163, 0], [165, 1], [168, 4], [171, 10],
      [174, 18], [177, 28], [180, 38], [183, 47], [186, 54],
      [188, 60], [195, 60],
    ],
    answer: { min: 163, q1: 174, median: 179, q3: 183, max: 188 },
    readPoints: [
      { freq: 15, label: "Q1 (¼ × 60 = 15th value)", value: 174, color: "#00d4aa" },
      { freq: 30, label: "Median (½ × 60 = 30th value)", value: 179, color: "#ffffff" },
      { freq: 45, label: "Q3 (¾ × 60 = 45th value)", value: 183, color: "#00d4aa" },
    ],
    examTip: "The curve is S-shaped — it starts shallow, steepens in the middle, then flattens at the top. If your curve goes downward at any point, something has gone wrong.",
  },
];

// ── Cumulative frequency curve + box plot reader ──────────────────────────
function ReadTheGraph({ question, onBack }) {
  const [step, setStep]           = useState(1); // 1=read graph, 2=see box plot
  const [revealed, setRevealed]   = useState(false);
  const [showBoxPlot, setShowBoxPlot] = useState(false);

  // SVG dimensions for the cumulative frequency graph
  const W = 520; const H = 280;
  const PAD = { top: 20, right: 20, bottom: 50, left: 52 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const toSvgX = (val) => PAD.left + ((val - question.scaleMin) / (question.scaleMax - question.scaleMin)) * plotW;
  const toSvgY = (freq) => PAD.top + plotH - (freq / question.totalFreq) * plotH;
  const toVal  = (svgX) => question.scaleMin + ((svgX - PAD.left) / plotW) * (question.scaleMax - question.scaleMin);

  // Build smooth SVG path from curve points
  const pathD = question.curvePoints.map((pt, i) =>
    `${i === 0 ? "M" : "L"} ${toSvgX(pt[0]).toFixed(1)} ${toSvgY(pt[1]).toFixed(1)}`
  ).join(" ");

  // Y-axis ticks
  const yTicks = [0, 10, 20, 30, 40, 50, 60];
  // X-axis ticks
  const xTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(question.scaleMin + (i / 5) * (question.scaleMax - question.scaleMin))
  );

  // Interpolate x value on curve for a given cumFreq
  const interpX = (targetFreq) => {
    const pts = question.curvePoints;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][1] >= targetFreq && pts[i - 1][1] <= targetFreq) {
        const t = (targetFreq - pts[i - 1][1]) / (pts[i][1] - pts[i - 1][1]);
        return pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]);
      }
    }
    return pts[pts.length - 1][0];
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back</button>

      {/* Question card */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", margin: 0 }}>Exam Question — Read the Graph</p>
          <span style={{ fontSize: "11px", background: C.accentDim, color: C.accent, padding: "2px 8px", borderRadius: "99px", fontWeight: "700" }}>3 marks</span>
        </div>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.6, margin: "0 0 10px" }}>{question.question}</p>
        <div style={{ background: C.accentDim, borderRadius: "8px", padding: "10px 12px" }}>
          <p style={{ fontSize: "12px", color: C.accent, margin: 0, lineHeight: 1.6 }}>
            <strong>How to read a cumulative frequency graph:</strong> Find the frequency value on the y-axis (left side). Draw a horizontal line across to the curve. Then drop straight down to the x-axis to read the value. That's it.
          </p>
        </div>
      </div>

      {/* The cumulative frequency graph */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "4px" }}>Cumulative Frequency Graph</p>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>The three dashed lines show where to read Q1, Median and Q3 — across from the y-axis, then down to the x-axis.</p>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", fontFamily: "inherit", overflow: "visible" }}>
          {/* Grid lines */}
          {yTicks.map(t => (
            <line key={t} x1={PAD.left} y1={toSvgY(t)} x2={W - PAD.right} y2={toSvgY(t)} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
          ))}

          {/* The S-curve */}
          <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" />

          {/* Shaded area under curve */}
          <path d={`${pathD} L ${toSvgX(question.scaleMax).toFixed(1)} ${toSvgY(0).toFixed(1)} L ${toSvgX(question.scaleMin).toFixed(1)} ${toSvgY(0).toFixed(1)} Z`} fill={C.accent + "10"} />

          {/* Reader lines — Q1, Median, Q3 */}
          {question.readPoints.map((rp) => {
            const svgY = toSvgY(rp.freq);
            const xAtFreq = interpX(rp.freq);
            const svgX = toSvgX(xAtFreq);
            return (
              <g key={rp.freq}>
                {/* Horizontal line from y-axis to curve */}
                <line x1={PAD.left} y1={svgY} x2={svgX} y2={svgY} stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
                {/* Vertical drop from curve to x-axis */}
                <line x1={svgX} y1={svgY} x2={svgX} y2={toSvgY(0)} stroke={rp.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
                {/* Dot on the curve */}
                <circle cx={svgX} cy={svgY} r="5" fill={rp.color} stroke={C.bg} strokeWidth="2" />
                {/* Y-axis label */}
                <text x={PAD.left - 6} y={svgY + 4} fill={rp.color} fontSize="9" textAnchor="end" fontWeight="700">{rp.freq}</text>
              </g>
            );
          })}

          {/* Y-axis */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke={C.border} strokeWidth="1.5" />
          {yTicks.map(t => (
            <g key={t}>
              <line x1={PAD.left - 4} y1={toSvgY(t)} x2={PAD.left} y2={toSvgY(t)} stroke={C.muted} strokeWidth="1.5" />
              <text x={PAD.left - 8} y={toSvgY(t) + 4} fill={C.muted} fontSize="9" textAnchor="end">{t}</text>
            </g>
          ))}
          {/* Y-axis label */}
          <text transform={`translate(12, ${PAD.top + plotH / 2}) rotate(-90)`} fill={C.muted} fontSize="10" textAnchor="middle">Cumulative Frequency</text>

          {/* X-axis */}
          <line x1={PAD.left} y1={PAD.top + plotH} x2={W - PAD.right} y2={PAD.top + plotH} stroke={C.border} strokeWidth="1.5" />
          {xTicks.map(t => (
            <g key={t}>
              <line x1={toSvgX(t)} y1={PAD.top + plotH} x2={toSvgX(t)} y2={PAD.top + plotH + 5} stroke={C.muted} strokeWidth="1.5" />
              <text x={toSvgX(t)} y={PAD.top + plotH + 16} fill={C.muted} fontSize="9" textAnchor="middle">{t}</text>
            </g>
          ))}
          <text x={PAD.left + plotW / 2} y={H - 4} fill={C.muted} fontSize="10" textAnchor="middle">{question.unit}</text>
        </svg>
      </div>

      {/* Read-off values — shown clearly */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "12px" }}>Reading the values off the graph</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {question.readPoints.map((rp) => (
            <div key={rp.freq} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${rp.color}` }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: rp.color, margin: "0 0 2px" }}>{rp.label}</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>Read across from {rp.freq} on the y-axis → drop down to x-axis</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "18px", fontWeight: "800", color: rp.color, margin: 0 }}>{rp.value}g</p>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${C.muted}` }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: C.muted, margin: "0 0 2px" }}>Min and Max — given in the question</p>
              <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>These are not read from the graph — the question tells you directly</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.muted, margin: 0 }}>{question.answer.min}g – {question.answer.max}g</p>
            </div>
          </div>
        </div>
      </div>

      {/* The 5 values summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
        {[
          { label: "Min",    val: question.answer.min,    color: C.muted },
          { label: "Q1",     val: question.answer.q1,     color: C.accent },
          { label: "Median", val: question.answer.median, color: C.white },
          { label: "Q3",     val: question.answer.q3,     color: C.accent },
          { label: "Max",    val: question.answer.max,    color: C.muted },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 4px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color, margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Sketch prompt */}
      <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          ✏️ <strong>Now sketch the box plot on paper</strong> using those 5 values on a number line from {question.scaleMin} to {question.scaleMax}. Then reveal the answer below to check.
        </p>
      </div>

      {/* Reveal box plot */}
      <button onClick={() => setShowBoxPlot(!showBoxPlot)} style={{ width: "100%", padding: "12px", background: showBoxPlot ? C.accentDim : C.accent, color: showBoxPlot ? C.accent : C.bg, border: `1px solid ${C.accent}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: showBoxPlot ? "16px" : "0" }}>
        {showBoxPlot ? "Hide box plot" : "Reveal box plot answer"}
      </button>

      {showBoxPlot && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.white, marginBottom: "12px" }}>Box plot — drawn from the graph values</p>
            <BoxPlotSVG
              sets={[{ ...question.answer, label: "Answer", color: C.accent }]}
              scaleMin={question.scaleMin}
              scaleMax={question.scaleMax}
              unit={question.unit}
              showLabels={false}
            />
          </div>

          {/* IQR */}
          <div style={{ background: "#052e1c", border: "1px solid #16a34a40", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", marginBottom: "6px" }}>IQR</p>
            <p style={{ fontSize: "14px", color: C.text, margin: 0 }}>
              IQR = Q3 − Q1 = {question.answer.q3} − {question.answer.q1} = <strong style={{ color: "#4ade80" }}>{question.answer.q3 - question.answer.q1}</strong>
            </p>
          </div>

          {/* Exam tip */}
          <div style={{ background: "#fffbeb20", border: "1px solid #f59e0b40", borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "12px", color: C.amber, margin: 0, lineHeight: 1.6 }}>
              ⭐ <strong>Exam tip:</strong> {question.examTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function BoxPlotVisualiser() {
  const [mode,       setMode]       = useState("hospital");
  const [scenarioIdx,setScenario]   = useState(0);
  const [examIdx,    setExamIdx]    = useState(null);
  const [compareIdx, setCompareIdx] = useState(null);
  const [graphIdx,   setGraphIdx]   = useState(null);
  const scenario = HOSPITAL_SCENARIOS[scenarioIdx];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "20px 16px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, margin: "0 0 4px" }}>Statistics · Box Plots</p>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.white, margin: "0 0 4px", lineHeight: 1.2 }}>Box Plot Explorer</h1>
          <p style={{ fontSize: "14px", color: C.muted, margin: 0 }}>See them in the real world, then practise exam questions</p>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", background: C.surface, borderRadius: "10px", padding: "4px" }}>
          {[{ id: "hospital", label: "🌍 Real World" }, { id: "build", label: "🎯 Build It" }, { id: "exam", label: "📝 Exam" }].map(({ id, label }) => (
            <button key={id} onClick={() => { setMode(id); setExamIdx(null); setCompareIdx(null); setGraphIdx(null); }} style={{ flex: 1, padding: "10px 6px", background: mode === id ? C.accent : "transparent", color: mode === id ? C.bg : C.muted, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {mode === "hospital" && <HospitalMode scenario={scenario} scenarioIdx={scenarioIdx} setScenario={setScenario} />}
        {mode === "build"    && <BuildIt />}

        {mode === "exam" && (
          <div>
            {examIdx !== null ? (
              <ExamPractice question={EXAM_QUESTIONS[examIdx]} onBack={() => setExamIdx(null)} />
            ) : compareIdx !== null ? (
              <CompareQuestion question={COMPARE_QUESTIONS[compareIdx]} onBack={() => setCompareIdx(null)} />
            ) : graphIdx !== null ? (
              <ReadTheGraph question={READ_GRAPH_QUESTIONS[graphIdx]} onBack={() => setGraphIdx(null)} />
            ) : (
              <div>
                <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>Edexcel-style questions. Sketch on paper first, then reveal the answer.</p>

                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Draw a box plot</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {EXAM_QUESTIONS.map((q, i) => (
                    <button key={q.id} onClick={() => setExamIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ flex: 1 }}>
                        <span style={{ fontWeight: "700", color: C.accent }}>Q{i + 1} — </span>
                        {q.question}
                      </span>
                      <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Compare two box plots</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {COMPARE_QUESTIONS.map((q, i) => (
                    <button key={q.id} onClick={() => setCompareIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ flex: 1 }}>
                        <span style={{ fontWeight: "700", color: C.amber }}>{q.label} — </span>
                        {q.question}
                      </span>
                      <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Read the graph</p>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "10px" }}>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
                    These questions give you a <strong style={{ color: C.text }}>cumulative frequency graph</strong> instead of a table of numbers. You read Q1, the median and Q3 off the curve, then draw the box plot — exactly like Q8 and Q9 in the Edexcel paper.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {READ_GRAPH_QUESTIONS.map((q, i) => (
                    <button key={q.id} onClick={() => setGraphIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ flex: 1 }}>
                        <span style={{ fontWeight: "700", color: "#a78bfa" }}>{q.label} — </span>
                        {q.question}
                      </span>
                      <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
                    </button>
                  ))}
                </div>

                <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px" }}>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
                    💡 <strong style={{ color: C.text }}>Exam tip:</strong> Comparison answers always need TWO statements — median and IQR — each with the actual number and a conclusion.
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