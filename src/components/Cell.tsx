import type { Coordinates, GameSettings, Hazardousness } from "../types";

interface CellProperties {
  coordinates: Coordinates;
  flagged: boolean;
  hazardousness: Hazardousness;
  playable: boolean;
  revealed: boolean;
  settings: GameSettings;
  onLeftClick: (coordinates: Coordinates) => void;
  onRightClick: (coordinates: Coordinates) => void;
}

function Cell({
  coordinates,
  flagged,
  hazardousness,
  playable,
  revealed,
  settings,
  onLeftClick,
  onRightClick,
}: CellProperties) {
  // Classic Windows number colors (1–8)
  const numberColors: Partial<Record<Hazardousness, string>> = {
    1: "#0000FF",
    2: "#008000",
    3: "#FF0000",
    4: "#000080",
    5: "#800000",
    6: "#008080",
    7: "#000000",
    8: "#808080",
  };

  const content = () => {
    if (!revealed) return flagged ? "🚩" : ""; // Unrevealed: show flag or nothing
    if (!hazardousness) return ""; // 0 → empty cell, nothing to display
    if (hazardousness === "💣") return "💣";
    return (
      <span style={{ color: numberColors[hazardousness] }}>
        {hazardousness}
      </span>
    ); // Digit colored per Windows convention
  };

  const styles = (): string => {
    const width: string =
      settings.columnCount === 16 ? "w-[6.25%]" : "w-[11.11%]"; // 100% / 16 ≈ 6.25%, 100% / 9 ≈ 11.11% — each cell fills exactly one column
    const base: string = `${width} aspect-square cursor-pointer flex items-center justify-center font-bold`; // Square cells regardless of grid size; flex centers content on both axes

    if (!revealed) return `${base} cell-raised bg-win-silver`; // Unrevealed: raised 3-D border effect (white top/left, black bottom/right)

    if (hazardousness === "💣") return `${base} cell-flat bg-win-red`; // Bomb cell: red background on reveal — bg-win-silver absent to avoid conflict

    return `${base} cell-flat bg-win-silver`; // Safe revealed cell: flat border, silver background
  };

  const onClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault(); // Prevent any default browser behavior on div click
    if (!playable) return; // Ignore clicks while a state update is in progress
    onLeftClick(coordinates);
  };

  const onContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault(); // Suppress the browser's native right-click context menu
    if (!playable) return; // Ignore right-clicks while a state update is in progress
    onRightClick(coordinates);
  };

  return (
    <div className={styles()} onClick={onClick} onContextMenu={onContextMenu}>
      {content()}
    </div>
  );
}

export default Cell;
