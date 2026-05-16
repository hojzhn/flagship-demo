import Card from "../../components/Card";
import {
  basketAllocationBySector,
  projectedExposure,
} from "../../data/Derive.js";
import { fmtMoney, fmtPct } from "../../data/Format.js";

// Blue shades for sector bar + legend, ordered heaviest → lightest.
const TONES = [
  "bg-accent",
  "bg-accent/70",
  "bg-accent/45",
  "bg-accent/25",
  "bg-accent/15",
];

const SectorBar = ({ sectors }) => (
  <div className="flex h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
    {sectors.map((s, i) => (
      <div
        key={s.sector}
        className={TONES[i] || "bg-accent/15"}
        style={{ width: `${s.weight * 100}%` }}
      />
    ))}
  </div>
);

const SectorLegend = ({ sectors }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
    {sectors.map((s, i) => (
      <div key={s.sector} className="flex items-center gap-1.5">
        <span
          className={
            "h-1.5 w-1.5 shrink-0 rounded-full " +
            (TONES[i] || "bg-accent/15")
          }
        />
        <span className="truncate font-medium text-ink">{s.sector}</span>
        <span className="tnum text-ink-muted">
          {Math.round(s.weight * 100)}%
        </span>
      </div>
    ))}
  </div>
);

const Row = ({ label, children }) => (
  <div className="hairline-t flex items-start justify-between gap-4 py-4">
    <div className="text-[13px] leading-[1.4] text-ink-muted">{label}</div>
    <div className="text-right">{children}</div>
  </div>
);

const CommitSummary = ({ basket, level, state }) => {
  const sectors = basketAllocationBySector(basket);
  const annualContribution = level * 12;
  const annualFee = annualContribution * basket.expenseRatio;
  const projection = projectedExposure(
    state.standings,
    state.directHoldings,
    basket,
    level,
  );

  return (
    <Card className="p-7">
      <h3 className="text-[16px] font-semibold tracking-tight text-ink">
        What this commit produces
      </h3>

      {/* Allocation */}
      <div className="mt-5 grid grid-cols-3 gap-x-5 pb-1">
        <div className="text-[13px] leading-[1.4] text-ink-muted">
          Allocation across {basket.holdings.length} holdings
        </div>
        <div className="col-span-2">
          <SectorBar sectors={sectors} />
          <div className="mt-3">
            <SectorLegend sectors={sectors} />
          </div>
        </div>
      </div>

      <Row label="Risk profile">
        <div className="text-[14px] font-semibold text-ink">
          {basket.riskLabel}
        </div>
        <div className="text-2xs text-ink-muted">
          {basket.riskRating} of 7 · {basket.horizonYears.min} to{" "}
          {basket.horizonYears.max} year horizon
        </div>
      </Row>

      <Row label="Cadence">
        <div className="text-[14px] font-semibold text-ink">
          Monthly{" "}
          <span className="font-normal text-ink-muted">
            · rebalanced quarterly
          </span>
        </div>
      </Row>

      <Row label="Annual fee">
        <div className="text-[14px] font-semibold text-ink tnum">
          {fmtPct(basket.expenseRatio, 2)}{" "}
          <span className="font-normal text-ink-muted">
            ≈ {fmtMoney(annualFee)} / year
          </span>
        </div>
      </Row>

      {projection && (
        <Row label="Portfolio impact">
          <div className="text-[14px] font-semibold text-ink tnum">
            {fmtPct(projection.current, 0)} → {fmtPct(projection.projected, 0)}{" "}
            <span className="font-normal text-ink-muted">exposure</span>
          </div>
        </Row>
      )}
    </Card>
  );
};

export default CommitSummary;
