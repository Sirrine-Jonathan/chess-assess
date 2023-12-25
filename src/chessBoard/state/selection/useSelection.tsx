import type { Square } from "chess.js";
import { useContext, useMemo } from "react";
import { SelectionContext } from "./context";

export const useSelection = () => {
  const { selectionState, setSelectionState } = useContext(SelectionContext);

  const selectionActions = useMemo(
    () => ({
      setActivePiece: (activePiece: ChessPiece | null) =>
        setSelectionState({
          ...selectionState,
          activePiece,
        }),
      lockOwn: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedOwn: [...selectionState.lockedOwn, squareName],
        });
      },
      unlockOwn: (squareName: Square) => {
        const lockedOwn = selectionState.lockedOwn.filter(
          (lockedSquareName) => lockedSquareName !== squareName
        );
        setSelectionState({
          ...selectionState,
          lockedOwn: lockedOwn,
        });
      },
      lockTarget: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedTarget: [...selectionState.lockedTarget, squareName],
        });
      },
      unlockTarget: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedTarget: selectionState.lockedTarget.filter(
            (lockedSquareName) => lockedSquareName !== squareName
          ),
        });
      },
    }),
    [selectionState]
  );

  return { selectionState, selectionActions };
};
