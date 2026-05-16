// News catalog. Each story is published once and references the
// baskets it is relevant to. A basket detail page filters this catalog
// by basket id.
//
// Sources carry the multi-source attribution pattern. The detail page
// shows the count, lists named sources, and renders a coverage
// indicator based on the level.
//
// Fields
//   id             stable identifier
//   headline       single-line headline shown at the top of the story
//                  card
//   summary        one-paragraph summary shown under the headline
//   timestamp      display string (e.g. "2h ago"). Demo content, not a
//                  real time
//   sources        array of source names actually cited (the chips
//                  shown on the card). Order matters for display
//   sourceCount    total number of sources covering the story. May be
//                  larger than sources.length, in which case the chip
//                  list shows "+N more"
//   coverage       "wide" | "strong" | "moderate" | "narrow" | "single"
//                  drives the dot indicator (5, 4, 3, 2, 1 of 5)
//   baskets        array of basket ids this story is relevant to

export const NEWS = [
  {
    id: "nvda-capex-2027",
    headline:
      "Nvidia raises capex guidance, sees AI chip demand extending into 2027",
    summary:
      "The company lifted its data-center revenue forecast for the next fiscal year, citing hyperscaler commitments through 2026 and stronger-than-expected enterprise demand for inference.",
    timestamp: "2h ago",
    sources: ["Bloomberg", "Reuters", "WSJ", "FT"],
    sourceCount: 12,
    coverage: "wide",
    baskets: ["ai-infra-expansion", "semi-leaders"],
  },

  {
    id: "hyperscaler-200b",
    headline:
      "Hyperscalers commit $200 billion in data center spend through 2026",
    summary:
      "Amazon, Microsoft, Google, and Meta have collectively raised their infrastructure budgets for the next two years, citing AI workloads as the primary driver of capacity expansion.",
    timestamp: "Today",
    sources: ["WSJ", "Bloomberg", "FT"],
    sourceCount: 8,
    coverage: "strong",
    baskets: ["ai-infra-expansion"],
  },

  {
    id: "grid-bottleneck",
    headline: "Power grid bottlenecks slow AI rollout, analysts say",
    summary:
      "Utility capacity constraints in Virginia, Ireland, and Frankfurt are delaying data center buildouts. Operators report multi-year waits for high-voltage connections in the densest markets.",
    timestamp: "Yesterday",
    sources: ["Reuters", "The Information", "Bloomberg"],
    sourceCount: 3,
    coverage: "moderate",
    baskets: ["ai-infra-expansion", "energy-transition", "us-infra"],
  },

  {
    id: "tsmc-record-node",
    headline: "TSMC reports record advanced-node utilization, raises capex",
    summary:
      "The foundry's most advanced manufacturing nodes are running at full capacity through 2026, the company said in its earnings call. It increased its capital expenditure plan to expand 3nm and 2nm production.",
    timestamp: "2 days ago",
    sources: ["Reuters", "Nikkei", "Bloomberg", "FT"],
    sourceCount: 7,
    coverage: "strong",
    baskets: ["ai-infra-expansion", "semi-leaders"],
  },

  {
    id: "ransomware-budgets",
    headline:
      "Ransomware attacks up 38% YoY, enterprise security budgets accelerate",
    summary:
      "Insurance carriers reported a sharp increase in payout activity through the first quarter. CFOs surveyed in a Gartner study cited security as the only IT line item exempt from cost reviews.",
    timestamp: "Today",
    sources: ["Reuters", "Bloomberg", "WSJ"],
    sourceCount: 6,
    coverage: "strong",
    baskets: ["cyber-resilience"],
  },

  {
    id: "eu-cyber-mandate",
    headline:
      "EU expands cyber resilience mandate to critical infrastructure operators",
    summary:
      "New rules under the NIS2 directive extend reporting and continuity requirements to energy, water, transport, and health providers. Compliance deadlines run through 2027.",
    timestamp: "Yesterday",
    sources: ["FT", "Reuters", "Politico EU"],
    sourceCount: 4,
    coverage: "moderate",
    baskets: ["cyber-resilience"],
  },

  {
    id: "grid-storage-triple",
    headline: "Grid storage installations triple in 2025",
    summary:
      "Utility-scale battery deployments crossed 30 GW globally for the first time. Industry analysts attribute the jump to falling lithium-ion costs and committed transmission projects.",
    timestamp: "Today",
    sources: ["Bloomberg", "Reuters", "FT"],
    sourceCount: 5,
    coverage: "strong",
    baskets: ["energy-transition"],
  },

  {
    id: "ira-battery-funds",
    headline: "Inflation Reduction Act funds boost domestic battery production",
    summary:
      "U.S. battery manufacturing capacity has more than doubled since 2023, driven by tax credits and supply chain reshoring initiatives. Several joint ventures announced new plants in Tennessee and Georgia.",
    timestamp: "Yesterday",
    sources: ["Reuters", "Bloomberg"],
    sourceCount: 4,
    coverage: "moderate",
    baskets: ["energy-transition", "us-infra"],
  },

  {
    id: "meli-q3",
    headline:
      "Mercado Libre Q3 earnings beat estimates on Latin America growth",
    summary:
      "The company reported accelerating gross merchandise volume in Brazil and Mexico. Fintech operations continued to outpace e-commerce growth, with active users up 28% year-over-year.",
    timestamp: "Today",
    sources: ["Bloomberg", "Reuters", "Bloomberg Línea"],
    sourceCount: 5,
    coverage: "strong",
    baskets: ["em-consumer"],
  },

  {
    id: "india-retail",
    headline: "India retail sales accelerate, lifting EM consumer outlook",
    summary:
      "Festive-season consumer spending in India came in above analyst estimates. Online and offline retailers reported double-digit growth across discretionary categories.",
    timestamp: "Yesterday",
    sources: ["Reuters", "Bloomberg", "Mint"],
    sourceCount: 4,
    coverage: "moderate",
    baskets: ["em-consumer"],
  },

  {
    id: "bipartisan-execution",
    headline: "Bipartisan infrastructure spending hits record execution rate",
    summary:
      "Federal Highway Administration data shows committed funds being deployed faster than at any point in the past two decades. Construction backlogs have grown alongside.",
    timestamp: "Today",
    sources: ["WSJ", "Bloomberg", "Reuters"],
    sourceCount: 6,
    coverage: "strong",
    baskets: ["us-infra"],
  },

  {
    id: "port-modernization",
    headline:
      "Port modernization drives industrial REIT and rail freight gains",
    summary:
      "Container throughput at U.S. East Coast ports has set monthly records through the first half of the year. Rail operators report tight capacity into the inland distribution hubs.",
    timestamp: "3 days ago",
    sources: ["Reuters", "FreightWaves"],
    sourceCount: 3,
    coverage: "moderate",
    baskets: ["us-infra"],
  },
];

// Helper. Return news stories relevant to a given basket, newest first.
// In a real product the order would be by publication time. For the
// demo the array order is the display order.
export function newsForBasket(basketId) {
  return NEWS.filter((n) => n.baskets.includes(basketId));
}

// Helper. Map coverage level to dot count (out of 5) for the indicator.
export function coverageDotCount(level) {
  switch (level) {
    case "wide":
      return 5;
    case "strong":
      return 4;
    case "moderate":
      return 3;
    case "narrow":
      return 2;
    case "single":
      return 1;
    default:
      return 0;
  }
}

// Helper. Map coverage level to display label.
export function coverageLabel(level) {
  switch (level) {
    case "wide":
      return "Wide";
    case "strong":
      return "Strong";
    case "moderate":
      return "Moderate";
    case "narrow":
      return "Narrow";
    case "single":
      return "Single source";
    default:
      return "";
  }
}
