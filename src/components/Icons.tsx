interface P {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const IconBag = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconHeart = ({
  className = "h-5 w-5",
  filled = false,
}: P & { filled?: boolean }) => (
  <svg
    {...base}
    fill={filled ? "currentColor" : "none"}
    className={className}
    aria-hidden="true"
  >
    <path d="M12 20s-7-4.6-9.2-9A5.2 5.2 0 0 1 12 6.5 5.2 5.2 0 0 1 21.2 11C19 15.4 12 20 12 20Z" />
  </svg>
);

export const IconSearch = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const IconMenu = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

export const IconClose = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);

export const IconPlus = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

export const IconArrow = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
  </svg>
);

export const IconCheck = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const IconTrash = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" />
  </svg>
);

export const IconChevron = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconTruck = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M2 6h12v10H2zM14 9h4l3 3v4h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

export const IconLock = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconInstagram = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPinterest = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M10 17.5 12 9m0 0c.4-1.6 1.7-2.6 3.1-2.3 1.6.3 2.4 1.9 1.9 3.7-.5 1.9-2 3-3.6 2.7-.8-.2-1.3-.7-1.5-1.4" />
  </svg>
);
