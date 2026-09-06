import { forwardRef, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { fieldInvalidControlClass, selectClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type SelectInputProps = ComponentProps<"select"> & {
  invalid?: boolean;
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput({ className, invalid = false, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(selectClass, invalid && fieldInvalidControlClass, className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
          strokeWidth={2.25}
        />
      </div>
    );
  },
);
