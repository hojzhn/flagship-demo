import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Icon from "./components/Icon";
import Button from "./components/Button";
import Discover from "./views/Discover";
import BasketDetail from "./views/BasketDetail";
import Commit from "./views/Commit";
import StandingDetail from "./views/StandingDetail";
import ThemeDetail from "./views/ThemeDetail";
import Portfolio from "./views/Portfolio";
import { findBasket } from "./data/Baskets.js";

// Top-level routes the StandingDetail can hang under. Determines which
// sidebar item stays highlighted and which page the back link returns
// to. New roots get a label here.
const ROOT_LABEL = {
  discover: "Discover",
  portfolio: "Portfolio",
};

const App = () => {
  // Route is an object so detail pages can carry an id alongside the name.
  //   { name: "discover" } | { name: "portfolio" } | ...
  //   { name: "basket-detail",   basketId:   "ai-infra-expansion" }
  //   { name: "commit",          basketId:   "ai-infra-expansion" }
  //   { name: "standing-detail", standingId: "std-ai-infra-1", from: "portfolio" }
  //   { name: "theme-detail",    themeId:    "ai-infrastructure" }
  //
  // `from` on standing-detail records which top-level menu the user
  // entered the detail from, so the sidebar + back link reflect that.
  const [route, setRoute] = useState({ name: "discover" });
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const inBasketDetail = route.name === "basket-detail";
  const inCommit = route.name === "commit";
  const inStandingDetail = route.name === "standing-detail";
  const inThemeDetail = route.name === "theme-detail";
  const inDetail =
    inBasketDetail || inCommit || inStandingDetail || inThemeDetail;

  // Basket/Commit/Theme detail pages always live under Discover.
  // StandingDetail lives under whatever opened it (Discover by default).
  const standingRoot = route.from || "discover";
  let sidebarActive;
  if (inBasketDetail || inCommit || inThemeDetail) sidebarActive = "discover";
  else if (inStandingDetail) sidebarActive = standingRoot;
  else sidebarActive = route.name;

  const goRoot = (name) => setRoute({ name });
  const goDiscover = () => goRoot("discover");
  const goBasket = (basketId) =>
    setRoute({ name: "basket-detail", basketId });
  const goCommit = (basketId) => setRoute({ name: "commit", basketId });
  const goStanding = (standingId, from = "discover") =>
    setRoute({ name: "standing-detail", standingId, from });
  const goTheme = (themeId) => setRoute({ name: "theme-detail", themeId });

  // Wider columns for surfaces that hold tables / two-up layouts;
  // narrow reading column for everything else.
  const wideRoutes = inCommit || route.name === "portfolio";
  const contentMaxWidth = wideRoutes ? "max-w-[840px]" : "max-w-[840px]";

  const renderView = () => {
    if (inStandingDetail) {
      return (
        <StandingDetail
          standingId={route.standingId}
          onLeave={() => goRoot(standingRoot)}
        />
      );
    }
    if (inThemeDetail) {
      return (
        <ThemeDetail
          themeId={route.themeId}
          onBack={goDiscover}
          onSelectBasket={goBasket}
        />
      );
    }
    if (inCommit) {
      return (
        <Commit
          basketId={route.basketId}
          onCancel={() => goBasket(route.basketId)}
          onChange={goDiscover}
          onCommitted={(standingId) => goStanding(standingId, "discover")}
        />
      );
    }
    if (inBasketDetail) {
      return (
        <BasketDetail
          basketId={route.basketId}
          onBack={goDiscover}
          onCommit={() => goCommit(route.basketId)}
          onViewStanding={(id) => goStanding(id, "discover")}
        />
      );
    }
    if (route.name === "discover") {
      return (
        <Discover onSelectBasket={goBasket} onSelectTheme={goTheme} />
      );
    }
    if (route.name === "portfolio") {
      return (
        <Portfolio onSelectStanding={(id) => goStanding(id, "portfolio")} />
      );
    }
    return null;
  };

  const renderTopBar = () => {
    if (inStandingDetail) {
      return (
        <TopBar>
          <button
            onClick={() => goRoot(standingRoot)}
            className="-ml-2 inline-flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[14px] font-medium text-accent hover:bg-accent-soft"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            {ROOT_LABEL[standingRoot] || "Back"}
          </button>
        </TopBar>
      );
    }
    if (inThemeDetail) {
      return (
        <TopBar>
          <button
            onClick={goDiscover}
            className="-ml-2 inline-flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[14px] font-medium text-accent hover:bg-accent-soft"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            Discover
          </button>
        </TopBar>
      );
    }
    if (inCommit) {
      const basket = findBasket(route.basketId);
      return (
        <TopBar>
          <button
            onClick={() => goBasket(route.basketId)}
            className="-ml-2 inline-flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[14px] font-medium text-accent hover:bg-accent-soft"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            {basket?.name || "Back"}
          </button>
        </TopBar>
      );
    }
    if (inBasketDetail) {
      return (
        <TopBar>
          <button
            onClick={goDiscover}
            className="-ml-2 inline-flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[14px] font-medium text-accent hover:bg-accent-soft"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            Discover
          </button>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => goCommit(route.basketId)}
          >
            Back this basket
          </Button>
        </TopBar>
      );
    }
    return (
      <TopBar view={route.name} theme={theme} onToggleTheme={toggleTheme} />
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-ink">
      <Sidebar
        active={sidebarActive}
        onSelect={(id) => setRoute({ name: id })}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {renderTopBar()}
        <div className="flex-1 overflow-y-auto p-8">
          <div className={`mx-auto ${contentMaxWidth}`}>{renderView()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
