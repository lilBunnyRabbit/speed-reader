import { useMergeRefs } from "@/hooks/use-merge-refs";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useId } from "react";
import classes from "./config-input.module.scss";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const checkMinMax = (input: HTMLInputElement, value: number) => {
  const min = Number.parseInt(input.min);
  if (!Number.isNaN(min) && value < min) {
    return min;
  }

  const max = Number.parseInt(input.max);
  if (!Number.isNaN(max) && value > max) {
    return max;
  }

  return value;
};

export const ConfigInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { tooltip?: React.ReactNode }
>(({ tooltip, children, className, ...props }, ref) => {
  const id = useId();

  const internalRef = React.useRef<HTMLInputElement>(null);
  const refs = useMergeRefs(ref, internalRef);

  const modifyValue = React.useCallback((modifier: number) => {
    const input = internalRef.current;
    if (!input) {
      return;
    }

    let step = Number.parseInt(input.step);
    if (Number.isNaN(step)) {
      step = 1;
    }
    step *= modifier;

    const newValue = checkMinMax(input, Number.isNaN(input.valueAsNumber) ? step : input.valueAsNumber + step);

    if (newValue !== input.valueAsNumber) {
      input.valueAsNumber = newValue;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, []);

  React.useEffect(() => {
    const input = internalRef.current;
    if (!input) {
      return;
    }

    function onBlur(this: HTMLInputElement) {
      const value = this.valueAsNumber;
      if (Number.isNaN(value)) {
        return;
      }

      const newValue = checkMinMax(this, value);
      if (newValue !== value) {
        this.valueAsNumber = newValue;
        this.dispatchEvent(new Event("change", { bubbles: true }));
        this.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    input.addEventListener("blur", onBlur);

    return () => {
      input.removeEventListener("blur", onBlur);
    };
  }, []);

  const element = (
    <div className={cn("flex items-center gap-2", className)}>
      {children && (
        <label className="whitespace-nowrap" htmlFor={props.id ?? id}>
          {children}
        </label>
      )}
      <div className="inline-flex items-center bg-foreground rounded-md text-background px-1">
        <button type="button" className="pr-1 outline-none" onClick={() => modifyValue(-1)}>
          <MinusIcon className="size-4" />
        </button>
        <input ref={refs} id={id} type="number" className={classes["config-input"]} {...props} />
        <button type="button" className="pl-1 outline-none" onClick={() => modifyValue(1)}>
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );

  if (!tooltip) {
    return element;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ConfigInput.displayName = "ConfigInput";
