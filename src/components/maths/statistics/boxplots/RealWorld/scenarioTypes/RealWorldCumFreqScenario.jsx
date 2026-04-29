import { useState } from "react";
import { C } from "../../data";
import BoxPlotSVG from "../../shared/BoxPlotSVG";
import BottomNav from "../BottomNav";
import QuickSummary from "../QuickSummary";
import GlossaryTerm from "../../GlossaryTerm";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

function CumFreqSVG({ points, totalFreq, readPoints, scaleMax, unit }) {
  const W = 520;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 48;
  const plotW = W - padL - padR;
  const plotH = 220;

  const toX = (v) => padL + (v / scaleMax) * plotW;
  const toY = (f) => padT + plotH - (f / totalFreq) * plotH;

  const pathD = points
    .map(([v, f], i) => `${i === 0 ? "M" : "L"} ${toX(v)} ${toY(f)}`)
    .join(" ");

  const yTicks = [0, 10, 20, 30, 40, 50, 60];
  const xTicks = [0, 2, 4, 6, 8, 10, 12, 14];
  const readScores = readPoints.map((r) => r.value);

  return (
    <svg viewBox={`0 0 ${W} ${padT + plotH + padB}`} style={{ width: "100%", overflow: "visible" }}>
      {yTicks.map((f) => (
        <line
          key={f}
          x1={padL}
          y1={toY(f)}
          x2={W - padR}
          y2={toY(f)}
          stroke={C.border}
          strokeWidth="1"
          strokeDasharray="3,4"
        />
      ))}

      {readPoints.map(({ freq, value, color }) => (
        <g key={freq}>
          <line x1={padL} y1={toY(freq)} x2={toX(value)} y2={toY(freq)} stroke={color} strokeWidth="1.5" strokeDasharray="5,3" />
          <line x1={toX(value)} y1={toY(freq)} x2={toX(value)} y2={toY(0)} stroke={color} strokeWidth="1.5" strokeDasharray="5,3" />
          <circle cx={toX(value)} cy={toY(freq)} r="4" fill={color} />

          <text x={padL - 5} y={toY(freq) + 4} textAnchor="end" fill={color} fontSize="10" fontWeight="800">
            {freq}
          </text>

          <text x={toX(value)} y={toY(0) + 31} textAnchor="middle" fill={color} fontSize="10" fontWeight="800">
            {value}
          </text>
        </g>
      ))}

      <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      <line x1={padL} y1={padT} x2={padL} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />
      <line x1={padL} y1={toY(0)} x2={W - padR} y2={toY(0)} stroke={C.text} strokeWidth="1.5" />

      {yTicks.map((f) => (
        <g key={f}>
          <line x1={padL - 4} y1={toY(f)} x2={padL} y2={toY(f)} stroke={C.muted} strokeWidth="1.5" />
          <text x={padL - 6} y={toY(f) + 4} textAnchor="end" fill={C.muted} fontSize="9">
            {f}
          </text>
        </g>
      ))}

      {xTicks.filter((t) => !readScores.includes(t)).map((t) => (
        <g key={t}>
          <line x1={toX(t)} y1={toY(0)} x2={toX(t)} y2={toY(0) + 4} stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={toY(0) + 14} textAnchor="middle" fill={C.muted} fontSize="9">
            {t}
          </text>
        </g>
      ))}

      <text
        x={padL - 32}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
        transform={`rotate(-90, ${padL - 32}, ${padT + plotH / 2})`}
      >
        Cumulative frequency
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + padB - 4} textAnchor="middle" fill={C.muted} fontSize="10">
        {unit}
      </text>
    </svg>
  );
}

export default function RealWorldCumFreqScenario({ scenario: s, onRestart }) {
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

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
            <p style={{ fontSize: "12px", fontWeight: "800", color: C.text, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <GlossaryTerm term="Cumulative frequency">Cumulative frequency</GlossaryTerm> graph — 60 parcels
            </p>

            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 12px" }}>
              Dashed lines show how to read off <GlossaryTerm term="Q1">Q1</GlossaryTerm>,{" "}
              <GlossaryTerm term="Median">Median</GlossaryTerm> and{" "}
              <GlossaryTerm term="Q3">Q3</GlossaryTerm>.
            </p>

            <CumFreqSVG
              points={s.cumFreqPoints}
              totalFreq={s.totalFreq}
              readPoints={s.readPoints}
              scaleMax={s.scaleMax}
              unit={`Delivery time (${s.unit})`}
            />
          </div>

          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 8px" }}>
              How to read this graph
            </p>

            {[
              "Find the frequency on the y-axis: Q1 = 15, Median = 30, Q3 = 45",
              "Draw a horizontal line across to the curve",
              "Drop straight down to the x-axis — that is your value",
            ].map((text, i) => (
              <div key={text} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: C.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>

          <BottomNav showBack={false} onNext={() => go(1)} nextLabel="Next: Read the values →" />
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, marginBottom: "12px" }}>
              Values read from the graph
            </p>

            {[
              ["Minimum", "Min", "Given in question — fastest delivery", s.answer.min],
              ["Q1", "Q1", "Read from graph at frequency 15", s.answer.q1],
              ["Median", "Median", "Read from graph at frequency 30", s.answer.median],
              ["Q3", "Q3", "Read from graph at frequency 45", s.answer.q3],
              ["Maximum", "Max", "Given in question — slowest delivery", s.answer.max],
            ].map(([term, label, note, val]) => (
              <div
                key={term}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "9px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: C.accent }}>
                    <GlossaryTerm term={term}>{label}</GlossaryTerm>
                  </span>
                  <span style={{ fontSize: "11px", color: C.muted, marginLeft: "8px" }}>
                    {note}
                  </span>
                </div>

                <strong style={{ fontSize: "14px", color: C.text, whiteSpace: "nowrap" }}>
                  {val} days
                </strong>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.7, margin: 0 }}>
              Tap <GlossaryTerm term="Minimum">Min</GlossaryTerm>,{" "}
              <GlossaryTerm term="Q1">Q1</GlossaryTerm>,{" "}
              <GlossaryTerm term="Median">Median</GlossaryTerm>,{" "}
              <GlossaryTerm term="Q3">Q3</GlossaryTerm>, or{" "}
              <GlossaryTerm term="Maximum">Max</GlossaryTerm> to remind yourself what each part means.
            </p>
          </div>

          <BottomNav onBack={() => go(0)} onNext={() => go(2)} nextLabel="Next: Draw box plot →" />
        </div>
      )}

      {step === 2 && (
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

          <BottomNav onBack={() => go(1)} onNext={onRestart} nextLabel="Try another scenario →" />
        </div>
      )}
    </div>
  );
}