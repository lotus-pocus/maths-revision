import React, { useState } from "react";
import { C } from "./data";
import BoxPlotSVG from "./shared/BoxPlotSVG";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// ── Scenarios ─────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "hospital",
    icon: "🏥",
    title: "Hospital Waiting Times",
    hook: "You work for the NHS. Your job is to compare two hospitals.",
    setup: "Patients in A&E are waiting to be seen. You collect the waiting times (in minutes) from a sample of 15 patients at City Hospital. The data comes in the order patients arrived - not in any useful order.",
    unit: "minutes",
    unitShort: "min",
    rawData: [67, 23, 41, 88, 15, 54, 31, 72, 19, 45, 60, 38, 80, 27, 52],
    sorted:  [15, 19, 23, 27, 31, 38, 41, 45, 52, 54, 60, 67, 72, 80, 88],
    // 15 values: median = 8th = 45, Q1 = median of bottom 7 = 4th = 27, Q3 = median of top 7 = 12th = 67
    answer: { min: 15, q1: 27, median: 45, q3: 67, max: 88 },
    whySortExplain: "We sort the data so we can find the middle value (median) and the quartiles. If the numbers are jumbled, it's impossible to tell which value is in the middle. Sorting is always the first step.",
    contextExplain: {
      min: "15 minutes - this was the fastest patient seen. One person got lucky, or arrived at a quiet moment.",
      q1: "Q1 = 27 minutes means 25% of patients (about 1 in 4) were seen in under 27 minutes. Most people had to wait longer.",
      median: "Median = 45 minutes is the typical waiting time - half of patients waited less, half waited more. This is the number a hospital manager cares most about. The NHS target is 4 hours (240 min), so 45 min sounds fine - but is it consistent?",
      q3: "Q3 = 67 minutes means 75% of patients waited under 67 minutes. That also means 1 in 4 patients waited over an hour - which matters a lot.",
      iqr: "IQR = 67 − 27 = 40 minutes. This is a wide spread - the middle 50% of patients waited anywhere from 27 to 67 minutes. That's inconsistent. Some are seen quickly, others wait a long time.",
      max: "88 minutes - someone waited nearly 1.5 hours. The maximum shows the worst case.",
    },
    decisionText: "A manager seeing this data would ask: why is there such a big gap between the fastest and slowest? The IQR of 40 minutes suggests staffing is uneven - some shifts are much busier than others.",
    scaleMin: 0, scaleMax: 100,
  },
  {
    id: "school",
    icon: "🏫",
    title: "Exam Scores",
    hook: "You're a teacher reviewing your class's maths test results.",
    setup: "Year 11 have just sat a practice paper marked out of 60. The results came back in register order - not sorted. You need to understand how the class did and whether the test was pitched at the right level.",
    unit: "marks",
    unitShort: "marks",
    rawData: [48, 22, 35, 54, 18, 41, 30, 56, 27, 44, 38, 52, 33, 19, 46],
    sorted:  [18, 19, 22, 27, 30, 33, 35, 38, 41, 44, 46, 48, 52, 54, 56],
    answer: { min: 18, q1: 27, median: 38, q3: 48, max: 56 },
    whySortExplain: "Exam scores arrive in any order. To find who is in the middle - the median - we need to rank them from lowest to highest first. It's the same as lining pupils up by height: you can't find the person in the middle until everyone is standing in order.",
    contextExplain: {
      min: "18 marks - the lowest score. One student really struggled. The teacher would want to speak to them.",
      q1: "Q1 = 27 marks means a quarter of the class scored under 27. These students are below the lower quartile - a priority for extra support.",
      median: "Median = 38 marks out of 60 is roughly 63%. Half the class scored above 38, half below. For a practice paper, this might be acceptable - or it might suggest the paper was too hard.",
      q3: "Q3 = 48 means 75% of the class scored under 48. Only the top quarter scored 48 or above - so the highest marks weren't common.",
      iqr: "IQR = 48 − 27 = 21 marks. The middle half of the class had quite a spread of results. This suggests mixed ability - some pupils are much stronger than others, which affects how the teacher plans the next lesson.",
      max: "56 marks - a strong performance. The range is 56 − 18 = 38, which is large. There's a big gap between the best and worst in the class.",
    },
    decisionText: "The teacher might decide: the median is OK, but the wide IQR means some pupils need differentiated work. The bottom quarter (below 27) needs targeted intervention before the real exam.",
    scaleMin: 0, scaleMax: 70,
  },
  {
    id: "delivery",
    icon: "📦",
    title: "Delivery Times",
    hook: "You run a small business. Customers are complaining about slow deliveries.",
    setup: "You track how many days it takes for 15 orders to arrive after dispatch. The data is listed in order of dispatch date - not sorted by delivery time.",
    unit: "days",
    unitShort: "days",
    rawData: [4, 2, 7, 3, 9, 5, 2, 6, 3, 11, 4, 8, 2, 5, 6],
    sorted:  [2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 11],
    answer: { min: 2, q1: 3, median: 5, q3: 6, max: 11 },
    whySortExplain: "Dispatch dates are in time order - but that doesn't tell us anything about speed. We sort by delivery time so we can see the range from fastest to slowest. Only then can we find the median and quartiles.",
    contextExplain: {
      min: "2 days - the fastest deliveries. Three orders arrived in just 2 days. If the courier can do this sometimes, why not always?",
      q1: "Q1 = 3 days - a quarter of orders arrived within 3 days. These customers were happy.",
      median: "Median = 5 days - the typical delivery. Half of orders took less than 5 days, half took more. You could promise customers '5 days' and be right about half the time.",
      q3: "Q3 = 6 days - 75% of orders arrived within 6 days. But 25% took longer - those are the complaints.",
      iqr: "IQR = 6 − 3 = 3 days. The middle half of deliveries ranged from 3 to 6 days. That's actually quite consistent - most orders arrive in a predictable window.",
      max: "11 days - one order took nearly 2 weeks. That's the outlier causing your worst complaints. The whisker from Q3 to Max (6 to 11) is long, showing a tail of slow deliveries.",
    },
    decisionText: "The business owner might conclude: most deliveries are fine (IQR of 3 days), but there are occasional outliers that cause problems. The focus should be on eliminating the very slow deliveries, not fixing the typical ones.",
    scaleMin: 0, scaleMax: 15,
  },
];

// ── Accordion hint ────────────────────────────────────────────────────────
function Hint({ title, children, color }) {
  const [open, setOpen] = useState(false);
  const bg = color === "amber" ? "#fffbeb" : C.accentDim;
  const border = color === "amber" ? "#d97706" : C.accent;
  const textColor = color === "amber" ? "#92400e" : C.accent;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "10px 14px", background: open ? bg : "transparent", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: textColor }}>{title}</span>
        <span style={{ fontSize: "12px", color: textColor }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>
      {open && (
        <div style={{ background: bg, padding: "12px 14px", borderTop: `1px solid ${border}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Step 1: Unordered data ────────────────────────────────────────────────
function Step1({ s, onNext }) {
  return (
    <div>
      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#15803d", margin: "0 0 6px" }}>{s.icon} Your task</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>{s.setup}</p>
      </div>

      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, marginBottom: "10px" }}>Raw data ({s.rawData.length} values):</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {s.rawData.map((v, i) => (
          <div key={i} style={{ minWidth: "44px", height: "44px", borderRadius: "10px", background: C.surface,
            border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "600", color: C.text }}>
            {v}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.6, marginBottom: "20px" }}>
        These numbers are in the order they arrived - not in any useful order. Before we can find the median or quartiles, we need to sort them.
      </p>

      <button onClick={onNext} style={{ width: "100%", padding: "14px", background: C.accent, color: "#fff",
        border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
        Next: Sort the data →
      </button>
    </div>
  );
}

// ── Step 2: Sort the data ─────────────────────────────────────────────────
function Step2({ s, onNext }) {
  return (
    <div>
      <Hint title="💡 Why do we sort the data first?" color="amber">
        <p style={{ fontSize: "13px", color: "#92400e", margin: 0, lineHeight: 1.7 }}>{s.whySortExplain}</p>
      </Hint>

      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "16px 0 6px" }}>Original (unsorted):</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {s.rawData.map((v, i) => (
          <div key={i} style={{ minWidth: "40px", height: "40px", borderRadius: "8px", background: C.surface,
            border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", color: C.muted }}>
            {v}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, marginBottom: "6px" }}>Sorted (lowest → highest):</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
        {s.sorted.map((v, i) => {
          const n = s.sorted.length;
          const medIdx = Math.floor(n / 2);
          const q1Idx = Math.floor((n - 1) / 4);
          const q3Idx = Math.floor(3 * (n - 1) / 4);
          // for odd n: median = midIdx, Q1 = q1Idx, Q3 = q3Idx
          const isMedian = i === medIdx;
          const isQ1 = i === q1Idx;
          const isQ3 = i === q3Idx;
          return (
            <div key={i} style={{ minWidth: "40px", height: "40px", borderRadius: "8px",
              background: isMedian ? C.text : isQ1 || isQ3 ? C.accentDim : C.surface,
              border: `1.5px solid ${isMedian ? C.text : isQ1 || isQ3 ? C.accent : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: isMedian || isQ1 || isQ3 ? "700" : "400",
              color: isMedian ? "#fff" : isQ1 || isQ3 ? C.accent : C.text,
              position: "relative" }}>
              {v}
              {isMedian && <span style={{ position: "absolute", top: "-18px", fontSize: "9px", fontWeight: "700", color: C.text, whiteSpace: "nowrap" }}>Median</span>}
            </div>
          );
        })}
      </div>

      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          With {s.sorted.length} values (odd number), the median is the <strong style={{ color: C.accent }}>{Math.floor(s.sorted.length / 2) + 1}{["st","nd","rd"][Math.floor(s.sorted.length / 2)] || "th"} value = {s.answer.median}</strong>.<br />
          Q1 is the median of the lower half. Q3 is the median of the upper half.
        </p>
      </div>

      <button onClick={onNext} style={{ width: "100%", padding: "14px", background: C.accent, color: "#fff",
        border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
        Next: Find Q1, Median, Q3 →
      </button>
    </div>
  );
}

// ── Step 3: Find the values ────────────────────────────────────────────────
function Step3({ s, onNext }) {
  const [openKey, setOpenKey] = useState(null);
  const { min, q1, median, q3, max } = s.answer;
  const iqr = q3 - q1;

  const items = [
    { key: "min", label: "Minimum", value: min, hint: "The first (smallest) number in the sorted list." },
    { key: "q1", label: "Q1 - Lower Quartile", value: q1, hint: `Take the bottom half of the data (below the median). Find the middle of those values. Here that's ${q1} ${s.unitShort}.` },
    { key: "median", label: "Median", value: median, hint: `${s.sorted.length} values - odd number. The middle one is position ${Math.floor(s.sorted.length / 2) + 1} = ${median} ${s.unitShort}.` },
    { key: "q3", label: "Q3 - Upper Quartile", value: q3, hint: `Take the upper half of the data (above the median). Find the middle of those values. Here that's ${q3} ${s.unitShort}.` },
    { key: "max", label: "Maximum", value: max, hint: "The last (largest) number in the sorted list." },
    { key: "iqr", label: "IQR", value: iqr, hint: `IQR = Q3 − Q1 = ${q3} − ${q1} = ${iqr} ${s.unitShort}` },
  ];

  return (
    <div>
      <Hint title="💡 How to find each value - step by step" color="green">
        <p style={{ fontSize: "13px", color: C.accent, margin: "0 0 8px", lineHeight: 1.6 }}>
          <strong>Median:</strong> The middle value of all the data when sorted.<br />
          <strong>Q1:</strong> The median of the bottom half (values below the median).<br />
          <strong>Q3:</strong> The median of the top half (values above the median).<br />
          <strong>IQR:</strong> Q3 − Q1 - tells you how spread out the middle 50% are.
        </p>
      </Hint>

      <Hint title="📊 What do these numbers actually mean?" color="amber">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["min","q1","median","q3","iqr","max"].map(k => (
            <div key={k} style={{ borderBottom: `1px solid #fde68a`, paddingBottom: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#92400e", margin: "0 0 2px" }}>
                {items.find(i => i.key === k)?.label} = {s.contextExplain[k].split("-")[0]}
              </p>
              <p style={{ fontSize: "12px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>{s.contextExplain[k]}</p>
            </div>
          ))}
        </div>
      </Hint>

      <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "16px 0 10px" }}>The 5-number summary:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {items.map(item => (
          <div key={item.key}>
            <button onClick={() => setOpenKey(openKey === item.key ? null : item.key)}
              style={{ width: "100%", padding: "12px 14px", background: openKey === item.key ? C.accentDim : C.surface,
                border: `1.5px solid ${openKey === item.key ? C.accent : C.border}`,
                borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: openKey === item.key ? C.accent : C.text }}>{item.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800", color: C.accent }}>{item.value}</span>
                <span style={{ fontSize: "12px", color: C.muted }}>{openKey === item.key ? "▲" : "▼ how?"}</span>
              </div>
            </button>
            {openKey === item.key && (
              <div style={{ background: C.accentDim, border: `1px solid ${C.accent}`, borderTop: "none",
                borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", padding: "10px 14px" }}>
                <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{item.hint}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onNext} style={{ width: "100%", padding: "14px", background: C.accent, color: "#fff",
        border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
        Next: See the box plot →
      </button>
    </div>
  );
}

// ── Step 4: Box plot reveal + meaning ────────────────────────────────────
function Step4({ s, onRestart }) {
  return (
    <div>
      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "14px", lineHeight: 1.6 }}>
        All 5 values plotted on a single diagram. This is what a manager, teacher, or analyst would actually look at.
      </p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <BoxPlotSVG
          sets={[{ ...s.answer, label: s.title, color: C.accent }]}
          scaleMin={s.scaleMin} scaleMax={s.scaleMax} unit={s.unit}
          showLabels={false}
        />
      </div>

      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#15803d", margin: "0 0 6px" }}>💡 What does this box plot tell us?</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: 0 }}>{s.decisionText}</p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick summary</p>
        {[
          { label: "Median", value: s.answer.median, unit: s.unitShort, desc: "Typical result" },
          { label: "IQR", value: s.answer.q3 - s.answer.q1, unit: s.unitShort, desc: "Consistency (smaller = better)" },
          { label: "Range", value: s.answer.max - s.answer.min, unit: s.unitShort, desc: "Total spread" },
          { label: "Min", value: s.answer.min, unit: s.unitShort, desc: "Best case" },
          { label: "Max", value: s.answer.max, unit: s.unitShort, desc: "Worst case" },
        ].map(({ label, value, unit, desc }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0",
            borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>{label}</span>
              <span style={{ fontSize: "11px", color: C.muted, marginLeft: "8px" }}>{desc}</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "800", color: C.accent }}>{value} {unit}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.7 }}>
          ⭐ <strong>Exam answer:</strong> "{s.title.split(" ")[0] === "Hospital" ? "City Hospital" : s.title} had a median of {s.answer.median} {s.unitShort} and an IQR of {s.answer.q3 - s.answer.q1} {s.unitShort}."<br />
          This is the sentence structure examiners look for when comparing box plots.
        </p>
      </div>

      <button onClick={onRestart} style={{ width: "100%", padding: "12px", background: "transparent",
        border: `1.5px solid ${C.border}`, borderRadius: "10px", color: C.muted, fontSize: "13px", cursor: "pointer" }}>
        ← Try another scenario
      </button>
    </div>
  );
}

// ── Step progress bar ─────────────────────────────────────────────────────
function StepBar({ step, total }) {
  const labels = ["The data", "Sort it", "Find values", "Box plot"];
  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
      {labels.map((label, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center" }}>
          <div style={{ height: "4px", borderRadius: "99px", background: i < step ? C.accent : i === step ? C.accent + "80" : C.border, marginBottom: "4px" }} />
          <span style={{ fontSize: "10px", color: i <= step ? C.accent : C.muted, fontWeight: i === step ? "700" : "400" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main RealWorld component ──────────────────────────────────────────────
export default function RealWorld() {
  const [selectedId, setSelected] = useState(null);
  const [step, setStep] = useState(0);

  const scenario = SCENARIOS.find(s => s.id === selectedId);

  if (!selectedId) {
    return (
      <div>
        <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
          Choose a real-world situation. You'll work through the data step-by-step - sorting it, finding Q1, median and Q3, then building the box plot.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SCENARIOS.map(s => (
            <button key={s.id} onClick={() => { setSelected(s.id); setStep(0); scrollToTop(); }}
              style={{ padding: "16px", background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "12px", cursor: "pointer", textAlign: "left", display: "flex", gap: "14px", alignItems: "center" }}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: "0 0 2px" }}>{s.title}</p>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>{s.hook}</p>
              </div>
              <span style={{ color: C.muted, fontSize: "20px", marginLeft: "auto", flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const s = scenario;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button onClick={() => { setSelected(null); scrollToTop(); }}
          style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px",
            padding: "6px 10px", cursor: "pointer", color: C.muted, fontSize: "12px" }}>
          ← Back
        </button>
        <span style={{ fontSize: "22px" }}>{s.icon}</span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: 0 }}>{s.title}</p>
          <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>{s.hook}</p>
        </div>
      </div>

      <StepBar step={step} total={4} />

      {step === 0 && <Step1 s={s} onNext={() => { setStep(1); scrollToTop(); }} />}
      {step === 1 && <Step2 s={s} onNext={() => { setStep(2); scrollToTop(); }} />}
      {step === 2 && <Step3 s={s} onNext={() => { setStep(3); scrollToTop(); }} />}
      {step === 3 && <Step4 s={s} onRestart={() => { setSelected(null); setStep(0); scrollToTop(); }} />}
    </div>
  );
}