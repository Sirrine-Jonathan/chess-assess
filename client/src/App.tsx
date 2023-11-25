import { useState } from "react";
import "./App.scss";
import { ChessBoard } from "./chessBoard/ChessBoard";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectionChange = (isConnected: boolean) => {
    setIsConnected(isConnected);
  };

  return (
    <div className="App">
      <div id="chessBoardWrapper">
        <ChessBoard onConnectionChange={handleConnectionChange} />
      </div>
    </div>
  );
}

export default App;
