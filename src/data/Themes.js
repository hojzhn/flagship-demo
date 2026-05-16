// Theme taxonomy. Themes are published groups of qualifying instruments.
// The platform defines and maintains them. Themes are not transactional.
// The user does not back themes. The user backs baskets, and theme
// alignment is computed from the user's holdings.
//
// Membership is binary. An instrument is in a theme or it is not. If
// it is in, its full position value counts toward that theme's
// exposure regardless of how the instrument was acquired.
//
// Some themes are expressed by baskets (the basket declares them in
// `themedAround`). Some themes are not expressed by any basket. The
// platform tracks them as analytical lenses over user holdings. A user
// with high exposure to an unexpressed theme can see that exposure but
// cannot back the theme directly. They could back a basket whose
// holdings would deepen the exposure if such a basket exists.
//
// Fields
//   id            stable identifier
//   name          display name
//   description   one-sentence framing shown in the Themes view
//   instruments   array of instrument ids that qualify

export const THEMES = [
  {
    id: "ai-infrastructure",
    name: "AI infrastructure",
    description:
      "Companies building the compute, networking, and power layer for AI.",
    instruments: ["nvda", "msft", "amd", "asml", "tsm", "avgo", "anet", "vrt"],
  },

  {
    id: "us-mega-cap-tech",
    name: "U.S. mega-cap technology",
    description: "Large U.S. technology platforms with broad market footprint.",
    instruments: ["nvda", "msft", "aapl"],
  },

  {
    id: "made-in-taiwan",
    name: "Made in Taiwan",
    description:
      "Companies headquartered in or primarily operating from Taiwan.",
    instruments: ["tsm"],
  },

  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Software, identity, and network security companies.",
    instruments: ["crwd", "panw", "ftnt", "zs", "net", "okta"],
  },

  {
    id: "capital-intensive-industrials",
    name: "Capital-intensive industrials",
    description:
      "Companies whose business depends on heavy capital deployment in physical infrastructure.",
    instruments: ["cat", "etn", "pwr", "unp", "vmc", "asml"],
  },

  {
    id: "latam-consumer",
    name: "Latin America consumer",
    description: "Consumer companies whose primary market is Latin America.",
    instruments: ["meli"],
  },
];

export const findTheme = (id) => THEMES.find((t) => t.id === id);
