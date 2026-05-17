// Thesis headline + basket meta line. Used to introduce a basket
// inside the commit flow — the headline frames what the user is
// committing to, and the meta line gives the operational context
// (holdings count + curator) in one glance.

const ThesisHeader = ({ basket }) => (
  <div>
    <p className="text-[22px] font-semibold leading-[1.3] tracking-tight text-ink">
      {basket.thesis.headline}
    </p>
    <div className="mt-2 text-[13px] text-ink-muted">
      {basket.holdings.length} holdings · managed by {basket.curator}
    </div>
  </div>
);

export default ThesisHeader;
