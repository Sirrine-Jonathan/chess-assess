import { KW, KB } from "../pieces/svg";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import clsx from 'clsx'

export const LayerQuickControls = () => {
  const { Options, Actions: OptionActions } = useOptions();
  const { gameState } = useGame();

  return (
    <div className="mobileLayerControls">
      <div
        className={clsx([
          "layerControl",
          gameState.turn === "w" && "isTurn",
          gameState.playerColor === "w" &&
          Options.showDefenseLayer &&
          "layerOn",
          gameState.playerColor !== "w" &&
          Options.showEnemyDefenseLayer &&
          "layerOn",
        ])}
        onClick={() => {
          OptionActions.setShowDefenseLayer(!Options.showDefenseLayer);
        }}
      >
        <KW
          className={clsx([
            "layerIcon layerIconWhite",
            gameState.playerColor === "w"
              ? "layerIconDefense"
              : "layerIconEnemyDefense",
          ])}
        />
      </div>

      <div
        className={clsx([
          "layerControl",
          gameState.turn === "b" && "isTurn",
          gameState.playerColor === "b" &&
          Options.showDefenseLayer &&
          "layerOn",
          gameState.playerColor !== "b" &&
          Options.showEnemyDefenseLayer &&
          "layerOn",
        ])}
        onClick={() => {
          OptionActions.setShowEnemyDefenseLayer(
            !Options.showEnemyDefenseLayer
          );
        }}
      >
        <KB
          className={clsx([
            "layerIcon layerIconBlack",
            gameState.playerColor === "b"
              ? "layerIconDefense"
              : "layerIconEnemyDefense",
          ])}
        />
      </div>
    </div>
  )
}