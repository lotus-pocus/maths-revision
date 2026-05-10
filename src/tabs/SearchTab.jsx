import { useState } from "react";
import allTopics from "../data/allTopics";

// ── SearchTab ─────────────────────────────────────────────────────────────
// onGoToTopic(topicId) — called when user taps a result link.
// AppShell wires this to switch tab + launch interactive if one exists.
export default function SearchTab({ onGoToTopic }) {
  const [query, setQuery] = useState("");

  const allContent = allTopics.flatMap(topic => {
    const results = [];
    if (topic.terms)
      topic.terms.forEach(t => results.push({
        type: "Term", title: t.term, excerpt: t.def,
        topicTitle: topic.title, topicId: topic.id,
      }));
    if (topic.points)
      topic.points.forEach(p => results.push({
        type: "Key point", title: topic.title, excerpt: p,
        topicTitle: topic.title, topicId: topic.id,
      }));
    if (topic.commonMistakes)
      topic.commonMistakes.forEach(m => results.push({
        type: "Common mistake", title: topic.title, excerpt: m,
        topicTitle: topic.title, topicId: topic.id,
      }));
    return results;
  });

  const results = query.trim().length > 1
    ? allContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const TYPE_COLORS = {
    "Term":           { bg: "#ecfdf5", color: "#065f46" },
    "Key point":      { bg: "#eff6ff", color: "#1e40af" },
    "Common mistake": { bg: "#fef2f2", color: "#991b1b" },
  };

  // Group results by topic so each topic appears once with all its hits
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.topicId]) acc[r.topicId] = { topicTitle: r.topicTitle, topicId: r.topicId, hits: [] };
    acc[r.topicId].hits.push(r);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <input
        autoFocus
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search terms, concepts, topics..."
        style={{
          width: "100%", padding: "12px 14px", borderRadius: "10px",
          border: "1.5px solid #e5e7eb", fontSize: "14px", color: "#1a1a2e",
          outline: "none", boxSizing: "border-box", marginBottom: "16px",
        }}
      />

      {query.trim().length > 1 && (
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
          {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          {groups.length > 0 && ` across ${groups.length} topic${groups.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {query.trim().length > 1 && results.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", marginTop: "32px" }}>
          Nothing found — try a different term
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {groups.map(group => {
          const topic = allTopics.find(t => t.id === group.topicId);
          const hasInteractive = ["s1", "g1"].includes(group.topicId); // keep in sync with AppShell

          return (
            <div key={group.topicId} style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: "12px", overflow: "hidden",
            }}>
              {/* Topic header with link */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px",
                background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
              }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>
                  {group.topicTitle}
                </span>
                {onGoToTopic && (
                  <button
                    onClick={() => onGoToTopic(group.topicId)}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "5px 12px", borderRadius: "99px", border: "none",
                      background: hasInteractive ? "#2563eb" : "#1a1a2e",
                      color: "#fff", fontSize: "11px", fontWeight: "700",
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    {hasInteractive ? "Open interactive →" : "Go to topic →"}
                  </button>
                )}
              </div>

              {/* Result hits */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {group.hits.map((r, i) => {
                  const tc = TYPE_COLORS[r.type] || { bg: "#f3f4f6", color: "#374151" };
                  return (
                    <div key={i} style={{
                      padding: "10px 14px",
                      borderBottom: i < group.hits.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}>
                      <div style={{ marginBottom: "3px" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: "700", padding: "2px 7px",
                          borderRadius: "99px", background: tc.bg, color: tc.color,
                        }}>
                          {r.type}
                        </span>
                      </div>
                      {r.type === "Term" && (
                        <span style={{ fontWeight: "700", fontSize: "13px", color: "#1a1a2e" }}>
                          {r.title} —{" "}
                        </span>
                      )}
                      <span style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                        {r.excerpt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}