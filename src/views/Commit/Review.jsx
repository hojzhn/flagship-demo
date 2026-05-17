import { useState } from "react";
import Card from "../../components/Card";
import { fmtMoney, fmtPct } from "../../data/Format.js";
import Button from "../../components/Button.jsx";

const FREQ = {
  weekly: { label: "Weekly", noun: "week", abbr: "wk", perYear: 52 },
  monthly: { label: "Monthly", noun: "month", abbr: "mo", perYear: 12 },
  quarterly: { label: "Quarterly", noun: "quarter", abbr: "qtr", perYear: 4 },
  "one-time": { label: "One-time", noun: "", abbr: "", perYear: 1 },
};

const Row = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-4 py-3 first:pt-0 last:pb-0">
    <div className="text-[13px] text-ink-muted">{label}</div>
    <div className="col-span-2 text-[14px] text-ink">{children}</div>
  </div>
);

const Review = ({ basket, level, frequency, onBack, onCommit }) => {
  const [confirmed, setConfirmed] = useState(false);
  const freq = FREQ[frequency] || FREQ.monthly;
  const isOneTime = frequency === "one-time";
  const annualized = isOneTime ? level : level * freq.perYear;
  const annualFee = annualized * basket.expenseRatio;

  return (
    <div className="mx-auto space-y-6">
      {/* Standing review card */}
      <Card className="p-6">
        <div>
          <div className="text-[15px] font-semibold text-ink">
            {isOneTime ? "Your purchase" : "Your standing"}
          </div>
          <div className="mt-1 text-[13px] text-ink-muted">
            {isOneTime
              ? "Review your order request."
              : "Review your order request."}
          </div>
        </div>
        <div className="mt-4 divide-y divide-hairline">
          <Row label={isOneTime ? "Amount" : "Level"}>
            {isOneTime ? (
              <span className="tnum">{fmtMoney(level)} one-time</span>
            ) : (
              <span className="tnum">
                {fmtMoney(level)} per {freq.noun}
              </span>
            )}
          </Row>
          <Row label="Cadence">
            {isOneTime
              ? "One-time purchase · settles into direct holdings"
              : `${freq.label} · Rebalanced quarterly`}
          </Row>
          <Row label="Risk profile">
            {basket.riskLabel} ({basket.riskRating}/7) ·{" "}
            {basket.horizonYears.min}–{basket.horizonYears.max}Y horizon
          </Row>
          {!isOneTime && (
            <Row label="Annual fee">
              <span className="tnum">{fmtPct(basket.expenseRatio, 2)}</span>{" "}
              <span className="text-ink-muted">
                (≈ <span className="tnum">{fmtMoney(annualFee)}</span> / yr on{" "}
                <span className="tnum">{fmtMoney(annualized)}</span> annualized)
              </span>
            </Row>
          )}
        </div>
      </Card>

      {/* Disclaimers */}
      <div className="space-y-3 text-[13px] leading-[1.55] text-ink-muted">
        {isOneTime ? (
          <p>
            A one-time purchase converts your amount into direct shares today,
            weighted by the basket's current composition. No subscription, no
            ongoing fee — the resulting holdings sit in your direct holdings and
            you can sell them at any time.
          </p>
        ) : (
          <p>
            You can adjust, pause, or retract this standing at any time from
            your standings view. No exit fees, no holding period. The view
            itself is tracked by the platform whether you back it or not.
          </p>
        )}
        <p>
          The standing carries risk. Estimated volatility 15% – 22% over a year.
          Worst regime: risk-off, when USD strength compounds losses. Past
          performance is not a reliable indicator of future results.
        </p>
      </div>

      {/* Acknowledgement */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
        <span className="text-[13px] leading-[1.45] text-ink">
          I have reviewed the case for and against. The confirmation is under my
          own judgment.
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onCommit} disabled={!confirmed} className="flex-1">
          {isOneTime
            ? `Buy ${fmtMoney(level)}`
            : `Commit ${fmtMoney(level)} / ${freq.abbr}`}
        </Button>
      </div>
    </div>
  );
};

export default Review;
