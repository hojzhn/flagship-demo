import Card from "../../components/Card";
import Pill from "../../components/Pill";
import { coverageLabel } from "../../data/Derive.js";

const MAX_VISIBLE_SOURCES = 4;

const CoverageDots = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={
          "h-1.5 w-1.5 rounded-full " +
          (i <= value ? "bg-accent" : "bg-black/[0.12]")
        }
      />
    ))}
  </div>
);

const NewsCard = ({ item }) => {
  const visible = item.sources.slice(0, MAX_VISIBLE_SOURCES);
  const remaining = item.sources.length - visible.length;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex-1 text-[15px] font-semibold leading-[1.35] tracking-tight text-ink">
          {item.title}
        </h3>
        <span className="shrink-0 text-2xs text-ink-subtle">
          {item.timestamp}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-[1.5] text-ink-muted">
        {item.summary}
      </p>

      <div className="hairline-t mt-4 flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-2xs text-ink-muted">Coverage</span>
          <CoverageDots value={item.coverage} />
          <span className="text-[13px] font-semibold text-ink">
            {coverageLabel(item.coverage)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {visible.map((s) => (
            <Pill key={s} tone="outline" size="sm">
              {s}
            </Pill>
          ))}
          {remaining > 0 && (
            <Pill tone="outline" size="sm" className="text-accent">
              +{remaining} more
            </Pill>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
