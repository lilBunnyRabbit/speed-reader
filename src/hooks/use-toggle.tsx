import { isFunction } from "@lilbunnyrabbit/utils";
import React from "react";

export interface ToggleState {
  (newValue?: React.SetStateAction<boolean>): void;
  value: boolean;
}

export function useToggle(defaultValue?: boolean): ToggleState {
  const [value, setValue] = React.useState(!!defaultValue);

  const toggle = React.useMemo(() => {
    return function (newValue?: React.SetStateAction<boolean>) {
      if (typeof newValue === "boolean") {
        return setValue(newValue);
      }

      if (isFunction(newValue)) {
        return setValue(newValue);
      }

      return setValue((v) => !v);
    };
  }, []);

  return React.useMemo(() => {
    const state = toggle as ToggleState;
    state.value = value;
    return state;
  }, [toggle, value]);
}
