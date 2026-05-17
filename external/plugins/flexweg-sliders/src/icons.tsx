// Inline SVG icons for the four slider block types. Self-contained so
// the plugin doesn't pull in lucide-react as a dependency. Sized at
// 1em / strokes inherit currentColor, so the admin's block-inserter
// styles apply transparently.

const baseProps = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ImageSliderIcon() {
  return (
    <svg {...baseProps}>
      <rect x="3" y="6" width="14" height="12" rx="1.5" />
      <rect x="7" y="3" width="14" height="12" rx="1.5" opacity=".5" />
      <circle cx="10" cy="10" r="1.5" />
    </svg>
  );
}

export function HeroSliderIcon() {
  return (
    <svg {...baseProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 11h8" />
      <path d="M7 14h5" />
      <circle cx="18" cy="17" r="1" fill="currentColor" />
      <circle cx="14" cy="17" r="1" />
    </svg>
  );
}

export function CardSliderIcon() {
  return (
    <svg {...baseProps}>
      <rect x="2" y="6" width="6" height="12" rx="1.25" />
      <rect x="9" y="6" width="6" height="12" rx="1.25" />
      <rect x="16" y="6" width="6" height="12" rx="1.25" opacity=".5" />
    </svg>
  );
}

export function LogoCarouselIcon() {
  return (
    <svg {...baseProps}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M1 12h2M22 12h2" opacity=".5" />
    </svg>
  );
}
