// Instrument catalog. Every security that can be held, directly or
// through a basket. Prices and 30-day returns are approximations for
// demo purposes.
//
// Fields
//   id            stable identifier used by themes and direct holdings
//   ticker        display ticker symbol
//   name          full company or instrument name
//   price         current price per share, USD
//   change30d     trailing 30-day return as a decimal (e.g. 0.084 = +8.4%)
//   sector        sector tag, used for grouping where relevant

export const INSTRUMENTS = [
  // Semiconductors and AI infrastructure
  { id: "nvda", ticker: "NVDA", name: "Nvidia", price: 145.2, change30d: 0.084, sector: "Semiconductors" },
  { id: "amd", ticker: "AMD", name: "Advanced Micro Devices", price: 135.4, change30d: 0.051, sector: "Semiconductors" },
  { id: "tsm", ticker: "TSM", name: "Taiwan Semiconductor", price: 185.3, change30d: 0.038, sector: "Semiconductors" },
  { id: "avgo", ticker: "AVGO", name: "Broadcom", price: 1620.0, change30d: 0.062, sector: "Semiconductors" },
  { id: "asml", ticker: "ASML", name: "ASML Holding", price: 925.0, change30d: -0.015, sector: "Semi-equipment" },
  { id: "anet", ticker: "ANET", name: "Arista Networks", price: 320.45, change30d: 0.073, sector: "Networking" },
  { id: "vrt", ticker: "VRT", name: "Vertiv", price: 88.1, change30d: 0.094, sector: "Data center" },
  { id: "msft", ticker: "MSFT", name: "Microsoft", price: 420.5, change30d: 0.032, sector: "Software" },

  // Cybersecurity
  { id: "crwd", ticker: "CRWD", name: "CrowdStrike", price: 318.2, change30d: -0.028, sector: "Software" },
  { id: "panw", ticker: "PANW", name: "Palo Alto Networks", price: 425.5, change30d: 0.045, sector: "Software" },
  { id: "ftnt", ticker: "FTNT", name: "Fortinet", price: 68.4, change30d: 0.018, sector: "Software" },
  { id: "zs", ticker: "ZS", name: "Zscaler", price: 185.3, change30d: -0.012, sector: "Software" },
  { id: "net", ticker: "NET", name: "Cloudflare", price: 112.4, change30d: 0.057, sector: "Software" },
  { id: "okta", ticker: "OKTA", name: "Okta", price: 92.5, change30d: -0.034, sector: "Software" },

  // Energy transition
  { id: "nee", ticker: "NEE", name: "NextEra Energy", price: 68.4, change30d: -0.008, sector: "Utilities" },
  { id: "lin", ticker: "LIN", name: "Linde", price: 478.2, change30d: 0.022, sector: "Materials" },
  { id: "alb", ticker: "ALB", name: "Albemarle", price: 92.1, change30d: -0.062, sector: "Materials" },
  { id: "etn", ticker: "ETN", name: "Eaton", price: 285.4, change30d: 0.031, sector: "Industrials" },
  { id: "pwr", ticker: "PWR", name: "Quanta Services", price: 245.5, change30d: 0.044, sector: "Industrials" },

  // Emerging markets consumer
  { id: "meli", ticker: "MELI", name: "Mercado Libre", price: 1850.2, change30d: 0.087, sector: "Consumer Disc." },
  { id: "se", ticker: "SE", name: "Sea Limited", price: 138.4, change30d: -0.045, sector: "Consumer Disc." },
  { id: "cpng", ticker: "CPNG", name: "Coupang", price: 24.2, change30d: -0.082, sector: "Consumer Disc." },
  { id: "mmyt", ticker: "MMYT", name: "MakeMyTrip", price: 96.3, change30d: 0.012, sector: "Consumer Disc." },

  // U.S. infrastructure
  { id: "cat", ticker: "CAT", name: "Caterpillar", price: 385.2, change30d: 0.028, sector: "Industrials" },
  { id: "vmc", ticker: "VMC", name: "Vulcan Materials", price: 268.5, change30d: 0.015, sector: "Materials" },
  { id: "unp", ticker: "UNP", name: "Union Pacific", price: 238.1, change30d: 0.011, sector: "Industrials" },

  // Direct holdings (not in any basket in the seed data)
  { id: "aapl", ticker: "AAPL", name: "Apple", price: 194.0, change30d: 0.018, sector: "Consumer Tech" },
];

export const findInstrument = (id) => INSTRUMENTS.find((i) => i.id === id);
