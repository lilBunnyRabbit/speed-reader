import { isNumber, isString } from "@lilbunnyrabbit/utils";
import React from "react";

export interface BindState<T extends string | number> {
  value: T | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function useBindState<T extends string | number>(defaultValue: T): BindState<T> {
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, valueAsNumber } = e.target as HTMLInputElement;

      if (isString(defaultValue)) {
        setInternal(value as T);
      } else if (isNumber(defaultValue)) {
        const numberValue = isNumber(valueAsNumber) ? valueAsNumber : Number.parseFloat(e.target.value);
        setInternal((!Number.isNaN(numberValue) ? numberValue : undefined) as T);
      } else {
        console.error("Unsupported type for defaultValue");
      }
    },
    [defaultValue]
  );

  return {
    value: internal,
    onChange,
  };
}
