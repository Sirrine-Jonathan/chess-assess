import { KW, KB } from "../pieces/svg";
import clsx from "clsx";
import { ColorPicker } from "./colorPicker";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";

const MobileControls = () => {
  const { Options, Actions: OptionActions } = useOptions();
  const { gameState } = useGame();

  return (
    <div className="mobileControls">
      <ColorPicker
        color={Options.secondaryColor}
        onChange={OptionActions.setSecondaryColor}
        label="Edit secondary color"
        direction="right"
      />

      <ColorPicker
        color={Options.defenseLayerColor}
        onChange={OptionActions.setDefenseLayerColor}
        label="Edit defense layer color"
        direction="right"
      />
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
      <ColorPicker
        color={Options.disputedLayerColor}
        onChange={OptionActions.setDisputedLayerColor}
        label="Edit disputed layer color"
        direction="center"
      />
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
      <ColorPicker
        color={Options.enemyDefenseLayerColor}
        onChange={OptionActions.setEnemyDefenseLayerColor}
        label="Edit enemy layer color"
        direction="left"
      />
      <ColorPicker
        color={Options.primaryColor}
        onChange={OptionActions.setPrimaryColor}
        label="Edit primary color"
        direction="left"
      />
    </div>
  );
};

export default MobileControls;
