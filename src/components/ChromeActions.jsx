import Icon from "./Icon";

// Global top-bar utilities: theme toggle + notifications. Used in every
// top-bar variant so these stay reachable from any page.

const ChromeActions = ({ theme, onToggleTheme }) => (
  <>
    <button
      onClick={onToggleTheme}
      className="grid h-8 w-8 place-items-center rounded-[7px] text-ink-muted hover:bg-black/[0.06] hover:text-ink"
      aria-label="Toggle theme"
    >
      <Icon
        name={theme === "dark" ? "sun" : "moon"}
        className="h-[15px] w-[15px]"
      />
    </button>
    <button
      className="relative grid h-8 w-8 place-items-center rounded-[7px] text-ink-muted hover:bg-black/[0.06] hover:text-ink"
      aria-label="Notifications"
    >
      <Icon name="bell" className="h-[15px] w-[15px]" />
      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
    </button>
  </>
);

export default ChromeActions;
