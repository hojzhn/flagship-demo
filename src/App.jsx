import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Discover from "./views/Discover";
import BasketDetail from "./views/BasketDetail";
import Commit from "./views/Commit";
import StandingDetail from "./views/StandingDetail";
import ThemeDetail from "./views/ThemeDetail";
import Portfolio from "./views/Portfolio";
import Confirmation from "./views/Confirmation";

const App = () => {
  // Route is an object so detail pages can carry an id alongside the name.
  //   { name: "discover" } | { name: "portfolio" } | ...
  //   { name: "basket-detail",   basketId:   "ai-infra-expansion" }
  //   { name: "commit",          basketId:   "ai-infra-expansion" }
  //   { name: "standing-detail", standingId: "std-ai-infra-1",   from: "portfolio" }
  //   { name: "theme-detail",    themeId:    "ai-infrastructure", from: "portfolio" }
  //
  // `from` on standing-detail / theme-detail records which top-level
  // menu the user entered the detail from, so the sidebar + back link
  // reflect that.
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
  const inConfirmation = route.name === "confirmation";

  // Which top-level menu a detail route reports as its "home".
  //   - Basket/Commit/Confirmation always live under Discover.
  //   - StandingDetail always lives under Portfolio (a standing's
  //     natural home, regardless of which menu the user entered from).
  //   - ThemeDetail follows the entry point (themes don't have a
  //     single natural home — they show up in both Discover and
  //     Portfolio surfaces).
  const detailRoot = route.from || "discover";
  const ROUTE_ROOT = {
    "basket-detail": "discover",
    commit: "discover",
    confirmation: "discover",
    "standing-detail": "portfolio",
    "theme-detail": detailRoot,
  };
  const sidebarActive = ROUTE_ROOT[route.name] ?? route.name;

  const goRoot = (name) => setRoute({ name });
  const goDiscover = () => goRoot("discover");
  const goBasket = (basketId) => setRoute({ name: "basket-detail", basketId });
  const goCommit = (basketId) => setRoute({ name: "commit", basketId });
  const goStanding = (standingId, from = "discover") =>
    setRoute({ name: "standing-detail", standingId, from });
  const goTheme = (themeId, from = "discover") =>
    setRoute({ name: "theme-detail", themeId, from });
  // Hand the full order off to the confirmation page so it can show
  // the right copy (purchase vs standing) and route the final CTA.
  const goConfirmation = (order) =>
    setRoute({ name: "confirmation", ...order });

  // Navigation handlers grouped for TopBar — which decides its own
  // layout based on the current route and calls back as needed.
  const nav = { goRoot, goDiscover, goBasket, goCommit, goStanding, goTheme };

  // Wider columns for surfaces that hold tables / two-up layouts;
  // narrow reading column for everything else.
  const wideRoutes = inCommit || route.name === "portfolio";
  const contentMaxWidth = wideRoutes ? "max-w-[840px]" : "max-w-[840px]";

  // Unique identity per view — drives <AnimatePresence>'s exit/enter.
  // When this string changes, the old view fades out and the new one
  // fades in. Detail routes include their id so navigating between
  // siblings (basket A → basket B) also triggers a transition.
  const routeKey = (() => {
    if (inBasketDetail) return `basket-detail-${route.basketId}`;
    if (inCommit) return `commit-${route.basketId}`;
    if (inStandingDetail) return `standing-detail-${route.standingId}`;
    if (inThemeDetail) return `theme-detail-${route.themeId}`;
    if (inConfirmation) {
      if (route.kind === "retract")
        return `confirmation-retract-${route.basketId}`;
      return `confirmation-${route.standingId ?? `once-${route.basketId}-${route.level}`}`;
    }
    return route.name;
  })();

  // Reset the content scroll position between view transitions. Runs
  // on AnimatePresence's `onExitComplete`, which fires after the old
  // view has finished fading out and before the new one mounts — so
  // the incoming view starts its fade-in at scroll 0 rather than
  // appearing scrolled-down and snapping up mid-animation.
  const scrollRef = useRef(null);
  const resetScroll = () => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  };

  const renderView = () => {
    if (inStandingDetail) {
      return (
        <StandingDetail
          standingId={route.standingId}
          from={detailRoot}
          onLeave={() => goRoot(detailRoot)}
          onRetracted={goConfirmation}
        />
      );
    }
    if (inThemeDetail) {
      return (
        <ThemeDetail
          themeId={route.themeId}
          onBack={() => goRoot(detailRoot)}
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
          onCommitted={goConfirmation}
          onOneTimeBought={goConfirmation}
        />
      );
    }
    if (inConfirmation) {
      return (
        <Confirmation
          kind={route.kind}
          basketId={route.basketId}
          level={route.level}
          frequency={route.frequency}
          standingId={route.standingId}
          value={route.value}
          onDone={() => {
            if (route.standingId) {
              goStanding(route.standingId, "discover");
            } else {
              goRoot("portfolio");
            }
          }}
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
      return <Discover onSelectBasket={goBasket} />;
    }
    if (route.name === "portfolio") {
      return (
        <Portfolio
          onSelectStanding={(id) => goStanding(id, "portfolio")}
          onSelectTheme={(id) => goTheme(id, "portfolio")}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-ink">
      <Sidebar
        active={sidebarActive}
        onSelect={(id) => setRoute({ name: id })}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          route={route}
          theme={theme}
          onToggleTheme={toggleTheme}
          nav={nav}
        />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 scroll-stable"
        >
          <div className={`mx-auto ${contentMaxWidth}`}>
            <AnimatePresence mode="wait" onExitComplete={resetScroll}>
              <motion.div
                key={routeKey}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
