import { ReactNode } from "react";

interface GlowingBoxProps {
  children: ReactNode;
  className?: string;
}

const GlowingBox = ({ children, className = "" }: GlowingBoxProps) => {
  return (
    <div
      className={`
        relative p-8 md:p-12 rounded-3xl
        bg-gradient-to-br from-card via-rose-light to-card
        border-2 border-rose-medium/50
        animate-pulse-glow
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowingBox;
