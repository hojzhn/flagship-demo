import { useStandings } from "../../data/StandingsContext.jsx";
import { BASKETS } from "../../data/Baskets.js";
import Page from "../../components/Page";
import Breadcrumb from "../../components/Breadcrumb";
import BasketCard from "./BasketCard";

// Per-row entrance delay (ms). Keeps the cascade fast enough to read as
// a single motion but slow enough to register as staggered.
const STAGGER_MS = 50;

const Discover = ({ onSelectBasket }) => {
  const { state } = useStandings();
  const baskets = [...BASKETS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Discover" }, { label: "Baskets" }]}
      />
      <Page
        title="Baskets"
        description="Browse baskets curated by managers. Each basket holds the instruments expressing a thesis the platform tracks across your portfolio."
      >
        <div className="flex items-center justify-between text-2xs text-ink-muted">
          <div>{baskets.length} baskets</div>
          <div>Sorted by name ↓</div>
        </div>

        <div className="space-y-3">
          {baskets.map((basket, i) => (
            <div
              key={basket.id}
              className="row-enter"
              style={{ animationDelay: `${i * STAGGER_MS}ms` }}
            >
              <BasketCard
                basket={basket}
                standing={state.standings.find((s) => s.basketId === basket.id)}
                onClick={
                  onSelectBasket ? () => onSelectBasket(basket.id) : undefined
                }
              />
            </div>
          ))}
        </div>
      </Page>
    </div>
  );
};

export default Discover;
