import type { Coordinates, Hazardousness } from "../types";

interface CellProperties {
  coordinates: Coordinates;
  flagged: boolean;
  hazardousness: Hazardousness;
  playable: boolean;
  revealed: boolean;
  onLeftClick: (coordinates: Coordinates) => void;
  onRightClick: (coordinates: Coordinates) => void;
}

function Cell({
  coordinates,
  flagged,
  hazardousness,
  playable,
  revealed,
  onLeftClick,
  onRightClick,
}: CellProperties) {
  const content = () => {
    if (!revealed) return flagged ? "🚩" : "";
    return hazardousness || "";
  };

  const styles = (): string => {
    let styles: string = "w-[11.11%] aspect-square cursor-pointer";
    if (!revealed) return `${styles} border-4 border-outset`;
    styles += " border";
    if (hazardousness === "💣") return `${styles} bg-red-500`;
    return `${styles} bg-gray-200`;
  };

  const onClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault();
    if (!playable) return;
    onLeftClick(coordinates);
  };

  const onContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault();
    if (!playable) return;
    onRightClick(coordinates);
  };

  return (
    <div className={styles()} onClick={onClick} onContextMenu={onContextMenu}>
      {content()}
    </div>
  );
}

export default Cell;
