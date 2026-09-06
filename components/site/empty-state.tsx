import { GlassCard } from "@/components/site/glass-card";
import { displayClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function EmptyState({
  title = "Nothing matches that yet",
  description = "Clear the filters or search for a shorter word, like “finance”.",
  className,
}: EmptyStateProps) {
  return (
    <GlassCard className={cn("p-10 text-center", className)}>
      <h3 className={displayClass.d3}>{title}</h3>
      <p className="text-ink-muted mt-2">{description}</p>
    </GlassCard>
  );
}
