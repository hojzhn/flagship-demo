// Path breadcrumb. Pass `items` as an array of { label, onClick? }.
// Items with `onClick` render as accent links; the final item (or any
// item without `onClick`) renders as plain ink text and reads as the
// current location.
//
//   <Breadcrumb items={[
//     { label: "Discover", onClick: goDiscover },
//     { label: "Baskets",  onClick: goDiscover },
//     { label: basket.name, onClick: goBasket },
//     { label: "Commit" },
//   ]} />

const Breadcrumb = ({ items }) => (
  <nav className="text-[13px] text-ink-muted">
    {items.map((item, i) => (
      <span key={i}>
        {i > 0 && <span> · </span>}
        {item.onClick ? (
          <button
            onClick={item.onClick}
            className="text-accent hover:underline"
          >
            {item.label}
          </button>
        ) : (
          <span className="text-ink">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
