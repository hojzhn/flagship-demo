const TONES = {
  neutral: "bg-black/[0.06] text-ink-muted",
  info: "bg-accent-soft text-accent",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  outline: "border border-hairline bg-elevated text-ink",
};

const SIZES = {
  sm: "px-2 py-1 text-2xs leading-none",
  md: "px-2.5 py-1.5 text-[12px] leading-none",
};

const Pill = ({
  tone = "neutral",
  size = "sm",
  className = "",
  children,
}) => (
  <span
    className={
      "inline-flex items-center gap-1 rounded-full font-medium tnum " +
      TONES[tone] +
      " " +
      SIZES[size] +
      " " +
      className
    }
  >
    {children}
  </span>
);

export default Pill;
