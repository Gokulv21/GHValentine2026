import { useState, forwardRef, useEffect } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";

interface VideoItemProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
    className?: string;
}

const VideoItem = forwardRef<HTMLVideoElement, VideoItemProps>(
    ({ src, className, ...props }, ref) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [isPlaying, setIsPlaying] = useState(false);
        const [debugMsg, setDebugMsg] = useState("");

        useEffect(() => {
            // Safety timeout: if video doesn't load in 5s, assume it's ready or failed but show controls
            const timer = setTimeout(() => {
                if (isLoading) {
                    console.warn("Video load timeout for", src);
                    setIsLoading(false);
                    setDebugMsg("Timeout");
                }
            }, 5000);
            return () => clearTimeout(timer);
        }, [isLoading, src]);

        return (
            <div className={`relative bg-gray-200 flex items-center justify-center ${className}`}>
                {/* Placeholder Icon if video is hidden/loading */}
                {isLoading && <Play className="w-12 h-12 text-gray-400 absolute" />}

                <video
                    ref={ref}
                    src={src}
                    className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    onLoadedData={() => {
                        console.log("Video loaded:", src);
                        setIsLoading(false);
                    }}
                    onError={(e) => {
                        console.error("Video error event:", e);
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    {...props}
                />

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}

                {/* Error Overlay */}
                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10 text-gray-500 p-2 text-center">
                        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                        <span className="text-xs">Failed to load</span>
                    </div>
                )}

                {/* Play Button Overlay (only if not playing and ready) */}
                {!isLoading && !hasError && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-black/40 p-3 rounded-full backdrop-blur-sm">
                            <Play className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        {debugMsg && <span className="absolute bottom-2 text-[10px] text-red-500 bg-white px-1">{debugMsg}</span>}
                    </div>
                )}
            </div>
        );
    }
);

VideoItem.displayName = "VideoItem";

export default VideoItem;
