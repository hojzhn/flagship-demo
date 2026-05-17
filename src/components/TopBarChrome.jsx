import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import ChromeActions from "./ChromeActions";

const TITLES = {
  discover: "Discover",
  portfolio: "Portfolio",
  activity: "Activity",
  settings: "Settings",
};

// Note: the centred search bar lives in TopBar (the shell), not here.
// It needs to persist across chrome ⇄ detail swaps so it can fade in
// and out on its own without re-mounting with the rest of the chrome.
const TopBarChrome = ({ view, theme, onToggleTheme }) => (
  <>
    {/* Left column. AnimatePresence rolls the title up + out on view
        change and rolls the new one in from below — same vertical-roll
        feel used for digits and the LevelPicker suffix. `overflow-hidden`
        on the slot keeps the in/out motion clipped to the row. */}
    <div className="relative h-5 w-[200px] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="text-[15px] font-semibold leading-5 tracking-tight text-ink"
        >
          {TITLES[view] || "Untitled"}
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="ml-auto flex items-center gap-1.5">
      <ChromeActions theme={theme} onToggleTheme={onToggleTheme} />
      <div className="mx-1 h-5 w-px bg-hairline" />
      <button className="inline-flex items-center gap-1.5 rounded-[7px] bg-accent px-2.5 py-1.5 text-[13px] font-medium text-white shadow-card transition-transform duration-150 hover:scale-[1.05] hover:bg-accent-hover">
        <Icon name="plus" className="h-[13px] w-[13px]" />
        Invest
      </button>
    </div>
  </>
);

export default TopBarChrome;
