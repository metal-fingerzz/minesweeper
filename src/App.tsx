import Game from "./components/Game";
import type { Difficulty, GameSettings } from "./types";

function App() {
  const difficultySettings: Record<Difficulty, GameSettings> = {
    easy: {
      rowCount: 9,
      columnCount: 9,
      bombCount: 10,
    },
    medium: {
      rowCount: 9,
      columnCount: 9,
      bombCount: 10,
    },
    hard: {
      rowCount: 9,
      columnCount: 9,
      bombCount: 10,
    },
  };

  return <Game settings={difficultySettings.easy} />;
}

export default App;
