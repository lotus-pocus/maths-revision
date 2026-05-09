import { useState } from "react";
import { C } from "../../../../../data/angles_data";

// ── Shared UI components used across all Learn sections ───────────────────
// Import from here instead of defining locally in each section file.

// Amber exam tip box
export function ExamTip({ children }) {
  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fcd34d",
      borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
      <p style={{ fontSize: "12px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
        ⭐ <strong>Exam tip:</strong> {children}
      </p>
    </div>
  );
}

// Red warning box
export function WarnBox({ children }) {
  return (
    <div style={{ background: C.redDim, border: "1px solid #fca5a5",
      borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
      <p style={{ fontSize: "12px", color: "#991b1b", margin: 0, lineHeight: 1.6 }}>
        ⚠️ {children}
      </p>
    </div>
  );
}

// Coloured info/hook box
export function InfoBox({ colour = C.accent, colourDim = C.accentDim, children }) {
  return (
    <div style={{ background: colourDim, border: `1px solid ${colour}40`,
      borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
      <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}

// Coloured rule card with title, rule text and children
export function RuleCard({ colour, colourDim, icon, title, rule, children }) {
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

// Small uppercase section label
export function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
      textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
      {children}
    </p>
  );
}

// Real-world hook bar — shown at top of each section
export function HookBox({ children }) {
  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
      borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent,
        margin: "0 0 6px" }}>🌍 Why does this matter?</p>
      <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}

// Step-by-step worked example — tap to reveal each step
export function StepByStepWorking({ steps }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {steps.map((step, i) => (
        <div key={i}>
          {i <= revealed ? (
            <div style={{
              background: i === revealed ? C.accentDim : C.surface,
              border: `1px solid ${i === revealed ? C.accent : C.border}`,
              borderRadius: "10px", padding: "10px 14px",
            }}>
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

// Sub-tab bar — used inside each section to switch between content tabs
export function SubTabBar({ tabs, activeTab, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "4px", background: C.surface,
      border: `1px solid ${C.border}`, borderRadius: "10px",
      padding: "4px", marginBottom: "20px", flexWrap: "wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)}
          style={{ flex: "1 1 auto", padding: "8px 6px", borderRadius: "7px",
            border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600",
            transition: "all 0.15s", minWidth: "60px",
            background: activeTab === t.id ? C.accent : "transparent",
            color:      activeTab === t.id ? "#fff"   : C.muted }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}