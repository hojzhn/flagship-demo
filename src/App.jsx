import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import SmallScreenBlocker from "./components/SmallScreenBlocker";
import Discover from "./views/Discover";
import BasketDetail from "./views/BasketDetail";
import Commit from "./views/Commit";
import StandingDetail from "./views/StandingDetail";
import ThemeDetail from "./views/ThemeDetail";
import Portfolio from "./views/Portfolio";
import Confirmation from "./views/Confirmation";

// Initial theme follows the OS / browser preference. Run synchronously
// so the very first paint already has `.dark` applied if the user is
// in dark mode.
const initialTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

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
  const [theme, setTheme] = useState(initialTheme);

  // Dismissed concentration alerts (by ticker). Lives at the App
  // level so the dismissal survives navigating away from Portfolio
  // and back — Portfolio itself unmounts on every route change.
  const [dismissedAlerts, setDismissedAlerts] = useState(() => new Set());
  const dismissAlert = (ticker) =>
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.add(ticker);
      return next;
    });

  // Sync the .dark class to the current theme. Runs on mount (so the
  // initial OS preference is reflected) and on every toggle.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow OS theme changes while the user hasn't explicitly toggled
  // in this session. Once they click the toggle, `userOverride.current`
  // stays true and we stop tracking the OS preference.
  const userOverride = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (userOverride.current) return;
      setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const toggleTheme = () => {
    userOverride.current = true;
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const inBasketDetail = route.name === "basket-detail";
  const inCommit = route.name === "commit";
  const inStandingDetail = route.name === "standing-detail";
  const inThemeDetail = route.name === "theme-detail";
  const inConfirmation = route.name === "confirmation";

  // Which top-level menu a detail route reports as its "home".
  //   - Basket / Commit          → Discover (browsing flow).
  //   - Confirmation             → depends on what was just done:
  //                                  retract starts on Portfolio
  //                                  (the standing lived there), so
  //                                  it stays under Portfolio.
  //                                  purchase / standing creation
  //                                  came out of Discover.
  //   - StandingDetail           → Portfolio (a standing's natural
  //                                home, regardless of entry path).
  //   - ThemeDetail              → entry point (themes show up in
  //                                both Discover and Portfolio).
  const detailRoot = route.from || "discover";
  const sidebarRoot = (() => {
    switch (route.name) {
      case "basket-detail":
      case "commit":
        return "discover";
      case "confirmation":
        return route.kind === "retract" ? "portfolio" : "discover";
      case "standing-detail":
        return "portfolio";
      case "theme-detail":
        return detailRoot;
      default:
        return route.name;
    }
  })();
  const sidebarActive = sidebarRoot;

  // `tab` is optional on goRoot so callers returning from a detail
  // page can ask the top-level view (currently only Portfolio) to
  // open at a specific tab.
  const goRoot = (name, tab) =>
    setRoute(tab ? { name, tab } : { name });
  const goDiscover = () => goRoot("discover");
  const goBasket = (basketId) => setRoute({ name: "basket-detail", basketId });
  const goCommit = (basketId) => setRoute({ name: "commit", basketId });
  const goStanding = (standingId, from = "discover") =>
    setRoute({ name: "standing-detail", standingId, from });
  // `fromTab` records which Portfolio tab the user opened the theme
  // from. The back button in ThemeDetail's topbar passes it back to
  // goRoot so the Portfolio tab is preserved across the round trip.
  const goTheme = (themeId, from = "discover", fromTab) =>
    setRoute({ name: "theme-detail", themeId, from, fromTab });
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
          onBack={() => goRoot(detailRoot, route.fromTab)}
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
          initialTab={route.tab}
          dismissedAlerts={dismissedAlerts}
          onDismissAlert={dismissAlert}
          onSelectStanding={(id) => goStanding(id, "portfolio")}
          onSelectTheme={(id, fromTab) => goTheme(id, "portfolio", fromTab)}
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
      <SmallScreenBlocker />
    </div>
  );
};

export default App;
