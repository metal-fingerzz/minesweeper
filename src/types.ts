export type Hazardousness = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "💣"; // 0 = empty, 1–8 = adjacent bomb count, "💣" = bomb

export interface Coordinates {
  x: number; // Column index (0-based, left to right)
  y: number; // Row index (0-based, top to bottom)
}

export type CellId = `${number},${number}`; // Composite key used as dictionary index, e.g. "3,7"

export interface CellData {
  coordinates: Coordinates; // Position of the cell on the grid
  hazardousness: Hazardousness; // Content of the cell (unknown until initCells is called on first click)
  flagged: boolean; // Whether the player has placed a flag on this cell
  revealed: boolean; // Whether this cell has been uncovered
}

export type Cells = Record<CellId, CellData>; // Flat dictionary of all cells, keyed by CellId

export type GameState = "idle" | "playing" | "victory" | "defeat"; // Lifecycle of a game round

export type Difficulty = "easy" | "medium" | "hard"; // Preset difficulty levels

export interface GameSettings {
  rowCount: number; // Number of rows in the grid
  columnCount: number; // Number of columns in the grid
  bombCount: number; // Total number of bombs to place
}
