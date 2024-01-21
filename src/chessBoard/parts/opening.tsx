import { useGame } from "../state/game/useGame";

export const Opening = () => {
  const { gameState } = useGame();
  return (
    <div className="opening">{gameState.opening}</div>
  )
}