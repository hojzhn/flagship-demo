import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStandings } from "../../data/StandingsContext.jsx";
import {
  portfolioTotal,
  portfolioGain,
  concentrationAlerts,
} from "../../data/Derive.js";
import { fmtMoneyCents, fmtPct } from "../../data/Format.js";
import SegmentedControl from "../../components/SegmentedControl";
import ConcentrationAlert from "./ConcentrationAlert";
import Standings from "./Standings";
import Instruments from "./Instruments";
import Themes from "./Themes";

const TABS = [
  { value: "standings", label: "Standings" },
  { value: "instruments", label: "Instruments" },
  { value: "themes", label: "Themes" },
];

// 15% threshold flags positions worth surfacing without making the
// banner appear constantly on diversified portfolios.
const CONCENTRATION_THRESHOLD = 0.15;

const Portfolio = ({
  onSelectStanding,
  onSelectTheme,
  initialTab,
  dismissedAlerts,
  onDismissAlert,
}) => {
  // Initial tab can be seeded from the route (when the user returns
  // from a detail page that recorded which tab they left from), so
  // tab selection is preserved across the round trip.
  const [tab, setTab] = useState(initialTab || "standings");
  const { state } = useStandings();

  const total = portfolioTotal(state.standings, state.directHoldings);
  const { gain, gainPct } = portfolioGain(
    state.standings,
    state.directHoldings,
  );
  const alerts = concentrationAlerts(
    state.standings,
    state.directHoldings,
    CONCENTRATION_THRESHOLD,
  );
  // Dismissed alerts live in App so they survive navigation away from
  // Portfolio. Falls back to an empty Set for safety if the prop isn't
  // provided (e.g. older test harnesses).
  const dismissed = dismissedAlerts ?? new Set();
  const topAlert = alerts.find((a) => !dismissed.has(a.ticker)) ?? null;

  // Keep the last-shown alert mounted for the duration of the
  // collapse-out animation so the content doesn't blank as the row
  // collapses. Once the grid finishes collapsing we clear the slot.
  const [displayedAlert, setDisplayedAlert] = useState(topAlert);
  const clearTimerRef = useRef(null);
  useEffect(() => {
    if (topAlert) {
      // Cancel any pending clear and show the new alert immediately.
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
      setDisplayedAlert(topAlert);
      return;
    }
    // No alert — schedule a clear after the CSS transition has played.
    if (displayedAlert) {
      clearTimerRef.current = setTimeout(() => {
        setDisplayedAlert(null);
        clearTimerRef.current = null;
      }, 280);
      return () => {
        if (clearTimerRef.current) {
          clearTimeout(clearTimerRef.current);
          clearTimerRef.current = null;
        }
      };
    }
  }, [topAlert, displayedAlert]);

  const gainPositive = gain >= 0;

  return (
    <div className="space-y-6">
      {/* Header: portfolio total + tabs */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
            Portfolio total
          </div>
          <div className="mt-1 text-[40px] font-bold leading-[1] tracking-tight tnum text-ink">
            {fmtMoneyCents(total)}
          </div>
          <div className="mt-2 text-[14px] tnum">
            <span
              className={gainPositive ? "text-success" : "text-danger"}
            >
              {gainPositive ? "+" : ""}
              {fmtMoneyCents(gain)} ({gainPositive ? "+" : ""}
              {fmtPct(gainPct, 1)})
            </span>
            <span className="text-ink-muted"> since you began</span>
          </div>
        </div>
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </div>

      {/* Tab content. Keyed by the active tab so AnimatePresence
          crossfades + slides between Standings / Instruments / Themes.
          `mode="wait"` lets the outgoing tab fully fade before the new
          one mounts, and `initial={false}` keeps the first paint
          quiet — the App-level route transition already covers that. */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Alert open/close uses the CSS `grid-template-rows` trick
              instead of framer's height: auto. Browsers interpolate
              1fr ↔ 0fr through the grid sizing path, which is far
              smoother than measuring height-auto per frame.
              `displayedAlert` keeps the contents mounted while the
              row collapses so the alert text doesn't blink. */}
          {tab === "standings" && (
            <div
              className="grid transition-[grid-template-rows] duration-[280ms]"
              style={{
                gridTemplateRows: topAlert ? "1fr" : "0fr",
                transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <div className="overflow-hidden">
                <div
                  className={
                    "transition-opacity duration-200 ease-out " +
                    (topAlert ? "opacity-100" : "opacity-0")
                  }
                >
                  {displayedAlert && (
                    <ConcentrationAlert
                      alert={displayedAlert}
                      onViewInInstruments={() => setTab("instruments")}
                      onDismiss={() =>
                        onDismissAlert?.(displayedAlert.ticker)
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {tab === "standings" && (
            <Standings state={state} onSelectStanding={onSelectStanding} />
          )}
          {tab === "instruments" && <Instruments state={state} />}
          {tab === "themes" && (
            <Themes
              state={state}
              onSelectTheme={(id) => onSelectTheme?.(id, tab)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
