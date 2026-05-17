// Standard button shapes used across the app. Three concerns:
//   variant — visual treatment + tone (primary action, neutral outline, danger)
//   size    — sm | md | lg
//   icon prefix — children may include an Icon for the leading glyph
//
// Composes a default `inline-flex items-center gap-1.5` row inside a
// rounded button; pass any additional Tailwind classes via `className`.

const VARIANTS = {
  primary: "bg-accent text-white shadow-card hover:bg-accent-hover",
  outline: "border border-hairline bg-elevated text-ink hover:bg-black/[0.08]",
  danger: "border border-hairline bg-elevated text-danger hover:bg-danger-soft",
  ghost: "text-accent hover:bg-accent-soft",
};

const SIZES = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-[13px]",
  lg: "px-5 py-2.5 text-[14px]",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) => (
  <button
    {...rest}
    className={
      "inline-flex items-center justify-center gap-1.5 rounded-[8px] font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 " +
      VARIANTS[variant] +
      " " +
      SIZES[size] +
      " " +
      className
    }
  >
    {children}
  </button>
);

export default Button;
