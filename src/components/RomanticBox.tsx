import { ReactNode } from "react";

interface RomanticBoxProps {
    children: ReactNode;
    className?: string;
}

const RomanticBox = ({ children, className = "" }: RomanticBoxProps) => {
    return (
        <div
            className={`
        relative p-8 md:p-12 rounded-3xl
        bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100
        border-2 border-rose-200/60
        shadow-2xl
        backdrop-blur-sm
        ${className}
      `}
        >
            {/* Decorative border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-pink-200/40 pointer-events-none" />
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-200/20 to-rose-200/20 pointer-events-none" />
            {/* Floating hearts */}
            <div className="absolute -top-4 -left-4 text-2xl animate-float" style={{ animationDelay: "0s" }}>💖</div>
            <div className="absolute -top-2 -right-2 text-xl animate-float" style={{ animationDelay: "0.5s" }}>💕</div>
            <div className="absolute -bottom-2 -left-2 text-xl animate-float" style={{ animationDelay: "1s" }}>💝</div>
            <div className="absolute -bottom-4 -right-4 text-2xl animate-float" style={{ animationDelay: "0.7s" }}>💖</div>

            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default RomanticBox;