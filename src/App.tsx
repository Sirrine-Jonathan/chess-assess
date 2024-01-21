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
  "Sicilian Defense": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  "French Defense": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  "Scandinavian Defense": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPP2PPP/R1BQKBNR w KQkq - 0 3",
  "Philidor's Defense": "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N1P/PPPP1PP1/RNBQKB1R b KQkq - 0 3",
  "Italian Game": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  "Van't Kruijs Opening": "rnbqkb1r/pppppppp/5n2/8/6P1/4P3/PPPP1P1P/RNBQKBNR b KQkq g3 0 2",
  "English Opening": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
  "Spanish Game": "",
  "Caro Kann Defense": "",
  "Owen Defense": "",
  "Robatsch (Modern) Defense": "",
  "Bishop's Opening": "",
  "Hungarian Opening": "",
  "Queen's Gambit Declined": "",
  "Scotch Game": "",
  "Horwitz Defense": "",
  "Zukertort Opening": "",
  "Pirc Defense": "",
  "Nimzowitsch Defense": "",
  "King's Gambit Accepted": "",
  "Ruy Lopez": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  "Scotch Opening": "",
  "Queen's Indian Defense": "",
  "Nimzo-Indian Defense": "",
  "Alekhine's Defense": "",
  "Dutch Defense": "",
  "Modern Defense": "",
  "Benoni Defense": "",
  "Sicilian Dragon": "",
  "Catalan Opening": "",
  "Grünfeld Defense": "",
  "Sicilian Najdorf": "",
  "Evans Gambit": "",
  "Gruenfeld Exchange": "",
  "Slav Defense": "",
  "Trompowsky Attack": "",
  "Colle System": "",
  "Bird's Opening": "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1",
  "Elephant Gambit": "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq d6 0 3",
  "King's Indian Attack": "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2",
  "London System": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3"
};

const openingNames = Object.keys(openings);
const findDuplicates = (arr: string[]) => {
  let sorted_arr = arr.slice().sort();
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}
console.log('dulpicates', findDuplicates(openingNames))

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
                <div>Play against a bot that uses a min max algorithm with beta pruning</div>
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
            {Object.entries(openings).filter(([key, val]) => Boolean(val)).map(([key, val]) => {
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
          <footer>
            <div>
              <a href="https://github.com/Sirrine-Jonathan/chess-layers">Made</a> by <a href="http://www.jonathansirrine.com">Jonathan Sirrine</a></div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
