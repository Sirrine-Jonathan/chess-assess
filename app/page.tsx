import React from "react";
import { ChessBoard } from "./components/chessBoard/ChessBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ChessBoard />
    </main>
  );
}
