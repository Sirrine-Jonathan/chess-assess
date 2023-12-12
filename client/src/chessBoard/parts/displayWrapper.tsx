import { useRef, useEffect, type ReactNode } from "react";
import { useOptions } from "../state/options/useOptions";
import clsx from "clsx";
import { useIsMobile } from "../../hooks/useIsMobile";

export const DisplayWrapper = ({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) => {
  const { Options } = useOptions();
  const isMobile = useIsMobile();

  const displayWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayWrapperRef.current) {
      const styleString = Object.entries({
        "--primary-color": Options.primaryColor,
        "--secondary-color": Options.secondaryColor,
        "--accent-color": Options.accentColor,
        "--defense-color": Options.defenseLayerColor,
        "--enemy-defense-color": Options.enemyDefenseLayerColor,
        "--disputed-color": Options.disputedLayerColor,
      }).reduce((acc: string, [key, val]: string[]) => {
        return acc + `${key}: ${val};`;
      }, "");
      displayWrapperRef.current.setAttribute("style", styleString);
    }
  }, [displayWrapperRef, Options]);

  return loading ? (
    <div className="loadingSpinner animate">
      <div />
    </div>
  ) : (
    <div
      ref={displayWrapperRef}
      className={clsx([
        "displayWrapper",
        !loading && "loading",
        isMobile && "isMobile",
      ])}
    >
      {children}
    </div>
  );
};
