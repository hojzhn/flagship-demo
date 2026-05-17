// Derivation layer. Baskets, themes, instruments are static catalogs.
// Standings and direct holdings are user state. Everything the views
// render is computed here from those five.

import { findInstrument } from "./Instruments.js";
import { findBasket, BASKETS } from "./Baskets.js";
import { THEMES } from "./Themes.js";
import { NEWS } from "./News.js";
import { fmtMoney } from "./Format.js";

// ----- Per-instrument breakdown of a standing -------------------------
//
// For a given standing, return the list of instruments it holds with
// dollar value and share count. The basket's weights, the standing's
// currentValue, and the instrument prices determine the breakdown.

export function instrumentsForStanding(standing) {
  const basket = findBasket(standing.basketId);
  if (!basket) return [];
  return basket.holdings.map((h) => {
    const inst = findInstrument(h.instrumentId);
    const value = standing.currentValue * h.weight;
    const shares = inst ? value / inst.price : 0;
    return {
      instrumentId: h.instrumentId,
      ticker: inst?.ticker,
      name: inst?.name,
      sector: inst?.sector,
      weight: h.weight,
      value,
      shares,
    };
  });
}

// ----- Unified instrument positions -----------------------------------
//
// Across all active standings plus direct holdings, return one row per
// instrument with total shares, total value, and the per-source
// breakdown the Instruments view expands inline.

export function unifiedInstruments(standings, directHoldings) {
  const bySource = new Map();

  for (const std of standings) {
    if (std.status !== "active") continue;
    const basket = findBasket(std.basketId);
    if (!basket) continue;
    for (const pos of instrumentsForStanding(std)) {
      const arr = bySource.get(pos.instrumentId) ?? [];
      arr.push({
        kind: "basket",
        basketId: std.basketId,
        basketName: basket.name,
        standingId: std.id,
        shares: pos.shares,
        value: pos.value,
      });
      bySource.set(pos.instrumentId, arr);
    }
  }

  // Roll every direct-holding record for the same instrument into a
  // single "Direct" source so the Instruments tab shows one Direct
  // row per instrument, even when the user has bought it across
  // several one-time purchases.
  for (const dh of directHoldings) {
    const inst = findInstrument(dh.instrumentId);
    if (!inst) continue;
    const arr = bySource.get(dh.instrumentId) ?? [];
    const existing = arr.find((s) => s.kind === "direct");
    if (existing) {
      existing.shares += dh.shares;
      existing.value += dh.shares * inst.price;
    } else {
      arr.push({
        kind: "direct",
        basketId: null,
        basketName: "Direct holdings",
        standingId: null,
        shares: dh.shares,
        value: dh.shares * inst.price,
      });
    }
    bySource.set(dh.instrumentId, arr);
  }

  const unified = [];
  for (const [instrumentId, sources] of bySource.entries()) {
    const inst = findInstrument(instrumentId);
    if (!inst) continue;
    const shares = sources.reduce((s, x) => s + x.shares, 0);
    const value = sources.reduce((s, x) => s + x.value, 0);
    unified.push({
      instrumentId,
      ticker: inst.ticker,
      name: inst.name,
      sector: inst.sector,
      price: inst.price,
      shares,
      value,
      sources,
    });
  }

  return unified.sort((a, b) => b.value - a.value);
}

// ----- Portfolio gain since the user began ----------------------------
//
// Sum of (currentValue − total contributed at this monthly level) across
// active standings. Direct holdings are excluded because there's no cost
// basis in the data layer. Used for the "since you began" line on the
// portfolio header.

export function portfolioGain(standings, _directHoldings, now = new Date()) {
  let currentSum = 0;
  let contributedSum = 0;
  for (const std of standings) {
    if (std.status !== "active") continue;
    const days = tenureDays(std, now);
    const months = Math.max(1, Math.ceil(days / 30));
    currentSum += std.currentValue;
    contributedSum += std.level * months;
  }
  const gain = currentSum - contributedSum;
  const gainPct = contributedSum > 0 ? gain / contributedSum : 0;
  return { gain, gainPct };
}

// ----- Portfolio totals -----------------------------------------------

export function portfolioTotal(standings, directHoldings) {
  const fromStandings = standings
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.currentValue, 0);
  const fromDirect = directHoldings.reduce((sum, dh) => {
    const inst = findInstrument(dh.instrumentId);
    return inst ? sum + dh.shares * inst.price : sum;
  }, 0);
  return fromStandings + fromDirect;
}

// ----- Theme exposure across the whole portfolio ----------------------
//
// For each theme in the taxonomy, sum the value of every user holding
// (across any source) whose instrument is a member of the theme. Split
// the total into backed and incidental.
//
// A holding is backed toward theme T if it came from a basket B whose
// themedAround list contains T. Everything else is incidental. So the
// same instrument value can be backed toward one theme and incidental
// toward another at the same time, depending on which basket carried
// it and how that basket is themed.

export function themeExposures(standings, directHoldings) {
  const unified = unifiedInstruments(standings, directHoldings);
  const result = [];

  for (const theme of THEMES) {
    const memberIds = new Set(theme.instruments);
    let total = 0;
    let backed = 0;

    for (const u of unified) {
      if (!memberIds.has(u.instrumentId)) continue;
      total += u.value;

      for (const src of u.sources) {
        if (src.kind !== "basket") continue;
        const basket = findBasket(src.basketId);
        if (!basket) continue;
        if (basket.themedAround.includes(theme.id)) {
          backed += src.value;
        }
      }
    }

    const incidental = total - backed;
    result.push({
      themeId: theme.id,
      name: theme.name,
      description: theme.description,
      value: total,
      backed,
      incidental,
      backedFraction: total > 0 ? backed / total : 0,
    });
  }

  return result.sort((a, b) => b.value - a.value);
}

// ----- Concentration alerts ------------------------------------------

export function concentrationAlerts(
  standings,
  directHoldings,
  threshold = 0.2,
) {
  const total = portfolioTotal(standings, directHoldings);
  if (total === 0) return [];
  const unified = unifiedInstruments(standings, directHoldings);
  return unified
    .filter((u) => u.value / total >= threshold)
    .map((u) => ({
      instrumentId: u.instrumentId,
      ticker: u.ticker,
      sharePct: u.value / total,
      sourceCount: u.sources.length,
    }));
}

// ----- Tenure in days -------------------------------------------------

export function tenureDays(standing, asOf = new Date()) {
  const start = new Date(standing.startedAt);
  const ms = asOf - start;
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

// ----- Gain on a single standing --------------------------------------
//
// Approximates gain since the user began by comparing currentValue
// against what they would have contributed at this monthly level over
// their tenure. Used on standing-level surfaces (BasketCard when backed,
// StandingDetail header).

export function standingGain(standing, now = new Date()) {
  const days = tenureDays(standing, now);
  const months = Math.max(1, Math.ceil(days / 30));
  const contributed = standing.level * months;
  const gain = standing.currentValue - contributed;
  const gainPct = contributed > 0 ? gain / contributed : 0;
  return { gain, gainPct, contributed };
}

// ----- News for a basket ---------------------------------------------
//
// Returns the news items relevant to a basket: any story tagged with a
// theme that the basket is themed around. Falls back to empty list if
// the basket has no themedAround entries.

export function newsForBasket(basketId) {
  const basket = findBasket(basketId);
  if (!basket || basket.themedAround.length === 0) return [];
  const themeSet = new Set(basket.themedAround);
  return NEWS.filter((n) => n.themeIds.some((t) => themeSet.has(t)));
}

// ----- Theme lookups -------------------------------------------------
//
// Three thin helpers used by the theme detail page.

export function newsForTheme(themeId) {
  return NEWS.filter((n) => n.themeIds.includes(themeId));
}

export function basketsForTheme(themeId) {
  return BASKETS.filter((b) => b.themedAround.includes(themeId));
}

export function instrumentsForTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return [];
  return theme.instruments.map((id) => findInstrument(id)).filter(Boolean);
}

// ----- Basket → direct holdings -------------------------------------
//
// Converts a basket and a dollar amount into a list of direct holding
// records (one per basket instrument, weighted by the basket's
// composition at current instrument prices). Used in two places:
//   - One-time purchase from the commit flow: the user buys $X of the
//     basket, and the resulting shares land in direct holdings (no
//     standing is created).
//   - Retracting an active standing: the user keeps the shares they've
//     already accumulated, so the standing's currentValue is split
//     across the basket and added as direct holdings.

export function basketToDirectHoldings(basket, totalValue, now = new Date()) {
  if (!basket || totalValue <= 0) return [];
  const stamp = now.getTime();
  return basket.holdings
    .map((h) => {
      const inst = findInstrument(h.instrumentId);
      if (!inst) return null;
      const value = totalValue * h.weight;
      const shares = value / inst.price;
      return {
        id: `dh-${h.instrumentId}-${stamp}-${Math.random().toString(36).slice(2, 8)}`,
        instrumentId: h.instrumentId,
        shares,
        acquiredAt: now.toISOString().slice(0, 10),
      };
    })
    .filter(Boolean);
}

// ----- Coverage label --------------------------------------------------

export const coverageLabel = (n) => {
  if (n >= 5) return "Wide";
  if (n >= 4) return "Strong";
  if (n >= 3) return "Moderate";
  if (n >= 2) return "Limited";
  return "Sparse";
};

// ----- Allocation by sector for a basket -----------------------------
//
// Group basket holdings by sector, summing weights. Sorted heaviest
// first so the bar/legend reads top-down.

export function basketAllocationBySector(basket) {
  const bySector = new Map();
  for (const h of basket.holdings) {
    const inst = findInstrument(h.instrumentId);
    if (!inst) continue;
    const prev = bySector.get(inst.sector) || 0;
    bySector.set(inst.sector, prev + h.weight);
  }
  return [...bySector.entries()]
    .map(([sector, weight]) => ({ sector, weight }))
    .sort((a, b) => b.weight - a.weight);
}

// ----- Themes this standing reinforces -------------------------------
//
// For each theme in the catalog, returns the share of portfolio this
// single standing contributes (left number on the standing detail
// page) and the total portfolio exposure to the theme (right number).
//
// `isDirect` is true when the basket lists the theme in `themedAround`;
// otherwise the basket reinforces the theme incidentally via shared
// instruments, captured in `throughTickers`.

export function themesReinforcedByStanding(
  standing,
  allStandings,
  directHoldings,
) {
  const basket = findBasket(standing.basketId);
  if (!basket) return [];

  const total = portfolioTotal(allStandings, directHoldings);
  const allExposures = themeExposures(allStandings, directHoldings);

  const result = [];
  for (const theme of THEMES) {
    const themeMembers = new Set(theme.instruments);
    const overlap = basket.holdings.filter((h) =>
      themeMembers.has(h.instrumentId),
    );
    if (overlap.length === 0) continue;

    const contributionWeight = overlap.reduce((sum, h) => sum + h.weight, 0);
    const contributionValue = standing.currentValue * contributionWeight;
    const contributionPct = total > 0 ? contributionValue / total : 0;

    const exposure = allExposures.find((e) => e.themeId === theme.id);
    const exposurePct = exposure && total > 0 ? exposure.value / total : 0;

    const isDirect = basket.themedAround.includes(theme.id);
    const throughTickers = overlap
      .map((h) => findInstrument(h.instrumentId)?.ticker)
      .filter(Boolean);

    result.push({
      themeId: theme.id,
      themeName: theme.name,
      contributionPct,
      exposurePct,
      isDirect,
      throughTickers,
    });
  }

  return result.sort((a, b) => b.contributionPct - a.contributionPct);
}

// ----- Activity feed for a standing ----------------------------------
//
// Generates the activity timeline shown on the standing detail page.
// Mixes:
//   - "First deployment" on the standing's startedAt
//   - "Monthly deployment" on the 1st of each subsequent month up to now
//   - Platform events from `basket.recentEvents` that fall on or after
//     the standing's startedAt
// Sorted by date, most recent first.

export function activityForStanding(standing, now = new Date()) {
  const basket = findBasket(standing.basketId);
  if (!basket) return [];

  const events = [];

  events.push({
    date: standing.startedAt,
    title: "First deployment",
    body: `You began this standing at ${fmtMoney(standing.level)} / month.`,
  });

  // Monthly deployments at the 1st of each month after startedAt.
  const start = new Date(standing.startedAt);
  let cursor = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  while (cursor <= now) {
    events.push({
      date: cursor.toISOString().slice(0, 10),
      title: "Monthly deployment",
      body: `${fmtMoney(standing.level)} deployed across ${basket.holdings.length} holdings at current weights.`,
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  // Platform events that occurred on or after the standing began.
  const platformEvents = (basket.recentEvents || []).filter(
    (e) => e.date >= standing.startedAt,
  );
  events.push(...platformEvents);

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

// ----- Projected theme exposure for a new standing -------------------
//
// Computes how much the basket's primary theme would shift if the user
// committed `level` per month for 12 months. Assumes the basket fully
// expresses its primary theme (true when basket.holdings are all theme
// members — the common case in the current data).

export function projectedExposure(standings, directHoldings, basket, level) {
  const themeId = basket.themedAround[0];
  if (!themeId) return null;

  const annualContribution = level * 12;
  const currentTotal = portfolioTotal(standings, directHoldings);
  const exposures = themeExposures(standings, directHoldings);
  const themeExposure = exposures.find((t) => t.themeId === themeId);
  if (!themeExposure) return null;

  const newThemeValue = themeExposure.value + annualContribution;
  const newTotal = currentTotal + annualContribution;

  return {
    themeId,
    themeName: themeExposure.name,
    current: currentTotal > 0 ? themeExposure.value / currentTotal : 0,
    projected: newTotal > 0 ? newThemeValue / newTotal : 0,
  };
}
