import { useOptions } from "../optionsContext";
import { ColorPicker } from "../Controls";
import { KW, KB } from "../pieces/svg";
import clsx from "clsx";
import { useChessBoardContext } from "../gameContext";

const MobileControls = () => {
  const { Options, Actions: OptionActions } = useOptions();
  const { State } = useChessBoardContext();

  return (
    <div className="mobileControls">
      <ColorPicker
        color={Options.defenseLayerColor}
        onChange={OptionActions.setDefenseLayerColor}
        label="Edit defense layer color"
        triangle="top-left"
      />
      <div
        className={clsx([
          "layerControl",
          State.turn === "w" && "isTurn",
          State.playerColor === "w" && Options.showDefenseLayer && "layerOn",
          State.playerColor !== "w" &&
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
            State.playerColor === "w"
              ? "layerIconDefense"
              : "layerIconEnemyDefense",
          ])}
        />
      </div>
      <div
        className={clsx([
          "layerControl",
          State.turn === "b" && "isTurn",
          State.playerColor === "b" && Options.showDefenseLayer && "layerOn",
          State.playerColor !== "b" &&
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
            State.playerColor === "b"
              ? "layerIconDefense"
              : "layerIconEnemyDefense",
          ])}
        />
      </div>
      <ColorPicker
        color={Options.enemyDefenseLayerColor}
        onChange={OptionActions.setEnemyDefenseLayerColor}
        label="Edit enemy layer color"
        triangle="top-right"
      />
    </div>
  );
};

export default MobileControls;
