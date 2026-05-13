import { useState } from "react";
import allTopics from "../data/allTopics";
import FormulaCard from "../components/maths/statistics/boxplots/shared/FormulaCard";

const STRAND_COLORS = {
  Statistics:  { border: "#059669", bg: "#ecfdf5", text: "#065f46" },
  Geometry:    { border: "#2563eb", bg: "#eff6ff", text: "#1e40af" },
  Algebra:     { border: "#7c3aed", bg: "#f5f3ff", text: "#4c1d95" },
  Number:      { border: "#d97706", bg: "#fffbeb", text: "#78350f" },
  Probability: { border: "#db2777", bg: "#fdf2f8", text: "#831843" },
  Ratio:       { border: "#0891b2", bg: "#ecfeff", text: "#164e63" },
};

// Flatten all formulas with topic metadata for search
function getAllFormulas() {
  return allTopics.flatMap(topic =>
    (topic.formulas || []).map(f => ({ ...f, topicId: topic.id, topicTitle: topic.title, strand: topic.strand }))
  );
}

export default function FormulasTab({ onNavigateToTopic }) {
  const [search, setSearch] = useState("");
  const [activeStrand, setActiveStrand] = useState("all");

  const allFormulas  = getAllFormulas();
  const strands      = ["all", ...new Set(allTopics.map(t => t.strand))];
  const topicsWithFormulas = allTopics.filter(t => t.formulas?.length > 0);

  const query = search.toLowerCase().trim();

  // Filter by strand + search
  const visibleTopics = topicsWithFormulas
    .filter(t => activeStrand === "all" || t.strand === activeStrand)
    .map(topic => ({
      ...topic,
      visibleFormulas: (topic.formulas || []).filter(f =>
        !query ||
        f.name.toLowerCase().includes(query) ||
        f.formula.toLowerCase().includes(query) ||
        f.plain.toLowerCase().includes(query) ||
        f.when.toLowerCase().includes(query)
      ),
    }))
    .filter(t => t.visibleFormulas.length > 0);

  const totalVisible = visibleTopics.reduce((sum, t) => sum + t.visibleFormulas.length, 0);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: "3rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 4px" }}>
          🧮 Formulas
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          {totalVisible} formula{totalVisible !== 1 ? "s" : ""} across {visibleTopics.length} topic{visibleTopics.length !== 1 ? "s" : ""}. Tap any formula to see what it means and when to use it.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search formulas, e.g. 'IQR', 'mean', 'angle'…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", fontSize: "13px",
          border: "1px solid #e5e7eb", borderRadius: "10px",
          background: "#fff", color: "#1a1a2e", marginBottom: "12px",
          boxSizing: "border-box", outline: "none",
        }}
      />

      {/* Strand filter pills */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
        {strands.map(s => {
          const sc = s === "all" ? null : STRAND_COLORS[s];
          const active = activeStrand === s;
          return (
            <button key={s} onClick={() => setActiveStrand(s)} style={{
              padding: "5px 12px", borderRadius: "99px", border: "none",
              cursor: "pointer", fontSize: "12px", fontWeight: active ? "700" : "500",
              background: active ? (sc?.border || "#1a1a2e") : "#fff",
              color: active ? "#fff" : (sc?.text || "#6b7280"),
              boxShadow: active ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
              transition: "all 0.15s",
            }}>
              {s === "all" ? "📚 All topics" : s}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {visibleTopics.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
          <p style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</p>
          <p style={{ fontSize: "14px" }}>No formulas match "{search}"</p>
        </div>
      ) : (
        visibleTopics.map(topic => {
          const sc = STRAND_COLORS[topic.strand] || STRAND_COLORS.Statistics;
          return (
            <div key={topic.id} style={{ marginBottom: "20px" }}>
              {/* Topic header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "4px", height: "20px", background: sc.border, borderRadius: "2px" }} />
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>{topic.title}</span>
                  <span style={{
                    fontSize: "10px", fontWeight: "600", padding: "2px 7px",
                    borderRadius: "99px", background: sc.bg, color: sc.text,
                  }}>{topic.strand}</span>
                </div>
                {onNavigateToTopic && (
                  <button
                    onClick={() => onNavigateToTopic(topic.id)}
                    style={{
                      fontSize: "11px", fontWeight: "600", color: sc.border,
                      background: "none", border: `1px solid ${sc.border}40`,
                      borderRadius: "6px", padding: "3px 8px", cursor: "pointer",
                    }}
                  >
                    Go to topic →
                  </button>
                )}
              </div>

              {/* Formula cards */}
              {topic.visibleFormulas.map(f => (
                <FormulaCard
                  key={f.id}
                  formula={f}
                  strand={topic.strand}
                  topicTitle={topic.title}
                  showTopic={false}
                />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}