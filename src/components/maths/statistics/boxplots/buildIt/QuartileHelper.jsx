import { C } from "../data";

export default function QuartileHelper({ sorted, which, onClose }) {
  const n = sorted.length;
  const half = Math.floor(n / 2);
  const isQ1 = which === "q1";

  // Edexcel method: split at median, don't include median in either half
  const lowerHalf = sorted.slice(0, half);
  const upperHalf = n % 2 === 0 ? sorted.slice(half) : sorted.slice(half + 1);
  const half2     = isQ1 ? lowerHalf : upperHalf;
  const halfName  = isQ1 ? "lower" : "upper";
  const midIdx    = Math.floor(half2.length / 2);
  const result    = half2.length % 2 === 1 ? half2[midIdx] : (half2[midIdx - 1] + half2[midIdx]) / 2;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "20px", maxWidth: "380px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "14px", fontWeight: "800", color: C.accent, margin: 0 }}>
            How to find {isQ1 ? "Q1" : "Q3"}
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: C.muted, lineHeight: 1 }}>✕</button>
        </div>

        {/* Step 1 — full list */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
            Step 1 — your ordered list ({n} values)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {sorted.map((v, i) => {
              const isMedian  = n % 2 === 1 && i === half;
              const inTarget  = isQ1 ? i < half : (n % 2 === 0 ? i >= half : i > half);
              return (
                <div key={i} style={{
                  width: "36px", height: "32px", borderRadius: "6px",
                  background: isMedian ? "#e5e7eb" : inTarget ? C.accentDim : "#f9fafb",
                  border: `1.5px solid ${isMedian ? C.muted : inTarget ? C.accent : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: "700",
                  color: isMedian ? C.muted : inTarget ? C.accent : C.text,
                  opacity: isMedian ? 0.5 : 1,
                }}>
                  {v}
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "11px", color: C.muted, margin: "5px 0 0" }}>
            Highlighted: the <strong>{halfName} half</strong>{n % 2 === 1 ? " (median excluded)" : ""}
          </p>
        </div>

        {/* Step 2 — the half */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
            Step 2 — find the middle of the {halfName} half
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
            {half2.map((v, i) => {
              const isMiddle = half2.length % 2 === 1 ? i === midIdx : (i === midIdx - 1 || i === midIdx);
              return (
                <div key={i} style={{
                  width: "36px", height: "32px", borderRadius: "6px",
                  background: isMiddle ? C.accentDim : "#f9fafb",
                  border: `1.5px solid ${isMiddle ? C.accent : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: "700",
                  color: isMiddle ? C.accent : C.text,
                }}>
                  {v}
                </div>
              );
            })}
          </div>
          {half2.length % 2 === 0 && (
            <p style={{ fontSize: "11px", color: C.muted, margin: "0 0 4px" }}>
              Even number of values → average the two middle ones: ({half2[midIdx - 1]} + {half2[midIdx]}) ÷ 2
            </p>
          )}
        </div>

        {/* Answer */}
        <div style={{ background: C.accentDim, border: `1.5px solid ${C.accent}`, borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: 0 }}>
            {isQ1 ? "Q1" : "Q3"} =
          </p>
          <p style={{ fontSize: "22px", fontWeight: "800", color: C.accent, margin: 0 }}>{result}</p>
        </div>
      </div>
    </div>
  );
}