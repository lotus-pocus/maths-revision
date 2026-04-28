import { C } from "../data";

export default function BoxPlotSVG({ sets, scaleMin, scaleMax, unit, showLabels = true }) {
  const W = 560; const padL = 20; const padR = 20;
  const plotW = W - padL - padR;
  const rowH = showLabels ? 60 : 50;
  const boxH = 28;
  const toX = (v) => padL + ((v - scaleMin) / (scaleMax - scaleMin)) * plotW;
  const ticks = Array.from({ length: 6 }, (_, i) =>
    scaleMin + Math.round((i / 5) * (scaleMax - scaleMin)));
  const svgH = sets.length * rowH + 40;

  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} style={{ width: "100%", fontFamily: "inherit", overflow: "visible" }}>
      {ticks.map((t) => (
        <line key={t} x1={toX(t)} y1={0} x2={toX(t)} y2={sets.length * rowH}
          stroke={C.border} strokeWidth="1" strokeDasharray="4,4" />
      ))}
      {sets.map((s, i) => {
        const y = i * rowH + rowH / 2;
        const x1 = toX(s.min); const xq1 = toX(s.q1); const xm = toX(s.median);
        const xq3 = toX(s.q3); const x2 = toX(s.max);
        const bTop = y - boxH / 2; const bBot = y + boxH / 2;
        return (
          <g key={s.label}>
            {showLabels && (
              <text x={padL} y={y - boxH / 2 - 6} fill={s.color} fontSize="11" fontWeight="600">
                {s.label}
              </text>
            )}
            <line x1={x1} y1={y} x2={xq1} y2={y} stroke={s.color} strokeWidth="2" />
            <line x1={x1} y1={bTop + 8} x2={x1} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            <line x1={xq3} y1={y} x2={x2} y2={y} stroke={s.color} strokeWidth="2" />
            <line x1={x2} y1={bTop + 8} x2={x2} y2={bBot - 8} stroke={s.color} strokeWidth="2" />
            <rect x={xq1} y={bTop} width={xq3 - xq1} height={boxH}
              fill={s.color + "25"} stroke={s.color} strokeWidth="2" rx="3" />
            <line x1={xm} y1={bTop} x2={xm} y2={bBot} stroke={C.text} strokeWidth="3" />
            <text x={x1}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.min}</text>
            <text x={xq1} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q1}</text>
            <text x={xm}  y={bBot + 13} fill={s.color} fontSize="9" textAnchor="middle" fontWeight="700">{s.median}</text>
            <text x={xq3} y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.q3}</text>
            <text x={x2}  y={bBot + 13} fill={C.muted} fontSize="9" textAnchor="middle">{s.max}</text>
          </g>
        );
      })}
      <line x1={padL} y1={sets.length * rowH + 2} x2={W - padR} y2={sets.length * rowH + 2}
        stroke={C.border} strokeWidth="1.5" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={toX(t)} y1={sets.length * rowH + 2} x2={toX(t)} y2={sets.length * rowH + 8}
            stroke={C.muted} strokeWidth="1.5" />
          <text x={toX(t)} y={sets.length * rowH + 20} fill={C.muted} fontSize="10" textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x={W / 2} y={svgH - 2} fill={C.muted} fontSize="10" textAnchor="middle">{unit}</text>
    </svg>
  );
}