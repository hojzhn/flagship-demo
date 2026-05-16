import Icon from "./Icon";
import SearchField from "./SearchField";

const NAV = [
  {
    label: "Invest",
    items: [
      { id: "discover", label: "Discover", icon: "discover" },
      { id: "portfolio", label: "Portfolio", icon: "portfolio" },
      { id: "activity", label: "Activity", icon: "activity" },
    ],
  },
  {
    label: "System",
    items: [{ id: "settings", label: "Settings", icon: "settings" }],
  },
];

const Sidebar = ({ active, onSelect }) => (
  <aside className="vibrancy hairline-r flex w-[244px] flex-col">
    {/* App identity */}
    <div className="flex items-center gap-2 px-4 pt-5 pb-3">
      <div className="grid h-7 w-7 place-items-center rounded-[8px] bg-gradient-to-br from-[rgb(10,132,255)] to-[rgb(0,80,214)] text-white shadow-card">
        <span className="text-[13px] font-semibold tracking-tight">F</span>
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-semibold text-ink">Flagship</div>
        <div className="text-2xs text-ink-subtle">Personal · Pro</div>
      </div>
      <button
        className="ml-auto grid h-6 w-6 place-items-center rounded-md text-ink-subtle hover:bg-sidebarHover hover:text-ink"
        aria-label="Switch workspace"
      >
        <Icon name="chevronDown" className="h-3.5 w-3.5" />
      </button>
    </div>

    {/* Search */}
    <div className="px-3 pb-3">
      <SearchField placeholder="Search" kbdHint="⌘K" />
    </div>

    {/* Nav sections */}
    <nav className="flex-1 overflow-y-auto px-2 pb-3">
      {NAV.map((section) => (
        <div key={section.label} className="mb-3">
          <div className="px-2 pt-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
            {section.label}
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    className={[
                      "group flex w-full items-center gap-2.5 rounded-[7px] px-2 py-1.5 text-[13px] transition-colors",
                      isActive
                        ? "bg-accent text-white shadow-card"
                        : "text-ink hover:bg-sidebarHover",
                    ].join(" ")}
                  >
                    <Icon
                      name={item.icon}
                      className={
                        "h-[15px] w-[15px] " +
                        (isActive
                          ? "text-white"
                          : "text-ink-muted group-hover:text-ink")
                      }
                    />
                    <span className="font-medium">{item.label}</span>
                    {item.badge != null && (
                      <span
                        className={
                          "ml-auto rounded-full px-1.5 py-0.5 text-2xs tnum " +
                          (isActive
                            ? "bg-white/25 text-white"
                            : "bg-black/[0.08] text-ink-muted")
                        }
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>

    {/* User profile */}
    <button className="hairline-t mx-2 mb-2 flex items-center gap-2.5 rounded-[8px] px-2 py-2 text-left hover:bg-sidebarHover">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[rgb(255,159,10)] to-[rgb(255,59,48)] text-[13px] font-semibold text-white">
        GG
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-[13px] font-medium text-ink">
          Gordon G.
        </div>
        <div className="truncate text-2xs text-ink-subtle">
          gordon@flagship.io
        </div>
      </div>
      <Icon name="more" className="h-4 w-4 text-ink-subtle" />
    </button>
  </aside>
);

export default Sidebar;
