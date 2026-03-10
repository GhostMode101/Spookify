import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SongCard from "@/components/SongCard";
import { useMockSongs } from "@/hooks/useMockData";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const songs = useMockSongs();

  const results = useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  }, [query, songs]);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <h1 className="text-2xl font-bold text-foreground">Search</h1>
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search songs, artists..."
          className="pl-10 bg-surface border-border/50 focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {results.map(song => (
          <SongCard key={song.id} song={song} queue={results} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No results found for "{query}"</p>
      )}
    </div>
  );
};

export default SearchPage;
