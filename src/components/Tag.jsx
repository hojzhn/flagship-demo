// Small square label for metadata (curator, basket short name, etc.).
// Differs from Pill in shape (square corners) and intent (always
// categorical / non-interactive metadata). Keep contents short — a
// curator name or a basket name, not full sentences.

const Tag = ({ children, className = "" }) => (
  <span
    className={
      "inline-flex items-center rounded-sm border border-hairline bg-elevated px-1.5 py-0.5 text-2xs font-medium leading-none text-ink " +
      className
    }
  >
    {children}
  </span>
);

export default Tag;
