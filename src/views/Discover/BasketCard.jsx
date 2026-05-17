import Card from "../../components/Card";
import Pill from "../../components/Pill";
import Tag from "../../components/Tag";
import Icon from "../../components/Icon";
import { fmtMoney, fmtPct } from "../../data/Format.js";
import { standingGain } from "../../data/Derive.js";

const riskTone = (rating) => {
  if (rating <= 3) return "success";
  if (rating <= 5) return "info";
  return "warning";
};

const BasketCard = ({ basket, standing, onClick }) => {
  const hasStanding = !!standing;
  const { gainPct } = hasStanding ? standingGain(standing) : { gainPct: 0 };
  const gainPositive = gainPct >= 0;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="block w-full rounded-macos text-left transition-transform duration-150 ease-out enabled:hover:scale-[101%] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default"
    >
      <Card>
        {/* Row 1: ✓ (if backed) | name + description | holding + perf (if backed) */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold tracking-tight text-ink flex flex-row items-center gap-2">
              <Tag>{basket.curator}</Tag>
              {basket.name}
              {hasStanding && (
                <div className="inline grid h-4 w-4 place-items-center rounded-full bg-success text-white">
                  <Icon name="check" className="h-3 w-3" />
                </div>
              )}
            </h3>
            <p className="mt-1 text-[13px] leading-[1.45] text-ink-muted">
              {basket.description}
            </p>
          </div>

          {hasStanding && (
            <div className="shrink-0 text-right">
              <div className="text-[16px] font-semibold tnum text-ink">
                {fmtMoney(standing.currentValue)}
              </div>
              <div
                className={
                  "mt-1 inline-flex items-center gap-1 text-[13px] font-medium tnum " +
                  (gainPositive ? "text-success" : "text-danger")
                }
              >
                <Icon
                  name={gainPositive ? "triangleUp" : "triangleDown"}
                  className="h-2.5 w-2.5"
                />
                {gainPositive ? "+" : ""}
                {fmtPct(gainPct, 1)}
              </div>
            </div>
          )}
        </div>

        {/* Row 2: meta pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Pill tone={riskTone(basket.riskRating)} size="sm">
            {basket.riskLabel} · {basket.riskRating}/7
          </Pill>
          <Pill tone="neutral" size="sm">
            {fmtPct(basket.expenseRatio, 2)} fee
          </Pill>
          <Pill tone="neutral" size="sm">
            {basket.horizonYears.min}–{basket.horizonYears.max} yr horizon
          </Pill>
        </div>
      </Card>
    </button>
  );
};

export default BasketCard;
