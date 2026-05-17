import Card from "../../components/Card";
import SectionHeader from "../../components/SectionHeader";
import HoldingsTable from "../../components/HoldingsTable";
import { findTheme } from "../../data/Themes.js";
import {
  instrumentsForTheme,
  basketsForTheme,
  newsForTheme,
  unifiedInstruments,
} from "../../data/Derive.js";
import { useStandings } from "../../data/StandingsContext.jsx";
import BasketCard from "../Discover/BasketCard";
import NewsCard from "../BasketDetail/NewsCard";

const ThemeDetail = ({ themeId, onBack, onSelectBasket }) => {
  const theme = findTheme(themeId);
  const { state } = useStandings();

  if (!theme) {
    return <div className="text-[14px] text-ink-muted">Theme not found.</div>;
  }

  const instruments = instrumentsForTheme(themeId);
  const baskets = basketsForTheme(themeId);
  const news = newsForTheme(themeId);

  // Enrich each theme instrument with the user's total share count
  // (across all standings + direct holdings), so HoldingsTable can
  // surface a "you own X.X sh" badge in theme mode.
  const unified = unifiedInstruments(state.standings, state.directHoldings);
  const sharesByInstrument = new Map(
    unified.map((u) => [u.instrumentId, u.shares]),
  );
  const enrichedInstruments = instruments.map((inst) => ({
    ...inst,
    userShares: sharesByInstrument.get(inst.id) || 0,
  }));

  return (
    <div className="space-y-10">
      {/* Breadcrumb — "Themes" is non-clickable since there's no
          standalone Themes page to land on; the topbar back is the
          way out. */}
      <nav className="text-[13px] text-ink-muted">
        <span>Themes</span>
        <span> · </span>
        <span className="text-ink">{theme.name}</span>
      </nav>

      {/* Title + description */}
      <header>
        <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-ink">
          {theme.name}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.55] text-ink-muted">
          {theme.description}
        </p>
      </header>

      {/* Baskets themed around this */}
      {baskets.length > 0 && (
        <section>
          <SectionHeader
            title="Baskets"
            meta={`${baskets.length} basket${baskets.length === 1 ? "" : "s"}`}
            description="Thematic baskets that are directly related to this theme."
          />
          <div className="mt-4 space-y-3">
            {baskets.map((b) => {
              const standing = state.standings.find((s) => s.basketId === b.id);
              return (
                <BasketCard
                  key={b.id}
                  basket={b}
                  standing={standing}
                  onClick={
                    onSelectBasket ? () => onSelectBasket(b.id) : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Instruments in this theme */}
      <section>
        <SectionHeader
          title="Instruments"
          meta={`${instruments.length} qualifying`}
          description="Companies the platform reads as members of this theme. Full position value counts toward exposure."
        />
        <Card padded={false} className="mt-4">
          <HoldingsTable instruments={enrichedInstruments} />
        </Card>
      </section>

      {/* News on this theme */}
      {news.length > 0 && (
        <section>
          <SectionHeader
            title="News "
            meta={`${news.length} stor${news.length === 1 ? "y" : "ies"}`}
            description="Coverage of the companies and trends behind this theme."
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

export default ThemeDetail;
