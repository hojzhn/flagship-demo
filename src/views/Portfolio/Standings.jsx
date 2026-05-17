import { findBasket } from "../../data/Baskets.js";
import { findInstrument } from "../../data/Instruments.js";
import { portfolioTotal, standingGain } from "../../data/Derive.js";
import { fmtMoney, fmtPct } from "../../data/Format.js";
import Tag from "../../components/Tag";
import Icon from "../../components/Icon";

const COLS = "grid-cols-12";

const Header = () => (
  <div
    className={`${COLS} hairline-b grid gap-3 px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-subtle`}
  >
    <div className="col-span-6">Standing</div>
    <div className="col-span-3 text-right">Level</div>
    <div className="col-span-3 text-right">Total</div>
  </div>
);

const Row = ({
  title,
  tag,
  sharePct,
  level,
  total,
  gainPct,
  onClick,
  isLast,
}) => {
  const hasGain = typeof gainPct === "number";
  const gainPositive = hasGain && gainPct >= 0;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={
        `${COLS} grid w-full items-center gap-3 px-5 py-4 text-left transition-colors disabled:cursor-default ` +
        (onClick ? "hover:bg-black/[0.02] " : "") +
        (isLast ? "" : "hairline-b")
      }
    >
      {/* Col 1: curator tag + basket name + share-of-assets subtitle */}
      <div className="col-span-6 min-w-0">
        <div className="flex items-center gap-2">
          {tag && <Tag>{tag}</Tag>}
          <div className="truncate text-[14px] font-medium text-ink">
            {title}
          </div>
        </div>
        <div className="text-2xs text-ink-muted tnum">
          {sharePct}% of assets
        </div>
      </div>

      {/* Col 2: level */}
      <div className="col-span-3 text-right text-[14px] tnum text-ink">
        {level}
      </div>

      {/* Col 3: total + perf */}
      <div className="col-span-3 text-right">
        <div className="text-[14px] font-semibold tnum text-ink">{total}</div>
        {hasGain && (
          <div
            className={
              "mt-0.5 inline-flex items-center gap-1 text-2xs font-medium tnum " +
              (gainPositive ? "text-success" : "text-danger")
            }
          >
            <Icon
              name={gainPositive ? "triangleUp" : "triangleDown"}
              className="h-2 w-2"
            />
            {gainPositive ? "+" : ""}
            {fmtPct(gainPct, 1)}
          </div>
        )}
      </div>
    </button>
  );
};

const Standings = ({ state, onSelectStanding }) => {
  const total = portfolioTotal(state.standings, state.directHoldings);

  const standingRows = state.standings.map((std) => {
    const basket = findBasket(std.basketId);
    const sharePct = total > 0 ? std.currentValue / total : 0;
    const { gainPct } = standingGain(std);
    return {
      key: std.id,
      // Always show the full basket name; the curator goes in the tag.
      title: basket?.name || std.basketId,
      tag: basket?.curator,
      sharePct: Math.round(sharePct * 100),
      level: `${fmtMoney(std.level)} / mo`,
      total: fmtMoney(std.currentValue),
      gainPct,
      onClick: () => onSelectStanding?.(std.id),
    };
  });

  // Direct holdings rolled up into a synthetic last row.
  const directValue = state.directHoldings.reduce((sum, dh) => {
    const inst = findInstrument(dh.instrumentId);
    return inst ? sum + dh.shares * inst.price : sum;
  }, 0);
  const directSharePct = total > 0 ? directValue / total : 0;

  const directRow =
    state.directHoldings.length > 0
      ? {
          key: "direct",
          title: "Direct holdings",
          tag: null,
          sharePct: Math.round(directSharePct * 100),
          level: "—",
          total: fmtMoney(directValue),
          gainPct: undefined,
          onClick: undefined,
        }
      : null;

  const rows = directRow ? [...standingRows, directRow] : standingRows;

  return (
    <div className="overflow-hidden rounded-macos border border-hairline bg-elevated shadow-card">
      <Header />
      {rows.map((row, i) => (
        <Row key={row.key} {...row} isLast={i === rows.length - 1} />
      ))}
    </div>
  );
};

export default Standings;
