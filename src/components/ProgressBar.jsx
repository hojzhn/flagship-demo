const ProgressBar = ({
  value,
  total,
  color = "bg-accent",
  className = "",
}) => {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div
      className={
        "h-1.5 w-full overflow-hidden rounded-full bg-black/[0.08] " + className
      }
    >
      <div className={"h-full " + color} style={{ width: `${pct}%` }} />
    </div>
  );
};

export default ProgressBar;
