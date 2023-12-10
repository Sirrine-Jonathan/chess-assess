import type { ReactNode } from "react";
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
} from "react";

const initialState = {
  flipBoard: false,
  showSquareName: true,
  showAxisLabels: false,
  showDefenseLayer: true,
  showEnemyDefenseLayer: true,
  defenseLayerColor: "#0000FF",
  enemyDefenseLayerColor: "#FF0000",
  disputedLayerColor: "#4B006E",
  primaryColor: "#707070",
  secondaryColor: "#FFFFFF",
  accentColor: "orange",
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
  window.localStorage.setItem(key, JSON.stringify(options));
};

const loadOptions = (): Partial<Options> => {
  const options = JSON.parse(window.localStorage.getItem(key) || "{}");
  return { ...options, showAxisLabels: false };
};

export const restoreOptions = () => {
  window.localStorage.clear();
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
      }, 1000);
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
      setPrimaryColor: (primaryColor: string) => {
        setOptions({ ...options, primaryColor });
      },
      setSecondaryColor: (secondaryColor: string) => {
        setOptions({ ...options, secondaryColor });
      },
      setAccentColor: (accentColor: string) => {
        setOptions({ ...options, accentColor });
      },
      flipBoard: (flipBoard: boolean) => {
        setOptions({ ...options, flipBoard });
      },
    }),
    [options, setOptions]
  );

  return { Options: options, Actions: actions };
};
