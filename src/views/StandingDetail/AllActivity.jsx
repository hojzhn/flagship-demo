import Card from "../../components/Card";
import Icon from "../../components/Icon";
import { fmtRelativeDate } from "../../data/Format.js";

// Full activity timeline. Rendered in place of the two summary cards
// when the user clicks "See all activity". Has its own back link that
// returns to the standing's overview.

const AllActivity = ({ events, onBack }) => (
  <div className="space-y-4">
    <button
      onClick={onBack}
      className="-ml-2 inline-flex items-center gap-0.5 rounded-[6px] px-2 py-1 text-[13px] font-medium text-accent hover:bg-accent-soft"
    >
      <Icon name="chevronLeft" className="h-3.5 w-3.5" />
      Back to overview
    </button>

    <Card>
      <div className="flex items-baseline justify-between">
        <div className="text-2xs font-semibold uppercase tracking-wider text-ink-subtle">
          All activity
        </div>
        <div className="text-2xs text-ink-muted tnum">
          {events.length} event{events.length === 1 ? "" : "s"}
        </div>
      </div>
      <ul className="mt-4 divide-y divide-hairline">
        {events.map((event, i) => (
          <li
            key={i}
            className="grid grid-cols-3 gap-4 py-4 first:pt-0 last:pb-0"
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
    </Card>
  </div>
);

export default AllActivity;
