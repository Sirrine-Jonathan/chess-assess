import React, { useState, useEffect } from "react";
import "./App.scss";
import { ChessBoard } from "./chessBoard/ChessBoard";
import { useIsMobile } from "./hooks/useIsMobile";
import clsx from "clsx";
import { GameType, getGameType } from "./utils";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Bot } from "./chessBoard/state/game/bot";

const DEFAULT_LEVEL = 3;

let isBotOk = false;
export const ChessLayersBot = new Bot(-1);

// prettier-ignore
const openings = {
  "Ruy Lopez":                 "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/8/PPPP1PPP/R1BQK1NR b KQkq - 0 4",
  "French Defense":            "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
  "Scotch Game":               "r1bqkbnr/pppp1ppp/2n5/3Np3/8/8/PPPP1PPP/R1BQKB1R b KQkq - 0 4",
  "Queen's Indian Defense":    "rnbqkbnr/pp2pppp/2p5/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
  "Nimzo-Indian Defense":      "rnbqkbnr/pp2pppp/2p5/3p4/3P4/8/PPPN1PPP/R1BQKBNR b KQkq - 0 4",
  "Alekhine's Defense":        "rnbqkbnr/pppp1ppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Dutch Defense":             "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "King's Gambit Accepted":    "rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPP2PPP/R1BQKBNR b KQkq - 0 3",
  "Modern Defense":            "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PP1P1PPP/RNBQKBNR b KQkq - 0 3",
  "Benoni Defense":            "rnbqkbnr/pppppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Sicilian Dragon":           "rnbqkbnr/pp1ppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Catalan Opening":           "rnbqkbnr/pp1ppppp/8/3P4/8/8/PPP2PPP/R1BQKBNR b KQkq - 0 3",
  "Grünfeld Defense":          "rnbqkbnr/pp1ppppp/8/3p4/3P4/8/PPP1QPPP/R1B1KBNR b KQkq - 0 3",
  "Sicilian Najdorf":          "rnbqkbnr/pp1ppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Evans Gambit":              "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/R1BQKBNR b KQkq - 0 3",
  "Gruenfeld Exchange":        "rnbqkbnr/pp2pppp/2p5/3p4/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 4",
  "Slav Defense":              "rnbqkbnr/pp2pppp/2p5/3p4/3P4/8/PPPN1PPP/R1BQKBNR b KQkq - 0 4",
  "Trompowsky Attack":         "rnbqkbnr/pppppppp/8/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq - 0 3",
  "Colle System":              "rnbqkbnr/pppppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Bird Opening":              "rnbqkbnr/pppppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
  "Scandinavian Defense":      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPP2PPP/R1BQKBNR w KQkq - 0 3",
  "Elephant Gambit":           "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/R1BQKBNR b KQkq - 0 3",
  "King's Indian Attack":      "rnbqkbnr/pppppppp/8/8/3P4/8/PPP2PPP/RNBQKBNR",
};

function App() {
  const isMobile = useIsMobile();
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [isBotOk, setIsBotOk] = useState(false);
  const type = getGameType();
  let inGame = Object.values(GameType).includes(type);

  useEffect(() => {
    if (isBotOk) {
      return;
    }
    ChessLayersBot.checkStockfish()
      .then(() => {
        setIsBotOk(true);
      })
      .catch(() => {
        setIsBotOk(false);
      });
  }, [isBotOk]);

  return (
    <div className={clsx(["App", isMobile && "isMobile"])}>
      {inGame ? (
        <ChessBoard />
      ) : (
        <div>
          <div className="welcome">
            <h1>Chess Layers</h1>
            <div className="welcomeInputs">
              <div className="trainerInputs">
                <div>Play with computer that always plays random moves</div>
                <div className="trainerButtons">
                  <a href={`/trainer/w`}>White</a>
                  <a href="/trainer/b">Black</a>
                  <a href="/trainer/random">Random</a>
                </div>
              </div>
              {isBotOk ? (
                <div className="stockfishInputsOuter">
                  <div>Challenge Stockfish: Level {level}</div>
                  <div className="stockfishInputs">
                    <Slider
                      min={0}
                      max={20}
                      defaultValue={DEFAULT_LEVEL}
                      onChange={(val) =>
                        setLevel(Array.isArray(val) ? val[0] : val)
                      }
                      styles={{
                        handle: {
                          backgroundColor: "#004777",
                          outline: "none",
                          border: "solid 2px #0065a9",
                        },
                        rail: { backgroundColor: "#ffffff" },
                        track: { backgroundColor: "#D65757" },
                      }}
                      dotStyle={{
                        borderColor: "#D65757",
                        color: "#D65757",
                        borderWidth: 1,
                      }}
                      activeDotStyle={{
                        borderColor: "#D65757",
                        color: "#ffffff",
                        borderWidth: 1,
                      }}
                    />
                  </div>
                  <div className="stockfishButtons">
                    <a href={`/stockfish/${level}/w`}>White</a>
                    <a href={`/stockfish/${level}/b`}>Black</a>
                    <a href={`/stockfish/${level}`}>Random</a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="openings">
            <h2>Openings</h2>
            {Object.entries(openings).map(([key, val]) => {
              return (
                <div className="openingsRow">
                  <div className="openingName">{key}</div>
                  <a href={`/trainer/w/${encodeURIComponent(val)}`}>White</a>
                  <a href={`/trainer/b/${encodeURIComponent(val)}`}>Black</a>
                </div>
              );
            })}
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
