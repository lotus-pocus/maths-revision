import { C } from "../../../../../data/angles_data";

export default function CirclePreviewTab() {
  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.accent, margin: "0 0 6px" }}>
          🔮 Coming up — circle theorems
        </p>
        <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.7 }}>
          This is a preview of why isosceles triangles matter so much for circle theorems.
          Understanding this now will make circle theorems feel obvious rather than confusing.
        </p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "12px", padding: "14px 16px", marginBottom: "12px" }}>
        <p style={{ fontSize: "14px", fontWeight: "700", color: C.text, margin: "0 0 10px" }}>
          The key insight: two radii always make an isosceles triangle
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <svg viewBox="0 0 200 180" style={{ width: "100%", maxWidth: 200 }}>
            <circle cx={100} cy={90} r={70} fill={C.accentDim} stroke={C.accent} strokeWidth={2} />
            <circle cx={100} cy={90} r={4} fill={C.accent} />
            <text x={108} y={95} fontSize={12} fontWeight="700" fill={C.accent}>O</text>
            <line x1={100} y1={90} x2={44} y2={42} stroke={C.accent} strokeWidth={2.5} />
            <line x1={100} y1={90} x2={156} y2={42} stroke={C.accent} strokeWidth={2.5} />
            <line x1={44} y1={42} x2={156} y2={42}
              stroke={C.text} strokeWidth={2} strokeDasharray="5,3" />
            <line x1={67} y1={61} x2={73} y2={67} stroke={C.amber} strokeWidth={2} />
            <line x1={127} y1={67} x2={133} y2={61} stroke={C.amber} strokeWidth={2} />
            <text x={32} y={38} fontSize={12} fontWeight="700" fill={C.text}>A</text>
            <text x={158} y={38} fontSize={12} fontWeight="700" fill={C.text}>B</text>
            <path d="M 84 78 A 18 18 0 0 1 116 78"
              fill="none" stroke={C.accent} strokeWidth={1.5} />
          </svg>
        </div>
        {[
          { icon: "📏", text: "OA is a radius — from the centre O to point A on the circumference." },
          { icon: "📏", text: "OB is a radius — from the centre O to point B on the circumference." },
          { icon: "⚖️", text: "All radii of a circle are equal — so OA = OB always." },
          { icon: "🔺", text: "Triangle OAB has two equal sides — so it must be isosceles." },
          { icon: "✨", text: "That means angle OAB = angle OBA — the base angles are equal!" },
        ].map(({ icon, text }, i) => (
          <div key={i} style={{ display: "flex", gap: "10px",
            marginBottom: "8px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: "13px", color: C.text, margin: 0, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#fef3c7", border: "1px solid #fcd34d",
        borderRadius: "10px", padding: "12px 14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", margin: "0 0 6px" }}>
          🔑 Why this matters
        </p>
        <p style={{ fontSize: "13px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>
          Nearly every circle theorem proof uses this fact. When you see two radii drawn
          inside a circle, your first thought should always be:{" "}
          <strong>"isosceles triangle — base angles equal"</strong>.
          That one instinct will unlock most circle theorem questions.
        </p>
      </div>
    </div>
  );
}