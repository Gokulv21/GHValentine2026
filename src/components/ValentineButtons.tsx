import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

interface ValentineButtonsProps {
  onYesClick: () => void;
}

const ValentineButtons = ({ onYesClick }: ValentineButtonsProps) => {
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

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
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
        "
      >
        Yes! 💕
      </Button>
      <Button
        disabled
        className="
          px-10 py-6 text-xl font-cursive
          bg-muted text-muted-foreground
          rounded-full cursor-not-allowed
          opacity-50 grayscale
        "
      >
        No 💔
      </Button>
    </div>
  );
};

export default ValentineButtons;
