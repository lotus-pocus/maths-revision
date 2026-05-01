import { useState } from "react";
import { useProgress } from "../context/ProgressContext";
import { useUser } from "../context/UserContext";
import HospitalExplainer from "./maths/statistics/boxplots/learn/HospitalExplainer";

const STRAND_COLORS = {
  Statistics:  { border: "#059669", bg: "#ecfdf5", text: "#065f46" },
  Geometry:    { border: "#2563eb", bg: "#eff6ff", text: "#1e40af" },
  Algebra:     { border: "#7c3aed", bg: "#f5f3ff", text: "#4c1d95" },
  Number:      { border: "#d97706", bg: "#fffbeb", text: "#78350f" },
  Probability: { border: "#db2777", bg: "#fdf2f8", text: "#831843" },
  Ratio:       { border: "#0891b2", bg: "#ecfeff", text: "#164e63" },
};

const TIER_BADGE = {
  both:       { label: "Foundation & Higher", bg: "#f3f4f6", color: "#374151" },
  higher:     { label: "Higher only",          bg: "#fef3c7", color: "#92400e" },
  foundation: { label: "Foundation only",      bg: "#ede9fe", color: "#4c1d95" },
};

function Badge({ label, bg, color }) {
  return (
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: bg, color, fontWeight: "500" }}>
      {label}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", marginBottom: "10px", marginTop: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </h3>
  );
}

function TopicCard({ topic, onSelect, understood }) {
  const sc = STRAND_COLORS[topic.strand] || STRAND_COLORS.Statistics;
  const tb = TIER_BADGE[topic.tier]      || TIER_BADGE.both;
  return (
    <button
      onClick={() => onSelect(topic.id)}
      style={{
        display: "flex", gap: "14px", alignItems: "flex-start",
        padding: "14px", background: understood ? "#f0fdf4" : "#ffffff",
        border: "0.5px solid #e5e7eb", borderRadius: "12px",
        cursor: "pointer", textAlign: "left", width: "100%",
        borderLeft: `4px solid ${sc.border}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "600", fontSize: "15px", color: "#1a1a2e" }}>{topic.title}</span>
          <Badge label={topic.strand} bg={sc.bg} color={sc.text} />
          <Badge label={tb.label}    bg={tb.bg}  color={tb.color} />
          {understood && <Badge label="✓ Understood" bg="#dcfce7" color="#15803d" />}
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
          {topic.realWorldHook.slice(0, 100)}…
        </p>
      </div>
      <span style={{ fontSize: "18px", color: "#9ca3af", flexShrink: 0, marginTop: "2px" }}>→</span>
    </button>
  );
}

function WorkedExample({ example }) {
  const [openStep, setOpenStep] = useState(null);
  if (!example) return null;
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginTop: "8px" }}>
      <p style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "6px" }}>{example.title}</p>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px" }}>{example.intro}</p>
      {example.data && (
        <div style={{ background: "#e0f2fe", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", fontWeight: "500", color: "#0c4a6e", marginBottom: "12px" }}>
          📊 Data: {example.data}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {example.steps.map((s) => (
          <div key={s.step} style={{ border: "0.5px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
            <button onClick={() => setOpenStep(openStep === s.step ? null : s.step)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: openStep === s.step ? "#1a1a2e" : "#ffffff", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: "13px", fontWeight: "500", color: openStep === s.step ? "#ffffff" : "#1a1a2e" }}>
                Step {s.step}: {s.instruction}
              </span>
              <span style={{ color: openStep === s.step ? "#ffffff" : "#9ca3af", fontSize: "16px" }}>
                {openStep === s.step ? "▲" : "▼"}
              </span>
            </button>
            {openStep === s.step && (
              <div style={{ padding: "12px 14px", background: "#fafafa", borderTop: "0.5px solid #e5e7eb" }}>
                <pre style={{ fontFamily: "inherit", fontSize: "13px", color: "#1a1a2e", whiteSpace: "pre-wrap", margin: "0 0 8px" }}>{s.working}</pre>
                {s.tip && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#78350f" }}>
                    💡 {s.tip}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicDetail({ topic, onBack, onLaunchInteractive }) {
  const { isTopicUnderstood, markTopicUnderstood, unmarkTopicUnderstood } = useProgress();
  const understood = isTopicUnderstood(topic.id);
  const sc = STRAND_COLORS[topic.strand] || STRAND_COLORS.Statistics;
  const tb = TIER_BADGE[topic.tier]      || TIER_BADGE.both;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: "3rem" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>
        ← Back to topics
      </button>
      <div style={{ borderLeft: `4px solid ${sc.border}`, paddingLeft: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
          <Badge label={topic.strand} bg={sc.bg} color={sc.text} />
          <Badge label={tb.label}    bg={tb.bg}  color={tb.color} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "4px 0" }}>{topic.title}</h2>
      </div>

      {onLaunchInteractive && (
        <button onClick={onLaunchInteractive}
          style={{ width: "100%", padding: "14px", marginBottom: "20px", background: sc.border, color: "#fff",
            border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          🚀 Launch interactive lesson
        </button>
      )}

      <div style={{ background: sc.bg, border: `1px solid ${sc.border}30`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: sc.text, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>🌍 Why does this matter?</p>
        <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: 1.6 }}>{topic.realWorldHook}</p>
      </div>

      {topic.whyItMatters && (
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "16px" }}>{topic.whyItMatters}</p>
      )}

      {topic.id === "s1" && (
        <div style={{ marginBottom: "8px" }}>
          <HospitalExplainer />
        </div>
      )}

      {topic.points && (
        <>
          <SectionHeading>Key Points</SectionHeading>
          <ul style={{ paddingLeft: "18px", margin: "0 0 8px" }}>
            {topic.points.map((p, i) => (
              <li key={i} style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, marginBottom: "6px" }}>{p}</li>
            ))}
          </ul>
        </>
      )}

      {topic.workedExample && (
        <>
          <SectionHeading>Worked Example</SectionHeading>
          <WorkedExample example={topic.workedExample} />
        </>
      )}

      {topic.comparingBoxPlots && (
        <>
          <SectionHeading>Comparing Box Plots</SectionHeading>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px" }}>
            <p style={{ fontSize: "13px", color: "#4b5563", marginBottom: "10px" }}>{topic.comparingBoxPlots.intro}</p>
            <ul style={{ paddingLeft: "18px", margin: 0 }}>
              {topic.comparingBoxPlots.points.map((p, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, marginBottom: "6px" }}>{p}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {topic.terms && (
        <>
          <SectionHeading>Key Terms</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
            {topic.terms.map((t) => (
              <div key={t.term} style={{ background: "#ffffff", border: "0.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px" }}>
                <span style={{ fontWeight: "600", fontSize: "13px", color: "#1a1a2e" }}>{t.term}</span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}> — {t.def}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {topic.commonMistakes && (
        <>
          <SectionHeading>Common Mistakes to Avoid</SectionHeading>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 16px" }}>
            <ul style={{ paddingLeft: "18px", margin: 0 }}>
              {topic.commonMistakes.map((m, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#991b1b", lineHeight: 1.7, marginBottom: "6px" }}>{m}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {topic.examTip && (
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px 16px", marginTop: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#78350f", marginBottom: "4px" }}>⭐ Exam Tip</p>
          <p style={{ fontSize: "13px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>{topic.examTip}</p>
        </div>
      )}

      <button
        onClick={() => understood ? unmarkTopicUnderstood(topic.id) : markTopicUnderstood(topic.id)}
        style={{
          marginTop: "24px", width: "100%", padding: "14px",
          background: understood ? "#dcfce7" : "#1a1a2e",
          color: understood ? "#15803d" : "#ffffff",
          border: understood ? "1px solid #86efac" : "none",
          borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
        }}
      >
        {understood ? "✓ Marked as understood — tap to undo" : "Mark as understood"}
      </button>
    </div>
  );
}

export default function MathsTopicsView({ allTopics, onLaunchTopic }) {
  const [selectedId, setSelectedId] = useState(null);
  const { isTopicUnderstood, getUnderstoodTopics } = useProgress();
  const { activeUser } = useUser();

  const understood = getUnderstoodTopics();
  const selected   = allTopics.find((t) => t.id === selectedId);
  const total      = allTopics.length;
  const done       = understood.length;

  if (selected) {
    return (
      <TopicDetail
        topic={selected}
        onBack={() => setSelectedId(null)}
        onLaunchInteractive={onLaunchTopic ? () => onLaunchTopic(selected.id) : null}
      />
    );
  }

  const strands = [...new Set(allTopics.map((t) => t.strand))];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: "2rem" }}>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px", lineHeight: 1.5 }}>
        {activeUser ? `${activeUser.displayName} — ` : ""}{done} of {total} topics marked as understood
      </p>
      <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "99px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: "#059669", borderRadius: "99px", transition: "width 0.4s ease" }} />
      </div>
      {strands.map((strand) => {
        const sc = STRAND_COLORS[strand] || STRAND_COLORS.Statistics;
        const strandTopics = allTopics.filter((t) => t.strand === strand);
        const strandDone   = strandTopics.filter((t) => isTopicUnderstood(t.id)).length;
        return (
          <div key={strand} style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: sc.border }} />
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                {strand}
              </h3>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>{strandDone}/{strandTopics.length} understood</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {strandTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} onSelect={setSelectedId} understood={isTopicUnderstood(topic.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}