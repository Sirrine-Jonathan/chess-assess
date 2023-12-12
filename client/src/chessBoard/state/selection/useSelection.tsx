import { useContext, useMemo } from "react";
import { SelectionContext } from "./context";

export const useSelection = () => {
  const { selectionState, setSelectionState } = useContext(SelectionContext);

  const selectionActions = useMemo(
    () => ({
      setActivePiece: (activePiece) =>
        setSelectionState({
          ...selectionState,
          activePiece,
        }),
    }),
    [selectionState]
  );

  return { selectionState, selectionActions };
};
