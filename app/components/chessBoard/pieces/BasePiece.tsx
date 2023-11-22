"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { RW, NW, BW, KW, QW, PW, RB, NB, BB, QB, KB, PB } from "./svg";
import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";

const colorTypeMap: Record<PieceColor, Record<PieceType, any>> = {
  [PieceColor.White]: {
    [PieceType.Rook]: RW,
    [PieceType.Knight]: NW,
    [PieceType.Bishop]: BW,
    [PieceType.King]: KW,
    [PieceType.Queen]: QW,
    [PieceType.Pawn]: PW,
  },
  [PieceColor.Black]: {
    [PieceType.Rook]: RB,
    [PieceType.Knight]: NB,
    [PieceType.Bishop]: BB,
    [PieceType.King]: KB,
    [PieceType.Queen]: QB,
    [PieceType.Pawn]: PB,
  },
};

export const BasePiece = ({ color, type }: BasePieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const [square, setSquare] = useState<string | null>(null);

  useEffect(() => {
    if (pieceRef.current) {
      const squareDiv = pieceRef.current?.closest(".square");
      if (squareDiv && squareDiv.id) {
        setSquare(squareDiv.id);
      }
    }
  }, [pieceRef]);

  const piece = `${color}-${type}`;
  const { attributes, listeners, setNodeRef, transform, activatorEvent } =
    useDraggable({
      id: `${piece}-${square}`,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const Piece = colorTypeMap[color][type];

  return (
    <div
      className="piece"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div ref={pieceRef} id={piece}>
        <span>{square}</span>
        <Piece />
      </div>
    </div>
  );
};
