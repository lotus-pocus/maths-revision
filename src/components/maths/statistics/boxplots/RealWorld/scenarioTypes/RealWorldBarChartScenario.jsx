import { useState } from "react";
import { C } from "../../data";
import BoxPlotSVG from "../../shared/BoxPlotSVG";
import BottomNav from "../BottomNav";
import FrequencyTableDropdown from "../FrequencyTableDropdown";
import QuickSummary from "../QuickSummary";
import { RAW_A, RAW_B, ROWS_A, ROWS_B } from "./barChartData";
import {
  BarChartSVG,
  ToggleButtons,
  RawHeightsDropdown,
  SortedDataStrip,
  HowValuesAreFound,
  ValueCard,
} from "./BarChartHelpers";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function RealWorldBarChartScenario({ scenario: s, onRestart }) {
  const [step, setStep]     = useState(0);
  const [active, setActive] = useState("A");

  const activeRows   = active === "A" ? ROWS_A   : ROWS_B;
  const activeRaw    = active === "A" ? RAW_A    : RAW_B;
  const activeAnswer = active === "A" ? s.answer : s.answerB;
  const activeColor  = active === "A" ? C.accent : C.amber;
  const activeLabel  = active === "A" ? "Fertiliser A" : "Fertiliser B";

  const go = (n) => { setStep(n); scrollToTop(); };

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "800", color: C.accent, marginBottom: "6px" }}>
        🔬 {s.title}
      </p>

      {/* ── Step 0: The bar chart ── */}
      {step === 0 && (
        <div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7 }}>{s.setup}</p>
          <div style={{ background: "#fffbeb", border: "1px solid #f59e0b",
            borderRadius: "10px", padding: "12px 14px", margin: "14px 0" }}>
            <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              💡 <strong>Careful:</strong> the bar height is the <strong>frequency</strong> — how
              many plants are in that height range. It is not the plant height. A bar labelled 5
              means "5 plants", not "5 cm".
            </p>
          </div>
          <ToggleButtons active={active} setActive={setActive} />
          <div style={{ background: C.card, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "800", color: activeColor, marginBottom: "10px" }}>
              {activeLabel} — frequency chart
            </p>
            <BarChartSVG rows={activeRows} color={activeColor} />
          </div>
          <RawHeightsDropdown label={activeLabel} data={activeRaw} color={activeColor} />
          <FrequencyTableDropdown rows={activeRows} label={activeLabel} color={activeColor} />
          <BottomNav showBack={false} onNext={() => go(1)} nextLabel="Next: Find values →" />
        </div>
      )}

      {/* ── Step 1: Find the values ── */}
      {step === 1 && (
        <div>
          <ToggleButtons active={active} setActive={setActive} />
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>
              For exact box plot values, use the <strong>sorted plant heights</strong>. The chart
              helps you see the pattern, but the sorted data gives you the exact Min, Q1, Median,
              Q3 and Max.
            </p>
          </div>
          <SortedDataStrip label={activeLabel} data={activeRaw} color={activeColor} />
          <HowValuesAreFound label={activeLabel} data={activeRaw} color={activeColor} />
          <ValueCard label={activeLabel} data={activeAnswer} color={activeColor} unit={s.unitShort} />
          <BottomNav onBack={() => go(0)} onNext={() => go(2)} nextLabel="Next: Compare both fertilisers →" />
        </div>
      )}

      {/* ── Step 2: Compare both ── */}
      {step === 2 && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <BoxPlotSVG
              sets={[
                { ...s.answer,  label: "Fertiliser A", color: C.accent },
                { ...s.answerB, label: "Fertiliser B", color: C.amber  },
              ]}
              scaleMin={s.scaleMin} scaleMax={s.scaleMax} unit={s.unit}
            />
          </div>
          <QuickSummary s={s} />
          <BottomNav onBack={() => go(1)} onNext={() => go(3)} nextLabel="Next: Exam answer →" />
        </div>
      )}

      {/* ── Step 3: Exam-style answer ── */}
      {step === 3 && (
        <div>
          <div style={{ background: "#fffbeb", border: "1px solid #d97706",
            borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "800", color: "#92400e", marginBottom: "8px" }}>
              ⭐ Exam-style answer
            </p>
            <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.7, margin: 0 }}>
              Fertiliser B has a higher median (26 cm) than Fertiliser A (19 cm), so plants grew
              taller with Fertiliser B. However, Fertiliser A has a smaller IQR (11 cm vs 13 cm),
              so its results are more consistent.
            </p>
          </div>
          <BottomNav onBack={() => go(2)} onNext={onRestart} nextLabel="Try another scenario →" />
        </div>
      )}
    </div>
  );
}