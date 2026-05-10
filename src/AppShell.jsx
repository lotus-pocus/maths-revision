import { useState } from "react";
import { useUser }     from "./context/UserContext";
import { useProgress } from "./context/ProgressContext";
import MathsTopicsView   from "./components/MathsTopicsView";
import allTopics         from "./data/allTopics";
import BoxPlotVisualiser from "./components/maths/statistics/boxplots";
import AnglesVisualiser  from "./components/maths/geometry/angles/angles_index";
import GlossaryTab   from "./tabs/GlossaryTab";
import SearchTab     from "./tabs/SearchTab";
import AboutTab      from "./tabs/AboutTab";
import ReferencesTab from "./tabs/ReferencesTab";

// ── Which topic IDs have a full interactive ───────────────────────────────
const INTERACTIVE_TOPICS = {
  s1: "boxplots",
  g1: "angles",
};

// ── App-level tab definitions ─────────────────────────────────────────────
const TABS = [
  { id: "topics",     label: "Topics",     icon: "📚" },
  { id: "glossary",   label: "Glossary",   icon: "📖" },
  { id: "search",     label: "Search",     icon: "🔍" },
  { id: "about",      label: "About",      icon: "ℹ️"  },
  { id: "references", label: "References", icon: "📋" },
];

// ── Filter definitions ────────────────────────────────────────────────────
const FILTERS = [
  { id: "all",        label: "All Topics",      icon: "📚" },
  { id: "non-calc",   label: "Non-Calculator",  icon: "✏️"  },
  { id: "calc",       label: "Calculator",      icon: "🔢" },
  { id: "foundation", label: "Foundation Tier", icon: "🟢" },
  { id: "higher",     label: "Higher Tier",     icon: "⭐" },
  { id: "paper1",     label: "Paper 1",         icon: "1️⃣"  },
  { id: "paper2",     label: "Paper 2 & 3",     icon: "2️⃣"  },
];

function applyFilter(topics, filter) {
  if (filter === "all")        return topics;
  if (filter === "non-calc")   return topics.filter(t => t.calculator === "non-calc" || t.calculator === "both");
  if (filter === "calc")       return topics.filter(t => t.calculator === "calc"     || t.calculator === "both");
  if (filter === "foundation") return topics.filter(t => t.tier === "foundation"     || t.tier === "both");
  if (filter === "higher")     return topics.filter(t => t.tier === "higher"         || t.tier === "both");
  if (filter === "paper1")     return topics.filter(t => t.papers?.includes(1));
  if (filter === "paper2")     return topics.filter(t => t.papers?.includes(2));
  return topics;
}

function FilterPills({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap",
      paddingBottom: "4px", marginBottom: "16px" }}>
      {FILTERS.map(f => (
        <button key={f.id} onClick={() => onChange(f.id)}
          style={{ padding: "6px 14px", borderRadius: "99px", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: active === f.id ? "700" : "500",
            background: active === f.id ? "#1a1a2e" : "#fff",
            color:      active === f.id ? "#fff"    : "#6b7280",
            boxShadow: active === f.id ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
          {f.icon} {f.label}
        </button>
      ))}
    </div>
  );
}

function UserAvatar() {
  const { activeUser, setShowPicker } = useUser();
  if (!activeUser) return null;
  return (
    <button onClick={() => setShowPicker(true)} title="Switch user"
      style={{ width: "34px", height: "34px", borderRadius: "50%",
        background: "#059669", color: "#fff", border: "2px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: "800", cursor: "pointer",
        flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
      {activeUser.displayName[0].toUpperCase()}
    </button>
  );
}

// ── Full-screen topic shell (header bar + visualiser) ─────────────────────
function TopicShell({ title, onBack, children }) {
  return (
    <div>
      <div style={{ padding: "12px 16px", background: "#fff",
        borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center",
        gap: "12px", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: "13px", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "4px", padding: 0 }}>
          ← Topics
        </button>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Main AppShell ─────────────────────────────────────────────────────────
export default function AppShell() {
  const [activeTab,    setActiveTab]    = useState("topics");
  const [activeTopic,  setActiveTopic]  = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { activeUser }          = useUser();
  const { getUnderstoodTopics } = useProgress();

  const understood = getUnderstoodTopics();
  const total      = allTopics.length;

  const handleLaunchTopic = (topicId) => {
    const interactive = INTERACTIVE_TOPICS[topicId];
    if (interactive) setActiveTopic(interactive);
  };

  // ── Called from SearchTab when user taps a result link ────────────────
  // If the topic has a full interactive, launch it directly.
  // Otherwise, switch to the Topics tab so the user can find it.
  const handleGoToTopic = (topicId) => {
    const interactive = INTERACTIVE_TOPICS[topicId];
    if (interactive) {
      setActiveTopic(interactive);
    } else {
      setActiveTab("topics");
    }
  };

  // ── Full-screen topic interactives ────────────────────────────────────
  if (activeTopic === "boxplots") {
    return (
      <TopicShell title="Box Plots" onBack={() => setActiveTopic(null)}>
        <BoxPlotVisualiser />
      </TopicShell>
    );
  }

  if (activeTopic === "angles") {
    return (
      <TopicShell title="Angle Rules" onBack={() => setActiveTopic(null)}>
        <AnglesVisualiser />
      </TopicShell>
    );
  }

  // ── Main app shell ────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", minHeight: "100vh",
      display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "#fffde7", padding: "16px 16px 0",
        borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: 0 }}>
              {activeUser ? `${activeUser.displayName}'s Maths Revision` : "GCSE Maths Revision"}
            </h1>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>
              Edexcel GCSE Mathematics
            </p>
          </div>
          <UserAvatar />
        </div>

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

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "2px", overflowX: "auto",
          scrollbarWidth: "none", paddingBottom: "1px" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "8px 14px", borderRadius: "8px 8px 0 0",
                border: "none", cursor: "pointer", fontSize: "13px",
                fontWeight: activeTab === tab.id ? "700" : "500",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#059669" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #059669" : "2px solid transparent",
                whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 16px", background: "#fffde7" }}>
        {activeTab === "topics" && <>
          <FilterPills active={activeFilter} onChange={setActiveFilter} />
          <MathsTopicsView
            allTopics={applyFilter(allTopics, activeFilter)}
            onLaunchTopic={handleLaunchTopic}
          />
        </>}
        {activeTab === "glossary"   && <GlossaryTab />}
        {activeTab === "search"     && <SearchTab onGoToTopic={handleGoToTopic} />}
        {activeTab === "about"      && <AboutTab />}
        {activeTab === "references" && <ReferencesTab />}
      </div>

    </div>
  );
}