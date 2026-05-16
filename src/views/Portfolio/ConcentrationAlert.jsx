// Warning banner shown above the Standings tab when a single instrument
// makes up too much of the portfolio. Clicking "View in instruments"
// switches the parent tab.

const wordFor = (n) => {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  return words[n] || String(n);
};

const sourceText = (count) => {
  if (count === 1) return "in one source";
  return `across ${wordFor(count)} sources`;
};

const ConcentrationAlert = ({ alert, onViewInInstruments }) => {
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
      <button
        onClick={onViewInInstruments}
        className="shrink-0 text-[13px] font-medium text-accent hover:underline"
      >
        View in instruments
      </button>
    </div>
  );
};

export default ConcentrationAlert;
