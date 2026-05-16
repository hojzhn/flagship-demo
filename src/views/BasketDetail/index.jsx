import Card from "../../components/Card";
import SectionHeader from "../../components/SectionHeader";
import HoldingsTable from "../../components/HoldingsTable";
import Button from "../../components/Button";
import Pill from "../../components/Pill";
import NewsCard from "./NewsCard";
import { findBasket } from "../../data/Baskets.js";
import { newsForBasket } from "../../data/Derive.js";
import { fmtPct } from "../../data/Format.js";
import { useStandings } from "../../data/StandingsContext.jsx";

const Meta = ({ value, label, separator = " " }) => (
  <div>
    <span className="font-semibold text-ink">{value}</span>
    <span className="text-ink-muted">
      {separator}
      {label}
    </span>
  </div>
);

const BasketDetail = ({ basketId, onBack, onCommit, onViewStanding }) => {
  const basket = findBasket(basketId);
  const { state } = useStandings();
  const standing = state.standings.find((s) => s.basketId === basketId);

  if (!basket) {
    return <div className="text-[14px] text-ink-muted">Basket not found.</div>;
  }

  const news = newsForBasket(basketId);
  const hasStanding = !!standing;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-ink-muted">
        <button onClick={onBack} className="text-accent hover:underline">
          Discover
        </button>
        <span> · </span>
        <button onClick={onBack} className="text-accent hover:underline">
          Baskets
        </button>
        <span> · </span>
        <span className="text-ink">{basket.name}</span>
      </nav>

      {/* Title + meta */}
      <header>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-ink">
            {basket.name}
          </h1>
          {hasStanding && (
            <Pill tone="info" size="md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Backed
            </Pill>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
          <Meta value={basket.curator} label="Curator" separator=" · " />
          <Meta value={basket.holdings.length} label="holdings" />
          <Meta value={fmtPct(basket.expenseRatio, 2)} label="annual fee" />
          <Meta
            value={`${basket.horizonYears.min} to ${basket.horizonYears.max} year`}
            label="horizon"
          />
          <Meta
            value={basket.riskLabel}
            label={`risk (${basket.riskRating} of 7)`}
          />
        </div>
      </header>

      {/* Thesis */}
      <Card className="p-8">
        <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
          Thesis
        </div>
        <p className="mt-4 text-[22px] font-semibold leading-[1.3] tracking-tight text-ink">
          {basket.thesis.headline}
        </p>
        <div className="mt-5 space-y-4 text-[14px] leading-[1.6] text-ink-muted">
          {basket.thesis.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Card>

      {/* Holdings */}
      {/* <section>
        <SectionHeader
          title="What this basket holds"
          meta={`${basket.holdings.length} instruments · rebalanced quarterly`}
          description="Each holding is selected for direct exposure to the thesis above. Weights reflect the curator's view of relative impact."
        />
        <Card padded={false} className="mt-4">
          <HoldingsTable holdings={basket.holdings} />
        </Card>
      </section> */}

      {/* CTA */}
      <Card className="p-8">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">
          {hasStanding ? "Your standing" : "Back this basket"}
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          {hasStanding
            ? "You are already backing this basket. Open the standing to adjust, pause, or retract."
            : "Set a monthly level. Allocation, risk, and fees will appear as you decide."}
        </p>
        {hasStanding ? (
          <Button
            variant="outline"
            size="lg"
            className="mt-5"
            onClick={() => onViewStanding?.(standing.id)}
          >
            View your standing
          </Button>
        ) : (
          <Button size="lg" className="mt-5" onClick={onCommit}>
            Back this basket
          </Button>
        )}
      </Card>

      {/* News */}
      {news.length > 0 && (
        <section>
          <SectionHeader
            title="News on this thesis"
            description="Each story shows how broadly it was reported. Tap a source to read the original."
          />
          <div className="mt-4 space-y-3">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BasketDetail;
