import { useState } from "react";
import { C } from "../../../../data/angles_data";
import AnglesLearn from "./angles_Learn";
import RealWorldTriangles from "./realworld/RealWorldTriangles";

// Placeholder components for tabs not yet built
function ComingSoon({ label }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚧</div>
      <p style={{ fontSize: "16px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
        {label} coming soon
      </p>
      <p style={{ fontSize: "14px", color: C.muted, margin: 0 }}>
        Start with Learn to build your foundations first.
      </p>
    </div>
  );
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const TABS = [
  { id: "learn",     label: "📖 Learn"      },
  { id: "realworld", label: "🌍 Real World"  },
  { id: "build",     label: "🎯 Build It"    },
  { id: "exam",      label: "📝 Exam"        },
];

export default function AnglesVisualiser() {
  const [mode,     setMode]     = useState("learn");
  const [resetKey, setResetKey] = useState(0);

  const switchTab = (id) => {
    setMode(id);
    setResetKey((k) => k + 1);
    scrollToTop();
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: C.text,
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "8px 0" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "24px", textAlign: "center", padding: "0 16px" }}>
          <p style={{
            fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em",
            textTransform: "uppercase", color: C.accent, margin: "0 0 6px",
          }}>
            Geometry · Angle Rules
          </p>
          <h1 style={{
            fontSize: "26px", fontWeight: "700", color: C.text,
            margin: "0 0 6px", lineHeight: 1.2,
          }}>
            Angles Explorer
          </h1>
          <p style={{ fontSize: "14px", color: C.muted, margin: 0, lineHeight: 1.5 }}>
            Learn the rules, see them in the real world, then practise exam questions
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: "flex", gap: "6px", marginBottom: "24px",
          background: C.surface, borderRadius: "12px", padding: "5px",
          boxShadow: C.shadow, border: `1px solid ${C.border}`,
          margin: "0 16px 24px",
        }}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              style={{
                flex: 1, padding: "9px 4px",
                background: mode === id ? C.accent : "transparent",
                color:      mode === id ? "#fff"   : C.muted,
                border: "none", borderRadius: "8px",
                fontSize: "12px", fontWeight: "600",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ padding: "0 16px" }}>
          {mode === "learn"     && <AnglesLearn        key={`learn-${resetKey}`} />}
          {mode === "realworld" && <RealWorldTriangles key={`rw-${resetKey}`}    />}
          {mode === "build"     && <ComingSoon         label="Build It"           />}
          {mode === "exam"      && <ComingSoon         label="Exam Practice"      />}
        </div>

      </div>
    </div>
  );
}