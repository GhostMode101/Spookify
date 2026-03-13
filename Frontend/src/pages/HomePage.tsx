import { useState, useCallback } from "react";
import { loginWithSpotify } from "@/services/api";
import SineWaveVisualizer from "@/components/SineWaveVisualizer";
import { Music, Heart, Users, Zap } from "lucide-react";

const HomePage = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  return (
    <div className="space-y-10 px-4 py-6 md:px-8 animate-slide-up">
      {/* ═══════════════  HERO  ═══════════════ */}
      <section
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-2xl min-h-[360px] md:min-h-[440px] cursor-crosshair"
      >
        {/* Dark gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, hsl(220 20% 7%) 0%, hsl(240 18% 10%) 50%, hsl(220 20% 7%) 100%)
            `,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Sine Wave Visualizer */}
        <SineWaveVisualizer mouseX={mousePos.x} mouseY={mousePos.y} className="z-[1]" />

        {/* Vignette */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-background/90 via-transparent to-background/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[360px] md:min-h-[440px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1DB954] to-[#1DB954]/70 shadow-lg shadow-[#1DB954]/25 mb-6">
            <Music className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-4">
            Welcome to{" "}
            <span className="text-gradient text-glow">SpookieFY</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            The dating app that matches you based on your music taste.
            Connect your Spotify, and we'll find your musical soulmate.
          </p>

          {/* Spotify Login Button */}
          <button
            onClick={() => loginWithSpotify()}
            className="group relative flex items-center gap-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold
              text-lg px-10 py-4
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-2xl hover:shadow-[#1DB954]/30
              active:scale-95"
          >
            {/* Spotify icon */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Log in with Spotify
            <span className="absolute -inset-1 rounded-full bg-[#1DB954]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </button>

          {/* Animated accent bar */}
          <div className="mt-8 flex items-center gap-2">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#1DB954] to-accent animate-pulse-glow" />
            <div className="h-1 w-6 rounded-full bg-accent/50 animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
            <div className="h-1 w-3 rounded-full bg-[#1DB954]/30 animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════  FEATURES  ═══════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Music,
            title: "Spotify Powered",
            desc: "We analyze your top 50 artists to build your unique musical fingerprint.",
            color: "#1DB954",
          },
          {
            icon: Heart,
            title: "Vibe Matching",
            desc: "Our algorithm finds people who share your exact music DNA.",
            color: "hsl(16, 90%, 58%)",
          },
          {
            icon: Users,
            title: "Real Connections",
            desc: "Chat with matches, share playlists, and discover new artists together.",
            color: "hsl(174, 72%, 46%)",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="glass rounded-2xl p-6 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.04]"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${feature.color}15` }}
            >
              <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="glass rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          How SpookieFY Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Connect Spotify", desc: "One-click login. We only read your top artists — nothing else." },
            { step: "02", title: "Build Your DNA", desc: "Your top 50 artists become your unique musical fingerprint." },
            { step: "03", title: "Find Your Match", desc: "We pair you with people who vibe on the same wavelength." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span className="text-3xl font-bold text-primary/20">{item.step}</span>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
