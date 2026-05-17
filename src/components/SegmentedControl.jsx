const SegmentedControl = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-[8px] bg-black/[0.05] p-0.5">
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            "rounded-[7px] px-3 py-1 text-[13px] font-medium transition-[background-color,color,transform,box-shadow] duration-150 ease-out hover:scale-[1.02] " +
            (active
              ? "bg-elevated text-ink shadow-card"
              : "text-ink-muted hover:text-ink")
          }
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default SegmentedControl;
