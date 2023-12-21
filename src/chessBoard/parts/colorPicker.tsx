import React, {
  useState,
  useEffect,
  useRef,
  useId,
  MouseEventHandler,
} from "react";
import Colorful from "@uiw/react-color-colorful";
import clsx from "clsx";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  showLabel?: boolean;
  direction: "left" | "right" | "center";
}

export const ColorPicker = ({
  color,
  onChange,
  label,
  direction,
  showLabel = false,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!pickerRef.current) {
        return;
      }

      if (!pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div ref={pickerRef} className="colorPicker">
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
      <div
        className={clsx(["colorFullWrapper", direction, isOpen && "visible"])}
      >
        <Colorful
          color={color || "#efefefaa"}
          onChange={({ hexa }) => onChange(hexa)}
        />
      </div>
    </div>
  );
};
