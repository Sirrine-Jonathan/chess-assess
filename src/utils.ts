import { validateFen, DEFAULT_POSITION, type Color } from "chess.js";

export enum GameType {
  Trainer = "TRAINER", // /trainer/color/fen
  Stockfish = "STOCKFISH", // /stockfish/level/color/fen
}

const urlToType: Record<string, GameType> = {
  trainer: GameType.Trainer,
  stockfish: GameType.Stockfish,
};

const typeToUrl: Record<GameType, keyof typeof urlToType> = {
  [GameType.Trainer]: "trainer",
  [GameType.Stockfish]: "stockfish",
};

export const getPathParts = (): string[] => {
  const url = new URL(window.location.href);
  return url.pathname.split("/");
};

export const getGameType = (): GameType => {
  const split = getPathParts();
  const type = split?.[1];
  return urlToType[type];
};

export const getLevel = (): number => {
  const type = getGameType();
  if (type !== GameType.Stockfish) {
    return 0;
  } else {
    const split = getPathParts();
    return parseInt(split[2]);
  }
};

export const getColor = (): Color => {
  const type = getGameType();
  const split = getPathParts();
  return split[type === GameType.Stockfish ? 3 : 2] as Color;
};

export const getFen = (): string => {
  const type = getGameType();
  const split = getPathParts();
  const rawFen = split[type === GameType.Stockfish ? 4 : 3];
  console.log("rawFen", rawFen);
  return rawFen ? decodeURIComponent(rawFen) : DEFAULT_POSITION;
};

export const writeFen = (fen: string) => {
  const type = getGameType();
  const pathParts = [window.location.origin, typeToUrl[type]];
  if (type === GameType.Stockfish) {
    pathParts.push(String(getLevel()));
  }
  pathParts.push(String(getColor()));
  const fenPart = encodeURIComponent(fen);
  pathParts.push(fenPart);

  window.history.replaceState(null, "", pathParts.join("/"));
  return true;
};

export const writeLevel = (level: number) => {
  const type = getGameType();
  if (type !== GameType.Stockfish) {
    return false;
  } else {
    const pathParts = [window.location.origin, typeToUrl[type]];
    pathParts.push(String(level));
    pathParts.push(String(getColor()));
    pathParts.push(encodeURIComponent(getFen()));

    window.history.replaceState(null, "", pathParts.join("/"));
    return true;
  }
};

export const writeColor = (color: Color) => {
  const type = getGameType();
  const pathParts = [window.location.origin, typeToUrl[type]];
  if (type === GameType.Stockfish) {
    pathParts.push(String(getLevel()));
  }
  pathParts.push(color);
  pathParts.push(encodeURIComponent(getFen()));

  window.history.replaceState(null, "", pathParts.join("/"));
  return true;
};

const isValidLevel = (level: number) => {
  const validLevels = Array.from(Array(20).keys());
  return validLevels.includes(level);
};

const isValidColor = (color: Color) => {
  const validColors = ["w", "b"];
  return validColors.includes(color);
};

export const initType = () => {
  const type = getGameType();
  if (type === GameType.Stockfish) {
    const level = getLevel();
    const validLevel = isValidLevel(level) ? level : 0;
    writeLevel(level);
  }
  if (type === GameType.Stockfish || type === GameType.Trainer) {
    const color = getColor();
    const validColor = isValidColor(color)
      ? color
      : Math.random() > 0.5
      ? "w"
      : "b";
    writeColor(validColor);

    const fen = getFen();
    const validFen = fen && validateFen(fen) ? fen : DEFAULT_POSITION;
    writeFen(validFen);
  }
};
