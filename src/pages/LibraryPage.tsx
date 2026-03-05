import { useState } from "react";
import { ListMusic, Plus } from "lucide-react";
import SongCard from "@/components/SongCard";
import { useMockPlaylists } from "@/hooks/useMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LibraryPage = () => {
  const playlists = useMockPlaylists();
  const [activePlaylist, setActivePlaylist] = useState(playlists[0]?.id);
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);

  const selected = playlists.find(p => p.id === activePlaylist);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Playlist name"
                className="bg-surface border-border/50"
              />
              <Button onClick={() => { setOpen(false); setNewName(""); }}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlist tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {playlists.map(pl => (
          <button
            key={pl.id}
            onClick={() => setActivePlaylist(pl.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activePlaylist === pl.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:bg-surface-hover"
            }`}
          >
            <ListMusic className="h-3.5 w-3.5" />
            {pl.name}
          </button>
        ))}
      </div>

      {/* Songs */}
      {selected?.songs && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {selected.songs.map(song => (
            <SongCard key={song.id} song={song} queue={selected.songs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
