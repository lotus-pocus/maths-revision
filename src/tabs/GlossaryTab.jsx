import allTopics from "../data/allTopics";

export default function GlossaryTab() {
  const allTerms = allTopics
    .filter(t => t.terms)
    .flatMap(t => t.terms.map(term => ({ ...term, topicTitle: t.title, topicId: t.id })));

  const sorted  = [...allTerms].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(sorted.map(t => t.term[0].toUpperCase()))];

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.6 }}>
        All key terms across your GCSE Maths topics, in alphabetical order.
      </p>
      {letters.map(letter => (
        <div key={letter} style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "800", color: "#059669",
            textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 0",
            borderBottom: "2px solid #059669", marginBottom: "10px" }}>
            {letter}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sorted.filter(t => t.term[0].toUpperCase() === letter).map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e7eb",
                borderRadius: "10px", padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "baseline",
                  justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "700", fontSize: "13px", color: "#1a1a2e" }}>{t.term}</span>
                  <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0 }}>{t.topicTitle}</span>
                </div>
                <span style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>{t.def}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}