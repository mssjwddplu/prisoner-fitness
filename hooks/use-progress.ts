"use client";

import { useState, useEffect } from "react";

export type WorkoutLog = {
  id: string;
  date: string;
  exerciseId: string;
  level: number;
  sets: number[]; // e.g. [10, 10, 8] means 3 sets of 10, 10, 8 reps
};

type ProgressState = {
  currentLevels: Record<string, number>;
  logs: WorkoutLog[];
};

const DEFAULT_STATE: ProgressState = {
  currentLevels: {
    pushups: 1,
    squats: 1,
    pullups: 1,
    legraises: 1,
    bridges: 1,
    handstandpushups: 1,
  },
  logs: [],
};

export function useProgress() {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("convict-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          currentLevels: { ...DEFAULT_STATE.currentLevels, ...(parsed.currentLevels || {}) },
          logs: parsed.logs || [],
        });
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("convict-progress", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setLevel = (exerciseId: string, level: number) => {
    setState((prev) => ({
      ...prev,
      currentLevels: {
        ...prev.currentLevels,
        [exerciseId]: level,
      },
    }));
  };

  const addLog = (log: Omit<WorkoutLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    setState((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  const deleteLog = (id: string) => {
    setState((prev) => ({
      ...prev,
      logs: prev.logs.filter((l) => l.id !== id),
    }));
  };

  return {
    ...state,
    isLoaded,
    setLevel,
    addLog,
    deleteLog,
  };
}
