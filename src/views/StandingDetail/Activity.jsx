import { AnimatePresence, motion } from "framer-motion";
import Icon from "../../components/Icon";
import { fmtRelativeDate } from "../../data/Format.js";

// Activity timeline.
//
// Two prop pairs control behaviour, mirroring HoldingsTable:
//   limit / stagger / staggerFrom  → which rows render and which of
//                                    them cascade in. Parent gates
//                                    `stagger` via a timer so rows
//                                    only animate after the card has
//                                    finished widening.
//   expanded / onToggle            → the "See all / Back" button in
//                                    the top right. `expanded` flips
//                                    immediately on click so the
//                                    button label swaps right away
//                                    even though the row reveal is
//                                    gated.

const PREVIEW = 4;

const Activity = ({
  events,
  limit,
  stagger = false,
  staggerFrom = PREVIEW,
  expanded = false,
  onToggle,
}) => {
  const visible =
    typeof limit === "number" && limit > 0 ? events.slice(0, limit) : events;
  const hasMore = events.length > PREVIEW;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
          Activity
        </div>
        {hasMore &&
          onToggle &&
          (expanded ? (
            <button
              onClick={onToggle}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              See all activity
            </button>
          ))}
      </div>

      <ul className="mt-4 divide-y divide-hairline">
        <AnimatePresence initial={false}>
          {visible.map((event, i) => {
            const shouldStagger = stagger && i >= staggerFrom;

            const contentRow = (
              <>
                <div className="text-[13px] text-ink-muted">
                  {fmtRelativeDate(event.date)}
                </div>
                <div className="col-span-2">
                  <div className="line-clamp-1 min-h-[1lh] text-[14px] font-semibold leading-[1.4] text-ink">
                    {event.title}
                  </div>
                  {/* `line-clamp-2 min-h-[2lh]` pins the body to exactly
                      two line-heights tall regardless of column width.
                      Without this the body wraps to 2 lines in the
                      narrow (preview) column and 1 line at full width,
                      so the card height changes mid-width-animation.
                      Pinning it makes natural height width-stable. */}
                  <div className="mt-1 line-clamp-2 min-h-[2lh] text-[13px] leading-[1.5] text-ink-muted">
                    {event.body}
                  </div>
                </div>
              </>
            );

            if (!shouldStagger) {
              return (
                <li key={i} className="grid grid-cols-3 gap-4 py-4 first:pt-0">
                  {contentRow}
                </li>
              );
            }

            // Two-phase reveal — matches HoldingsTable's expand: height
            // tweens 0 → auto first (all new items grow together, the
            // card reads as expanding vertically), then opacity fades
            // in with a per-row stagger after the height animation
            // settles. Exit is the reverse: opacity drops first, then
            // height collapses.
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.15, ease: "easeOut" },
                    height: { duration: 0.25, ease: "easeOut", delay: 0.1 },
                  },
                }}
                style={{ overflow: "hidden" }}
                transition={{
                  height: { duration: 0.3, ease: "easeOut" },
                  opacity: {
                    duration: 0.2,
                    ease: "easeOut",
                    delay: 0.3 + (i - staggerFrom) * 0.035,
                  },
                }}
              >
                <div className="grid grid-cols-3 gap-4 py-4">{contentRow}</div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Activity;
