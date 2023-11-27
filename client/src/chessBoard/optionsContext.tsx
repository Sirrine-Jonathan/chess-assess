import type { ReactNode } from "react";
import type { Options } from "./chessTypes";
import { createContext, useState, useMemo, useContext } from "react";

const initialState = {
  showAxisLabels: true,
  showDefenseLayer: true,
  showEnemyDefenseLayer: true,
  defenseLayerColor: "#000000",
  enemyDefenseLayerColor: "#ffc20a",
  disputedTerritoryLayerColor: "#3e2f5b",
  primaryColor: "#d65757",
  secondaryColor: "#FFFFFF",
  accentColor: "#22194D",
};

const OptionsContext = createContext<{
  options: Options;
  setOptions: (options: Options) => void;
}>({
  options: initialState,
  setOptions: (options: Options) => null,
});

export const OptionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [options, setOptions] = useState<Options>(initialState);

  const contextValue = useMemo(
    () => ({ options, setOptions }),
    [options, setOptions]
  );

  return (
    <OptionsContext.Provider value={contextValue}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const { options, setOptions } = useContext(OptionsContext);

  const actions = useMemo(
    () => ({
      setShowAxisLabels: (showAxisLabels: boolean) =>
        setOptions({ ...options, showAxisLabels }),
      setShowDefenseLayer: (showDefenseLayer: boolean) => {
        setOptions({ ...options, showDefenseLayer });
      },
      setShowEnemyDefenseLayer: (showEnemyDefenseLayer: boolean) => {
        setOptions({ ...options, showEnemyDefenseLayer });
      },
      setDefenseLayerColor: (defenseLayerColor: string) => {
        setOptions({ ...options, defenseLayerColor });
      },
      setEnemyDefenseLayerColor: (enemyDefenseLayerColor: string) => {
        setOptions({ ...options, enemyDefenseLayerColor });
      },
      setDisputedTerritoryLayerColor: (disputedTerritoryLayerColor: string) => {
        setOptions({ ...options, disputedTerritoryLayerColor });
      },
      setPrimaryColor: (primaryColor: string) => {
        setOptions({ ...options, primaryColor });
      },
      setSecondaryColor: (secondaryColor: string) => {
        setOptions({ ...options, secondaryColor });
      },
      setAccentColor: (accentColor: string) => {
        setOptions({ ...options, accentColor });
      },
    }),
    [options, setOptions]
  );

  return { Options: options, Actions: actions };
};
