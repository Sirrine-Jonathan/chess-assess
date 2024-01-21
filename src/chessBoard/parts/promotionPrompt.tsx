import { Square, Color } from "chess.js";
import { QW, QB, NW, NB, RW, RB, BW, BB } from "../pieces/svg";
import { useGame } from "../state/game/useGame";
import clsx from 'clsx'
import { useSelection } from "../state/selection/useSelection";

export const PromotionPrompt = () => {
  const { gameState, Actions } = useGame();
  const { selectionActions } = useSelection();

  const pendingMove = gameState.promotion;

  if (pendingMove === null) {
    return null;
  }

  const doPromotion = (to: "n" | "b" | "r" | "q") => {
    if (pendingMove) {
      const promotionMove: {
        to: Square;
        from: Square;
        promotion: "n" | "b" | "r" | "q";
      } = {
        ...pendingMove,
        promotion: to
      }
      const captured = Actions.move(promotionMove);
      if (captured) {
        Actions.setColorCaptured({
          color: captured.color as Color,
          piece: captured.piece,
          type: captured.type as CaptureEvent["type"],
        });
      }
      Actions.performUpdate();
      Actions.setLastMove(promotionMove);
      selectionActions.setActivePiece(null);
    }
  }

  return (
    <div className={'promotionPrompt'}>
      <div className="promotionPromptInner">
        <button className="promotionOption" type="button" onClick={() => doPromotion('q')}>
          <span key="top" className="layer topLayer" />
          <span key="right" className="layer rightLayer" />
          <span key="bottom" className="layer bottomLayer" />
          <span key="left" className="layer leftLayer" />
          {gameState.turn === 'w' ? <QW /> : <QB />}
        </button>
        <button className="promotionOption" type="button" onClick={() => doPromotion('n')}>
          <span key="top" className="layer topLayer" />
          <span key="right" className="layer rightLayer" />
          <span key="bottom" className="layer bottomLayer" />
          <span key="left" className="layer leftLayer" />
          {gameState.turn === 'w' ? <NW /> : <NB />}
        </button>
        <button className="promotionOption" type="button" onClick={() => doPromotion('r')}>
          <span key="top" className="layer topLayer" />
          <span key="right" className="layer rightLayer" />
          <span key="bottom" className="layer bottomLayer" />
          <span key="left" className="layer leftLayer" />
          {gameState.turn === 'w' ? <RW /> : <RB />}
        </button>
        <button className="promotionOption" type="button" onClick={() => doPromotion('b')}>
          <span key="top" className="layer topLayer" />
          <span key="right" className="layer rightLayer" />
          <span key="bottom" className="layer bottomLayer" />
          <span key="left" className="layer leftLayer" />
          {gameState.turn === 'w' ? <BW /> : <BB />}
        </button>
      </div>
    </div>
  )
}