// Basket catalog. Baskets are the products the platform sells. The unit
// of transaction. The user backs a basket and creates a standing.
//
// Each basket carries its composition (instruments with weights summing
// to 1.0), curator, fee, risk, and the themes it is themed around.
// `themedAround` is an array of theme ids. A basket may be themed
// around zero, one, or more themes. The relationship is many-to-many
// but loose. The basket's instruments may also contribute to themes
// the basket is not themed around, through incidental membership.
//
// Fields
//   id              stable identifier
//   name            display name
//   description     one-sentence framing shown in Discovery
//   thesis          { headline, paragraphs } shown on the detail page
//   curator         curator label
//   inceptionDate   when the curator launched this basket (ISO date)
//   expenseRatio    annual fee as a decimal (e.g. 0.0085 = 0.85%)
//   riskRating      1 to 7
//   riskLabel       short label matching the rating
//   horizonYears    { min, max } recommended time horizon
//   holdings        array of { instrumentId, weight }
//   themedAround    array of theme ids the curator declares this basket
//                   expresses

export const BASKETS = [
  {
    id: "ai-infra-expansion",
    name: "AI infrastructure expansion",
    shortName: "AI infra",
    description:
      "Compute, chips, power, and data-center buildout supporting AI at scale.",
    thesis: {
      headline:
        "The compute, networking, and power layer underneath AI is being rebuilt, and the companies supplying it capture most of the value.",
      paragraphs: [
        "Training and serving large models requires unprecedented amounts of compute, specialized chips, high-bandwidth networking, and electrical capacity. The hyperscalers and enterprises building this infrastructure are spending on a multi-year cycle that has only begun.",
        "This basket holds companies positioned at the bottleneck. Chip designers and fabricators that supply training clusters. Networking vendors connecting them. Power and cooling infrastructure scaling to meet the demand. The thesis is that infrastructure providers benefit before application-layer companies, and the spending wave outlasts the current cycle of AI hype.",
        "The basket suits people who hold a long-term view of structural demand rather than a short-term position on any one model or platform.",
      ],
    },
    curator: "Public",
    inceptionDate: "2023-03-15",
    expenseRatio: 0.0085,
    riskRating: 5,
    riskLabel: "Balanced",
    horizonYears: { min: 3, max: 5 },
    themedAround: ["ai-infrastructure"],
    holdings: [
      { instrumentId: "nvda", weight: 0.28 },
      { instrumentId: "msft", weight: 0.2 },
      { instrumentId: "amd", weight: 0.14 },
      { instrumentId: "asml", weight: 0.1 },
      { instrumentId: "tsm", weight: 0.09 },
      { instrumentId: "avgo", weight: 0.08 },
      { instrumentId: "anet", weight: 0.06 },
      { instrumentId: "vrt", weight: 0.05 },
    ],
    recentEvents: [
      {
        date: "2026-05-12",
        title: "Quarterly rebalance",
        body: "Composition adjusted by curator. AVGO weight increased from 6% to 8%.",
      },
      {
        date: "2026-03-12",
        title: "Composition log",
        body: "ANET added. CRWD removed from this theme's basket.",
      },
    ],
  },

  {
    id: "semi-leaders",
    name: "Semiconductor leaders",
    shortName: "Semi",
    description:
      "Companies designing and manufacturing the chips that power modern computing.",
    thesis: {
      headline:
        "Semiconductors sit at the foundation of every digital trend, and the leaders that design and fabricate the most advanced chips compound value over the longest cycle.",
      paragraphs: [
        "AI workloads are the most visible driver today, but cars, factories, infrastructure, and consumer electronics all depend on the same wafers. Capacity is concentrated among a small number of firms, and the capital required to compete keeps new entrants out.",
        "This basket holds the leaders of that small group. Companies that own design IP, advanced manufacturing capacity, or both. The bet is that semiconductor cycles get less cyclical as the customer base diversifies, and that the leaders earn a structural premium across the cycle.",
      ],
    },
    curator: "ARK",
    inceptionDate: "2021-09-01",
    expenseRatio: 0.0075,
    riskRating: 5,
    riskLabel: "Balanced",
    horizonYears: { min: 3, max: 5 },
    themedAround: [],
    holdings: [
      { instrumentId: "nvda", weight: 0.3 },
      { instrumentId: "tsm", weight: 0.22 },
      { instrumentId: "amd", weight: 0.18 },
      { instrumentId: "avgo", weight: 0.12 },
      { instrumentId: "asml", weight: 0.1 },
      { instrumentId: "anet", weight: 0.08 },
    ],
  },

  {
    id: "cyber-resilience",
    name: "Cybersecurity resilience",
    shortName: "Cyber",
    description:
      "Software, identity, and infrastructure companies hardening enterprise systems.",
    thesis: {
      headline:
        "Every system enterprises run is now reachable from the internet, and every reachable system needs to be defended. Cybersecurity is non-discretionary spend.",
      paragraphs: [
        "Boards have accepted that security incidents are a question of when, not if. Regulators in the U.S., EU, and APAC are raising disclosure and resilience requirements. The result is consistent multi-year growth across endpoint, identity, network, and cloud security categories.",
        "This basket holds category leaders in each of those layers. Companies whose tooling is embedded in the operational stack of large customers, where ripping out the incumbent carries high switching cost. The thesis is that the largest players in each category earn the most as enterprise budgets keep widening.",
      ],
    },
    curator: "Public",
    inceptionDate: "2022-06-10",
    expenseRatio: 0.007,
    riskRating: 4,
    riskLabel: "Balanced",
    horizonYears: { min: 3, max: 5 },
    themedAround: ["cybersecurity"],
    holdings: [
      { instrumentId: "crwd", weight: 0.22 },
      { instrumentId: "panw", weight: 0.2 },
      { instrumentId: "ftnt", weight: 0.16 },
      { instrumentId: "zs", weight: 0.14 },
      { instrumentId: "net", weight: 0.14 },
      { instrumentId: "okta", weight: 0.14 },
    ],
    recentEvents: [
      {
        date: "2026-04-30",
        title: "Quarterly rebalance",
        body: "Composition adjusted by curator. NET weight reduced from 16% to 14%.",
      },
      {
        date: "2026-02-08",
        title: "Composition log",
        body: "OKTA added to broaden identity exposure.",
      },
    ],
  },

  {
    id: "energy-transition",
    name: "Energy transition",
    shortName: "Energy",
    description:
      "Renewables, grid storage, and infrastructure enabling the shift off fossil fuels.",
    thesis: {
      headline:
        "The shift off fossil fuels is the largest planned reallocation of capital in the next two decades, and the companies enabling it compound earnings through the cycle.",
      paragraphs: [
        "Renewables generation, transmission, storage, and the grid upgrades needed to support electrification all sit on a 20-year buildout. The companies supplying the equipment and managing the infrastructure benefit before the climate outcomes show up in headline numbers.",
        "This basket holds utility-scale renewables, industrial gas providers, grid equipment manufacturers, and a position in critical minerals. The thesis is that infrastructure providers earn during the transition itself, regardless of which generation technology wins.",
      ],
    },
    curator: "BlackRock",
    inceptionDate: "2021-01-20",
    expenseRatio: 0.009,
    riskRating: 4,
    riskLabel: "Balanced",
    horizonYears: { min: 5, max: 7 },
    themedAround: [],
    holdings: [
      { instrumentId: "nee", weight: 0.26 },
      { instrumentId: "lin", weight: 0.22 },
      { instrumentId: "etn", weight: 0.2 },
      { instrumentId: "pwr", weight: 0.18 },
      { instrumentId: "alb", weight: 0.14 },
    ],
  },

  {
    id: "em-consumer",
    name: "Emerging-market consumer growth",
    shortName: "EM consumer",
    description:
      "Rising consumer spending across Latin America, South and Southeast Asia.",
    thesis: {
      headline:
        "Hundreds of millions of households across Latin America and South and Southeast Asia are crossing into the consumer middle class, and the digital platforms serving them own the relationship.",
      paragraphs: [
        "These markets skipped much of the wired internet era and moved directly to mobile-first commerce, payments, and content. The platforms that own consumer attention in their home markets compete on local product depth, not global scale.",
        "This basket holds e-commerce, gaming, and travel leaders across Brazil, Argentina, Singapore, Korea, India, and surrounding markets. The thesis is that consumer spending in these economies compounds faster than developed markets, and that local digital incumbents capture the largest share.",
      ],
    },
    curator: "ARK",
    inceptionDate: "2020-04-12",
    expenseRatio: 0.0095,
    riskRating: 6,
    riskLabel: "Growth",
    horizonYears: { min: 5, max: 7 },
    themedAround: ["latam-consumer"],
    holdings: [
      { instrumentId: "meli", weight: 0.34 },
      { instrumentId: "se", weight: 0.28 },
      { instrumentId: "cpng", weight: 0.22 },
      { instrumentId: "mmyt", weight: 0.16 },
    ],
  },

  {
    id: "us-infra",
    name: "U.S. infrastructure reinvestment",
    shortName: "US infra",
    description:
      "Construction, materials, and utilities benefiting from federal capex.",
    thesis: {
      headline:
        "U.S. federal capex for transportation, energy grid, and industrial onshoring is locked in across multiple administrations. The companies executing the work earn the revenue before the headlines.",
      paragraphs: [
        "The Infrastructure Investment and Jobs Act, the Inflation Reduction Act, and the CHIPS Act together commit more than two trillion dollars over a decade. Construction equipment, aggregates, electrical grid components, and rail are all in the path of that spend.",
        "This basket holds equipment manufacturers, aggregates producers, rail operators, and electrical infrastructure firms. The thesis is that the spend cycle is policy-locked rather than economy-dependent, and the execution partners earn through the full cycle.",
      ],
    },
    curator: "Fidelity",
    inceptionDate: "2022-11-08",
    expenseRatio: 0.006,
    riskRating: 3,
    riskLabel: "Conservative",
    horizonYears: { min: 5, max: 10 },
    themedAround: ["capital-intensive-industrials"],
    holdings: [
      { instrumentId: "cat", weight: 0.3 },
      { instrumentId: "vmc", weight: 0.24 },
      { instrumentId: "unp", weight: 0.22 },
      { instrumentId: "pwr", weight: 0.14 },
      { instrumentId: "etn", weight: 0.1 },
    ],
  },
];

export const findBasket = (id) => BASKETS.find((b) => b.id === id);
