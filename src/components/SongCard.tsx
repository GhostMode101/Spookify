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
      className={`group relative flex flex-col gap-3 rounded-lg p-3 text-left transition-all duration-300 hover:bg-surface-hover ${
        isActive ? "bg-surface glow-primary" : "bg-card"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <img
          src={song.coverUrl || "/placeholder.svg"}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            {isActive && isPlaying ? (
              <Pause className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
            )}
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </button>
  );
};

export default SongCard;
