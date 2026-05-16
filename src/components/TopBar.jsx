import TopBarChrome from "./TopBarChrome";

// Shell + default content fallback.
// - Pass `children` to take full control of the top bar contents
//   (used by detail pages like BasketDetail).
// - Pass `view` / `theme` / `onToggleTheme` to render the default
//   chrome (breadcrumb, search, theme toggle, notifications, primary
//   CTA) used by all top-level views.

const TopBar = ({ children, view, theme, onToggleTheme }) => (
  <header className="hairline-b flex h-[52px] items-center gap-3 px-6 backdrop-blur">
    {children ?? (
      <TopBarChrome
        view={view}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    )}
  </header>
);

export default TopBar;
