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

// ── Filter pill bar ───────────────────────────────────────────────────────
const FILTERS = [
  { id: "all",         label: "All Topics",       icon: "📚" },
  { id: "non-calc",    label: "Non-Calculator",   icon: "✏️"  },
  { id: "calc",        label: "Calculator",       icon: "🔢" },
  { id: "foundation",  label: "Foundation Tier",  icon: "🟢" },
  { id: "higher",      label: "Higher Tier",      icon: "⭐" },
  { id: "paper1",      label: "Paper 1",          icon: "1️⃣"  },
  { id: "paper2",      label: "Paper 2 & 3",      icon: "2️⃣"  },
];

function FilterPills({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap",
      paddingBottom: "4px", marginBottom: "16px" }}>
      {FILTERS.map(f => (
        <button key={f.id} onClick={() => onChange(f.id)}
          style={{ padding: "6px 14px", borderRadius: "99px", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: active === f.id ? "700" : "500",
            background: active === f.id ? "#1a1a2e" : "#fff",
            color: active === f.id ? "#fff" : "#6b7280",
            boxShadow: active === f.id ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
          {f.icon} {f.label}
        </button>
      ))}
    </div>
  );
}

function applyFilter(topics, filter) {
  if (filter === "all")      return topics;
  if (filter === "non-calc")   return topics.filter(t => t.calculator === "non-calc" || t.calculator === "both");
  if (filter === "calc")       return topics.filter(t => t.calculator === "calc"     || t.calculator === "both");
  if (filter === "foundation") return topics.filter(t => t.tier === "foundation"     || t.tier === "both");
  if (filter === "higher")     return topics.filter(t => t.tier === "higher"         || t.tier === "both");
  if (filter === "paper1")   return topics.filter(t => t.papers?.includes(1));
  if (filter === "paper2")   return topics.filter(t => t.papers?.includes(2));
  return topics;
}
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

      {/* Origin story */}
      <div style={{ background: "#ecfdf5", border: "1px solid #059669", borderRadius: "12px", padding: "16px 18px", marginBottom: "14px" }}>
        <p style={{ fontSize: "15px", fontWeight: "800", color: "#065f46", margin: "0 0 10px" }}>
          Why does this exist? 📖
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: "0 0 10px", lineHeight: 1.8 }}>
          My daughter came home from school with a practice paper she'd printed out in the library. She was stuck on a box plot question. She asked her teacher, who scribbled something barely legible on the paper and moved on.
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: "0 0 10px", lineHeight: 1.8 }}>
          That was the moment I decided to build something better. Not just an answer, but something that actually explains <em>why</em>, shows real-world context, and lets you practise until it clicks.
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: 0, lineHeight: 1.8 }}>
          It started with box plots. I'm building it out topic by topic to cover the full Edexcel GCSE Maths specification. It's a work in progress, but hopefully already more useful than a scribble on a page. 😅
        </p>
      </div>

      {/* Open invitation */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.8 }}>
          If you've found your way here and it's useful for your own revision, that's brilliant, please help yourself. Good luck in your exams. 🌟
        </p>
      </div>

      {/* How to use */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📱 How to use this app</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.8 }}>
          Pick a topic from the Topics tab and open the interactive lesson. Work through <strong>Learn</strong> first to understand the concept, then test yourself in <strong>Exam</strong>. Use the <strong>Glossary</strong> to look up terms. Your progress is saved on this device, tap your initial in the corner to switch between users if you're sharing with someone else.
        </p>
      </div>

      {/* Exam board */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📋 Exam board</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.8 }}>
          All content is aligned to the <strong>Edexcel GCSE Mathematics specification (1MA1)</strong>, covering both Foundation and Higher tier. Questions are written in Edexcel style, the same structure and wording you'll see in the real exam.
        </p>
      </div>

      {/* Who made this */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>👨‍💻 Who made this?</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 10px", lineHeight: 1.8 }}>
          I work at <a href="https://www.gamoola.com" target="_blank" rel="noopener noreferrer" style={{ color: "#059669", fontWeight: "600" }}>Gamoola</a> - a small creative studio building interactive digital experiences for universities and businesses. We built things like a{" "}
          <a href="https://www.gamoola.com/projects/vr-bioscience/" target="_blank" rel="noopener noreferrer" style={{ color: "#059669", fontWeight: "600" }}>VR Bioscience app for Coventry University</a>.
          This maths app is a personal project, not a commercial one.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a href="https://gamoola.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "13px", color: "#059669", fontWeight: "600", textDecoration: "none" }}>
            🌐 gamoola.com
          </a>
          <a href="mailto:lotus@gamoola.com"
            style={{ fontSize: "13px", color: "#059669", fontWeight: "600", textDecoration: "none" }}>
            📧 lotus@gamoola.com
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📋 Disclaimer</p>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.8 }}>
          This app was created for personal, non-commercial use to support one student's GCSE revision. It is not affiliated with or endorsed by Edexcel or Pearson. If you are the owner of any content featured here and would like it removed, please get in touch at{" "}
          <a href="mailto:lotus@gamoola.com" style={{ color: "#6b7280" }}>lotus@gamoola.com</a>.
        </p>
      </div>

      <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", marginTop: "8px" }}>
        Built with ❤️ for Scarlett — good luck in your exams! 🌟
      </p>

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
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
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
        {activeTab === "topics"     && <>
          <FilterPills active={activeFilter} onChange={setActiveFilter} />
          <MathsTopicsView allTopics={applyFilter(statistics, activeFilter)} onLaunchTopic={handleLaunchTopic} />
        </>}
        {activeTab === "glossary"   && <GlossaryTab />}
        {activeTab === "search"     && <SearchTab />}
        {activeTab === "about"      && <AboutTab />}
        {activeTab === "references" && <ReferencesTab />}
      </div>

    </div>
  );
}