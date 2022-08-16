import { useRef, useCallback } from "react";

export const useSetInterval = (callback: () => void, ms: number) => {
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const start = useCallback(() => {
    //* 이미 타이머가 있을 경우 추가로 타이머가 작동하지 않음
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        callback();
      }, ms);
    }
  }, [callback, ms]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return [start, stop];
};
