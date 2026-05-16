import { fmtPct } from "../../data/Format.js";

// Compact instrument table for the theme detail page. No weights — each
// instrument is either a member of the theme or it isn't (binary).

const ThemeInstruments = ({ instruments }) => (
  <div>
    <div className="hairline-b grid grid-cols-12 gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
      <div className="col-span-6">Instrument</div>
      <div className="col-span-2 text-right">Price</div>
      <div className="col-span-2 text-right">30D</div>
      <div className="col-span-2 text-right">Sector</div>
    </div>

    {instruments.map((inst, idx) => {
      const positive = inst.change30d >= 0;
      const last = idx === instruments.length - 1;
      return (
        <div
          key={inst.id}
          className={
            "grid grid-cols-12 items-center gap-3 px-5 py-3.5 " +
            (last ? "" : "hairline-b")
          }
        >
          <div className="col-span-6 min-w-0">
            <div className="truncate text-[14px] font-medium text-ink">
              {inst.name}
            </div>
            <div className="text-2xs uppercase tracking-wider text-ink-subtle tnum">
              {inst.ticker}
            </div>
          </div>
          <div className="col-span-2 text-right text-[14px] tnum text-ink">
            ${inst.price.toFixed(2)}
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

export default ThemeInstruments;
