import { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";

// Dynamically import all compatible assets
const assetModules = import.meta.glob('../assets/*.{jpg,jpeg,png,mp4,JPG,JPEG,PNG,MP4}', { eager: true, as: 'url' });

interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  caption: string;
}

const MediaCollage = ({ visible }: { visible: boolean }) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process assets into a usable array
  const { pinnedItems, mediaItems } = useMemo(() => {
    const allItems: MediaItem[] = Object.entries(assetModules).map(([path, url]) => {
      const fileName = path.split('/').pop() || "";
      const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);

      // Caption logic: Simplification as per user request
      let caption = "Our Moments";

      // Pinned items will get "Forever Us" later, but for general items:
      return {
        id: path,
        type: isVideo ? "video" : "image",
        src: url,
        caption: caption,
      };
    });

    // Updated Strategy: Use specific couple photos for pinned items as requested
    const pinnedIds = ["IMG20250607174532.jpg", "IMG20250607174550.jpg"];

    // Find these specific items in our asset list
    const specificPinned = pinnedIds.map(id => {
      return allItems.find(item => item.id.includes(id));
    }).filter(Boolean) as MediaItem[];

    // If we found them, use them. Otherwise fallback to first 2 items.
    // Override caption for pinned items
    const pinned = (specificPinned.length > 0 ? specificPinned : allItems.slice(0, 2)).map(item => ({
      ...item,
      caption: "Forever Us"
    }));

    // Remaining items for the rope (excluding the pinned ones to avoid duplicates)
    // Keep "Our Moments" caption
    const otherItems = allItems.filter(item => !pinned.find(p => p.id === item.id)).map(item => ({
      ...item,
      caption: "Our Moments"
    }));

    // Interleave Logic: 1 video after ever 4 images (as per user request "3 to 4 images")
    const images = otherItems.filter(i => i.type === 'image');
    const videos = otherItems.filter(i => i.type === 'video');
    const interleaved: MediaItem[] = [];

    let vIndex = 0;
    let iIndex = 0;

    while (iIndex < images.length) {
      // Add 4 images or until exhausted
      for (let k = 0; k < 4 && iIndex < images.length; k++) {
        interleaved.push(images[iIndex++]);
      }
      // Add 1 video if available
      if (vIndex < videos.length) {
        interleaved.push(videos[vIndex++]);
      }
    }
    // Add any remaining videos at the end (fallback)
    while (vIndex < videos.length) {
      interleaved.push(videos[vIndex++]);
    }

    return { pinnedItems: pinned, mediaItems: interleaved };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLVideoElement) {
            if (entry.isIntersecting) {
              const playPromise = entry.target.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Auto-play was prevented
                });
              }
            } else {
              entry.target.pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [visible, mediaItems]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="w-full max-w-4xl mx-auto mt-12 px-4"
        style={{ minHeight: "100vh" }}
      >
        {/* Header Section - Album Book Style */}
        <div className="text-center mb-16 space-y-8 animate-fade-in">
          <h3 className="text-4xl md:text-5xl font-elegant text-primary mb-8 ml-4 animate-sway">
            Our Love Album
          </h3>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative">
            {pinnedItems.map((item, index) => (
              <div
                key={item.id}
                className={`
                    relative bg-white p-2 rounded-sm shadow-lg transform transition-transform hover:scale-105 hover:z-10
                    ${index % 2 === 0 ? '-rotate-3' : 'rotate-3'}
                `}
                style={{ maxWidth: '280px' }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
                </div>
                <p className="font-cursive text-xl text-center mt-2 text-gray-700">{item.caption}</p>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm border border-white/20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Rope Container with Drop Animation */}
        <div className="relative mt-20 pb-48 animate-rope-drop origin-top">
          {/* Animated Swinging Rope Wrapper */}
          <div className="animate-rope-swing origin-top">

            {/* The Main Rope Line */}
            <div className="absolute left-1/2 top-[-50px] bottom-[-50px] transform -translate-x-1/2 w-1.5 md:w-2 bg-amber-700 shadow-md z-0 rounded-full">
              <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
            </div>

            <div className="space-y-32 relative z-10 pt-16">
              {mediaItems.map((item, index) => {
                const isLeft = index % 2 === 0;
                // Randomize tilt slightly for realism
                const randomRotate = (index % 3 === 0 ? 2 : index % 3 === 1 ? -2 : 0) + (isLeft ? -1 : 1);

                return (
                  <div
                    key={item.id}
                    className={`flex items-start justify-center md:justify-between w-full relative`}
                  >
                    {/* Knot on the Rope */}
                    <div className="absolute left-1/2 top-[-15px] transform -translate-x-1/2 w-6 h-6 rounded-full bg-amber-800 shadow-sm z-20 border-2 border-amber-900"></div>

                    {/* Connecting String/Wire */}
                    <div
                      className={`
                        hidden md:block absolute top-[-10px] h-[3px] bg-amber-100/60 origin-left z-0
                        ${isLeft ? 'right-1/2 w-[18%] rotate-12' : 'left-1/2 w-[18%] -rotate-12'}
                      `}
                    ></div>
                    {/* Mobile String */}
                    <div
                      className={`
                        absolute top-[-10px] w-[2px] h-[50px] bg-amber-700/50
                        left-1/2 transform -translate-x-1/2 md:hidden
                        `}
                    ></div>

                    {/* Photo/Video Frame */}
                    <div
                      className={`
                        relative
                        w-full md:w-[40%] flex flex-col items-center 
                        ${isLeft ? 'md:items-end md:mr-auto' : 'md:items-start md:ml-auto'}
                      `}
                    >
                      <div
                        className={`
                        bg-white p-4 pb-12 shadow-2xl 
                        transform hover:scale-110 transition-all duration-500 ease-out
                        cursor-pointer relative
                        max-w-[280px] md:max-w-[320px]
                        hover:z-50 hover:rotate-0
                        `}
                        style={{
                          transform: `rotate(${randomRotate}deg)`
                        }}
                        onClick={() => setSelectedVideo(item)}
                      >
                        {/* Pin or Tape */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner z-10 border border-gray-400"></div>

                        <div className="aspect-[3/4] overflow-hidden bg-gray-900 shadow-inner flex items-center justify-center bg-black">
                          {item.type === "image" ? (
                            <img
                              src={item.src}
                              alt={item.caption}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={item.src}
                              muted={true}
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Play icon overlay for types */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Play className="w-12 h-12 text-white/50 drop-shadow-md opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                        <p className="absolute bottom-4 left-0 right-0 text-center font-cursive text-2xl text-gray-800 leading-none">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* End of Rope */}
            <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-4 h-16 bg-amber-700 rounded-b-full shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Enlarged Media Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none flex justify-center items-center">
          <div className="relative w-full max-h-[90vh] flex justify-center">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 md:-right-12 z-50 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {selectedVideo && (
              <div className="bg-white p-2 rounded-lg shadow-2xl overflow-hidden max-w-full">
                {selectedVideo.type === 'video' ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={selectedVideo.src}
                      controls
                      autoPlay
                      playsInline
                      className="max-w-full max-h-[80vh] w-auto h-auto"
                    />
                  </div>
                ) : (<img
                  src={selectedVideo.src}
                  alt={selectedVideo.caption}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                )}
                <p className="text-center font-cursive text-2xl mt-4 text-gray-800">{selectedVideo.caption || "Special Moment"}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaCollage;
