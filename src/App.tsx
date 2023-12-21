import React, { useState } from "react";
import "./App.scss";
import { ChessBoard } from "./chessBoard/ChessBoard";
import { useIsMobile } from "./hooks/useIsMobile";
import clsx from "clsx";
import { GameType, getGameType } from "./utils";

function App() {
  const isMobile = useIsMobile();
  const [level, setLevel] = useState(0);
  const type = getGameType();
  let inGame = Object.values(GameType).includes(type);
  return (
    <div className={clsx(["App", isMobile && "isMobile"])}>
      {inGame ? (
        <ChessBoard />
      ) : (
        <div>
          <div className="welcome">
            <h1>Welcome to Chess Layers</h1>
            <div className="welcomeInputs">
              <div className="trainerInputs">
                <div>Play with computer that always plays random moves</div>
                <br />
                <a href={`/trainer`}>Go!</a>
              </div>
              <div className="stockfishInputsOuter">
                <div>Challenge Stockfish</div>
                <div className="stockfishInputs">
                  <input
                    name="level"
                    onChange={(e) => {
                      setLevel(parseInt(e.target.value));
                    }}
                    placeholder="Stockfish Level (0 - 20)"
                  />
                  <a href={`/stockfish/${level}`}>Go!</a>
                </div>
              </div>
            </div>
          </div>
          <div className="loadingSpinner">
            <div />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
