// ── Colour palette - matches geography app light design ───────────────────
export const C = {
  bg:        "#fffde7",       // warm cream - geography app background
  surface:   "#ffffff",       // white cards
  card:      "#ffffff",       // white cards
  border:    "#e5e7eb",       // light grey border
  accent:    "#059669",       // statistics green (matches MathsTopicsView)
  accentDim: "#ecfdf5",       // light green tint
  amber:     "#d97706",       // amber for second data set
  amberDim:  "#fffbeb",       // light amber tint
  red:       "#dc2626",       // red for errors
  text:      "#1a1a2e",       // dark navy text
  muted:     "#6b7280",       // medium grey
  white:     "#ffffff",       // white
  purple:    "#7c3aed",       // purple for graph questions
  purpleDim: "#f5f3ff",       // light purple tint
  shadow:    "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
};

// ── Real world scenarios ──────────────────────────────────────────────────
export const HOSPITAL_SCENARIOS = [
  {
    id: "waiting",
    icon: "🏥",
    world: "Hospital",
    title: "A&E Waiting Times",
    subtitle: "Two hospital trusts, one Monday morning",
    unit: "minutes",
    context: "Hospital managers use box plots to compare patient waiting times across different A&E departments. A lower median means shorter waits on average. The box in the middle shows where most waiting times fall - a narrow box means patients all wait roughly the same time, a wide box means it's unpredictable. NHS targets require 95% of patients to be seen within 4 hours, so spotting which trust is struggling matters enormously. (The width of that box is what we call the IQR - explained in the comparison table below.)",
    whyBoxPlot: "A single average (mean) would be misleading here - one very long wait drags the mean up. The median and IQR give a fairer picture of the typical patient experience.",
    sets: [
      { label: "St. Mary's Hospital", min: 12, q1: 28, median: 41, q3: 67, max: 124, color: "#059669" },
      { label: "Royal Infirmary",     min: 8,  q1: 35, median: 58, q3: 72, max: 98,  color: "#d97706" },
    ],
    // Cumulative frequency curve data for Real World dig deeper
    cumFreq: {
      totalFreq: 20,
      unit: "minutes",
      scaleMin: 0, scaleMax: 130,
      sets: [
        {
          label: "St. Mary's Hospital",
          color: "#059669",
          points: [[0,0],[12,0],[20,2],[28,5],[35,8],[41,10],[55,14],[67,15],[85,18],[100,19],[124,20]],
        },
        {
          label: "Royal Infirmary",
          color: "#d97706",
          points: [[0,0],[8,0],[20,1],[30,3],[35,5],[45,8],[58,10],[65,14],[72,15],[85,18],[98,20]],
        },
      ],
    },
  },
  {
    id: "salaries",
    icon: "💼",
    world: "Business",
    title: "Staff Salaries",
    subtitle: "Two companies in the same industry",
    unit: "£k per year",
    context: "HR departments and job seekers use box plots to compare salary distributions across companies. A higher median means better typical pay. But a large IQR means pay is very unequal - a few people earn a lot while others earn much less. Two companies can have the same median salary but very different experiences for employees depending on the spread.",
    whyBoxPlot: "Salary data almost always has outliers - a CEO earning £500k would inflate the mean wildly. Box plots show what most employees actually earn, not what the average is pulled up to by a handful of very high earners.",
    sets: [
      { label: "TechCorp Ltd",      min: 24, q1: 32, median: 44, q3: 61, max: 148, color: "#059669" },
      { label: "Meridian Services", min: 21, q1: 29, median: 42, q3: 52, max:  78, color: "#d97706" },
    ],
    cumFreq: {
      totalFreq: 20,
      unit: "£k per year",
      scaleMin: 20, scaleMax: 155,
      sets: [
        {
          label: "TechCorp Ltd",
          color: "#059669",
          points: [[20,0],[24,0],[28,2],[32,5],[38,8],[44,10],[52,13],[61,15],[80,18],[110,19],[148,20]],
        },
        {
          label: "Meridian Services",
          color: "#d97706",
          points: [[20,0],[21,0],[25,2],[29,5],[35,8],[42,10],[47,13],[52,15],[62,18],[70,19],[78,20]],
        },
      ],
    },
  },
  {
    id: "science",
    icon: "🔬",
    world: "Science",
    title: "Plant Growth Experiment",
    subtitle: "Two fertilisers tested on identical seedlings",
    unit: "cm",
    context: "Scientists use box plots to compare results from two experimental conditions. Here, two fertilisers are tested on 30 identical seedlings each. A higher median means the fertiliser produced taller plants on average. A smaller IQR means the results were more consistent - the fertiliser worked reliably, not just for some plants.",
    whyBoxPlot: "In experiments you always get variation - not every plant grows the same. Box plots show both the typical result AND how reliable it was, which a single number like the mean cannot do alone.",
    sets: [
      { label: "Fertiliser A (standard)", min: 8,  q1: 14, median: 19, q3: 25, max: 38, color: "#059669" },
      { label: "Fertiliser B (new)",      min: 11, q1: 18, median: 26, q3: 31, max: 41, color: "#d97706" },
    ],
    cumFreq: {
      totalFreq: 20,
      unit: "cm",
      scaleMin: 0, scaleMax: 45,
      sets: [
        {
          label: "Fertiliser A",
          color: "#059669",
          points: [[0,0],[8,0],[11,2],[14,5],[16,8],[19,10],[22,13],[25,15],[30,18],[35,19],[38,20]],
        },
        {
          label: "Fertiliser B",
          color: "#d97706",
          points: [[0,0],[11,0],[14,2],[18,5],[22,8],[26,10],[28,13],[31,15],[35,18],[39,19],[41,20]],
        },
      ],
    },
  },
];

// ── Exam: draw a box plot ─────────────────────────────────────────────────
export const EXAM_QUESTIONS = [
  {
    id: "q1",
    question: "The table shows information about the heights (cm) of some plants. Draw a box plot to represent this information.",
    data: { min: 11, q1: 28, median: 37, q3: 42, max: 51 },
    scaleMin: 0, scaleMax: 60, unit: "Height (cm)",
  },
  {
    id: "q2",
    question: "The times (seconds) of 15 students running a race are listed below. Find the 5 values and draw the box plot.",
    rawData: [52, 54, 54, 55, 58, 58, 59, 60, 60, 61, 61, 64, 67, 70, 75],
    data: { min: 52, q1: 56.5, median: 60, q3: 65.5, max: 75 },
    scaleMin: 50, scaleMax: 80, unit: "Time (s)",
  },
  {
    id: "q3",
    question: "The weights (kg) of 11 pigs are listed below. Find the 5 values and draw the box plot.",
    rawData: [48, 55, 59, 65, 69, 69, 72, 74, 80, 81, 91],
    data: { min: 48, q1: 59, median: 69, q3: 77, max: 91 },
    scaleMin: 40, scaleMax: 100, unit: "Weight (kg)",
  },
];

// ── Exam: compare two box plots ───────────────────────────────────────────
export const COMPARE_QUESTIONS = [
  {
    id: "c1",
    label: "Q5 - Tomato plants",
    question: "The table shows heights (cm) of Maggie's tomato plants. The box plot below shows Nigel's. Draw Maggie's box plot on the same scale, then compare the two distributions.",
    yours:  { min: 12, q1: 27, median: 35, q3: 42, max: 55 },
    theirs: { min: 8,  q1: 20, median: 30, q3: 45, max: 60 },
    theirsLabel: "Nigel's plants", yoursLabel: "Maggie's plants",
    scaleMin: 0, scaleMax: 65, unit: "Height (cm)", marks: 4,
    modelAnswer: {
      median: "Maggie's plants have a higher median (35 cm) than Nigel's (30 cm), so Maggie's plants are taller on average.",
      iqr: "Maggie's plants have a smaller IQR (15 cm) than Nigel's (25 cm), so Maggie's heights are more consistent.",
    },
  },
  {
    id: "c2",
    label: "Q6 - Maths scores",
    question: "The table shows maths scores for Class A. The box plot below shows Class B. Draw Class A's box plot, then compare the two distributions.",
    yours:  { min: 9,  q1: 15, median: 19, q3: 31, max: 43 },
    theirs: { min: 14, q1: 22, median: 32, q3: 40, max: 55 },
    theirsLabel: "Class B", yoursLabel: "Class A",
    scaleMin: 0, scaleMax: 65, unit: "Maths Score", marks: 4,
    modelAnswer: {
      median: "Class B has a higher median score (32) than Class A (19), so Class B performed better on average.",
      iqr: "Class A has a smaller IQR (16) than Class B (18), so Class A's scores were slightly more consistent.",
    },
  },
  {
    id: "c3",
    label: "Q7 - Puzzle times",
    question: "Boys' times: IQR = 8, Min = 12, Median = 18, Upper Quartile = 23, Max = 29. The box plot below shows the girls' times. Draw the boys' box plot, then compare.",
    yours:  { min: 12, q1: 15, median: 18, q3: 23, max: 29 },
    theirs: { min: 8,  q1: 12, median: 16, q3: 21, max: 27 },
    theirsLabel: "Girls", yoursLabel: "Boys",
    scaleMin: 0, scaleMax: 35, unit: "Time (minutes)", marks: 4,
    note: "Q1 is not given directly - work it out: Q1 = Q3 − IQR = 23 − 8 = 15",
    modelAnswer: {
      median: "Boys have a higher median time (18 min) than girls (16 min), so girls completed the puzzle faster on average.",
      iqr: "Boys have a larger IQR (8 min) than girls (9 min) - both groups had similar consistency.",
    },
  },
];

// ── Exam: read the graph ──────────────────────────────────────────────────
export const READ_GRAPH_QUESTIONS = [
  {
    id: "rg1",
    label: "Q8 - Pears",
    question: "The cumulative frequency graph shows the weight (in grams) of 60 pears. The minimum weight is 112g and the maximum is 149g. Use the graph to find Q1, the median and Q3, then draw the box plot.",
    totalFreq: 60,
    unit: "Weight (g)",
    scaleMin: 100, scaleMax: 155,
    curvePoints: [
      [100,0],[112,0],[115,2],[118,5],[121,9],[124,15],[127,22],
      [130,30],[133,38],[136,45],[139,51],[142,56],[145,59],[149,60],[155,60],
    ],
    answer: { min: 112, q1: 124, median: 130, q3: 136, max: 149 },
    readPoints: [
      { freq: 15, label: "Q1 (¼ × 60 = 15th value)", value: 124, color: "#059669" },
      { freq: 30, label: "Median (½ × 60 = 30th value)", value: 130, color: "#1a1a2e" },
      { freq: 45, label: "Q3 (¾ × 60 = 45th value)", value: 136, color: "#059669" },
    ],
    examTip: "Always read across from the y-axis to the curve, then drop straight down to the x-axis. Never read it the other way round.",
  },
  {
    id: "rg2",
    label: "Q9 - Apples",
    question: "The cumulative frequency graph shows the weight (in grams) of 60 apples. The minimum weight is 163g and the maximum is 188g. Use the graph to find Q1, the median and Q3, then draw the box plot.",
    totalFreq: 60,
    unit: "Weight (g)",
    scaleMin: 155, scaleMax: 195,
    curvePoints: [
      [155,0],[163,0],[165,1],[168,4],[171,10],[174,18],[177,28],
      [180,38],[183,47],[186,54],[188,60],[195,60],
    ],
    answer: { min: 163, q1: 174, median: 179, q3: 183, max: 188 },
    readPoints: [
      { freq: 15, label: "Q1 (¼ × 60 = 15th value)", value: 174, color: "#059669" },
      { freq: 30, label: "Median (½ × 60 = 30th value)", value: 179, color: "#1a1a2e" },
      { freq: 45, label: "Q3 (¾ × 60 = 45th value)", value: 183, color: "#059669" },
    ],
    examTip: "The curve is S-shaped - starts shallow, steepens in the middle, then flattens at the top. If your curve goes downward at any point, something has gone wrong.",
  },
];

// ── Build It questions ────────────────────────────────────────────────────
export const BUILD_QUESTIONS = [
  {
    id: "b1", label: "Starter",
    question: "Heights (cm) of 9 students:",
    rawData: [142, 148, 151, 155, 158, 163, 167, 171, 180],
    answer: { min: 142, q1: 149.5, median: 158, q3: 169, max: 180 },
    scaleMin: 130, scaleMax: 190, unit: "Height (cm)",
    hint: "9 values — median is the 5th (158). Lower half is [142,148,151,155] → Q1 = (148+151)÷2. Upper half is [163,167,171,180] → Q3 = (167+171)÷2.",
    cumFreq: {
      totalFreq: 9,
      points: [[130,0],[142,1],[148,2],[151,3],[155,4],[158,5],[163,6],[167,7],[171,8],[180,9]],
    },
  },
  {
    id: "b2", label: "Practice",
    question: "Times (seconds) for 11 swimmers:",
    rawData: [34, 37, 39, 41, 43, 45, 48, 52, 55, 59, 64],
    answer: { min: 34, q1: 39, median: 45, q3: 55, max: 64 },
    scaleMin: 30, scaleMax: 70, unit: "Time (s)",
    hint: "11 values - the median is the 6th. Q1 is the 3rd, Q3 is the 9th.",
    cumFreq: {
      totalFreq: 11,
      points: [[30,0],[34,1],[37,2],[39,3],[41,4],[43,5],[45,6],[48,7],[52,8],[55,9],[59,10],[64,11]],
    },
  },
  {
    id: "b3", label: "Challenge",
    question: "Scores in a maths test for 13 students:",
    rawData: [12, 18, 22, 25, 28, 31, 34, 36, 41, 45, 48, 52, 58],
    answer: { min: 12, q1: 23.5, median: 34, q3: 46.5, max: 58 },
    scaleMin: 0, scaleMax: 70, unit: "Score (marks)",
    hint: "13 values — median is the 7th (34). Lower half is [12,18,22,25,28,31] → Q1 = (22+25)÷2. Upper half is [36,41,45,48,52,58] → Q3 = (45+48)÷2.",
    cumFreq: {
      totalFreq: 13,
      points: [[0,0],[12,1],[18,2],[22,3],[25,4],[28,5],[31,6],[34,7],[36,8],[41,9],[45,10],[48,11],[52,12],[58,13]],
    },
  },
];

export const TOLERANCE = 3;

// ── Exam: read the bar chart ──────────────────────────────────────────────
// Each question gives a frequency table (shown as a bar chart).
// The student uses the table to find the five-number summary, then draws the box plot.
// "bands" are the score ranges shown on the bar chart.
// "rows" are the frequency table rows used to work out cumulative positions.
export const BAR_CHART_QUESTIONS = [
  {
    id: "bc1",
    label: "Q10 - Daily steps",
    question: "The table shows the number of steps (in thousands) walked by 40 people in a day. Use the frequency table to find the minimum, Q1, median, Q3 and maximum, then draw the box plot.",
    context: "A fitness app is analysing how active its users are.",
    unit: "Steps (thousands)",
    scaleMin: 0, scaleMax: 25,
    totalFreq: 40,
    // Frequency table rows - each row is a class interval
    rows: [
      { interval: "0 < s ≤ 2",   freq: 2,  cumFreq: 2  },
      { interval: "2 < s ≤ 4",   freq: 4,  cumFreq: 6  },
      { interval: "4 < s ≤ 6",   freq: 5,  cumFreq: 11 },
      { interval: "6 < s ≤ 8",   freq: 7,  cumFreq: 18 },
      { interval: "8 < s ≤ 10",  freq: 8,  cumFreq: 26 },
      { interval: "10 < s ≤ 12", freq: 6,  cumFreq: 32 },
      { interval: "12 < s ≤ 14", freq: 5,  cumFreq: 37 },
      { interval: "14 < s ≤ 16", freq: 3,  cumFreq: 40 },
    ],
    // Five-number summary for the answer box plot
    answer: { min: 1, q1: 6, median: 9, q3: 12, max: 16 },
    // Step-by-step working shown in the reveal
    working: [
      { label: "Total frequency", value: "40 people" },
      { label: "Min", value: "1 thousand (smallest value in first interval)" },
      { label: "Q1 - position ¼ × 40 = 10th value", value: "Falls in 4 < s ≤ 6 interval → Q1 = 6" },
      { label: "Median - position ½ × 40 = 20th value", value: "Falls in 8 < s ≤ 10 interval → Median = 9" },
      { label: "Q3 - position ¾ × 40 = 30th value", value: "Falls in 10 < s ≤ 12 interval → Q3 = 12" },
      { label: "Max", value: "16 thousand (largest value in last interval)" },
    ],
    examTip: "With grouped data in a frequency table, find the position of Q1, Median and Q3 first (¼n, ½n, ¾n), then look at the cumulative frequency column to identify which interval that position falls in. The upper boundary of that interval gives you the value.",
  },
  {
    id: "bc2",
    label: "Q11 - Revision hours",
    question: "The bar chart shows how many hours 30 students spent revising for an exam. Use the frequency table to find the minimum, Q1, median, Q3 and maximum, then draw the box plot.",
    context: "A teacher is reviewing how much revision students did before their test.",
    unit: "Hours revising",
    scaleMin: 0, scaleMax: 20,
    totalFreq: 30,
    rows: [
      { interval: "0 < h ≤ 2",   freq: 1,  cumFreq: 1  },
      { interval: "2 < h ≤ 4",   freq: 3,  cumFreq: 4  },
      { interval: "4 < h ≤ 6",   freq: 5,  cumFreq: 9  },
      { interval: "6 < h ≤ 8",   freq: 7,  cumFreq: 16 },
      { interval: "8 < h ≤ 10",  freq: 6,  cumFreq: 22 },
      { interval: "10 < h ≤ 12", freq: 5,  cumFreq: 27 },
      { interval: "12 < h ≤ 14", freq: 2,  cumFreq: 29 },
      { interval: "14 < h ≤ 16", freq: 1,  cumFreq: 30 },
    ],
    answer: { min: 1, q1: 6, median: 8, q3: 11, max: 16 },
    working: [
      { label: "Total frequency", value: "30 students" },
      { label: "Min", value: "1 hour (smallest value in first interval)" },
      { label: "Q1 - position ¼ × 30 = 7.5, round up to 8th value", value: "Falls in 4 < h ≤ 6 interval → Q1 = 6" },
      { label: "Median - position ½ × 30 = 15th value", value: "Falls in 6 < h ≤ 8 interval → Median = 8" },
      { label: "Q3 - position ¾ × 30 = 22.5, round up to 23rd value", value: "Falls in 10 < h ≤ 12 interval → Q3 = 11" },
      { label: "Max", value: "16 hours (largest value in last interval)" },
    ],
    examTip: "If your position calculation gives a decimal (like 7.5), round up to the next whole number. So the 8th value tells you Q1.",
  },
];