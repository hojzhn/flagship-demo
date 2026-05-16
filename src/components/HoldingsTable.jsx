import { findInstrument } from "../data/Instruments.js";
import { fmtPct } from "../data/Format.js";

// Weighted holdings table. Used on basket detail and the commit screen.
// Pass `holdings` as an array of { instrumentId, weight }; the row order
// is sorted by weight (heaviest first) internally.

const HoldingsTable = ({ holdings }) => {
  const rows = [...holdings].sort((a, b) => b.weight - a.weight);

  return (
    <div>
      <div className="hairline-b grid grid-cols-12 gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
        <div className="col-span-5">Instrument</div>
        <div className="col-span-3">Weight</div>
        <div className="col-span-2 text-right">30D</div>
        <div className="col-span-2 text-right">Sector</div>
      </div>

      {rows.map((h, idx) => {
        const inst = findInstrument(h.instrumentId);
        if (!inst) return null;
        const last = idx === rows.length - 1;
        const positive = inst.change30d >= 0;
        return (
          <div
            key={h.instrumentId}
            className={
              "grid grid-cols-12 items-center gap-3 px-5 py-3.5 " +
              (last ? "" : "hairline-b")
            }
          >
            <div className="col-span-5 min-w-0">
              <div className="truncate text-[14px] font-medium text-ink">
                {inst.name}
              </div>
              <div className="text-2xs text-ink-muted tnum">
                {inst.ticker} · ${inst.price.toFixed(2)}
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/[0.08]">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${h.weight * 100}%` }}
                />
              </div>
              <span className="text-[13px] tnum text-ink">
                {fmtPct(h.weight, 0)}
              </span>
            </div>
            <div
              className={
                "col-span-2 text-right text-[14px] font-medium tnum " +
                (positive ? "text-success" : "text-danger")
              }
            >
              {positive ? "+" : ""}
              {fmtPct(inst.change30d, 1)}
            </div>
            <div className="col-span-2 truncate text-right text-[13px] text-ink-muted">
              {inst.sector}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HoldingsTable;
