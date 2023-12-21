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
      lockShow: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedShowPieces: [...selectionState.lockedShowPieces, squareName],
        });
      },
      unlockShow: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedShowPieces: selectionState.lockedShowPieces.filter(
            (lockedSquareName) => lockedSquareName !== squareName
          ),
        });
      },
      lockHide: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedHidePieces: [...selectionState.lockedHidePieces, squareName],
        });
      },
      unlockHide: (squareName: Square) => {
        setSelectionState({
          ...selectionState,
          lockedHidePieces: selectionState.lockedHidePieces.filter(
            (lockedSquareName) => lockedSquareName !== squareName
          ),
        });
      },
    }),
    [selectionState]
  );

  return { selectionState, selectionActions };
};
