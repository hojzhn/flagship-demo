const Card = ({ children, className = "", padded = true }) => (
  <div
    className={
      "rounded-macos border border-hairline bg-elevated shadow-card " +
      (padded ? "p-5 " : "") +
      className
    }
  >
    {children}
  </div>
);

export default Card;
