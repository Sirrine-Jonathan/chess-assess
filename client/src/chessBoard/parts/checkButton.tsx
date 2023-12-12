import clsx from "clsx";

const CheckButton = ({
  onClick,
  label,
  dark = true,
  classes = "",
}: {
  onClick: () => void;
  label: string;
  dark?: boolean;
  classes?: string;
}) => {
  return (
    <button
      type="button"
      className={clsx(["checkButton", dark, classes])}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CheckButton;
