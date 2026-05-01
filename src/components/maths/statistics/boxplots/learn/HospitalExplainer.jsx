import React, { useState } from "react";
import { C } from "../data";
import GlossaryTerm from "../GlossaryTerm";

// ── Data ──────────────────────────────────────────────────────────────────
const WARD_A = {
  label: "Ward A",
  color: C.accent,
  dim: C.accentDim,
  border: "#6ee7b7",
  scores: [22, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 48],
  mean: 35, median: 35, q1: 31, q3: 39, iqr: 8, min: 22, max: 48,
};

const WARD_B = {
  label: "Ward B",
  color: "#d97706",
  dim: "#fffbeb",
  border: "#fcd34d",
  scores: [3, 5, 10, 18, 25, 32, 35, 37, 38, 42, 45, 52, 55, 60, 68],
  mean: 35, median: 37, q1: 18, q3: 52, iqr: 34, min: 3, max: 68,
};

// ── Mini box plot SVG ─────────────────────────────────────────────────────
function BoxPlotRow({ ward, scaleMin, scaleMax }) {
  const W = 280;
  const toX = v => ((v - scaleMin) / (scaleMax - scaleMin)) * W;
  const boxH = 28, cy = boxH / 2;
  return (
    <div style={{ marginBottom: "4px" }}>
      <p style={{ fontSize: "11px", fontWeight: "700", color: ward.color, margin: "0 0 4px" }}>{ward.label}</p>
      <svg width={W} height={boxH + 4} style={{ overflow: "visible" }}>
        <line x1={toX(ward.min)} y1={cy} x2={toX(ward.q1)}  y2={cy} stroke={ward.color} strokeWidth="2" />
        <line x1={toX(ward.q3)}  y1={cy} x2={toX(ward.max)} y2={cy} stroke={ward.color} strokeWidth="2" />
        <line x1={toX(ward.min)} y1={cy-8} x2={toX(ward.min)} y2={cy+8} stroke={ward.color} strokeWidth="2" />
        <line x1={toX(ward.max)} y1={cy-8} x2={toX(ward.max)} y2={cy+8} stroke={ward.color} strokeWidth="2" />
        <rect x={toX(ward.q1)} y={2} width={toX(ward.q3)-toX(ward.q1)} height={boxH-4}
          fill={ward.dim} stroke={ward.color} strokeWidth="2" rx="3" />
        <line x1={toX(ward.median)} y1={2} x2={toX(ward.median)} y2={boxH-2} stroke={ward.color} strokeWidth="3" />
      </svg>
    </div>
  );
}

function ScaleAxis({ min, max }) {
  const W = 280;
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70].filter(t => t >= min && t <= max);
  return (
    <div style={{ position: "relative", width: W, height: "16px", marginTop: "2px" }}>
      {ticks.map(t => (
        <span key={t} style={{
          position: "absolute",
          left: `${((t - min) / (max - min)) * 100}%`,
          transform: "translateX(-50%)",
          fontSize: "10px", color: C.muted,
        }}>{t}</span>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.border}`, margin: "22px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function HospitalExplainer() {
  const [chosen, setChosen] = useState(null);

  return (
    <div>

      {/* ── Scenario ── */}
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "12px", padding: "14px 16px", marginBottom: "18px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>🏥 The scenario</p>
        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.75, margin: 0 }}>
          You're a hospital manager. Two wards both report an <strong>average waiting time of 35 minutes</strong>.
          You need to decide which ward needs urgent attention. The mean gives you nothing to go on.
          Let's look deeper.
        </p>
      </div>

      {/* ── Raw data ── */}
      <SectionLabel>Waiting times in minutes — 15 patients each</SectionLabel>
      {[WARD_A, WARD_B].map(ward => (
        <div key={ward.label} style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: ward.color, margin: "0 0 5px" }}>{ward.label}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {ward.scores.slice().sort((a, b) => a - b).map((v, i) => (
              <div key={i} style={{
                width: "34px", height: "34px", borderRadius: "7px",
                background: ward.dim, border: `1.5px solid ${ward.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "600", color: ward.color,
              }}>{v}</div>
            ))}
          </div>
        </div>
      ))}

      <Divider />

      {/* ── Mean comparison ── */}
      <SectionLabel>What the mean tells you</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        {[WARD_A, WARD_B].map(ward => (
          <div key={ward.label} style={{ background: ward.dim, border: `2px solid ${ward.border}`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: ward.color, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{ward.label}</p>
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 6px" }}>mean (average)</p>
            <p style={{ fontSize: "32px", fontWeight: "800", color: ward.color, margin: "0 0 4px" }}>{ward.mean}</p>
            <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>minutes</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 14px", marginBottom: "6px" }}>
        <p style={{ fontSize: "13px", color: "#991b1b", margin: 0, lineHeight: 1.6 }}>
          <strong>Both wards show a mean of 35 minutes.</strong> If you stopped here, you'd think they're identical — and do nothing. But something very different is happening inside each ward.
        </p>
      </div>

      <Divider />

      {/* ── Box plot comparison ── */}
      <SectionLabel>What the box plot tells you</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[WARD_A, WARD_B].map(ward => (
          <div key={ward.label} style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: "12px", padding: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: ward.color, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>{ward.label}</p>
            {[
              { label: "Median", value: `${ward.median} min`, note: "typical patient" },
              { label: "IQR", value: `${ward.iqr} min`, note: "middle 50% spread" },
              { label: "Min → Max", value: `${ward.min} → ${ward.max} min`, note: "full range" },
            ].map(({ label, value, note }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: C.muted }}>{label} </span>
                  <span style={{ fontSize: "10px", color: C.muted, fontStyle: "italic" }}>{note}</span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "800", color: ward.color }}>{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Visual box plots ── */}
      <div style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
          Same scale — 0 to 70 minutes
        </p>
        <BoxPlotRow ward={WARD_A} scaleMin={0} scaleMax={70} />
        <div style={{ marginTop: "10px" }} />
        <BoxPlotRow ward={WARD_B} scaleMin={0} scaleMax={70} />
        <ScaleAxis min={0} max={70} />
        <p style={{ fontSize: "11px", color: C.muted, margin: "8px 0 0", textAlign: "center" }}>Waiting time (minutes)</p>
      </div>

      {/* ── The insight cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <div style={{ background: C.accentDim, border: `1.5px solid ${C.accent}`, borderRadius: "12px", padding: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: C.accent, margin: "0 0 6px" }}>Ward A — IQR: 8 min</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.6, margin: 0 }}>
            Most patients wait 31–39 minutes. Consistent and predictable. Patients and staff know what to expect.
          </p>
        </div>
        <div style={{ background: "#fff8f0", border: "1.5px solid #d97706", borderRadius: "12px", padding: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: "#d97706", margin: "0 0 6px" }}>Ward B — IQR: 34 min</p>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.6, margin: 0 }}>
            Some patients wait 3 minutes, others 68. Chaotic and unpredictable. Some patients are being failed.
          </p>
        </div>
      </div>

      {/* ── Patient choice ── */}
      {!chosen ? (
        <div style={{ background: "#f5f3ff", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed", margin: "0 0 10px" }}>
            🤔 You need treatment. Which ward would you choose?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {["A", "B"].map(w => (
              <button key={w} onClick={() => setChosen(w)} style={{
                flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid #c4b5fd",
                background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "#7c3aed",
              }}>Ward {w}</button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: chosen === "A" ? C.accentDim : "#fef2f2",
          border: `2px solid ${chosen === "A" ? C.accent : "#fca5a5"}`,
          borderRadius: "12px", padding: "16px", marginBottom: "16px",
        }}>
          {chosen === "A" ? (
            <>
              <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 6px" }}>✓ Good choice — Ward A</p>
              <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
                You'd expect to wait roughly 31–39 minutes. That consistency is valuable — you can plan around it. The IQR of just 8 minutes tells you this ward runs predictably.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "13px", fontWeight: "800", color: "#dc2626", margin: "0 0 6px" }}>⚠️ Ward B — risky choice</p>
              <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
                You might wait 3 minutes or 68 — you have no way of knowing. The mean of 35 minutes is completely misleading here. The IQR of 34 minutes shows the experience varies wildly from patient to patient.
              </p>
            </>
          )}
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
            <strong>The mean said both wards were identical.</strong> The box plot showed you the truth in seconds. That's why it exists.
          </p>
          <button onClick={() => setChosen(null)} style={{
            background: "none", border: `1px solid ${C.border}`, borderRadius: "8px",
            padding: "6px 12px", fontSize: "12px", color: C.muted, cursor: "pointer",
          }}>← Choose again</button>
        </div>
      )}

      <Divider />

      {/* ── When to use each approach ── */}
      <SectionLabel>When to use each approach</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>

        {/* Mean */}
        <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#7c3aed", margin: "0 0 8px" }}>📊 Mean — simple, but easily thrown off</p>
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: C.accent, flexShrink: 0, marginTop: "1px" }}>✓</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              Uses every single score — so it's a fair reflection when results are <GlossaryTerm term="symmetric">symmetric</GlossaryTerm>. Like Ward A, where all 15 patients waited somewhere between 22 and 48 minutes with nothing extreme at either end.
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#dc2626", flexShrink: 0, marginTop: "1px" }}>✗</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              One <GlossaryTerm term="Outlier">outlier</GlossaryTerm> — like Ward B's 3-minute or 68-minute patient — pulls the mean away from what most patients actually experienced. It ends up describing nobody.
            </p>
          </div>
        </div>

        {/* Median */}
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#d97706", margin: "0 0 8px" }}>➗ Median — reliable, but incomplete</p>
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: C.accent, flexShrink: 0, marginTop: "1px" }}>✓</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              Only cares about position — who's in the middle of the queue. That 3-minute patient and the 68-minute patient in Ward B can't move it, because it's not counting totals. It just finds the centre of the line.
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#dc2626", flexShrink: 0, marginTop: "1px" }}>✗</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              Still just one number. Ward A and Ward B have medians of 35 and 37 — almost identical. The median alone would still leave you thinking the two wards are pretty similar.
            </p>
          </div>
        </div>

        {/* Box plot */}
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}60`, borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 8px" }}>📦 Box plot — the full picture</p>
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: C.accent, flexShrink: 0, marginTop: "1px" }}>✓</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              Shows the median AND how spread out the results are (IQR) AND the full range — all at once, all on one diagram. It's the only tool here that immediately shows you Ward A (IQR: 8) and Ward B (IQR: 34) are completely different.
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#dc2626", flexShrink: 0, marginTop: "1px" }}>✗</span>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>
              Takes a little more effort to read than a single number — but that extra information is exactly the point.
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── When box plots work best ── */}
      <SectionLabel>When box plots work best</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}60`, borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: C.accent, margin: "0 0 10px" }}>✓ Box plots shine when…</p>
          {[
            { icon: "⚖️", text: "You're comparing two groups side by side — like two wards, two classes, two experiments. This is where box plots are unbeatable." },
            { icon: "📏", text: "The spread matters as much as the middle. Knowing the IQR tells you how consistent or chaotic a dataset is." },
            { icon: "🔍", text: "There might be extreme results pulling averages off course. The box plot shows this visually — a long whisker is a dead giveaway." },
            { icon: "📦", text: "You have at least 20 or so values. With larger datasets, the five summary numbers tell a genuinely reliable story." },
          ].map(({ icon, text }) => (
            <div key={icon} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#991b1b", margin: "0 0 10px" }}>⚠️ When to think twice…</p>
          {[
            { icon: "🔢", text: "Very small datasets — fewer than around 15 values. With only 6 or 8 numbers, the five summary points can look misleading. You'd be better off just listing the values." },
            { icon: "📊", text: "When you only need one number for a quick comparison or calculation — the mean is simpler and perfectly fine when results are all similar." },
          ].map(({ icon, text }) => (
            <div key={icon} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
          <div style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", marginTop: "6px" }}>
            <p style={{ fontSize: "12px", color: "#7f1d1d", margin: 0, lineHeight: 1.6 }}>
              📝 <strong>In your GCSE exam</strong> — the data will always be large enough for a box plot to be appropriate. You won't be set up to fail. But understanding this limitation helps you explain <em>why</em> box plots are the right tool when an exam question asks you to justify your choice.
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Exam trigger words ── */}
      <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "12px", padding: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: "#d97706", margin: "0 0 10px" }}>
          ⭐ Exam trigger words — spot these and think box plot
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
          {["compare", "consistent", "spread", "typical", "more reliable", "interquartile", "outlier", "range", "better represents"].map(word => (
            <span key={word} style={{
              fontSize: "12px", fontWeight: "700", color: "#92400e",
              background: "#fff", border: "1.5px solid #fcd34d",
              borderRadius: "99px", padding: "4px 10px",
            }}>{word}</span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
          If any of these appear in a question, a single average won't score full marks. The examiner wants you to talk about spread — and that means IQR and box plots. Always quote the actual IQR values in your answer.
        </p>
      </div>

    </div>
  );
}