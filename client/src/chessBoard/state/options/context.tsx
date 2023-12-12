import { createContext } from "react";

export const initialState = {
  flipBoard: false,
  showSquareName: true,
  showAxisLabels: false,
  showDefenseLayer: true,
  showEnemyDefenseLayer: true,
  defenseLayerColor: "#E3B03B",
  enemyDefenseLayerColor: "#004777",
  disputedLayerColor: "#96B0A8",
  primaryColor: "#D65757",
  secondaryColor: "#FFFFFF",
  accentColor: "#333333",
};

export const OptionsContext = createContext<{
  options: Options;
  setOptions: (options: Options) => void;
}>({
  options: initialState,
  setOptions: (options: Options) => null,
});
