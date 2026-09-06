import type { ComponentProps } from "react";
import { chipClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type ChipTone = "default" | "jade" | "gold" | "orchid" | "rose";

type ChipProps = ComponentProps<"span"> & {
  tone?: ChipTone;
  live?: boolean;
};

export function Chip({ tone = "default", live = false, className, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipClass({ tone }), className)} {...props}>
      {live ? (
        <span className="size-[7px] rounded-full bg-current shadow-[0_0_0_0_rgba(46,211,167,0.7)] animate-[live-ping_2.2s_ease-out_infinite]" />
      ) : null}
      {children}
    </span>
  );
}
