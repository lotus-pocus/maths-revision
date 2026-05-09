import { useState } from "react";
import { C, PARALLEL_RULES } from "../../../../../data/angles_data";
import { AlternateSVG, CoInteriorSVG, CorrespondingSVG } from "../shared/ParallelSVG";
import MiniCalc from "../../../shared/MiniCalc";

function ExamTip({ children }) {
  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fcd34d",
      borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
      <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
        ⭐ <strong>Exam tip:</strong> {children}
      </p>
    </div>
  );
}

function ZAnglesWarning() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: "#fef2f2", border: "2px solid #fca5a5",
      borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span style={{ fontSize: "22px", flexShrink: 0 }}>🚫</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#991b1b", margin: "0 0 6px" }}>
            "Z angles" is no longer accepted by Edexcel
          </p>
          <p style={{ fontSize: "13px", color: "#7f1d1d", margin: "0 0 10px", lineHeight: 1.6 }}>
            You may have learned alternate angles as "Z angles" because the shape
            looks like a Z. <strong>Do not write this in your exam.</strong> Edexcel
            specifically states that informal names like Z angles, C angles and F angles
            will not receive marks for the reason. You must write the full mathematical name.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { wrong: '"Z angles"', right: "Alternate angles are equal (parallel lines)" },
              { wrong: '"C angles"', right: "Co-interior angles add up to 180° (parallel lines)" },
              { wrong: '"F angles"', right: "Corresponding angles are equal (parallel lines)" },
            ].map(({ wrong, right }) => (
              <div key={wrong} style={{ flex: "1 1 100%", background: "#fff",
                border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px" }}>
                <p style={{ fontSize: "12px", margin: 0 }}>
                  <span style={{ color: "#dc2626", fontWeight: "700",
                    textDecoration: "line-through" }}>{wrong}</span>
                  {" "}→{" "}
                  <span style={{ color: "#059669", fontWeight: "700" }}>{right}</span>
                </p>
              </div>
            ))}
          </div>
          <button onClick={() => setExpanded(e => !e)}
            style={{ background: "none", border: "none", color: "#991b1b",
              fontSize: "12px", fontWeight: "700", cursor: "pointer",
              padding: "8px 0 0", textDecoration: "underline" }}>
            {expanded ? "Hide examiner's note ▲" : "What does the examiner's report say? ▼"}
          </button>
          {expanded && (
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 12px", marginTop: "8px" }}>
              <p style={{ fontSize: "12px", color: "#7f1d1d", margin: 0, lineHeight: 1.7 }}>
                The Edexcel examiner's report on past papers states: many students
                were still incorrectly referring to alternate angles as "Z angles" —
                this is no longer acceptable. Students must use the correct mathematical
                terminology to receive the mark for the reason. Writing "Z angles" or
                describing the shape rather than naming the rule will score zero for
                that reason mark.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RuleTab({ rule, topValue = 65 }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const isCoInt = rule.id === "cointerior";
  const answer  = isCoInt ? 180 - topValue : topValue;
  const DiagramComponent =
    rule.id === "alternate"  ? AlternateSVG  :
    rule.id === "cointerior" ? CoInteriorSVG :
                               CorrespondingSVG;
  return (
    <div>
      <div style={{ background: rule.colourDim, border: `1.5px solid ${rule.colour}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px",
            background: rule.colour, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff",
              fontFamily: "monospace" }}>{rule.shape}</span>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "800", color: rule.colour, margin: 0 }}>
              {rule.label}
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
              {rule.id === "cointerior" ? "adds up to 180°" : "are equal"}
            </p>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px",
          lineHeight: 1.6 }}>{rule.description}</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <DiagramComponent topValue={topValue} showAnswer={true} width={260} height={180} />
        </div>
        <div style={{ background: "#fff", border: `1px solid ${rule.colour}40`,
          borderRadius: "8px", padding: "10px 12px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>
            Write this exact reason in your exam:
          </p>
          <p style={{ fontSize: "13px", fontWeight: "700", color: rule.colour,
            margin: 0, lineHeight: 1.5 }}>
            "{rule.examPhrase}"
          </p>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>
          Quick check
        </p>
        <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 12px" }}>
          The top angle is {topValue}°. What is x?
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <DiagramComponent topValue={topValue} showAnswer={showAnswer} width={260} height={180} />
        </div>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)}
            style={{ width: "100%", padding: "12px", borderRadius: "10px",
              border: `1.5px solid ${rule.colour}`, background: rule.colourDim,
              fontSize: "13px", fontWeight: "700", color: rule.colour, cursor: "pointer" }}>
            Reveal answer
          </button>
        ) : (
          <div style={{ background: rule.colourDim, border: `1px solid ${rule.colour}40`,
            borderRadius: "10px", padding: "10px 14px" }}>
            <p style={{ fontSize: "14px", fontWeight: "800", color: rule.colour,
              margin: "0 0 4px" }}>x = {answer}°</p>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0,
              fontStyle: "italic" }}>Reason: {rule.examPhrase}</p>
          </div>
        )}
      </div>
      <ExamTip>
        Remember: the parallel lines must be marked with arrows (→→) in the diagram
        before you can use any of these rules. If the lines are not marked as parallel,
        you cannot assume they are.
      </ExamTip>
    </div>
  );
}

// ── Drill ─────────────────────────────────────────────────────────────────
const DRILL_QS = [
  { rule: "alternate",     topValue: 72,  answer: 72,  type: "equal" },
  { rule: "cointerior",    topValue: 62,  answer: 118, type: "sum"   },
  { rule: "corresponding", topValue: 53,  answer: 53,  type: "equal" },
  { rule: "alternate",     topValue: 41,  answer: 41,  type: "equal" },
  { rule: "cointerior",    topValue: 67,  answer: 113, type: "sum"   },
  { rule: "corresponding", topValue: 84,  answer: 84,  type: "equal" },
  { rule: "alternate",     topValue: 55,  answer: 55,  type: "equal" },
  { rule: "cointerior",    topValue: 55,  answer: 125, type: "sum"   },
];

const RULE_LABELS = {
  alternate:     "Alternate angles",
  cointerior:    "Co-interior angles",
  corresponding: "Corresponding angles",
};

const RULE_PHRASES = {
  alternate:     "Alternate angles are equal (parallel lines)",
  cointerior:    "Co-interior angles add up to 180° (parallel lines)",
  corresponding: "Corresponding angles are equal (parallel lines)",
};

function ParallelDrill() {
  const [index,     setIndex]     = useState(0);
  const [picked,    setPicked]    = useState(null);
  const [input,     setInput]     = useState("");
  const [stage,     setStage]     = useState("rule");
  const [score,     setScore]     = useState(0);
  const [done,      setDone]      = useState(false);
  const [bothRight, setBothRight] = useState(false);
  const [calcRight, setCalcRight] = useState(false);

  const q         = DRILL_QS[index];
  const ruleRight = picked === q.rule;

  const handlePickRule = (id) => {
    if (stage !== "rule") return;
    setPicked(id);
    setStage("angle");
  };

  const handleCheckAngle = () => {
    if (!input) return;
    const cr      = Number(input.trim()) === q.answer;
    const correct = (picked === q.rule) && cr;
    setCalcRight(cr);
    setBothRight(correct);
    if (correct) setScore(s => s + 1);
    setStage("feedback");
  };

  const handleBack = () => {
    // Go back one stage
    if (stage === "angle")    { setStage("rule");  setPicked(null); }
    if (stage === "feedback") { setStage("angle");  setInput("");    }
  };

  const handleNext = () => {
    if (index + 1 >= DRILL_QS.length) { setDone(true); }
    else {
      setIndex(i => i + 1);
      setPicked(null);
      setInput("");
      setStage("rule");
      setBothRight(false);
      setCalcRight(false);
    }
  };

  const handleRestart = () => {
    setIndex(0); setPicked(null); setInput(""); setStage("rule");
    setScore(0); setDone(false); setBothRight(false); setCalcRight(false);
  };

  if (done) {
    const pct = Math.round((score / DRILL_QS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 75 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{DRILL_QS.length}
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100
            ? "Perfect — parallel line rules are solid!"
            : "Keep practising — identifying the rule quickly is the key skill."}
        </p>
        <button onClick={handleRestart}
          style={{ padding: "12px 28px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px",
            fontWeight: "700", cursor: "pointer" }}>
          Try again
        </button>
      </div>
    );
  }

  const DiagramComponent =
    q.rule === "alternate"  ? AlternateSVG  :
    q.rule === "cointerior" ? CoInteriorSVG :
                              CorrespondingSVG;

  return (
    <div>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["rule", "angle", "feedback"].map((s, i) => (
            <div key={s} style={{ width: "24px", height: "6px", borderRadius: "99px",
              background: stage === s ? C.accent
                : (["rule","angle","feedback"].indexOf(stage) > i) ? C.accent + "60"
                : C.border }} />
          ))}
        </div>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {index + 1}/{DRILL_QS.length}
        </span>
      </div>

      {/* Diagram */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        <DiagramComponent topValue={q.topValue} showAnswer={stage === "feedback"}
          width={260} height={180} />
      </div>

      {/* Stage 1: Pick the rule */}
      {stage === "rule" && (
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: C.text, margin: "0 0 12px" }}>
            Which rule connects the two highlighted angles?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PARALLEL_RULES.map(rule => (
              <button key={rule.id} onClick={() => handlePickRule(rule.id)}
                style={{ padding: "12px 16px", borderRadius: "10px",
                  border: `2px solid ${C.border}`, background: C.surface,
                  fontSize: "13px", fontWeight: "600", color: C.text,
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <span style={{ fontWeight: "700", color: rule.colour, marginRight: "8px" }}>
                  {rule.shape}
                </span>
                {rule.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stage 2: Enter the angle */}
      {stage === "angle" && (
        <div>
          <div style={{ background: ruleRight ? C.greenDim : C.redDim,
            border: `1px solid ${ruleRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "10px 14px", marginBottom: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: ruleRight ? C.green : C.red, margin: "0 0 2px" }}>
              {ruleRight ? "✓ Correct rule!" : `✗ That's ${RULE_LABELS[q.rule]}`}
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
              Rule: {RULE_PHRASES[q.rule]}
            </p>
          </div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: C.text, margin: "0 0 12px" }}>
            Now find the angle x.
            {q.type === "sum"
              ? " Remember: these angles add to 180°."
              : " Remember: these angles are equal."}
          </p>
          <MiniCalc label="Calculator" />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input type="number" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheckAngle()}
              placeholder="x = ?"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
                border: `1.5px solid ${C.border}`, fontSize: "16px",
                color: C.text, outline: "none", boxSizing: "border-box" }} />
            <button onClick={handleCheckAngle}
              style={{ padding: "12px 20px", borderRadius: "10px", border: "none",
                background: C.accent, color: "#fff", fontSize: "14px",
                fontWeight: "700", cursor: "pointer" }}>
              Check
            </button>
          </div>
          {/* Back button */}
          <button onClick={handleBack}
            style={{ width: "100%", marginTop: "8px", padding: "10px",
              borderRadius: "10px", border: `1.5px solid ${C.border}`,
              background: C.surface, fontSize: "13px", fontWeight: "600",
              color: C.muted, cursor: "pointer" }}>
            ← Change my rule answer
          </button>
        </div>
      )}

      {/* Stage 3: Feedback — two separate boxes */}
      {stage === "feedback" && (
        <div>
          {/* Rule feedback */}
          <div style={{ background: ruleRight ? C.greenDim : C.redDim,
            border: `1px solid ${ruleRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: ruleRight ? C.green : C.red, margin: "0 0 4px" }}>
              {ruleRight ? "✓ Correct rule" : "✗ Wrong rule"}
            </p>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0, fontStyle: "italic" }}>
              {ruleRight
                ? `"${RULE_PHRASES[q.rule]}"`
                : `It's ${RULE_LABELS[q.rule]} — write: "${RULE_PHRASES[q.rule]}"`}
            </p>
          </div>

          {/* Calculation feedback */}
          <div style={{ background: calcRight ? C.greenDim : C.redDim,
            border: `1px solid ${calcRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: calcRight ? C.green : C.red, margin: "0 0 4px" }}>
              {calcRight ? "✓ Correct calculation" : "✗ Wrong angle"}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0,
              fontFamily: "monospace", fontWeight: "600" }}>
              {q.type === "sum"
                ? `x = 180° − ${q.topValue}° = ${q.answer}°`
                : `x = ${q.answer}° (equal angles)`}
            </p>
          </div>

          {/* No mark warning — calc right but rule wrong */}
          {calcRight && !ruleRight && (
            <div style={{ background: "#fef3c7", border: "1px solid #fcd34d",
              borderRadius: "10px", padding: "10px 14px", marginBottom: "8px" }}>
              <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
                ⚠️ In the exam you would lose the reason mark even though your
                calculation was correct. Both the angle AND the rule name must be right.
              </p>
            </div>
          )}

          {/* Next / Back buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button onClick={handleBack}
              style={{ flex: 1, padding: "13px", borderRadius: "10px",
                border: `1.5px solid ${C.border}`, background: C.surface,
                fontSize: "13px", fontWeight: "600", color: C.muted, cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={handleNext}
              style={{ flex: 2, padding: "13px", borderRadius: "10px",
                border: "none", background: C.accent, color: "#fff",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {index + 1 >= DRILL_QS.length ? "See my score →" : "Next →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function SectionParallel({ nav }) {
  const [activeTab, setActiveTab] = useState("warning");
  const [drillKey,  setDrillKey]  = useState(0);

  const tabs = [
    { id: "warning",       label: "⚠️ Read first" },
    { id: "alternate",     label: "Alternate"     },
    { id: "cointerior",    label: "Co-interior"   },
    { id: "corresponding", label: "Corresponding" },
    { id: "drill",         label: "🎯 Drill"      },
  ];

  const altRule   = PARALLEL_RULES.find(r => r.id === "alternate");
  const coIntRule = PARALLEL_RULES.find(r => r.id === "cointerior");
  const corrRule  = PARALLEL_RULES.find(r => r.id === "corresponding");

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          Parallel line rules appear in Q9 and Q10 on the Edexcel paper — the
          highest-mark questions in this topic. The examiner's report shows that
          students consistently lose marks not because they get the angle wrong,
          but because they write the wrong name for the rule. Start with the
          warning tab — it's the most important thing on this page.
        </p>
      </div>

      <div style={{ display: "flex", gap: "4px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "10px",
        padding: "4px", marginBottom: "20px", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              if (t.id === "drill") setDrillKey(k => k + 1);
            }}
            style={{ flex: "1 1 auto", padding: "8px 6px", borderRadius: "7px",
              border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600",
              transition: "all 0.15s", minWidth: "60px",
              background: activeTab === t.id
                ? (t.id === "warning" ? "#dc2626" : C.accent)
                : "transparent",
              color: activeTab === t.id ? "#fff" : C.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "warning" && (
        <div>
          <ZAnglesWarning />
          <div style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 12px" }}>
              The three rules — at a glance
            </p>
            {PARALLEL_RULES.map(rule => (
              <div key={rule.id} style={{ display: "flex", gap: "12px",
                alignItems: "center", padding: "10px 0",
                borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px",
                  background: rule.colour, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "18px", fontWeight: "900", color: "#fff",
                    fontFamily: "monospace" }}>{rule.shape}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: rule.colour,
                    margin: "0 0 2px" }}>{rule.label}</p>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
                    {rule.id === "cointerior" ? "Add to 180°" : "Are equal"}
                  </p>
                </div>
                <div style={{ background: rule.colourDim, borderRadius: "6px",
                  padding: "4px 8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", fontWeight: "700",
                    color: rule.colour, fontFamily: "monospace" }}>
                    {rule.id === "cointerior" ? "a + b = 180°" : "a = b"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: C.muted, textAlign: "center", margin: "0 0 4px" }}>
            Tap the tabs above to learn each rule in detail
          </p>
        </div>
      )}

      {activeTab === "alternate"     && altRule   && <RuleTab rule={altRule}   topValue={65} />}
      {activeTab === "cointerior"    && coIntRule  && <RuleTab rule={coIntRule} topValue={65} />}
      {activeTab === "corresponding" && corrRule   && <RuleTab rule={corrRule}  topValue={65} />}
      {activeTab === "drill"         && <ParallelDrill key={drillKey} />}

      {activeTab !== "drill" && nav}
    </div>
  );
}