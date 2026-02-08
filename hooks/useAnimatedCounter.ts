import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(
  target: number | null,
  durationMs = 1500
): number {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === null || target === 0) {
      setCurrent(0);
      return;
    }

    startTime.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - (startTime.current || now);
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs]);

  return current;
}
