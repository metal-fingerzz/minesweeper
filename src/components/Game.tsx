import { useState } from "react";
import type { Cells } from "../types";
import Field from "./Field";
import Timer from "./Timer";

function Game() {
  const [counter] = useState<number>(0);
  const [cells] = useState<Cells>({});
  return (
    <div>
      <Timer counter={counter} />
      <Field
        cells={cells}
        onCellLeftClick={() => {}}
        onCellRightClick={() => {}}
      />
    </div>
  );
}

export default Game;
