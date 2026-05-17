import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { unifiedInstruments } from "../../data/Derive.js";
import { findBasket } from "../../data/Baskets.js";
import { fmtMoney, fmtShares } from "../../data/Format.js";
import Icon from "../../components/Icon";
import Tag from "../../components/Tag";

const COLS = "grid-cols-12";

const InstrumentRow = ({ instrument, isLast }) => {
  // Show the chevron only when there's actually a breakdown to reveal.
  // Single-source rows (one basket or only direct holdings) are not
  // expandable — the main row already shows the full total.
  const expandable = instrument.sources.length > 1;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={isLast ? "" : "hairline-b"}>
      <button
        onClick={expandable ? () => setExpanded(!expanded) : undefined}
        disabled={!expandable}
        className={
          `${COLS} grid w-full gap-3 px-5 py-4 text-left transition-colors disabled:cursor-default ` +
          (expandable ? "hover:bg-black/[0.02]" : "")
        }
      >
        <div className="col-span-6 flex min-w-0 items-start gap-2">
          {expandable ? (
            <Icon
              name="chevronDown"
              className={
                "mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform " +
                (expanded ? "" : "-rotate-90")
              }
            />
          ) : (
            <span className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-ink">
              {instrument.ticker}
            </div>
            <div className="truncate text-2xs uppercase tracking-wider text-ink-subtle">
              {instrument.name}
            </div>
          </div>
        </div>
        <div className="col-span-3 text-right text-[14px] tnum text-ink">
          {fmtShares(instrument.shares)}
        </div>
        <div className="col-span-3 text-right text-[14px] font-semibold tnum text-ink">
          {fmtMoney(instrument.value)}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expandable && expanded && (
          // Animates open/closed: outer motion.div clips and tweens
          // height 0 → auto so the breakdown rolls down out of the
          // row, opacity stays at 1 on the panel itself but the rows
          // inside stagger their own fade-in.
          <motion.div
            key="breakdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                opacity: { duration: 0.12, ease: "easeOut" },
                height: { duration: 0.22, ease: "easeOut", delay: 0.05 },
              },
            }}
            transition={{
              height: { duration: 0.25, ease: "easeOut" },
              opacity: { duration: 0.15, ease: "easeOut", delay: 0.1 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="hairline-t bg-surface/40 px-5 py-3">
              <div className="mb-2 pl-[22px] text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
                Held through
              </div>
              <ul>
                {instrument.sources.map((src, i) => {
                  const basket =
                    src.kind === "basket" ? findBasket(src.basketId) : null;
                  const label =
                    basket?.name || src.basketName || "Direct holdings";
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.18,
                        ease: "easeOut",
                        delay: 0.15 + i * 0.03,
                      }}
                      className={`${COLS} grid items-center gap-3 py-1.5`}
                    >
                      <div className="col-span-6 flex min-w-0 items-center gap-2 pl-[22px]">
                        {basket?.curator && <Tag>{basket.curator}</Tag>}
                        <span className="truncate text-[13px]  text-ink-muted">
                          {label}
                        </span>
                      </div>
                      <div className="col-span-3 text-right text-[13px] tnum text-ink-muted">
                        {fmtShares(src.shares)} sh
                      </div>
                      <div className="col-span-3 text-right text-[13px] tnum text-ink">
                        {fmtMoney(src.value)}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => (
  <div
    className={`${COLS} hairline-b grid gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle`}
  >
    <div className="col-span-6 pl-[22px]">Instrument</div>
    <div className="col-span-3 text-right">Shares</div>
    <div className="col-span-3 text-right">Value</div>
  </div>
);

const Instruments = ({ state }) => {
  const unified = unifiedInstruments(state.standings, state.directHoldings);

  return (
    <div className="overflow-hidden rounded-macos border border-hairline bg-elevated shadow-card">
      <Header />
      {unified.map((inst, i) => (
        <InstrumentRow
          key={inst.instrumentId}
          instrument={inst}
          isLast={i === unified.length - 1}
        />
      ))}
    </div>
  );
};

export default Instruments;
