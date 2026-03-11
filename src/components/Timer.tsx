import { useState } from "react";
import type { GameState } from "../types";

interface TimerProperties {
  gameState: GameState;
}

function Timer({ gameState }: TimerProperties) {
  const [counter] = useState<number>(0);
  return (
    <div>
      {counter}
      {gameState}
    </div>
  );
}

export default Timer;
