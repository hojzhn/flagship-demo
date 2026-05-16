import Card from "../../components/Card";
import SectionHeader from "../../components/SectionHeader";
import { findTheme } from "../../data/Themes.js";
import {
  instrumentsForTheme,
  basketsForTheme,
  newsForTheme,
} from "../../data/Derive.js";
import BasketCard from "../Discover/BasketCard";
import NewsCard from "../BasketDetail/NewsCard";
import ThemeInstruments from "./ThemeInstruments";

const ThemeDetail = ({ themeId, onBack, onSelectBasket }) => {
  const theme = findTheme(themeId);
  if (!theme) {
    return <div className="text-[14px] text-ink-muted">Theme not found.</div>;
  }

  const instruments = instrumentsForTheme(themeId);
  const baskets = basketsForTheme(themeId);
  const news = newsForTheme(themeId);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-ink-muted">
        <button onClick={onBack} className="text-accent hover:underline">
          Discover
        </button>
        <span> · </span>
        <button onClick={onBack} className="text-accent hover:underline">
          Themes
        </button>
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
            title="Baskets themed around this"
            meta={`${baskets.length} basket${baskets.length === 1 ? "" : "s"}`}
            description="Backing one of these is the most direct way to deepen exposure to this theme."
          />
          <div className="mt-4 space-y-3">
            {baskets.map((b) => (
              <BasketCard
                key={b.id}
                basket={b}
                onClick={
                  onSelectBasket ? () => onSelectBasket(b.id) : undefined
                }
              />
            ))}
          </div>
        </section>
      )}
      {/* Instruments in this theme */}
      <section>
        <SectionHeader
          title="Instruments in this theme"
          meta={`${instruments.length} qualifying`}
          description="Companies the platform reads as members of this theme. Membership is binary — full position value counts toward exposure."
        />
        <Card padded={false} className="mt-4">
          <ThemeInstruments instruments={instruments} />
        </Card>
      </section>

      {/* News on this theme */}
      {news.length > 0 && (
        <section>
          <SectionHeader
            title="News on this theme"
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
