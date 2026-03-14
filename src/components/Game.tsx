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
  const [playable, setPlayable] = useState<boolean>(true);

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

  const isVictory = (cells: Cells): boolean => {
    return (
      Object.values(cells).filter((cell) => !cell.revealed).length ===
      settings.bombCount
    );
  };

  const spreadReveal = (origin: Coordinates, cells: Cells): void => {
    for (const { x, y } of adjacentCoordinates(origin)) {
      const cellId: CellId = `${x},${y}`;
      const { hazardousness, revealed }: CellData = cells[cellId];

      if (revealed) continue;

      switch (hazardousness) {
        case 0:
          cells[cellId] = {
            ...cells[cellId],
            flagged: false,
            revealed: true,
          };
          spreadReveal({ x, y }, cells);
          break;

        case "💣":
          continue;

        default:
          cells[cellId] = {
            ...cells[cellId],
            flagged: false,
            revealed: true,
          };
          break;
      }
    }
  };

  const onCellLeftClick = ({ x, y }: Coordinates): void => {
    setPlayable(false);
    let newCells: Cells;

    if (gameState === "idle") {
      newCells = initCells({ x, y });
      setGameState("playing");
    } else newCells = { ...cells };

    const cellId: CellId = `${x},${y}`;
    const { hazardousness, flagged, revealed }: CellData = newCells[cellId];

    if (flagged || revealed) return;

    newCells[cellId] = {
      ...newCells[cellId],
      revealed: true,
    };

    switch (hazardousness) {
      case 0:
        spreadReveal({ x, y }, newCells);
        break;
      case "💣":
        setCells(newCells);
        setGameState("defeat");
        return;
    }

    if (isVictory(newCells)) {
      setCells(newCells);
      setGameState("victory");
      return;
    }

    setCells(newCells);
    setPlayable(true);
  };

  const onCellRightClick = ({ x, y }: Coordinates): void => {
    setPlayable(false);
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
    setPlayable(true);
  };

  return (
    <div>
      <Timer gameState={gameState} />
      <Field
        cells={cells}
        playable={playable}
        onCellLeftClick={onCellLeftClick}
        onCellRightClick={onCellRightClick}
      />
    </div>
  );
}

export default Game;
