import { useEffect, useState, useCallback } from "react";
import { api, type FeedUser } from "@/services/api";
import { Loader2, Music, Sparkles, X, Heart, Zap } from "lucide-react";

// ════════════════════════════════════════════════════
// DiscoverPage — Phase 2: Swipe-based matchmaking UI
// ════════════════════════════════════════════════════

const DiscoverPage = () => {
  const [feed, setFeed] = useState<FeedUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchRoomId, setMatchRoomId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const result = await api.getFeed();
        setFeed(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleSwipe = useCallback(
    async (action: "LIKE" | "PASS") => {
      if (swiping || currentIndex >= feed.length) return;

      const user = feed[currentIndex];
      setSwiping(true);
      setSlideDirection(action === "LIKE" ? "right" : "left");

      try {
        const result = await api.swipe(user.id, action);

        if (result.data.isMatch) {
          setMatchRoomId(result.data.roomId || null);
          setShowMatch(true);
        }
      } catch (err) {
        console.error("Swipe error:", err);
      }

      // Animate then advance
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSlideDirection(null);
        setSwiping(false);
      }, 400);
    },
    [swiping, currentIndex, feed]
  );

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleSwipe("PASS");
      if (e.key === "ArrowRight") handleSwipe("LIKE");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-40 animate-pulse" />
            <Loader2 className="h-14 w-14 text-primary animate-spin relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse text-sm tracking-wide">
            Finding your vibe matches...
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-10 text-center max-w-md space-y-4">
          <Zap className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // ── Empty Feed State ──
  if (feed.length === 0 || currentIndex >= feed.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-10 text-center max-w-md space-y-5">
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse" />
            <Sparkles className="h-16 w-16 text-accent relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {currentIndex > 0 ? "You've seen everyone!" : "No matches yet"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentIndex > 0
              ? "Check back later — new music lovers are joining every day."
              : "We're warming up the vibe engine. Come back soon!"}
          </p>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentIndex];

  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 py-8 min-h-[70vh] relative">
        {/* ── Background Glow ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* ── Discovery Card ── */}
        <div
          className={`
            relative w-full max-w-sm transition-all duration-400 ease-out
            ${slideDirection === "left" ? "translate-x-[-120%] rotate-[-12deg] opacity-0" : ""}
            ${slideDirection === "right" ? "translate-x-[120%] rotate-[12deg] opacity-0" : ""}
            ${!slideDirection ? "translate-x-0 rotate-0 opacity-100" : ""}
          `}
        >
          {/* Card Container */}
          <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
            {/* Profile Image */}
            <div className="relative h-72 sm:h-80 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Music className="h-24 w-24 text-white/20" />
                </div>
              )}

              {/* Gradient overlay at bottom of image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Vibe Score Badge — overlaying the image */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
                  <div className="relative bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">Vibe Score</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none mt-0.5">
                      {currentUser.vibeScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-4 left-5 z-10">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {currentUser.displayName || "Mystery Listener"}
                </h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Top Artists */}
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5" />
                  Top Artists
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.topArtists.length > 0 ? (
                    currentUser.topArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1.5 text-sm"
                      >
                        {artist.imageUrl ? (
                          <img
                            src={artist.imageUrl}
                            alt={artist.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <Music className="h-3 w-3 text-white/40" />
                          </div>
                        )}
                        <span className="text-foreground font-medium text-xs">{artist.name}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No artists available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card count indicator */}
          <div className="flex justify-center gap-1 mt-4">
            {feed.slice(currentIndex, Math.min(currentIndex + 5, feed.length)).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === 0
                    ? "w-6 bg-gradient-to-r from-primary to-accent"
                    : "w-1.5 bg-white/20"
                }`}
              />
            ))}
            {feed.length - currentIndex > 5 && (
              <span className="text-[10px] text-white/30 ml-1">+{feed.length - currentIndex - 5}</span>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-8 mt-8">
          {/* Pass Button */}
          <button
            id="discover-pass-btn"
            onClick={() => handleSwipe("PASS")}
            disabled={swiping}
            className="
              group relative w-20 h-20 rounded-full
              bg-white/[0.05] border-2 border-white/10 backdrop-blur-xl
              flex items-center justify-center
              transition-all duration-300
              hover:border-red-400/50 hover:bg-red-500/10 hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <X className="h-8 w-8 text-white/60 group-hover:text-red-400 transition-colors" />
          </button>

          {/* Vibe (Like) Button */}
          <button
            id="discover-vibe-btn"
            onClick={() => handleSwipe("LIKE")}
            disabled={swiping}
            className="
              group relative w-24 h-24 rounded-full
              bg-gradient-to-br from-emerald-500/20 to-green-400/10
              border-2 border-emerald-400/30 backdrop-blur-xl
              flex items-center justify-center
              transition-all duration-300
              hover:border-emerald-400/60 hover:scale-110 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)]
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {/* Glow ring around the button */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Heart className="h-10 w-10 text-emerald-400 group-hover:text-emerald-300 transition-colors relative z-10 group-hover:fill-emerald-300" />
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center gap-4 mt-6 text-[11px] text-white/20">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">←</kbd> Pass
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">→</kbd> Vibe
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* ── "IT'S A VIBE!" Match Modal ──           */}
      {/* ════════════════════════════════════════════ */}
      {showMatch && <MatchModal onClose={() => setShowMatch(false)} roomId={matchRoomId} />}
    </>
  );
};

// ══════════════════════════════════
// Match Modal Component
// ══════════════════════════════════

interface MatchModalProps {
  onClose: () => void;
  roomId: string | null;
}

const MatchModal = ({ onClose }: MatchModalProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-500
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-emerald-500/30 blur-[150px]"
          style={{ animation: "float-orb 4s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/25 blur-[120px]"
          style={{ animation: "float-orb-reverse 5s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[160px]"
          style={{ animation: "float-orb 6s ease-in-out infinite" }}
        />
      </div>

      {/* Modal Content */}
      <div
        className={`
          relative z-10 flex flex-col items-center gap-8
          transition-all duration-700 ease-out
          ${visible ? "scale-100 translate-y-0" : "scale-50 translate-y-12"}
        `}
      >
        {/* Sparkle Ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-accent blur-2xl opacity-50 animate-pulse scale-150" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-accent flex items-center justify-center shadow-[0_0_80px_rgba(52,211,153,0.5)]">
            <Heart className="h-16 w-16 text-white fill-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #34d399, #2dd4bf, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 80px rgba(52,211,153,0.4)",
              filter: "drop-shadow(0 0 30px rgba(52,211,153,0.3))",
            }}
          >
            IT&apos;S A VIBE!
          </h1>
          <p className="text-white/60 text-lg">You both feel the rhythm 🎶</p>
        </div>

        {/* Close Button */}
        <button
          id="match-modal-close-btn"
          onClick={handleClose}
          className="
            mt-2 px-10 py-3.5 rounded-full font-bold text-sm tracking-wide
            bg-gradient-to-r from-emerald-500 to-accent
            text-white shadow-[0_0_30px_rgba(52,211,153,0.3)]
            transition-all duration-300
            hover:shadow-[0_0_50px_rgba(52,211,153,0.5)] hover:scale-105
            active:scale-95
          "
        >
          Continue Vibing
        </button>
      </div>
    </div>
  );
};

export default DiscoverPage;
