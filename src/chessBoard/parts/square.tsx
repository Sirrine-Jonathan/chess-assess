import type { PropsWithChildren, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess.js";
import { useRef } from "react";
import clsx from "clsx";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import { Sweat, Lock } from "../pieces/svg";
import { useSelection } from "../state/selection/useSelection";
import { useLongPress } from "../../hooks/useLongPress";

interface SquareProps {
  name: Square;
  piece: { square: Square; type: PieceSymbol; color: Color } | null;
  flip: boolean;
  playerDefending: boolean;
  isPlayerAttackingTargeted: boolean;
  possibleDestination: boolean;
  possibleDestinationOfLocked: boolean;
  enemyDefending: boolean;
  partOfLastMove: boolean;
  isAttacked: boolean;
}

export const ChessSquare = ({
  name,
  piece,
  flip,
  playerDefending,
  isPlayerAttackingTargeted,
  possibleDestination,
  possibleDestinationOfLocked,
  enemyDefending,
  partOfLastMove,
  isAttacked,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { gameState, Actions } = useGame();
  const { selectionState, selectionActions } = useSelection();
  const { Options } = useOptions();

  const pieceName = gameState.pieceMap[name as keyof typeof gameState.pieceMap];

  const isLockedOwn = pieceName && selectionState.lockedOwn.includes(pieceName);
  const isLockedTarget =
    pieceName && selectionState.lockedTarget.includes(pieceName);

  const showDefenseLayer =
    (Options.showDefenseLayer && playerDefending) ||
    (isPlayerAttackingTargeted && gameState.playerColor === "w");
  const showEnemyDefenseLayer =
    (Options.showEnemyDefenseLayer && enemyDefending) ||
    (isPlayerAttackingTargeted && gameState.playerColor === "b");

  const nothingSquare =
    !possibleDestination &&
    !showDefenseLayer &&
    !showEnemyDefenseLayer &&
    !possibleDestinationOfLocked;

  const isActive = piece && piece?.square === selectionState.activePiece?.from;

  const getLayers = () => {
    const triangles = [
      <span key="top" className="layer topLayer" />,
      <span key="right" className="layer rightLayer" />,
      <span key="bottom" className="layer bottomLayer" />,
      <span key="left" className="layer leftLayer" />,
    ];
    const layers: ReactNode[] = [...triangles];

    if (isAttacked) {
      layers.push(
        <span key="isAttacked" className="layer isAttacked">
          <Sweat />
        </span>
      );
    }

    if (isLockedOwn || isLockedTarget) {
      layers.push(
        <span key="locked" className="layer lockedLayer">
          <Lock />
        </span>
      );
    }

    if (possibleDestinationOfLocked) {
      layers.push(
        <span key="lockedMoveLayer" className="layer lockedMoveLayer">
          {triangles}
        </span>
      );
    }

    if (possibleDestination) {
      layers.push(
        <span key="moveLayer" className="layer moveLayer">
          {triangles}
        </span>
      );
      return layers;
    }

    if (showDefenseLayer) {
      layers.push(
        <span
          key="defense"
          className={clsx([
            "layer",
            showEnemyDefenseLayer ? "disputedLayer" : "defenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    } else if (showEnemyDefenseLayer) {
      layers.push(
        <span
          key="disputed"
          className={clsx([
            "layer",
            showDefenseLayer ? "disputedLayer" : "enemyDefenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    }

    return layers;
  };

  const onLongPress = () => {
    if (!pieceName) {
      return;
    }
    if (isLockedTarget) {
      selectionActions.unlockTarget(pieceName);
    } else if (isLockedOwn) {
      selectionActions.unlockOwn(pieceName);
    } else {
      if (piece?.color == gameState.playerColor) {
        selectionActions.lockOwn(pieceName);
      } else {
        selectionActions.lockTarget(pieceName);
      }
    }
  };

  const onClick = () => {
    if (!Actions.navRestored()) {
      return false;
    }
    const piece = gameState.board.flat().find((cell) => cell?.square === name);

    if (piece && piece.color === gameState.turn) {
      selectionActions.setActivePiece({
        color: piece.color as Color,
        piece: piece.type as PieceSymbol,
        from: name as Square,
      });
    } else if (
      selectionState.activePiece &&
      (possibleDestination || playerDefending)
    ) {
      const move = {
        from: selectionState.activePiece.from,
        to: name as Square,
      };
      const captured = Actions.move(move);
      if (captured) {
        Actions.setColorCaptured({
          color: captured.color as Color,
          piece: captured.piece,
          type: captured.type as CaptureEvent["type"],
        });
      }
      Actions.performUpdate();
      Actions.setLastMove(move);
      selectionActions.setActivePiece(null);
    }
  };

  const defaultOptions = {
    shouldPreventDefault: false,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <div
      key={name}
      id={name}
      className={clsx([
        "square",
        flip && "flip",
        (playerDefending || isPlayerAttackingTargeted) && "playerDefending",
        possibleDestination && "possibleDestination",
        enemyDefending && "enemyDefending",
        partOfLastMove && "partOfLastMove",
        isAttacked && "isAttacked",
        isActive && "isActive",
        nothingSquare && "nothingSquare",
      ])}
      style={{ ...(possibleDestination ? { cursor: "pointer" } : {}) }}
      tabIndex={0}
      {...longPressEvent}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          if (!Actions.navRestored()) {
            return false;
          }
          const piece = gameState.board
            .flat()
            .find((cell) => cell?.square === name);
          if (piece && piece.color === gameState.turn) {
            selectionActions.setActivePiece({
              color: piece.color as Color,
              piece: piece.type as PieceSymbol,
              from: name as Square,
            });
          } else if (
            selectionState.activePiece &&
            (possibleDestination || playerDefending)
          ) {
            const move = {
              from: selectionState.activePiece.from,
              to: name as Square,
            };
            const captured = Actions.move(move);
            if (captured) {
              Actions.setColorCaptured({
                color: captured.color as Color,
                piece: captured.piece,
                type: captured.type as CaptureEvent["type"],
              });
            }
            Actions.performUpdate();
            Actions.setLastMove(move);
            selectionActions.setActivePiece(null);
          }
        } else {
          const parent = nameRef.current?.closest(".board");
          if (parent) {
            const child = parent?.querySelector(`#${name}`);
            const children = parent.children;
            const index = Array.prototype.indexOf.call(children, child);
            const adjacentRight = children?.[index + 1];
            const adjacentLeft = children?.[index - 1];
            const adjacentUp = children?.[index - 8];
            const adjacentDown = children?.[index + 8];

            let id = "";
            if (e.code === "ArrowRight") {
              id = adjacentRight?.id;
            } else if (e.code === "ArrowLeft") {
              id = adjacentLeft?.id;
            } else if (e.code === "ArrowUp") {
              id = adjacentUp?.id;
            } else if (e.code === "ArrowDown") {
              id = adjacentDown?.id;
            }
            if (id) {
              const el = document.querySelector(`#${id}`);
              if (el) {
                (el as HTMLDivElement).focus();
              }
            }
          }
        }
      }}
    >
      <span className="pieceName">{pieceName || "NA"}</span>
      {getLayers()}
      {Options.showSquareName ? (
        <span ref={nameRef} className="squareName">
          {name}
        </span>
      ) : null}
      {children}
    </div>
  );
};
