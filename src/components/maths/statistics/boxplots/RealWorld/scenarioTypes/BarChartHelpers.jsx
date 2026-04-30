import { useState } from "react";
import { C } from "../../data";
import GlossaryTerm from "../../GlossaryTerm";

// ── Bar chart SVG ─────────────────────────────────────────────────────────
export function BarChartSVG({ rows, color }) {
  const W = 520, H = 250;
  const padL = 38, padR = 20, padT = 24, padB = 58;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxFreq = Math.max(...rows.map((r) => r.freq), 1);
  const barW = plotW / rows.length;
  const toY = (f) => padT + plotH - (f / maxFreq) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
      {[0, 2, 4, 6, 8].map((f) => (
        <line key={f} x1={padL} y1={toY(f)} x2={W - padR} y2={toY(f)}
          stroke={C.border} strokeWidth="1" strokeDasharray="3,4" />
      ))}
      {rows.map((row, i) => {
        const x = padL + i * barW;
        const y = toY(row.freq);
        const h = padT + plotH - y;
        return (
          <g key={row.interval}>
            {h > 0 && (
              <rect x={x + 2} y={y} width={barW - 4} height={h}
                fill={color} opacity="0.75" rx="3" />
            )}
            {row.freq > 0 && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                fill={color} fontSize="9" fontWeight="800">
                {row.freq}
              </text>
            )}
            <text x={x + barW / 2} y={padT + plotH + 16} textAnchor="middle"
              fill={C.muted} fontSize="8">
              {row.interval}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={C.text} />
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={C.text} />
      <text x="14" y={padT + plotH / 2} textAnchor="middle" fill={C.muted} fontSize="10"
        transform={`rotate(-90, 14, ${padT + plotH / 2})`}>
        Frequency
      </text>
      <text x={W / 2} y={H - 8} textAnchor="middle" fill={C.muted} fontSize="10">
        Height range (cm)
      </text>
    </svg>
  );
}

// ── Toggle between Fertiliser A and B ────────────────────────────────────
export function ToggleButtons({ active, setActive }) {
  return (
    <div style={{ display: "flex", gap: "6px", margin: "14px 0",
      background: C.surface, borderRadius: "10px", padding: "4px",
      border: `1px solid ${C.border}` }}>
      {["A", "B"].map((f) => (
        <button key={f} onClick={() => setActive(f)}
          style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none",
            cursor: "pointer",
            background: active === f ? (f === "A" ? C.accent : C.amber) : "transparent",
            color: active === f ? "#fff" : C.muted,
            fontWeight: "800" }}>
          Fertiliser {f}
        </button>
      ))}
    </div>
  );
}

// ── Collapsible raw heights list ──────────────────────────────────────────
export function RawHeightsDropdown({ label, data, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: "14px" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "12px 14px",
          background: open ? `${color}14` : C.surface,
          border: `1px solid ${open ? color : C.border}`,
          borderRadius: "10px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          textAlign: "left" }}>
        <div>
          <p style={{ fontSize: "13px", fontWeight: "800", color, margin: 0 }}>
            Show the actual plant heights behind this chart
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>
            These are the 30 height measurements used to make the graph.
          </p>
        </div>
        <span style={{ fontSize: "12px", color: C.muted }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>
      {open && (
        <div style={{ marginTop: "8px", background: C.card, border: `1px solid ${C.border}`,
          borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.6, margin: "0 0 12px" }}>
            <strong>{label}:</strong> each number below is one plant's height in cm.
            The bar chart groups these heights into ranges, but this list shows the actual measurements.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.map((v, i) => (
              <div key={i} style={{ width: "42px", height: "42px", borderRadius: "8px",
                border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "12px", fontWeight: "700",
                color: C.text, background: "#fff" }}>
                {v}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sorted data strip with Q1/Median/Q3 highlighted ───────────────────────
export function SortedDataStrip({ label, data, color }) {
  const n = data.length;
  const Q1_IDX  = 7;
  const MED_L   = 14;
  const MED_R   = 15;
  const Q3_IDX  = 22;

  const getTag = (i) => {
    if (i === 0)     return "Min";
    if (i === Q1_IDX)  return "Q1";
    if (i === MED_L || i === MED_R) return "Med";
    if (i === Q3_IDX)  return "Q3";
    if (i === n - 1) return "Max";
    return null;
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: "800", color, margin: "0 0 8px" }}>
        {label} — sorted plant heights
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {data.map((v, i) => {
          const tag = getTag(i);
          return (
            <div key={i} style={{ minWidth: "44px", minHeight: "50px", borderRadius: "8px",
              border: `1.5px solid ${tag ? color : C.border}`,
              background: tag ? `${color}16` : "#fff",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "4px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: tag ? color : C.text }}>
                {v}
              </span>
              <span style={{ fontSize: "8px", color: C.muted }}>#{i + 1}</span>
              {tag && (
                <span style={{ fontSize: "8px", fontWeight: "800", color }}>{tag}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step-by-step how values are found ────────────────────────────────────
export function HowValuesAreFound({ label, data, color }) {
  const min    = data[0];
  const q1     = data[7];
  const medA   = data[14];
  const medB   = data[15];
  const median = (medA + medB) / 2;
  const q3     = data[22];
  const max    = data[data.length - 1];

  const rows = [
    { label: "Minimum", text: `First value in the sorted list = ${min} cm` },
    { label: "Q1",      text: `There are 30 plants. 1/4 × 30 = 7.5, so round up to the 8th value = ${q1} cm` },
    { label: "Median",  text: `There are 30 plants, so use the 15th and 16th values. (${medA} + ${medB}) ÷ 2 = ${median} cm` },
    { label: "Q3",      text: `3/4 × 30 = 22.5, so round up to the 23rd value = ${q3} cm` },
    { label: "Maximum", text: `Last value in the sorted list = ${max} cm` },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`,
      borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, margin: "0 0 10px" }}>
        How we find the values for {label}
      </p>
      {rows.map((r) => (
        <div key={r.label} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color, margin: "0 0 2px" }}>{r.label}</p>
          <p style={{ fontSize: "12px", color: C.text, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── Five-number summary card ──────────────────────────────────────────────
export function ValueCard({ label, data, color, unit }) {
  return (
    <div style={{ borderLeft: `4px solid ${color}`, paddingLeft: "10px" }}>
      <p style={{ fontSize: "13px", fontWeight: "800", color, marginBottom: "8px" }}>
        {label}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
        {[
          ["Minimum", data.min],
          ["Q1",      data.q1],
          ["Median",  data.median],
          ["Q3",      data.q3],
          ["Maximum", data.max],
        ].map(([name, value]) => (
          <div key={name} style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "8px", padding: "8px 4px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: C.muted, margin: 0 }}>
              <GlossaryTerm term={name}>
                {name === "Minimum" ? "Min" : name === "Maximum" ? "Max" : name}
              </GlossaryTerm>
            </p>
            <p style={{ fontSize: "14px", fontWeight: "800", color, margin: 0 }}>
              {value} {unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}