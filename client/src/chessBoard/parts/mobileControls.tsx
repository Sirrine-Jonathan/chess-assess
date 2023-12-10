import { useOptions } from "../optionsContext";
import { KW, KB } from "../pieces/svg";
import clsx from "clsx";
import { useChessBoardContext } from "../gameContext";
import { ColorPicker } from "../parts/colorPicker";

const MobileControls = () => {
  const { Options, Actions: OptionActions } = useOptions();
  const { State } = useChessBoardContext();

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
          State.game.turn === "w" && "isTurn",
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
      <ColorPicker
        color={Options.accentColor}
        onChange={OptionActions.setAccentColor}
        label="Edit enemy layer color"
        direction="center"
      />
      <div
        className={clsx([
          "layerControl",
          State.game.turn === "b" && "isTurn",
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
