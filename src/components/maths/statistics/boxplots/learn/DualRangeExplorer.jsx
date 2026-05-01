import React, { useState } from "react";
import { C } from "../data";

// ── Fixed middle 13 scores ────────────────────────────────────────────────
// Min and max are slider-controlled. Median is always the 8th of 15 values.
// Sliders are constrained so they can never reach the middle cluster.
const MIDDLE = [47, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 63];
const MIDDLE_SUM = MIDDLE.reduce((a, b) => a + b, 0); // 780

function medianOf(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function getDataset(minVal, maxVal) {
  return [minVal, ...MIDDLE, maxVal].sort((a, b) => a - b);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function Card({ title, formula, value, subLabel, highlight, dimColor, brightColor }) {
  return (
    <div style={{
      background: highlight ? "#fef2f2" : "#f9fafb",
      border: `2px solid ${highlight ? "#fca5a5" : "#e5e7eb"}`,
      borderRadius: "12px", padding: "14px", textAlign: "center",
      transition: "background 0.2s, border-color 0.2s",
    }}>
      <p style={{ fontSize: "11px", fontWeight: "700", color: highlight ? "#dc2626" : C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{title}</p>
      <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 8px", minHeight: "16px" }}>{formula}</p>
      <p style={{ fontSize: "30px", fontWeight: "800", color: highlight ? "#dc2626" : brightColor, margin: "0 0 4px", transition: "color 0.2s" }}>{value}</p>
      <p style={{ fontSize: "12px", fontWeight: "600", color: highlight ? "#dc2626" : dimColor, margin: 0 }}>{subLabel}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.border}`, margin: "22px 0" }} />;
}

// ── Main component ────────────────────────────────────────────────────────
export default function DualRangeExplorer() {
  const [minVal, setMinVal] = useState(20);
  const [maxVal, setMaxVal] = useState(78);

  const dataset  = getDataset(minVal, maxVal);
  const median   = medianOf(dataset);
  const midrange = Math.round((minVal + maxVal) / 2);
  const mean     = Math.round((MIDDLE_SUM + minVal + maxVal) / 15);

  const midrangeGap = Math.abs(midrange - median);
  const meanGap     = Math.abs(mean - median);
  const midrangeBad = midrangeGap >= 8;
  const meanBad     = meanGap >= 5;

  const handleMin = (e) => {
    const v = Number(e.target.value);
    if (v < maxVal - 1) setMinVal(v);
  };
  const handleMax = (e) => {
    const v = Number(e.target.value);
    if (v > minVal + 1) setMaxVal(v);
  };

  return (
    <div>

      {/* ── Intro ── */}
      <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 16px" }}>
        15 students sat a maths test. The <strong>13 middle scores</strong> are fixed.
        Drag the <span style={{ color: "#dc2626", fontWeight: 700 }}>lowest</span> and{" "}
        <span style={{ color: "#d97706", fontWeight: 700 }}>highest</span> scores to see
        how each "average" reacts.
      </p>

      {/* ── Score table ── */}
      <div style={{ marginBottom: "20px" }}>
        <SectionLabel>All 15 scores in order</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {dataset.map((v, i) => {
            const isLo  = i === 0;
            const isHi  = i === dataset.length - 1;
            const isMed = i === 7;
            let bg = "#f3f4f6", color = C.text, border = "1.5px solid #e5e7eb", fw = "600";
            if (isLo)  { bg = "#fef2f2"; color = "#dc2626"; border = "1.5px solid #fca5a5"; fw = "800"; }
            if (isHi)  { bg = "#fff8f0"; color = "#d97706"; border = "1.5px solid #fcd34d"; fw = "800"; }
            if (isMed) { bg = "#ecfdf5"; color = C.accent;  border = `2px solid ${C.accent}`; fw = "800"; }
            return (
              <div key={i} style={{ width: "38px", height: "38px", borderRadius: "8px", border, background: bg, color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: fw, position: "relative" }}>
                {v}
                {isMed && (
                  <div style={{ position: "absolute", bottom: "-18px", left: "50%", transform: "translateX(-50%)",
                    fontSize: "9px", fontWeight: "700", color: C.accent, whiteSpace: "nowrap" }}>median</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ height: "22px" }} />
      </div>

      {/* ── Sliders ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626", margin: 0 }}>← Drag lowest score</p>
            <p style={{ fontSize: "13px", fontWeight: "800", color: "#dc2626", margin: 0 }}>{minVal}</p>
          </div>
          <input type="range" min={1} max={46} value={minVal} onChange={handleMin}
            style={{ width: "100%", accentColor: "#dc2626", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
            <span style={{ fontSize: "11px", color: C.muted }}>1 (worst possible)</span>
            <span style={{ fontSize: "11px", color: C.muted }}>46</span>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#d97706", margin: 0 }}>Drag highest score →</p>
            <p style={{ fontSize: "13px", fontWeight: "800", color: "#d97706", margin: 0 }}>{maxVal}</p>
          </div>
          <input type="range" min={64} max={100} value={maxVal} onChange={handleMax}
            style={{ width: "100%", accentColor: "#d97706", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
            <span style={{ fontSize: "11px", color: C.muted }}>64</span>
            <span style={{ fontSize: "11px", color: C.muted }}>100 (full marks)</span>
          </div>
        </div>
      </div>

      {/* ── Three-column comparison ── */}
      <SectionLabel>Three ways to summarise the class</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>

        {/* Midrange */}
        <div style={{
          background: midrangeBad ? "#fef2f2" : "#fff8f0",
          border: `2px solid ${midrangeBad ? "#fca5a5" : "#fcd34d"}`,
          borderRadius: "12px", padding: "12px 10px", textAlign: "center",
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#d97706", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Midrange</p>
          <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 6px" }}>({minVal}+{maxVal})÷2</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: midrangeBad ? "#dc2626" : "#d97706", margin: "0 0 4px" }}>{midrange}</p>
          <p style={{ fontSize: "10px", fontWeight: "700", color: midrangeBad ? "#dc2626" : C.muted, margin: 0 }}>
            {midrangeGap === 0 ? "matches median" : `${midrangeGap} off`}
          </p>
        </div>

        {/* Mean */}
        <div style={{
          background: meanBad ? "#fef2f2" : "#f5f3ff",
          border: `2px solid ${meanBad ? "#fca5a5" : "#c4b5fd"}`,
          borderRadius: "12px", padding: "12px 10px", textAlign: "center",
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: meanBad ? "#dc2626" : "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Mean</p>
          <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 6px" }}>sum ÷ 15</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: meanBad ? "#dc2626" : "#7c3aed", margin: "0 0 4px" }}>{mean}</p>
          <p style={{ fontSize: "10px", fontWeight: "700", color: meanBad ? "#dc2626" : C.muted, margin: 0 }}>
            {meanGap === 0 ? "matches median" : `${meanGap} off`}
          </p>
        </div>

        {/* Median */}
        <div style={{
          background: "#ecfdf5",
          border: `2px solid #6ee7b7`,
          borderRadius: "12px", padding: "12px 10px", textAlign: "center",
        }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Median</p>
          <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 6px" }}>8th of 15</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: C.accent, margin: "0 0 4px" }}>{median}</p>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#059669", margin: 0 }}>✓ unchanged</p>
        </div>
      </div>

      {/* Dynamic callout */}
      <div style={{
        background: midrangeBad ? "#fef2f2" : "#f0fdf4",
        border: `1px solid ${midrangeBad ? "#fca5a5" : "#86efac"}`,
        borderRadius: "10px", padding: "12px 14px", marginBottom: "6px",
        transition: "background 0.2s, border-color 0.2s",
      }}>
        {midrangeGap === 0 && meanGap === 0 ? (
          <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
            All three agree right now — drag the sliders to see the differences emerge.
          </p>
        ) : (
          <p style={{ fontSize: "13px", color: midrangeBad ? "#991b1b" : "#166534", margin: 0, lineHeight: 1.6 }}>
            {midrangeBad
              ? <><strong>Midrange is {midrangeGap} marks off the median.</strong> The mean moved {meanGap === 0 ? "not at all" : `by ${meanGap} marks`} — it's affected by outliers but not as badly. The median didn't move at all.</>
              : <>Small differences so far — try dragging the lowest score all the way down to 1.</>
            }
          </p>
        )}
      </div>

      <Divider />

      {/* ── Pros and cons ── */}
      <SectionLabel>How each one handles outliers</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "6px" }}>

        {/* Midrange */}
        <div style={{ background: "#fff8f0", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <p style={{ fontSize: "13px", fontWeight: "800", color: "#d97706", margin: 0 }}>Midrange — avoid it</p>
          </div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.65, margin: "0 0 6px" }}>
            Only uses two numbers — the very lowest and very highest score. Every other student is completely ignored. One unusually bad or brilliant result will pull it far from reality.
          </p>
          <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
            ✗ Not used in GCSE statistics. Not a reliable measure of anything.
          </p>
        </div>

        {/* Mean */}
        <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: "12px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "16px" }}>📊</span>
            <p style={{ fontSize: "13px", fontWeight: "800", color: "#7c3aed", margin: 0 }}>Mean — useful, but sensitive</p>
          </div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.65, margin: "0 0 6px" }}>
            Uses all scores — so it's much more representative than the midrange. But one extreme result still affects it. If one student scored 2 out of 100, the class mean drops even though everyone else did fine.
          </p>
          <p style={{ fontSize: "12px", color: "#4c1d95", margin: 0 }}>
            ✓ Good for symmetric data with no extreme outliers.<br />
            ✗ Gets distorted when results are skewed or uneven.
          </p>
        </div>

        {/* Median */}
        <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "12px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "16px" }}>✅</span>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: 0 }}>Median — most robust</p>
          </div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.65, margin: "0 0 6px" }}>
            Only cares about position — the middle value. Extreme scores can't move it because it's not counting totals, it's just finding the centre of the queue. That's why it's the measure box plots are built around.
          </p>
          <p style={{ fontSize: "12px", color: "#065f46", margin: 0 }}>
            ✓ Best when data is skewed or has outliers.<br />
            ✓ The measure used inside every box plot.
          </p>
        </div>
      </div>

      <Divider />

      {/* ── But even median only tells half the story ── */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "16px", marginBottom: "6px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 8px" }}>
          But even the median only tells half the story
        </p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: "0 0 10px" }}>
          Imagine two classes, both with a median of 55:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>Class A</p>
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 8px" }}>Median = 55</p>
            <p style={{ fontSize: "11px", color: C.text, margin: "0 0 4px" }}>Scores: 52, 53, 54, <strong>55</strong>, 56, 57, 58</p>
            <div style={{ background: C.accentDim, borderRadius: "6px", padding: "6px", marginTop: "6px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: C.accent, margin: 0 }}>IQR = 4 — very consistent</p>
            </div>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>Class B</p>
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 8px" }}>Median = 55</p>
            <p style={{ fontSize: "11px", color: C.text, margin: "0 0 4px" }}>Scores: 12, 28, 41, <strong>55</strong>, 69, 82, 95</p>
            <div style={{ background: "#fef2f2", borderRadius: "6px", padding: "6px", marginTop: "6px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#dc2626", margin: 0 }}>IQR = 54 — all over the place</p>
            </div>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
          Same median. Completely different classes. A single number — mean, median, or anything else — cannot show you this. Only a box plot can, because it also shows the <strong>spread</strong> through the IQR (Interquartile Range).
        </p>
      </div>

      <Divider />

      {/* ── Decision framework ── */}
      <SectionLabel>When to use each approach</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {[
          {
            icon: "📊",
            label: "Use the mean when…",
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#c4b5fd",
            points: [
              "Data is roughly symmetrical — most scores are close together",
              "There are no extreme outliers skewing things",
              "You need one number for further calculations (e.g. class average for a report)",
            ],
          },
          {
            icon: "📦",
            label: "Use a box plot when…",
            color: C.accent,
            bg: C.accentDim,
            border: `${C.accent}60`,
            points: [
              "You want to see spread and consistency, not just the middle",
              "You're comparing two groups side by side",
              "There might be outliers pulling the mean away from reality",
              "The question mentions consistency, spread, range, or typical values",
            ],
          },
        ].map(({ icon, label, color, bg, border, points }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "12px", padding: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: "800", color, margin: "0 0 8px" }}>{icon} {label}</p>
            {points.map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < points.length - 1 ? "6px" : 0 }}>
                <span style={{ fontSize: "12px", color, flexShrink: 0, marginTop: "1px" }}>→</span>
                <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{pt}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Exam trigger words ── */}
      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "12px", padding: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: "#d97706", margin: "0 0 10px" }}>
          ⭐ Exam trigger words — spot these and reach for a box plot
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["compare", "consistent", "spread", "typical", "range", "outlier", "more reliable", "better represents", "interquartile"].map(word => (
            <span key={word} style={{
              fontSize: "12px", fontWeight: "700", color: "#92400e",
              background: "#fff", border: "1.5px solid #fcd34d",
              borderRadius: "99px", padding: "4px 10px",
            }}>
              {word}
            </span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "#92400e", margin: "10px 0 0", lineHeight: 1.6 }}>
          If any of these appear in an exam question, a single average won't be enough for full marks. The examiner wants you to talk about spread — and that means IQR and box plots.
        </p>
      </div>

    </div>
  );
}