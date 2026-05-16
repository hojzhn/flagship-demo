// News items shown on the basket detail page. Each item is tagged with
// one or more theme ids. `newsForBasket` in Derive.js filters by the
// basket's `themedAround` set.
//
// Fields
//   id            stable identifier
//   title         headline
//   summary       one or two sentence summary shown in the card body
//   timestamp     human-readable relative time ("2h ago", "Today", "Yesterday", "N days ago")
//   coverage      1 (sparse) to 5 (wide), drives the dot indicator and label
//   sources       array of publication names, shown as outlined pills
//   themeIds      array of theme ids this story is relevant to

export const NEWS = [
  // AI infrastructure
  {
    id: "n-ai-1",
    title: "Nvidia raises capex guidance, sees AI chip demand extending into 2027",
    summary:
      "The company lifted its data-center revenue forecast for the next fiscal year, citing hyperscaler commitments through 2026 and stronger-than-expected enterprise demand for inference.",
    timestamp: "2h ago",
    coverage: 5,
    sources: [
      "Bloomberg",
      "Reuters",
      "WSJ",
      "FT",
      "Nikkei",
      "CNBC",
      "Barron's",
      "The Information",
      "Axios",
      "MarketWatch",
      "Forbes",
      "Yahoo Finance",
    ],
    themeIds: ["ai-infrastructure", "us-mega-cap-tech"],
  },
  {
    id: "n-ai-2",
    title: "Hyperscalers commit $200 billion in data center spend through 2026",
    summary:
      "Amazon, Microsoft, Google, and Meta have collectively raised their infrastructure budgets for the next two years, citing AI workloads as the primary driver of capacity expansion.",
    timestamp: "Today",
    coverage: 4,
    sources: ["WSJ", "Bloomberg", "FT", "Reuters", "Nikkei", "The Information", "Axios", "Barron's"],
    themeIds: ["ai-infrastructure"],
  },
  {
    id: "n-ai-3",
    title: "Power grid bottlenecks slow AI rollout, analysts say",
    summary:
      "Utility capacity constraints in Virginia, Ireland, and Frankfurt are delaying data center buildouts. Operators report multi-year waits for high-voltage connections in the densest markets.",
    timestamp: "Yesterday",
    coverage: 3,
    sources: ["Reuters", "The Information", "Bloomberg"],
    themeIds: ["ai-infrastructure"],
  },
  {
    id: "n-ai-4",
    title: "TSMC reports record advanced-node utilization, raises capex",
    summary:
      "The foundry's most advanced manufacturing nodes are running at full capacity through 2026, the company said in its earnings call. It increased its capital expenditure plan to expand 3nm and 2nm production.",
    timestamp: "2 days ago",
    coverage: 4,
    sources: ["Reuters", "Nikkei", "Bloomberg", "FT", "WSJ", "CNBC", "Barron's"],
    themeIds: ["ai-infrastructure", "made-in-taiwan"],
  },

  // Cybersecurity
  {
    id: "n-cy-1",
    title: "CISA warns of rise in attacks on enterprise identity providers",
    summary:
      "Federal officials cited a sustained increase in credential-theft campaigns aimed at SSO and identity-as-a-service vendors. Several Fortune 500 companies reported attempted intrusions in the last quarter.",
    timestamp: "5h ago",
    coverage: 4,
    sources: ["Bloomberg", "Reuters", "WSJ", "The Record", "Dark Reading", "CyberScoop"],
    themeIds: ["cybersecurity"],
  },
  {
    id: "n-cy-2",
    title: "EU finalizes NIS2 reporting rules, raising fines for non-compliance",
    summary:
      "Member states adopted final reporting templates and penalty bands for the Network and Information Security Directive 2. Enforcement begins in Q3 across critical infrastructure operators.",
    timestamp: "Yesterday",
    coverage: 3,
    sources: ["Reuters", "FT", "Politico Europe"],
    themeIds: ["cybersecurity"],
  },
  {
    id: "n-cy-3",
    title: "CrowdStrike posts beat on quarterly ARR, expands cloud security suite",
    summary:
      "The company added Falcon for Identity and expanded its CNAPP offering. Management cited consolidation wins as customers reduce the number of security vendors.",
    timestamp: "3 days ago",
    coverage: 4,
    sources: ["WSJ", "Bloomberg", "CNBC", "Reuters", "Barron's"],
    themeIds: ["cybersecurity"],
  },

  // Energy transition / capital-intensive industrials
  {
    id: "n-en-1",
    title: "Grid operators warn of decade-long buildout to meet electrification demand",
    summary:
      "Regional transmission organizations across the U.S. and EU said current interconnection queues will take ten years to clear at present rates. New investment in HV transformers and reactive power equipment is accelerating.",
    timestamp: "Today",
    coverage: 3,
    sources: ["Reuters", "FT", "Bloomberg"],
    themeIds: ["capital-intensive-industrials"],
  },
  {
    id: "n-en-2",
    title: "Federal grant program prioritizes domestic transformer manufacturing",
    summary:
      "The DOE allocated $3.5 billion to expand domestic production of large power transformers and inverters. Awards favor manufacturers with U.S. assembly and contracted output for utility customers.",
    timestamp: "2 days ago",
    coverage: 3,
    sources: ["WSJ", "Reuters", "Bloomberg"],
    themeIds: ["capital-intensive-industrials"],
  },

  // Latam consumer
  {
    id: "n-em-1",
    title: "Mercado Libre logistics network adds 14 fulfillment hubs across Brazil and Mexico",
    summary:
      "The expansion targets next-day delivery in mid-sized cities and reduces dependence on third-party carriers. Management said the buildout was funded from operating cash flow.",
    timestamp: "Today",
    coverage: 3,
    sources: ["Reuters", "Bloomberg", "FT"],
    themeIds: ["latam-consumer"],
  },
  {
    id: "n-em-2",
    title: "Argentina inflation moderates for fourth consecutive month",
    summary:
      "Monthly CPI fell to 3.1%, the slowest reading since 2022. Consumer credit and retail volumes are recovering in real terms, lifting sentiment among regional consumer franchises.",
    timestamp: "Yesterday",
    coverage: 4,
    sources: ["FT", "Reuters", "Bloomberg", "Clarin", "La Nacion"],
    themeIds: ["latam-consumer"],
  },
];
