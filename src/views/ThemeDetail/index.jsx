import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../../components/Card";
import SectionHeader from "../../components/SectionHeader";
import HoldingsTable from "../../components/HoldingsTable";
import SegmentedControl from "../../components/SegmentedControl";
import ProgressBar from "../../components/ProgressBar";
import { findTheme } from "../../data/Themes.js";
import { findInstrument } from "../../data/Instruments.js";
import {
  instrumentsForTheme,
  basketsForTheme,
  newsForTheme,
  unifiedInstruments,
  portfolioTotal,
} from "../../data/Derive.js";
import { fmtMoney, fmtPct } from "../../data/Format.js";
import { useStandings } from "../../data/StandingsContext.jsx";
import BasketCard from "../Discover/BasketCard";
import NewsCard from "../BasketDetail/NewsCard";

const INSTRUMENT_TABS = [
  { value: "theme", label: "In this theme" },
  { value: "yours", label: "Your portfolio" },
];

const ThemeDetail = ({ themeId, onBack, onSelectBasket }) => {
  const theme = findTheme(themeId);
  const { state } = useStandings();
  const [instrumentTab, setInstrumentTab] = useState("theme");

  if (!theme) {
    return <div className="text-[14px] text-ink-muted">Theme not found.</div>;
  }

  const instruments = instrumentsForTheme(themeId);
  const baskets = basketsForTheme(themeId);
  const news = newsForTheme(themeId);

  // Map instrumentId → shares the user holds, used to surface a
  // "you own X.X sh" badge in HoldingsTable's theme mode.
  const unified = unifiedInstruments(state.standings, state.directHoldings);
  const sharesByInstrument = new Map(
    unified.map((u) => [u.instrumentId, u.shares]),
  );

  // View A: all theme members. Held members float to the top sorted
  // by current value; unheld members fall below in ticker order so
  // the list still has a stable shape when the user holds none of
  // them.
  const themeMembers = instruments
    .map((inst) => ({
      ...inst,
      userShares: sharesByInstrument.get(inst.id) || 0,
    }))
    .sort((a, b) => {
      const aHeld = a.userShares > 0;
      const bHeld = b.userShares > 0;
      if (aHeld !== bHeld) return bHeld - aHeld;
      if (aHeld) return b.userShares * b.price - a.userShares * a.price;
      return a.ticker.localeCompare(b.ticker);
    });

  // View B: every instrument the user holds. Theme members render at
  // full opacity *and* float to the top so the user sees their
  // theme-aligned holdings first; everything else is dimmed via
  // HoldingsTable's `dimmed` flag and sits below. Within each group
  // order is preserved (unified is already sorted by value desc).
  const themeIds = new Set(instruments.map((i) => i.id));
  const yourInstruments = unified
    .map((u) => {
      const inst = findInstrument(u.instrumentId);
      if (!inst) return null;
      return {
        ...inst,
        userShares: u.shares,
        dimmed: !themeIds.has(u.instrumentId),
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(a.dimmed) - Number(b.dimmed));

  // Theme exposure: % of total portfolio value sitting in instruments
  // that are members of this theme. Drives the bar + percentage row.
  const total = portfolioTotal(state.standings, state.directHoldings);
  const themeValue = unified
    .filter((u) => themeIds.has(u.instrumentId))
    .reduce((sum, u) => sum + u.value, 0);
  const exposurePct = total > 0 ? themeValue / total : 0;

  return (
    <div className="space-y-10">
      {/* Breadcrumb — "Themes" is non-clickable since there's no
          standalone Themes page to land on; the topbar back is the
          way out. */}
      <nav className="text-[13px] text-ink-muted">
        <span>Themes</span>
        <span> · </span>
        <span className="text-ink">{theme.name}</span>
      </nav>

      {/* Title + description */}
      <header>
        <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-ink">
          {theme.name}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.55] text-ink-muted">
          {theme.description}
        </p>
      </header>

      {/* Baskets themed around this */}
      {baskets.length > 0 && (
        <section>
          <SectionHeader
            title="Baskets"
            description="Thematic baskets that are directly related to this theme."
          />
          <div className="mt-4 space-y-3">
            {baskets.map((b) => {
              const standing = state.standings.find((s) => s.basketId === b.id);
              return (
                <BasketCard
                  key={b.id}
                  basket={b}
                  standing={standing}
                  onClick={
                    onSelectBasket ? () => onSelectBasket(b.id) : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Instruments — two views via the SegmentedControl:
            "In this theme"  → every theme member, member-by-member.
            "Your portfolio" → everything you hold, with non-theme
                               instruments dimmed for contrast.
          A bar above the table shows the user's theme exposure as a
          fraction of total portfolio value. */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            title="Instruments"
            description="Instruments related to this theme."
          />
          <SegmentedControl
            options={INSTRUMENT_TABS}
            value={instrumentTab}
            onChange={setInstrumentTab}
          />
        </div>

        {/* Theme exposure bar — only on the "Your portfolio" tab, since
            that's where contrast against the user's other holdings is
            meaningful. AnimatePresence collapses the slot when the
            user switches back to "In this theme". */}
        <AnimatePresence initial={false}>
          {instrumentTab === "yours" && (
            <motion.div
              key="exposure"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="rounded-macos border border-hairline bg-elevated p-4 shadow-card">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Your exposure to this theme
                  </div>
                  <div className="text-[14px] tnum text-ink-muted">
                    <span className="font-semibold text-ink">
                      {fmtPct(exposurePct, 1)}
                    </span>{" "}
                    of portfolio
                  </div>
                </div>
                <ProgressBar
                  value={themeValue}
                  total={total}
                  className="mt-3"
                />
                <div className="mt-2 text-2xs tnum text-ink-muted">
                  <span className="text-ink">{fmtMoney(themeValue)}</span> of{" "}
                  {fmtMoney(total)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card padded={false} className="mt-4 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={instrumentTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <HoldingsTable
                instruments={
                  instrumentTab === "theme" ? themeMembers : yourInstruments
                }
                userView={instrumentTab === "yours"}
              />
            </motion.div>
          </AnimatePresence>
        </Card>
      </section>

      {/* News on this theme */}
      {news.length > 0 && (
        <section>
          <SectionHeader
            title="News "
            description="Coverage of the companies and trends behind this theme."
          />
          <div className="mt-4 space-y-3">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ThemeDetail;
