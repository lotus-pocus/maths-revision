import React, { useState } from "react";
import { C } from "./data";
import MidrangeExplorer from "./learn/MidrangeExplorer";
import FindTheValue from "./learn/FindTheValue";
import InterpretThis from "./learn/InterpretThis";
import {
  SectionData,
  SectionAnatomy,
  SectionWhole,
  SectionSplit,
  SectionIQR,
  SectionExam,
} from "./learn/LearnSections";

// ── Section definitions ───────────────────────────────────────────────────
const SECTIONS = [
  { id: "data",    title: "The data"        },
  { id: "anatomy", title: "The box plot"    },
  { id: "whole",   title: "The whole year"  },
  { id: "split",   title: "Split by class"  },
  { id: "iqr",     title: "Why IQR matters" },
  { id: "exam",    title: "In the exam"     },
];

// ── Breakout pill ─────────────────────────────────────────────────────────
function BreakoutPill({ type, label, onClick }) {
  const TYPES = {
    concept:   { icon: "💡", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    drill:     { icon: "🎯", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    interpret: { icon: "✏️", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  };
  const t = TYPES[type];
  return (
    <button onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 16px 7px 10px",
        borderRadius: "99px", border: `2px solid ${t.border}`, background: t.bg, cursor: "pointer",
        fontSize: "13px", fontWeight: "700", color: t.color,
        boxShadow: `0 2px 8px ${t.border}80`, margin: "12px 0 4px" }}>
      <span style={{ fontSize: "24px", lineHeight: 1 }}>{t.icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Breakout modal shell ──────────────────────────────────────────────────
function BreakoutModal({ breakout, onClose, children }) {
  if (!breakout) return null;
  const TYPES = {
    concept: { icon: "💡", label: "Why does this work?",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    drill:     { icon: "🎯", label: "Can you get it right?",  color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    interpret: { icon: "✏️", label: "Now try it yourself",     color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  };
  const t = TYPES[breakout.type];

  // Responsive: on narrow screens use a bottom sheet,
  // on wider screens centre the modal vertically.
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;

  const overlayStyle = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: isNarrow ? "flex-end" : "center",
    justifyContent: "center",
    backdropFilter: "blur(2px)",
    padding: isNarrow ? "0" : "24px",
    boxSizing: "border-box",
  };

  const sheetStyle = {
    width: "100%",
    maxWidth: "600px",
    // On mobile take up 90% of screen height; on desktop cap at 80vh
    maxHeight: isNarrow ? "90vh" : "80vh",
    background: "#fff",
    borderRadius: isNarrow ? "20px 20px 0 0" : "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
  };

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={e => e.stopPropagation()} style={sheetStyle}>

        {/* Drag handle — mobile only hint */}
        {isNarrow && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "99px", background: "#d1d5db" }} />
          </div>
        )}

        {/* Header */}
        <div style={{ background: t.bg, borderBottom: `2px solid ${t.border}`,
          padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <span style={{ fontSize: "32px", lineHeight: 1 }}>{t.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: t.color, textTransform: "uppercase",
              letterSpacing: "0.08em", margin: "0 0 2px" }}>{t.label}</p>
            <p style={{ fontSize: "15px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>{breakout.title}</p>
          </div>
          <button onClick={onClose}
            style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${t.border}`,
              background: "#fff", cursor: "pointer", fontSize: "16px", color: t.color, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "18px", flex: 1, WebkitOverflowScrolling: "touch" }}>
          {children}
          {/* Bottom padding so last item isn't flush against edge on mobile */}
          <div style={{ height: "24px" }} />
        </div>

      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Learn() {
  const [activePart,     setActivePart]     = useState(null);
  const [activeGraph,    setActiveGraph]    = useState("cumfreq");
  const [showAll,        setShowAll]        = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [openBreakout,   setOpenBreakout]   = useState(null); // { type, title }

  const totalSections = SECTIONS.length;
  const isLast = currentSection === totalSections - 1;

  const openMidrange = () => setOpenBreakout({ type: "concept", title: "Why not just use midrange?" });
  const openDrill      = () => setOpenBreakout({ type: "drill",     title: "Find the value" });
  const openInterpret = () => setOpenBreakout({ type: "interpret", title: "Now interpret it yourself" });

  // ── Mode toggle ──────────────────────────────────────────────────────────
  const ModeToggle = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
      <div style={{ display: "flex", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "99px", padding: "3px", gap: "2px" }}>
        {[{ val: false, label: "📑 Step by step" }, { val: true, label: "📖 Show all" }].map(({ val, label }) => (
          <button key={String(val)} onClick={() => setShowAll(val)}
            style={{ padding: "5px 14px", borderRadius: "99px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "600", transition: "all 0.15s",
              background: showAll === val ? C.accent : "transparent",
              color: showAll === val ? "#fff" : C.muted }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Sticky context bar ───────────────────────────────────────────────────
  const ContextBar = () => (
    <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.accentDim,
      border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "10px 14px",
      marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
      <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5, flex: 1 }}>
        🏫 <strong>60 Year 11 students just sat a maths paper.</strong> You're the head of maths. What do the results actually tell you?
      </p>
      <span style={{ fontSize: "11px", fontWeight: "700", color: C.accent, flexShrink: 0 }}>
        {currentSection + 1}/{totalSections}
      </span>
    </div>
  );

  // ── Section nav ──────────────────────────────────────────────────────────
  const SectionNav = ({ breakouts }) => (
    <div style={{ marginTop: "24px" }}>
      {breakouts && breakouts.length > 0 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: "14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
            Want to go deeper?
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {breakouts.map((b, i) => (
              <BreakoutPill key={i} type={b.type} label={b.label} onClick={b.onClick} />
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        {currentSection > 0 && (
          <button onClick={() => setCurrentSection(s => s - 1)}
            style={{ flex: 1, padding: "13px", borderRadius: "12px", border: `1.5px solid ${C.border}`,
              background: C.surface, fontSize: "14px", fontWeight: "600", color: C.muted, cursor: "pointer" }}>
            ← Back
          </button>
        )}
        {!isLast && (
          <button onClick={() => setCurrentSection(s => s + 1)}
            style={{ flex: 1, padding: "13px", borderRadius: "12px", border: "none",
              background: C.accent, fontSize: "14px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
            Continue →
          </button>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "14px" }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setCurrentSection(i)}
            style={{ width: i === currentSection ? "20px" : "8px", height: "8px", borderRadius: "99px",
              border: "none", cursor: "pointer", transition: "width 0.2s",
              background: i === currentSection ? C.accent : i < currentSection ? C.accent + "60" : C.border }} />
        ))}
      </div>
    </div>
  );

  // ── Shared props ─────────────────────────────────────────────────────────
  const dataProps    = { showAll, openMidrange, BreakoutPill };
  const anatomyProps = { activePart, setActivePart, showAll, openDrill, BreakoutPill };
  const splitProps   = { showAll, openInterpret, BreakoutPill };
  const examProps    = { activeGraph, setActiveGraph, showAll, openInterpret, BreakoutPill };

  // ── Section map ──────────────────────────────────────────────────────────
  const SECTION_MAP = [
    { Component: SectionData,    props: dataProps,    breakouts: [{ type: "concept",   label: "Why not just use midrange?",      onClick: openMidrange  }] },
    { Component: SectionAnatomy, props: anatomyProps, breakouts: [{ type: "drill",     label: "Find the value — test yourself",  onClick: openDrill     }] },
    { Component: SectionWhole,   props: {},           breakouts: [] },
    { Component: SectionSplit,   props: splitProps,   breakouts: [{ type: "interpret", label: "Now interpret it yourself",       onClick: openInterpret }] },
    { Component: SectionIQR,     props: {},           breakouts: [] },
    { Component: SectionExam,    props: examProps,    breakouts: [{ type: "interpret", label: "Now interpret it yourself",       onClick: openInterpret }] },
  ];

  const Divider = () => <div style={{ borderTop: `1px solid ${C.border}`, margin: "28px 0" }} />;
  const { Component: ActiveComponent, props: activeProps, breakouts: activeBreakouts } = SECTION_MAP[currentSection];

  return (
    <div>
      <ModeToggle />

      {/* ── STEP BY STEP ── */}
      {!showAll && (
        <div>
          <ContextBar />
          <ActiveComponent nav={<SectionNav breakouts={activeBreakouts} />} {...activeProps} />
        </div>
      )}

      {/* ── SHOW ALL ── */}
      {showAll && (
        <div>
          <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.accentDim,
            border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "10px 14px", marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>
              🏫 <strong>60 Year 11 students just sat a maths paper.</strong> You're the head of maths. What do the results actually tell you?
            </p>
          </div>
          <SectionData    nav={null} {...dataProps}    /><Divider />
          <SectionAnatomy nav={null} {...anatomyProps} /><Divider />
          <SectionWhole   nav={null}                   /><Divider />
          <SectionSplit   nav={null}                   /><Divider />
          <SectionIQR     nav={null}                   /><Divider />
          <SectionExam    nav={null} {...examProps}    />
        </div>
      )}

      {/* ── BREAKOUT MODALS ── */}
      <BreakoutModal breakout={openBreakout} onClose={() => setOpenBreakout(null)}>
        {openBreakout?.type === "concept"   && <MidrangeExplorer />}
        {openBreakout?.type === "drill"     && <FindTheValue />}
        {openBreakout?.type === "interpret" && <InterpretThis />}
      </BreakoutModal>
    </div>
  );
}