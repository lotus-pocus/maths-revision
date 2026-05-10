import { C } from "../../../../../../data/angles_data";

// ── ReasonBadge ───────────────────────────────────────────────────────────
// Coloured pill showing an angle rule reason inline in worked steps.
export default function ReasonBadge({ text, colour = C.accent }) {
  return (
    <span style={{
      display: "inline-block", fontSize: "11px", fontWeight: "700",
      color: colour, background: colour + "18",
      border: `1px solid ${colour}40`,
      borderRadius: "6px", padding: "2px 8px", lineHeight: 1.5,
    }}>
      {text}
    </span>
  );
}