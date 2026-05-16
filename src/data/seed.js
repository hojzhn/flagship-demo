// Seed data the app loads with on first render. Two standings already
// in place plus two direct holdings so the Portfolio views have
// something interesting to show without the user first having to act.
//
// Standings
//   id            stable identifier
//   basketId      references BASKETS
//   level         monthly contribution in USD
//   startedAt     ISO date the user began backing
//   currentValue  current value of the standing in USD
//   status        "active" | "paused"
//
// Direct holdings
//   id            stable identifier
//   instrumentId  references INSTRUMENTS
//   shares        number of shares held outside any basket
//   acquiredAt    ISO date the position was opened

export const SEED_STANDINGS = [
  {
    id: "std-ai-infra-1",
    basketId: "ai-infra-expansion",
    level: 500,
    startedAt: "2025-11-18",
    currentValue: 6755,
    status: "active",
  },
  {
    id: "std-cyber-1",
    basketId: "cyber-resilience",
    level: 250,
    startedAt: "2026-01-12",
    currentValue: 3860,
    status: "active",
  },
];

export const SEED_DIRECT_HOLDINGS = [
  {
    id: "dh-aapl-1",
    instrumentId: "aapl",
    shares: 42,
    acquiredAt: "2025-08-04",
  },
  {
    id: "dh-nvda-1",
    instrumentId: "nvda",
    shares: 14.9,
    acquiredAt: "2025-09-22",
  },
];
