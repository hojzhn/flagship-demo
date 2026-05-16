import { fmtPct } from "../../data/Format.js";

const MAX_TICKERS = 3;

const tickerList = (tickers) => {
  const visible = tickers.slice(0, MAX_TICKERS);
  const hidden = tickers.length - visible.length;
  return hidden > 0
    ? `${visible.join(", ")}, +${hidden} more`
    : visible.join(", ");
};

const ThemesReinforced = ({ themes }) => (
  <div>
    <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
      Related themes
    </div>
    <ul className="mt-4 divide-y divide-hairline">
      {themes.map((theme) => (
        <li
          key={theme.themeId}
          className="flex items-start justify-between gap-4 py-4 first:pt-0"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-ink">
              {theme.themeName}
            </div>
            <div className="mt-1 text-[13px] text-ink-muted">
              {tickerList(theme.throughTickers)}
            </div>
          </div>
          <div className="shrink-0 text-right text-[14px] tnum">
            <span className="font-semibold text-ink">
              {fmtPct(theme.contributionPct, 0)}
            </span>
            <span className="text-ink-subtle">
              {" / "}
              {fmtPct(theme.exposurePct, 0)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ThemesReinforced;
