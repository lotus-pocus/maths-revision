import { C } from "../../../../../../data/angles_data";

export const SHAPES = [
  {
    id: "square", name: "Square", icon: "⬛",
    colour: C.accent, colourDim: C.accentDim,
    rule: "4 equal sides. 4 equal angles (all 90°).",
    examPhrase: "Angles in a square are 90°",
    points: [[60,30],[180,30],[180,130],[60,130]],
    angleLabels: [
      { x: 75,  y: 48,  text: "90°" }, { x: 165, y: 48,  text: "90°" },
      { x: 165, y: 118, text: "90°" }, { x: 75,  y: 118, text: "90°" },
    ],
    vertexLabels: [
      { x: 50,  y: 25,  text: "A" }, { x: 190, y: 25,  text: "B" },
      { x: 190, y: 145, text: "C" }, { x: 50,  y: 145, text: "D" },
    ],
    facts: [
      "Sides: all 4 sides are equal length",
      "Angles: all 4 angles are exactly 90°",
      "Opposite sides are parallel",
      "Diagonals bisect each other at 90°",
    ],
  },
  {
    id: "rectangle", name: "Rectangle", icon: "▬",
    colour: C.accent, colourDim: C.accentDim,
    rule: "2 pairs of equal sides. 4 equal angles (all 90°).",
    examPhrase: "Angles in a rectangle are 90°",
    points: [[40,55],[220,55],[220,145],[40,145]],
    angleLabels: [
      { x: 58,  y: 74,  text: "90°" }, { x: 202, y: 74,  text: "90°" },
      { x: 202, y: 134, text: "90°" }, { x: 58,  y: 134, text: "90°" },
    ],
    vertexLabels: [
      { x: 28,  y: 48,  text: "A" }, { x: 232, y: 48,  text: "B" },
      { x: 232, y: 158, text: "C" }, { x: 28,  y: 158, text: "D" },
    ],
    facts: [
      "Sides: 2 pairs of equal opposite sides (not all 4 equal)",
      "Angles: all 4 angles are exactly 90°",
      "Opposite sides are parallel",
      "A square is a special rectangle where all 4 sides are also equal",
    ],
  },
  {
    id: "parallelogram", name: "Parallelogram", icon: "▱",
    colour: C.amber, colourDim: C.amberDim,
    rule: "2 pairs of equal sides. Opposite angles equal.",
    examPhrase: "Opposite angles in a parallelogram are equal",
    points: [[60,155],[155,40],[215,40],[120,155]],
    angleLabels: [
      { x: 82,  y: 138, text: "a°" }, { x: 154, y: 58,  text: "a°" },
      { x: 206, y: 58,  text: "b°" }, { x: 112, y: 138, text: "b°" },
    ],
    vertexLabels: [
      { x: 46,  y: 168, text: "A" }, { x: 154, y: 28,  text: "B" },
      { x: 228, y: 28,  text: "C" }, { x: 124, y: 168, text: "D" },
    ],
    facts: [
      "Sides: 2 pairs of equal opposite sides, both pairs parallel",
      "Angles: opposite angles are equal (a = a, b = b)",
      "Adjacent angles add up to 180° (a + b = 180°)",
      "Rectangles and squares are special parallelograms with 90° angles",
    ],
  },
  {
    id: "trapezium", name: "Trapezium", icon: "⏢",
    colour: C.green, colourDim: C.greenDim,
    rule: "1 pair of parallel sides. No sides necessarily equal.",
    examPhrase: "Co-interior angles add up to 180° (parallel lines)",
    points: [[55,145],[135,45],[185,45],[220,145]],
    angleLabels: [
      { x: 76,  y: 130, text: "c°" },
      { x: 146, y: 64,  text: "c°", col: C.accent },
      { x: 180, y: 64,  text: "d°", col: C.accent },
      { x: 204, y: 130, text: "d°" },
    ],
    vertexLabels: [
      { x: 40,  y: 158, text: "A" }, { x: 134, y: 32,  text: "B" },
      { x: 188, y: 32,  text: "C" }, { x: 234, y: 158, text: "D" },
    ],
    facts: [
      "Sides: exactly 1 pair of parallel sides — the other pair are NOT parallel",
      "Angles: co-interior angles between the parallel sides add to 180°",
      "The two angles on the same side always sum to 180°",
      "This is a direct application of the parallel lines rule",
    ],
  },
  {
    id: "kite", name: "Kite", icon: "🪁",
    colour: C.purple, colourDim: C.purpleDim,
    rule: "2 pairs of equal adjacent sides (not all 4 equal). One pair of equal angles.",
    examPhrase: "The two angles between unequal sides of a kite are equal",
    points: [[130,18],[215,95],[130,172],[45,95]],
    angleLabels: [
      { x: 130, y: 40,  text: "a°" }, { x: 196, y: 95,  text: "b°" },
      { x: 130, y: 154, text: "c°" }, { x: 64,  y: 95,  text: "b°" },
    ],
    vertexLabels: [
      { x: 130, y: 8,   text: "A" }, { x: 228, y: 95,  text: "B" },
      { x: 130, y: 186, text: "C" }, { x: 32,  y: 95,  text: "D" },
    ],
    facts: [
      "Sides: 2 pairs of equal adjacent sides — AB = AD (top pair), CB = CD (bottom pair)",
      "Crucially: the top pair and bottom pair are DIFFERENT lengths — not all 4 sides equal",
      "Angles: B = D (the angles between the unequal sides are equal)",
      "Angles A and C are different from each other and from B/D",
    ],
  },
  {
    id: "rhombus", name: "Rhombus", icon: "◆",
    colour: C.red, colourDim: C.redDim,
    rule: "All 4 sides equal. Opposite angles equal (but NOT 90°).",
    examPhrase: "Opposite angles in a rhombus are equal",
    points: [[130,55],[220,100],[130,145],[40,100]],
    angleLabels: [
      { x: 130, y: 72,  text: "a°" }, { x: 202, y: 100, text: "b°" },
      { x: 130, y: 130, text: "a°" }, { x: 58,  y: 100, text: "b°" },
    ],
    vertexLabels: [
      { x: 130, y: 43,  text: "A" }, { x: 234, y: 100, text: "B" },
      { x: 130, y: 158, text: "C" }, { x: 26,  y: 100, text: "D" },
    ],
    facts: [
      "Sides: ALL 4 sides are equal length (unlike a kite where only pairs are equal)",
      "Angles: opposite angles are equal (a = a, b = b) — but they are NOT 90°",
      "Adjacent angles add to 180°: a + b = 180°",
      "Think of it as a squashed square — same side lengths, different angles",
    ],
  },
];

export const DRILL_Qs = [
  {
    known: [90, 90, 90], answer: 90, shape: "rectangle", colour: C.accent,
    points: [[40,55],[220,55],[220,145],[40,145]],
    angleLabels: [
      { x: 58,  y: 74,  text: "90°" }, { x: 202, y: 74,  text: "90°" },
      { x: 202, y: 134, text: "90°" }, { x: 58,  y: 134, text: "x°", col: C.muted },
    ],
    vertexLabels: [
      { x: 28,  y: 48,  text: "A" }, { x: 232, y: 48,  text: "B" },
      { x: 232, y: 158, text: "C" }, { x: 28,  y: 158, text: "D" },
    ],
  },
  {
    known: [110, 85, 70], answer: 95, shape: "quadrilateral", colour: C.amber,
    points: [[30,150],[80,40],[210,55],[235,148]],
    angleLabels: [
      { x: 58,  y: 132, text: "110°" }, { x: 96,  y: 62,  text: "85°"  },
      { x: 196, y: 72,  text: "70°"  }, { x: 214, y: 130, text: "x°", col: C.muted },
    ],
    vertexLabels: [
      { x: 16,  y: 158, text: "A" }, { x: 78,  y: 28,  text: "B" },
      { x: 222, y: 42,  text: "C" }, { x: 248, y: 155, text: "D" },
    ],
  },
  {
    known: [120, 60, 120], answer: 60, shape: "parallelogram", colour: C.amber,
    points: [[60,155],[155,40],[215,40],[120,155]],
    angleLabels: [
      { x: 82,  y: 138, text: "120°" }, { x: 158, y: 58,  text: "60°"  },
      { x: 206, y: 58,  text: "120°" }, { x: 108, y: 138, text: "x°", col: C.muted },
    ],
    vertexLabels: [
      { x: 46,  y: 168, text: "A" }, { x: 154, y: 28,  text: "B" },
      { x: 228, y: 28,  text: "C" }, { x: 124, y: 168, text: "D" },
    ],
  },
  {
    known: [95, 105, 75], answer: 85, shape: "quadrilateral", colour: C.green,
    points: [[35,148],[75,42],[195,38],[230,150]],
    angleLabels: [
      { x: 62,  y: 128, text: "95°"  }, { x: 90,  y: 60,  text: "105°" },
      { x: 184, y: 56,  text: "75°"  }, { x: 210, y: 130, text: "x°", col: C.muted },
    ],
    vertexLabels: [
      { x: 20,  y: 156, text: "A" }, { x: 73,  y: 28,  text: "B" },
      { x: 202, y: 24,  text: "C" }, { x: 244, y: 158, text: "D" },
    ],
  },
  {
    known: [130, 50, 130], answer: 50, shape: "kite", colour: C.purple,
    points: [[130,18],[215,95],[130,172],[45,95]],
    angleLabels: [
      { x: 130, y: 40,  text: "130°" }, { x: 192, y: 95,  text: "50°"  },
      { x: 130, y: 154, text: "130°" }, { x: 68,  y: 95,  text: "x°", col: C.muted },
    ],
    vertexLabels: [
      { x: 130, y: 8,   text: "A" }, { x: 228, y: 95,  text: "B" },
      { x: 130, y: 186, text: "C" }, { x: 32,  y: 95,  text: "D" },
    ],
  },
];