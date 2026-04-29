import { useState } from "react";
import { C } from "../../data";
import BoxPlotSVG from "../../shared/BoxPlotSVG";
import BottomNav from "../BottomNav";
import FrequencyTableDropdown from "../FrequencyTableDropdown";
import QuickSummary from "../QuickSummary";
import GlossaryTerm from "../../GlossaryTerm";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

function BarChartSVG({ rows, color }) {
  const W = 520;
  const H = 250;
  const padL = 38;
  const padR = 20;
  const padT = 24;
  const padB = 58;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxFreq = Math.max(...rows.map((r) => r.freq), 1);
  const barW = plotW / rows.length;
  const toY = (f) => padT + plotH - (f / maxFreq) * plotH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", overflow: "visible" }}
    >
      {[0, 2, 4, 6, 8].map((f) => (
        <line
          key={f}
          x1={padL}
          y1={toY(f)}
          x2={W - padR}
          y2={toY(f)}
          stroke={C.border}
          strokeWidth="1"
          strokeDasharray="3,4"
        />
      ))}

      {rows.map((row, i) => {
        const x = padL + i * barW;
        const y = toY(row.freq);
        const h = padT + plotH - y;

        return (
          <g key={row.interval}>
            {h > 0 && (
              <rect
                x={x + 2}
                y={y}
                width={barW - 4}
                height={h}
                fill={color}
                opacity="0.75"
                rx="3"
              />
            )}

            {row.freq > 0 && (
              <text
                x={x + barW / 2}
                y={y - 5}
                textAnchor="middle"
                fill={color}
                fontSize="9"
                fontWeight="800"
              >
                {row.freq}
              </text>
            )}

            <text
              x={x + barW / 2}
              y={padT + plotH + 16}
              textAnchor="middle"
              fill={C.muted}
              fontSize="8"
            >
              {row.interval}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={C.text} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={W - padR}
        y2={padT + plotH}
        stroke={C.text}
      />

      <text
        x="14"
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
        transform={`rotate(-90, 14, ${padT + plotH / 2})`}
      >
        Frequency
      </text>

      <text
        x={W / 2}
        y={H - 8}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
      >
        Height range (cm)
      </text>
    </svg>
  );
}

function ToggleButtons({ active, setActive }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        margin: "14px 0",
        background: C.surface,
        borderRadius: "10px",
        padding: "4px",
        border: `1px solid ${C.border}`,
      }}
    >
      {["A", "B"].map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          style={{
            flex: 1,
            padding: "9px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background:
              active === f ? (f === "A" ? C.accent : C.amber) : "transparent",
            color: active === f ? "#fff" : C.muted,
            fontWeight: "800",
          }}
        >
          Fertiliser {f}
        </button>
      ))}
    </div>
  );
}

function RawHeightsDropdown({ label, data, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "14px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: open ? `${color}14` : C.surface,
          border: `1px solid ${open ? color : C.border}`,
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div>
          <p style={{ fontSize: "13px", fontWeight: "800", color, margin: 0 }}>
            Show the actual plant heights behind this chart
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0" }}>
            These are the 30 height measurements used to make the graph.
          </p>
        </div>
        <span style={{ fontSize: "12px", color: C.muted }}>
          {open ? "▲ Hide" : "▼ Show"}
        </span>
      </button>

      {open && (
        <div
          style={{
            marginTop: "8px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: C.text,
              lineHeight: 1.6,
              margin: "0 0 12px",
            }}
          >
            <strong>{label}:</strong> each number below is one plant’s height in
            cm. The bar chart groups these heights into ranges, but this list
            shows the actual measurements.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.map((v, i) => (
              <div
                key={i}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: C.text,
                  background: "#fff",
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortedDataStrip({ label, data, color }) {
  const n = data.length;
  const q1Index = 7;
  const medLeftIndex = 14;
  const medRightIndex = 15;
  const q3Index = 22;

  const getTag = (i) => {
    if (i === 0) return "Min";
    if (i === q1Index) return "Q1";
    if (i === medLeftIndex || i === medRightIndex) return "Med";
    if (i === q3Index) return "Q3";
    if (i === n - 1) return "Max";
    return null;
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "800",
          color,
          margin: "0 0 8px",
        }}
      >
        {label} — sorted plant heights
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {data.map((v, i) => {
          const tag = getTag(i);
          return (
            <div
              key={i}
              style={{
                minWidth: "44px",
                minHeight: "50px",
                borderRadius: "8px",
                border: `1.5px solid ${tag ? color : C.border}`,
                background: tag ? `${color}16` : "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: tag ? color : C.text,
                }}
              >
                {v}
              </span>
              <span style={{ fontSize: "8px", color: C.muted }}>#{i + 1}</span>
              {tag && (
                <span style={{ fontSize: "8px", fontWeight: "800", color }}>
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HowValuesAreFound({ label, data, color }) {
  const min = data[0];
  const q1 = data[7];
  const medA = data[14];
  const medB = data[15];
  const median = (medA + medB) / 2;
  const q3 = data[22];
  const max = data[data.length - 1];

  const rows = [
    {
      label: "Minimum",
      text: `First value in the sorted list = ${min} cm`,
    },
    {
      label: "Q1",
      text: `There are 30 plants. 1/4 × 30 = 7.5, so round up to the 8th value = ${q1} cm`,
    },
    {
      label: "Median",
      text: `There are 30 plants, so use the 15th and 16th values. (${medA} + ${medB}) ÷ 2 = ${median} cm`,
    },
    {
      label: "Q3",
      text: `3/4 × 30 = 22.5, so round up to the 23rd value = ${q3} cm`,
    },
    {
      label: "Maximum",
      text: `Last value in the sorted list = ${max} cm`,
    },
  ];

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "14px",
        marginBottom: "16px",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: "800",
          color: C.text,
          margin: "0 0 10px",
        }}
      >
        How we find the values for {label}
      </p>

      {rows.map((r) => (
        <div
          key={r.label}
          style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color,
              margin: "0 0 2px",
            }}
          >
            {r.label}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: C.text,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function ValueCard({ label, data, color, unit }) {
  return (
    <div style={{ borderLeft: `4px solid ${color}`, paddingLeft: "10px" }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "800",
          color,
          marginBottom: "8px",
        }}
      >
        {label}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "6px",
        }}
      >
        {[
          ["Minimum", data.min],
          ["Q1", data.q1],
          ["Median", data.median],
          ["Q3", data.q3],
          ["Maximum", data.max],
        ].map(([name, value]) => (
          <div
            key={name}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "8px 4px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "10px", color: C.muted, margin: 0 }}>
              <GlossaryTerm term={name}>
                {name === "Minimum" ? "Min" : name === "Maximum" ? "Max" : name}
              </GlossaryTerm>
            </p>

            <p
              style={{ fontSize: "14px", fontWeight: "800", color, margin: 0 }}
            >
              {value} {unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RealWorldBarChartScenario({ scenario: s, onRestart }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState("A");

  const rawA = [
    8, 9, 10, 10, 10, 11, 13, 14, 14, 15, 15, 15, 15, 16, 19, 19, 20, 20, 20,
    21, 23, 24, 25, 25, 25, 26, 28, 29, 30, 38,
  ];

  const rawB = [
    11, 14, 15, 15, 16, 18, 18, 19, 20, 20, 21, 22, 23, 24, 25, 26, 26, 27, 28,
    29, 30, 30, 31, 31, 31, 32, 33, 34, 35, 41,
  ];

  const rowsA = [
    { interval: "0-5", freq: 0, cumFreq: 0 },
    { interval: "6-10", freq: 5, cumFreq: 5 },
    { interval: "11-15", freq: 8, cumFreq: 13 },
    { interval: "16-20", freq: 8, cumFreq: 21 },
    { interval: "21-25", freq: 5, cumFreq: 26 },
    { interval: "26-30", freq: 3, cumFreq: 29 },
    { interval: "31-35", freq: 0, cumFreq: 29 },
    { interval: "36-40", freq: 1, cumFreq: 30 },
  ];

  const rowsB = [
    { interval: "0-5", freq: 0, cumFreq: 0 },
    { interval: "6-10", freq: 0, cumFreq: 0 },
    { interval: "11-15", freq: 4, cumFreq: 4 },
    { interval: "16-20", freq: 6, cumFreq: 10 },
    { interval: "21-25", freq: 5, cumFreq: 15 },
    { interval: "26-30", freq: 7, cumFreq: 22 },
    { interval: "31-35", freq: 7, cumFreq: 29 },
    { interval: "36-41", freq: 1, cumFreq: 30 },
  ];

  const activeRows = active === "A" ? rowsA : rowsB;
  const activeRaw = active === "A" ? rawA : rawB;
  const activeAnswer = active === "A" ? s.answer : s.answerB;
  const activeColor = active === "A" ? C.accent : C.amber;
  const activeLabel = active === "A" ? "Fertiliser A" : "Fertiliser B";

  const go = (n) => {
    setStep(n);
    scrollToTop();
  };

  return (
    <div>
      <p
        style={{
          fontSize: "12px",
          fontWeight: "800",
          color: C.accent,
          marginBottom: "6px",
        }}
      >
        🔬 {s.title}
      </p>

      {step === 0 && (
        <div>
          <p style={{ fontSize: "13px", color: C.text, lineHeight: 1.7 }}>
            {s.setup}
          </p>

          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              borderRadius: "10px",
              padding: "12px 14px",
              margin: "14px 0",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#92400e",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              💡 <strong>Careful:</strong> the bar height is the{" "}
              <strong>frequency</strong> — how many plants are in that height
              range. It is not the plant height. A bar labelled 5 means “5
              plants”, not “5 cm”.
            </p>
          </div>

          <ToggleButtons active={active} setActive={setActive} />

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: activeColor,
                marginBottom: "10px",
              }}
            >
              {activeLabel} — frequency chart
            </p>
            <BarChartSVG rows={activeRows} color={activeColor} />
          </div>

          <RawHeightsDropdown
            label={activeLabel}
            data={activeRaw}
            color={activeColor}
          />

          <FrequencyTableDropdown
            rows={activeRows}
            label={activeLabel}
            color={activeColor}
          />

          <BottomNav
            showBack={false}
            onNext={() => go(1)}
            nextLabel="Next: Find values →"
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <ToggleButtons active={active} setActive={setActive} />

          <div
            style={{
              background: C.accentDim,
              border: `1px solid ${C.accent}40`,
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: C.text,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              For exact box plot values, use the{" "}
              <strong>sorted plant heights</strong>. The chart helps you see the
              pattern, but the sorted data gives you the exact Min, Q1, Median,
              Q3 and Max.
            </p>
          </div>

          <SortedDataStrip
            label={activeLabel}
            data={activeRaw}
            color={activeColor}
          />

          <HowValuesAreFound
            label={activeLabel}
            data={activeRaw}
            color={activeColor}
          />

          <ValueCard
            label={activeLabel}
            data={activeAnswer}
            color={activeColor}
            unit={s.unitShort}
          />

          <BottomNav
            onBack={() => go(0)}
            onNext={() => go(2)}
            nextLabel="Next: Compare both fertilisers →"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <BoxPlotSVG
              sets={[
                { ...s.answer, label: "Fertiliser A", color: C.accent },
                { ...s.answerB, label: "Fertiliser B", color: C.amber },
              ]}
              scaleMin={s.scaleMin}
              scaleMax={s.scaleMax}
              unit={s.unit}
            />
          </div>

          <QuickSummary s={s} />

          <BottomNav
            onBack={() => go(1)}
            onNext={() => go(3)}
            nextLabel="Next: Exam answer →"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #d97706",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#92400e",
                marginBottom: "8px",
              }}
            >
              ⭐ Exam-style answer
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#78350f",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Fertiliser B has a higher median (26 cm) than Fertiliser A (19
              cm), so plants grew taller with Fertiliser B. However, Fertiliser
              A has a smaller IQR (11 cm vs 13 cm), so its results are more
              consistent.
            </p>
          </div>

          <BottomNav
            onBack={() => go(2)}
            onNext={onRestart}
            nextLabel="Try another scenario →"
          />
        </div>
      )}
    </div>
  );
}
