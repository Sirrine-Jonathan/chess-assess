import type { ReactNode } from "react";
import { useState, useMemo, useRef, useCallback } from "react";
import { loadOptions, storeOptions } from "./storage";
import { initialState, OptionsContext } from "./context";
import React from "react";

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const loadedOptions = loadOptions();
  const [options, setOptions] = useState<Options>({
    ...initialState,
    ...loadedOptions,
  });
  const timeoutHandleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const _setOptions = useCallback(
    (options: Options) => {
      if (timeoutHandleRef.current) {
        clearTimeout(timeoutHandleRef.current);
      }
      timeoutHandleRef.current = setTimeout(() => {
        storeOptions(options);
      }, 1000);
      setOptions(options);
    },
    [setOptions, timeoutHandleRef]
  );

  const contextValue = useMemo(
    () => ({
      options,
      setOptions: _setOptions,
    }),
    [options, _setOptions]
  );

  return (
    <OptionsContext.Provider value={contextValue}>
      {children}
    </OptionsContext.Provider>
  );
};
