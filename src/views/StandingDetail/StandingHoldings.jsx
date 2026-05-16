import {
  instrumentsForStanding,
  unifiedInstruments,
} from "../../data/Derive.js";
import { findInstrument } from "../../data/Instruments.js";
import { fmtMoney, fmtPct, fmtShares } from "../../data/Format.js";
import Icon from "../../components/Icon";

// Per-instrument breakdown of one standing. Differs from the shared
// HoldingsTable (which shows basket composition) by also reporting the
// user's TOTAL holding of each instrument across every source — so they
// can see how much of their NVDA position lives in this standing vs the
// rest of their portfolio.

const StandingHoldings = ({ standing, state }) => {
  const rows = [...instrumentsForStanding(standing)].sort(
    (a, b) => b.weight - a.weight,
  );
  const unified = unifiedInstruments(state.standings, state.directHoldings);
  const totalSharesById = new Map(
    unified.map((u) => [u.instrumentId, u.shares]),
  );

  return (
    <div>
      <div className="hairline-b grid grid-cols-12 gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
        <div className="col-span-5">Instrument</div>
        <div className="col-span-3">Weight</div>
        <div className="col-span-4 text-right">Value</div>
      </div>

      {rows.map((h, idx) => {
        const inst = findInstrument(h.instrumentId);
        if (!inst) return null;
        const totalShares = totalSharesById.get(h.instrumentId) ?? h.shares;
        const sharesText =
          totalShares > h.shares
            ? `${fmtShares(h.shares)} sh of ${fmtShares(totalShares)} sh`
            : `${fmtShares(h.shares)} sh`;
        const positive = inst.change30d >= 0;
        const last = idx === rows.length - 1;

        return (
          <div
            key={h.instrumentId}
            className={
              "grid grid-cols-12 items-center gap-3 px-5 py-3.5 " +
              (last ? "" : "hairline-b")
            }
          >
            {/* Col 1: ticker + shares (this standing / total) */}
            <div className="col-span-5 min-w-0">
              <div className="text-[14px] font-semibold text-ink tnum">
                {inst.ticker}
              </div>
              <div className="text-2xs text-ink-muted tnum">{sharesText}</div>
            </div>

            {/* Col 2: weight bar + percent */}
            <div className="col-span-3 flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-black/[0.08]">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${h.weight * 100}%` }}
                />
              </div>
              <span className="text-[13px] tnum text-ink">
                {fmtPct(h.weight, 0)}
              </span>
            </div>

            {/* Col 3: value + 30D perf */}
            <div className="col-span-4 text-right">
              <div className="text-[14px] font-semibold tnum text-ink">
                {fmtMoney(h.value)}
              </div>
              <div
                className={
                  "mt-0.5 inline-flex items-center gap-1 text-[13px] font-medium tnum " +
                  (positive ? "text-success" : "text-danger")
                }
              >
                <Icon
                  name={positive ? "triangleUp" : "triangleDown"}
                  className="h-2 w-2"
                />
                {positive ? "+" : ""}
                {fmtPct(inst.change30d, 1)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StandingHoldings;
