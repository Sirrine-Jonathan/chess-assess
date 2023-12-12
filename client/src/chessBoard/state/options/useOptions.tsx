import { useMemo, useContext } from "react";
import { OptionsContext, initialState } from "./context";
import { restoreOptions } from "./storage";

export const useOptions = () => {
  const { options, setOptions } = useContext(OptionsContext);

  const actions = useMemo(
    () => ({
      setShowSquareName: (showSquareName: boolean) => {
        setOptions({ ...options, showSquareName });
      },
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
      setPrimaryColor: (primaryColor: string) => {
        setOptions({ ...options, primaryColor });
      },
      setSecondaryColor: (secondaryColor: string) => {
        setOptions({ ...options, secondaryColor });
      },
      setDisputedLayerColor: (disputedLayerColor: string) => {
        setOptions({ ...options, disputedLayerColor });
      },
      flipBoard: (flipBoard: boolean) => {
        setOptions({ ...options, flipBoard });
      },
      resetOptions: () => {
        setOptions(initialState);
        restoreOptions();
      },
    }),
    [options, setOptions]
  );

  return { Options: options, Actions: actions };
};
