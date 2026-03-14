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
    switch (revealed) {
      case true:
        return hazardousness || "";

      case false:
        switch (flagged) {
          case true:
            return "🚩";

          case false:
            return "";
        }
    }
  };

  const onClick = (): void => {
    if (!playable) return;
    onLeftClick(coordinates);
  };

  const onContextMenu = (): void => {
    if (!playable) return;
    onRightClick(coordinates);
  };

  return (
    <div onClick={onClick} onContextMenu={onContextMenu}>
      {content()}
    </div>
  );
}

export default Cell;
