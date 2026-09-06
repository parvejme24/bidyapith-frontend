import type { ComponentProps } from "react";
import { glassClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type GlassCardProps = ComponentProps<"div"> & {
  strong?: boolean;
  quiet?: boolean;
  lift?: boolean;
};

export function GlassCard({
  strong = false,
  quiet = false,
  lift = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        glassClass({
          tone: strong ? "strong" : quiet ? "quiet" : "default",
          lift,
        }),
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-[inherit] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] opacity-55"
      />
      {children}
    </div>
  );
}
