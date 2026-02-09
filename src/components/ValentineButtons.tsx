import confetti from "canvas-confetti";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ValentineButtonsProps {
  onYesClick: () => void;
}

const ValentineButtons = ({ onYesClick }: ValentineButtonsProps) => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleYesClick = () => {
    // Trigger confetti burst
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff85a2"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Also burst from center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
    });

    onYesClick();
  };

  const moveNoButton = () => {
    // Calculate random position within viewport, but keep it visible
    const newX = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
    const newY = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2 - 50);

    setNoButtonPosition({ x: newX, y: newY });
    setIsHovered(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 relative min-h-[100px]">
      <Button
        onClick={handleYesClick}
        className="
          px-10 py-6 text-xl font-cursive
          bg-gradient-to-r from-primary to-accent
          hover:from-accent hover:to-primary
          text-primary-foreground
          rounded-full shadow-soft
          transform transition-all duration-300
          hover:scale-110 hover:shadow-glow
          animate-bounce-gentle
          z-10
        "
      >
        Yes! 💕
      </Button>
      <div
        style={{
          transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
          transition: "transform 0.3s ease-out",
          position: isHovered ? "absolute" : "relative",
          zIndex: 20
        }}
        onMouseEnter={moveNoButton}
        onTouchStart={moveNoButton}
      >
        <Button
          className="
            px-10 py-6 text-xl font-cursive
            bg-muted text-muted-foreground
            rounded-full
            hover:bg-destructive hover:text-destructive-foreground
            transition-colors duration-300
          "
        >
          No 💔
        </Button>
      </div>
    </div>
  );
};

export default ValentineButtons;
