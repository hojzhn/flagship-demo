import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { useStandings, actions } from "../../data/StandingsContext.jsx";
import { findBasket } from "../../data/Baskets.js";
import { findTheme } from "../../data/Themes.js";
import Card from "../../components/Card";
import HoldingsTable from "../../components/HoldingsTable";
import SegmentedControl from "../../components/SegmentedControl";
import Icon from "../../components/Icon";
import Breadcrumb from "../../components/Breadcrumb";
import LevelPicker from "./LevelPicker";
import Review from "./Review";
import ThesisHeader from "./ThesisHeader.jsx";
import { fmtMoneyCents, fmtPct } from "../../data/Format.js";
import { basketToDirectHoldings } from "../../data/Derive.js";
import Button from "../../components/Button.jsx";

const HOLDINGS_PREVIEW = 5;

// Matches `fmtMoneyCents` — USD with 2 fraction digits, used by
// NumberFlow for the Estimated-total digit-roll.
const MONEY_CENTS_FORMAT = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const FREQUENCIES = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const Commit = ({
  basketId,
  onCancel,
  onChange,
  onCommitted,
  onOneTimeBought,
}) => {
  const basket = findBasket(basketId);
  const { dispatch } = useStandings();
  const [step, setStep] = useState("level"); // "level" → "review"
  const [level, setLevel] = useState(500);
  const [frequency, setFrequency] = useState("monthly");
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  // Choreography. Width and height are deliberately kept off the
  // screen at the same time — height changes during width animations
  // look mushy and the row-reveal stutters when the card is mid-grow.
  // Three gated states drive it:
  //
  //   wideCard       — drives the allocation card's animated width.
  //                    On expand it flips true immediately, so width
  //                    grows first. On collapse it waits ~350ms (the
  //                    row exit duration) so rows fully collapse
  //                    height before the width starts shrinking.
  //   revealRows     — when the extra rows mount inside HoldingsTable.
  //                    On expand it waits 320ms (the width grow) so
  //                    rows only appear once the card is fully wide.
  //                    On collapse it drops immediately so rows start
  //                    their exit.
  //   contribMounted — the contribution card. On expand it drops
  //                    immediately so AnimatePresence plays its
  //                    slide-out. On collapse it waits for rows to
  //                    finish exiting AND the width to shrink (~670ms),
  //                    so by the time it slides back in there's
  //                    actual flex space for it.
  const [wideCard, setWideCard] = useState(false);
  useEffect(() => {
    if (showAllHoldings) {
      setWideCard(true);
      return;
    }
    const t = setTimeout(() => setWideCard(false), 350);
    return () => clearTimeout(t);
  }, [showAllHoldings]);

  const [revealRows, setRevealRows] = useState(false);
  useEffect(() => {
    if (!showAllHoldings) {
      setRevealRows(false);
      return;
    }
    const t = setTimeout(() => setRevealRows(true), 320);
    return () => clearTimeout(t);
  }, [showAllHoldings]);

  const [contribMounted, setContribMounted] = useState(true);
  useEffect(() => {
    if (showAllHoldings) {
      setContribMounted(false);
      return;
    }
    const t = setTimeout(() => setContribMounted(true), 670);
    return () => clearTimeout(t);
  }, [showAllHoldings]);

  // Continue CTA in the expanded state. Fades in LAST on expand
  // (after width + row cascade settles) and FIRST on collapse
  // (drops immediately so the user sees it leave before the rest
  // of the choreography starts).
  const [continueVisible, setContinueVisible] = useState(false);
  useEffect(() => {
    if (!showAllHoldings) {
      setContinueVisible(false);
      return;
    }
    const t = setTimeout(() => setContinueVisible(true), 700);
    return () => clearTimeout(t);
  }, [showAllHoldings]);

  if (!basket) {
    return <div className="text-[14px] text-ink-muted">Basket not found.</div>;
  }

  const primaryTheme = basket.themedAround[0]
    ? findTheme(basket.themedAround[0])
    : null;
  const themeName = primaryTheme?.name || basket.name;

  const handleCommit = () => {
    if (frequency === "one-time") {
      // One-time purchase: shares land in direct holdings, no standing
      // is created. Hand the order details off to the caller so it
      // can route to the confirmation page.
      const newHoldings = basketToDirectHoldings(basket, level);
      dispatch(actions.addDirectHoldings(newHoldings));
      onOneTimeBought?.({ basketId: basket.id, level, frequency });
      return;
    }
    const action = actions.backTheme(basket.id, level);
    dispatch(action);
    onCommitted?.({
      basketId: basket.id,
      level,
      frequency,
      standingId: action.standingId,
    });
  };

  // Breadcrumb persists across every mode of the commit flow.
  const breadcrumb = (
    <Breadcrumb
      items={[
        { label: "Discover", onClick: onChange },
        { label: "Baskets", onClick: onChange },
        { label: basket.name, onClick: onCancel },
      ]}
    />
  );

  const showAllButton = basket.holdings.length > HOLDINGS_PREVIEW;

  return (
    <div className="space-y-8">
      {breadcrumb}
      <ThesisHeader basket={basket} />

      {/* Step swap: level ⇄ review. `mode="wait"` so the outgoing step
          fully fades out before the incoming one fades in, and
          `initial={false}` keeps the first paint quiet (the App-level
          route transition already fades the whole view in).
          `onExitComplete` resets the main scroll container to top so
          the incoming step starts its fade-in at scroll 0 — the App's
          own reset doesn't help here because the route hasn't changed. */}
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() =>
          document
            .querySelector(".scroll-stable")
            ?.scrollTo({ top: 0, left: 0 })
        }
      >
        {step === "review" ? (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Review
              basket={basket}
              level={level}
              frequency={frequency}
              onBack={() => setStep("level")}
              onCommit={handleCommit}
            />
          </motion.div>
        ) : (
          // Contribution + allocation live as flex siblings. The
          // contribution card slides out to the left via AnimatePresence
          // + popLayout (removed from flex flow on the same frame it
          // starts exiting), while the allocation card's *wrapper*
          // animates its explicit `width` from half to full.
          //
          // `justify-end` pins the allocation card to the right edge of
          // the container. When its width grows from 50% → 100%, the
          // right edge stays put and the *left* edge slides leftward,
          // so the card visibly stretches into the space the contribution
          // card just vacated. Animating width as a CSS property (not via
          // framer's `layout` scale transforms) keeps the inner font
          // sizes from distorting during the tween.
          <motion.div
            key="level"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-start justify-end gap-5"
          >
            {/* `initial={false}` so the contribution card doesn't slide
              in on the very first render (it's already at rest). On
              expand it exits to the left; on collapse — after the
              allocation card has finished shrinking — it slides back
              in from the same direction, the mirror of the exit. */}
            <AnimatePresence initial={false} mode="popLayout">
              {contribMounted && (
                <motion.div
                  key="contribution"
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="min-w-0 flex-1"
                >
                  <Card className="flex flex-col p-7">
                    <h2 className="text-[22px] font-semibold leading-[1.25] tracking-tight text-ink">
                      Set your contribution
                    </h2>

                    <div className="mt-4">
                      <SegmentedControl
                        options={FREQUENCIES}
                        value={frequency}
                        onChange={setFrequency}
                      />
                    </div>

                    <div className="mt-4">
                      <LevelPicker
                        value={level}
                        onChange={setLevel}
                        frequency={frequency}
                      />
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="space-y-1.5 text-[13px] mb-8">
                        <div className="flex items-baseline justify-between">
                          <span className="text-ink-muted">
                            Estimated total
                          </span>
                          <span className="font-semibold tnum text-ink">
                            <NumberFlow
                              value={level}
                              format={MONEY_CENTS_FORMAT}
                            />
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-ink-muted">Estimated fees</span>
                          <span>
                            <span className="tnum text-ink">
                              {fmtMoneyCents(0)}
                            </span>
                            <span className="text-ink-muted">
                              {" "}
                              (commission-free)
                            </span>
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-ink-muted">
                            Annual basket fee
                          </span>
                          <span className="tnum text-ink">
                            {fmtPct(basket.expenseRatio, 2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button onClick={onCancel} variant="outline">
                          Back
                        </Button>
                        <Button
                          onClick={() => setStep("review")}
                          className="flex-1"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Allocation card. The wrapper animates its explicit width
              (50% → 100%) over 320ms — same duration as the row-reveal
              gate above — so horizontal expansion completes before any
              new rows mount. Height then grows naturally as each new
              row's own height animation runs inside HoldingsTable. */}
            <motion.div
              initial={false}
              animate={{
                width: wideCard ? "100%" : "calc(50% - 10px)",
              }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="min-w-0 flex-shrink-0"
            >
              <Card padded={false} className="overflow-hidden">
                <div className="hairline-b flex items-center justify-between px-5 py-3">
                  <div className="text-[15px] font-semibold text-ink">
                    Allocations ({basket.holdings.length})
                  </div>
                  {showAllHoldings ? (
                    <button
                      onClick={() => setShowAllHoldings(false)}
                      className="text-[13px] font-medium text-accent hover:underline"
                    >
                      Back
                    </button>
                  ) : (
                    showAllButton && (
                      <button
                        onClick={() => setShowAllHoldings(true)}
                        className="text-[13px] font-medium text-accent hover:underline"
                      >
                        Show all
                      </button>
                    )
                  )}
                </div>
                <HoldingsTable
                  basket={basket}
                  totalValue={level}
                  limit={revealRows ? undefined : HOLDINGS_PREVIEW}
                  stagger={revealRows}
                  staggerFrom={HOLDINGS_PREVIEW}
                  showDiff={revealRows ? true : false}
                />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue CTA — visible only when allocations are expanded,
          and gated separately so it fades in last (after width + row
          cascade settle) and fades out first (drops the instant the
          user clicks Back). */}
      {step !== "review" && (
        <AnimatePresence initial={false}>
          {continueVisible && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex justify-end"
            >
              <button
                onClick={() => setStep("review")}
                className="rounded-[8px] bg-accent px-8 py-2.5 text-[14px] font-semibold text-white shadow-card transition-transform duration-150 hover:scale-[1.04] hover:bg-accent-hover"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Commit;
