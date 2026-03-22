import type { Cells, Coordinates, GameSettings } from "../types";
import Cell from "./Cell";

interface FieldProperties {
  cells: Cells;
  playable: boolean;
  settings: GameSettings;
  onCellLeftClick: (coordinates: Coordinates) => void;
  onCellRightClick: (coordinates: Coordinates) => void;
}

function Field({
  cells,
  playable,
  settings,
  onCellLeftClick,
  onCellRightClick,
}: FieldProperties) {
  return (
    <div className="w-full flex flex-wrap border"> {/* flex-wrap causes cells to flow into rows automatically based on their percentage width */}
      {Object.entries(cells).map(([cellId, cellData]) => ( // Cells are iterated in insertion order, which matches the y-then-x loop in emptyCells()
        <Cell
          key={cellId} // Stable key — CellId never changes during a game round
          coordinates={cellData.coordinates}
          hazardousness={cellData.hazardousness}
          flagged={cellData.flagged}
          playable={playable} // Passed down to every cell so clicks are blocked during state updates
          revealed={cellData.revealed}
          settings={settings} // Needed by Cell to compute its width class based on columnCount
          onLeftClick={onCellLeftClick}
          onRightClick={onCellRightClick}
        />
      ))}
    </div>
  );
}

export default Field;
