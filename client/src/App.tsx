import "./App.scss";
import { ChessBoard } from "./chessBoard/ChessBoard";

function App() {
  console.log("render App");
  return (
    <div className="App">
      <ChessBoard />
    </div>
  );
}

export default App;
