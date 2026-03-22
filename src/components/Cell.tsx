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
  const content = () => {
    if (!revealed) return flagged ? "🚩" : ""; // Unrevealed: show flag or nothing
    return hazardousness || ""; // Revealed: show bomb emoji, digit (1–8), or empty string for 0
  };

  const styles = (): string => {
    const width: string =
      settings.columnCount === 16 ? "w-[6.25%]" : "w-[11.11%]"; // 100% / 16 ≈ 6.25%, 100% / 9 ≈ 11.11% — each cell fills exactly one column
    let styles: string = `${width} aspect-square cursor-pointer`; // Square cells regardless of grid size

    if (!revealed) return `${styles} border-4 border-outset bg-gray-200`; // Unrevealed: raised 3-D border effect

    styles += " border"; // Revealed: flat single border

    if (hazardousness === "💣") return `${styles} bg-red-500`; // Bomb cell: red background on reveal

    return `${styles} bg-gray-300`; // Safe revealed cell: flat gray
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
