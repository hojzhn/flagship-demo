import { AnimatePresence, motion } from "framer-motion";
import { findBasket } from "../data/Baskets.js";
import { useStandings } from "../data/StandingsContext.jsx";
import SearchField from "./SearchField";
import ChromeActions from "./ChromeActions";
import Icon from "./Icon";
import Button from "./Button";

// Title text for the top-level (chrome) routes.
const TITLES = {
  discover: "Discover",
  portfolio: "Portfolio",
  activity: "Activity",
  settings: "Settings",
};

// Label for the back button when a detail page hangs under a
// top-level route — drives the chevron-left button on the left slot.
const ROOT_LABEL = {
  discover: "Discover",
  portfolio: "Portfolio",
};

// All knowledge of "what does the topbar look like for route X" lives
// here. App.jsx just passes the route and a navigation object in;
// this function returns the four slots the bar renders:
//
//   left       — either a title (chrome) or a back-chevron button
//   rightCTA   — optional right-side action button (Invest / View
//                details / Create new standing / etc.)
//   showSearch — whether to fade the centred search field in
//
// Each slot is its own animated subtree (LeftSlot / RightCTA / Search
// AnimatePresence) keyed by content, so switching routes can change
// one slot without disturbing the others.
const resolveConfig = (route, state, nav) => {
  const detailRoot = route.from || "discover";

  if (route.name === "standing-detail") {
    const standing = state.standings.find((s) => s.id === route.standingId);
    return {
      left: {
        // A standing's natural home is Portfolio, regardless of which
        // top-level menu the user entered the detail from — both the
        // label and the destination route to Portfolio.
        type: "back",
        label: "Portfolio",
        onClick: () => nav.goRoot("portfolio"),
      },
      rightCTA: standing
        ? {
            key: "view-details",
            label: "View details",
            variant: "outline",
            onClick: () => nav.goBasket(standing.basketId),
          }
        : null,
      showSearch: false,
    };
  }

  if (route.name === "theme-detail") {
    return {
      left: {
        type: "back",
        label: ROOT_LABEL[detailRoot] || "Back",
        // Restore the Portfolio tab the user came from (e.g. they
        // clicked a theme on the Themes tab) so the round trip lands
        // them back where they were.
        onClick: () => nav.goRoot(detailRoot, route.fromTab),
      },
      rightCTA: null,
      showSearch: false,
    };
  }

  if (route.name === "commit") {
    const basket = findBasket(route.basketId);
    return {
      left: {
        type: "back",
        label: basket?.name || "Back",
        onClick: () => nav.goBasket(route.basketId),
      },
      rightCTA: null,
      showSearch: false,
    };
  }

  if (route.name === "confirmation") {
    // Terminal page — no back, no CTA, no search. Just a quiet title
    // so the bar still has a sensible left slot during the transition.
    return {
      left: { type: "title", label: "Confirmed" },
      rightCTA: null,
      showSearch: false,
    };
  }

  if (route.name === "basket-detail") {
    const existing = state.standings.find((s) => s.basketId === route.basketId);
    return {
      left: {
        type: "back",
        label: "Discover",
        onClick: nav.goDiscover,
      },
      rightCTA: existing
        ? {
            key: "view-standing",
            label: "View your standing",
            variant: "outline",
            onClick: () => nav.goStanding(existing.id, "discover"),
          }
        : {
            key: "create-standing",
            label: "Continue",
            variant: "primary",
            onClick: () => nav.goCommit(route.basketId),
          },
      showSearch: false,
    };
  }

  // Top-level view — chrome mode.
  return {
    left: { type: "title", label: TITLES[route.name] || "Untitled" },
    rightCTA: {
      key: "invest",
      label: "Invest",
      variant: "primary",
      icon: "plus",
    },
    showSearch: true,
  };
};

// Title or back-chevron, keyed by content so a label change or a
// type swap (title ↔ back) plays a vertical-roll animation.
const LeftSlot = ({ left }) => (
  <div className="relative h-7 w-[240px] overflow-hidden">
    <AnimatePresence initial={false} mode="popLayout">
      {left.type === "title" ? (
        <motion.div
          key={`title-${left.label}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="flex h-7 items-center text-[15px] font-semibold tracking-tight text-ink"
        >
          {left.label}
        </motion.div>
      ) : (
        <motion.button
          key={`back-${left.label}`}
          onClick={left.onClick}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="-ml-2 inline-flex h-7 items-center gap-0.5 rounded-[6px] px-2 text-[14px] font-medium text-accent hover:bg-accent-soft"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
          {left.label}
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

// Optional right-side CTA. Keyed by identity so swapping between
// different CTAs (Invest ↔ View your standing ↔ Create new standing,
// etc.) plays a fade + slight scale. The hairline divider only
// renders when there is a CTA, and animates in/out with it.
const RightCTA = ({ cta }) => (
  <AnimatePresence initial={false} mode="popLayout">
    {cta && (
      <motion.div
        key={cta.key}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex items-center gap-1.5"
      >
        <div className="mx-1 h-5 w-px bg-hairline" />
        <Button variant={cta.variant} size="sm" onClick={cta.onClick}>
          {cta.icon && <Icon name={cta.icon} className="h-[13px] w-[13px]" />}
          {cta.label}
        </Button>
      </motion.div>
    )}
  </AnimatePresence>
);

const TopBar = ({ route, theme, onToggleTheme, nav }) => {
  const { state } = useStandings();
  const config = resolveConfig(route, state, nav);

  return (
    <header className="hairline-b relative flex h-[52px] items-center gap-3 px-6 backdrop-blur justify-between">
      <LeftSlot left={config.left} />

      <AnimatePresence initial={false}>
        {config.showSearch && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto  left-1/2 top-1/2 hidden w-full max-w-md -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <SearchField placeholder="Search baskets, themes, instruments…" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className=" justify-end flex items-center gap-1.5">
        <ChromeActions theme={theme} onToggleTheme={onToggleTheme} />
        <RightCTA cta={config.rightCTA} />
      </div>

      {/* Centred search — owned by the shell so it can fade in and out
          independently of the left/right slots. Hidden under md. */}
    </header>
  );
};

export default TopBar;
