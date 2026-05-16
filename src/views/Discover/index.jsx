import { useState } from "react";
import { useStandings } from "../../data/StandingsContext.jsx";
import { themeExposures, portfolioTotal } from "../../data/Derive.js";
import { BASKETS } from "../../data/Baskets.js";
import Page from "../../components/Page";
import SegmentedControl from "../../components/SegmentedControl";
import ThemeCard from "./ThemeCard";
import BasketCard from "./BasketCard";

const TABS = [
  { value: "baskets", label: "Baskets" },
  { value: "themes", label: "Themes" },
];

const Discover = ({ onSelectBasket, onSelectTheme }) => {
  const [tab, setTab] = useState("baskets");
  const { state } = useStandings();
  const total = portfolioTotal(state.standings, state.directHoldings);

  const themes = themeExposures(state.standings, state.directHoldings)
    .map((t) => ({
      ...t,
      gap: t.incidental,
      themedBaskets: BASKETS.filter((b) => b.themedAround.includes(t.themeId)),
    }))
    .sort((a, b) => b.gap - a.gap);

  const baskets = [...BASKETS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Page
      title="Discover"
      description="Browse baskets curated by managers, or look at themes the platform reads across your holdings. Themes show you where your exposure sits, including where it does not match your backing."
    >
      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

      <div className="flex items-center justify-between text-2xs text-ink-muted">
        <div>
          {tab === "themes"
            ? `${themes.length} themes`
            : `${baskets.length} baskets`}
        </div>
        <div>
          Sorted by {tab === "themes" ? "gap (largest first)" : "name"} ↓
        </div>
      </div>

      <div className="space-y-3">
        {tab === "themes"
          ? themes.map((theme) => (
              <ThemeCard
                key={theme.themeId}
                theme={theme}
                portfolioTotal={total}
                onClick={
                  onSelectTheme
                    ? () => onSelectTheme(theme.themeId)
                    : undefined
                }
              />
            ))
          : baskets.map((basket) => (
              <BasketCard
                key={basket.id}
                basket={basket}
                standing={state.standings.find(
                  (s) => s.basketId === basket.id,
                )}
                onClick={
                  onSelectBasket ? () => onSelectBasket(basket.id) : undefined
                }
              />
            ))}
      </div>
    </Page>
  );
};

export default Discover;
