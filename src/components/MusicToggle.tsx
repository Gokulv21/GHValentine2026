import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicToggle = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <Button
      onClick={toggleMusic}
      variant="ghost"
      size="icon"
      className="
        fixed top-4 right-4 z-50
        w-12 h-12 rounded-full
        bg-card/80 backdrop-blur-sm
        border-2 border-rose-medium/50
        hover:bg-card hover:shadow-glow
        transition-all duration-300
      "
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-primary" />
      ) : (
        <Volume2 className="w-6 h-6 text-primary animate-pulse" />
      )}
    </Button>
  );
};

export default MusicToggle;
