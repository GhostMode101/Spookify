import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import type { Song } from "@/services/api";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Song[];
}

interface PlayerContextType extends PlayerState {
  play: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  next: () => void;
  prev: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.8,
    queue: [],
  });

  const play = useCallback((song: Song, queue?: Song[]) => {
    audioRef.current.src = song.audioUrl;
    audioRef.current.play().catch(() => {});
    setState(s => ({
      ...s,
      currentSong: song,
      isPlaying: true,
      progress: 0,
      queue: queue || s.queue,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setState(s => ({ ...s, isPlaying: !s.isPlaying }));
  }, [state.isPlaying]);

  const seek = useCallback((time: number) => {
    audioRef.current.currentTime = time;
    setState(s => ({ ...s, progress: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    audioRef.current.volume = vol;
    setState(s => ({ ...s, volume: vol }));
  }, []);

  const next = useCallback(() => {
    if (!state.currentSong || state.queue.length === 0) return;
    const idx = state.queue.findIndex(s => s.id === state.currentSong?.id);
    const nextSong = state.queue[(idx + 1) % state.queue.length];
    if (nextSong) play(nextSong);
  }, [state.currentSong, state.queue, play]);

  const prev = useCallback(() => {
    if (!state.currentSong || state.queue.length === 0) return;
    const idx = state.queue.findIndex(s => s.id === state.currentSong?.id);
    const prevSong = state.queue[(idx - 1 + state.queue.length) % state.queue.length];
    if (prevSong) play(prevSong);
  }, [state.currentSong, state.queue, play]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setState(s => ({ ...s, progress: audio.currentTime, duration: audio.duration || 0 }));
    const onEnd = () => next();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [next]);

  return (
    <PlayerContext.Provider value={{ ...state, play, togglePlay, seek, setVolume, next, prev }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};
