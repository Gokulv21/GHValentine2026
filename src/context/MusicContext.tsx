import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
// @ts-ignore
import musicUrl from "../assets/High-On-Love-MassTamilan.com.mp3";

type MusicContextType = {
    isPlaying: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
    pauseForVideo: () => void;
    resumeAfterVideo: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track if music WAS playing before pausing for video
    const wasPlayingRef = useRef(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.15;

        // 1. Initial attempt (might be muted/blocked)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }

        // 2. Global interaction fallback
        const handleInteraction = () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    setIsPlaying(true);
                    window.removeEventListener('click', handleInteraction);
                    window.removeEventListener('touchstart', handleInteraction);
                }).catch(console.error);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play().catch(console.error);
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const pauseForVideo = () => {
        if (isPlaying) {
            wasPlayingRef.current = true;
            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                setIsPlaying(false);
            }
        } else {
            wasPlayingRef.current = false;
        }
    };

    const resumeAfterVideo = () => {
        if (wasPlayingRef.current) {
            const audio = audioRef.current;
            if (audio) {
                audio.play().catch(console.error);
                setIsPlaying(true);
            }
        }
    };

    return (
        <MusicContext.Provider value={{ isPlaying, isMuted, togglePlay, toggleMute, pauseForVideo, resumeAfterVideo }}>
            <audio ref={audioRef} src={musicUrl} loop />
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
