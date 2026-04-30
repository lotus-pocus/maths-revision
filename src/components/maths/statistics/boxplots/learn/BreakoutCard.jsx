import React, { useEffect } from "react";
import { C } from "../data";

// ── Icon definitions for each breakout type ───────────────────────────────
export const BREAKOUT_TYPES = {
  concept: {
    icon: "💡",
    label: "Why does this work?",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
  },
  drill: {
    icon: "🎯",
    label: "Can you get it right?",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
  },
  interpret: {
    icon: "✏️",
    label: "Now try it yourself",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
  },
};

// ── Inline trigger pill ───────────────────────────────────────────────────
// Sits anchored to content in both progressive and show-all modes
export function BreakoutTrigger({ type, label, onClick }) {
  const t = BREAKOUT_TYPES[type];
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px 6px 10px",
        borderRadius: "99px",
        border: `2px solid ${t.border}`,
        background: t.bg,
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
        color: t.color,
        boxShadow: `0 2px 8px ${t.border}80`,
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = `0 4px 14px ${t.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = `0 2px 8px ${t.border}80`;
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }}>{t.icon}</span>
      <span>{label || t.label}</span>
    </button>
  );
}

// ── Section-end breakout row (progressive disclosure mode) ────────────────
export function BreakoutRow({ breakouts }) {
  if (!breakouts || breakouts.length === 0) return null;
  return (
    <div style={{
      borderTop: `1px dashed ${C.border}`,
      paddingTop: "14px",
      marginTop: "4px",
      marginBottom: "16px",
    }}>
      <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
        Want to go deeper?
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {breakouts.map((b, i) => (
          <BreakoutTrigger key={i} type={b.type} label={b.label} onClick={b.onClick} />
        ))}
      </div>
    </div>
  );
}

// ── Modal overlay ─────────────────────────────────────────────────────────
export default function BreakoutCard({ type, title, onClose, children }) {
  const t = BREAKOUT_TYPES[type];

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Sheet — stops propagation so tapping inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "85vh",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div style={{
          background: t.bg,
          borderBottom: `2px solid ${t.border}`,
          padding: "16px 18px 14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "32px", lineHeight: 1 }}>{t.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: t.color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{t.label}</p>
            <p style={{ fontSize: "15px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>{title}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1.5px solid ${t.border}`, background: "#fff",
              cursor: "pointer", fontSize: "16px", color: t.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "18px", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}