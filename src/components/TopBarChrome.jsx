import Icon from "./Icon";
import SearchField from "./SearchField";

const TITLES = {
  discover: "Discover",
  portfolio: "Portfolio",
  activity: "Activity",
  settings: "Settings",
};

const TopBarChrome = ({ view, theme, onToggleTheme }) => (
  <>
    <div className="w-[200px]">
      <div className="text-2xs font-medium text-ink-subtle">Invest</div>
      <div className="text-[15px] font-semibold tracking-tight text-ink">
        {TITLES[view] || "Untitled"}
      </div>
    </div>

    <div className="mx-6 hidden flex-1 md:flex">
      <SearchField
        placeholder="Search baskets, themes, instruments…"
        className="mx-auto w-full max-w-md"
      />
    </div>

    <div className="ml-auto flex items-center gap-1.5">
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
      <div className="mx-1 h-5 w-px bg-hairline" />
      <button className="inline-flex items-center gap-1.5 rounded-[7px] bg-accent px-2.5 py-1.5 text-[13px] font-medium text-white shadow-card hover:bg-accent-hover">
        <Icon name="plus" className="h-[13px] w-[13px]" />
        Back a basket
      </button>
    </div>
  </>
);

export default TopBarChrome;
