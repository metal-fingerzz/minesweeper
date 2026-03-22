import { useState } from "react";
import Game from "./components/Game";
import type { Difficulty, GameSettings } from "./types";

function App() {
  const [difficulty] = useState<Difficulty>("easy"); // Currently selected difficulty — setter omitted until difficulty selection UI is added

  const settings = (): GameSettings => {
    switch (difficulty) {
      case "easy":
        return {
          rowCount: 9,    // Standard beginner grid: 9×9, 10 bombs
          columnCount: 9,
          bombCount: 10,
        };

      case "medium":
        return {
          rowCount: 16,   // Standard intermediate grid: 16×16, 40 bombs
          columnCount: 16,
          bombCount: 40,
        };

      case "hard":
        return {
          rowCount: 30,   // Standard expert grid: 30×16, 99 bombs
          columnCount: 16,
          bombCount: 99,
        };
    }
  };

  return <Game key={difficulty} settings={settings()} />; // key=difficulty forces a full remount of Game whenever difficulty changes, resetting all state
}

export default App;
