export type Hazardousness = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "💣";

export interface Coordinates {
  x: number;
  y: number;
}

export type CellId = `${number},${number}`;

export interface CellData {
  coordinates: Coordinates;
  hazardousness: Hazardousness;
  flagged: boolean;
  revealed: boolean;
}

export type Cells = Record<CellId, CellData>;

export type GameState = "idle" | "playing" | "victory" | "defeat";

export type Difficulty = "easy" | "medium" | "hard";

export interface GameSettings {
  rowCount: number;
  columnCount: number;
  bombCount: number;
}
