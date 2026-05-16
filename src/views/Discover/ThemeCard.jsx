import Card from "../../components/Card";
import Pill from "../../components/Pill";
import ProgressBar from "../../components/ProgressBar";
import { fmtMoney, fmtPct } from "../../data/Format.js";

const gapTone = ({ gap, backed, value, portfolioTotal }) => {
  if (value === 0) return "neutral";
  if (gap === 0) return "neutral";
  // Significant unbacked exposure: theme makes up >= 10% of portfolio and
  // the user holds none of it through a basket themed around it.
  if (backed === 0 && portfolioTotal > 0 && gap / portfolioTotal >= 0.1) {
    return "warning";
  }
  return "info";
};

const fmtGap = (gap) => (gap > 0 ? `+${fmtMoney(gap)}` : fmtMoney(gap));

const ThemeCard = ({ theme, portfolioTotal, onClick }) => {
  const tone = gapTone({
    gap: theme.gap,
    backed: theme.backed,
    value: theme.value,
    portfolioTotal,
  });
  const portfolioPct = portfolioTotal > 0 ? theme.value / portfolioTotal : 0;
  const hasThemedBaskets = theme.themedBaskets.length > 0;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="block w-full rounded-macos text-left transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default"
    >
      <Card>
        {/* Header: name/desc on left, gap pill + totals on right */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold tracking-tight text-ink">
              {theme.name}
            </h3>
            <p className="mt-1 max-w-xl text-[13px] leading-[1.45] text-ink-muted">
              {theme.description}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
              Gap
            </div>
            <Pill tone={tone} size="md">
              {fmtGap(theme.gap)}
            </Pill>
            <div className="mt-2 text-[13px]">
              <span className="font-semibold tnum text-ink">
                {fmtPct(portfolioPct, 0)}
              </span>
              <span className="text-ink-muted"> total · </span>
              <span className="tnum text-ink-muted">
                {fmtMoney(theme.value)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress + legend */}
        <ProgressBar
          value={theme.backed}
          total={theme.value}
          className="mt-4"
        />
        <div className="mt-2.5 flex items-center gap-5 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-medium text-ink">Backed</span>
            <span className="tnum text-ink-muted">
              {fmtMoney(theme.backed)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle/60" />
            <span className="font-medium text-ink">Incidental</span>
            <span className="tnum text-ink-muted">
              {fmtMoney(theme.incidental)}
            </span>
          </div>
        </div>

        {/* Baskets section */}
        {hasThemedBaskets && (
          <div className="hairline-t mt-4 pt-4">
            <div className="mb-2 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
              Baskets themed around this
            </div>
            <div className="flex flex-wrap gap-1.5">
              {theme.themedBaskets.map((b) => (
                <Pill key={b.id} tone="outline" size="md">
                  {b.name} · {b.curator}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </Card>
    </button>
  );
};

export default ThemeCard;
