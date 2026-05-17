import Icon from "../../components/Icon";

// Warning banner shown above the Standings tab when a single instrument
// makes up too much of the portfolio. Clicking "View in instruments"
// switches the parent tab. `onDismiss` hides the alert; the parent
// tracks dismissals so it doesn't re-appear within a session.

const wordFor = (n) => {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  return words[n] || String(n);
};

const sourceText = (count) => {
  if (count === 1) return "in one source";
  return `across ${wordFor(count)} sources`;
};

const ConcentrationAlert = ({ alert, onViewInInstruments, onDismiss }) => {
  const pct = Math.round(alert.sharePct * 100);
  return (
    <div className="flex items-start justify-between gap-4 rounded-macos bg-warning-soft px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
        <p className="text-[14px] leading-[1.5] text-ink">
          <span className="font-semibold">{alert.ticker}</span> is {pct}% of
          your portfolio {sourceText(alert.sourceCount)}. Concentrated in one
          instrument.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onViewInInstruments}
          className="text-[13px] font-medium text-accent hover:underline"
        >
          View in instruments
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="grid h-6 w-6 place-items-center rounded-md text-ink-muted transition-colors hover:bg-black/[0.06] hover:text-ink"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConcentrationAlert;
