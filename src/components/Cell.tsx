import type { Coordinates, Hazardousness } from "../types";

interface CellProperties {
  coordinates: Coordinates;
  hazardousness: Hazardousness;
  flagged: boolean;
  revealed: boolean;
  onLeftClick: (coordinates: Coordinates) => void;
  onRightClick: (coordinates: Coordinates) => void;
}

function Cell({
  coordinates,
  hazardousness,
  flagged,
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

  return (
    <div
      onClick={() => onLeftClick(coordinates)}
      onContextMenu={() => onRightClick(coordinates)}
    >
      {content()}
    </div>
  );
}

export default Cell;
