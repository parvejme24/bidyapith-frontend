import type { ReactNode } from "react";
import { Chip, type ChipTone } from "@/components/site/chip";
import { Rise } from "@/components/site/motion";
import { displayClass, leadClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  chip?: ReactNode;
  chipTone?: ChipTone;
  chipLive?: boolean;
  title: ReactNode;
  lead?: ReactNode;
  heading?: "d1" | "d2";
  children?: ReactNode;
  className?: string;
};

export function PageHero({
  chip,
  chipTone = "jade",
  chipLive = false,
  title,
  lead,
  heading = "d1",
  children,
  className,
}: PageHeroProps) {
  return (
    <div className={cn(shellClass, "max-w-3xl", className)}>
      {chip ? (
        <Rise delay={1}>
          <Chip tone={chipTone} live={chipLive}>
            {chip}
          </Chip>
        </Rise>
      ) : null}
      <Rise delay={2}>
        <h1 className={cn(displayClass[heading], chip && "mt-5")}>{title}</h1>
      </Rise>
      {lead ? (
        <Rise delay={3}>
          <p className={cn(leadClass, "mt-5")}>{lead}</p>
        </Rise>
      ) : null}
      {children ? (
        <Rise delay={4} className="mt-8">
          {children}
        </Rise>
      ) : null}
    </div>
  );
}
