import { useState } from "react";
import { C } from "../../../../data/angles_data";
import { TriangleSVG, IsoscelesSVG, EquilateralSVG } from "../shared/TriangleSVG";
import MiniCalc from "../../../../components/maths/shared/MiniCalc";

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

function RuleCard({ colour, colourDim, icon, title, rule, children }) {
  return (
    <div style={{ background: colourDim, border: `1.5px solid ${colour}40`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: "800", color: colour,
        margin: "0 0 4px" }}>{icon} {title}</p>
      <p style={{ fontSize: "14px", fontWeight: "700", color: C.text,
        margin: "0 0 10px", lineHeight: 1.5 }}>{rule}</p>
      {children}
    </div>
  );
}

function StepByStepWorking({ steps }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {steps.map((step, i) => (
        <div key={i}>
          {i <= revealed ? (
            <div style={{ background: i === revealed ? C.accentDim : C.surface,
              border: `1px solid ${i === revealed ? C.accent : C.border}`,
              borderRadius: "10px", padding: "10px 14px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.muted,
                textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>
                Step {i + 1}
              </p>
              <p style={{ fontSize: "13px", color: C.text, margin: "0 0 4px",
                lineHeight: 1.6 }}>{step.instruction}</p>
              <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent,
                margin: 0, fontFamily: "monospace" }}>{step.working}</p>
              {step.reason && (
                <p style={{ fontSize: "12px", color: C.muted, margin: "4px 0 0",
                  fontStyle: "italic" }}>Reason: {step.reason}</p>
              )}
            </div>
          ) : (
            <button onClick={() => setRevealed(i)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px",
                border: `1.5px dashed ${C.border}`, background: C.surface,
                fontSize: "13px", color: C.muted, cursor: "pointer",
                textAlign: "left" }}>
              👆 Tap to reveal Step {i + 1}
            </button>
          )}
        </div>
      ))}
      {revealed < steps.length - 1 && (
        <button onClick={() => setRevealed(r => r + 1)}
          style={{ padding: "10px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "13px",
            fontWeight: "700", cursor: "pointer" }}>
          Next step →
        </button>
      )}
    </div>
  );
}

function TriangleSumTab() {
  const [showWorking, setShowWorking] = useState(false);
  return (
    <div>
      <RuleCard colour={C.accent} colourDim={C.accentDim}
        icon="📐" title="The rule" rule="Angles in any triangle add up to 180°">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
          It doesn't matter what shape the triangle is — scalene, isosceles, equilateral,
          right-angled — the three interior angles always sum to exactly 180°.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TriangleSVG angles={{ a: 70, b: 55, c: 55 }}
            colour={C.accent} colourDim={C.accentDim} width={220} height={160} />
        </div>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "8px 0 0" }}>
          70° + 55° + 55° = 180° ✓
        </p>
      </RuleCard>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 12px" }}>
          Worked example — find angle x
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <TriangleSVG angles={{ a: 48, b: 75, c: null }} unknownAngle="x" unknownAt="c"
            colour={C.accent} colourDim={C.accentDim} width={220} height={160} />
        </div>
        <button onClick={() => setShowWorking(w => !w)}
          style={{ width: "100%", padding: "10px", borderRadius: "10px",
            border: `1.5px solid ${C.accent}`, background: showWorking ? C.accentDim : C.surface,
            fontSize: "13px", fontWeight: "700", color: C.accent, cursor: "pointer",
            marginBottom: showWorking ? "12px" : "0" }}>
          {showWorking ? "Hide working" : "Show working ▾"}
        </button>
        {showWorking && (
          <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
            borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 6px", lineHeight: 1.6 }}>
              Angles in a triangle add up to 180°:
            </p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: C.accent,
              margin: "0 0 4px", fontFamily: "monospace" }}>x = 180° − 48° − 75°</p>
            <p style={{ fontSize: "16px", fontWeight: "800", color: C.accent,
              margin: 0, fontFamily: "monospace" }}>x = 57°</p>
          </div>
        )}
      </div>
      <ExamTip>
        The reason to write is: <strong>"Angles in a triangle add up to 180°"</strong>.
        Always subtract the angles you know from 180 — never add them and hope they reach 180.
      </ExamTip>
    </div>
  );
}

function IsoscelesTab() {
  const [apexAngle, setApexAngle] = useState(50);
  const baseAngle = Math.round((180 - apexAngle) / 2);
  return (
    <div>
      <RuleCard colour={C.amber} colourDim={C.amberDim}
        icon="⚖️" title="Isosceles triangle" rule="Two equal sides → two equal base angles">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
          In an isosceles triangle, the two sides of equal length are shown with tick marks.
          The angles opposite those equal sides — the base angles — are always equal.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IsoscelesSVG apexAngle={apexAngle} colour={C.amber} colourDim={C.amberDim}
            unknownAngle={`${baseAngle}°`} unknownAt={null} width={220} height={160} />
        </div>
      </RuleCard>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 4px" }}>
          Try it — drag the apex angle
        </p>
        <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 12px" }}>
          Watch how the base angles change to keep the total at 180°
        </p>
        <input type="range" min={20} max={140} value={apexAngle}
          onChange={e => setApexAngle(Number(e.target.value))}
          style={{ width: "100%", marginBottom: "12px", accentColor: C.amber }} />
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "Apex angle",      value: `${apexAngle}°`,        colour: C.amber },
            { label: "Each base angle", value: `${baseAngle}°`,        colour: C.accent },
            { label: "Total",           value: `${apexAngle + baseAngle * 2}°`, colour: C.green },
          ].map(({ label, value, colour }) => (
            <div key={label} style={{ flex: 1, background: C.surface,
              border: `1.5px solid ${colour}40`, borderRadius: "10px",
              padding: "10px 8px", textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: C.muted, margin: "0 0 4px",
                textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <p style={{ fontSize: "18px", fontWeight: "800", color: colour, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 12px" }}>
          Worked example — find angle x
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <IsoscelesSVG apexAngle={40} colour={C.amber} colourDim={C.amberDim}
            unknownAngle="x" unknownAt="b" width={220} height={160} />
        </div>
        <StepByStepWorking steps={[
          { instruction: "Identify that AB = AC (tick marks), so this is isosceles.",
            working: "Triangle ABC is isosceles with AB = AC",
            reason: "Tick marks show the equal sides" },
          { instruction: "Base angles are equal — both are x.",
            working: "Angle ABC = Angle ACB = x",
            reason: "Base angles of an isosceles triangle are equal" },
          { instruction: "All three angles sum to 180°.",
            working: "40° + x + x = 180°",
            reason: "Angles in a triangle add up to 180°" },
          { instruction: "Solve for x.",
            working: "2x = 140°  →  x = 70°",
            reason: null },
        ]} />
      </div>
      <ExamTip>
        The reasons to write are: <strong>"Base angles of an isosceles triangle are equal"</strong>{" "}
        AND <strong>"Angles in a triangle add up to 180°"</strong>. You'll almost always need both
        in the same question. The tick marks in the diagram are your signal that a triangle is isosceles.
      </ExamTip>
    </div>
  );
}

function EquilateralTab() {
  return (
    <div>
      <RuleCard colour={C.green} colourDim={C.greenDim}
        icon="🔺" title="Equilateral triangle" rule="Three equal sides → all angles are 60°">
        <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
          An equilateral triangle has all three sides equal (shown by single tick marks on all
          three sides) and all three angles equal to exactly 60°. No calculation needed — if
          you see three tick marks, write 60°.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EquilateralSVG width={200} height={160} />
        </div>
        <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "8px 0 0" }}>
          60° + 60° + 60° = 180° ✓
        </p>
      </RuleCard>
      <ExamTip>
        The reason to write is: <strong>"All angles in an equilateral triangle are 60°"</strong>.
        This is a one-line answer — no algebra needed.
      </ExamTip>
    </div>
  );
}

function CirclePreviewTab() {
  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🔮 Coming up — circle theorems
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          This is a preview of why isosceles triangles matter so much for circle theorems.
          Understanding this now will make circle theorems feel obvious rather than confusing.
        </p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
          The key insight: two radii always make an isosceles triangle
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <svg viewBox="0 0 200 180" style={{ width: "100%", maxWidth: 200 }}>
            <circle cx={100} cy={90} r={70} fill={C.accentDim} stroke={C.accent} strokeWidth={2} />
            <circle cx={100} cy={90} r={4} fill={C.accent} />
            <text x={108} y={95} fontSize={12} fontWeight="700" fill={C.accent}>O</text>
            <line x1={100} y1={90} x2={44} y2={42} stroke={C.accent} strokeWidth={2.5} />
            <line x1={100} y1={90} x2={156} y2={42} stroke={C.accent} strokeWidth={2.5} />
            <line x1={44} y1={42} x2={156} y2={42} stroke={C.text} strokeWidth={2} strokeDasharray="5,3" />
            <line x1={67} y1={61} x2={73} y2={67} stroke={C.amber} strokeWidth={2} />
            <line x1={127} y1={67} x2={133} y2={61} stroke={C.amber} strokeWidth={2} />
            <text x={32} y={38} fontSize={12} fontWeight="700" fill={C.text}>A</text>
            <text x={158} y={38} fontSize={12} fontWeight="700" fill={C.text}>B</text>
            <path d="M 84 78 A 18 18 0 0 1 116 78" fill="none" stroke={C.accent} strokeWidth={1.5} />
          </svg>
        </div>
        {[
          { icon: "📏", text: "OA is a radius — from the centre O to point A on the circumference." },
          { icon: "📏", text: "OB is a radius — from the centre O to point B on the circumference." },
          { icon: "⚖️", text: "All radii of a circle are equal — so OA = OB always." },
          { icon: "🔺", text: "Triangle OAB has two equal sides — so it must be isosceles." },
          { icon: "✨", text: "That means angle OAB = angle OBA — the base angles are equal!" },
        ].map(({ icon, text }, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#fef3c7", border: "1px solid #fcd34d",
        borderRadius: "10px", padding: "12px 14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", margin: "0 0 6px" }}>
          🔑 Why this matters
        </p>
        <p style={{ fontSize: "13px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>
          Nearly every circle theorem proof uses this fact. When you see two radii drawn
          inside a circle, your first thought should always be:{" "}
          <strong>"isosceles triangle — base angles equal"</strong>.
          That one instinct will unlock most circle theorem questions.
        </p>
      </div>
    </div>
  );
}

const DRILL_QS = [
  { type: "sum",       known: { a: 60, b: 70 }, unknownAt: "c", answer: 50,
    reason: "Angles in a triangle add up to 180°", working: "180° − 60° − 70° = 50°" },
  { type: "isosceles", apexAngle: 80,  unknownAt: "b", answer: 50,
    reason: "Base angles of an isosceles triangle are equal, and angles in a triangle add up to 180°",
    working: "(180° − 80°) ÷ 2 = 50°" },
  { type: "sum",       known: { a: 35, b: 90 }, unknownAt: "c", answer: 55,
    reason: "Angles in a triangle add up to 180°", working: "180° − 35° − 90° = 55°" },
  { type: "isosceles", apexAngle: 110, unknownAt: "b", answer: 35,
    reason: "Base angles of an isosceles triangle are equal, and angles in a triangle add up to 180°",
    working: "(180° − 110°) ÷ 2 = 35°" },
  { type: "sum",       known: { a: 47, b: 68 }, unknownAt: "c", answer: 65,
    reason: "Angles in a triangle add up to 180°", working: "180° − 47° − 68° = 65°" },
  { type: "isosceles", apexAngle: 36,  unknownAt: "b", answer: 72,
    reason: "Base angles of an isosceles triangle are equal, and angles in a triangle add up to 180°",
    working: "(180° − 36°) ÷ 2 = 72°" },
];

function TriangleDrill() {
  const [index,   setIndex]   = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q       = DRILL_QS[index];
  const isRight = parseInt(input, 10) === q.answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => { if (index + 1 >= DRILL_QS.length) { setDone(true); } else { setIndex(i => i + 1); setInput(""); setChecked(false); } };
  const handleRestart = () => { setIndex(0); setInput(""); setChecked(false); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / DRILL_QS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 67 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{DRILL_QS.length}
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100 ? "Perfect — triangle rules are solid!" : "Keep going — these become automatic with practice."}
        </p>
        <button onClick={handleRestart}
          style={{ padding: "12px 28px", borderRadius: "10px", border: "none",
            background: C.accent, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.muted,
          background: C.accentDim, padding: "3px 10px", borderRadius: "99px" }}>
          {q.type === "isosceles" ? "Isosceles" : "Triangle sum"}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {index + 1}/{DRILL_QS.length}
        </span>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        {q.type === "isosceles" ? (
          <IsoscelesSVG
            apexAngle={q.apexAngle}
            colour={checked ? (isRight ? C.green : C.red) : C.amber}
            colourDim={checked ? (isRight ? C.greenDim : C.redDim) : C.amberDim}
            unknownAngle={checked ? `${q.answer}°` : "x"}
            unknownAt={checked ? null : "b"}
            width={220} height={160}
          />
        ) : (
          <TriangleSVG
            angles={{ a: q.known?.a ?? null, b: q.known?.b ?? null, c: q.known?.c ?? null }}
            unknownAngle={checked ? `${q.answer}°` : "x"}
            unknownAt={q.unknownAt}
            colour={checked ? (isRight ? C.green : C.red) : C.accent}
            colourDim={checked ? (isRight ? C.greenDim : C.redDim) : C.accentDim}
            width={220} height={160}
          />
        )}
      </div>

      <p style={{ fontSize: "14px", fontWeight: "600", color: C.text, margin: "0 0 12px" }}>
        Find the angle marked x.
      </p>

      {!checked && (
        <div>
          <MiniCalc label="Calculator" />
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", marginTop: "8px" }}>
            <input type="number" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Your answer in degrees"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px",
                border: `1.5px solid ${C.border}`, fontSize: "16px",
                color: C.text, outline: "none", boxSizing: "border-box" }} />
            <button onClick={handleCheck}
              style={{ padding: "12px 20px", borderRadius: "10px", border: "none",
                background: C.accent, color: "#fff", fontSize: "14px",
                fontWeight: "700", cursor: "pointer" }}>
              Check
            </button>
          </div>
        </div>
      )}

      {checked && (
        <div>
          <div style={{ background: isRight ? C.greenDim : C.redDim,
            border: `1px solid ${isRight ? C.green : C.red}`,
            borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : `✗ The answer is ${q.answer}°`}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 4px",
              fontFamily: "monospace", fontWeight: "600" }}>{q.working}</p>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0,
              fontStyle: "italic" }}>Reason: {q.reason}</p>
          </div>
          <button onClick={handleNext}
            style={{ width: "100%", padding: "13px", borderRadius: "10px",
              border: "none", background: C.accent, color: "#fff",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {index + 1 >= DRILL_QS.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SectionTriangles({ nav }) {
  const [activeTab, setActiveTab] = useState("sum");

  const tabs = [
    { id: "sum",         label: "Angle sum"   },
    { id: "isosceles",   label: "Isosceles"   },
    { id: "equilateral", label: "Equilateral" },
    { id: "circle",      label: "🔮 Preview"  },
    { id: "drill",       label: "🎯 Drill"    },
  ];

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🌍 Why does this matter?
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          Triangle rules appear in almost every multi-step angle question on the Edexcel paper.
          Isosceles triangles are especially important — they are the hidden engine inside most
          circle theorem proofs. Master this section and circle theorems will make sense immediately.
        </p>
      </div>

      <div style={{ display: "flex", gap: "4px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "10px",
        padding: "4px", marginBottom: "20px", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: "1 1 auto", padding: "8px 6px", borderRadius: "7px",
              border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600",
              transition: "all 0.15s", minWidth: "60px",
              background: activeTab === t.id ? C.accent : "transparent",
              color:      activeTab === t.id ? "#fff"   : C.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "sum"         && <TriangleSumTab />}
      {activeTab === "isosceles"   && <IsoscelesTab />}
      {activeTab === "equilateral" && <EquilateralTab />}
      {activeTab === "circle"      && <CirclePreviewTab />}
      {activeTab === "drill"       && <TriangleDrill />}

      {nav}
    </div>
  );
}