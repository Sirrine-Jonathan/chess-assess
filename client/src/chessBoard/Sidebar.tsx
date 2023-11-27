import { useState, useId } from "react";
import { KW, KB } from "./pieces/svg";
import { useChessBoardContext } from "./gameContext";
import { useOptions } from "./optionsContext";
import { TwitterPicker } from "react-color";
import clsx from "clsx";
import { Switch } from "@headlessui/react";

const Toggle = ({
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

const ColorPicker = ({
  color,
  onChange,
  triangle,
  label,
  showLabel = false,
}: {
  color: string;
  onChange: (color: string) => void;
  triangle?: "top-right" | "hide" | "top-left";
  label: string;
  showLabel?: boolean;
}) => {
  const id = useId();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="colorPicker">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(["colorPickerPreview", showLabel && "showLabel"])}
        style={{ background: color }}
      />
      <label
        htmlFor={id}
        className={clsx(["colorPickerLabel", !showLabel && "hiddenColorLabel"])}
      >
        {label}
      </label>
      {isOpen ? (
        <div className="twitterPicker">
          <TwitterPicker
            width="125"
            onChangeComplete={({ hex }) => onChange(hex)}
            triangle={triangle}
          />
        </div>
      ) : null}
    </div>
  );
};

const Sidebar = () => {
  const { State } = useChessBoardContext();
  const { Options, Actions } = useOptions();

  const getReason = () => {
    if (State.isGameOver) {
      if (State.isCheckmate) {
        return `Checkmate. ${State.turn === "w" ? "Black" : "White"} wins!`;
      } else if (State.isDraw) {
        return "Draw";
      } else if (State.isStalemate) {
        return "Stalemate";
      }
    }
    return null;
  };
  return (
    <div className="sidebar">
      <div className="information sidebarSection">
        <div className="turnDisplay">
          <KW className={clsx(["turnIcon", State.turn === "w" && "isTurn"])} />
          <KB className={clsx(["turnIcon", State.turn === "b" && "isTurn"])} />
        </div>
        <div className="stateDisplay">
          {State.isGameOver ? (
            <div className="gameOver">
              <div className="gameOverTitle">GameOver</div>
              <div className="gameOverReason">{getReason()}</div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="controls sidebarSection">
        <div className="sidebarSubSection">
          <div className="controlRow">
            <ColorPicker
              color={Options.primaryColor}
              onChange={Actions.setPrimaryColor}
              label="Edit primary color"
              triangle="top-left"
              showLabel={true}
            />
          </div>
          <div className="controlRow">
            <ColorPicker
              color={Options.secondaryColor}
              onChange={Actions.setSecondaryColor}
              label="Edit secondary color"
              triangle="top-left"
              showLabel={true}
            />
          </div>
          <div className="controlRow">
            <ColorPicker
              color={Options.accentColor}
              onChange={Actions.setAccentColor}
              label="Edit accent color"
              triangle="top-left"
              showLabel={true}
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
              triangle="top-right"
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
              triangle="top-right"
            />
          </div>
          <div className="controlRow">
            <div className="toggleRow">
              <Toggle
                on={Options.showAxisLabels}
                label="Show axis labels"
                handleChange={Actions.setShowAxisLabels}
              />
            </div>
          </div>
          <div className="controlRow">
            <div className="toggleRow">
              <Toggle
                on={Options.showSquareName}
                label="Show square names on hover"
                handleChange={Actions.setShowSquareName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
