import { isFunction } from "@lilbunnyrabbit/utils";
import React from "react";

export type ObjectState<T extends Record<PropertyKey, unknown>> = {
  values: T;
  set<K extends keyof T>(key: K, value: T[K]): void;
};

export function useObjectState<T extends Record<PropertyKey, unknown>>(defaultValues: T): ObjectState<T> {
  const [values, setValues] = React.useState<T>(defaultValues);

  const setValue = React.useCallback(function <K extends keyof T>(key: K, value: T[K]) {
    setValues((values) => ({ ...values, [key]: isFunction(value) ? value(values[key]) : value }));
  }, []);

  return {
    values,
    set: setValue,
  };
}
