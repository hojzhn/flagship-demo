import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStandings, actions } from "../../data/StandingsContext.jsx";
import { findBasket } from "../../data/Baskets.js";
import { findTheme } from "../../data/Themes.js";
import {
  tenureDays,
  portfolioTotal,
  themesReinforcedByStanding,
  activityForStanding,
  standingGain,
  basketToDirectHoldings,
} from "../../data/Derive.js";
import { fmtMoney, fmtPct, fmtDays } from "../../data/Format.js";
import Card from "../../components/Card";
import Pill from "../../components/Pill";
import Button from "../../components/Button";
import Breadcrumb from "../../components/Breadcrumb";
import SectionHeader from "../../components/SectionHeader";
import HoldingsTable from "../../components/HoldingsTable";
import Activity from "./Activity";
import ThemesReinforced from "./ThemesReinforced";

const ACTIVITY_PREVIEW = 4;

// Label for the top-level menu the user entered from. Drives the
// breadcrumb's first crumb so the path reflects the actual entry point.
const ROOT_LABEL = {
  discover: "Discover",
  portfolio: "Portfolio",
};

const StandingDetail = ({ standingId, from = "discover", onLeave }) => {
  const { state, dispatch } = useStandings();
  const standing = state.standings.find((s) => s.id === standingId);

  // Inline expand for the Activity card — mirrors Commit's Show-all
  // choreography. Three gated states keep width and height from
  // animating at the same time:
  //
  //   wideCard       — the card's animated width. On expand flips
  //                    true immediately so width grows first; on
  //                    collapse waits ~350ms (the row exit duration)
  //                    so rows finish folding before width shrinks.
  //   revealItems    — when extra events mount. On expand waits
  //                    320ms (width grow); on collapse drops
  //                    immediately so items start their exit.
  //   themesMounted  — the ThemesReinforced card. On expand drops
  //                    immediately so AnimatePresence plays its
  //                    slide-out; on collapse waits ~670ms (rows
  //                    exit + width shrink) so it slides back into
  //                    actual flex space, not a 100%-wide neighbour.
  const [activityExpanded, setActivityExpanded] = useState(false);

  const [wideCard, setWideCard] = useState(false);
  useEffect(() => {
    if (activityExpanded) {
      setWideCard(true);
      return;
    }
    const t = setTimeout(() => setWideCard(false), 350);
    return () => clearTimeout(t);
  }, [activityExpanded]);

  const [revealItems, setRevealItems] = useState(false);
  useEffect(() => {
    if (!activityExpanded) {
      setRevealItems(false);
      return;
    }
    const t = setTimeout(() => setRevealItems(true), 320);
    return () => clearTimeout(t);
  }, [activityExpanded]);

  const [themesMounted, setThemesMounted] = useState(true);
  useEffect(() => {
    if (activityExpanded) {
      setThemesMounted(false);
      return;
    }
    const t = setTimeout(() => setThemesMounted(true), 670);
    return () => clearTimeout(t);
  }, [activityExpanded]);

  if (!standing) {
    return (
      <div className="text-[14px] text-ink-muted">Standing not found.</div>
    );
  }

  const basket = findBasket(standing.basketId);
  const primaryTheme = basket?.themedAround[0]
    ? findTheme(basket.themedAround[0])
    : null;
  const headerName = basket?.name || standing.basketId;

  const days = tenureDays(standing);
  const total = portfolioTotal(state.standings, state.directHoldings);
  const portfolioPct = total > 0 ? standing.currentValue / total : 0;
  const { gainPct, contributed: totalContributed } = standingGain(standing);

  const themes = themesReinforcedByStanding(
    standing,
    state.standings,
    state.directHoldings,
  );
  const activity = activityForStanding(standing);
  const paused = standing.status === "paused";

  const handlePause = () => {
    dispatch(paused ? actions.resume(standing.id) : actions.pause(standing.id));
  };

  // Retracting a standing doesn't liquidate the position — the user already
  // owns those shares. Convert the basket's current value into direct
  // holdings and hand them off to the reducer alongside the retract.
  const handleRetract = () => {
    const newHoldings = basket
      ? basketToDirectHoldings(basket, standing.currentValue)
      : [];
    dispatch(actions.retract(standing.id, newHoldings));
    onLeave?.();
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: ROOT_LABEL[from] || "Back", onClick: onLeave },
          { label: headerName },
        ]}
      />

      {/* Header — always visible */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-row gap-2">
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-tight text-ink">
              {headerName}
            </h1>
          </div>
          <div className="mt-2 text-[13px] text-ink-muted">
            <div className="flex flex-row gap-2">
              <div>Managed by {basket?.curator || "—"}</div>
              <div>·</div>
              <span className="tnum">{fmtMoney(standing.level)}</span> / month
              <div>·</div>
              {paused ? (
                <div className="inline text-[var(--warning)] text-[13px] flex flex-row gap-2 items-center">
                  Paused
                </div>
              ) : (
                <div className="text-[var(--accent)] text-[13px] flex flex-row gap-2 items-center">
                  Held for {fmtDays(days)}
                </div>
              )}{" "}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="md">
              Adjust
            </Button>
            <Button variant="outline" size="md" onClick={handlePause}>
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button variant="danger" size="md" onClick={handleRetract}>
              Retract
            </Button>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[40px] font-bold leading-[1] tracking-tight tnum text-ink">
            {fmtMoney(standing.currentValue)}
          </div>
          <div className="mt-2 text-[13px] text-ink-muted tnum">
            <div> {fmtPct(portfolioPct, 0)} of portfolio</div>
            <div>
              {totalContributed > 0 && (
                <>
                  <span
                    className={gainPct >= 0 ? "text-success" : "text-danger"}
                  >
                    {gainPct >= 0 ? "+" : ""}
                    {fmtPct(gainPct, 1)}
                  </span>{" "}
                  since you began
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider — content below */}
      <div className="hairline-t pt-6">
        <div className="space-y-6">
          {/* Activity (expandable) + ThemesReinforced. Same mechanic
              as Commit's Allocation Show-all: Activity is on the left
              with its width animated 50% → 100%; ThemesReinforced
              (right) exits to the right via AnimatePresence + popLayout
              when the activity card claims its space. */}
          <div className="flex items-start gap-5">
            <motion.div
              initial={false}
              animate={{
                width: wideCard ? "100%" : "calc(50% - 10px)",
              }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="min-w-0 flex-shrink-0"
            >
              <Card>
                <Activity
                  events={activity}
                  limit={revealItems ? undefined : ACTIVITY_PREVIEW}
                  stagger={revealItems}
                  staggerFrom={ACTIVITY_PREVIEW}
                  expanded={activityExpanded}
                  onToggle={() => setActivityExpanded((v) => !v)}
                />
              </Card>
            </motion.div>

            <AnimatePresence initial={false} mode="popLayout">
              {themesMounted && (
                <motion.div
                  key="themes"
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 80, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="min-w-0 flex-1"
                >
                  <Card>
                    <ThemesReinforced themes={themes} />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Holdings — tied to `themesMounted` (not `activityExpanded`)
              so on collapse it fades in together with the Themes card
              once everything else has settled (t≈670ms), and on expand
              it fades out immediately alongside the themes exit. */}
          <AnimatePresence initial={false}>
            {basket && themesMounted && (
              <motion.section
                key="holdings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <SectionHeader
                  title="Holdings under this standing"
                  meta={`${basket.holdings.length} instruments`}
                  description="What this standing's current value translates to across each instrument."
                />
                <Card padded={false} className="mt-4">
                  <HoldingsTable
                    basket={basket}
                    totalValue={standing.currentValue}
                  />
                </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StandingDetail;
