import { Play, Pause } from "lucide-react";
import type { Song } from "@/services/api";
import { usePlayer } from "@/hooks/usePlayer";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

const SongCard = ({ song, queue }: SongCardProps) => {
  const { play, currentSong, isPlaying, togglePlay } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handleClick = () => {
    if (isActive) {
      togglePlay();
    } else {
      play(song, queue);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex flex-col gap-3 rounded-xl p-3 text-left
        transition-all duration-300 ease-out
        hover:scale-[1.04] hover:bg-white/[0.04] active:scale-[0.98]
        ${isActive ? "bg-white/[0.06] glow-primary ring-1 ring-primary/20" : "bg-transparent"}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <img
          src={song.coverUrl || "/placeholder.svg"}
          alt={song.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full
              bg-gradient-to-br from-primary to-primary/80
              shadow-xl shadow-primary/30
              transition-all duration-300 scale-75 group-hover:scale-100`}
          >
            {isActive && isPlaying ? (
              <Pause className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
            )}
          </div>
        </div>

        {/* Active playing indicator */}
        {isActive && isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-primary animate-pulse-glow"
                style={{
                  height: `${8 + i * 4}px`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p
          className={`truncate text-sm font-semibold transition-colors duration-300 ${
            isActive ? "text-primary" : "text-foreground group-hover:text-primary/90"
          }`}
        >
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </button>
  );
};

export default SongCard;
