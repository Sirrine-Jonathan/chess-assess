const ResetButton = () => {
  return (
    <button
      type="button"
      className="resetButton"
      onClick={() => {
        window.location.href = window.origin;
      }}
    >
      New Game
    </button>
  );
};

export default ResetButton;
