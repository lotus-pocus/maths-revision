import { C, SVG_DEFAULTS } from "../../../../../data/angles_data";

const { font } = SVG_DEFAULTS;
const toRad = (deg) => (deg * Math.PI) / 180;

function ArrowHead({ x, y, colour = C.muted }) {
  return (
    <polygon
      points={`${x},${y} ${x - 8},${y - 4} ${x - 8},${y + 4}`}
      fill={colour}
    />
  );
}

function AngleArc({ cx, cy, r, ray1Deg, ray2Deg, colour, label }) {
  const a1 = toRad(ray1Deg);
  const a2 = toRad(ray2Deg);

  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);

  let sweep = ray2Deg - ray1Deg;
  while (sweep < 0)   sweep += 360;
  while (sweep > 360) sweep -= 360;
  const large = sweep > 180 ? 1 : 0;

  const midDeg = ray1Deg + sweep / 2;
  const lr     = r + 16;
  const lx     = cx + lr * Math.cos(toRad(midDeg));
  const ly     = cy + lr * Math.sin(toRad(midDeg));

  return (
    <g>
      <path
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={colour + "25"}
        stroke="none"
      />
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={colour}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {label && (
        <text
          x={lx} y={ly}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={11} fontWeight="700" fill={colour}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function ParallelCore({
  width         = 280,
  height        = 190,
  tvDeg         = 55,
  highlightRule = null,
  topLabel      = null,
  bottomLabel   = null,
  topColour     = C.accent,
  bottomColour  = C.amber,
}) {
  const yTop = height * 0.32;
  const yBot = height * 0.68;
  const padX = 22;
  const ext  = 45;

  const ix1 = width * 0.40;
  const iy1 = yTop;
  const dy  = yBot - yTop;
  const dx  = dy / Math.tan(toRad(tvDeg));
  const ix2 = ix1 + dx;
  const iy2 = yBot;

  const extX = ext * Math.cos(toRad(tvDeg));
  const extY = ext * Math.sin(toRad(tvDeg));
  const tStart = [ix1 - extX, iy1 - extY];
  const tEnd   = [ix2 + extX, iy2 + extY];

  const r = 22;

  const rightRay = 0;
  const downRay  = tvDeg;
  const leftRay  = 180;
  const upRay    = 180 + tvDeg;

  let topArc = null;
  let botArc = null;

  if (highlightRule === "alternate") {
    topArc = { ray1: rightRay, ray2: downRay, colour: topColour,    label: topLabel    };
    botArc = { ray1: leftRay,  ray2: upRay,   colour: topColour,    label: bottomLabel };
  } else if (highlightRule === "cointerior") {
    topArc = { ray1: downRay,  ray2: leftRay, colour: topColour,    label: topLabel    };
    botArc = { ray1: rightRay, ray2: downRay, colour: bottomColour, label: bottomLabel };
  } else if (highlightRule === "corresponding") {
    topArc = { ray1: rightRay, ray2: downRay, colour: topColour,    label: topLabel    };
    botArc = { ray1: rightRay, ray2: downRay, colour: topColour,    label: bottomLabel };
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, overflow: "visible" }}
    >
      <line x1={padX} y1={iy1} x2={width - padX} y2={iy1}
        stroke={C.muted} strokeWidth={2} strokeLinecap="round" />
      <line x1={padX} y1={iy2} x2={width - padX} y2={iy2}
        stroke={C.muted} strokeWidth={2} strokeLinecap="round" />

      <ArrowHead x={width * 0.72} y={iy1} colour={C.muted} />
      <ArrowHead x={width * 0.72} y={iy2} colour={C.muted} />

      <line
        x1={tStart[0]} y1={tStart[1]}
        x2={tEnd[0]}   y2={tEnd[1]}
        stroke={C.text} strokeWidth={2} strokeLinecap="round"
      />

      {topArc && (
        <AngleArc cx={ix1} cy={iy1} r={r}
          ray1Deg={topArc.ray1} ray2Deg={topArc.ray2}
          colour={topArc.colour} label={topArc.label} />
      )}
      {botArc && (
        <AngleArc cx={ix2} cy={iy2} r={r}
          ray1Deg={botArc.ray1} ray2Deg={botArc.ray2}
          colour={botArc.colour} label={botArc.label} />
      )}

      <circle cx={ix1} cy={iy1} r={3} fill={C.text} />
      <circle cx={ix2} cy={iy2} r={3} fill={C.text} />
    </svg>
  );
}

export function AlternateSVG({ topValue = 65, width = 280, height = 190, showAnswer = true }) {
  return (
    <ParallelCore width={width} height={height}
      highlightRule="alternate"
      topLabel={`${topValue}°`}
      bottomLabel={showAnswer ? `${topValue}°` : "x°"}
      topColour={C.accent} />
  );
}

export function CoInteriorSVG({ topValue = 65, width = 280, height = 190, showAnswer = true }) {
  const bottom = 180 - topValue;
  return (
    <ParallelCore width={width} height={height}
      highlightRule="cointerior"
      topLabel={`${topValue}°`}
      bottomLabel={showAnswer ? `${bottom}°` : "x°"}
      topColour={C.amber} bottomColour={C.accent} />
  );
}

export function CorrespondingSVG({ topValue = 65, width = 280, height = 190, showAnswer = true }) {
  return (
    <ParallelCore width={width} height={height}
      highlightRule="corresponding"
      topLabel={`${topValue}°`}
      bottomLabel={showAnswer ? `${topValue}°` : "x°"}
      topColour={C.green} />
  );
}

export function BlankParallelSVG({ width = 280, height = 190, rule = "alternate" }) {
  return (
    <ParallelCore width={width} height={height}
      highlightRule={rule}
      topLabel="65°" bottomLabel="?"
      topColour={C.accent} bottomColour={C.amber} />
  );
}