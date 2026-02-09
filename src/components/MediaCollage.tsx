import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";

interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  caption: string;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
    caption: "Our Beautiful Journey Together 💕",
  },
  {
    id: 2,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80",
    caption: "Moments That Made Us Smile 🎬",
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
    caption: "Forever & Always ❤️",
  },
  {
    id: 4,
    type: "video",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    caption: "Our Love Story Continues 💑",
  },
];

interface MediaCollageProps {
  visible: boolean;
}

const MediaCollage = ({ visible }: MediaCollageProps) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  if (!visible) return null;

  return (
    <>
      <div
        className="
          w-full max-w-lg mx-auto mt-12 px-4
          animate-fade-in
        "
        style={{ animationDelay: "0.5s", animationFillMode: "both" }}
      >
        <h3 className="text-3xl font-cursive text-center text-primary mb-8 animate-sway">
          Our Precious Moments ✨
        </h3>
        
        <div className="space-y-6 collage-thread hide-scrollbar">
          {mediaItems.map((item, index) => (
            <div
              key={item.id}
              className="
                collage-item relative rounded-2xl overflow-hidden
                shadow-soft transform transition-all duration-500
                hover:scale-[1.02] hover:shadow-glow
                animate-fade-in
              "
              style={{ 
                animationDelay: `${0.3 * (index + 1)}s`,
                animationFillMode: "both"
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedVideo(item)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.caption}
                    className="w-full h-64 object-cover"
                  />
                  <div className="
                    absolute inset-0 flex items-center justify-center
                    bg-foreground/30 group-hover:bg-foreground/40
                    transition-colors duration-300
                  ">
                    <div className="
                      w-16 h-16 rounded-full bg-primary/90
                      flex items-center justify-center
                      transform group-hover:scale-110 transition-transform
                      shadow-glow
                    ">
                      <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
              <div className="
                absolute bottom-0 left-0 right-0
                bg-gradient-to-t from-foreground/70 to-transparent
                p-4 pt-8
              ">
                <p className="text-primary-foreground font-cursive text-xl">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Thread decoration */}
        <div className="flex justify-center mt-8">
          <div className="w-0.5 h-20 bg-gradient-to-b from-primary to-transparent" />
        </div>
        <p className="text-center font-cursive text-2xl text-primary animate-pulse">
          GH Forever 💕
        </p>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-foreground border-none">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-primary/80 hover:bg-primary transition-colors"
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>
          {selectedVideo && (
            <video
              src={selectedVideo.src}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaCollage;
