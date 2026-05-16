import { useState } from "react";
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

const Portfolio = ({ onSelectStanding }) => {
  const [tab, setTab] = useState("standings");
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
  const topAlert = alerts[0];

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

      {/* Concentration alert — only on Standings tab */}
      {tab === "standings" && topAlert && (
        <ConcentrationAlert
          alert={topAlert}
          onViewInInstruments={() => setTab("instruments")}
        />
      )}

      {/* Tab content */}
      {tab === "standings" && (
        <Standings state={state} onSelectStanding={onSelectStanding} />
      )}
      {tab === "instruments" && <Instruments state={state} />}
      {tab === "themes" && <Themes state={state} />}
    </div>
  );
};

export default Portfolio;
