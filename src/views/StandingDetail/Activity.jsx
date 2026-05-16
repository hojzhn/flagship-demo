import { fmtRelativeDate } from "../../data/Format.js";

// Activity timeline. Caps at `limit` items by default; when there are
// more, fires `onSeeAll` (the parent swaps the surrounding cards out
// for the AllActivity sub-view).

const Activity = ({ events, limit = 4, onSeeAll }) => {
  const visible = events.slice(0, limit);
  const hasMore = events.length > visible.length;

  return (
    <div>
      <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
        Activity
      </div>
      <ul className="mt-4 divide-y divide-hairline">
        {visible.map((event, i) => (
          <li
            key={i}
            className="grid grid-cols-3 gap-4 py-4 first:pt-0"
          >
            <div className="text-[13px] text-ink-muted">
              {fmtRelativeDate(event.date)}
            </div>
            <div className="col-span-2">
              <div className="text-[14px] font-semibold text-ink">
                {event.title}
              </div>
              <div className="mt-1 text-[13px] leading-[1.5] text-ink-muted">
                {event.body}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && onSeeAll && (
        <button
          onClick={onSeeAll}
          className="hairline-t mt-0 w-full pt-4 text-left text-[13px] font-medium text-accent hover:underline"
        >
          See all activity ({events.length})
        </button>
      )}
    </div>
  );
};

export default Activity;
