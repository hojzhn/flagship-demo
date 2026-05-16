const PRESETS = [100, 250, 500, 1000];

const LevelPicker = ({ value, onChange }) => (
  <div>
    {/* Big editable level display */}
    <div className="rounded-[10px] border border-hairline px-5 py-5">
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-medium text-ink-subtle">$</span>
        <input
          type="number"
          min="0"
          step="50"
          value={value}
          onChange={(e) =>
            onChange(Math.max(0, Number(e.target.value) || 0))
          }
          className="w-[150px] bg-transparent text-[56px] font-bold leading-[1] tracking-tight text-ink tnum focus:outline-none"
        />
        <span className="text-[14px] text-ink-subtle">/ month</span>
      </div>
    </div>

    {/* Quick picks */}
    <div className="mt-3 grid grid-cols-4 gap-2">
      {PRESETS.map((p) => {
        const selected = value === p;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={
              "rounded-[8px] py-2 text-[13px] font-medium transition-colors tnum " +
              (selected
                ? "bg-accent-soft text-accent"
                : "border border-hairline text-ink hover:bg-black/[0.04]")
            }
          >
            ${p}
          </button>
        );
      })}
    </div>
  </div>
);

export default LevelPicker;
