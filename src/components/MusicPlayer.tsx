import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { Slider } from "@/components/ui/slider";

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const MusicPlayer = () => {
  const { currentSong, isPlaying, progress, duration, volume, togglePlay, seek, setVolume, next, prev } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/40">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3 md:px-6">
        {/* Song info */}
        <div className="flex min-w-0 items-center gap-3 flex-1 md:flex-[0.3]">
          <img
            src={currentSong.coverUrl || "/placeholder.svg"}
            alt={currentSong.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{currentSong.title}</p>
            <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-shadow hover:glow-primary"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <button onClick={next} className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.1}
              onValueChange={([v]) => seek(v)}
              className="flex-1"
            />
            <span className="text-[10px] text-muted-foreground font-mono w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 flex-[0.2] justify-end">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={([v]) => setVolume(v)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
