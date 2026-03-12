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

  const flagCount = (): number => {
    return Object.values(cells).filter((cell) => cell.flagged).length;
  };

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

  const initCells = (click: Coordinates): Cells => {
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
  };

  const spreadReveal = (origin: Coordinates, currentCells: Cells): void => {
    for (const { x, y } of adjacentCoordinates(origin)) {
      const cellId: CellId = `${x},${y}`;
      const { hazardousness, revealed }: CellData = currentCells[cellId];

      if (revealed) continue;

      switch (hazardousness) {
        case 0:
          currentCells[cellId] = {
            ...currentCells[cellId],
            flagged: false,
            revealed: true,
          };
          spreadReveal({ x, y }, currentCells);
          break;

        case "💣":
          continue;

        default:
          currentCells[cellId] = {
            ...currentCells[cellId],
            flagged: false,
            revealed: true,
          };
          break;
      }
    }
  };

  const onCellLeftClick = ({ x, y }: Coordinates): void => {
    let currentCells: Cells = { ...cells };

    if (gameState === "idle") {
      currentCells = initCells({ x, y });
      setGameState("play");
    }

    const cellId: CellId = `${x},${y}`;
    const { hazardousness, flagged, revealed }: CellData = currentCells[cellId];

    if (flagged || revealed) return;

    currentCells[cellId] = {
      ...currentCells[cellId],
      revealed: true,
    };

    switch (hazardousness) {
      case 0:
        spreadReveal({ x, y }, currentCells);
        break;
      case "💣":
        setGameState("defeat");
        break;
    }

    setCells(currentCells);
  };

  const onCellRightClick = ({ x, y }: Coordinates): void => {
    const cellId: CellId = `${x},${y}`;
    const { revealed, flagged }: CellData = cells[cellId];

    if (revealed) return;

    if (!flagged) {
      if (flagCount() === settings.bombCount) return;
    }

    setCells((cells) => {
      const newCells: Cells = { ...cells };
      newCells[cellId] = {
        ...newCells[cellId],
        flagged: !flagged,
      };
      return newCells;
    });
  };

  return (
    <div>
      <Timer gameState={gameState} />
      <Field
        cells={cells}
        onCellLeftClick={onCellLeftClick}
        onCellRightClick={onCellRightClick}
      />
    </div>
  );
}

export default Game;
