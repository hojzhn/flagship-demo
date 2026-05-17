const Page = ({ title, description, children, className = "" }) => (
  <div className={`space-y-6 ${className}`}>
    <header>
      <h1 className="text-[28px] font-semibold tracking-tight text-ink">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-[14px] leading-[1.5] text-ink-muted">
          {description}
        </p>
      )}
    </header>
    {children}
  </div>
);

export default Page;
