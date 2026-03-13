import { useEffect, useState } from "react";
import { api, type SpookieFyUser, loginWithSpotify } from "@/services/api";
import { Loader2, Music, Disc3, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const [user, setUser] = useState<SpookieFyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await api.getMe();
        setUser(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Session expired");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Disc3 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Analyzing your vibes...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md space-y-4">
          <Music className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Session Expired</h2>
          <p className="text-sm text-muted-foreground">{error || "Please log in again to continue."}</p>
          <Button
            onClick={() => loginWithSpotify()}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Log in with Spotify
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 animate-slide-up space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName || "User"}
              className="h-16 w-16 rounded-full ring-2 ring-primary/30 shadow-lg shadow-primary/20"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
              Welcome to <span className="text-gradient text-glow">SpookieFY</span>,
            </h1>
            <p className="text-lg text-primary font-semibold">{user.displayName || "Music Lover"}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-border/40 text-muted-foreground hover:text-foreground gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Vibe Analysis Card */}
      <div className="glass rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent animate-pulse-glow" />
          <h2 className="text-xl font-semibold text-foreground">Your Musical DNA</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          We've analyzed your top {(user.topArtists as unknown[])?.length || 0} artists. Soon we'll match you with
          people who share your vibe.
        </p>
      </div>

      {/* Top Artists Grid */}
      {user.topArtists && (user.topArtists as unknown[]).length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
            Your Top Artists
            <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse-glow" />
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {(user.topArtists as { id: string; name: string; imageUrl: string | null; genres: string[] }[])
              .slice(0, 24)
              .map((artist) => (
                <div
                  key={artist.id}
                  className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300 hover:bg-white/[0.04] hover:scale-105"
                >
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="h-20 w-20 rounded-full object-cover ring-1 ring-white/10 shadow-lg transition-all duration-300 group-hover:ring-primary/40"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface ring-1 ring-border/30">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">
                    {artist.name}
                  </span>
                  {artist.genres?.[0] && (
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {artist.genres[0]}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Discover CTA */}
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          ✨ <strong className="text-foreground">Ready to match?</strong> Discover people who share your music taste.
        </p>
        <a
          href="/discover"
          className="inline-block bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.3)]"
        >
          Start Discovering
        </a>
      </div>
    </div>
  );
};

export default DashboardPage;
