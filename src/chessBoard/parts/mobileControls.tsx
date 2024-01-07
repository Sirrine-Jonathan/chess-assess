import { ColorPicker } from "./colorPicker";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";

const ColorControls = () => {
  const { Options, Actions: OptionActions } = useOptions();
  const { gameState } = useGame();

  return (
    <div className="colorControls">
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
      <ColorPicker
        color={Options.disputedLayerColor}
        onChange={OptionActions.setDisputedLayerColor}
        label="Edit disputed layer color"
        direction="center"
      />
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

export default ColorControls;
