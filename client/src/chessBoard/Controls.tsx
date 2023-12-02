import { useOptions } from "./optionsContext";
import clsx from "clsx";
import { useState, useId } from "react";
import { TwitterPicker } from "react-color";
import { Switch } from "@headlessui/react";

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

export const ColorPicker = ({
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
        title={label}
      />
      <label
        htmlFor={id}
        className={clsx(["colorPickerLabel", !showLabel && "hiddenColorLabel"])}
      >
        {label}
      </label>
      {isOpen ? (
        <div
          className="twitterPicker"
          style={{
            ...(triangle === "top-right"
              ? { right: "-10px" }
              : { left: "-1px" }),
          }}
        >
          <TwitterPicker
            width="125"
            onChangeComplete={({ hex }) => onChange(hex)}
            triangle={triangle}
            colors={[
              "#FF6900",
              "#FCB900",
              "#7BDCB5",
              "#00D084",
              "#8ED1FC",
              "#0693E3",
              "#ABB8C3",
              "#EB144C",
              "#F78DA7",
              "#9900EF",
              "#EFEFEF",
            ]}
          />
        </div>
      ) : null}
    </div>
  );
};

const Controls = () => {
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
          {/* <div className="controlRow">
            <div className="toggleRow">
              <Toggle
                on={Options.showAxisLabels}
                label="Show axis labels"
                handleChange={Actions.setShowAxisLabels}
              />
            </div>
          </div> */}
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
    </>
  );
};

export default Controls;
