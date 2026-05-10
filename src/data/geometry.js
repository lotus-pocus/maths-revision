const geometry = [
  {
    id: "g1",
    title: "Angle Rules",
    category: "geometry",
    strand: "Geometry",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook:
      "Architects use angle rules every time they design a building. Roof trusses, staircase gradients, bridge spans — all rely on the same basic rules you need before tackling circle theorems.",
    whyItMatters:
      "These are the building blocks of all geometry at GCSE. You cannot solve circle theorem questions without these being automatic.",
    points: [
      "Angles on a straight line add up to 180°.",
      "Angles around a point add up to 360°.",
      "Vertically opposite angles are equal — they are the angles directly across from each other when two lines cross.",
      "Angles in a triangle add up to 180°.",
      "Angles in a quadrilateral (any 4-sided shape) add up to 360°.",
      "An isosceles triangle has two equal sides AND two equal base angles.",
      "An equilateral triangle has three equal sides and three equal angles of 60° each.",
      "Alternate angles (Z-angles) are equal — formed between parallel lines.",
      "Co-interior angles (C-angles) add up to 180° — formed between parallel lines on the same side.",
      "Corresponding angles (F-angles) are equal — formed between parallel lines on the same side of the transversal.",
    ],
    workedExample: {
      title: "Finding a missing angle using angle rules",
      intro:
        "Two straight lines cross. One angle is 47°. Find the other three angles.",
      data: null,
      steps: [
        {
          step: 1,
          instruction: "Identify the vertically opposite angle.",
          working:
            "The angle directly opposite 47° is also 47°.\n(Vertically opposite angles are equal.)",
          tip: "Vertically opposite angles are the ones that share a vertex but no sides.",
        },
        {
          step: 2,
          instruction: "Find the angles on the straight line.",
          working:
            "Angles on a straight line sum to 180°.\n180° − 47° = 133°\nBoth remaining angles are 133°.",
          tip: "Check: 47° + 133° + 47° + 133° = 360° ✓ (angles around a point).",
        },
      ],
    },
    terms: [
      {
        term: "Vertically opposite angles",
        def: "The pair of equal angles formed directly across from each other when two straight lines cross.",
      },
      {
        term: "Alternate angles",
        def: "Equal angles formed on opposite sides of a transversal crossing two parallel lines. They make a Z-shape.",
      },
      {
        term: "Co-interior angles",
        def: "Angles on the same side of a transversal between two parallel lines. They add up to 180°. They make a C-shape.",
      },
      {
        term: "Corresponding angles",
        def: "Equal angles in the same position at each intersection when a transversal crosses parallel lines. They make an F-shape.",
      },
      {
        term: "Isosceles triangle",
        def: "A triangle with exactly two equal sides. The base angles (opposite the equal sides) are also equal.",
      },
      {
        term: "Transversal",
        def: "A line that crosses two or more parallel lines.",
      },
    ],
    examTip:
      "Always state which angle rule you are using when showing your working — examiners award marks for the reason, not just the number. Write things like 'angles on a straight line = 180°' or 'vertically opposite angles are equal'.",
    commonMistakes: [
      "Confusing alternate and co-interior angles — alternate are equal, co-interior add to 180°.",
      "Forgetting that isosceles triangles have two equal BASE angles, not just two equal sides.",
      "Adding angles in a quadrilateral to 180° instead of 360°.",
      "Not showing the angle rule used — this loses method marks in the exam.",
    ],
  },
  {
    id: "g2",
    title: "Parts of a Circle",
    category: "geometry",
    strand: "Geometry",
    tier: "both",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook:
      "Every wheel, every clock face, every roundabout is a circle. The language of circle geometry appears in engineering, design and navigation — and in every circle theorem question your daughter will face.",
    whyItMatters:
      "You cannot answer circle theorem questions if you don't know what a chord, tangent or arc is. This is pure vocabulary — learn it cold before moving on.",
    points: [
      "The CENTRE is the middle point of the circle. Every radius starts here.",
      "The RADIUS is any straight line from the centre to the circumference. All radii are equal.",
      "The DIAMETER is a chord that passes through the centre. Diameter = 2 × radius.",
      "The CIRCUMFERENCE is the perimeter — the full distance around the circle.",
      "A CHORD is any straight line joining two points on the circumference. It does not have to pass through the centre.",
      "An ARC is a portion of the circumference — like a piece of the edge of the circle.",
      "A TANGENT is a straight line that touches the circumference at exactly one point. It is always perpendicular (90°) to the radius at that point.",
      "A SECTOR is a 'pizza slice' shape — bounded by two radii and an arc.",
      "A SEGMENT is the region between a chord and an arc.",
      "A CYCLIC QUADRILATERAL is a quadrilateral where all four vertices lie on the circumference of a circle.",
    ],
    workedExample: null,
    terms: [
      {
        term: "Radius",
        def: "A straight line from the centre of a circle to any point on its circumference. All radii of a circle are equal.",
      },
      {
        term: "Diameter",
        def: "A chord that passes through the centre of the circle. It is twice the length of the radius.",
      },
      {
        term: "Chord",
        def: "A straight line joining any two points on the circumference of a circle.",
      },
      {
        term: "Tangent",
        def: "A straight line that touches a circle at exactly one point. It is always perpendicular to the radius at the point of contact.",
      },
      {
        term: "Arc",
        def: "A portion of the circumference of a circle.",
      },
      {
        term: "Sector",
        def: "The region bounded by two radii and an arc — shaped like a pizza slice.",
      },
      {
        term: "Segment",
        def: "The region between a chord and the arc it cuts off.",
      },
      {
        term: "Circumference",
        def: "The total distance around the outside of a circle — its perimeter.",
      },
      {
        term: "Cyclic quadrilateral",
        def: "A quadrilateral whose four vertices all lie on the circumference of a circle.",
      },
    ],
    examTip:
      "In the exam, questions will use these words without defining them. If you see 'tangent', picture the line touching at one point at 90° to the radius. If you see 'chord', picture any line cutting across the circle.",
    commonMistakes: [
      "Confusing a chord with a diameter — a diameter is a special chord that passes through the centre.",
      "Confusing a segment with a sector — a sector has two straight sides (radii), a segment has one straight side (a chord).",
      "Forgetting that a tangent meets the radius at exactly 90°.",
    ],
  },
  {
    id: "g3",
    title: "Circle Theorems",
    category: "geometry",
    strand: "Geometry",
    tier: "higher",
    calculator: "both",
    papers: [1, 2, 3],
    realWorldHook:
      "Circle theorems were first proved by ancient Greek mathematicians over 2,000 years ago. Today they underpin the mathematics behind GPS systems, satellite dish design, and the circular motion of planetary orbits.",
    whyItMatters:
      "Circle theorems are a Higher-only topic typically worth 4–6 marks on the Edexcel paper. The seven theorems are fixed facts — once you know them and can spot which one applies, these become reliable marks.",
    points: [
      "THEOREM 1 — Angle at centre: The angle at the centre of a circle is TWICE the angle at the circumference, when both are subtended by the same arc.",
      "THEOREM 2 — Angles in the same segment: Angles subtended by the same chord at the circumference (on the same side) are EQUAL.",
      "THEOREM 3 — Angle in a semicircle: The angle in a semicircle (angle subtended by a diameter at the circumference) is always 90°.",
      "THEOREM 4 — Cyclic quadrilateral: Opposite angles in a cyclic quadrilateral add up to 180°.",
      "THEOREM 5 — Tangent and radius: A tangent to a circle is perpendicular (90°) to the radius at the point of contact.",
      "THEOREM 6 — Two tangents from a point: Two tangents drawn from an external point to a circle are equal in length.",
      "THEOREM 7 — Alternate segment theorem: The angle between a tangent and a chord equals the angle in the alternate segment.",
    ],
    workedExample: {
      title: "Finding angles using circle theorems",
      intro:
        "O is the centre of a circle. A, B and C are points on the circumference. Angle AOB = 112°. Find angle ACB.",
      data: null,
      steps: [
        {
          step: 1,
          instruction: "Identify which theorem applies.",
          working:
            "Angle AOB is at the CENTRE.\nAngle ACB is at the CIRCUMFERENCE.\nBoth are subtended by the same arc AB.\n→ Use Theorem 1: Angle at centre = 2 × angle at circumference.",
          tip: "The key is spotting whether your angle is at the centre (where O is) or at the circumference (where A, B, C are).",
        },
        {
          step: 2,
          instruction: "Apply the theorem.",
          working:
            "Angle at centre = 2 × angle at circumference\n112° = 2 × angle ACB\nAngle ACB = 112° ÷ 2 = 56°",
          tip: "Always divide the centre angle by 2 to get the circumference angle.",
        },
        {
          step: 3,
          instruction: "State your reason in the working.",
          working:
            "Angle ACB = 56°\n(Angle at the centre is twice the angle at the circumference, subtended by the same arc.)",
          tip: "Edexcel often awards a separate mark for stating the correct theorem. Never just write the number — write the reason.",
        },
      ],
    },
    terms: [
      {
        term: "Subtended",
        def: "An angle is 'subtended' by an arc or chord when the two lines forming the angle meet the ends of that arc or chord.",
      },
      {
        term: "Cyclic quadrilateral",
        def: "A quadrilateral with all four vertices on the circumference of a circle. Opposite angles sum to 180°.",
      },
      {
        term: "Alternate segment",
        def: "When a chord meets a tangent, the alternate segment is the segment on the other side of the chord from the angle you're looking at.",
      },
      {
        term: "Perpendicular",
        def: "At exactly 90° to something. A tangent is perpendicular to the radius at the point of contact.",
      },
    ],
    examTip:
      "In the exam, multi-step circle theorem questions are common — you may need two or three theorems to reach the final answer. Always label intermediate angles clearly and state the theorem used at each step. Look for isosceles triangles formed by two radii — they appear constantly.",
    commonMistakes: [
      "Forgetting to halve the centre angle to find the circumference angle (or doubling when you should halve).",
      "Applying Theorem 1 when the two angles are NOT subtended by the same arc.",
      "Missing that triangles formed by two radii are isosceles — this is the key to many multi-step questions.",
      "Not stating the theorem used — this is a guaranteed mark loss in the exam.",
      "Confusing the alternate segment theorem with co-interior angles — they look similar but are completely different.",
    ],
  },
];

export default geometry;