import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NumberFlow from "@number-flow/react";

const PRESETS = [100, 250, 500, 1000];

const FREQUENCY_SUFFIX = {
  weekly: "/ week",
  monthly: "/ month",
  quarterly: "/ quarter",
  "one-time": " ",
};

const LevelPicker = ({ value, onChange, frequency = "monthly" }) => {
  const suffix = FREQUENCY_SUFFIX[frequency] || "/ month";
  const formatted = value.toLocaleString("en-US");
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // Strip everything but digits so paste / mid-string edits still parse.
  const handleChange = (e) => {
    const digits = (e.target.value.match(/\d/g) || []).join("");
    onChange(digits ? Number(digits) : 0);
  };

  return (
    <div>
      {/* Big editable level display */}
      <div className="rounded-[10px] border border-hairline px-5 py-5">
        <div
          className="flex cursor-text items-baseline gap-2"
          onClick={() => inputRef.current?.focus()}
        >
          <span className="text-[28px] font-medium text-ink-subtle">$</span>
          {/* Auto-sizing wrapper. A hidden mirror span renders the same
              formatted string so the wrapper sizes to the content. Two
              children stack absolutely on top of it:
                - NumberFlow shows the value at rest. When `value` jumps
                  (preset click), it digit-rolls to the new number.
                - the editable input takes over while focused, so the
                  user can type without fighting NumberFlow's animation. */}
          <span className="relative inline-block text-[56px] font-bold leading-[1] tracking-tight tnum">
            <span aria-hidden className="invisible whitespace-pre">
              {formatted || "0"}
            </span>
            <span
              aria-hidden
              className={
                "absolute inset-0 text-ink transition-opacity duration-150 " +
                (focused ? "opacity-0" : "opacity-100")
              }
            >
              <NumberFlow value={value} />
            </span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={formatted}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={
                "absolute inset-0 w-full bg-transparent text-[56px] font-bold leading-[1] tracking-tight tnum text-ink transition-opacity duration-150 focus:outline-none " +
                (focused ? "opacity-100" : "opacity-0")
              }
            />
          </span>
          {/* Suffix roll. Keyed by frequency so AnimatePresence swaps
              the old word out (slides up + fades) while the new word
              slides in from below — same vertical-roll feel as the
              NumberFlow digits next to it. `popLayout` keeps the
              exiting span out of the flex flow so the two don't
              briefly stack side-by-side mid-transition. */}
          <span className="relative inline-block text-[14px] text-ink-subtle">
            <span aria-hidden className="invisible whitespace-pre">
              {suffix}
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={frequency}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 whitespace-pre"
              >
                {suffix}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>

      {/* Quick picks */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {PRESETS.map((p) => {
          const selected = value === p;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={
                "rounded-[8px] py-2 text-[13px] font-medium tnum transition-[background-color,color,transform] duration-150 ease-out hover:scale-[1.05] " +
                (selected
                  ? "bg-accent-soft text-accent"
                  : "border border-hairline text-ink hover:bg-black/[0.04]")
              }
            >
              ${p.toLocaleString("en-US")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPicker;
