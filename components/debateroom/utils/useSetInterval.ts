import { useRef, useCallback } from "react";

export const useSetInterval = (callback: () => void, ms: number) => {
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      callback();
    }, ms);
  }, [callback, ms]);

  const stop = useCallback(() => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  return [start, stop];
};
