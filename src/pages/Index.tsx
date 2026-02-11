import { useState } from "react";
import FloatingLetters from "@/components/FloatingLetters";
import TypewriterText from "@/components/TypewriterText";
import RomanticBox from "@/components/RomanticBox";
import ValentineButtons from "@/components/ValentineButtons";
import MediaCollage from "@/components/MediaCollage";

const Index = () => {
  const [showSecondText, setShowSecondText] = useState(false);
  const [showCollage, setShowCollage] = useState(false);

  const handleYesClick = () => {
    setShowCollage(true);
    // Smooth scroll to collage after a brief delay
    setTimeout(() => {
      document.getElementById("collage-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-romantic-gradient overflow-x-hidden">
      <FloatingLetters />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Animated Title Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-cursive text-primary drop-shadow-lg">
            <TypewriterText
              text="GH Forever"
              onComplete={() => setShowSecondText(true)}
            />
          </h1>

          {showSecondText && (
            <h2 className="text-3xl md:text-5xl font-elegant text-primary animate-fade-in mt-4 tracking-wide">
              <span>Gokul V</span>
              <span className="mx-3 text-secondary-foreground font-cursive text-4xl md:text-6xl text-accent animate-pulse">Weds</span>
              <span>Hema D</span>
            </h2>
          )}
        </div>

        {/* Decorative hearts */}
        <div className="flex gap-4 mb-8 animate-sway">
          <span className="text-4xl">💝</span>
          <span className="text-5xl animate-bounce-gentle">💖</span>
          <span className="text-4xl">💝</span>
        </div>

        {/* Romantic Valentine Box */}
        <RomanticBox className="max-w-md mx-auto text-center">
          <p className="text-4xl md:text-5xl font-cursive text-primary leading-relaxed">
            Will you be my Valentine?
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-2xl animate-float" style={{ animationDelay: "0s" }}>💕</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "0.5s" }}>💕</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "1s" }}>💕</span>
          </div>
        </RomanticBox>

        {/* Yes/No Buttons */}
        <ValentineButtons onYesClick={handleYesClick} />

        {/* Scroll indicator when collage is visible */}
        {showCollage && (
          <div className="mt-12 animate-bounce-gentle">
            <span className="text-3xl">👇</span>
          </div>
        )}
      </div>

      {/* Collage Section */}
      <div id="collage-section" className="pb-20">
        <MediaCollage visible={showCollage} />
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-rose-dark font-cursive text-xl">
        Made with 💕 for GH
      </footer>
    </div>
  );
};

export default Index;
