import type { ReactNode } from "react";
import type { Options } from "./chessTypes";
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
} from "react";

const initialState = {
  showSquareName: true,
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

const key = "chess_assess_options";

const storeOptions = (options: Options) => {
  console.log("storing options", options);
  window.localStorage.setItem(key, JSON.stringify(options));
};

const loadOptions = (): Partial<Options> => {
  console.log("loading options");
  return JSON.parse(window.localStorage.getItem(key) || "{}");
};

export const OptionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const loadedOptions = loadOptions();
  const [options, setOptions] = useState<Options>({
    ...initialState,
    ...loadedOptions,
  });
  const timeoutHandleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const _setOptions = useCallback(
    (options: Options) => {
      if (timeoutHandleRef.current) {
        clearTimeout(timeoutHandleRef.current);
      }
      timeoutHandleRef.current = setTimeout(() => {
        storeOptions(options);
      }, 5000);
      setOptions(options);
    },
    [setOptions, timeoutHandleRef]
  );

  const contextValue = useMemo(
    () => ({
      options,
      setOptions: _setOptions,
    }),
    [options, _setOptions]
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
