import { useState } from "react";
import { C, ANGLE_TYPES } from "../../../../data/angles_data";
import { AngleSVG, NamedAngleSVG } from "../shared/AngleSVG";

// ── Small reusable bits ───────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
      textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
      {children}
    </p>
  );
}

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

function WarnBox({ children }) {
  return (
    <div style={{ background: C.redDim, border: "1px solid #fca5a5",
      borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
      <p style={{ fontSize: "12px", color: "#991b1b", margin: 0, lineHeight: 1.6 }}>
        ⚠️ {children}
      </p>
    </div>
  );
}

function InfoBox({ colour = C.accent, colourDim = C.accentDim, children }) {
  return (
    <div style={{ background: colourDim, border: `1px solid ${colour}40`,
      borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}

// ── Part 1: Angle type cards ──────────────────────────────────────────────
// Tappable cards — tap one to see its definition
function AngleTypeExplorer() {
  const [selected, setSelected] = useState(null);
  const type = ANGLE_TYPES.find(t => t.id === selected);

  return (
    <div>
      <SectionLabel>Tap an angle type to learn about it</SectionLabel>

      {/* Card grid */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {ANGLE_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(selected === t.id ? null : t.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "6px", padding: "10px 8px", borderRadius: "12px",
              border: `2px solid ${selected === t.id ? t.colour : C.border}`,
              background: selected === t.id ? t.colourDim : C.surface,
              cursor: "pointer", transition: "all 0.15s", minWidth: "68px", flex: "1",
            }}
          >
            <AngleSVG
              degrees={t.example}
              colour={t.colour}
              colourDim={t.colourDim}
              showRight={t.id === "right"}
              width={72} height={52}
            />
            <span style={{ fontSize: "12px", fontWeight: "700",
              color: selected === t.id ? t.colour : C.muted }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Definition panel */}
      {type && (
        <div style={{ background: type.colourDim, border: `2px solid ${type.colour}`,
          borderRadius: "12px", padding: "14px 16px", marginBottom: "8px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: type.colour, margin: "0 0 6px" }}>
            {type.label} angle
          </p>
          <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
            {type.description}
          </p>
          {/* Visual */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AngleSVG
              degrees={type.example}
              colour={type.colour}
              colourDim={type.colourDim}
              label={`${type.example}°`}
              showRight={type.id === "right"}
              width={180} height={130}
            />
          </div>
          {/* Extra notes per type */}
          {type.id === "right" && (
            <p style={{ fontSize: "12px", color: C.muted, margin: "8px 0 0", textAlign: "center" }}>
              Always marked with a small square — never with an arc.
            </p>
          )}
          {type.id === "reflex" && (
            <p style={{ fontSize: "12px", color: C.muted, margin: "8px 0 0", textAlign: "center" }}>
              The large angle — it wraps more than halfway around. Easy to miss in a diagram.
            </p>
          )}
          {type.id === "straight" && (
            <p style={{ fontSize: "12px", color: C.muted, margin: "8px 0 0", textAlign: "center" }}>
              A straight line is an angle of exactly 180°. This is the basis for the straight line rule.
            </p>
          )}
        </div>
      )}

      {!selected && (
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center",
          padding: "12px 0", fontStyle: "italic" }}>
          Tap any card above to see its definition and diagram
        </p>
      )}
    </div>
  );
}

// ── Part 2: Three-letter notation ─────────────────────────────────────────
function ThreeLetterSection() {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <InfoBox>
        In GCSE exams, angles are named using <strong>three letters</strong> — the middle letter
        is always the vertex (the corner where the angle sits). For example,{" "}
        <strong style={{ color: C.accent }}>angle ABC</strong> means the angle at vertex B,
        measured from ray BA to ray BC.
      </InfoBox>

      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <NamedAngleSVG
          degrees={55}
          colour={C.accent}
          colourDim={C.accentDim}
          nameA="A" nameB="B" nameC="C"
          width={220} height={160}
        />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
          How to read it:
        </p>
        {[
          { letter: "A", role: "One end of the angle — a point on the first ray" },
          { letter: "B", role: "The VERTEX — the corner where the angle is measured" },
          { letter: "C", role: "Other end of the angle — a point on the second ray" },
        ].map(({ letter, role }) => (
          <div key={letter} style={{ display: "flex", gap: "12px",
            alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%",
              background: letter === "B" ? C.accent : C.border,
              color: letter === "B" ? "#fff" : C.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "800", flexShrink: 0 }}>
              {letter}
            </div>
            <p style={{ fontSize: "13px", color: C.text, margin: 0,
              lineHeight: 1.6, paddingTop: "2px" }}>{role}</p>
          </div>
        ))}
      </div>

      {/* Quick check */}
      <button
        onClick={() => setShown(s => !s)}
        style={{ width: "100%", padding: "12px", borderRadius: "10px",
          border: `1.5px solid ${C.accent}`, background: shown ? C.accentDim : C.surface,
          fontSize: "13px", fontWeight: "700", color: C.accent, cursor: "pointer",
          marginBottom: "8px" }}>
        {shown ? "Hide" : "Quick check — which letter is the vertex? ▾"}
      </button>

      {shown && (
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
          borderRadius: "10px", padding: "12px 14px" }}>
          <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.6 }}>
            In angle <strong>PQR</strong>, which letter is the vertex?
          </p>
          <p style={{ fontSize: "15px", fontWeight: "800", color: C.accent, margin: "0 0 6px" }}>
            Q — always the middle letter.
          </p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
            So angle PQR is the angle at Q, between rays QP and QR.
          </p>
        </div>
      )}

      <ExamTip>
        Edexcel questions often say "find angle ABC" — the answer must refer to
        the angle at B. Using just one letter or saying "the angle" without
        specifying the vertex can cost you a communication mark.
      </ExamTip>
    </div>
  );
}

// ── Part 3: Identify the type — quick drill ───────────────────────────────
// Shows a random angle, student picks the correct type
const DRILL_ANGLES = [
  { degrees: 35,  correct: "acute"    },
  { degrees: 90,  correct: "right"    },
  { degrees: 127, correct: "obtuse"   },
  { degrees: 180, correct: "straight" },
  { degrees: 220, correct: "reflex"   },
  { degrees: 72,  correct: "acute"    },
  { degrees: 155, correct: "obtuse"   },
  { degrees: 300, correct: "reflex"   },
];

function IdentifyDrill() {
  const [index,    setIndex]    = useState(0);
  const [picked,   setPicked]   = useState(null);
  const [score,    setScore]    = useState(0);
  const [total,    setTotal]    = useState(0);
  const [finished, setFinished] = useState(false);

  const question = DRILL_ANGLES[index];
  const isCorrect = picked === question.correct;

  const handlePick = (id) => {
    if (picked) return; // already answered
    setPicked(id);
    setTotal(t => t + 1);
    if (id === question.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= DRILL_ANGLES.length) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setPicked(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setTotal(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 75 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{total}
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100
            ? "Perfect — you know your angle types!"
            : pct >= 75
            ? "Good — nearly there. One more run through?"
            : "Keep practising — tap restart to go again."}
        </p>
        <button onClick={handleRestart}
          style={{ padding: "12px 28px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px",
            fontWeight: "700", cursor: "pointer" }}>
          Restart drill
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", color: C.muted }}>
          Question {index + 1} of {DRILL_ANGLES.length}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          Score: {score}/{total}
        </span>
      </div>

      {/* Angle diagram */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        <AngleSVG
          degrees={question.degrees}
          colour={picked
            ? isCorrect ? C.green : C.red
            : C.accent}
          colourDim={picked
            ? isCorrect ? C.greenDim : C.redDim
            : C.accentDim}
          showRight={question.degrees === 90}
          width={200} height={150}
        />
      </div>

      <p style={{ fontSize: "14px", fontWeight: "600", color: C.text,
        textAlign: "center", margin: "0 0 14px" }}>
        What type of angle is this?
      </p>

      {/* Answer buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
        {ANGLE_TYPES.map(t => {
          const isThis    = t.id === question.correct;
          const isPicked  = t.id === picked;
          let bg     = C.surface;
          let border = C.border;
          let colour = C.text;

          if (picked) {
            if (isThis)   { bg = C.greenDim; border = C.green;  colour = C.green; }
            if (isPicked && !isThis) { bg = C.redDim; border = C.red; colour = C.red; }
          }

          return (
            <button key={t.id} onClick={() => handlePick(t.id)}
              style={{ flex: "1 1 calc(33% - 8px)", padding: "10px 8px",
                borderRadius: "10px", border: `2px solid ${border}`,
                background: bg, fontSize: "13px", fontWeight: "700",
                color: colour, cursor: picked ? "default" : "pointer",
                transition: "all 0.15s" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {picked && (
        <div>
          <div style={{ background: isCorrect ? C.greenDim : C.redDim,
            border: `1px solid ${isCorrect ? C.green : C.red}`,
            borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isCorrect ? C.green : C.red, margin: "0 0 4px" }}>
              {isCorrect ? "✓ Correct!" : "✗ Not quite"}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.5 }}>
              {question.degrees}° is{" "}
              <strong>{ANGLE_TYPES.find(t => t.id === question.correct)?.description}</strong>
            </p>
          </div>
          <button onClick={handleNext}
            style={{ width: "100%", padding: "13px", borderRadius: "10px",
              border: "none", background: C.accent, color: "#fff",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {index + 1 >= DRILL_ANGLES.length ? "See my score →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
// Receives nav from Learn.jsx and renders it at the bottom
export default function SectionAngleTypes({ nav, openDrill }) {
  const [activeTab, setActiveTab] = useState("types");

  const tabs = [
    { id: "types",    label: "Angle types"   },
    { id: "notation", label: "Naming angles" },
    { id: "drill",    label: "🎯 Quick drill" },
  ];

  return (
    <div>
      {/* Real-world hook */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent,
          margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          Before you can solve any geometry problem, you need to speak the language.
          Every question on the Edexcel paper uses these words — acute, obtuse, reflex —
          and expects you to name angles correctly using three letters. Get this foundation
          solid and everything else becomes easier to read.
        </p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "4px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "10px",
        padding: "4px", marginBottom: "20px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: "7px",
              border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600",
              transition: "all 0.15s",
              background: activeTab === t.id ? C.accent : "transparent",
              color:      activeTab === t.id ? "#fff"   : C.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "types"    && <AngleTypeExplorer />}
      {activeTab === "notation" && <ThreeLetterSection />}
      {activeTab === "drill"    && <IdentifyDrill />}

      {/* Warn about common mistake — shown on types tab only */}
      {activeTab === "types" && (
        <WarnBox>
          <strong>Don't confuse obtuse and reflex.</strong> Obtuse is between 90° and 180°.
          Reflex is between 180° and 360°. In a diagram, if the angle looks like it goes
          "the long way round", it's reflex.
        </WarnBox>
      )}

      {nav}
    </div>
  );
}