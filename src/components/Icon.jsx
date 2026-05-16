const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths = {
  // Sidebar nav (Invest)
  discover: (
    <g {...stroke}>
      <path d="M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3Z" />
      <path d="M19 14.5l.5 1.4 1.5.5-1.5.5-.5 1.4-.5-1.4-1.5-.5 1.5-.5.5-1.4Z" />
      <path d="M5.5 16.5l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z" />
    </g>
  ),
  portfolio: (
    <g {...stroke}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
      <path d="M11 12.5v1.5h2v-1.5" />
    </g>
  ),
  activity: (
    <g {...stroke}>
      <path d="M3 12h3l2-5 4 10 3-7 2 3h4" />
    </g>
  ),

  // Sidebar nav (System)
  settings: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M19.4 14.3a1.6 1.6 0 0 0 .32 1.74l.06.06a1.9 1.9 0 1 1-2.7 2.7l-.06-.06a1.6 1.6 0 0 0-1.74-.32 1.6 1.6 0 0 0-.97 1.47V20a1.9 1.9 0 1 1-3.8 0v-.05a1.6 1.6 0 0 0-1-1.47 1.6 1.6 0 0 0-1.74.32l-.06.06a1.9 1.9 0 1 1-2.7-2.7l.06-.06a1.6 1.6 0 0 0 .32-1.74 1.6 1.6 0 0 0-1.47-.97H4a1.9 1.9 0 1 1 0-3.8h.05a1.6 1.6 0 0 0 1.47-1 1.6 1.6 0 0 0-.32-1.74l-.06-.06a1.9 1.9 0 1 1 2.7-2.7l.06.06a1.6 1.6 0 0 0 1.74.32H9.7a1.6 1.6 0 0 0 .97-1.47V4a1.9 1.9 0 1 1 3.8 0v.05a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.74-.32l.06-.06a1.9 1.9 0 1 1 2.7 2.7l-.06.06a1.6 1.6 0 0 0-.32 1.74V9.7a1.6 1.6 0 0 0 1.47.97H20a1.9 1.9 0 1 1 0 3.8h-.05a1.6 1.6 0 0 0-1.47.97Z" />
    </g>
  ),

  // Chrome
  search: (
    <g {...stroke}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m20 20-3.6-3.6" />
    </g>
  ),
  bell: (
    <g {...stroke}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.2H4.5L6 16Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </g>
  ),
  plus: (
    <g {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </g>
  ),
  chevronDown: (
    <g {...stroke}>
      <path d="m6 9 6 6 6-6" />
    </g>
  ),
  chevronLeft: (
    <g {...stroke}>
      <path d="m15 6-6 6 6 6" />
    </g>
  ),
  sun: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </g>
  ),
  moon: (
    <g {...stroke}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </g>
  ),
  more: (
    <g {...stroke}>
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18.5" cy="12" r="1.2" />
    </g>
  ),

  // Status / delta glyphs. Bolder stroke for `check` so it reads
  // crisply inside the small filled circle; filled triangles for the
  // up/down performance indicators.
  check: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5L19 7" />
    </g>
  ),
  triangleUp: (
    <g fill="currentColor" stroke="none">
      <path d="M12 7l7 11H5z" />
    </g>
  ),
  triangleDown: (
    <g fill="currentColor" stroke="none">
      <path d="M12 17 5 6h14z" />
    </g>
  ),
}

const Icon = ({ name, className = 'h-[18px] w-[18px]' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    {paths[name]}
  </svg>
)

export default Icon
