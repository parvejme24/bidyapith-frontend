import { cn } from "@/lib/utils";

const LOGOS = {
  mark: { src: "/brand/logo-mark.svg", width: 40, height: 40, label: "Bidyapith" },
  horizontal: {
    src: "/brand/logo-horizontal.svg",
    width: 168,
    height: 40,
    label: "Bidyapith University",
  },
  horizontalBn: {
    src: "/brand/logo-horizontal-bn.svg",
    width: 200,
    height: 40,
    label: "বিদ্যাপীঠ বিশ্ববিদ্যালয়",
  },
  stacked: {
    src: "/brand/logo-stacked.svg",
    width: 120,
    height: 120,
    label: "Bidyapith University",
  },
} as const;

export type BrandLogoVariant = keyof typeof LOGOS;

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function BrandLogo({
  variant = "horizontal",
  className,
  imgClassName,
  priority = false,
  decorative = false,
}: BrandLogoProps) {
  const logo = LOGOS[variant];

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand assets from /public/brand */}
      <img
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={decorative ? "" : logo.label}
        aria-hidden={decorative || undefined}
        className={cn("h-auto w-auto", imgClassName)}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </span>
  );
}
