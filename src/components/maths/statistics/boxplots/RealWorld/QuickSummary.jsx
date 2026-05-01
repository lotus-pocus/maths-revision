import { C } from "../data";

export default function QuickSummary({ s }) {
  if (s.id === "science") {
    const iqrA = s.answer.q3 - s.answer.q1;
    const iqrB = s.answerB.q3 - s.answerB.q1;

    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: "800", color: C.text, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Quick Comparison Summary
        </p>

        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
          <strong style={{ color: C.accent }}>Median:</strong> Fertiliser B is higher ({s.answerB.median} {s.unitShort} vs {s.answer.median} {s.unitShort}), so plants grew taller with Fertiliser B.
        </p>

        <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
          <strong style={{ color: C.amber }}>IQR:</strong> Fertiliser A is smaller ({iqrA} {s.unitShort} vs {iqrB} {s.unitShort}), so its results are more consistent.
        </p>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
          <p style={{ fontSize: "13px", color: "#047857", margin: 0, lineHeight: 1.6 }}>
            <strong>Best choice:</strong> Fertiliser B gives better average growth, but Fertiliser A is slightly more consistent.
          </p>
        </div>
      </div>
    );
  }

  const iqr = s.answer.q3 - s.answer.q1;
  const range = s.answer.max - s.answer.min;

  const rows = [
    { key: "median", label: "Median", value: `${s.answer.median} ${s.unitShort}` },
    { key: "iqr",    label: "IQR",    value: `${iqr} ${s.unitShort}` },
    { key: "range",  label: "Range",  value: `${range} ${s.unitShort}` },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "12px", fontWeight: "800", color: C.text, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Quick Summary
      </p>

      {rows.map(({ key, label, value }) => {
        const interp = s.interpretation?.[key];
        return (
          <div key={label} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: interp ? "8px" : 0 }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: C.accent }}>{label}</span>
              <strong style={{ fontSize: "13px", color: C.text }}>{value}</strong>
            </div>
            {interp && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: C.muted, flexShrink: 0, paddingTop: "1px" }}>WHAT</span>
                  <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{interp.what}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: C.accent, flexShrink: 0, paddingTop: "1px" }}>SO</span>
                  <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{interp.so}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {s.interpretation?.conclusion && (
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "10px", padding: "12px 14px", marginTop: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 4px" }}>📋 NHS manager's conclusion</p>
          <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.65 }}>{s.interpretation.conclusion}</p>
        </div>
      )}

      {s.interpretation?.examAnswer && (
        <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: "10px", padding: "14px", marginTop: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#d97706", margin: "0 0 8px" }}>⭐ How to write this in an exam</p>
          <p style={{ fontSize: "11px", fontWeight: "600", color: "#92400e", margin: "0 0 6px", fontStyle: "italic" }}>
            Q: {s.interpretation.examAnswer.question}
          </p>
          <div style={{ background: "#fff", border: "1px solid #fcd34d", borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
              "{s.interpretation.examAnswer.answer}"
            </p>
          </div>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#92400e", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Structure</p>
          {s.interpretation.examAnswer.structure.map((point, i) => (
            <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#d97706", fontWeight: "700", flexShrink: 0 }}>→</span>
              <p style={{ fontSize: "11px", color: "#92400e", margin: 0, lineHeight: 1.6 }}>{point}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}