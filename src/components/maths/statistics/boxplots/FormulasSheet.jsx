import FormulaCard from "./shared/FormulaCard";

/**
 * FormulasSheet — shown as a tab inside an interactive session.
 * Pass in the topic's formulas array and strand/accent colour.
 */
export default function FormulasSheet({ formulas = [], strand = "Statistics", accentColor }) {
  if (!formulas.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
        <p style={{ fontSize: "32px", marginBottom: "8px" }}>🧮</p>
        <p style={{ fontSize: "14px" }}>No formulas listed for this topic yet.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "4px 0 40px" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, marginBottom: "16px" }}>
        All formulas used in this topic. Tap any one to see a plain-English explanation and when to use it.
      </p>
      {formulas.map(f => (
        <FormulaCard
          key={f.id}
          formula={f}
          strand={strand}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}