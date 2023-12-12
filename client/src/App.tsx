import { useState } from "react";
import "./App.scss";
import { ChessBoard } from "./chessBoard/ChessBoard";
import { useIsMobile } from "./hooks/useIsMobile";
import clsx from "clsx";

function App() {
  const isMobile = useIsMobile();
  const [room, setRoom] = useState("");
  const url = new URL(window.location.href);
  const inGame =
    url.pathname.includes("computer") || url.pathname.includes("room");
  return (
    <div className={clsx(["App", isMobile && "isMobile"])}>
      {inGame ? (
        <ChessBoard />
      ) : (
        <div>
          <div className="welcome">
            <h1>Welcome to Chess Check</h1>
            <div className="welcomeInputs">
              <div className="computerInputs">
                <a href="/computer">Play against a computer</a>
              </div>
              <div className="roomInputsOuter">
                <div>Join a room</div>
                <div className="roomInputs">
                  <input
                    name="room"
                    value={room}
                    onChange={(e) => {
                      setRoom(e.target.value);
                    }}
                    placeholder="Room ID"
                  />
                  <a href={`/room/${room}`}>Go!</a>
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
