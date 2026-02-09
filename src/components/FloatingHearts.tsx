import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  type: "heart" | "balloon";
}

const FloatingHearts = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const newItems: FloatingItem[] = [];
    for (let i = 0; i < 20; i++) {
      newItems.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        size: 20 + Math.random() * 30,
        type: Math.random() > 0.4 ? "heart" : "balloon",
      });
    }
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float-up"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            fontSize: `${item.size}px`,
          }}
        >
          {item.type === "heart" ? (
            <span className="text-heart-red drop-shadow-lg">❤️</span>
          ) : (
            <span className="drop-shadow-lg">🎈</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
