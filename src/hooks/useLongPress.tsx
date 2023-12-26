import { useCallback, useRef, useState } from "react";

export const useLongPress = (
  onLongPress: () => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<number>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      if (shouldPreventDefault && event.target) {
        event.preventDefault();
      }
      target.current = event.target;
      timeout.current = window.setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      timeout.current && clearTimeout(timeout.current);
      shouldPreventDefault && event.preventDefault();
      setLongPressTriggered(false);
    },
    [shouldPreventDefault]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (longPressTriggered) {
        event.stopPropagation();
        return;
      }

      onClick();
    },
    [onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => start(e),
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => clear(e),
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => start(e),
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => clear(e),
    onTouchCancel: (e: React.TouchEvent<HTMLElement>) => clear(e),
    onClick: handleClick,
  };
};
