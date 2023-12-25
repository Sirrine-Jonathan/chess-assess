import { createContext } from "react";

export const initialState: SelectionState = {
  activePiece: null,
  lockedOwn: [],
  lockedTarget: [],
};

export const SelectionContext = createContext<{
  selectionState: SelectionState;
  setSelectionState: (state: SelectionState) => void;
}>({ selectionState: initialState, setSelectionState: () => null });
