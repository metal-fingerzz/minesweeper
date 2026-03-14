import { useEffect, useRef, useState } from "react";

import type { GameState } from "../types";

interface TimerProperties {
  gameState: GameState;
}

function Timer({ gameState }: TimerProperties) {
  const [elapsed, setElapsed] = useState<number>(0); // Centiseconds elapsed since the game started — triggers a re-render on every update
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Ref to hold the interval ID without triggering re-renders
  const startTimeRef = useRef<number>(0); // Timestamp (ms) of when the current game started

  useEffect(() => {
    if (gameState === "playing") {
      startTimeRef.current = Date.now(); // Record the exact start time
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 10)); // Every 10ms: compute centiseconds elapsed, call setElapsed → triggers a re-render
      }, 10); // Tick every 10ms (= 1 centisecond)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current); // Stop the interval on victory, defeat, or idle
    }

    // Cleanup: clear the interval when the effect re-runs or the component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState]); // Re-run the effect whenever gameState changes

  // On each render, derive the time parts from the latest elapsed value
  const centisecondCount: number = gameState === "idle" ? 0 : elapsed; // Show 0 when idle without calling setState inside the effect
  const cc: number = centisecondCount % 100; // Centiseconds part (0–99)

  const secondCount: number = Math.floor(centisecondCount / 100);
  const ss: number = secondCount % 60; // Seconds part (0–59)

  const minuteCount: number = Math.floor(secondCount / 60);
  const mm: number = minuteCount % 60; // Minutes part (0–59)

  const hh: number = Math.floor(minuteCount / 60); // Hours part

  const pad = (n: number): string => String(n).padStart(2, "0"); // Zero-pad a number to 2 digits

  return <div>{`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(cc)}`}</div>; // e.g. "00:01:23:45"
}

export default Timer;
