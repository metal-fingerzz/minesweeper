import type { Cells, Coordinates } from "../types";
import Cell from "./Cell";

interface FieldProperties {
  cells: Cells;
  onCellLeftClick: (coordinates: Coordinates) => void;
  onCellRightClick: (coordinates: Coordinates) => void;
}

function Field({ cells, onCellLeftClick, onCellRightClick }: FieldProperties) {
  return (
    <div>
      {Object.entries(cells).map(([cellId, cellData]) => (
        <Cell
          key={cellId}
          coordinates={cellData.coordinates}
          hazardousness={cellData.hazardousness}
          flagged={cellData.flagged}
          revealed={cellData.revealed}
          onLeftClick={onCellLeftClick}
          onRightClick={onCellRightClick}
        />
      ))}
    </div>
  );
}

export default Field;
