import { useState } from "react";
import { C } from "../../data";
import BoxPlotSVG from "../../shared/BoxPlotSVG";
import BottomNav from "../BottomNav";
import QuickSummary from "../QuickSummary";
import GlossaryTerm from "../../GlossaryTerm";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function RealWorldRawScenario({ scenario: s, onRestart }) {
  const [step, setStep] = useState(0);

  const go = (n) => {
    setStep(n);
    scrollToTop();
  };

  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: "800", color: C.accent, marginBottom: "6px" }}>
        {s.icon} {s.title}
      </p>

      {step === 0 && (
        <div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7 }}>{s.setup}</p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
            {s.rawData.map((v, i) => (
              <div
                key={i}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                }}
              >
                {v}
              </div>
            ))}
          </div>

          <BottomNav showBack={false} onNext={() => go(1)} nextLabel="Next: Sort the data →" />
        </div>
      )}

      {step === 1 && (
        <div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7 }}>
            First, put the data in order from smallest to largest.
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
            {s.sorted.map((v, i) => (
              <div
                key={i}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  border: `1px solid ${C.accent}`,
                  background: C.accentDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  color: C.accent,
                }}
              >
                {v}
              </div>
            ))}
          </div>

          <BottomNav onBack={() => go(0)} onNext={() => go(2)} nextLabel="Next: Find values →" />
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
            {[
              ["Minimum", "Min", s.answer.min],
              ["Q1", "Q1", s.answer.q1],
              ["Median", "Median", s.answer.median],
              ["Q3", "Q3", s.answer.q3],
              ["Maximum", "Max", s.answer.max],
            ].map(([term, label, val]) => (
              <div
                key={term}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: "8px",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "10px", color: C.muted, margin: 0 }}>
                  <GlossaryTerm term={term}>{label}</GlossaryTerm>
                </p>
                <p style={{ fontSize: "15px", fontWeight: "800", color: C.accent, margin: 0 }}>
                  {val} {s.unitShort}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "16px",
            }}
          >
            <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.7, margin: 0 }}>
              Tap <GlossaryTerm term="Minimum">Min</GlossaryTerm>,{" "}
              <GlossaryTerm term="Q1">Q1</GlossaryTerm>,{" "}
              <GlossaryTerm term="Median">Median</GlossaryTerm>,{" "}
              <GlossaryTerm term="Q3">Q3</GlossaryTerm>, or{" "}
              <GlossaryTerm term="Maximum">Max</GlossaryTerm> to remind yourself what each part means.
            </p>
          </div>

          <BottomNav onBack={() => go(1)} onNext={() => go(3)} nextLabel="Next: Draw box plot →" />
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <BoxPlotSVG
              sets={[{ ...s.answer, label: s.title, color: C.accent }]}
              scaleMin={s.scaleMin}
              scaleMax={s.scaleMax}
              unit={s.unit}
            />
          </div>

          <QuickSummary s={s} />

          <BottomNav onBack={() => go(2)} onNext={onRestart} nextLabel="Try another scenario →" />
        </div>
      )}
    </div>
  );
}