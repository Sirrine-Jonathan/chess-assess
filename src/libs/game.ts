class Game {
  private chess;
  constructor(chess) {
    this.chess = chess;
  }

  squareMoves(square) {
    return this.chess.moves({ square, verbose: true });
  }

  update() {
    const board = this.chess.board();
    const conflict = {};
    board.flat().forEach((piece, index) => {
      const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][index % 8];
      const fileNum = ((index - (index % 8)) % 9) - 1;
      const file = fileNum < 0 ? 8 : fileNum;

      const name = `${rank}${file}`;

      conflict[name] = {
        white: this.chess.isAttacked(name, "w"),
        black: this.chess.isAttacked(name, "b"),
      };
    });
    const update = {
      ascii: this.chess.ascii(),
      board,
      conflict,
      moves: this.chess.moves({ verbose: true }),
      turn: this.chess.turn(),
      inCheck: this.chess.inCheck(),
      isDraw: this.chess.isDraw(),
      isCheckmate: this.chess.isCheckmate(),
      isInsufficientMaterial: this.chess.isInsufficientMaterial(),
      isGameOver: this.chess.isGameOver(),
      isStalemate: this.chess.isStalemate(),
      isThreefoldRepetition: this.chess.isThreefoldRepetition(),
      fen: this.chess.fen(),
      history: this.chess.history({ verbose: true }),
    };
    return update;
  }
}

export default Game;
