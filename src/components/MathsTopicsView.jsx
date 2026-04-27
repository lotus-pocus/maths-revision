import { useState } from "react";

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

// ── Small reusable pieces ──────────────────────────────────────────────────

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

// ── Topic list card ────────────────────────────────────────────────────────

function TopicCard({ topic, onSelect, done, onMarkDone }) {
  const sc = STRAND_COLORS[topic.strand] || STRAND_COLORS.Statistics;
  const tb = TIER_BADGE[topic.tier]   || TIER_BADGE.both;
  return (
    <button
      onClick={() => onSelect(topic.id)}
      style={{
        display: "flex", gap: "14px", alignItems: "flex-start",
        padding: "14px", background: done ? "#f0fdf4" : "#ffffff",
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
          {done && <Badge label="✓ Done" bg="#dcfce7" color="#15803d" />}
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
          {topic.realWorldHook.slice(0, 100)}…
        </p>
      </div>
      <span style={{ fontSize: "18px", color: "#9ca3af", flexShrink: 0, marginTop: "2px" }}>→</span>
    </button>
  );
}

// ── Worked example steps ───────────────────────────────────────────────────

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
            <button
              onClick={() => setOpenStep(openStep === s.step ? null : s.step)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: openStep === s.step ? "#1a1a2e" : "#ffffff", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: "13px", fontWeight: "500", color: openStep === s.step ? "#ffffff" : "#1a1a2e" }}>
                Step {s.step}: {s.instruction}
              </span>
              <span style={{ color: openStep === s.step ? "#ffffff" : "#9ca3af", fontSize: "16px" }}>
                {openStep === s.step ? "▲" : "▼"}
              </span>
            </button>
            {openStep === s.step && (
              <div style={{ padding: "12px 14px", background: "#fafafa", borderTop: "0.5px solid #e5e7eb" }}>
                <pre style={{ fontFamily: "inherit", fontSize: "13px", color: "#1a1a2e", whiteSpace: "pre-wrap", margin: "0 0 8px" }}>
                  {s.working}
                </pre>
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

// ── Full topic detail view ─────────────────────────────────────────────────

function TopicDetail({ topic, onBack, done, onMarkDone }) {
  const sc = STRAND_COLORS[topic.strand] || STRAND_COLORS.Statistics;
  const tb = TIER_BADGE[topic.tier]     || TIER_BADGE.both;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Back button */}
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>
        ← Back to topics
      </button>

      {/* Header */}
      <div style={{ borderLeft: `4px solid ${sc.border}`, paddingLeft: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
          <Badge label={topic.strand} bg={sc.bg} color={sc.text} />
          <Badge label={tb.label}    bg={tb.bg}  color={tb.color} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "4px 0" }}>{topic.title}</h2>
      </div>

      {/* Real world hook */}
      <div style={{ background: `${sc.bg}`, border: `1px solid ${sc.border}30`, borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: sc.text, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>🌍 Why does this matter?</p>
        <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: 1.6 }}>{topic.realWorldHook}</p>
      </div>

      {/* Why it matters */}
      {topic.whyItMatters && (
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "16px" }}>{topic.whyItMatters}</p>
      )}

      {/* Key points */}
      <SectionHeading>Key Points</SectionHeading>
      <ul style={{ paddingLeft: "18px", margin: "0 0 8px" }}>
        {topic.points.map((p, i) => (
          <li key={i} style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, marginBottom: "6px" }}>{p}</li>
        ))}
      </ul>

      {/* Worked example */}
      {topic.workedExample && (
        <>
          <SectionHeading>Worked Example</SectionHeading>
          <WorkedExample example={topic.workedExample} />
        </>
      )}

      {/* Comparing box plots (s1 specific extra section) */}
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

      {/* Key terms */}
      <SectionHeading>Key Terms</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
        {topic.terms.map((t) => (
          <div key={t.term} style={{ background: "#ffffff", border: "0.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px" }}>
            <span style={{ fontWeight: "600", fontSize: "13px", color: "#1a1a2e" }}>{t.term}</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}> — {t.def}</span>
          </div>
        ))}
      </div>

      {/* Common mistakes */}
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

      {/* Exam tip */}
      <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px 16px", marginTop: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "#78350f", marginBottom: "4px" }}>⭐ Exam Tip</p>
        <p style={{ fontSize: "13px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>{topic.examTip}</p>
      </div>

      {/* Mark done button */}
      <button
        onClick={() => onMarkDone(topic.id)}
        style={{
          marginTop: "24px", width: "100%", padding: "14px",
          background: done ? "#dcfce7" : "#1a1a2e",
          color: done ? "#15803d" : "#ffffff",
          border: done ? "1px solid #86efac" : "none",
          borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
        }}
      >
        {done ? "✓ Marked as understood" : "Mark as understood"}
      </button>
    </div>
  );
}

// ── Main exported component ────────────────────────────────────────────────

const STORAGE_KEY = "maths_topics_done_v1";

function loadDone() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveDone(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function MathsTopicsView({ allTopics }) {
  const [selectedId, setSelectedId] = useState(null);
  const [done, setDone]             = useState(loadDone);

  const markDone = (id) => {
    setDone((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveDone(next);
      return next;
    });
  };

  const selected = allTopics.find((t) => t.id === selectedId);

  if (selected) {
    return (
      <TopicDetail
        topic={selected}
        onBack={() => setSelectedId(null)}
        done={done.includes(selected.id)}
        onMarkDone={markDone}
      />
    );
  }

  // Group topics by strand for the list view
  const strands = [...new Set(allTopics.map((t) => t.strand))];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: "2rem" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>Maths Topics</h2>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.5 }}>
        {done.length} of {allTopics.length} topics marked as understood
      </p>

      {/* Progress bar */}
      <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "99px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(done.length / allTopics.length) * 100}%`, background: "#059669", borderRadius: "99px", transition: "width 0.4s ease" }} />
      </div>

      {/* Topics grouped by strand */}
      {strands.map((strand) => {
        const sc = STRAND_COLORS[strand] || STRAND_COLORS.Statistics;
        const strandTopics = allTopics.filter((t) => t.strand === strand);
        return (
          <div key={strand} style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: sc.border }} />
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                {strand}
              </h3>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                {strandTopics.filter((t) => done.includes(t.id)).length}/{strandTopics.length} done
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {strandTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onSelect={setSelectedId}
                  done={done.includes(topic.id)}
                  onMarkDone={markDone}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}