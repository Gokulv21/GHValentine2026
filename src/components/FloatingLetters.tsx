import { useEffect, useState } from "react";

interface FloatingItem {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    content: string;
    fontFamily: string;
}

const fonts = [
    "font-cursive",
    "font-elegant",
    "font-serif",
    "font-sans"
];

const characters = [
    "❤️", "💖", "💝", "💕", "💗",
    "G", "H", "L", "O", "V", "E",
    "F", "O", "R", "E", "V", "E", "R"
];

const FloatingLetters = () => {
    const [items, setItems] = useState<FloatingItem[]>([]);

    useEffect(() => {
        const newItems: FloatingItem[] = [];
        for (let i = 0; i < 30; i++) {
            newItems.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 15,
                duration: 10 + Math.random() * 15, // Slower fall
                size: 20 + Math.random() * 30,
                content: characters[Math.floor(Math.random() * characters.length)],
                fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
            });
        }
        setItems(newItems);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`absolute animate-float-down ${item.fontFamily} text-primary/40`}
                    style={{
                        left: `${item.left}%`,
                        animationDelay: `${item.delay}s`,
                        animationDuration: `${item.duration}s`,
                        fontSize: `${item.size}px`,
                        top: "-50px" // Start above screen
                    }}
                >
                    {item.content}
                </div>
            ))}
        </div>
    );
};

export default FloatingLetters;
