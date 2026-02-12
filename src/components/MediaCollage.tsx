import { useState, useRef, useEffect, useMemo } from "react";
import { Play, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import VideoItem from "./VideoItem";
import { useMusic } from "../context/MusicContext";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted like Instagram
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSwinging, setIsSwinging] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { pauseForVideo, resumeAfterVideo } = useMusic();

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
    if (!visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLVideoElement) {
            const video = entry.target;
            if (entry.isIntersecting) {
              // Strict autoplay policy: Must be muted
              video.muted = true;
              video.volume = 0;
              video.playsInline = true;

              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  // Auto-play was prevented
                  console.warn("Autoplay prevented:", error);
                  // Try again muted if it failed (though we set it above)
                  video.muted = true;
                  video.play().catch(e => console.error("Retry failed:", e));
                });
              }
            } else {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.6, // Increased threshold to ensure more of video is visible
        rootMargin: '0px'
      }
    );

    // Wait a bit ensuring ref logic is settled
    const timeoutId = setTimeout(() => {
      videoRefs.current.forEach((video) => {
        if (video) observer.observe(video);
      });
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [visible, mediaItems]);

  // Handle ESC key to close viewer and resume music
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeIndex !== null) {
        setActiveIndex(null);
        resumeAfterVideo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, resumeAfterVideo]);

  // Handle Rope Animation Timeout
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setIsSwinging(false);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, [visible]);


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
          <div className={`${isSwinging ? 'animate-rope-swing' : ''} origin-top transition-transform duration-[2000ms] ease-in-out`}>

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
                        will-change-transform
                        `}
                        style={{
                          transform: `rotate(${randomRotate}deg) translate3d(0,0,0)`
                        }}
                        onClick={() => {
                          setActiveIndex(index);
                          pauseForVideo();
                        }}
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
                            <VideoItem
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={item.src}
                              muted
                              loop
                              playsInline
                              webkit-playsinline="true"
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

      {/* Full Screen Reels-Style Viewer */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => {
            setActiveIndex(null);
            resumeAfterVideo();
          }} // Close when clicking background
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(null);
              resumeAfterVideo();
            }}
            className="absolute top-6 right-6 z-[70] p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/10"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Main Content Container */}
          <div
            className="relative w-full h-full md:w-auto md:h-[90vh] md:aspect-[9/16] bg-black shadow-2xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            {mediaItems[activeIndex].type === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-gray-900/50">
                <VideoItem
                  src={mediaItems[activeIndex].src}
                  className="w-full h-full object-contain md:object-cover" // Contain on mobile to see whole video, Cover on desktop for reel feel? OR Cover everywhere for immersive?
                  // "Instagram Reels" usually implies object-cover (full screen crop).
                  // But for personal videos, cropping heads off is bad. object-contain is safer for viewing.
                  // However, user said "Reels method", usually implies immersive full screen.  
                  // I will use object-contain for now to ensure visibility as requested ("fix the videos").
                  autoPlay
                  loop
                  playsInline
                  webkit-playsinline="true"
                  muted={isMuted}
                  onClick={(e) => {
                    e.stopPropagation();
                    const v = e.currentTarget;
                    if (v.paused) {
                      v.play();
                      setIsPlaying(true);
                    } else {
                      v.pause();
                      setIsPlaying(false);
                    }
                  }}
                />

                {/* Play/Pause Overlay Indicator */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                    <Play className="w-16 h-16 text-white/80 fill-white" />
                  </div>
                )}

                {/* Volume Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-6 right-4 z-[70] p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>
            ) : (
              <img
                src={mediaItems[activeIndex].src}
                alt={mediaItems[activeIndex].caption}
                className="w-full h-full object-contain"
              />
            )}

            {/* Navigation Overlays (Desktop & Mobile Tap Zones) */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-[60] flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
                }}
                className="p-2 ml-2 bg-black/50 rounded-full text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/4 z-[60] flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
                }}
                className="p-2 mr-2 bg-black/50 rounded-full text-white"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <h3 className="text-white font-cursive text-3xl drop-shadow-md">
                {mediaItems[activeIndex].caption}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaCollage;
