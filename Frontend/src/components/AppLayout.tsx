import { Outlet } from "react-router-dom";
import AppNavigation from "./AppNavigation";
import MusicPlayer from "./MusicPlayer";
import { usePlayer } from "@/hooks/usePlayer";

const AppLayout = () => {
  const { currentSong } = usePlayer();

  return (
    <div className="relative flex min-h-screen animated-gradient-bg overflow-hidden">
      {/* Floating ambient orbs — bleed through glass components */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="orb orb-primary" style={{ width: 500, height: 500, top: "-10%", left: "-5%" }} />
        <div className="orb orb-accent" style={{ width: 400, height: 400, bottom: "10%", right: "-5%" }} />
        <div className="orb orb-purple" style={{ width: 350, height: 350, top: "40%", left: "50%" }} />
      </div>

      {/* App shell */}
      <AppNavigation />
      <main className={`relative z-10 flex-1 overflow-y-auto pb-20 md:pb-0 ${currentSong ? "pb-40 md:pb-20" : ""}`}>
        <Outlet />
      </main>
      <MusicPlayer />
    </div>
  );
};

export default AppLayout;
