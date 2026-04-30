// ── Raw plant height measurements (30 plants each) ────────────────────────
export const RAW_A = [
  8, 9, 10, 10, 10, 11, 13, 14, 14, 15, 15, 15, 15, 16, 19, 19, 20, 20, 20,
  21, 23, 24, 25, 25, 25, 26, 28, 29, 30, 38,
];

export const RAW_B = [
  11, 14, 15, 15, 16, 18, 18, 19, 20, 20, 21, 22, 23, 24, 25, 26, 26, 27, 28,
  29, 30, 30, 31, 31, 31, 32, 33, 34, 35, 41,
];

// ── Frequency table rows ──────────────────────────────────────────────────
export const ROWS_A = [
  { interval: "0-5",   freq: 0, cumFreq: 0  },
  { interval: "6-10",  freq: 5, cumFreq: 5  },
  { interval: "11-15", freq: 8, cumFreq: 13 },
  { interval: "16-20", freq: 8, cumFreq: 21 },
  { interval: "21-25", freq: 5, cumFreq: 26 },
  { interval: "26-30", freq: 3, cumFreq: 29 },
  { interval: "31-35", freq: 0, cumFreq: 29 },
  { interval: "36-40", freq: 1, cumFreq: 30 },
];

export const ROWS_B = [
  { interval: "0-5",   freq: 0, cumFreq: 0  },
  { interval: "6-10",  freq: 0, cumFreq: 0  },
  { interval: "11-15", freq: 4, cumFreq: 4  },
  { interval: "16-20", freq: 6, cumFreq: 10 },
  { interval: "21-25", freq: 5, cumFreq: 15 },
  { interval: "26-30", freq: 7, cumFreq: 22 },
  { interval: "31-35", freq: 7, cumFreq: 29 },
  { interval: "36-41", freq: 1, cumFreq: 30 },
];