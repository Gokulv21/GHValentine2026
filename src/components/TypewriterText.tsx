import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText = ({ text, delay = 0, className = "", onComplete }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
          // Keep cursor blinking for a bit then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 100);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className={`inline-block w-0.5 h-[1em] bg-primary ml-1 ${isComplete ? "animate-pulse" : ""}`}>
          |
        </span>
      )}
    </span>
  );
};

export default TypewriterText;
