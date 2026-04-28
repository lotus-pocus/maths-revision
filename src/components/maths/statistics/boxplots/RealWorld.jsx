import React, { useState } from "react";
import { C, HOSPITAL_SCENARIOS } from "./data";
import BoxPlotSVG from "./shared/BoxPlotSVG";
import CumFreqGraph from "./shared/CumFreqGraph";

// ── Generate sample ordered data for the data table ───────────────────────
function generateSampleData(s) {
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const vals = [];
  for (let i = 0; i < 5; i++)  vals.push(lerp(s.min, s.q1, i / 4));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q1, s.median, i / 5));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.median, s.q3, i / 5));
  for (let i = 1; i <= 5; i++) vals.push(lerp(s.q3, s.max, i / 5));
  return vals;
}

// ── Ordered data table ────────────────────────────────────────────────────
function OrderedDataTable({ s, unit }) {
  const [expanded, setExpanded] = useState(false);
  const data = generateSampleData(s);
  const special = {
    0:  { role: "Minimum",                             color: C.muted,   bg: "#f9fafb" },
    4:  { role: "Q1 — 25% of results below this",     color: s.color,   bg: C.accentDim },
    9:  { role: "Median — 50% of results below this", color: C.text,    bg: "#f3f4f6" },
    14: { role: "Q3 — 75% of results below this",     color: s.color,   bg: C.accentDim },
    19: { role: "Maximum",                             color: C.muted,   bg: "#f9fafb" },
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
            { label: "Median (average)",     fn: (s) => s.median, lower: true },
            { label: "IQR (consistency)",    fn: iqr,             lower: true },
            { label: "Range (total spread)", fn: range,           lower: true },
            { label: "Minimum",              fn: (s) => s.min,    lower: true },
            { label: "Maximum",              fn: (s) => s.max,    lower: true },
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

// ── Real World tab ────────────────────────────────────────────────────────
export default function RealWorld() {
  const [scenarioIdx, setScenario] = useState(0);
  const [deep, setDeep]            = useState(false);
  const [showCumFreq, setShowCumFreq] = useState(false);

  React.useEffect(() => { setDeep(false); setShowCumFreq(false); }, [scenarioIdx]);

  const scenario = HOSPITAL_SCENARIOS[scenarioIdx];

  return (
    <div>
      {/* Scenario picker */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {HOSPITAL_SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => setScenario(i)} style={{ padding: "12px 16px", background: scenarioIdx === i ? C.accentDim : C.surface, border: `1px solid ${scenarioIdx === i ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", textAlign: "left", color: scenarioIdx === i ? C.accent : C.muted, fontSize: "13px", fontWeight: scenarioIdx === i ? "700" : "400" }}>
            <span style={{ marginRight: "8px" }}>{s.icon}</span>
            <span style={{ fontWeight: 700 }}>{s.world}:</span> {s.title} — <span style={{ fontWeight: 400 }}>{s.subtitle}</span>
          </button>
        ))}
      </div>

      {/* One-line hook */}
      <div style={{ background: C.surface, borderLeft: `3px solid ${C.accent}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: C.accent }}>{scenario.icon} {scenario.world}:</strong>{" "}
          {scenario.context.split(".")[0]}. A box plot shows the spread at a glance — the chart below compares two sets of data side by side.
        </p>
      </div>

      {/* Box plot */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, marginBottom: "4px" }}>{scenario.title}</p>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: "16px" }}>{scenario.subtitle}</p>
        <BoxPlotSVG
          sets={scenario.sets}
          scaleMin={Math.min(...scenario.sets.map(s => s.min)) - 5}
          scaleMax={Math.max(...scenario.sets.map(s => s.max)) + 5}
          unit={scenario.unit}
        />
      </div>

      {/* Quick key facts */}
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
      <button onClick={() => setDeep(!deep)} style={{ width: "100%", padding: "12px 16px", background: deep ? C.accentDim : C.surface, border: `1px solid ${deep ? C.accent : C.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: deep ? "16px" : "0" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: deep ? C.accent : C.text }}>🔍 Dig deeper — understand every number</span>
        <span style={{ fontSize: "12px", color: C.muted }}>{deep ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {deep && (
        <div>
          {/* Why context */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{scenario.icon} {scenario.world} — why they use box plots</p>
            <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>{scenario.context}</p>
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

          {/* Ordered data tables */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {scenario.sets.map((s) => <OrderedDataTable key={s.label} s={s} unit={scenario.unit} />)}
          </div>

          {/* Cumulative frequency graph — new section */}
          <button onClick={() => setShowCumFreq(!showCumFreq)} style={{ width: "100%", padding: "12px 16px", background: showCumFreq ? "#a78bfa30" : C.surface, border: `1px solid ${showCumFreq ? C.purple : C.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showCumFreq ? "16px" : "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: showCumFreq ? C.purple : C.text }}>📈 See the same data as a cumulative frequency graph</span>
            <span style={{ fontSize: "12px", color: C.muted }}>{showCumFreq ? "▲ Hide" : "▼ Show"}</span>
          </button>

          {showCumFreq && scenario.cumFreq && (
            <div style={{ background: C.card, border: `1px solid ${C.purple}40`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, marginBottom: "4px" }}>Cumulative frequency graph — {scenario.title}</p>
              <p style={{ fontSize: "12px", color: C.muted, marginBottom: "12px", lineHeight: 1.5 }}>
                This shows the same data as the box plot above, but in graph form. The dashed lines show how to read off the median and quartiles — exactly what you'll need to do in the exam.
              </p>
              <CumFreqGraph
                sets={scenario.cumFreq.sets}
                totalFreq={scenario.cumFreq.totalFreq}
                scaleMin={scenario.cumFreq.scaleMin}
                scaleMax={scenario.cumFreq.scaleMax}
                unit={scenario.cumFreq.unit}
                readPoints={[
                  { freq: Math.round(scenario.cumFreq.totalFreq * 0.25), label: "Q1", value: scenario.sets[0].q1, color: C.accent },
                  { freq: Math.round(scenario.cumFreq.totalFreq * 0.5),  label: "Median", value: scenario.sets[0].median, color: C.text },
                  { freq: Math.round(scenario.cumFreq.totalFreq * 0.75), label: "Q3", value: scenario.sets[0].q3, color: C.accent },
                ]}
              />
              <div style={{ background: C.accentDim, borderRadius: "8px", padding: "10px 12px", marginTop: "12px" }}>
                <p style={{ fontSize: "12px", color: C.accent, margin: 0, lineHeight: 1.6 }}>
                  💡 <strong>Notice:</strong> The dashed lines read off Q1, Median and Q3 from {scenario.sets[0].label}'s curve. This is exactly the technique you'll use in exam questions Q8 and Q9 — the graph gives you the values, you use them to draw the box plot.
                </p>
              </div>
            </div>
          )}

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
                  { label: "IQR",    val: s.q3 - s.q1,  plain: "Spread of middle 50%" },
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
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "2px" }}>Side-by-side comparison</p>
            <CompareTable sets={scenario.sets} />
          </div>

          <ExamSentenceBuilder sets={scenario.sets} />
        </div>
      )}
    </div>
  );
}