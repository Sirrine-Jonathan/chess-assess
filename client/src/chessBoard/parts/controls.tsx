import { useOptions } from "../state/options/useOptions";
import clsx from "clsx";
import { Switch } from "@headlessui/react";
import CheckButton from "./checkButton";
import { ColorPicker } from "./colorPicker";

export const Toggle = ({
  on,
  label,
  handleChange,
  switchClass,
  thumbClass,
}: {
  on: boolean;
  label: string;
  handleChange: (on: boolean) => void;
  switchClass?: string;
  thumbClass?: string;
}) => (
  <Switch.Group>
    <Switch
      checked={on}
      name={label}
      value={on ? "yes" : "no"}
      onChange={(isChecked) => {
        handleChange(isChecked);
      }}
      className={clsx(["optionsToggle", switchClass])}
    >
      <span
        aria-hidden="true"
        className={clsx(["optionsToggleThumb", thumbClass])}
      />
    </Switch>
    <Switch.Label>{label}</Switch.Label>
  </Switch.Group>
);

export const Controls = () => {
  const { Options, Actions } = useOptions();

  return (
    <>
      <div className="controls sidebarSection">
        <div className="sidebarSubSection">
          <div className="controlRow">
            <ColorPicker
              color={Options.primaryColor}
              onChange={Actions.setPrimaryColor}
              label="Edit primary color"
              showLabel
              direction="right"
            />
          </div>
          <div className="controlRow">
            <ColorPicker
              color={Options.secondaryColor}
              onChange={Actions.setSecondaryColor}
              label="Edit secondary color"
              showLabel
              direction="right"
            />
          </div>
          <div className="controlRow">
            <ColorPicker
              color={Options.disputedLayerColor}
              onChange={Actions.setDisputedLayerColor}
              label="Edit disputed territory color"
              showLabel
              direction="right"
            />
          </div>
        </div>
        <div className="sidebarSubSection">
          <div className="controlRow">
            <div className="toggleRow">
              <Toggle
                on={Options.showDefenseLayer}
                label="Show defense"
                handleChange={Actions.setShowDefenseLayer}
                switchClass="defenseLayerSwitch"
              />
            </div>
            <ColorPicker
              color={Options.defenseLayerColor}
              onChange={Actions.setDefenseLayerColor}
              label="Edit defense layer color"
              direction="left"
            />
          </div>
          <div className="controlRow">
            <div className="toggleRow">
              <Toggle
                on={Options.showEnemyDefenseLayer}
                label="Show enemy defense"
                handleChange={Actions.setShowEnemyDefenseLayer}
                switchClass="enemyDefenseLayerSwitch"
              />
            </div>
            <ColorPicker
              color={Options.enemyDefenseLayerColor}
              onChange={Actions.setEnemyDefenseLayerColor}
              label="Edit enemy defense layer color"
              direction="left"
            />
          </div>
          <div className="toggleRow">
            <Toggle
              on={Options.flipBoard}
              label="Flip board"
              handleChange={Actions.flipBoard}
              switchClass="flipBoard"
            />
          </div>
        </div>
        <div className="sidebarSubSection controlsCheckButtons">
          <CheckButton
            label="Reset Options"
            onClick={Actions.resetOptions}
            classes="restoreButton small"
          />
          <CheckButton
            label="New Game"
            onClick={() => {
              window.location.href = window.origin;
            }}
            classes="resetButton small"
          />
        </div>
      </div>
    </>
  );
};
