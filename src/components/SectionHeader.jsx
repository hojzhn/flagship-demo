// Section-level header used inside a page (h2). Differs from <Page>
// which renders the page-level h1. Two-line pattern: title left, meta
// right, optional description below.

const SectionHeader = ({ title, meta, description }) => (
  <header>
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[24px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {meta && <div className="text-2xs text-ink-muted">{meta}</div>}
    </div>
    {description && (
      <p className="mt-2 max-w-2xl text-[13px] leading-[1.5] text-ink-muted">
        {description}
      </p>
    )}
  </header>
);

export default SectionHeader;
