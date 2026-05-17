import { motion } from "framer-motion";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import { findBasket } from "../../data/Baskets.js";
import { fmtMoney, fmtPct } from "../../data/Format.js";

// Three confirmation modes, switched by `kind`:
//   "purchase" — one-time buy. Shares settled into direct holdings.
//   "standing" — recurring standing was created.
//   "retract"  — recurring standing was retracted; the basket has
//                been disbanded and its holdings moved into direct
//                holdings (the user keeps everything they bought).
//
// Animation: the success badge scale-springs in, then the title, the
// summary card, and the CTA fade up in sequence so the page reads as
// a deliberate landing rather than a snap.

const FREQ = {
  weekly: { label: "Weekly", noun: "week", perYear: 52 },
  monthly: { label: "Monthly", noun: "month", perYear: 12 },
  quarterly: { label: "Quarterly", noun: "quarter", perYear: 4 },
};

const Row = ({ label, children }) => (
  <div className="flex items-baseline justify-between py-3 first:pt-0 last:pb-0">
    <span className="text-[13px] text-ink-muted">{label}</span>
    <span className="text-right text-[14px] text-ink">{children}</span>
  </div>
);

const Confirmation = ({
  kind: kindProp,
  basketId,
  level,
  frequency,
  standingId,
  value,
  onDone,
}) => {
  const basket = findBasket(basketId);
  if (!basket) {
    return <div className="text-[14px] text-ink-muted">Order not found.</div>;
  }

  // Back-compat: callers that don't pass `kind` get the old inference.
  const kind = kindProp ?? (frequency === "one-time" ? "purchase" : "standing");
  const isPurchase = kind === "purchase";
  const isStanding = kind === "standing";
  const isRetract = kind === "retract";

  const freq = FREQ[frequency];
  const annualized = isStanding ? level * (freq?.perYear ?? 12) : 0;
  const annualFee = annualized * basket.expenseRatio;

  const title = isRetract
    ? "Standing retracted"
    : isPurchase
      ? "Purchase complete"
      : "Standing created";

  const body = isRetract
    ? `${basket.name} has been disbanded. The ${fmtMoney(value)} you held through it has moved into your direct holdings. You keep every share you bought.`
    : isPurchase
      ? `Your shares of ${basket.name} are now in your direct holdings.`
      : `You are supporting ${basket.name} at ${fmtMoney(level)} per ${freq?.noun ?? "month"}. You can adjust or retract this standing at any time.`;

  const ctaLabel = standingId ? "View your standing" : "View portfolio";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center space-y-6 py-12 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.45 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-success text-white shadow-card"
      >
        <Icon name="check" className="h-10 w-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight text-ink">
          {title}
        </h1>
        <p className="text-[14px] leading-[1.5] text-ink-muted">{body}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
        className="w-full text-left"
      >
        <Card className="p-5">
          <div className="divide-y divide-hairline">
            <Row label="Basket">{basket.name}</Row>

            {isRetract ? (
              <Row label="Moved">
                <span className="tnum">{fmtMoney(value)}</span>{" "}
                <span className="text-ink-muted">
                  ({basket.holdings.length} instrument
                  {basket.holdings.length === 1 ? "" : "s"})
                </span>
              </Row>
            ) : (
              <Row label={isPurchase ? "Amount" : "Level"}>
                {isPurchase ? (
                  <span className="tnum">{fmtMoney(level)} one-time</span>
                ) : (
                  <span className="tnum">
                    {fmtMoney(level)} per {freq?.noun ?? "month"}
                  </span>
                )}
              </Row>
            )}

            <Row label="Settled into">
              {isStanding ? "New standing" : "Direct holdings"}
            </Row>

            {isStanding && (
              <Row label="Annual fee">
                <span className="tnum">{fmtPct(basket.expenseRatio, 2)}</span>{" "}
                <span className="text-ink-muted">
                  (≈ <span className="tnum">{fmtMoney(annualFee)}</span> on{" "}
                  <span className="tnum">{fmtMoney(annualized)}</span>{" "}
                  annualized)
                </span>
              </Row>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.25, ease: "easeOut" }}
        onClick={onDone}
        className="rounded-[8px] bg-accent px-6 py-2.5 text-[14px] font-semibold text-white shadow-card transition-transform duration-150 hover:scale-[1.04] hover:bg-accent-hover"
      >
        {ctaLabel}
      </motion.button>
    </div>
  );
};

export default Confirmation;
