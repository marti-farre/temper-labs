import { useState, useEffect, useRef } from "react";

export function useTypingPlaceholder(
  phrases: string[],
  typingSpeed = 40,
  pauseMs = 2000
): string {
  const [text, setText] = useState("");
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const current = phrases[phraseIndex.current];

    const tick = () => {
      if (isDeleting.current) {
        charIndex.current--;
        setText(current.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          isDeleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        }
      } else {
        charIndex.current++;
        setText(current.slice(0, charIndex.current));
      }
    };

    let delay: number;
    if (!isDeleting.current && charIndex.current === current.length) {
      delay = pauseMs;
      isDeleting.current = true;
    } else if (isDeleting.current) {
      delay = typingSpeed / 2;
    } else {
      delay = typingSpeed;
    }

    const timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, phrases, typingSpeed, pauseMs]);

  return text;
}
