import { AnimatePresence, motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { findInstrument } from "../data/Instruments.js";
import { fmtPct, fmtShares } from "../data/Format.js";
import Icon from "./Icon";

// Shared formatter for the Allocation column. NumberFlow handles the
// digit-roll animation when `value` changes; the `format` object is
// the same shape `Intl.NumberFormat` accepts and matches `fmtMoney`'s
// output (whole-dollar USD).
const MONEY_FORMAT = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
};

// Matches `fmtShares` — decimal with up to 2 fraction digits.
const SHARES_FORMAT = { maximumFractionDigits: 2 };

// Unified holdings table used by StandingDetail, Commit, and ThemeDetail.
//
// Two input shapes, picked by which prop you pass:
//   basket + totalValue → weighted breakdown of one basket at a value
//     StandingDetail: totalValue = standing.currentValue
//     Commit:         totalValue = the chosen monthly level
//   instruments        → flat list of theme members (no weights, no money)
//     ThemeDetail
//
// Three columns:
//   Col 1: ticker (bold) + description (price·30D for baskets, company name for themes)
//   Col 2: weight bar + percent (basket mode only; collapsed in theme mode)
//   Col 3: value + shares (basket mode); price + 30D (theme mode)

const Delta30D = ({ change }) => {
  const positive = change >= 0;
  return (
    <span
      className={
        "inline-flex items-center gap-0.5 font-medium tnum " +
        (positive ? "text-success" : "text-danger")
      }
    >
      <Icon
        name={positive ? "triangleUp" : "triangleDown"}
        className="h-2 w-2"
      />
      {positive ? "+" : ""}
      {fmtPct(change, 1)}
    </span>
  );
};

// Optional row stagger:
//   stagger      — turn the per-row fade-in on
//   staggerFrom  — index at which the stagger starts. Rows before this
//                  index render solid. Used by the Commit "Show all"
//                  expand: the first N rows are already on screen so
//                  only rows N..end cascade in.
const HoldingsTable = ({
  basket,
  totalValue = 0,
  instruments,
  limit,
  stagger = false,
  staggerFrom = 0,
  showDiff = true,
}) => {
  const isTheme = !!instruments && !basket;

  let rows;
  if (isTheme) {
    rows = instruments.map((inst) => ({
      key: inst.id,
      inst,
      weight: 0,
      value: 0,
      shares: 0,
    }));
  } else if (basket) {
    rows = [...basket.holdings]
      .sort((a, b) => b.weight - a.weight)
      .map((h) => {
        const inst = findInstrument(h.instrumentId);
        const value = totalValue * h.weight;
        const shares = inst ? value / inst.price : 0;
        return { key: h.instrumentId, inst, weight: h.weight, value, shares };
      });
  } else {
    return null;
  }

  // Cap row count when `limit` is provided. The parent decides whether
  // to render an external "Show all" affordance based on rows.length.
  if (typeof limit === "number" && limit > 0) {
    rows = rows.slice(0, limit);
  }

  return (
    <div>
      {/* Header */}
      <div className="hairline-b grid grid-cols-12 gap-4 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
        <div className="col-span-4">Instrument</div>
        {!isTheme && <div className="col-span-5">Weight</div>}
        <div
          className={(isTheme ? "col-span-8" : "col-span-3") + " text-right"}
        >
          {isTheme ? "Price" : "Allocation"}
        </div>
      </div>

      {/* AnimatePresence so staggered rows can fade out + collapse when
          they're removed (Commit's Show all → Back). Rows that aren't
          staggered render as plain divs; AnimatePresence leaves those
          alone and only manages the motion.div rows. */}
      <AnimatePresence initial={false}>
      {rows.map((row, idx) => {
        if (!row.inst) return null;
        const last = idx === rows.length - 1;
        const shouldStagger = stagger && idx >= staggerFrom;

        // The visible row: padded grid, hairline at the bottom. Kept as
        // the inner child so the outer height animation can collapse
        // *including* the padding.
        const rowInner = (
          <div
            className={
              "grid grid-cols-12 items-center gap-4 px-5 py-3.5 " +
              (last ? "" : "hairline-b")
            }
          >
            {/* Col 1: ticker (+ owned-shares badge in theme mode) + description */}
            <div className="col-span-4 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[14px] font-semibold tnum text-ink">
                  {row.inst.ticker}
                </div>
                {isTheme && row.inst.userShares > 0 && (
                  <div className="inline-flex items-center gap-1">
                    <div className="grid h-3.5 w-3.5 place-items-center rounded-full bg-success text-white">
                      <Icon name="check" className="h-2 w-2" />
                    </div>
                    <span className="text-2xs font-medium tnum text-ink-muted">
                      {fmtShares(row.inst.userShares)} sh
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-0.5 truncate text-2xs text-ink-muted">
                {isTheme ? (
                  row.inst.name
                ) : (
                  <span className="inline-flex items-center gap-x-1.5 tnum whitespace-nowrap">
                    <span>${row.inst.price.toFixed(2)}</span>
                    {/* `initial={false}` so callers that start with
                        showDiff=true (StandingDetail, ThemeDetail's
                        basket mode) don't fade in on first paint —
                        only callers that flip showDiff at runtime
                        (Commit's Show all) get the fade. */}
                    <AnimatePresence initial={false}>
                      {showDiff && (
                        <motion.span
                          key="delta"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="inline-flex items-center gap-x-1.5"
                        >
                          <Delta30D change={row.inst.change30d} />
                          <span className="text-ink-subtle">30D</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                )}
              </div>
            </div>

            {/* Col 2: weight bar (basket mode only) */}
            {!isTheme && (
              <div className="col-span-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.08]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${row.weight * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-[13px] tnum text-ink">
                  {fmtPct(row.weight, 0)}
                </span>
              </div>
            )}

            {/* Col 3: allocation (basket) or price + 30D (theme) */}
            <div
              className={
                (isTheme ? "col-span-8" : "col-span-3") + " text-right"
              }
            >
              {isTheme ? (
                <>
                  <div className="text-[16px] font-semibold tnum text-ink">
                    ${row.inst.price.toFixed(2)}
                  </div>
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-2xs tnum">
                    <Delta30D change={row.inst.change30d} />
                    <span className="text-ink-subtle">30D</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[16px] font-semibold tnum text-ink">
                    <NumberFlow value={row.value} format={MONEY_FORMAT} />
                  </div>
                  <div className="mt-0.5 text-2xs tnum text-ink-muted">
                    <NumberFlow
                      value={row.shares}
                      format={SHARES_FORMAT}
                      suffix=" sh"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

        if (!shouldStagger) {
          return <div key={row.key}>{rowInner}</div>;
        }

        // Two-phase reveal for cascading rows: height tweens 0 → auto
        // first with no delay, so all new rows grow together and the
        // card reads as "expanding vertically". Opacity then fades in
        // 0 → 1 with a per-row stagger, *after* the height animation
        // finishes — so the rows cascade in on the now-expanded card.
        // Animating height (not transform) avoids the font-scaling
        // distortion that `layout` causes.
        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                opacity: { duration: 0.15, ease: "easeOut" },
                height: { duration: 0.25, ease: "easeOut", delay: 0.1 },
              },
            }}
            style={{ overflow: "hidden" }}
            transition={{
              height: { duration: 0.3, ease: "easeOut" },
              opacity: {
                duration: 0.2,
                ease: "easeOut",
                delay: 0.3 + (idx - staggerFrom) * 0.035,
              },
            }}
          >
            {rowInner}
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
};

export default HoldingsTable;
