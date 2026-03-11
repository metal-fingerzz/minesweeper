import { useState } from "react";
import type {
  CellData,
  CellId,
  Cells,
  Coordinates,
  GameSettings,
  GameState,
  Hazardousness,
} from "../types";
import Field from "./Field";
import Timer from "./Timer";

interface GameProperties {
  settings: GameSettings;
}

function Game({ settings }: GameProperties) {
  const [gameState, setGameState] = useState<GameState>("idle");

  const emptyCells = (): Cells => {
    const cells: Cells = {};

    for (let y = 0; y < settings.rowCount; y++) {
      for (let x = 0; x < settings.columnCount; x++) {
        cells[`${x},${y}`] = {
          coordinates: { x, y },
          hazardousness: 0,
          flagged: false,
          revealed: false,
        };
      }
    }

    return cells;
  };

  const [cells, setCells] = useState<Cells>(emptyCells());

  const bombIds = (click: Coordinates): CellId[] => {
    const clickId: CellId = `${click.x},${click.y}`;
    const cellIds = Object.keys(cells) as CellId[];
    const bombIds: CellId[] = [];

    while (bombIds.length < settings.bombCount) {
      const i: number = Math.floor(Math.random() * cellIds.length);
      const cellId: CellId = cellIds[i];
      if (cellId === clickId || bombIds.includes(cellId)) continue;
      bombIds.push(cellId);
    }

    return bombIds;
  };

  const adjacentCoordinates = (center: Coordinates): Coordinates[] => {
    const { x, y } = center;
    const adjacentCoordinates: Coordinates[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const abscissa: number = x + dx;
        if (abscissa < 0 || abscissa > settings.columnCount - 1) continue;

        const ordinate: number = y + dy;
        if (ordinate < 0 || ordinate > settings.rowCount - 1) continue;

        adjacentCoordinates.push({ x: abscissa, y: ordinate });
      }
    }

    return adjacentCoordinates;
  };

  const initCells = (click: Coordinates): void => {
    setCells((cells) => {
      const newCells: Cells = { ...cells };

      for (const bombId of bombIds(click)) {
        newCells[bombId] = {
          ...newCells[bombId],
          hazardousness: "💣",
        };

        const [x, y] = bombId.split(",").map((value) => Number(value)) as [
          number,
          number,
        ];

        for (const coordinates of adjacentCoordinates({ x, y })) {
          const cellId: CellId = `${coordinates.x},${coordinates.y}`;
          const { hazardousness }: CellData = newCells[cellId];
          if (hazardousness === "💣") continue;
          newCells[cellId] = {
            ...newCells[cellId],
            hazardousness: (hazardousness + 1) as Hazardousness,
          };
        }
      }

      return newCells;
    });
  };

  const spreadReveal = (origin: Coordinates, toBeRevealed: CellId[]): void => {
    for (const { x, y } of adjacentCoordinates(origin)) {
      const cellId: CellId = `${x},${y}`;
      if (toBeRevealed.includes(cellId)) continue;
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

  const onCellLeftClick = ({ x, y }: Coordinates): void => {
    if (gameState === "idle") {
      initCells({ x, y });
      setGameState("play");
    }

    const cellId: CellId = `${x},${y}`;
    const { hazardousness, flagged, revealed }: CellData = cells[cellId];

    if (flagged || revealed) return;

    const toBeRevealed: CellId[] = [cellId];

    switch (hazardousness) {
      case 0:
        spreadReveal({ x, y }, toBeRevealed);
        break;
      case "💣":
        setGameState("defeat");
        break;
    }

    setCells((cells) => {
      const newCells: Cells = { ...cells };

      for (const cellId of toBeRevealed) {
        newCells[cellId] = {
          ...newCells[cellId],
          flagged: false,
          revealed: true,
        };
      }

      return newCells;
    });
  };

  return (
    <div>
      <Timer gameState={gameState} />
      <Field
        cells={cells}
        onCellLeftClick={onCellLeftClick}
        onCellRightClick={() => {}}
      />
    </div>
  );
}

export default Game;
