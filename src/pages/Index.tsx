import { useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import TypewriterText from "@/components/TypewriterText";
import GlowingBox from "@/components/GlowingBox";
import ValentineButtons from "@/components/ValentineButtons";
import MediaCollage from "@/components/MediaCollage";
import MusicToggle from "@/components/MusicToggle";

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
      <FloatingHearts />
      <MusicToggle />

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
            <h2 className="text-2xl md:text-4xl font-elegant text-rose-dark animate-fade-in">
              <TypewriterText text="Gokul V Weds Hema D" delay={0} />
            </h2>
          )}
        </div>

        {/* Decorative hearts */}
        <div className="flex gap-4 mb-8 animate-sway">
          <span className="text-4xl">💝</span>
          <span className="text-5xl animate-bounce-gentle">💖</span>
          <span className="text-4xl">💝</span>
        </div>

        {/* Glowing Valentine Box */}
        <GlowingBox className="max-w-md mx-auto text-center">
          <p className="text-4xl md:text-5xl font-cursive text-primary leading-relaxed">
            Will you be my Valentine?
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-2xl animate-float" style={{ animationDelay: "0s" }}>💕</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "0.5s" }}>💕</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "1s" }}>💕</span>
          </div>
        </GlowingBox>

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
