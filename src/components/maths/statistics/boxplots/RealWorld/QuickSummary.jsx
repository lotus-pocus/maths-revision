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

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "12px", fontWeight: "800", color: C.text, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Quick Summary
      </p>

      {[
        { label: "Median", value: `${s.answer.median} ${s.unitShort}` },
        { label: "IQR", value: `${iqr} ${s.unitShort}` },
        { label: "Range", value: `${range} ${s.unitShort}` },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: C.accent }}>{label}</span>
          <strong style={{ fontSize: "13px", color: C.text }}>{value}</strong>
        </div>
      ))}
    </div>
  );
}