import Icon from "./Icon";

const SearchField = ({ placeholder = "Search", kbdHint, className = "" }) => (
  <div
    className={
      "flex items-center gap-2 rounded-[8px] bg-black/5 px-2.5 py-1.5 text-ink-muted " +
      className
    }
  >
    <Icon name="search" className="h-[14px] w-[14px]" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-subtle focus:outline-none"
    />
    {kbdHint && (
      <kbd className="rounded bg-black/5 px-1 text-2xs text-ink-subtle">
        {kbdHint}
      </kbd>
    )}
  </div>
);

export default SearchField;
