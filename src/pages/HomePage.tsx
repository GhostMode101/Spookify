import SongCard from "@/components/SongCard";
import { useMockSongs } from "@/hooks/useMockData";
import heroBg from "@/assets/hero-bg.jpg";

const HomePage = () => {
  const songs = useMockSongs();

  return (
    <div className="space-y-8 px-4 py-6 md:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl">
        <img src={heroBg} alt="OpenWave" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 min-h-[220px] md:min-h-[280px] bg-gradient-to-t from-background/90 via-background/40 to-transparent">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Welcome to <span className="text-gradient">OpenWave</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-lg">
            Discover, stream, and share your favorite music. Your open-source music platform.
          </p>
        </div>
      </section>

      {/* Trending */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>

      {/* Recently played */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {songs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
