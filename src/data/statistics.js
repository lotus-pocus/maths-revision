const statistics = [
  {
    id: "s1",
    title: "Box Plots",
    category: "statistics",
    strand: "Statistics",
    tier: "both", // Foundation and Higher
    calculator: "both", // appears on all three papers
    papers: [1,2,3],
    realWorldHook:
      "Two hospital wards. Same average waiting time. Completely different experience. A box plot shows the difference in seconds — a mean never could.",
    whyItMatters: null,
    points: [
      "A box plot (also called a box-and-whisker diagram) shows how a set of data is spread out using just 5 numbers.",
      "The 5 key values are: Minimum, Lower Quartile (Q1), Median (Q2), Upper Quartile (Q3), Maximum.",
      "The BOX covers the middle 50% of the data — from Q1 to Q3. This is called the Interquartile Range (IQR).",
      "The WHISKERS extend from the box out to the minimum and maximum values.",
      "The line inside the box marks the MEDIAN — the middle value of the whole data set.",
      "To find the median: put all values in order, then find the middle one.",
      "To find Q1: find the median of the lower half of the data (below the median).",
      "To find Q3: find the median of the upper half of the data (above the median).",
      "IQR = Q3 − Q1. A small IQR means data is tightly clustered. A large IQR means data is more spread out.",
      "Box plots are especially useful for COMPARING two sets of data side by side on the same scale.",
    ],
    workedExample: {
      title: "Drawing a box plot from a data set",
      intro:
        "Here are the scores 10 students got in a maths test (out of 50). Let's find all 5 values and draw the box plot.",
      data: "23, 31, 18, 45, 27, 38, 22, 41, 29, 35",
      steps: [
        {
          step: 1,
          instruction: "Put the data in order from smallest to largest.",
          working: "18, 22, 23, 27, 29, 31, 35, 38, 41, 45",
          tip: "Always do this first. You cannot find any quartiles without ordering the data.",
        },
        {
          step: 2,
          instruction: "Find the MINIMUM and MAXIMUM.",
          working: "Minimum = 18    Maximum = 45",
          tip: "These are simply the first and last values once the data is ordered.",
        },
        {
          step: 3,
          instruction: "Find the MEDIAN (Q2) — the middle value.",
          working:
            "10 values, so the median sits between the 5th and 6th values.\n5th value = 29, 6th value = 31\nMedian = (29 + 31) ÷ 2 = 30",
          tip: "With an even number of values, you always average the two middle ones. With an odd number, just take the middle one.",
        },
        {
          step: 4,
          instruction: "Find Q1 — the median of the LOWER half.",
          working:
            "Lower half (below the median): 18, 22, 23, 27, 29\nQ1 = middle value = 23",
          tip: "The lower half is everything below (not including) the median.",
        },
        {
          step: 5,
          instruction: "Find Q3 — the median of the UPPER half.",
          working:
            "Upper half (above the median): 31, 35, 38, 41, 45\nQ3 = middle value = 38",
          tip: "The upper half is everything above (not including) the median.",
        },
        {
          step: 6,
          instruction: "Calculate the IQR.",
          working: "IQR = Q3 − Q1 = 38 − 23 = 15",
          tip: "The IQR tells you how spread out the middle 50% of the data is. The smaller it is, the more consistent the group.",
        },
        {
          step: 7,
          instruction: "Summary of the 5 values to plot:",
          working: "Minimum = 18\nQ1 = 23\nMedian = 30\nQ3 = 38\nMaximum = 45",
          tip: "Draw a number line, mark all 5 points, draw a box from Q1 to Q3, a line at the median, and whiskers out to min and max.",
        },
      ],
    },
    comparingBoxPlots: {
      title: "Comparing two box plots — what to say",
      intro:
        "In the exam, you will often be shown two box plots and asked to compare them. You must comment on TWO things:",
      points: [
        "AVERAGE (median): Compare the median lines. 'Class A has a higher median (35) than Class B (28), so Class A performed better on average.'",
        "SPREAD (IQR or range): Compare how wide the boxes are. 'Class A has a smaller IQR (10) than Class B (22), so Class A's results were more consistent.'",
        "Always use actual numbers from the box plots in your answer — never just say 'higher' or 'more spread out' without quoting the values.",
      ],
    },
    terms: [
      {
        term: "Box plot",
        def: "A diagram that shows the spread of data using 5 values: minimum, Q1, median, Q3, maximum. Also called a box-and-whisker diagram.",
      },
      {
        term: "Median (Q2)",
        def: "The middle value of an ordered data set. Half the values are above it, half below.",
      },
      {
        term: "Lower Quartile (Q1)",
        def: "The median of the lower half of the data. 25% of values fall below Q1.",
      },
      {
        term: "Upper Quartile (Q3)",
        def: "The median of the upper half of the data. 75% of values fall below Q3.",
      },
      {
        term: "Interquartile Range (IQR)",
        def: "Q3 minus Q1. Measures how spread out the middle 50% of the data is. A smaller IQR = more consistent data.",
      },
      {
        term: "Range",
        def: "Maximum minus minimum. The total spread of the data. Can be misleading if there are extreme values (outliers).",
      },
      {
        term: "Outlier",
        def: "A value that is much higher or lower than the rest of the data. The IQR is a better measure of spread than range when outliers are present.",
      },
    ],
    formulas: [
      { id: "f-median-pos",  name: "Median position",          formula: "(n + 1) ÷ 2",              plain: "Find which position in the ordered list holds the median",          when: "Always — before you can find Q1 or Q3 you need the median position" },
      { id: "f-q1-split",   name: "Q1 — split method",         formula: "Median of the lower half",  plain: "Put data in order, split below the median, find the middle of that half", when: "Edexcel preferred method — use this in the exam" },
      { id: "f-q3-split",   name: "Q3 — split method",         formula: "Median of the upper half",  plain: "Put data in order, split above the median, find the middle of that half", when: "Edexcel preferred method — use this in the exam" },
      { id: "f-q1-pos",     name: "Q1 — position formula",     formula: "(n + 1) ÷ 4",              plain: "Gives the position of Q1 in the ordered list. If decimal, average those two positions", when: "Shortcut — useful for large lists like stem & leaf. Gives same answer as split method most of the time" },
      { id: "f-q3-pos",     name: "Q3 — position formula",     formula: "3 × (n + 1) ÷ 4",         plain: "Gives the position of Q3 in the ordered list. If decimal, average those two positions", when: "Shortcut — useful for large lists like stem & leaf. Gives same answer as split method most of the time" },
      { id: "f-iqr",        name: "Interquartile Range (IQR)", formula: "IQR = Q3 − Q1",            plain: "The spread of the middle 50% of the data",                          when: "Always calculate and quote it when comparing two box plots" },
      { id: "f-range",      name: "Range",                     formula: "Range = Max − Min",         plain: "The total spread of the data",                                      when: "Often asked alongside IQR — but beware outliers making it misleading" },
    ],
    examTip:
      "In the exam, comparing two box plots is more common than drawing one from scratch. Always comment on BOTH the median (average) AND the IQR (consistency/spread) — and always include the actual numbers. One mark is usually for a comparison with numbers, one for a conclusion ('therefore Class A was more consistent').",
    commonMistakes: [
      "Forgetting to ORDER the data before finding any quartile — this is the most common error.",
      "Including the median value itself when finding Q1 and Q3 — the median is NOT part of either half.",
      "Saying 'the data is more spread out' without quoting the IQR value — always use numbers.",
      "Confusing the range with the IQR — the range uses min and max; the IQR uses Q1 and Q3.",
    ],
  },
  {
    id: "s2",
    title: "Cumulative Frequency",
    category: "statistics",
    strand: "Statistics",
    tier: "both",
    calculator: "both", // appears on all three papers
    papers: [1,2,3],
    realWorldHook:
      "A shoe company wants to know what percentage of customers need size 8 or smaller, so they know how many to stock. A school wants to know how many students scored below the pass mark. Cumulative frequency answers 'how many are below this value?' — and that's an incredibly useful question in the real world.",
    whyItMatters:
      "Cumulative frequency builds up a running total so you can read off 'how many values are below X' for any X. It also lets you estimate the median and quartiles from grouped data — which is when you only have data in groups (like '20–30 marks') rather than every individual value.",
    points: [
      "Cumulative frequency means 'running total' — you add up frequencies as you go.",
      "To build a cumulative frequency table: add each frequency to the total of all the ones before it.",
      "Plot cumulative frequency on a graph: the x-axis shows the value, the y-axis shows the cumulative frequency.",
      "ALWAYS plot the point at the UPPER END of each class interval — not the middle.",
      "Join the points with a smooth S-shaped curve (not straight lines between points).",
      "From the graph you can estimate: the Median (at ½ × total frequency), Q1 (at ¼ × total), Q3 (at ¾ × total).",
      "The IQR can then be found: Q3 − Q1.",
      "A cumulative frequency curve always goes UP (never down) — if yours goes down, you've made an error.",
    ],
    workedExample: {
      title: "Building and reading a cumulative frequency table",
      intro:
        "40 students took a test. Here are the results in a grouped frequency table.",
      data: "Marks 0–10: 3 students | Marks 10–20: 7 students | Marks 20–30: 12 students | Marks 30–40: 11 students | Marks 40–50: 7 students",
      steps: [
        {
          step: 1,
          instruction: "Build the cumulative frequency column.",
          working:
            "0–10:  CF = 3\n10–20: CF = 3 + 7 = 10\n20–30: CF = 10 + 12 = 22\n30–40: CF = 22 + 11 = 33\n40–50: CF = 33 + 7 = 40",
          tip: "The last cumulative frequency should always equal the total number of values (here: 40). If it doesn't, you've made an addition error.",
        },
        {
          step: 2,
          instruction: "Plot the points. Use the UPPER bound of each class.",
          working:
            "Plot: (10, 3), (20, 10), (30, 22), (40, 33), (50, 40)\nDo NOT start at (0, 3) — start the curve from (0, 0).",
          tip: "The upper bound of '0–10' is 10, of '10–20' is 20, and so on.",
        },
        {
          step: 3,
          instruction: "Find the MEDIAN from the graph.",
          working:
            "Median is at ½ × 40 = 20th value.\nRead across from 20 on the y-axis → approximately 29 marks.",
          tip: "Draw a horizontal line from the y-axis value across to the curve, then drop straight down to read the x-axis value.",
        },
        {
          step: 4,
          instruction: "Find Q1 and Q3.",
          working:
            "Q1 is at ¼ × 40 = 10th value → approximately 20 marks.\nQ3 is at ¾ × 40 = 30th value → approximately 37 marks.",
          tip: null,
        },
        {
          step: 5,
          instruction: "Calculate the IQR.",
          working: "IQR = Q3 − Q1 = 37 − 20 = 17 marks",
          tip: null,
        },
      ],
    },
    terms: [
      {
        term: "Cumulative frequency",
        def: "A running total of frequencies. After each class interval, you add that frequency to the total so far.",
      },
      {
        term: "Class interval",
        def: "A group of values in a frequency table, e.g. '20–30 marks'. The upper bound is the top of the interval.",
      },
      {
        term: "Upper bound",
        def: "The highest value in a class interval. This is what you plot on the x-axis for a cumulative frequency graph.",
      },
      {
        term: "S-curve",
        def: "The shape of a cumulative frequency graph — starts shallow, steepens in the middle, then flattens at the top.",
      },
    ],
    formulas: [
      { id: "f-cf-median",  name: "Median from CF graph",  formula: "Read at ½ × n on y-axis",   plain: "Go to half the total frequency on the y-axis, read across to the curve, drop down to x-axis", when: "Reading median from a cumulative frequency graph" },
      { id: "f-cf-q1",      name: "Q1 from CF graph",      formula: "Read at ¼ × n on y-axis",   plain: "Go to a quarter of the total frequency on the y-axis",               when: "Reading Q1 from a cumulative frequency graph" },
      { id: "f-cf-q3",      name: "Q3 from CF graph",      formula: "Read at ¾ × n on y-axis",   plain: "Go to three-quarters of the total frequency on the y-axis",          when: "Reading Q3 from a cumulative frequency graph" },
      { id: "f-cf-iqr",     name: "IQR",                   formula: "IQR = Q3 − Q1",             plain: "The spread of the middle 50% — calculated after reading Q1 and Q3",   when: "Almost always asked after reading a cumulative frequency graph" },
    ],
    examTip:
      "The most common error is plotting cumulative frequency at the midpoint of the class interval instead of the upper bound. Always use the upper bound. Also make sure your curve starts at (0, 0) and is smooth — not angular.",
    commonMistakes: [
      "Plotting at the midpoint of the class (e.g. plotting at 15 instead of 20 for the class 10–20).",
      "Not starting the curve from zero — it must begin at (0, 0).",
      "Reading the wrong value on the y-axis when finding the median — it's ½ × total, not the middle class.",
      "Drawing straight lines between points instead of a smooth curve.",
    ],
  },
  {
    id: "s3",
    title: "Histograms",
    category: "statistics",
    strand: "Statistics",
    tier: "higher", // Higher only
    calculator: "both", // appears on all three papers
    papers: [1,2,3],
    realWorldHook:
      "Speed cameras record how fast every car passes. Traffic engineers use histograms to show the distribution of speeds — not just how many cars sped, but how badly they sped. A histogram shows the SHAPE of data, not just the total. Insurance companies, scientists, and engineers use them constantly.",
    whyItMatters:
      "Unlike a bar chart, a histogram is used for continuous data in unequal class widths. The key difference: in a histogram, it is the AREA of each bar that represents frequency — not the height. This is where most students go wrong.",
    points: [
      "Histograms look like bar charts but there are NO GAPS between bars — the data is continuous.",
      "The y-axis on a histogram shows FREQUENCY DENSITY, not frequency.",
      "Frequency Density = Frequency ÷ Class Width",
      "This means wider bars are automatically shorter (to keep the area correct).",
      "To find the frequency from a histogram: Frequency = Frequency Density × Class Width",
      "The AREA of each bar represents the frequency for that class.",
      "All class widths must be checked individually — do not assume they are all equal.",
    ],
    workedExample: {
      title: "Drawing and reading a histogram",
      intro:
        "The ages of 60 people at a cinema are recorded. Calculate frequency density for each group.",
      data: "0–10: 6 people | 10–20: 15 people | 20–40: 24 people | 40–70: 15 people",
      steps: [
        {
          step: 1,
          instruction: "Find the class width for each group.",
          working:
            "0–10: width = 10\n10–20: width = 10\n20–40: width = 20\n40–70: width = 30",
          tip: "Class widths are NOT all the same here — this is exactly why we use frequency density instead of frequency.",
        },
        {
          step: 2,
          instruction: "Calculate Frequency Density = Frequency ÷ Class Width.",
          working:
            "0–10:  6 ÷ 10 = 0.6\n10–20: 15 ÷ 10 = 1.5\n20–40: 24 ÷ 20 = 1.2\n40–70: 15 ÷ 30 = 0.5",
          tip: "The 20–40 group has more people than the 40–70 group, but a narrower bar. Frequency density makes this fair.",
        },
        {
          step: 3,
          instruction:
            "Plot the histogram with frequency density on the y-axis.",
          working:
            "Draw bars with NO GAPS.\nBar heights: 0.6, 1.5, 1.2, 0.5\nBar widths match class widths: 10, 10, 20, 30",
          tip: "The tallest bar is NOT necessarily the most common group — always check by calculating Area = FD × Width.",
        },
        {
          step: 4,
          instruction: "Check: area of each bar should equal its frequency.",
          working:
            "0–10: 0.6 × 10 = 6 ✓\n10–20: 1.5 × 10 = 15 ✓\n20–40: 1.2 × 20 = 24 ✓\n40–70: 0.5 × 30 = 15 ✓\nTotal = 60 ✓",
          tip: "This is your built-in check. If areas don't add up to the total frequency, something went wrong.",
        },
      ],
    },
    terms: [
      {
        term: "Histogram",
        def: "A diagram for continuous data where the AREA of each bar represents frequency. No gaps between bars.",
      },
      {
        term: "Frequency Density",
        def: "Frequency ÷ Class Width. This is what goes on the y-axis of a histogram.",
      },
      {
        term: "Class width",
        def: "The size of each group in a frequency table, e.g. the class '20–40' has a width of 20.",
      },
      {
        term: "Continuous data",
        def: "Data that can take any value in a range — like height, weight, time, age. Histograms are used for continuous data.",
      },
    ],
    formulas: [
      { id: "f-fd",         name: "Frequency Density",     formula: "FD = Frequency ÷ Class Width",          plain: "What goes on the y-axis of a histogram",                            when: "Drawing a histogram — calculate FD for each bar" },
      { id: "f-freq",       name: "Frequency from FD",     formula: "Frequency = FD × Class Width",          plain: "Find the number of values in a class from the histogram",            when: "Reading a histogram — finding how many are in a group" },
      { id: "f-cw",         name: "Class Width",           formula: "Class Width = Frequency ÷ FD",          plain: "Find the width of a bar if you know frequency and FD",               when: "Completing a partly-drawn histogram with missing widths" },
    ],
    examTip:
      "The formula triangle helps: Frequency = FD × Width, FD = Frequency ÷ Width, Width = Frequency ÷ FD. In the exam you may be given a partly-drawn histogram and asked to complete it, or given a histogram and asked to find a frequency — both use the same formula.",
    commonMistakes: [
      "Putting frequency (not frequency density) on the y-axis.",
      "Leaving gaps between bars — histograms have no gaps.",
      "Assuming all class widths are the same without checking.",
      "Confusing histograms with bar charts — bar charts are for discrete/categorical data; histograms for continuous data.",
    ],
  },
  {
    id: "s4",
    title: "Scatter Graphs and Correlation",
    category: "statistics",
    strand: "Statistics",
    tier: "both",
    calculator: "both", // appears on all three papers
    papers: [1,2,3],
    realWorldHook:
      "Scientists used scatter graphs to discover the link between smoking and lung cancer. Estate agents use them to show the relationship between house size and price. Sports analysts use them to explore whether training hours relate to performance. Whenever you want to ask 'does more of X mean more (or less) of Y?', a scatter graph is the tool.",
    whyItMatters:
      "A scatter graph shows whether two variables are related (correlated). Understanding correlation is a core skill across science, geography, and maths — and recognising when correlation does NOT mean causation is just as important.",
    points: [
      "A scatter graph plots two variables against each other — one on the x-axis, one on the y-axis.",
      "Each point represents one item (e.g. one student, one country, one day).",
      "POSITIVE correlation: as x increases, y increases. Points slope upward left to right.",
      "NEGATIVE correlation: as x increases, y decreases. Points slope downward left to right.",
      "NO correlation: points are scattered randomly — no clear pattern.",
      "The strength of correlation: STRONG (points close to a line), WEAK (points more scattered).",
      "A LINE OF BEST FIT is a straight line drawn through the middle of the points — equal numbers of points above and below.",
      "The line of best fit can be used to make PREDICTIONS — but only within the range of the data (interpolation). Predicting beyond the data (extrapolation) is unreliable.",
      "CORRELATION does not mean CAUSATION — two things can be correlated without one causing the other.",
    ],
    terms: [
      {
        term: "Scatter graph",
        def: "A graph that plots two variables to show whether there is a relationship (correlation) between them.",
      },
      {
        term: "Positive correlation",
        def: "As one variable increases, the other also increases. The points slope upward.",
      },
      {
        term: "Negative correlation",
        def: "As one variable increases, the other decreases. The points slope downward.",
      },
      {
        term: "Line of best fit",
        def: "A straight line drawn through the middle of scatter graph points — used to describe the trend and make predictions.",
      },
      {
        term: "Interpolation",
        def: "Using the line of best fit to predict a value WITHIN the range of the data. More reliable.",
      },
      {
        term: "Extrapolation",
        def: "Using the line of best fit to predict a value OUTSIDE the range of the data. Less reliable.",
      },
      {
        term: "Causation",
        def: "When one variable directly causes a change in another. Correlation does not prove causation.",
      },
    ],
    formulas: [
      { id: "f-sc-none", name: "No calculation formulas", formula: "Describe strength + direction", plain: "Scatter graphs are about describing correlation, not calculating it", when: "Always use two words: e.g. 'strong positive correlation'" },
    ],
    examTip:
      "Always describe correlation using TWO words — strength AND direction. 'Strong positive correlation' scores more than just 'positive correlation'. And if asked whether the line of best fit can be used to predict a value outside the data range, the answer is always: yes, but it is unreliable (extrapolation).",
    commonMistakes: [
      "Drawing the line of best fit starting from the origin (0,0) — it does not have to pass through the origin.",
      "Describing correlation as just 'positive' without commenting on strength.",
      "Saying correlation proves causation — it does not.",
      "Joining the dots like a line graph instead of drawing a line of best fit.",
    ],
  },
  {
    id: "s5",
    title: "Averages — Mean, Median, Mode and Range",
    category: "statistics",
    strand: "Statistics",
    tier: "both",
    calculator: "non-calc", // more common on Paper 1 (non-calculator), but can appear on any
    papers: [1],
    realWorldHook:
      "When the news says 'the average UK salary is £35,000', they're using the mean. But if a few billionaires are included, that figure is misleading — the median would tell a more honest story. Choosing the RIGHT average matters enormously in business, politics, and science.",
    whyItMatters:
      "The three averages each tell you something different. Knowing WHICH one to use — and why — is just as important as knowing how to calculate them.",
    points: [
      "MEAN: add all values, divide by how many there are. Best for evenly spread data with no extreme values.",
      "MEDIAN: the middle value when data is ordered. Best when there are extreme values (outliers) that would skew the mean.",
      "MODE: the most common value. Best for categorical data (e.g. favourite colour) or when you need the most popular option.",
      "RANGE: maximum minus minimum. Measures the spread of the data — not an average, but often asked alongside averages.",
      "MEAN from a frequency table: multiply each value by its frequency, add all results, divide by total frequency.",
      "MEAN from grouped data: use the MIDPOINT of each class, multiply by frequency, add up, divide by total frequency. This gives an ESTIMATE of the mean.",
      "The mean is affected by outliers (extreme values). The median is not.",
      "In a symmetrical distribution, mean = median = mode. In a skewed distribution, they differ.",
    ],
    terms: [
      {
        term: "Mean",
        def: "The sum of all values divided by the number of values. The most common type of average but affected by outliers.",
      },
      {
        term: "Median",
        def: "The middle value when data is arranged in order. Not affected by extreme values.",
      },
      {
        term: "Mode",
        def: "The value that appears most often. A data set can have more than one mode, or no mode.",
      },
      {
        term: "Range",
        def: "Maximum minus minimum. Describes how spread out the data is.",
      },
      {
        term: "Outlier",
        def: "A value that is much higher or lower than the others. Outliers pull the mean toward them but do not affect the median.",
      },
      {
        term: "Midpoint",
        def: "The middle value of a class interval. Used when estimating the mean from grouped data.",
      },
    ],
    formulas: [
      { id: "f-mean",       name: "Mean",                       formula: "Mean = Σx ÷ n",                           plain: "Add all values, divide by how many there are",                        when: "Finding the average of a list of values" },
      { id: "f-mean-freq",  name: "Mean from frequency table",  formula: "Mean = Σ(x × f) ÷ Σf",                   plain: "Multiply each value by its frequency, add up, divide by total frequency", when: "When given a frequency table" },
      { id: "f-mean-group", name: "Estimated mean (grouped)",   formula: "Mean ≈ Σ(midpoint × f) ÷ Σf",            plain: "Use class midpoints instead of exact values — gives an estimate",      when: "When data is in groups (e.g. 20–30 marks)" },
      { id: "f-midpoint",   name: "Class midpoint",             formula: "Midpoint = (lower + upper) ÷ 2",         plain: "The middle value of a class interval",                                 when: "Needed before calculating estimated mean from grouped data" },
      { id: "f-range-avg",  name: "Range",                      formula: "Range = Max − Min",                       plain: "The total spread of the data",                                         when: "Measuring spread alongside an average" },
      { id: "f-median-pos2",name: "Median position",            formula: "(n + 1) ÷ 2",                             plain: "Which position in the ordered list is the median",                     when: "Finding the median — order data first" },
    ],
    examTip:
      "If the exam asks 'which average best represents this data?' — look for outliers. If there are extreme values, the median is the better choice and you must say WHY: 'The median is more appropriate because the mean is affected by the outlier of [value].' Always name the outlier.",
    commonMistakes: [
      "Forgetting to order the data before finding the median.",
      "With an even number of values, taking one of the two middle values instead of averaging them both.",
      "Using the wrong midpoint in grouped frequency tables — always check: (lower bound + upper bound) ÷ 2.",
      "Confusing the range with the IQR — range is max minus min; IQR is Q3 minus Q1.",
    ],
  },
  {
    id: "s6",
    title: "Charts and Graphs",
    category: "statistics",
    strand: "Statistics",
    tier: "both",
    calculator: "non-calc",
    papers: [1, 2, 3],
    realWorldHook:
      "Charts and graphs are how data is communicated in the real world — from newspaper headlines to government statistics. Choosing the right type of chart for the right type of data is a skill examiners test directly.",
    whyItMatters:
      "You need to be able to read, interpret and draw several types of chart. They also appear as the starting point for other questions — a stem and leaf diagram might be the source data for a box plot question, or a pie chart might lead into a probability question.",
    points: [
      "A PIE CHART shows proportions. Each sector's angle = (frequency ÷ total) × 360°. Angles must add up to 360°.",
      "A BAR CHART shows frequency for discrete or categorical data. Bars are separate with gaps between them.",
      "A STEM AND LEAF DIAGRAM splits values into a stem (tens digit) and a leaf (units digit). Always check the key first — e.g. '2 | 7 represents 27'. Each leaf is a separate value: '2 | 4 5 6' means 24, 25, 26.",
      "Stem and leaf leaves must be written in order, smallest to largest. This means the data is already sorted — useful for finding the median.",
      "A BACK-TO-BACK stem and leaf diagram shows two groups sharing the same stem — leaves go left for one group, right for the other. Used to compare two groups visually.",
      "A FREQUENCY POLYGON is drawn by plotting frequency at the midpoint of each class and joining with straight lines.",
      "Always label axes, include a title, and use a ruler for straight-line graphs.",
    ],
    terms: [
      { term: "Stem", def: "The left column of a stem and leaf diagram — usually the tens digit. Shared by all leaves in that row." },
      { term: "Leaf", def: "Each digit to the right of the stem in a stem and leaf diagram — the units digit. Each leaf = one data value." },
      { term: "Key (stem and leaf)", def: "Tells you how to read a stem and leaf diagram. e.g. '2 | 4 represents 24'. Always check it first." },
      { term: "Back-to-back stem and leaf", def: "Two datasets sharing the same stem. Leaves go left for one group, right for the other. Used to compare two groups." },
      { term: "Sector", def: "A slice of a pie chart. Its angle is proportional to the frequency it represents." },
      { term: "Frequency polygon", def: "A line graph for grouped frequency data — points plotted at class midpoints and joined with straight lines." },
    ],
    formulas: [
      { id: "f-pie-angle",  name: "Pie chart sector angle", formula: "(frequency ÷ total) × 360°", plain: "Convert a frequency into an angle for a pie chart sector", when: "Drawing a pie chart" },
      { id: "f-pie-freq",   name: "Frequency from pie chart", formula: "(angle ÷ 360°) × total", plain: "Work backwards from a sector angle to find the frequency", when: "Reading a pie chart when total is given" },
      { id: "f-sl-prob",    name: "Probability from a chart", formula: "P = count ÷ total", plain: "Count values meeting the condition, divide by total", when: "Probability questions based on chart data" },
    ],
    examTip:
      "For pie charts, always show your angle calculation — even if you use a protractor. For stem and leaf, check the key before doing anything else and count the total number of leaves to verify it matches the question.",
    commonMistakes: [
      "Pie chart angles not adding up to 360° — always check your total before drawing.",
      "Using frequency instead of frequency density on histogram y-axes (covered in Histograms topic).",
      "In stem and leaf: ignoring the key, or reading '3 | 1 2 5' as 31 and 25 instead of 31, 32, 35.",
      "In back-to-back diagrams: reading the left-hand leaves in the wrong direction.",
      "Drawing bar charts with no gaps (that makes them look like histograms — different thing).",
    ],
  },
  {
    id: "s7",
    title: "Probability Basics",
    category: "statistics",
    strand: "Probability",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook: "Weather forecasts, insurance premiums, sports betting — all built on probability. Understanding it means understanding risk.",
    whyItMatters: "Probability appears on every paper. The basics underpin tree diagrams, Venn diagrams and the AND/OR rules.",
    points: [
      "Probability is always between 0 (impossible) and 1 (certain).",
      "P(event) = number of favourable outcomes ÷ total number of possible outcomes.",
      "Probabilities of all mutually exclusive outcomes add up to 1.",
      "P(event does NOT happen) = 1 − P(event happens).",
      "Relative frequency (experimental probability) = number of times it happened ÷ total trials.",
      "The more trials, the closer relative frequency gets to theoretical probability.",
    ],
    terms: [
      { term: "Probability", def: "A number between 0 and 1 measuring how likely an event is. 0 = impossible, 1 = certain." },
      { term: "Outcome", def: "A possible result of a probability experiment." },
      { term: "Event", def: "One or more outcomes we are interested in." },
      { term: "Mutually exclusive", def: "Events that cannot happen at the same time. Their probabilities add up to 1." },
      { term: "Relative frequency", def: "Experimental probability — how often something happened divided by how many trials were run." },
      { term: "Sample space", def: "The set of all possible outcomes. Often shown as a list or a sample space diagram." },
    ],
    formulas: [
      { id: "f-prob-basic",   name: "Basic probability",          formula: "P(A) = favourable ÷ total",    plain: "Divide the number of ways A can happen by the total outcomes",      when: "Any basic probability question" },
      { id: "f-prob-comp",    name: "Complementary probability",  formula: "P(not A) = 1 − P(A)",          plain: "Subtract from 1 to find the probability it does NOT happen",        when: "Finding the probability of the opposite event" },
      { id: "f-prob-rel",     name: "Relative frequency",         formula: "freq ÷ trials",                plain: "Experimental estimate of probability from repeated trials",           when: "Probability from an experiment or survey" },
    ],
    examTip: "Always check your probabilities add up to 1. If the question says 'show that' or 'explain', you need a sentence — not just a number.",
    commonMistakes: [
      "Writing probability as a percentage or ratio instead of a fraction/decimal.",
      "Forgetting that P(not A) = 1 − P(A).",
      "Assuming equal likelihood when outcomes aren't equally likely.",
    ],
  },
  {
    id: "s8",
    title: "The AND / OR Rules and Tree Diagrams",
    category: "statistics",
    strand: "Probability",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook: "What's the chance of two buses being late? Or at least one of two machines breaking down? AND/OR rules and tree diagrams answer these compound questions.",
    whyItMatters: "Multi-step probability questions — with or without replacement — are a reliable Higher exam topic. Tree diagrams make the structure visible.",
    points: [
      "AND rule (independent events): P(A and B) = P(A) × P(B). Multiply along branches.",
      "OR rule (mutually exclusive events): P(A or B) = P(A) + P(B). Add the probabilities.",
      "A tree diagram shows two or more events as branches. Each branch shows the probability of that outcome.",
      "Probabilities on branches from the same point must add up to 1.",
      "To find the probability of a path through the tree: multiply along the branches.",
      "To find the probability of multiple paths (OR): add the path probabilities.",
      "WITHOUT replacement: the second probability changes because there is one fewer item.",
    ],
    terms: [
      { term: "Independent events", def: "Events where the outcome of one does not affect the other. e.g. flipping a coin twice." },
      { term: "Dependent events", def: "Events where the outcome of one affects the probability of the other. e.g. picking two counters without replacement." },
      { term: "Without replacement", def: "Once an item is chosen it is not put back, so the total and probabilities change for the next pick." },
      { term: "Tree diagram", def: "A diagram showing all possible outcomes of two or more events as branches, with probabilities on each branch." },
    ],
    formulas: [
      { id: "f-and",  name: "AND rule",  formula: "P(A and B) = P(A) × P(B)", plain: "Multiply probabilities along branches of a tree diagram", when: "Both events need to happen" },
      { id: "f-or",   name: "OR rule",   formula: "P(A or B) = P(A) + P(B)",  plain: "Add probabilities for mutually exclusive outcomes",       when: "Either event happening (mutually exclusive)" },
    ],
    examTip: "Label every branch with its probability. Always check each set of branches adds to 1. For 'without replacement' questions, the denominator decreases by 1 for the second pick.",
    commonMistakes: [
      "Adding instead of multiplying along branches.",
      "Forgetting to adjust denominators for 'without replacement' questions.",
      "Not adding all the successful paths at the end for OR questions.",
    ],
  },
  {
    id: "s9",
    title: "Venn Diagrams and Sets",
    category: "statistics",
    strand: "Probability",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook: "Used in data science, logic, and computer programming to classify and filter overlapping groups.",
    whyItMatters: "Venn diagrams combine set notation with probability — both are tested directly at GCSE. The notation looks intimidating but follows simple rules.",
    points: [
      "A Venn diagram shows two or more overlapping circles inside a rectangle (the universal set ξ).",
      "The INTERSECTION (A ∩ B) is the overlap — values that belong to both sets.",
      "The UNION (A ∪ B) is everything in either set or both.",
      "A' means NOT A — everything outside set A.",
      "Values outside all circles but inside the rectangle belong to neither set.",
      "All frequencies in a Venn diagram must add up to the total.",
    ],
    terms: [
      { term: "Universal set (ξ)", def: "The rectangle containing all elements being considered." },
      { term: "Intersection (A ∩ B)", def: "Elements that belong to BOTH set A and set B — the overlap region." },
      { term: "Union (A ∪ B)", def: "Elements that belong to set A OR set B or both." },
      { term: "Complement (A')", def: "Everything NOT in set A — all elements outside the A circle." },
    ],
    formulas: [
      { id: "f-venn-prob", name: "Probability from Venn diagram", formula: "P(A) = n(A) ÷ n(ξ)", plain: "Count values in the region, divide by total in the universal set", when: "Any probability question using a Venn diagram" },
      { id: "f-union",     name: "Union formula",                 formula: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", plain: "Add both sets then subtract the overlap (counted twice)", when: "Finding the total in either set" },
    ],
    examTip: "Fill in the intersection FIRST, then work outwards. Always check everything adds up to the total before answering probability questions.",
    commonMistakes: [
      "Putting the intersection value in both circles AND the overlap — it only goes in the overlap.",
      "Forgetting elements that belong to neither set — they go in the rectangle outside both circles.",
      "Confusing A ∩ B (AND) with A ∪ B (OR).",
    ],
  },
  {
    id: "s10",
    title: "Sampling and Collecting Data",
    category: "statistics",
    strand: "Statistics",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook: "Political polls, medical trials, market research — all rely on sampling. A badly designed sample can produce completely misleading results.",
    whyItMatters: "Questions on sampling and bias are often 2–3 marks of written explanation. You need to know the vocabulary and be able to critique a method.",
    points: [
      "A SAMPLE is a subset of the population used to draw conclusions about the whole.",
      "RANDOM SAMPLING gives every member an equal chance of being selected — reduces bias.",
      "STRATIFIED SAMPLING divides the population into groups and samples from each in proportion.",
      "BIAS occurs when the sample doesn't fairly represent the population.",
      "A good questionnaire uses response options that don't overlap, cover all possibilities, and avoid leading questions.",
    ],
    terms: [
      { term: "Population", def: "The whole group being studied." },
      { term: "Sample", def: "A subset of the population selected to represent the whole." },
      { term: "Bias", def: "When a sample or method systematically favours certain outcomes, making results unrepresentative." },
      { term: "Random sample", def: "Every member of the population has an equal chance of being selected." },
      { term: "Stratified sample", def: "The population is divided into groups (strata) and members are selected from each group in proportion to its size." },
    ],
    formulas: [
      { id: "f-strat", name: "Stratified sample size", formula: "(group size ÷ total) × sample size", plain: "Find how many to select from each group proportionally", when: "Stratified sampling questions" },
    ],
    examTip: "When asked to 'criticise' a sampling method, always say WHO is excluded and WHY that makes it biased — not just 'it's not random'.",
    commonMistakes: [
      "Saying a sample is biased without explaining who is over or under-represented.",
      "Rounding stratified sample sizes so they no longer add up to the total sample size.",
      "Confusing sample size with sample method — a large sample can still be biased.",
    ],
  },
];

export default statistics;