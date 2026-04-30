import { useState } from "react";
import { useUser } from "./context/UserContext";
import { useProgress } from "./context/ProgressContext";
import MathsTopicsView from "./components/MathsTopicsView";
import statistics from "./data/statistics";
import BoxPlotVisualiser from "./components/maths/statistics/boxplots";

// ── Topics that have a full interactive POC ───────────────────────────────
// Add to this map as you build new topic interactives
const INTERACTIVE_TOPICS = {
  s1: "boxplots", // Box Plots
};

// ── Tab definitions ───────────────────────────────────────────────────────
const TABS = [
  { id: "topics",     label: "Topics",     icon: "📚" },
  { id: "glossary",   label: "Glossary",   icon: "📖" },
  { id: "search",     label: "Search",     icon: "🔍" },
  { id: "about",      label: "About",      icon: "ℹ️"  },
  { id: "references", label: "References", icon: "📋" },
];

// ── User avatar button ────────────────────────────────────────────────────
function UserAvatar() {
  const { activeUser, setShowPicker } = useUser();
  if (!activeUser) return null;
  return (
    <button
      onClick={() => setShowPicker(true)}
      title="Switch user"
      style={{
        width: "34px", height: "34px", borderRadius: "50%",
        background: "#059669", color: "#fff",
        border: "2px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: "800", cursor: "pointer",
        flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}
    >
      {activeUser.displayName[0].toUpperCase()}
    </button>
  );
}

// ── Glossary tab ──────────────────────────────────────────────────────────
function GlossaryTab() {
  const allTerms = statistics
    .filter(t => t.terms)
    .flatMap(t => t.terms.map(term => ({ ...term, topicTitle: t.title, topicId: t.id })));

  const sorted = [...allTerms].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(sorted.map(t => t.term[0].toUpperCase()))];

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.6 }}>
        All key terms across your GCSE Maths topics, in alphabetical order.
      </p>
      {letters.map(letter => (
        <div key={letter} style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "800", color: "#059669", textTransform: "uppercase",
            letterSpacing: "0.1em", padding: "4px 0", borderBottom: "2px solid #059669", marginBottom: "10px" }}>
            {letter}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sorted.filter(t => t.term[0].toUpperCase() === letter).map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
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

// ── Search tab ────────────────────────────────────────────────────────────
function SearchTab() {
  const [query, setQuery] = useState("");

  const allContent = statistics.flatMap(topic => {
    const results = [];
    if (topic.terms) {
      topic.terms.forEach(t => results.push({ type: "Term", title: t.term, excerpt: t.def, topicTitle: topic.title }));
    }
    if (topic.points) {
      topic.points.forEach(p => results.push({ type: "Key point", title: topic.title, excerpt: p, topicTitle: topic.title }));
    }
    if (topic.commonMistakes) {
      topic.commonMistakes.forEach(m => results.push({ type: "Common mistake", title: topic.title, excerpt: m, topicTitle: topic.title }));
    }
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
        style={{
          width: "100%", padding: "12px 14px", borderRadius: "10px",
          border: "1.5px solid #e5e7eb", fontSize: "14px", color: "#1a1a2e",
          outline: "none", boxSizing: "border-box", marginBottom: "16px",
        }}
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
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "99px", background: tc.bg, color: tc.color }}>
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

// ── About tab ─────────────────────────────────────────────────────────────
function AboutTab() {
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div style={{ background: "#ecfdf5", border: "1px solid #059669", borderRadius: "12px", padding: "16px 18px", marginBottom: "16px" }}>
        <p style={{ fontSize: "15px", fontWeight: "800", color: "#065f46", margin: "0 0 8px" }}>GCSE Maths Revision</p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: 0, lineHeight: 1.7 }}>
          An interactive revision app for Edexcel GCSE Mathematics. Built to help students understand — not just memorise — the key topics, with real-world context, worked examples, and exam practice.
        </p>
      </div>
      {[
        { heading: "How to use this app", body: "Start with the Topics tab — find a topic you're revising and open the interactive lesson. Work through Learn first to understand the concept, then test yourself in Exam. Use the Glossary to look up any terms you're unsure about." },
        { heading: "Progress tracking", body: "Your progress is saved on this device. Tap your initial in the top corner to switch between users — useful if multiple students share a device. Exam questions track whether you got them right or needed help." },
        { heading: "Exam board", body: "All content is aligned to the Edexcel GCSE Mathematics specification (1MA1), covering both Foundation and Higher tier topics." },
      ].map(({ heading, body }) => (
        <div key={heading} style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 6px" }}>{heading}</p>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

// ── References tab ────────────────────────────────────────────────────────
function ReferencesTab() {
  const refs = [
    { label: "Edexcel GCSE Mathematics Specification (1MA1)", url: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html" },
    { label: "Edexcel GCSE Maths Past Papers", url: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.coursematerials.html" },
    { label: "Hegarty Maths", url: "https://hegartymaths.com" },
    { label: "BBC Bitesize GCSE Maths", url: "https://www.bbc.co.uk/bitesize/examspecs/z8sh242" },
    { label: "Mymaths", url: "https://www.mymaths.co.uk" },
    { label: "Corbettmaths", url: "https://corbettmaths.com" },
  ];
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.6 }}>
        Curriculum sources and recommended revision resources.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {refs.map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
              background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "10px", padding: "12px 14px",
              textDecoration: "none", color: "#1a1a2e" }}>
            <span style={{ fontSize: "13px", fontWeight: "500" }}>{label}</span>
            <span style={{ color: "#9ca3af", flexShrink: 0 }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Main AppShell ─────────────────────────────────────────────────────────
export default function AppShell() {
  const [activeTab, setActiveTab] = useState("topics");
  const [activeTopic, setActiveTopic] = useState(null); // topic interactive being viewed
  const { activeUser } = useUser();
  const { getUnderstoodTopics } = useProgress();

  const understood = getUnderstoodTopics();
  const total      = statistics.length;

  const handleLaunchTopic = (topicId) => {
    const interactive = INTERACTIVE_TOPICS[topicId];
    if (interactive) setActiveTopic(interactive);
  };

  // If a topic interactive is active, render it full screen with a back button
  if (activeTopic === "boxplots") {
    return (
      <div>
        <div style={{ padding: "12px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => setActiveTopic(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "13px",
              fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}>
            ← Topics
          </button>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>Box Plots</span>
        </div>
        <BoxPlotVisualiser />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <div style={{ background: "#fffde7", padding: "16px 16px 0", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>
              {activeUser ? `${activeUser.displayName}'s Maths Revision` : "GCSE Maths Revision"}
            </h1>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>Edexcel GCSE Mathematics</p>
          </div>
          <UserAvatar />
        </div>

        {/* Progress bar — subtle for now, ready for full display later */}
        {activeTab === "topics" && (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(understood.length / total) * 100}%`,
                background: "#059669", borderRadius: "99px", transition: "width 0.4s ease" }} />
            </div>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0", textAlign: "right" }}>
              {understood.length} of {total} topics understood
            </p>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div style={{ display: "flex", gap: "2px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "1px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: activeTab === tab.id ? "700" : "500",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#059669" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #059669" : "2px solid transparent",
                whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: "20px 16px", background: "#fffde7" }}>
        {activeTab === "topics"     && <MathsTopicsView allTopics={statistics} onLaunchTopic={handleLaunchTopic} />}
        {activeTab === "glossary"   && <GlossaryTab />}
        {activeTab === "search"     && <SearchTab />}
        {activeTab === "about"      && <AboutTab />}
        {activeTab === "references" && <ReferencesTab />}
      </div>

    </div>
  );
}