import { useState } from "react";
import { useStandings, actions } from "../../data/StandingsContext.jsx";
import { findBasket } from "../../data/Baskets.js";
import { findTheme } from "../../data/Themes.js";
import Card from "../../components/Card";
import SectionHeader from "../../components/SectionHeader";
import HoldingsTable from "../../components/HoldingsTable";
import LevelPicker from "./LevelPicker";
import CommitSummary from "./CommitSummary";

const Commit = ({ basketId, onCancel, onChange, onCommitted }) => {
  const basket = findBasket(basketId);
  const { state, dispatch } = useStandings();
  const [level, setLevel] = useState(500);

  if (!basket) {
    return <div className="text-[14px] text-ink-muted">Basket not found.</div>;
  }

  // Display the primary theme name in the header. Falls back to basket
  // name when the basket isn't themed around anything.
  const primaryTheme = basket.themedAround[0]
    ? findTheme(basket.themedAround[0])
    : null;
  const themeName = primaryTheme?.name || basket.name;

  const handleCommit = () => {
    const action = actions.backTheme(basket.id, level);
    dispatch(action);
    // Pass the new standing's id up so App can land on its detail page.
    onCommitted?.(action.standingId);
  };

  return (
    <div className="space-y-8">
      {/* Two-column commit panel */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left: theme + level picker + actions */}
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[15px] font-semibold text-ink">
                {themeName}
              </span>
            </div>
            <button
              onClick={onChange}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              Change
            </button>
          </div>

          <div className="hairline-t mt-5 pt-5">
            <h2 className="text-[22px] font-semibold leading-[1.25] tracking-tight text-ink">
              At what level do you want to back this theme?
            </h2>
          </div>

          <div className="mt-5">
            <LevelPicker value={level} onChange={setLevel} />
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={onCancel}
              className="rounded-[8px] border border-hairline px-5 py-2.5 text-[14px] font-medium text-ink hover:bg-black/[0.04]"
            >
              Back
            </button>
            <button
              onClick={handleCommit}
              className="flex-1 rounded-[8px] bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-card hover:bg-accent-hover"
            >
              Back this theme
            </button>
          </div>
        </Card>

        {/* Right: commit summary */}
        <CommitSummary basket={basket} level={level} state={state} />
      </div>

      {/* Holdings */}
      <section>
        <SectionHeader
          title="Holdings"
          meta={`${basket.holdings.length} instruments · rebalanced quarterly`}
          description="You can adjust allocation anytime."
        />
        <Card padded={false} className="mt-4">
          <HoldingsTable holdings={basket.holdings} />
        </Card>
      </section>
    </div>
  );
};

export default Commit;
