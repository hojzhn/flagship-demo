import { themeExposures, portfolioTotal } from "../../data/Derive.js";
import { fmtMoney } from "../../data/Format.js";
import ProgressBar from "../../components/ProgressBar";

const COLS = "grid-cols-12";

const Header = () => (
  <div
    className={`${COLS} hairline-b grid gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle`}
  >
    <div className="col-span-8">Theme</div>
    <div className="col-span-4 text-right">Exposure</div>
  </div>
);

const ThemeRow = ({ theme, total, isLast, onClick }) => {
  const exposurePct = total > 0 ? theme.value / total : 0;
  const backedPct = total > 0 ? theme.backed / total : 0;
  const incidentalPct = total > 0 ? theme.incidental / total : 0;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={
        "block w-full text-left px-5 py-4 transition-colors disabled:cursor-default " +
        (onClick ? "hover:bg-black/[0.02] " : "") +
        (isLast ? "" : "hairline-b")
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-ink">
            {theme.name}
          </div>
          <div className="text-2xs uppercase tracking-wider text-ink-subtle">
            Derived measurement
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[16px] font-semibold tnum text-ink">
            {Math.round(exposurePct * 100)}%
          </div>
          <div className="text-2xs tnum text-ink-muted">
            {fmtMoney(theme.value)}
          </div>
        </div>
      </div>

      <ProgressBar value={theme.backed} total={theme.value} className="mt-3" />

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[13px]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
            Standing
          </span>
          <span className="tnum text-ink">
            {fmtMoney(theme.backed)}{" "}
            <span className="text-ink-muted">
              ({Math.round(backedPct * 100)}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle/50" />
          <span className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
            Incidental
          </span>
          <span className="tnum text-ink">
            {fmtMoney(theme.incidental)}{" "}
            <span className="text-ink-muted">
              ({Math.round(incidentalPct * 100)}%)
            </span>
          </span>
        </div>
      </div>
    </button>
  );
};

const Themes = ({ state, onSelectTheme }) => {
  const total = portfolioTotal(state.standings, state.directHoldings);
  const exposures = themeExposures(state.standings, state.directHoldings)
    .filter((t) => t.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="overflow-hidden rounded-macos border border-hairline bg-elevated shadow-card">
      <Header />
      {exposures.map((theme, i) => (
        <ThemeRow
          key={theme.themeId}
          theme={theme}
          total={total}
          isLast={i === exposures.length - 1}
          onClick={
            onSelectTheme ? () => onSelectTheme(theme.themeId) : undefined
          }
        />
      ))}
    </div>
  );
};

export default Themes;
