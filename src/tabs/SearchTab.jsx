import { useState } from "react";
import allTopics from "../data/allTopics";

export default function SearchTab() {
  const [query, setQuery] = useState("");

  const allContent = allTopics.flatMap(topic => {
    const results = [];
    if (topic.terms)
      topic.terms.forEach(t => results.push({ type: "Term", title: t.term, excerpt: t.def, topicTitle: topic.title }));
    if (topic.points)
      topic.points.forEach(p => results.push({ type: "Key point", title: topic.title, excerpt: p, topicTitle: topic.title }));
    if (topic.commonMistakes)
      topic.commonMistakes.forEach(m => results.push({ type: "Common mistake", title: topic.title, excerpt: m, topicTitle: topic.title }));
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

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <input
        autoFocus
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search terms, concepts, topics..."
        style={{ width: "100%", padding: "12px 14px", borderRadius: "10px",
          border: "1.5px solid #e5e7eb", fontSize: "14px", color: "#1a1a2e",
          outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
      />
      {query.trim().length > 1 && (
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
          {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
        </p>
      )}
      {query.trim().length > 1 && results.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", marginTop: "32px" }}>
          Nothing found — try a different term
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {results.map((r, i) => {
          const tc = TYPE_COLORS[r.type] || { bg: "#f3f4f6", color: "#374151" };
          return (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e7eb",
              borderRadius: "10px", padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 7px",
                  borderRadius: "99px", background: tc.bg, color: tc.color }}>
                  {r.type}
                </span>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>{r.topicTitle}</span>
              </div>
              {r.type === "Term" && (
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#1a1a2e" }}>{r.title} — </span>
              )}
              <span style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>{r.excerpt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}