import { Volume2, VolumeX, Music } from "lucide-react";
import { useMusic } from "../context/MusicContext";

const BackgroundMusic = () => {
    const { isPlaying, togglePlay, isMuted, toggleMute } = useMusic();

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 animate-fade-in">
            <button
                onClick={togglePlay}
                className={`
                flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
                ${isPlaying ? 'bg-rose-500/80 text-white pr-3' : 'bg-white/90 text-rose-500 pr-5 animate-pulse'}
                 border border-rose-200 hover:scale-105
            `}
            >
                <div className={`p-1 bg-white/20 rounded-full ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <Music className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">
                    {isPlaying ? "On Air" : "Play Music"}
                </span>
            </button>

            {isPlaying && (
                <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    className="p-2 bg-white/90 rounded-full shadow-md text-gray-600 hover:text-rose-500 transition-colors border border-gray-100"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
};

export default BackgroundMusic;
