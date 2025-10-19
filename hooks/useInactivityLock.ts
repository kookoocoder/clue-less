import { useEffect, useRef, useState } from "react";

interface UseInactivityLockOptions {
  timeout: number; // milliseconds
  onLock: () => void;
}

export function useInactivityLock({ timeout, onLock }: UseInactivityLockOptions) {
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsLocked(true);
      onLock();
    }, timeout);
  };

  useEffect(() => {
    // Activity events
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    const handleActivity = () => {
      if (!isLocked) {
        resetTimer();
      }
    };

    // Start timer on mount
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLocked, timeout, onLock]);

  const unlock = () => {
    setIsLocked(false);
    resetTimer();
  };

  return { isLocked, unlock };
}

