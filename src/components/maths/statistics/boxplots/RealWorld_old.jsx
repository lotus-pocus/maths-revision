import React, { useState } from "react";
import { C } from "./data";
import BoxPlotSVG from "./shared/BoxPlotSVG";
import GlossaryTerm from "./GlossaryTerm";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// ── Scenarios ─────────────────────────────────────────────────────────────
// type: "raw"     - unordered data to sort (hospital)
// type: "barchart"- read from a bar chart / frequency table (science)
// type: "cumfreq" - read from a cumulative frequency graph (delivery)

const SCENARIOS = [
  {
    id: "hospital",
    type: "raw",
    icon: "🏥",
    title: "Hospital Waiting Times",
    hook: "You work for the NHS. Your job is to compare two hospitals.",
    setup:
      "Patients in A&E are waiting to be seen. You collect the waiting times (in minutes) from a sample of 15 patients at City Hospital. The data comes in the order patients arrived - not in any useful order.",
    unit: "minutes",
    unitShort: "min",
    rawData: [67, 23, 41, 88, 15, 54, 31, 72, 19, 45, 60, 38, 80, 27, 52],
    sorted: [15, 19, 23, 27, 31, 38, 41, 45, 52, 54, 60, 67, 72, 80, 88],
    answer: { min: 15, q1: 27, median: 45, q3: 67, max: 88 },
    whySortExplain:
      "We sort the data so we can find the middle value (median) and the quartiles. If the numbers are jumbled, it is impossible to tell which value is in the middle. Sorting is always the first step.",
    contextExplain: {
      min: "15 minutes - this was the fastest patient seen. One person got lucky, or arrived at a quiet moment.",
      q1: "Q1 = 27 minutes means 25% of patients (about 1 in 4) were seen in under 27 minutes. Most people had to wait longer.",
      median:
        "Median = 45 minutes is the typical waiting time - half of patients waited less, half waited more. This is the number a hospital manager cares most about.",
      q3: "Q3 = 67 minutes means 75% of patients waited under 67 minutes. That also means 1 in 4 patients waited over an hour - which matters a lot.",
      iqr: "IQR = 67 - 27 = 40 minutes. This is a wide spread - the middle 50% of patients waited anywhere from 27 to 67 minutes. That is inconsistent. Some are seen quickly, others wait a long time.",
      max: "88 minutes - someone waited nearly 1.5 hours. The maximum shows the worst case.",
    },
    decisionText:
      "A manager seeing this data would ask: why is there such a big gap between the fastest and slowest? The IQR of 40 minutes suggests staffing is uneven - some shifts are much busier than others.",
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: "science",
    type: "barchart",
    icon: "🔬",
    title: "Plant Growth Experiment",
    hook: "Scientists are testing two fertilisers to see which grows taller plants.",
    setup:
      "30 identical seedlings were treated with Fertiliser A (standard) and 30 with Fertiliser B (new). After 4 weeks, the heights (in cm) were recorded. The results are summarised in a frequency table and bar chart below.",
    unit: "cm",
    unitShort: "cm",
    answer: { min: 8, q1: 14, median: 19, q3: 25, max: 38 },
    // Fertiliser A: min 8, Q1 14, median 19, Q3 25, max 38
    rows: [
      { interval: "0-5", freq: 1, cumFreq: 1 },
      { interval: "6-10", freq: 4, cumFreq: 5 },
      { interval: "11-15", freq: 8, cumFreq: 13 },
      { interval: "16-20", freq: 8, cumFreq: 21 },
      { interval: "21-25", freq: 5, cumFreq: 26 },
      { interval: "26-30", freq: 3, cumFreq: 29 },
      { interval: "31-35", freq: 0, cumFreq: 29 },
      { interval: "36-40", freq: 1, cumFreq: 30 },
    ],
    // Fertiliser B: min 11, Q1 18, median 26, Q3 31, max 41
    rowsB: [
      { interval: "0-5", freq: 0, cumFreq: 0 },
      { interval: "6-10", freq: 1, cumFreq: 1 },
      { interval: "11-15", freq: 3, cumFreq: 4 },
      { interval: "16-20", freq: 6, cumFreq: 10 },
      { interval: "21-25", freq: 7, cumFreq: 17 },
      { interval: "26-30", freq: 8, cumFreq: 25 },
      { interval: "31-35", freq: 4, cumFreq: 29 },
      { interval: "36-41", freq: 1, cumFreq: 30 },
    ],
    answerB: { min: 11, q1: 18, median: 26, q3: 31, max: 41 },
    totalFreq: 30,
    working: [
      { label: "Total plants", value: "30 seedlings" },
      { label: "Min", value: "8 cm - smallest value in the 6-10 interval" },
      {
        label: "Q1 - position: 1/4 x 30 = 7.5, round up to 8th value",
        value: "Falls in 11-15 interval - Q1 = 14 cm",
      },
      {
        label: "Median - position: 1/2 x 30 = 15th value",
        value: "Falls in 16-20 interval - Median = 19 cm",
      },
      {
        label: "Q3 - position: 3/4 x 30 = 22.5, round up to 23rd value",
        value: "Falls in 21-25 interval - Q3 = 25 cm",
      },
      { label: "Max", value: "38 cm - largest value in the 36-40 interval" },
    ],
    contextExplain: {
      min: "8 cm - the shortest plant. One seedling barely grew at all.",
      q1: "Q1 = 14 cm means 25% of plants grew less than 14 cm after 4 weeks. These are the weakest performers.",
      median:
        "Median = 19 cm is the typical height - half the plants grew taller, half shorter. This is the headline number for comparing fertilisers.",
      q3: "Q3 = 25 cm means 75% of plants were shorter than 25 cm. Only the top quarter grew above this.",
      iqr: "IQR = 25 - 14 = 11 cm. The middle 50% of plants grew between 14 and 25 cm. This is the consistency measure - a smaller IQR would mean the fertiliser works reliably on every plant.",
      max: "38 cm - the tallest plant. The long right whisker suggests a few plants responded very well to the fertiliser.",
    },
    decisionText:
      "A scientist comparing fertilisers A and B would look at: which has the higher median (better average growth)? Which has the smaller IQR (more reliable, consistent results)? A fertiliser that only works on some plants is not as useful as one that works consistently on all of them.",
    scaleMin: 0,
    scaleMax: 45,
  },
  {
    id: "delivery",
    type: "cumfreq",
    icon: "📦",
    title: "Delivery Times",
    hook: "You run a small business. Customers are complaining about slow deliveries.",
    setup:
      "A courier company tracked how many days 60 parcels took to arrive after dispatch. The results are shown as a cumulative frequency graph. Use it to find Q1, the median and Q3, then draw the box plot.",
    unit: "days",
    unitShort: "days",
    answer: { min: 1, q1: 3, median: 5, q3: 7, max: 12 },
    totalFreq: 60,
    cumFreqPoints: [
      [0, 0],
      [1, 0],
      [2, 3],
      [3, 15],
      [4, 24],
      [5, 30],
      [6, 38],
      [7, 45],
      [8, 51],
      [9, 55],
      [10, 57],
      [11, 59],
      [12, 60],
    ],
    readPoints: [
      { freq: 15, label: "Q1", value: 3, color: C.accent },
      { freq: 30, label: "Median", value: 5, color: "#1a1a2e" },
      { freq: 45, label: "Q3", value: 7, color: C.accent },
    ],
    contextExplain: {
      min: "1 day - the fastest delivery. At least one parcel arrived the next day.",
      q1: "Q1 = 3 days means 25% of parcels arrived within 3 days. These customers had no reason to complain.",
      median:
        "Median = 5 days is the typical delivery time. Half of parcels took less than 5 days, half took more. If you promise '5 working days', you would be right about half the time.",
      q3: "Q3 = 7 days - 75% of parcels arrived within 7 days. But 25% - 1 in 4 - took longer than a week. Those are your complaints.",
      iqr: "IQR = 7 - 3 = 4 days. The middle 50% of deliveries took between 3 and 7 days. That is a fairly wide window - customers can not reliably predict when their parcel will arrive.",
      max: "12 days - one parcel took nearly 2 weeks. The long right whisker shows a tail of very slow deliveries causing the most frustration.",
    },
    decisionText:
      "The business owner might switch to a more reliable courier, or offer tracking so customers know what to expect. The IQR of 4 days is the real problem - it is unpredictable. Customers can tolerate slow if it is consistent; they hate not knowing when to expect their parcel.",
    scaleMin: 0,
    scaleMax: 14,
  },
];

// ── Bar chart SVG (for science scenario) ─────────────────────────────────
function BarChartSVG({ rows, color, xLabel }) {
  const W = 520;
  const padL = 36;
  const padR = 16;
  const padT = 20;
  const padB = 52;
  const plotW = W - padL - padR;
  const plotH = 160;
  const maxFreq = Math.max(...rows.map((r) => r.freq), 1);
  const barColor = color || C.accent;
  const barW = plotW / rows.length;
  const toY = (f) => padT + plotH - (f / maxFreq) * plotH;
  const yTicks = [0, 2, 4, 6, 8, 10];

  return (
    <svg
      viewBox={`0 0 ${W} ${padT + plotH + padB}`}
      style={{ width: "100%", overflow: "visible" }}
    >
      {yTicks.map((f) => (
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
                fill={barColor}
                opacity="0.75"
                rx="3"
              />
            )}
            {row.freq > 0 && (
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fill={barColor}
                fontSize="9"
                fontWeight="700"
              >
                {row.freq}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={padT + plotH + 14}
              textAnchor="middle"
              fill={C.muted}
              fontSize="8"
              transform={`rotate(-35, ${x + barW / 2}, ${padT + plotH + 14})`}
            >
              {row.interval}
            </text>
          </g>
        );
      })}
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={padT + plotH}
        stroke={C.text}
        strokeWidth="1.5"
      />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={W - padR}
        y2={padT + plotH}
        stroke={C.text}
        strokeWidth="1.5"
      />
      {yTicks.map((f) => (
        <g key={f}>
          <line
            x1={padL - 4}
            y1={toY(f)}
            x2={padL}
            y2={toY(f)}
            stroke={C.muted}
            strokeWidth="1"
          />
          <text
            x={padL - 6}
            y={toY(f) + 4}
            textAnchor="end"
            fill={C.muted}
            fontSize="9"
          >
            {f}
          </text>
        </g>
      ))}
      <text
        x={padL - 28}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
        transform={`rotate(-90, ${padL - 28}, ${padT + plotH / 2})`}
      >
        Frequency
      </text>
      <text
        x={padL + plotW / 2}
        y={padT + plotH + padB - 4}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
      >
        {xLabel || "Height (cm)"}
      </text>
    </svg>
  );
}

// ── Cumulative frequency SVG (for delivery scenario) ──────────────────────
function CumFreqSVG({ points, totalFreq, readPoints, unit, scaleMax }) {
  const W = 520;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 48;
  const plotW = W - padL - padR;
  const plotH = 200;
  const toX = (v) => padL + (v / scaleMax) * plotW;
  const toY = (f) => padT + plotH - (f / totalFreq) * plotH;
  const pathD = points
    .map(([v, f], i) => `${i === 0 ? "M" : "L"} ${toX(v)} ${toY(f)}`)
    .join(" ");
  const yTicks = [0, 10, 20, 30, 40, 50, 60];
  const xTicks = [0, 2, 4, 6, 8, 10, 12, 14];
  const readScores = readPoints.map((r) => r.value);

  return (
    <svg
      viewBox={`0 0 ${W} ${padT + plotH + padB}`}
      style={{ width: "100%", overflow: "visible" }}
    >
      {yTicks.map((f) => (
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
      {readPoints.map(({ freq, value, color }) => (
        <g key={freq}>
          <line
            x1={padL}
            y1={toY(freq)}
            x2={toX(value)}
            y2={toY(freq)}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="5,3"
            opacity="0.8"
          />
          <line
            x1={toX(value)}
            y1={toY(freq)}
            x2={toX(value)}
            y2={toY(0)}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="5,3"
            opacity="0.8"
          />
          <circle cx={toX(value)} cy={toY(freq)} r="4" fill={color} />
          <rect
            x={padL - 22}
            y={toY(freq) - 7}
            width="18"
            height="13"
            fill="#fff"
          />
          <text
            x={padL - 5}
            y={toY(freq) + 4}
            textAnchor="end"
            fill={color}
            fontSize="10"
            fontWeight="700"
          >
            {freq}
          </text>
          <rect
            x={toX(value) - 8}
            y={toY(0) + 20}
            width="16"
            height="13"
            fill="#fff"
          />
          <text
            x={toX(value)}
            y={toY(0) + 31}
            textAnchor="middle"
            fill={color}
            fontSize="10"
            fontWeight="700"
          >
            {value}
          </text>
        </g>
      ))}
      <path
        d={pathD}
        fill="none"
        stroke={C.accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={toY(0)}
        stroke={C.text}
        strokeWidth="1.5"
      />
      <line
        x1={padL}
        y1={toY(0)}
        x2={W - padR}
        y2={toY(0)}
        stroke={C.text}
        strokeWidth="1.5"
      />
      {yTicks.map((f) => (
        <g key={f}>
          <line
            x1={padL - 4}
            y1={toY(f)}
            x2={padL}
            y2={toY(f)}
            stroke={C.muted}
            strokeWidth="1.5"
          />
          <text
            x={padL - 6}
            y={toY(f) + 4}
            textAnchor="end"
            fill={C.muted}
            fontSize="9"
          >
            {f}
          </text>
        </g>
      ))}
      {xTicks
        .filter((t) => !readScores.includes(t))
        .map((t) => (
          <g key={t}>
            <line
              x1={toX(t)}
              y1={toY(0)}
              x2={toX(t)}
              y2={toY(0) + 4}
              stroke={C.muted}
              strokeWidth="1.5"
            />
            <text
              x={toX(t)}
              y={toY(0) + 14}
              textAnchor="middle"
              fill={C.muted}
              fontSize="9"
            >
              {t}
            </text>
          </g>
        ))}
      <text
        x={padL - 32}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
        transform={`rotate(-90, ${padL - 32}, ${padT + plotH / 2})`}
      >
        Cumulative frequency
      </text>
      <text
        x={padL + plotW / 2}
        y={padT + plotH + padB - 4}
        textAnchor="middle"
        fill={C.muted}
        fontSize="10"
      >
        {unit}
      </text>
    </svg>
  );
}

// ── Accordion hint ────────────────────────────────────────────────────────
function Hint({ title, children, color }) {
  const [open, setOpen] = useState(false);
  const bg = color === "amber" ? "#fffbeb" : C.accentDim;
  const border = color === "amber" ? "#d97706" : C.accent;
  const textColor = color === "amber" ? "#92400e" : C.accent;
  return (
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: "10px",
        marginBottom: "10px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: open ? bg : "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "700", color: textColor }}>
          {title}
        </span>
        <span style={{ fontSize: "12px", color: textColor }}>
          {open ? "▲ Hide" : "▼ Show"}
        </span>
      </button>
      {open && (
        <div
          style={{
            background: bg,
            padding: "12px 14px",
            borderTop: `1px solid ${border}`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Bottom navigation ─────────────────────────────────────────────────────
function BottomNav({
  onBack,
  onNext,
  backLabel = "← Back",
  nextLabel = "Next →",
}) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <button
        onClick={onBack}
        style={{
          flex: 1,
          padding: "14px",
          background: "transparent",
          color: C.muted,
          border: `1.5px solid ${C.border}`,
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {backLabel}
      </button>
      <button
        onClick={onNext}
        style={{
          flex: 1,
          padding: "14px",
          background: C.accent,
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}

// ── RAW DATA STEPS (hospital) ─────────────────────────────────────────────
function Step1Raw({ s, onBack, onNext }) {
  return (
    <div>
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "10px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#15803d",
            margin: "0 0 6px",
          }}
        >
          {s.icon} Your task
        </p>
        <p
          style={{
            fontSize: "13px",
            color: C.text,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {s.setup}
        </p>
      </div>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: C.text,
          marginBottom: "10px",
        }}
      >
        Raw data ({s.rawData.length} values):
      </p>
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {s.rawData.map((v, i) => (
          <div
            key={i}
            style={{
              minWidth: "44px",
              height: "44px",
              borderRadius: "10px",
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
            }}
          >
            {v}
          </div>
        ))}
      </div>
      <p
        style={{
          fontSize: "13px",
          color: C.muted,
          lineHeight: 1.6,
          marginBottom: "20px",
        }}
      >
        These numbers are in the order patients arrived - not in any useful
        order. Before we can find the median or quartiles, we need to sort them.
      </p>
      <BottomNav
        onBack={onBack}
        onNext={onNext}
        backLabel="← Back to scenarios"
        nextLabel="Next: Sort the data →"
      />
    </div>
  );
}

function Step2Raw({ s, onBack, onNext }) {
  return (
    <div>
      <Hint title="💡 Why do we sort the data first?" color="amber">
        <p
          style={{
            fontSize: "13px",
            color: "#92400e",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {s.whySortExplain}
        </p>
      </Hint>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: C.text,
          margin: "16px 0 6px",
        }}
      >
        Original (unsorted):
      </p>
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {s.rawData.map((v, i) => (
          <div
            key={i}
            style={{
              minWidth: "40px",
              height: "40px",
              borderRadius: "8px",
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              color: C.muted,
            }}
          >
            {v}
          </div>
        ))}
      </div>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: C.text,
          marginBottom: "6px",
        }}
      >
        Sorted (lowest to highest):
      </p>
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {s.sorted.map((v, i) => {
          const n = s.sorted.length;
          const medIdx = Math.floor(n / 2);
          const q1Idx = Math.floor((n - 1) / 4);
          const q3Idx = Math.floor((3 * (n - 1)) / 4);
          const isMedian = i === medIdx;
          const isQ1 = i === q1Idx;
          const isQ3 = i === q3Idx;
          return (
            <div
              key={i}
              style={{
                minWidth: "40px",
                height: "40px",
                borderRadius: "8px",
                background: isMedian
                  ? C.text
                  : isQ1 || isQ3
                    ? C.accentDim
                    : C.surface,
                border: `1.5px solid ${isMedian ? C.text : isQ1 || isQ3 ? C.accent : C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: isMedian || isQ1 || isQ3 ? "700" : "400",
                color: isMedian ? "#fff" : isQ1 || isQ3 ? C.accent : C.text,
                position: "relative",
              }}
            >
              {v}
              {isMedian && (
                <span
                  style={{
                    position: "absolute",
                    top: "-18px",
                    fontSize: "9px",
                    fontWeight: "700",
                    color: C.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  Median
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          background: C.accentDim,
          border: `1px solid ${C.accent}40`,
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: C.text,
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          With {s.sorted.length} values (odd), the median is the{" "}
          <strong style={{ color: C.accent }}>
            {Math.floor(s.sorted.length / 2) + 1}th value = {s.answer.median}
          </strong>
          . Q1 is the median of the lower half. Q3 is the median of the upper
          half.
        </p>
      </div>
      <BottomNav
        onBack={onBack}
        onNext={onNext}
        backLabel="← Back"
        nextLabel="Next: Find Q1, Median, Q3 →"
      />
    </div>
  );
}

// ── BAR CHART STEPS (science) ─────────────────────────────────────────────
function Step1Bar({ s, onBack, onNext }) {
  const [activeTab, setActiveTab] = useState("A");
  const [showFrequencyTable, setShowFrequencyTable] = useState(false);
  const rows = activeTab === "A" ? s.rows : s.rowsB;
  const fertiliserColor = activeTab === "A" ? C.accent : "#d97706";
  const fertiliserLabel =
    activeTab === "A" ? "Fertiliser A (standard)" : "Fertiliser B (new)";
  const keyPositions = [8, 15, 23]; // 8th for Q1, 15th for median, 23rd for Q3

  return (
    <div>
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "10px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#15803d",
            margin: "0 0 6px",
          }}
        >
          {s.icon} Your task
        </p>
        <p
          style={{
            fontSize: "13px",
            color: C.text,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {s.setup}
        </p>
      </div>

      {/* Toggle between fertilisers */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "14px",
          background: C.surface,
          borderRadius: "10px",
          padding: "4px",
          border: `1px solid ${C.border}`,
        }}
      >
        {["A", "B"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveTab(f)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                activeTab === f
                  ? f === "A"
                    ? C.accent
                    : "#d97706"
                  : "transparent",
              color: activeTab === f ? "#fff" : C.muted,
              fontSize: "12px",
              fontWeight: "700",
              transition: "all 0.15s",
            }}
          >
            Fertiliser {f} {f === "A" ? "(standard)" : "(new)"}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${fertiliserColor}40`,
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "14px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: fertiliserColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          {fertiliserLabel} - plant heights after 4 weeks (30 plants)
        </p>
        <BarChartSVG rows={rows} color={fertiliserColor} xLabel="Height (cm)" />
      </div>

      {/* Frequency table dropdown */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          marginBottom: "14px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setShowFrequencyTable(!showFrequencyTable)}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: showFrequencyTable ? fertiliserColor + "12" : C.surface,
            border: "none",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          <span>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: fertiliserColor,
              }}
            >
              Frequency table - {fertiliserLabel}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                color: C.muted,
                marginTop: "2px",
              }}
            >
              Open to see the frequencies and cumulative frequencies
            </span>
          </span>
          <span
            style={{
              fontSize: "12px",
              color: C.muted,
              flexShrink: 0,
              marginLeft: "10px",
            }}
          >
            {showFrequencyTable ? "▲ Hide" : "▼ Show"}
          </span>
        </button>

        {showFrequencyTable && (
          <div
            style={{
              padding: "14px",
              borderTop: `1px solid ${C.border}`,
              background: "#fff",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Height (cm)", "Frequency", "Cumulative frequency"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "5px 8px",
                          textAlign: "left",
                          color: C.muted,
                          fontWeight: "600",
                          fontSize: "11px",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const prevCum = i > 0 ? rows[i - 1].cumFreq : 0;
                  const isKey = keyPositions.some(
                    (pos) => pos > prevCum && pos <= row.cumFreq,
                  );
                  return (
                    <tr
                      key={row.interval}
                      style={{
                        background: isKey
                          ? fertiliserColor + "18"
                          : "transparent",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <td
                        style={{
                          padding: "6px 8px",
                          color: isKey ? fertiliserColor : C.text,
                          fontWeight: isKey ? "700" : "400",
                        }}
                      >
                        {row.interval}
                      </td>
                      <td
                        style={{
                          padding: "6px 8px",
                          textAlign: "center",
                          color: isKey ? fertiliserColor : C.text,
                          fontWeight: isKey ? "700" : "400",
                        }}
                      >
                        {row.freq}
                      </td>
                      <td
                        style={{
                          padding: "6px 8px",
                          textAlign: "center",
                          color: isKey ? fertiliserColor : C.muted,
                          fontWeight: isKey ? "700" : "400",
                        }}
                      >
                        {row.cumFreq}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p
              style={{
                fontSize: "11px",
                color: fertiliserColor,
                margin: "8px 0 0",
              }}
            >
              Highlighted rows contain Q1, Median or Q3
            </p>
          </div>
        )}
      </div>

      {/* Key positions helper */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: C.text,
            margin: "0 0 8px",
          }}
        >
          Key positions to find (30 plants total)
        </p>
        {[
          { label: "Q1", calc: "1/4 x 30 = 7.5, round up to 8th value" },
          { label: "Median", calc: "1/2 x 30 = 15th value" },
          { label: "Q3", calc: "3/4 x 30 = 22.5, round up to 23rd value" },
        ].map(({ label, calc }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              style={{ fontSize: "13px", fontWeight: "700", color: C.accent }}
            >
              {label}
            </span>
            <span style={{ fontSize: "12px", color: C.muted }}>{calc}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #d97706",
          borderRadius: "8px",
          padding: "10px 12px",
          marginBottom: "20px",
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
          💡 Switch between Fertiliser A and B above to compare their
          distributions. Notice how B is shifted to the right - more plants grew
          taller. In the next step you will find the five-number summaries for
          both fertilisers, then compare.
        </p>
      </div>

      <BottomNav
        onBack={onBack}
        onNext={onNext}
        backLabel="← Back to scenarios"
        nextLabel="Next: Find Q1, Median, Q3 for both fertilisers →"
      />
    </div>
  );
}

// ── CUMULATIVE FREQUENCY STEPS (delivery) ─────────────────────────────────
function Step1CumFreq({ s, onBack, onNext }) {
  return (
    <div>
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "10px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#15803d",
            margin: "0 0 6px",
          }}
        >
          {s.icon} Your task
        </p>
        <p
          style={{
            fontSize: "13px",
            color: C.text,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {s.setup}
        </p>
      </div>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "14px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "4px",
          }}
        >
          Cumulative frequency graph - 60 parcels
        </p>
        <p style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>
          Dashed lines show how to read off Q1, Median and Q3
        </p>
        <CumFreqSVG
          points={s.cumFreqPoints}
          totalFreq={s.totalFreq}
          readPoints={s.readPoints}
          unit={`Delivery time (${s.unit})`}
          scaleMax={14}
        />
      </div>
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
            fontSize: "13px",
            fontWeight: "700",
            color: C.accent,
            margin: "0 0 8px",
          }}
        >
          How to read this graph
        </p>
        {[
          {
            n: "1",
            text: "Find the frequency on the y-axis: Q1 = 15, Median = 30, Q3 = 45",
          },
          { n: "2", text: "Draw a horizontal line across to the curve" },
          {
            n: "3",
            text: "Drop straight down to the x-axis - that is your value",
          },
        ].map(({ n, text }) => (
          <div
            key={n}
            style={{ display: "flex", gap: "10px", marginBottom: "6px" }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: C.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {n}
            </div>
            <p
              style={{
                fontSize: "12px",
                color: C.text,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: C.text,
            margin: "0 0 8px",
          }}
        >
          Values read from the graph
        </p>
        {[
          {
            label: "Min",
            value: `${s.answer.min} ${s.unitShort}`,
            note: "Given in question - fastest delivery",
          },
          {
            label: "Q1",
            value: `${s.answer.q1} ${s.unitShort}`,
            note: "Read from graph at frequency 15",
          },
          {
            label: "Median",
            value: `${s.answer.median} ${s.unitShort}`,
            note: "Read from graph at frequency 30",
          },
          {
            label: "Q3",
            value: `${s.answer.q3} ${s.unitShort}`,
            note: "Read from graph at frequency 45",
          },
          {
            label: "Max",
            value: `${s.answer.max} ${s.unitShort}`,
            note: "Given in question - slowest delivery",
          },
        ].map(({ label, value, note }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div>
              <span
                style={{ fontSize: "13px", fontWeight: "700", color: C.accent }}
              >
                {label}
              </span>
              <span
                style={{ fontSize: "11px", color: C.muted, marginLeft: "8px" }}
              >
                {note}
              </span>
            </div>
            <span
              style={{ fontSize: "14px", fontWeight: "800", color: C.text }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <BottomNav
        onBack={onBack}
        onNext={onNext}
        backLabel="← Back to scenarios"
        nextLabel="Next: Find Q1, Median, Q3 →"
      />
    </div>
  );
}

// ── Step 3: Find the values (shared for all types) ────────────────────────
function Step3({ s, onBack, onNext }) {
  const [openKey, setOpenKey] = useState(null);
  const isScience = s.type === "barchart" && s.answerB;
  const [activeFertiliser, setActiveFertiliser] = useState("A");
  const activeAnswer =
    isScience && activeFertiliser === "B" ? s.answerB : s.answer;
  const currentColor =
    isScience && activeFertiliser === "B" ? "#d97706" : C.accent;
  const currentLabel =
    isScience && activeFertiliser === "B"
      ? "Fertiliser B (new)"
      : "Fertiliser A (standard)";
  const { min, q1, median, q3, max } = activeAnswer;
  const iqr = q3 - q1;
  const contextText =
    isScience && activeFertiliser === "B"
      ? {
          min: "11 cm - the shortest plant using Fertiliser B. Even the smallest B plant was taller than A's smallest plant.",
          q1: "Q1 = 18 cm means 25% of plants using Fertiliser B were below 18 cm. This is higher than Fertiliser A's Q1.",
          median:
            "Median = 26 cm is the typical height for Fertiliser B. This is higher than Fertiliser A's median, so B produced taller plants on average.",
          q3: "Q3 = 31 cm means 75% of plants using Fertiliser B were below 31 cm. The whole middle section has shifted higher.",
          iqr: "IQR = 31 - 18 = 13 cm. The middle 50% of Fertiliser B plants spread across 13 cm, so B is slightly less consistent than A.",
          max: "41 cm - the tallest plant using Fertiliser B. This is higher than Fertiliser A's maximum.",
        }
      : s.contextExplain;

  const items = [
    {
      key: "min",
      label: "Minimum",
      value: min,
      hint:
        s.type === "barchart"
          ? "The smallest value in the first interval of the frequency table."
          : s.type === "cumfreq"
            ? "Given directly in the question - the fastest delivery."
            : "The first (smallest) number in the sorted list.",
    },
    {
      key: "q1",
      label: "Q1 - Lower Quarter",
      value: q1,
      hint: s.working
        ? s.working[2].value
        : s.type === "cumfreq"
          ? `Read from the graph at frequency ${s.totalFreq / 4}. The curve crosses at ${q1} ${s.unitShort}.`
          : `Take the bottom half of the data (below the median). Find the middle of those values. Here that is ${q1} ${s.unitShort}.`,
    },
    {
      key: "median",
      label: "Median",
      value: median,
      hint: s.working
        ? s.working[3].value
        : s.type === "cumfreq"
          ? `Read from the graph at the halfway point (frequency ${s.totalFreq / 2}). The curve crosses at ${median} ${s.unitShort}.`
          : `${s.sorted.length} values - odd number. The middle one is position ${Math.floor(s.sorted.length / 2) + 1} = ${median} ${s.unitShort}.`,
    },
    {
      key: "q3",
      label: "Q3 - Upper Quarter",
      value: q3,
      hint: s.working
        ? s.working[4].value
        : s.type === "cumfreq"
          ? `Read from the graph at frequency ${(s.totalFreq * 3) / 4}. The curve crosses at ${q3} ${s.unitShort}.`
          : `Take the upper half of the data (above the median). Find the middle of those values. Here that is ${q3} ${s.unitShort}.`,
    },
    {
      key: "max",
      label: "Maximum",
      value: max,
      hint:
        s.type === "barchart"
          ? "The largest value in the last interval of the frequency table."
          : s.type === "cumfreq"
            ? "Given directly in the question - the slowest delivery."
            : "The last (largest) number in the sorted list.",
    },
    {
      key: "iqr",
      label: "IQR",
      value: iqr,
      hint: `IQR = Q3 - Q1 = ${q3} - ${q1} = ${iqr} ${s.unitShort}`,
    },
  ];

  return (
    <div>
      <Hint
        title={
          isScience
            ? `📊 What do these numbers mean - ${currentLabel}?`
            : "📊 What do these numbers actually mean in this context?"
        }
        color="amber"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["min", "q1", "median", "q3", "iqr", "max"].map((k) => (
            <div
              key={k}
              style={{
                borderBottom: `1px solid #fde68a`,
                paddingBottom: "8px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#92400e",
                  margin: "0 0 2px",
                }}
              >
                {items.find((i) => i.key === k)?.label}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#78350f",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {contextText[k]}
              </p>
            </div>
          ))}
        </div>
      </Hint>

      {/* For barchart type, let students switch between both fertilisers */}
      {isScience ? (
        <div style={{ marginTop: "16px", marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "12px",
              background: C.surface,
              borderRadius: "10px",
              padding: "4px",
              border: `1px solid ${C.border}`,
            }}
          >
            {["A", "B"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFertiliser(f);
                  setOpenKey(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    activeFertiliser === f
                      ? f === "A"
                        ? C.accent
                        : "#d97706"
                      : "transparent",
                  color: activeFertiliser === f ? "#fff" : C.muted,
                  fontSize: "12px",
                  fontWeight: "700",
                  transition: "all 0.15s",
                }}
              >
                Fertiliser {f} {f === "A" ? "(standard)" : "(new)"}
              </button>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: currentColor,
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: C.text,
                margin: 0,
              }}
            >
              5-number summary -{" "}
              <span style={{ color: currentColor }}>{currentLabel}</span>
            </p>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: C.muted,
              margin: "0 0 10px",
              lineHeight: 1.5,
            }}
          >
            Switch between A and B to see the five-number summary for each
            fertiliser before comparing them on the box plot.
          </p>
        </div>
      ) : (
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: C.text,
            margin: "16px 0 10px",
          }}
        >
          The 5-number summary:
        </p>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {items.map((item) => (
          <div key={item.key}>
            <button
              onClick={() => setOpenKey(openKey === item.key ? null : item.key)}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: openKey === item.key ? C.accentDim : C.surface,
                border: `1.5px solid ${openKey === item.key ? currentColor : C.border}`,
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: openKey === item.key ? currentColor : C.text,
                }}
              >
                {item.label}
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: currentColor,
                  }}
                >
                  {item.value}
                </span>
                <span style={{ fontSize: "12px", color: C.muted }}>
                  {openKey === item.key ? "▲" : "▼ how?"}
                </span>
              </div>
            </button>
            {openKey === item.key && (
              <div
                style={{
                  background:
                    isScience && activeFertiliser === "B"
                      ? "#fffbeb"
                      : C.accentDim,
                  border: `1px solid ${currentColor}`,
                  borderTop: "none",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: C.text,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item.hint}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav
        onBack={onBack}
        onNext={onNext}
        backLabel="← Back"
        nextLabel="Next: See the box plot →"
      />
    </div>
  );
}

// ── Step 4: Box plot reveal (shared) ──────────────────────────────────────
function Step4({ s, onBack, onRestart }) {
  const isScience = s.type === "barchart" && s.answerB;
  const sets = isScience
    ? [
        { ...s.answer, label: "Fertiliser A (standard)", color: C.accent },
        { ...s.answerB, label: "Fertiliser B (new)", color: "#d97706" },
      ]
    : [{ ...s.answer, label: s.title, color: C.accent }];
  return (
    <div>
      <p
        style={{
          fontSize: "13px",
          color: C.muted,
          marginBottom: "14px",
          lineHeight: 1.6,
        }}
      >
        All 5 values plotted on a single diagram. This is what a manager,
        scientist, or analyst would actually look at.
      </p>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        {isScience && (
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "12px",
            }}
          >
            Both fertilisers - same scale
          </p>
        )}
        <BoxPlotSVG
          sets={sets}
          scaleMin={s.scaleMin}
          scaleMax={s.scaleMax}
          unit={s.unit}
          showLabels={isScience}
        />
      </div>
      {isScience && (
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: C.text,
              margin: "0 0 10px",
            }}
          >
            Side-by-side comparison
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {[
              { label: "Fertiliser A", data: s.answer, color: C.accent },
              { label: "Fertiliser B", data: s.answerB, color: "#d97706" },
            ].map(({ label, data, color }) => (
              <div
                key={label}
                style={{
                  background: color + "10",
                  border: `1.5px solid ${color}40`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color,
                    margin: "0 0 6px",
                  }}
                >
                  {label}
                </p>
                {[
                  ["Median", data.median],
                  ["IQR", data.q3 - data.q1],
                  ["Min", data.min],
                  ["Max", data.max],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "3px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: C.muted }}>
                      {k}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: k === "Median" || k === "IQR" ? color : C.text,
                      }}
                    >
                      {v} cm
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "8px",
              padding: "10px 12px",
              marginTop: "10px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#15803d",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <strong>Conclusion:</strong> Fertiliser B has a higher median (
              {s.answerB.median} cm vs {s.answer.median} cm) so it grows taller
              plants on average. Its IQR is {s.answerB.q3 - s.answerB.q1} cm vs{" "}
              {s.answer.q3 - s.answer.q1} cm for A - B is slightly less
              consistent, but the higher average growth makes it the better
              choice.
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "12px",
          padding: "14px 16px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#15803d",
            margin: "0 0 6px",
          }}
        >
          💡 What does this box plot tell us?
        </p>
        <p
          style={{
            fontSize: "13px",
            color: C.text,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {s.decisionText}
        </p>
      </div>
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "14px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: C.text,
            margin: "0 0 10px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Quick summary
        </p>
        {[
          {
            label: "Median",
            value: s.answer.median,
            unit: s.unitShort,
            desc: "Typical result",
            term: "Median",
          },
          {
            label: "IQR",
            value: s.answer.q3 - s.answer.q1,
            unit: s.unitShort,
            desc: "Consistency (smaller = better)",
            term: "IQR",
          },
          {
            label: "Range",
            value: s.answer.max - s.answer.min,
            unit: s.unitShort,
            desc: "Total spread",
            term: "Range",
          },
          {
            label: "Min",
            value: s.answer.min,
            unit: s.unitShort,
            desc: "Best case",
            term: "Minimum",
          },
          {
            label: "Max",
            value: s.answer.max,
            unit: s.unitShort,
            desc: "Worst case",
            term: "Maximum",
          },
        ].map(({ label, value, unit, desc, term }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "7px 0",
              borderBottom: `1px solid ${C.border}`,
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{ fontSize: "13px", fontWeight: "700", color: C.text }}
              >
                {term ? (
                  <GlossaryTerm term={term}>{label}</GlossaryTerm>
                ) : (
                  label
                )}
              </span>
              <span
                style={{ fontSize: "11px", color: C.muted, marginLeft: "8px" }}
              >
                {desc}
              </span>
            </div>
            <span
              style={{ fontSize: "14px", fontWeight: "800", color: C.accent }}
            >
              {value} {unit}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #d97706",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#92400e",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          ⭐ <strong>Exam answer:</strong>{" "}
          {s.id === "science" ? (
            <>
              Fertiliser B has a higher median ({s.answerB.median} {s.unitShort}
              ) than Fertiliser A ({s.answer.median} {s.unitShort}), so plants
              grew taller with Fertiliser B. However, Fertiliser A has a smaller
              IQR ({s.answer.q3 - s.answer.q1} {s.unitShort} vs{" "}
              {s.answerB.q3 - s.answerB.q1} {s.unitShort}), so its results are
              more consistent.
            </>
          ) : (
            <>
              {s.title} had a median of {s.answer.median} {s.unitShort} and an
              IQR of {s.answer.q3 - s.answer.q1} {s.unitShort}.
            </>
          )}
        </p>
      </div>
      <BottomNav
        onBack={onBack}
        onNext={onRestart}
        backLabel="← Back"
        nextLabel="Try another scenario →"
      />
    </div>
  );
}

// ── Step progress bar ─────────────────────────────────────────────────────
function StepBar({ step, type }) {
  const labels =
    type === "raw"
      ? ["The data", "Sort it", "Find values", "Box plot"]
      : ["The data", "Find values", "Box plot"];
  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
      {labels.map((label, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              height: "4px",
              borderRadius: "99px",
              background:
                i < step ? C.accent : i === step ? C.accent + "80" : C.border,
              marginBottom: "4px",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              color: i <= step ? C.accent : C.muted,
              fontWeight: i === step ? "700" : "400",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main RealWorld component ──────────────────────────────────────────────
export default function RealWorld() {
  const [selectedId, setSelected] = useState(null);
  const [step, setStep] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === selectedId);

  if (!selectedId) {
    return (
      <div>
        <p
          style={{
            fontSize: "13px",
            color: C.muted,
            marginBottom: "16px",
            lineHeight: 1.6,
          }}
        >
          Choose a real-world situation. Each one shows a different way data can
          be presented - raw numbers, a bar chart, or a cumulative frequency
          graph.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelected(s.id);
                setStep(0);
                scrollToTop();
              }}
              style={{
                padding: "16px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: C.text,
                    margin: "0 0 2px",
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: C.muted,
                    margin: "0 0 4px",
                  }}
                >
                  {s.hook}
                </p>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    background:
                      s.type === "raw"
                        ? C.accentDim
                        : s.type === "barchart"
                          ? "#fffbeb"
                          : "#f5f3ff",
                    color:
                      s.type === "raw"
                        ? C.accent
                        : s.type === "barchart"
                          ? "#d97706"
                          : "#7c3aed",
                    border: `1px solid ${s.type === "raw" ? C.accent + "40" : s.type === "barchart" ? "#fde68a" : "#ddd6fe"}`,
                  }}
                >
                  {s.type === "raw"
                    ? "Raw data"
                    : s.type === "barchart"
                      ? "Bar chart"
                      : "Cumulative frequency graph"}
                </span>
              </div>
              <span style={{ color: C.muted, fontSize: "20px", flexShrink: 0 }}>
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const s = scenario;
  // For non-raw types, steps are 0=data/graph, 1=find values, 2=box plot
  // For raw type, steps are 0=data, 1=sort, 2=find values, 3=box plot
  const isRaw = s.type === "raw";

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => {
            setSelected(null);
            scrollToTop();
          }}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
            color: C.muted,
            fontSize: "12px",
          }}
        >
          ← Back
        </button>
        <span style={{ fontSize: "22px" }}>{s.icon}</span>
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: C.text,
              margin: 0,
            }}
          >
            {s.title}
          </p>
          <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
            {s.hook}
          </p>
        </div>
      </div>

      <StepBar step={step} type={s.type} />

      {isRaw && step === 0 && (
        <Step1Raw
          s={s}
          onBack={() => {
            setSelected(null);
            setStep(0);
            scrollToTop();
          }}
          onNext={() => {
            setStep(1);
            scrollToTop();
          }}
        />
      )}
      {isRaw && step === 1 && (
        <Step2Raw
          s={s}
          onBack={() => {
            setStep(0);
            scrollToTop();
          }}
          onNext={() => {
            setStep(2);
            scrollToTop();
          }}
        />
      )}
      {isRaw && step === 2 && (
        <Step3
          s={s}
          onBack={() => {
            setStep(1);
            scrollToTop();
          }}
          onNext={() => {
            setStep(3);
            scrollToTop();
          }}
        />
      )}
      {isRaw && step === 3 && (
        <Step4
          s={s}
          onBack={() => {
            setStep(2);
            scrollToTop();
          }}
          onRestart={() => {
            setSelected(null);
            setStep(0);
            scrollToTop();
          }}
        />
      )}

      {!isRaw && s.type === "barchart" && step === 0 && (
        <Step1Bar
          s={s}
          onBack={() => {
            setSelected(null);
            setStep(0);
            scrollToTop();
          }}
          onNext={() => {
            setStep(1);
            scrollToTop();
          }}
        />
      )}
      {!isRaw && s.type === "cumfreq" && step === 0 && (
        <Step1CumFreq
          s={s}
          onBack={() => {
            setSelected(null);
            setStep(0);
            scrollToTop();
          }}
          onNext={() => {
            setStep(1);
            scrollToTop();
          }}
        />
      )}
      {!isRaw && step === 1 && (
        <Step3
          s={s}
          onBack={() => {
            setStep(0);
            scrollToTop();
          }}
          onNext={() => {
            setStep(2);
            scrollToTop();
          }}
        />
      )}
      {!isRaw && step === 2 && (
        <Step4
          s={s}
          onBack={() => {
            setStep(1);
            scrollToTop();
          }}
          onRestart={() => {
            setSelected(null);
            setStep(0);
            scrollToTop();
          }}
        />
      )}
    </div>
  );
}
