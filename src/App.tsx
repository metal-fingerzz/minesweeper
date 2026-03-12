import { useState } from "react";
import Game from "./components/Game";
import type { Difficulty, GameSettings } from "./types";

function App() {
  const [difficulty] = useState<Difficulty>("easy");

  const settings = (): GameSettings => {
    switch (difficulty) {
      case "easy":
        return {
          rowCount: 9,
          columnCount: 9,
          bombCount: 10,
        };

      case "medium":
        return {
          rowCount: 16,
          columnCount: 16,
          bombCount: 40,
        };

      case "hard":
        return {
          rowCount: 16,
          columnCount: 30,
          bombCount: 99,
        };
    }
  };

  return <Game key={difficulty} settings={settings()} />;
}

export default App;
