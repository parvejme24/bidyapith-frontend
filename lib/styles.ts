import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const shellClass = "mx-auto w-[min(1200px,calc(100%-2.5rem))]";

export const sectionClass = "relative py-[clamp(3.75rem,8vw,6.75rem)]";
export const sectionTightClass = "relative py-[clamp(2.5rem,5vw,4rem)]";

export const displayClass = {
  d1: "font-display text-[clamp(2.6rem,6.2vw,4.6rem)] font-semibold leading-[1.08] tracking-[-0.02em]",
  d2: "font-display text-[clamp(2rem,4.2vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.02em]",
  d3: "font-display text-[clamp(1.45rem,2.6vw,2rem)] font-semibold leading-[1.08] tracking-[-0.02em]",
} as const;

export const leadClass =
  "max-w-[62ch] text-[clamp(1.02rem,1.35vw,1.18rem)] text-ink-muted";

export const measureClass = "max-w-[68ch]";
export const bnClass = "font-bangla";
export const numClass = "tabular-nums";

export const gradJadeClass =
  "bg-[linear-gradient(120deg,#cbe8df,#9cf0d8_55%,#6fd8ff)] bg-clip-text text-transparent";

export const ruleClass =
  "m-0 h-px border-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]";

export const glassClass = cva(
  "relative rounded-xl sm:rounded-2xl lg:rounded-[24px] border border-white/13 shadow-[0_24px_60px_-24px_rgba(4,8,30,0.85)] backdrop-blur-[20px] backdrop-saturate-150",
  {
    variants: {
      tone: {
        default: "bg-white/[0.055]",
        strong: "bg-white/[0.085]",
        quiet: "bg-white/[0.035] shadow-none",
      },
      lift: {
        true: "transition-[transform,border-color,background] duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-jade/40 hover:bg-white/[0.085]",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      lift: false,
    },
  },
);

export type GlassVariants = VariantProps<typeof glassClass>;

export const chipClass = cva(
  "inline-flex items-center gap-2 rounded-lg sm:rounded-full border px-[0.85rem] py-[0.36rem] text-[0.78rem] font-semibold backdrop-blur-[10px]",
  {
    variants: {
      tone: {
        default: "border-white/13 bg-white/[0.06] text-ink-muted",
        jade: "border-jade/35 bg-jade/12 text-[#9CF0D8]",
        gold: "border-marigold/35 bg-marigold/12 text-[#FFD9A6]",
        orchid: "border-orchid/35 bg-orchid/12 text-[#D3CBFF]",
        rose: "border-rose/35 bg-rose/12 text-[#FFC2D1]",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export const buttonClass = cva(
  "inline-flex cursor-pointer items-center justify-center gap-[0.55rem] whitespace-nowrap rounded-xl sm:rounded-full border border-transparent text-[0.94rem] font-bold transition-[transform,box-shadow,background,border-color] duration-300 active:translate-y-px active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,var(--jade-soft),var(--jade)_55%,#17B98C)] text-[#05221A] shadow-[0_14px_34px_-14px_rgba(46,211,167,0.9)] hover:shadow-[0_18px_42px_-12px_rgba(46,211,167,1)]",
        ghost:
          "border-white/13 bg-white/[0.06] text-ink backdrop-blur-[12px] hover:border-white/28 hover:bg-white/12",
        gold: "bg-[linear-gradient(135deg,#FFD59B,var(--marigold))] text-[#2B1704] shadow-[0_14px_34px_-14px_rgba(255,180,84,0.8)]",
      },
      size: {
        default: "px-6 py-[0.82rem]",
        sm: "px-[1.05rem] py-[0.55rem] text-[0.85rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonClass>;

export const fieldClass = "mb-4 block";
export const fieldLabelClass = "mb-1.5 block text-[0.82rem] font-semibold text-ink-muted";
export const controlClass =
  "w-full rounded-lg sm:rounded-xl border border-white/13 bg-white/[0.05] px-4 py-[0.82rem] text-[0.94rem] text-ink transition-[border-color,background,box-shadow] placeholder:text-ink-faint focus:border-jade/60 focus:bg-white/[0.08] focus:outline-none focus:shadow-[0_0_0_4px_rgba(46,211,167,0.14)]";
export const selectClass = cn(
  controlClass,
  "cursor-pointer appearance-none bg-none pr-11",
);
export const textareaClass = cn(controlClass, "min-h-32 resize-y");
export const fieldErrorClass = "mt-1.5 hidden text-[0.78rem] text-[#FFA6BA]";
export const fieldInvalidControlClass = "border-rose/70";

export const markClass =
  "grid size-[2.4rem] place-items-center rounded-[13px] bg-[linear-gradient(140deg,var(--jade-soft),var(--jade)_60%,#12A67C)] font-bangla text-[1.15rem] font-semibold text-[#06231B] shadow-[0_10px_26px_-10px_rgba(46,211,167,0.9)]";

export const navLinkClass = cva(
  "cursor-pointer rounded-full px-3.5 py-2 text-[0.9rem] font-semibold text-ink-muted transition-all hover:bg-white/[0.07] hover:text-ink",
  {
    variants: {
      active: {
        true: "bg-jade/15 text-jade border border-jade/30 font-bold shadow-sm",
        false: "",
      },
    },
    defaultVariants: { active: false },
  },
);

export const avatarClass = cva(
  "grid shrink-0 place-items-center rounded-full font-display font-semibold tracking-normal",
  {
    variants: {
      tone: {
        1: "bg-[linear-gradient(140deg,#7CE9CB,#2ED3A7)] text-[#08251C]",
        2: "bg-[linear-gradient(140deg,#C6BCFF,#9B8CFF)] text-[#1A1140]",
        3: "bg-[linear-gradient(140deg,#FFD59B,#FFB454)] text-[#2B1704]",
        4: "bg-[linear-gradient(140deg,#FFB6C8,#FF7E9D)] text-[#3A0F1D]",
      },
    },
    defaultVariants: { tone: 1 },
  },
);

export const meterTrackClass = "h-2 overflow-hidden rounded-full bg-white/[0.09]";
export const meterFillClass = cva(
  "block h-full rounded-full transition-[width] duration-[1300ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
  {
    variants: {
      tone: {
        default: "bg-[linear-gradient(90deg,var(--jade),var(--jade-soft))]",
        warn: "bg-[linear-gradient(90deg,#F59E4B,#FFD59B)]",
        hot: "bg-[linear-gradient(90deg,#FF6B8B,#FFB0C2)]",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export const tableScrollClass = "overflow-x-auto";
export const tableClass = "w-full border-collapse text-[0.9rem]";
export const thClass =
  "whitespace-nowrap border-b border-white/13 px-4 py-[0.85rem] text-left text-xs font-bold tracking-[0.04em] text-ink-faint";
export const tdClass = "border-b border-white/[0.06] px-4 py-[0.95rem] align-middle last:border-0";
export const trClass = "transition-colors hover:bg-white/[0.045]";

export const skipClass =
  "absolute left-4 top-[-4rem] z-[200] rounded-full bg-jade px-[1.1rem] py-[0.7rem] font-bold text-[#05221A] transition-[top] focus:top-4";

export function ui(...parts: Array<string | false | null | undefined>) {
  return cn(...parts);
}
