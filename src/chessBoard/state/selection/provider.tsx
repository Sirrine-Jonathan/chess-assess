import React, { type ReactNode } from "react";
import { useState, useMemo } from "react";
import { initialState, SelectionContext } from "./context";

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectionState, setSelectionState] =
    useState<SelectionState>(initialState);

  const contextValue = useMemo(
    () => ({
      selectionState,
      setSelectionState,
    }),
    [selectionState, setSelectionState]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};
