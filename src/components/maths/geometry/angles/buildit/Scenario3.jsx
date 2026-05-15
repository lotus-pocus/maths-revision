import { useState, useRef } from "react";
import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";
import { ReasonPicker } from "./ScenarioShell";
import MiniCalc from "../../../shared/MiniCalc";

const { stroke } = SVG_DEFAULTS;

// ── Diagram constants ──────────────────────────────────────────────────────
// Q leftmost apex, P upper-right, R lower-right
// QP at -58° (up-right), QR at +72° (down-right)
// PQR = 58 + 72 = 130° sweeping CW from QP through RIGHT to QR ✓
// Given: APQ = 58° (at P: between PA leftward and PQ going down-left)
//        QRC = 72° (at R: between RQ going up-left and RC leftward)
// Alt at Q: both use RIGHT side of aux line
//   left of QP: between aux-right and QP = 58° (above aux)
//   right of QR: between aux-right and QR = 72° (below aux)
const W = 300, H = 250;
const yTop = 55, yBot = 195;
const xL = 10, xR = 290;
const P = [117, yTop];
const Q = [80,  110];
const R = [104, yBot];
const auxXL = 30, auxXR = 230;

// ── Arc helper ─────────────────────────────────────────────────────────────
function Arc({ cx, cy, toP1, toP2, r = 24, colour, label }) {
  const a1 = Math.atan2(toP1[1] - cy, toP1[0] - cx);
  const a2 = Math.atan2(toP2[1] - cy, toP2[0] - cx);
  let sweep = a2 - a1;
  while (sweep < -Math.PI) sweep += 2 * Math.PI;
  while (sweep >  Math.PI) sweep -= 2 * Math.PI;
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a1 + sweep), y2 = cy + r * Math.sin(a1 + sweep);
  const midA = a1 + sweep / 2;
  const lx = cx + (r + 16) * Math.cos(midA);
  const ly = cy + (r + 16) * Math.sin(midA);
  return (
    <g>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep > 0 ? 1 : 0} ${x2} ${y2}`}
        fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" />
      {label && <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fontWeight="700" fill={colour}>{label}</text>}
    </g>
  );
}

// ── Diagram ────────────────────────────────────────────────────────────────
function Diagram({ auxY, onDrag, snapped, activeStep }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const SNAP_ZONE = 14;
  const atQ = Math.abs(auxY - Q[1]) < SNAP_ZONE;
  const displayY = snapped ? Q[1] : auxY;

  const toSVGY = (clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return (clientY - rect.top) * (H / rect.height);
  };
  const clamp = (y) => Math.max(yTop + 10, Math.min(yBot - 10, y));

  const onMouseDown  = (e) => { e.preventDefault(); dragging.current = true; };
  const onMouseMove  = (e) => { if (!dragging.current || snapped) return; onDrag(clamp(toSVGY(e.clientY))); };
  const onMouseUp    = ()  => { dragging.current = false; };
  const onTouchStart = (e) => { e.preventDefault(); dragging.current = true; };
  const onTouchMove  = (e) => { if (!dragging.current || snapped) return; onDrag(clamp(toSVGY(e.touches[0].clientY))); };
  const onTouchEnd   = ()  => { dragging.current = false; };

  const lineColour = snapped ? C.purple : atQ ? "#a855f7" : "#94a3b8";

  return (
    <svg ref={svgRef}
      viewBox={`0 0 ${W} ${H}`} width="100%"
      style={{ maxWidth: W, fontFamily: "inherit", overflow: "visible", touchAction: "none" }}
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
    >
      {/* Line AB (top) */}
      <line x1={xL} y1={yTop} x2={xR} y2={yTop} stroke={C.accent} strokeWidth={stroke + 0.5} />
      <polygon points={`${xR-2},${yTop} ${xR-10},${yTop-4} ${xR-10},${yTop+4}`} fill={C.accent} />
      <polygon points={`${xL+50},${yTop} ${xL+42},${yTop-4} ${xL+42},${yTop+4}`} fill={C.accent} />

      {/* Line CD (bottom) */}
      <line x1={xL} y1={yBot} x2={xR} y2={yBot} stroke={C.accent} strokeWidth={stroke + 0.5} />
      <polygon points={`${xR-2},${yBot} ${xR-10},${yBot-4} ${xR-10},${yBot+4}`} fill={C.accent} />
      <polygon points={`${xL+50},${yBot} ${xL+42},${yBot-4} ${xL+42},${yBot+4}`} fill={C.accent} />

      {/* Triangle sides PQ and QR */}
      <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke={C.text} strokeWidth={stroke + 0.5} />
      <line x1={Q[0]} y1={Q[1]} x2={R[0]} y2={R[1]} stroke={C.text} strokeWidth={stroke + 0.5} />

      {/* Auxiliary line — draggable */}
      <line x1={auxXL} y1={displayY} x2={auxXR} y2={displayY}
        stroke={lineColour} strokeWidth={snapped ? 2 : 1.5}
        strokeDasharray={snapped ? "none" : "5 3"} />

      {/* Drag handle */}
      {!snapped && (
        <g onMouseDown={onMouseDown} onTouchStart={onTouchStart} style={{ cursor: "ns-resize" }}>
          <rect x={auxXL} y={displayY - 14} width={auxXR - auxXL} height={28} fill="transparent" />
          <circle cx={(auxXL + auxXR) / 2} cy={displayY} r={9}
            fill={atQ ? "#a855f7" : "#94a3b8"} opacity={0.9} />
          <text x={(auxXL + auxXR) / 2} y={displayY} textAnchor="middle"
            dominantBaseline="middle" fontSize={11} fill="#fff" fontWeight="800">↕</text>
        </g>
      )}
      {atQ && !snapped && (
        <text x={auxXR + 6} y={displayY + 4} fontSize={10} fill="#a855f7" fontWeight="700">← snap!</text>
      )}

      {/* Given angle at P: APQ = 58°
          At P: between PQ (going down-left) and PA (leftward)
          toP1=Q, toP2=leftward → sweep +58° CW ✓ */}
      <Arc cx={P[0]} cy={P[1]}
        toP1={Q} toP2={[P[0] - 60, P[1]]}
        r={24} colour={C.amber} label="58°" />

      {/* Given angle at R: QRC = 72° — between RC(leftward) and RQ(up-left)
          toP1=leftward, toP2=Q → sweep +72° CW ✓ */}
      <Arc cx={R[0]} cy={R[1]}
        toP1={[R[0] - 60, R[1]]} toP2={Q}
        r={24} colour={C.amber} label="72°" />

      {/* Alternate angle at Q (= 58°):
          Between aux-RIGHT and QP — above the aux line, right side of aux / left of QP
          toP1=rightward, toP2=P → sweep -58° CCW (above aux) ✓ */}
      {snapped && (
        <Arc cx={Q[0]} cy={Q[1]}
          toP1={[Q[0] + 50, Q[1]]} toP2={P}
          r={22}
          colour={activeStep >= 2 ? C.green : "#d1d5db"}
          label={activeStep >= 2 ? "58°" : "find→"} />
      )}

      {/* Alternate angle at Q (right side, = 72°):
          Between aux-RIGHT and QR — below the aux line on the right of QR */}
      {snapped && activeStep >= 2 && (
        <Arc cx={Q[0]} cy={Q[1]}
          toP1={[Q[0] + 50, Q[1]]} toP2={R}
          r={22}
          colour={activeStep >= 3 ? C.green : "#d1d5db"}
          label={activeStep >= 3 ? "72°" : "find→"} />
      )}


      {/* x label marking the unknown angle PQR — visible from the start */}
      {snapped && (
        <text x={Q[0] + 42} y={Q[1] + 8}
          fontSize={13} fontWeight="800" fill={C.accent}
          textAnchor="middle">x</text>
      )}
      {/* Once all steps done, show the answer */}
      {snapped && activeStep >= 4 && (
        <text x={Q[0] + 42} y={Q[1] + 24}
          fontSize={11} fontWeight="700" fill={C.green}
          textAnchor="middle">= 130°</text>
      )}

      {/* Labels */}
      <text x={xL + 2}    y={yTop - 8} fontSize={12} fontWeight="700" fill={C.accent}>A</text>
      <text x={xR - 14}   y={yTop - 8} fontSize={12} fontWeight="700" fill={C.accent}>B</text>
      <text x={xL + 2}    y={yBot + 14} fontSize={12} fontWeight="700" fill={C.accent}>C</text>
      <text x={xR - 14}   y={yBot + 14} fontSize={12} fontWeight="700" fill={C.accent}>D</text>
      <text x={P[0] + 5}  y={P[1] - 4} fontSize={13} fontWeight="700" fill={C.text}>P</text>
      <text x={Q[0] - 16} y={Q[1] - 8} fontSize={13} fontWeight="700" fill={C.text}>Q</text>
      <text x={R[0] - 16} y={R[1] + 14} fontSize={13} fontWeight="700" fill={C.text}>R</text>
    </svg>
  );
}

// ── Reason options ─────────────────────────────────────────────────────────
const REASONS = [
  { id: "alt",   label: "Alternate angles are equal (parallel lines)" },
  { id: "corr",  label: "Corresponding angles are equal (parallel lines)" },
  { id: "coint", label: "Co-interior angles sum to 180° (parallel lines)" },
  { id: "str",   label: "Angles on a straight line sum to 180°" },
  { id: "tri",   label: "Angles in a triangle sum to 180°" },
  { id: "add",   label: "Angle PQR = 58° + 72° (angles on a straight line at Q)" },
];
function pick(...ids) { return ids.map(id => REASONS.find(r => r.id === id)); }

// ── Step card ──────────────────────────────────────────────────────────────
function StepCard({ number, instruction, answerLabel, answerValue, hint, working,
  showCalc, reasonOptions, reasonCorrect, isActive, isDone, onDone }) {

  const [inputVal,   setInputVal]   = useState("");
  const [attempts,   setAttempts]   = useState(0);
  const [showHint,   setShowHint]   = useState(false);
  const [revealed,   setRevealed]   = useState(false);
  const [gotCorrect, setGotCorrect] = useState(false);
  const [reasonDone, setReasonDone] = useState(false);
  const [calcOpen,   setCalcOpen]   = useState(false);

  const needsReason = !!reasonOptions;

  const completeAnswer = (wasCorrect) => {
    setRevealed(true); setGotCorrect(wasCorrect);
    if (!needsReason) setTimeout(() => onDone && onDone(), 500);
  };
  const completeReason = () => {
    setReasonDone(true);
    setTimeout(() => onDone && onDone(), 500);
  };
  const handleCheck = () => {
    const v = parseFloat(inputVal); if (isNaN(v)) return;
    const n = attempts + 1; setAttempts(n);
    if (v === answerValue) completeAnswer(true);
    else if (n >= 2 && hint) setShowHint(true);
  };

  const wrongAnswer = attempts > 0 && !revealed;

  return (
    <div style={{
      border: `1.5px solid ${isDone ? C.green : isActive ? C.accent : C.border}`,
      borderRadius: 12, overflow: "hidden", marginBottom: 12,
      background: isDone ? C.greenDim : "#fff",
      opacity: !isActive && !isDone ? 0.45 : 1, transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
        borderBottom: `1px solid ${isDone ? "#86efac" : isActive ? C.accent+"30" : C.border}` }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          background: isDone ? C.green : isActive ? C.accent : C.border,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800 }}>{isDone ? "✓" : number}</div>
        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, flex: 1,
          color: isDone ? C.green : isActive ? C.accent : C.muted }}>{instruction}</p>
        {isDone && <span style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{answerValue}°</span>}
      </div>

      {isActive && (
        <div style={{ padding: 14 }}>
          {showCalc && (
            <div style={{ marginBottom: 12 }}>
              <button onClick={() => setCalcOpen(v => !v)} style={{
                padding: "7px 13px", borderRadius: 8, border: "1.5px solid #7c3aed",
                background: calcOpen ? "#f5f3ff" : "#fff", color: "#7c3aed",
                fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                🧮 {calcOpen ? "Hide calculator" : "Use calculator"}
              </button>
              {calcOpen && <div style={{ marginTop: 10 }}><MiniCalc defaultOpen={true} /></div>}
            </div>
          )}

          {!revealed && (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.text,
                  whiteSpace: "nowrap", flexShrink: 0 }}>{answerLabel}</label>
                <input type="number" value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCheck()}
                  placeholder="°"
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 9,
                    border: `1.5px solid ${wrongAnswer ? C.red : C.border}`,
                    fontSize: 16, fontWeight: 700, outline: "none",
                    background: wrongAnswer ? "#fef2f2" : "#fff", appearance: "textfield" }} />
                <button onClick={handleCheck} style={{ padding: "10px 16px", borderRadius: 9,
                  background: C.accent, color: "#fff", border: "none",
                  fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Check</button>
              </div>
              {wrongAnswer && (
                <p style={{ fontSize: 12, color: C.red, margin: "8px 0 0", fontWeight: 600 }}>
                  {attempts === 1 ? "Not quite — try again." : "Still not right — here's a hint."}
                </p>
              )}
              {showHint && hint && (
                <div style={{ background: "#fffbeb", border: `1.5px solid ${C.amber}`,
                  borderRadius: 10, padding: "10px 13px", marginTop: 10, display: "flex", gap: 8 }}>
                  <span>💡</span>
                  <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.6 }}>{hint}</p>
                </div>
              )}
              {attempts >= 2 && (
                <button onClick={() => completeAnswer(false)} style={{
                  marginTop: 12, width: "100%", padding: 10, borderRadius: 9,
                  border: `1.5px solid ${C.border}`, background: "#f9fafb",
                  color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Show me the answer →
                </button>
              )}
            </>
          )}

          {revealed && (
            <>
              {gotCorrect ? (
                <div style={{ background: C.greenDim, border: `1.5px solid ${C.green}`,
                  borderRadius: 10, padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.green, margin: 0 }}>✓ {answerLabel}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: C.green, margin: 0 }}>{answerValue}°</p>
                </div>
              ) : (
                <div style={{ background: C.accentDim, border: `1.5px solid ${C.accent}`,
                  borderRadius: 10, padding: "12px 14px" }}>
                  {working && <p style={{ fontSize: 12, color: C.accent, margin: "0 0 8px", lineHeight: 1.6 }}>{working}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, margin: 0 }}>{answerLabel}</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: C.accent, margin: 0 }}>{answerValue}°</p>
                  </div>
                </div>
              )}
              {needsReason && !reasonDone && (
                <ReasonPicker options={reasonOptions} correct={reasonCorrect}
                  onCorrect={completeReason} locked={false} />
              )}
              {needsReason && reasonDone && (
                <div style={{ marginTop: 14, padding: "10px 13px", borderRadius: 9,
                  background: C.greenDim, border: `1.5px solid ${C.green}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.green, margin: 0 }}>
                    ✓ Correct reason — moving on…
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Scenario3({ onComplete, onBack }) {
  const [auxY,       setAuxY]       = useState(yBot - 25);
  const [snapped,    setSnapped]    = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps,  setDoneSteps]  = useState(new Set());

  const handleDrag = (y) => {
    setAuxY(y);
    if (Math.abs(y - Q[1]) < 14 && !snapped) {
      setSnapped(true);
      setTimeout(() => setActiveStep(1), 400);
    }
  };

  const handleStepDone = (idx) => {
    setDoneSteps(prev => new Set([...prev, idx]));
    if (idx < 3) setActiveStep(idx + 1);
    else setTimeout(() => onComplete && onComplete(), 700);
  };

  const allDone = doneSteps.size === 3;

  const steps = [
    {
      idx: 1, number: 2,
      instruction: "Find the alternate angle to APQ at Q — between the auxiliary line (going right) and PQ.",
      answerLabel: "Alternate angle =", answerValue: 58,
      hint: "The auxiliary line through Q is parallel to AB. Look at the angle between the auxiliary line going RIGHT and PQ going up-right to P. Both sit on the same side — this is the alternate angle to APQ = 58°.",
      working: "Alternate angles are equal (auxiliary line ∥ AB): angle = 58°",
      showCalc: false,
      reasonOptions: pick("alt", "corr", "coint", "str"), reasonCorrect: "alt",
    },
    {
      idx: 2, number: 3,
      instruction: "Find the alternate angle to QRC at Q — between the auxiliary line (going right) and QR going down.",
      answerLabel: "Alternate angle =", answerValue: 72,
      hint: "The auxiliary line through Q is also parallel to CD. Look at the angle between the auxiliary line going RIGHT and QR going down-right to R. This is the alternate angle to QRC = 72°. Both alternate angles are on the RIGHT side of the auxiliary line — so PQR = 58° + 72°.",
      working: "Alternate angles are equal (auxiliary line ∥ CD): angle = 72°",
      showCalc: true,
      reasonOptions: pick("alt", "corr", "coint", "tri"), reasonCorrect: "alt",
    },
    {
      idx: 3, number: 4,
      instruction: "Find angle x (= angle PQR) by adding the two alternate angles at Q.",
      answerLabel: "x =", answerValue: 130,
      hint: "The auxiliary line splits angle PQR into two parts: the alternate angle to BPQ (58°) on the left, and the alternate angle to QRC (72°) on the right. Add them: 58 + 72.",
      working: "Angle PQR = 58° + 72° = 130°",
      showCalc: true,
      reasonOptions: pick("add", "str", "tri", "coint"), reasonCorrect: "add",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`,
        borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.accent, margin: 0, flex: 1 }}>
            Triangle between two parallel lines
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
              background: C.accent+"20", color: C.accent }}>4 marks</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
              background: "#fffbeb", color: C.amber }}>Higher</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: C.text, margin: 0, lineHeight: 1.6 }}>
          AB is parallel to CD. P is on AB, R is on CD, Q is the apex between them.
          Angle APQ = 58°. Angle QRC = 72°. Find angle x (= angle PQR), giving a reason for each step.
        </p>
      </div>

      {/* Diagram */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`,
        borderRadius: 12, padding: 16, marginBottom: 16,
        display: "flex", justifyContent: "center" }}>
        <Diagram auxY={auxY} onDrag={handleDrag} snapped={snapped} activeStep={activeStep} />
      </div>

      {/* Step 1: draw the line */}
      <div style={{
        border: `1.5px solid ${snapped ? C.green : C.accent}`,
        borderRadius: 12, overflow: "hidden", marginBottom: 12,
        background: snapped ? C.greenDim : "#fff", transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: snapped ? C.green : C.accent, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800 }}>{snapped ? "✓" : "1"}</div>
          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, flex: 1,
            color: snapped ? C.green : C.accent }}>
            {snapped
              ? "Auxiliary line drawn through Q — parallel to AB and CD ✓"
              : "Drag the line up through the diagram until it passes through Q"}
          </p>
        </div>
        {!snapped && (
          <div style={{ padding: "0 14px 14px" }}>
            <div style={{ background: "#fffbeb", border: `1.5px solid ${C.amber}`,
              borderRadius: 10, padding: "10px 13px", display: "flex", gap: 8 }}>
              <span>💡</span>
              <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.6 }}>
                In the exam you'd draw a horizontal line through Q parallel to both AB and CD.
                This auxiliary line lets you identify two alternate angles that add up to angle PQR.
                Drag the dashed line upward until it snaps onto Q.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[snapped, doneSteps.has(1), doneSteps.has(2), doneSteps.has(3)].map((done, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 99,
            background: done ? C.green : C.border, transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Steps */}
      {steps.map(s => (
        <StepCard key={s.idx} {...s}
          isActive={snapped && activeStep === s.idx}
          isDone={doneSteps.has(s.idx)}
          onDone={() => handleStepDone(s.idx)}
        />
      ))}

      {/* Completion */}
      {allDone && (
        <div style={{ background: C.greenDim, border: `2px solid ${C.green}`,
          borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 20, margin: "0 0 6px" }}>🎯</p>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.green, margin: "0 0 4px" }}>Scenario complete!</p>
          <p style={{ fontSize: 13, color: C.green, margin: 0, lineHeight: 1.5 }}>
            You drew the auxiliary line, identified both alternate angles, and added them correctly.
            That's exactly the working an examiner wants to see for full marks.
          </p>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onBack} style={{ flex: 1, padding: 12, borderRadius: 10,
          border: `1.5px solid ${C.border}`, background: "#fff", color: C.muted,
          fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Back to scenarios</button>
        {allDone && onComplete && (
          <button onClick={onComplete} style={{ flex: 1, padding: 12, borderRadius: 10,
            border: "none", background: C.green, color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Next scenario →</button>
        )}
      </div>
    </div>
  );
}