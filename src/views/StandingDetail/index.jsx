import { useState } from "react";
import { useStandings, actions } from "../../data/StandingsContext.jsx";
import { findBasket } from "../../data/Baskets.js";
import { findTheme } from "../../data/Themes.js";
import {
  tenureDays,
  portfolioTotal,
  themesReinforcedByStanding,
  activityForStanding,
  standingGain,
} from "../../data/Derive.js";
import { fmtMoney, fmtPct, fmtDays } from "../../data/Format.js";
import Card from "../../components/Card";
import Pill from "../../components/Pill";
import Button from "../../components/Button";
import SectionHeader from "../../components/SectionHeader";
import Activity from "./Activity";
import ThemesReinforced from "./ThemesReinforced";
import AllActivity from "./AllActivity";
import StandingHoldings from "./StandingHoldings";

const StandingDetail = ({ standingId, onLeave }) => {
  const { state, dispatch } = useStandings();
  const standing = state.standings.find((s) => s.id === standingId);

  // Local view mode. "summary" is the default two-card + holdings view;
  // "activity" swaps the two cards for the AllActivity full list.
  const [mode, setMode] = useState("summary");

  if (!standing) {
    return (
      <div className="text-[14px] text-ink-muted">Standing not found.</div>
    );
  }

  const basket = findBasket(standing.basketId);
  const primaryTheme = basket?.themedAround[0]
    ? findTheme(basket.themedAround[0])
    : null;
  const headerName = primaryTheme?.name || basket?.name || standing.basketId;

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
    dispatch(
      paused ? actions.resume(standing.id) : actions.pause(standing.id),
    );
  };

  const handleRetract = () => {
    dispatch(actions.retract(standing.id));
    onLeave?.();
  };

  return (
    <div className="space-y-6">
      {/* Header — always visible */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-tight text-ink">
            {headerName}
          </h1>
          <div className="mt-3">
            {paused ? (
              <Pill tone="warning" size="md">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                Paused
              </Pill>
            ) : (
              <Pill tone="info" size="md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Backed for {fmtDays(days)}
              </Pill>
            )}
          </div>
          <div className="mt-3 text-[13px] text-ink-muted">
            Managed by {basket?.curator || "—"} ·{" "}
            <span className="tnum">{fmtMoney(standing.level)}</span> / month ·{" "}
            {basket?.holdings.length ?? 0} holdings
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
            {fmtPct(portfolioPct, 0)} of portfolio
            {totalContributed > 0 && (
              <>
                {" · "}
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

      {/* Divider — content below swaps based on `mode` */}
      <div className="hairline-t pt-6">
        {mode === "activity" ? (
          <AllActivity
            events={activity}
            onBack={() => setMode("summary")}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <Card>
                <Activity
                  events={activity}
                  onSeeAll={() => setMode("activity")}
                />
              </Card>
              <Card>
                <ThemesReinforced themes={themes} />
              </Card>
            </div>

            {/* Holdings */}
            {basket && (
              <section>
                <SectionHeader
                  title="What this standing holds"
                  meta={`${basket.holdings.length} instruments`}
                  description="Shares from this standing alongside your total position in each instrument across the portfolio."
                />
                <Card padded={false} className="mt-4">
                  <StandingHoldings standing={standing} state={state} />
                </Card>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandingDetail;
