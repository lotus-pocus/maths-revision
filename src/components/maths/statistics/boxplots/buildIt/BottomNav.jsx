import { C } from "../data";

export default function BottomNav({ onBack, onNext, nextLabel = "Next →", backLabel = "← Back", showBack = true }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      {showBack && (
        <button onClick={onBack} style={{ flex: 1, padding: "14px", background: "transparent", color: C.muted,
          border: `1.5px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          {backLabel}
        </button>
      )}
      {onNext && (
        <button onClick={onNext} style={{ flex: 1, padding: "14px", background: C.accent, color: C.bg,
          border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}