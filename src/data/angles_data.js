// ── Colour palette — geometry blue theme ──────────────────────────────────
export const C = {
  bg:         "#fffde7",      // warm cream — matches app background
  surface:    "#ffffff",      // white cards
  border:     "#e5e7eb",      // light grey border
  accent:     "#2563eb",      // geometry blue (matches MathsTopicsView Geometry strand)
  accentDim:  "#eff6ff",      // light blue tint
  accentMid:  "#93c5fd",      // mid blue for highlights
  amber:      "#d97706",      // amber — second colour / warnings
  amberDim:   "#fffbeb",      // light amber tint
  green:      "#059669",      // green — correct answers
  greenDim:   "#ecfdf5",      // light green tint
  red:        "#dc2626",      // red — errors / wrong answers
  redDim:     "#fef2f2",      // light red tint
  purple:     "#7c3aed",      // purple — interpret / challenge
  purpleDim:  "#f5f3ff",      // light purple tint
  text:       "#1a1a2e",      // dark navy text
  muted:      "#6b7280",      // medium grey
  shadow:     "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
};

// ── Angle type definitions ────────────────────────────────────────────────
// Used across Learn, BuildIt and Exam
export const ANGLE_TYPES = [
  {
    id:          "acute",
    label:       "Acute",
    description: "Greater than 0° and less than 90°",
    range:       [1, 89],
    example:     45,
    colour:      C.accent,
    colourDim:   C.accentDim,
  },
  {
    id:          "right",
    label:       "Right",
    description: "Exactly 90° — marked with a square corner",
    range:       [90, 90],
    example:     90,
    colour:      C.green,
    colourDim:   C.greenDim,
  },
  {
    id:          "obtuse",
    label:       "Obtuse",
    description: "Greater than 90° and less than 180°",
    range:       [91, 179],
    example:     120,
    colour:      C.amber,
    colourDim:   C.amberDim,
  },
  {
    id:          "straight",
    label:       "Straight",
    description: "Exactly 180° — a straight line",
    range:       [180, 180],
    example:     180,
    colour:      C.muted,
    colourDim:   "#f3f4f6",
  },
  {
    id:          "reflex",
    label:       "Reflex",
    description: "Greater than 180° and less than 360°",
    range:       [181, 359],
    example:     240,
    colour:      C.purple,
    colourDim:   C.purpleDim,
  },
];

// ── Parallel line rule definitions ────────────────────────────────────────
// Used in SectionParallel and ParallelSVG
export const PARALLEL_RULES = [
  {
    id:          "alternate",
    label:       "Alternate angles",
    shortLabel:  "Alternate",
    shape:       "Z",
    description: "Equal angles on opposite sides of a transversal crossing two parallel lines.",
    examPhrase:  "Alternate angles are equal (parallel lines).",
    wrongName:   "Z angles",  // what Edexcel no longer accepts
    colour:      C.accent,
    colourDim:   C.accentDim,
  },
  {
    id:          "cointerior",
    label:       "Co-interior angles",
    shortLabel:  "Co-interior",
    shape:       "C",
    description: "Angles on the same side of a transversal between two parallel lines. They add up to 180°.",
    examPhrase:  "Co-interior angles add up to 180° (parallel lines).",
    wrongName:   "C angles",
    colour:      C.amber,
    colourDim:   C.amberDim,
  },
  {
    id:          "corresponding",
    label:       "Corresponding angles",
    shortLabel:  "Corresponding",
    shape:       "F",
    description: "Equal angles in matching positions where a transversal crosses parallel lines.",
    examPhrase:  "Corresponding angles are equal (parallel lines).",
    wrongName:   "F angles",
    colour:      C.green,
    colourDim:   C.greenDim,
  },
];

// ── Angle rule definitions ────────────────────────────────────────────────
// Used in Exam questions — the reasons the student must quote
export const ANGLE_RULES = [
  { id: "straight",   label: "Angles on a straight line add up to 180°"  },
  { id: "point",      label: "Angles around a point add up to 360°"       },
  { id: "vertOpp",    label: "Vertically opposite angles are equal"       },
  { id: "triangle",   label: "Angles in a triangle add up to 180°"        },
  { id: "isosceles",  label: "Base angles of an isosceles triangle are equal" },
  { id: "alternate",  label: "Alternate angles are equal (parallel lines)" },
  { id: "cointerior", label: "Co-interior angles add up to 180° (parallel lines)" },
  { id: "corresponding", label: "Corresponding angles are equal (parallel lines)" },
  { id: "quad",       label: "Angles in a quadrilateral add up to 360°"   },
  { id: "equilateral",label: "All angles in an equilateral triangle are 60°" },
];

// ── SVG layout helpers — shared across all diagram components ─────────────
export const SVG_DEFAULTS = {
  W:      280,   // default viewBox width
  H:      200,   // default viewBox height
  stroke: 2,     // default stroke width
  arc:    36,    // default angle arc radius
  font:   13,    // default label font size
};