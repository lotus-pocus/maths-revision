import { useState } from "react";
import { C } from "../../../../data/angles_data";
import SectionAngleTypes      from "./learn/SectionAngleTypes";
import SectionLines           from "./learn/SectionLines";
import SectionTriangles       from "./learn/SectionTriangles";
import SectionQuadrilaterals  from "./learn/SectionQuadrilaterals";
import SectionParallel        from "./learn/SectionParallel";

// ── Section definitions ───────────────────────────────────────────────────
// Each section maps to its own component file (built one at a time)
const SECTIONS = [
  { id: "types",     title: "Angle types"        },
  { id: "lines",     title: "Lines & points"     },
  { id: "triangles", title: "Triangles"          },
  { id: "quads",     title: "Quadrilaterals"     },
  { id: "parallel",  title: "Parallel lines"     },
  { id: "chaining",  title: "Multi-step problems"},
];

// ── Breakout pill button ──────────────────────────────────────────────────
export function BreakoutPill({ type, label, onClick }) {
  const TYPES = {
    concept:   { icon: "💡", colour: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    drill:     { icon: "🎯", colour: C.green,   bg: C.greenDim, border: "#6ee7b7" },
    interpret: { icon: "✏️", colour: C.purple,  bg: C.purpleDim, border: "#c4b5fd" },
  };
  const t = TYPES[type] || TYPES.concept;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "7px 16px 7px 10px", borderRadius: "99px",
        border: `2px solid ${t.border}`, background: t.bg,
        cursor: "pointer", fontSize: "13px", fontWeight: "700", color: t.colour,
        boxShadow: `0 2px 8px ${t.border}80`, margin: "12px 0 4px",
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }}>{t.icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Breakout modal shell ──────────────────────────────────────────────────
export function BreakoutModal({ breakout, onClose, children }) {
  if (!breakout) return null;
  const TYPES = {
    concept:   { icon: "💡", label: "Why does this work?",   colour: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    drill:     { icon: "🎯", label: "Can you get it right?", colour: C.green,   bg: C.greenDim, border: "#6ee7b7" },
    interpret: { icon: "✏️", label: "Now try it yourself",   colour: C.purple,  bg: C.purpleDim, border: "#c4b5fd" },
  };
  const t = TYPES[breakout.type] || TYPES.concept;
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 1000, display: "flex",
        alignItems: isNarrow ? "flex-end" : "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        padding: isNarrow ? "0" : "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "600px",
          maxHeight: isNarrow ? "90vh" : "80vh",
          background: "#fff",
          borderRadius: isNarrow ? "20px 20px 0 0" : "16px",
          overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Drag handle on mobile */}
        {isNarrow && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "99px", background: "#d1d5db" }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          background: t.bg, borderBottom: `2px solid ${t.border}`,
          padding: "14px 18px", display: "flex", alignItems: "center",
          gap: "12px", flexShrink: 0,
        }}>
          <span style={{ fontSize: "32px", lineHeight: 1 }}>{t.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: t.colour,
              textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
              {t.label}
            </p>
            <p style={{ fontSize: "15px", fontWeight: "800", color: C.text, margin: 0 }}>
              {breakout.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1.5px solid ${t.border}`, background: "#fff",
              cursor: "pointer", fontSize: "16px", colour: t.colour,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "18px", flex: 1, WebkitOverflowScrolling: "touch" }}>
          {children}
          <div style={{ height: "24px" }} />
        </div>
      </div>
    </div>
  );
}

// ── Section nav (dots + Back / Continue buttons) ──────────────────────────
function SectionNav({ currentSection, totalSections, onBack, onNext, breakouts }) {
  const isLast = currentSection === totalSections - 1;
  return (
    <div style={{ marginTop: "28px" }}>

      {/* Breakout pills */}
      {breakouts && breakouts.length > 0 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: "14px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
            Want to go deeper?
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {breakouts.map((b, i) => (
              <BreakoutPill key={i} type={b.type} label={b.label} onClick={b.onClick} />
            ))}
          </div>
        </div>
      )}

      {/* Back / Continue */}
      <div style={{ display: "flex", gap: "10px" }}>
        {currentSection > 0 && (
          <button onClick={onBack} style={{
            flex: 1, padding: "13px", borderRadius: "12px",
            border: `1.5px solid ${C.border}`, background: C.surface,
            fontSize: "14px", fontWeight: "600", colour: C.muted, cursor: "pointer",
          }}>
            ← Back
          </button>
        )}
        {!isLast && (
          <button onClick={onNext} style={{
            flex: 1, padding: "13px", borderRadius: "12px", border: "none",
            background: C.accent, fontSize: "14px", fontWeight: "700",
            color: "#fff", cursor: "pointer",
          }}>
            Continue →
          </button>
        )}
        {isLast && (
          <div style={{
            flex: 1, padding: "13px", borderRadius: "12px",
            background: C.accentDim, border: `1px solid ${C.accent}40`,
            fontSize: "14px", fontWeight: "600", color: C.accent,
            textAlign: "center",
          }}>
            ✓ Section complete — try Build It next!
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "14px" }}>
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            style={{
              width:  i === currentSection ? "20px" : "8px",
              height: "8px", borderRadius: "99px",
              transition: "width 0.2s",
              background: i === currentSection
                ? C.accent
                : i < currentSection
                ? C.accent + "60"
                : C.border,
            }}
          />
        ))}
      </div>

    </div>
  );
}

// ── Placeholder section ───────────────────────────────────────────────────
// Shown while individual section files are being built
function PlaceholderSection({ section, nav }) {
  return (
    <div>
      <div style={{
        background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "16px 18px", marginBottom: "20px",
      }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 4px" }}>
          📐 Section: {section.title}
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>
          This section is being built. Use the Continue button below to explore the structure.
        </p>
      </div>

      {/* Example of what a content card looks like */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "16px 18px", marginBottom: "12px",
      }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
          Coming in this section:
        </p>
        <ul style={{ paddingLeft: "18px", margin: 0 }}>
          {SECTION_PREVIEWS[section.id]?.map((point, i) => (
            <li key={i} style={{ fontSize: "13px", color: C.muted, lineHeight: 1.7, marginBottom: "4px" }}>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {nav}
    </div>
  );
}

// Preview bullet points for each section shown in the placeholder
const SECTION_PREVIEWS = {
  types: [
    "Acute (0°–90°), right (90°), obtuse (90°–180°), straight (180°), reflex (180°–360°)",
    "Three-letter angle notation — angle ABC, not just 'the angle'",
    "Interactive: tap the correct angle type from a diagram",
  ],
  lines: [
    "Angles on a straight line add up to 180°",
    "Angles around a point add up to 360°",
    "Vertically opposite angles are equal",
    "Interactive: drag the missing angle value onto the diagram",
  ],
  triangles: [
    "Angles in any triangle add up to 180°",
    "Isosceles triangle: two equal sides → two equal base angles",
    "Equilateral triangle: all sides equal → all angles 60°",
    "Why isosceles matters for circle theorems",
  ],
  quads: [
    "Angles in any quadrilateral add up to 360°",
    "Why: any quadrilateral splits into two triangles (2 × 180° = 360°)",
    "Special properties: square, rectangle, parallelogram, trapezium, kite, rhombus",
    "The kite rule — the angle Edexcel loves to test in multi-step questions",
  ],
  parallel: [
    "Alternate angles are equal — NOT 'Z angles' (Edexcel no longer accepts this)",
    "Co-interior angles add up to 180°",
    "Corresponding angles are equal",
    "Interactive: identify the rule from the diagram",
  ],
  chaining: [
    "Using two or three rules in one question",
    "Writing reasons alongside each step (not at the end)",
    "Three-letter notation in full working",
    "Edexcel-style multi-step worked example",
  ],
};

// ── Mode toggle (Step by step / Show all) ─────────────────────────────────
function ModeToggle({ showAll, setShowAll }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
      <div style={{
        display: "flex", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "99px",
        padding: "3px", gap: "2px",
      }}>
        {[
          { val: false, label: "📑 Step by step" },
          { val: true,  label: "📖 Show all"     },
        ].map(({ val, label }) => (
          <button
            key={String(val)}
            onClick={() => setShowAll(val)}
            style={{
              padding: "5px 14px", borderRadius: "99px", border: "none",
              cursor: "pointer", fontSize: "12px", fontWeight: "600",
              transition: "all 0.15s",
              background: showAll === val ? C.accent : "transparent",
              color:      showAll === val ? "#fff"   : C.muted,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Sticky context bar ────────────────────────────────────────────────────
function ContextBar({ currentSection, totalSections }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 10,
      background: C.accentDim, border: `1px solid ${C.accent}40`,
      borderRadius: "10px", padding: "10px 14px", marginBottom: "20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
    }}>
      <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5, flex: 1 }}>
        📐 <strong>Angle rules are the foundation of all geometry.</strong> Master these and circle theorems become straightforward.
      </p>
      <span style={{ fontSize: "11px", fontWeight: "700", color: C.accent, flexShrink: 0 }}>
        {currentSection + 1}/{totalSections}
      </span>
    </div>
  );
}

// ── Main Learn component ──────────────────────────────────────────────────
export default function AnglesLearn() {
  const [showAll,        setShowAll]        = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [openBreakout,   setOpenBreakout]   = useState(null);

  const totalSections = SECTIONS.length;

  const nav = (
    <SectionNav
      currentSection={currentSection}
      totalSections={totalSections}
      onBack={() => setCurrentSection((s) => s - 1)}
      onNext={() => setCurrentSection((s) => s + 1)}
      breakouts={[]}
    />
  );

  const Divider = () => (
    <div style={{ borderTop: `1px solid ${C.border}`, margin: "28px 0" }} />
  );

  // Renders the correct section component by index
  const renderSection = (index, navEl) => {
    const section = SECTIONS[index];
    if (section.id === "types")     return <SectionAngleTypes     nav={navEl} />;
    if (section.id === "lines")     return <SectionLines           nav={navEl} />;
    if (section.id === "triangles") return <SectionTriangles       nav={navEl} />;
    if (section.id === "quads")     return <SectionQuadrilaterals  nav={navEl} />;
    if (section.id === "parallel")  return <SectionParallel        nav={navEl} />;
    return <PlaceholderSection section={section} nav={navEl} />;
  };

  return (
    <div>
      <ModeToggle showAll={showAll} setShowAll={setShowAll} />

      {/* ── STEP BY STEP ── */}
      {!showAll && (
        <div>
          <ContextBar currentSection={currentSection} totalSections={totalSections} />
          {renderSection(currentSection, nav)}
        </div>
      )}

      {/* ── SHOW ALL ── */}
      {showAll && (
        <div>
          <div style={{
            position: "sticky", top: 0, zIndex: 10,
            background: C.accentDim, border: `1px solid ${C.accent}40`,
            borderRadius: "10px", padding: "10px 14px", marginBottom: "20px",
          }}>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.5 }}>
              📐 <strong>Angle rules are the foundation of all geometry.</strong> Master these and circle theorems become straightforward.
            </p>
          </div>
          {SECTIONS.map((section, i) => (
            <div key={section.id}>
              {renderSection(i, null)}
              {i < SECTIONS.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      )}

      {/* ── BREAKOUT MODAL ── */}
      <BreakoutModal breakout={openBreakout} onClose={() => setOpenBreakout(null)}>
        {/* Breakout content components will be added here as they are built */}
        <p style={{ fontSize: "14px", color: C.muted }}>Content coming soon.</p>
      </BreakoutModal>
    </div>
  );
}