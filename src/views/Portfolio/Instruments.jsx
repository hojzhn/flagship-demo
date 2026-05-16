import { useState } from "react";
import { unifiedInstruments } from "../../data/Derive.js";
import { findBasket } from "../../data/Baskets.js";
import { fmtMoney, fmtShares } from "../../data/Format.js";
import Icon from "../../components/Icon";
import Pill from "../../components/Pill";

const COLS = "grid-cols-12";

const InstrumentRow = ({ instrument, isLast }) => {
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

      {expandable && expanded && (
        <div className="hairline-t bg-surface/40 px-5 py-3">
          <div className="mb-2 pl-[22px] text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
            Held through
          </div>
          <ul>
            {instrument.sources.map((src, i) => {
              const basket =
                src.kind === "basket" ? findBasket(src.basketId) : null;
              const label = basket?.name || src.basketName || "Direct";
              return (
                <li
                  key={i}
                  className={`${COLS} grid items-center gap-3 py-1.5`}
                >
                  <div className="col-span-6 flex min-w-0 items-center gap-2 pl-[22px]">
                    <span className="truncate text-[13px] uppercase tracking-wider text-ink-muted">
                      {label}
                    </span>
                    {basket?.curator && (
                      <Pill tone="outline" size="sm">
                        {basket.curator}
                      </Pill>
                    )}
                  </div>
                  <div className="col-span-3 text-right text-[13px] tnum text-ink-muted">
                    {fmtShares(src.shares)} sh
                  </div>
                  <div className="col-span-3 text-right text-[13px] tnum text-ink">
                    {fmtMoney(src.value)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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
