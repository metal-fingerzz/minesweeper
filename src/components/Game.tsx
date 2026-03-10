import { useState } from "react";
import type { CellData, CellId, Cells, Coordinates } from "../types";
import Field from "./Field";
import Timer from "./Timer";

type GameState = "idle" | "play" | "pause" | "victory" | "defeat";

function Game() {
  const [state, setState] = useState<GameState>("idle");
  const [counter] = useState<number>(0);
  const [cells, setCells] = useState<Cells>({});

  const adjacentCoordinates = (center: Coordinates): Coordinates[] => {
    const { x, y } = center;
    const adjacentCoordinates: Coordinates[] = [];

    for (let dx = -1; dx++; dx <= 1) {
      for (let dy = -1; dy++; dy <= 1) {
        if (dx === 0 && dy === 0) continue;
        const abscissa: number = x + dx;
        const ordinate: number = y + dy;
        adjacentCoordinates.push({ x: abscissa, y: ordinate });
      }
    }

    return adjacentCoordinates;
  };

  const spreadReveal = (origin: Coordinates, toBeRevealed: CellId[]): void => {
    for (const { x, y } of adjacentCoordinates(origin)) {
      const cellId: CellId = `${x},${y}`;
      const { hazardousness }: CellData = cells[cellId];

      switch (hazardousness) {
        case 0:
          toBeRevealed.push(cellId);
          spreadReveal({ x, y }, toBeRevealed);
          break;
        case "💣":
          continue;
        default:
          toBeRevealed.push(cellId);
          break;
      }
    }
  };

  return (
    <div>
      <Timer counter={counter} />
      <Field
        cells={cells}
        onCellLeftClick={({ x, y }) => {
          if (state === "idle") setState("play");

          const cellId: CellId = `${x},${y}`;
          const { hazardousness, flagged, revealed }: CellData = cells[cellId];

          if (flagged || revealed) return;

          const toBeRevealed: CellId[] = [cellId];

          switch (hazardousness) {
            case 0:
              spreadReveal({ x, y }, toBeRevealed);
              break;
            case "💣":
              setState("defeat");
              break;
          }

          setCells((cells) => {
            for (const cellId of toBeRevealed) {
              cells[cellId] = {
                ...cells[cellId],
                flagged: false,
                revealed: true,
              };
            }
            return cells;
          });
        }}
        onCellRightClick={() => {}}
      />
    </div>
  );
}

export default Game;
