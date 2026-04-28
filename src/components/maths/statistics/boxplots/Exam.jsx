import { useState } from "react";
import { C, EXAM_QUESTIONS, COMPARE_QUESTIONS, READ_GRAPH_QUESTIONS } from "./data";
import BoxPlotSVG from "./shared/BoxPlotSVG";
import CumFreqGraph from "./shared/CumFreqGraph";

// ── Draw a box plot ───────────────────────────────────────────────────────
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
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#15803d", textTransform: "uppercase", marginBottom: "6px" }}>IQR</p>
            <p style={{ fontSize: "14px", color: C.text, margin: 0 }}>
              IQR = Q3 − Q1 = {question.data.q3} − {question.data.q1} = <strong style={{ color: "#15803d" }}>{question.data.q3 - question.data.q1}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Compare two box plots ─────────────────────────────────────────────────
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
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "12px" }}>Both on the same scale</p>
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
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "4px" }}>
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

// ── Read the graph ────────────────────────────────────────────────────────
function ReadTheGraph({ question, onBack }) {
  const [showBoxPlot, setShowBoxPlot] = useState(false);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "13px", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>← Back</button>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.purple, textTransform: "uppercase", margin: 0 }}>Exam Question — Read the Graph</p>
          <span style={{ fontSize: "11px", background: "#a78bfa30", color: C.purple, padding: "2px 8px", borderRadius: "99px", fontWeight: "700" }}>3 marks</span>
        </div>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.6, margin: "0 0 10px" }}>{question.question}</p>
        <div style={{ background: "#a78bfa20", borderRadius: "8px", padding: "10px 12px" }}>
          <p style={{ fontSize: "12px", color: C.purple, margin: 0, lineHeight: 1.6 }}>
            <strong>How to read it:</strong> Find the frequency on the y-axis → draw a line across to the curve → drop straight down to the x-axis to read the value.
          </p>
        </div>
      </div>

      {/* The graph */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "4px" }}>Cumulative Frequency Graph</p>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>The dashed lines show where to read Q1, Median and Q3. Try reading the values yourself first.</p>
        <CumFreqGraph
          sets={[{ label: question.unit, color: C.accent, points: question.curvePoints }]}
          totalFreq={question.totalFreq}
          scaleMin={question.scaleMin}
          scaleMax={question.scaleMax}
          unit={question.unit}
          readPoints={question.readPoints}
        />
      </div>

      {/* Read-off values */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "12px" }}>Reading the values off the graph</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {question.readPoints.map((rp) => (
            <div key={rp.freq} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${rp.color}` }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: rp.color, margin: "0 0 2px" }}>{rp.label}</p>
                <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>Read across from {rp.freq} on y-axis → drop to x-axis</p>
              </div>
              <p style={{ fontSize: "18px", fontWeight: "800", color: rp.color, margin: 0 }}>{rp.value}g</p>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", background: C.card, borderRadius: "8px", borderLeft: `3px solid ${C.muted}` }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: C.muted, margin: "0 0 2px" }}>Min and Max — given in the question</p>
              <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>Not read from the graph</p>
            </div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.muted, margin: 0 }}>{question.answer.min}g – {question.answer.max}g</p>
          </div>
        </div>
      </div>

      {/* 5 values */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
        {[
          { label: "Min",    val: question.answer.min,    color: C.muted },
          { label: "Q1",     val: question.answer.q1,     color: C.accent },
          { label: "Median", val: question.answer.median, color: C.text },
          { label: "Q3",     val: question.answer.q3,     color: C.accent },
          { label: "Max",    val: question.answer.max,    color: C.muted },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 4px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color, margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          ✏️ <strong>Sketch the box plot on paper</strong> using those 5 values on a number line from {question.scaleMin} to {question.scaleMax}. Then reveal the answer below.
        </p>
      </div>

      <button onClick={() => setShowBoxPlot(!showBoxPlot)} style={{ width: "100%", padding: "12px", background: showBoxPlot ? "#a78bfa30" : C.purple, color: showBoxPlot ? C.purple : C.bg, border: `1px solid ${C.purple}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: showBoxPlot ? "16px" : "0" }}>
        {showBoxPlot ? "Hide box plot" : "Reveal box plot answer"}
      </button>

      {showBoxPlot && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.text, marginBottom: "12px" }}>Box plot — drawn from the graph values</p>
            <BoxPlotSVG sets={[{ ...question.answer, label: "Answer", color: C.accent }]} scaleMin={question.scaleMin} scaleMax={question.scaleMax} unit={question.unit} showLabels={false} />
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#15803d", textTransform: "uppercase", marginBottom: "6px" }}>IQR</p>
            <p style={{ fontSize: "14px", color: C.text, margin: 0 }}>
              IQR = Q3 − Q1 = {question.answer.q3} − {question.answer.q1} = <strong style={{ color: "#15803d" }}>{question.answer.q3 - question.answer.q1}</strong>
            </p>
          </div>
          <div style={{ background: "#fffbeb20", border: "1px solid #f59e0b40", borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "12px", color: C.amber, margin: 0, lineHeight: 1.6 }}>⭐ <strong>Exam tip:</strong> {question.examTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Exam tab ──────────────────────────────────────────────────────────────
export default function Exam() {
  const [examIdx,    setExamIdx]    = useState(null);
  const [compareIdx, setCompareIdx] = useState(null);
  const [graphIdx,   setGraphIdx]   = useState(null);

  if (examIdx !== null)
    return <ExamPractice  question={EXAM_QUESTIONS[examIdx]}         onBack={() => setExamIdx(null)} />;
  if (compareIdx !== null)
    return <CompareQuestion question={COMPARE_QUESTIONS[compareIdx]} onBack={() => setCompareIdx(null)} />;
  if (graphIdx !== null)
    return <ReadTheGraph   question={READ_GRAPH_QUESTIONS[graphIdx]} onBack={() => setGraphIdx(null)} />;

  return (
    <div>
      <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
        Edexcel-style questions. Sketch on paper first, then reveal the answer.
      </p>

      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Draw a box plot</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {EXAM_QUESTIONS.map((q, i) => (
          <button key={q.id} onClick={() => setExamIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ flex: 1 }}><span style={{ fontWeight: "700", color: C.accent }}>Q{i + 1} — </span>{q.question}</span>
            <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Compare two box plots</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {COMPARE_QUESTIONS.map((q, i) => (
          <button key={q.id} onClick={() => setCompareIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ flex: 1 }}><span style={{ fontWeight: "700", color: C.amber }}>{q.label} — </span>{q.question}</span>
            <span style={{ color: C.muted, fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Read the graph</p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "10px" }}>
        <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>
          These questions give you a <strong style={{ color: C.text }}>cumulative frequency graph</strong> instead of numbers. Read Q1, median and Q3 off the curve, then draw the box plot — exactly like Q8 and Q9 in the Edexcel paper.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {READ_GRAPH_QUESTIONS.map((q, i) => (
          <button key={q.id} onClick={() => setGraphIdx(i)} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px", lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ flex: 1 }}><span style={{ fontWeight: "700", color: C.purple }}>{q.label} — </span>{q.question}</span>
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
  );
}