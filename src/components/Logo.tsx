interface LogoProps {
  className?: string;
  /** Background colour used to fake the interlaced weave. */
  halo?: string;
}

/**
 * The OC monogram: an interlocked O and C rendered as a woven pair of rings.
 * The O passes over the C at the upper crossing; the C passes over the O below.
 */
export function Logo({ className = "h-9 w-auto", halo = "#F5F3EE" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 132 100"
      className={className}
      fill="none"
      aria-label="OC monogram"
      role="img"
    >
      {/* O ring */}
      <circle
        cx="46"
        cy="50"
        r="34"
        stroke="currentColor"
        strokeWidth="5"
      />
      {/* C ring, opening to the right */}
      <path
        d="M 107.9 24 A 34 34 0 0 0 52 50 A 34 34 0 0 0 107.9 76"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* halo + O over-crossing at the top intersection */}
      <path
        d="M 57.6 18.05 A 34 34 0 0 1 72.8 29.1"
        stroke={halo}
        strokeWidth="12"
        strokeLinecap="butt"
      />
      <path
        d="M 57.6 18.05 A 34 34 0 0 1 72.8 29.1"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="butt"
      />
    </svg>
  );
}

export function LogoLockup({
  className = "",
  halo = "#F5F3EE",
  subClass = "text-muted",
}: LogoProps & { subClass?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-9 w-auto md:h-10" halo={halo} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-medium tracking-[0.06em]">
          OC
        </span>
        <span
          className={`mt-1 text-[8px] font-semibold tracking-[0.42em] ${subClass}`}
        >
          SINCE 2026
        </span>
      </span>
    </span>
  );
}
