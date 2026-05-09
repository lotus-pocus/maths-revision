import { useState } from "react";
import { C } from "../../../../../data/angles_data";
import MiniCalc from "../../../shared/MiniCalc";
import { StraightLineSVG } from "../shared/StraightLineSVG";

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

// ── SVG: full turn around a point ─────────────────────────────────────────
function FullTurnSVG() {
  const W = 220; const H = 160; const cx = W / 2; const cy = H / 2;
  const len = 60;
  const toRad = d => (d * Math.PI) / 180;
  const angles = [0, 90, 210, 290];
  const colors = [C.accent, C.amber, C.green, C.purple];
  const arcAngles = [
    { from: 0,   to: 90,  label: "90°",  color: C.accent },
    { from: 90,  to: 210, label: "120°", color: C.amber  },
    { from: 210, to: 290, label: "80°",  color: C.green  },
    { from: 290, to: 360, label: "70°",  color: C.purple },
  ];
  const r = 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {arcAngles.map(({ from, to, color }) => {
        const sx = cx + r * Math.cos(toRad(from));
        const sy = cy - r * Math.sin(toRad(from));
        const ex = cx + r * Math.cos(toRad(to));
        const ey = cy - r * Math.sin(toRad(to));
        const large = (to - from) > 180 ? 1 : 0;
        return (
          <path key={from}
            d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`}
            fill={color + "25"} stroke="none" />
        );
      })}
      {arcAngles.map(({ from, to, label, color }) => {
        const mid = (from + to) / 2;
        const sx = cx + r * Math.cos(toRad(from));
        const sy = cy - r * Math.sin(toRad(from));
        const ex = cx + r * Math.cos(toRad(to));
        const ey = cy - r * Math.sin(toRad(to));
        const large = (to - from) > 180 ? 1 : 0;
        const lx = cx + (r + 18) * Math.cos(toRad(mid));
        const ly = cy - (r + 18) * Math.sin(toRad(mid));
        return (
          <g key={from}>
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
              fill="none" stroke={color} strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight="700" fill={color}>{label}</text>
          </g>
        );
      })}
      {angles.map((a, i) => (
        <line key={a}
          x1={cx} y1={cy}
          x2={cx + len * Math.cos(toRad(a))}
          y2={cy - len * Math.sin(toRad(a))}
          stroke={colors[i]} strokeWidth={2} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={3} fill={C.text} />
      <text x={cx} y={cy - r - 42} textAnchor="middle"
        fontSize={11} fontWeight="700" fill={C.muted}>
        90 + 120 + 80 + 70 = 360°
      </text>
    </svg>
  );
}

// ── SVG: vertically opposite angles ──────────────────────────────────────
function VertOppSVG({ showAnswer = false }) {
  const W = 240; const H = 160; const cx = W / 2; const cy = H / 2;
  const len = 90;
  const toRad = d => (d * Math.PI) / 180;
  const angle = 55;
  const rays = [0, angle, 180, 180 + angle];
  const r = 26;
  const regions = [
    { from: 0,           to: angle,       label: `${angle}°`,       color: C.accent, dim: C.accentDim  },
    { from: angle,       to: 180,         label: `${180-angle}°`,   color: C.amber,  dim: C.amberDim   },
    { from: 180,         to: 180 + angle, label: showAnswer ? `${angle}°`     : "x°", color: C.accent, dim: showAnswer ? C.accentDim : "#f3f4f6" },
    { from: 180 + angle, to: 360,         label: showAnswer ? `${180-angle}°` : "y°", color: C.amber,  dim: showAnswer ? C.amberDim  : "#f3f4f6" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {regions.map(({ from, to, label, color, dim }) => {
        const sx = cx + r * Math.cos(toRad(from));
        const sy = cy - r * Math.sin(toRad(from));
        const ex = cx + r * Math.cos(toRad(to));
        const ey = cy - r * Math.sin(toRad(to));
        const large = (to - from) > 180 ? 1 : 0;
        const mid = (from + to) / 2;
        const lx = cx + (r + 16) * Math.cos(toRad(mid));
        const ly = cy - (r + 16) * Math.sin(toRad(mid));
        return (
          <g key={from}>
            <path d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`}
              fill={dim} stroke="none" />
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
              fill="none" stroke={color} strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight="700" fill={color}>{label}</text>
          </g>
        );
      })}
      {rays.map(a => (
        <line key={a}
          x1={cx - len * Math.cos(toRad(a))} y1={cy + len * Math.sin(toRad(a))}
          x2={cx + len * Math.cos(toRad(a))} y2={cy - len * Math.sin(toRad(a))}
          stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={3} fill={C.text} />
    </svg>
  );
}

// ── SVG: vertically opposite drill diagram ────────────────────────────────
function VertOppDrillSVG({ knownAngle = 124, showAnswer = false }) {
  const W = 260; const H = 160; const cx = W / 2; const cy = H / 2;
  const len = 90;
  const toRad = d => (d * Math.PI) / 180;
  const a = knownAngle;
  const r = 26;
  const regions = [
    { from: 0,     to: a,       label: `${a}°`,                              color: C.accent, dim: C.accentDim  },
    { from: a,     to: 180,     label: `${180-a}°`,                          color: C.amber,  dim: C.amberDim   },
    { from: 180,   to: 180+a,   label: showAnswer ? `${a}°`     : "x°",     color: C.accent, dim: showAnswer ? C.accentDim : "#f3f4f6" },
    { from: 180+a, to: 360,     label: showAnswer ? `${180-a}°` : "y°",     color: C.amber,  dim: showAnswer ? C.amberDim  : "#f3f4f6" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {regions.map(({ from, to, label, color, dim }) => {
        const sx = cx + r * Math.cos(toRad(from));
        const sy = cy - r * Math.sin(toRad(from));
        const ex = cx + r * Math.cos(toRad(to));
        const ey = cy - r * Math.sin(toRad(to));
        const large = (to - from) > 180 ? 1 : 0;
        const mid = (from + to) / 2;
        const lx = cx + (r + 18) * Math.cos(toRad(mid));
        const ly = cy - (r + 18) * Math.sin(toRad(mid));
        return (
          <g key={from}>
            <path d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`}
              fill={dim} stroke="none" />
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
              fill="none" stroke={color} strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight="700" fill={color}>{label}</text>
          </g>
        );
      })}
      {[a, 0].map(ang => (
        <line key={ang}
          x1={cx - len * Math.cos(toRad(ang))} y1={cy + len * Math.sin(toRad(ang))}
          x2={cx + len * Math.cos(toRad(ang))} y2={cy - len * Math.sin(toRad(ang))}
          stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={3} fill={C.text} />
      <text x={cx + len - 6}  y={cy - 8} fontSize={11} fill={C.muted}>B</text>
      <text x={cx - len + 2}  y={cy - 8} fontSize={11} fill={C.muted}>A</text>
      <text x={cx + len * Math.cos(toRad(a)) - 4} y={cy - len * Math.sin(toRad(a)) - 6} fontSize={11} fill={C.muted}>C</text>
      <text x={cx + 6} y={cy + 14} fontSize={11} fill={C.accent}>O</text>
    </svg>
  );
}

// ── SVG: around a point drill diagram ─────────────────────────────────────
function PointDrillSVG({ knownAngle = 265, showAnswer = false }) {
  const W = 260; const H = 180; const cx = W / 2; const cy = H / 2;
  const len = 70; const r = 30;
  const toRad = d => (d * Math.PI) / 180;
  const unknown = 360 - knownAngle;
  const regions = [
    { from: 0,          to: knownAngle, label: `${knownAngle}°`,                  color: C.amber,  dim: C.amberDim,                    large: knownAngle > 180 ? 1 : 0 },
    { from: knownAngle, to: 360,        label: showAnswer ? `${unknown}°` : "x°", color: C.accent, dim: showAnswer ? C.accentDim : "#f3f4f6", large: unknown > 180 ? 1 : 0 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {regions.map(({ from, to, label, color, dim, large }) => {
        const sx = cx + r * Math.cos(toRad(from));
        const sy = cy - r * Math.sin(toRad(from));
        const ex = cx + r * Math.cos(toRad(to));
        const ey = cy - r * Math.sin(toRad(to));
        const mid = from + (to - from) / 2;
        const labelR = r + (large ? 28 : 20);
        const lx = cx + labelR * Math.cos(toRad(mid));
        const ly = cy - labelR * Math.sin(toRad(mid));
        return (
          <g key={from}>
            <path d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`}
              fill={dim} stroke="none" />
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
              fill="none" stroke={color} strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={12} fontWeight="700" fill={color}>{label}</text>
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={cx + len} y2={cy} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      <line x1={cx} y1={cy}
        x2={cx + len * Math.cos(toRad(knownAngle))}
        y2={cy - len * Math.sin(toRad(knownAngle))}
        stroke={C.text} strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill={C.text} />
    </svg>
  );
}

// ── Drill questions ───────────────────────────────────────────────────────
const MISSING_ANGLE_Qs = [
  { rule: "straight", known: 130, unknown: 50,  label: "Angles on a straight line" },
  { rule: "straight", known: 112, unknown: 68,  label: "Angles on a straight line" },
  { rule: "point",    known: 265, unknown: 95,  label: "Angles around a point"     },
  { rule: "vertOpp",  known: 38,  unknown: 38,  label: "Vertically opposite"       },
  { rule: "straight", known: 154, unknown: 26,  label: "Angles on a straight line" },
  { rule: "vertOpp",  known: 124, unknown: 124, label: "Vertically opposite"       },
];

function MissingAngleDrill() {
  const [index,   setIndex]   = useState(0);
  const [input,   setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [score,   setScore]   = useState(0);
  const [done,    setDone]    = useState(false);

  const q       = MISSING_ANGLE_Qs[index];
  const answer  = q.unknown;
  const isRight = parseInt(input, 10) === answer;

  const handleCheck   = () => { if (!input) return; setChecked(true); if (isRight) setScore(s => s + 1); };
  const handleNext    = () => {
    if (index + 1 >= MISSING_ANGLE_Qs.length) setDone(true);
    else { setIndex(i => i + 1); setInput(""); setChecked(false); }
  };
  const handleRestart = () => { setIndex(0); setInput(""); setChecked(false); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / MISSING_ANGLE_Qs.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>
          {pct === 100 ? "🎉" : pct >= 67 ? "👍" : "💪"}
        </div>
        <p style={{ fontSize: "20px", fontWeight: "800", color: C.text, margin: "0 0 6px" }}>
          {score}/{MISSING_ANGLE_Qs.length}
        </p>
        <p style={{ fontSize: "14px", color: C.muted, margin: "0 0 20px" }}>
          {pct === 100 ? "Perfect score!" : "Keep practising — the rules will become automatic."}
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.muted,
          background: C.accentDim, padding: "3px 10px", borderRadius: "99px" }}>
          {q.label}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>
          {index + 1}/{MISSING_ANGLE_Qs.length}
        </span>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px", marginBottom: "16px",
        display: "flex", justifyContent: "center" }}>
        {q.rule === "vertOpp"
          ? <VertOppDrillSVG knownAngle={q.known} showAnswer={checked} />
          : q.rule === "point"
          ? <PointDrillSVG   knownAngle={q.known} showAnswer={checked} />
          : <StraightLineSVG knownAngle={q.known} showAnswer={checked} />}
      </div>

      <p style={{ fontSize: "14px", fontWeight: "600", color: C.text, margin: "0 0 6px" }}>
        {q.rule === "vertOpp"
          ? `The angle opposite ${q.known}° is x°. Find x.`
          : q.rule === "point"
          ? `Angles around a point sum to 360°. One angle is ${q.known}°. Find x.`
          : `Angles on a straight line sum to 180°. One angle is ${q.known}°. Find x.`}
      </p>

      {!checked && (
        <div>
          <MiniCalc label="Calculator" />
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", marginTop: "8px" }}>
            <input type="number" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="Your answer"
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
            borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700",
              color: isRight ? C.green : C.red, margin: "0 0 4px" }}>
              {isRight ? "✓ Correct!" : `✗ Not quite — the answer is ${answer}°`}
            </p>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.5 }}>
              {q.rule === "straight" && `${q.known}° + x° = 180°  →  x = 180 − ${q.known} = ${answer}°`}
              {q.rule === "point"    && `${q.known}° + x° = 360°  →  x = 360 − ${q.known} = ${answer}°`}
              {q.rule === "vertOpp"  && `Vertically opposite angles are equal, so x = ${answer}°`}
            </p>
          </div>
          <button onClick={handleNext}
            style={{ width: "100%", padding: "13px", borderRadius: "10px",
              border: "none", background: C.accent, color: "#fff",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {index + 1 >= MISSING_ANGLE_Qs.length ? "See my score →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function SectionLines({ nav }) {
  const [activeTab, setActiveTab] = useState("straight");

  const tabs = [
    { id: "straight", label: "Straight lines" },
    { id: "point",    label: "Around a point"  },
    { id: "vertopp",  label: "Vert. opposite"  },
    { id: "drill",    label: "🎯 Drill"         },
  ];

  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent,
          margin: "0 0 6px" }}>🌍 Why does this matter?</p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          These three rules appear in almost every multi-step geometry question on the
          Edexcel paper. They are the most commonly used reasons in worked answers —
          and the most commonly forgotten when writing working out.
        </p>
      </div>

      <div style={{ display: "flex", gap: "4px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "10px",
        padding: "4px", marginBottom: "20px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: "7px",
              border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600",
              transition: "all 0.15s",
              background: activeTab === t.id ? C.accent : "transparent",
              color:      activeTab === t.id ? "#fff"   : C.muted }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "straight" && (
        <div>
          <RuleCard colour={C.accent} colourDim={C.accentDim}
            icon="📏" title="Rule 1" rule="Angles on a straight line add up to 180°">
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
              A straight line is an angle of 180°. Any rays coming off it divide that
              180° into smaller angles — but they must always total 180°.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <StraightLineSVG knownAngle={130} showAnswer={true} />
            </div>
            <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: "0 0 4px" }}>
              130° + 50° = 180° ✓
            </p>
          </RuleCard>
          <ExamTip>
            The reason to write is: <strong>"Angles on a straight line add up to 180°"</strong>.
            Write the full sentence — not "straight line = 180" or "angles add to 180".
            The examiner awards marks for the correct wording.
          </ExamTip>
        </div>
      )}

      {activeTab === "point" && (
        <div>
          <RuleCard colour={C.amber} colourDim={C.amberDim}
            icon="🔄" title="Rule 2" rule="Angles around a point add up to 360°">
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
              A full turn is 360°. No matter how many rays come from a single point,
              all the angles between them must total exactly 360°.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
              <FullTurnSVG />
            </div>
          </RuleCard>
          <ExamTip>
            The reason to write is: <strong>"Angles around a point add up to 360°"</strong>.
            This rule is also useful as a check — if your angles don't sum to 360°,
            something has gone wrong.
          </ExamTip>
        </div>
      )}

      {activeTab === "vertopp" && (
        <div>
          <RuleCard colour={C.green} colourDim={C.greenDim}
            icon="✖️" title="Rule 3" rule="Vertically opposite angles are equal">
            <p style={{ fontSize: "13px", color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>
              When two straight lines cross, they form two pairs of equal angles directly
              opposite each other. These are called <strong>vertically opposite angles</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
              <VertOppSVG showAnswer={true} />
            </div>
            <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", margin: 0 }}>
              The blue pair are equal. The amber pair are equal.
              Each pair adds to 180° with its neighbour.
            </p>
          </RuleCard>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "12px", padding: "14px 16px", marginTop: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
              💡 Why are they equal?
            </p>
            {[
              "Call the top angle x°.",
              "x° + y° = 180° (angles on a straight line)",
              "y° + x° = 180° (angles on a straight line, other side)",
              "So both opposite angles equal 180° − y° — they must be equal.",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px",
                marginBottom: "6px", alignItems: "flex-start" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%",
                  background: C.accent, color: "#fff", fontSize: "11px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: "13px", color: C.text, margin: 0,
                  lineHeight: 1.6, paddingTop: "1px" }}>{step}</p>
              </div>
            ))}
          </div>
          <ExamTip>
            The reason to write is: <strong>"Vertically opposite angles are equal"</strong>.
            Spot the X shape, use this rule, then continue with the angles you've found.
          </ExamTip>
        </div>
      )}

      {activeTab === "drill" && <MissingAngleDrill />}

      {nav}
    </div>
  );
}