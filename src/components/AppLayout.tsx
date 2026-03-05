import { Outlet } from "react-router-dom";
import AppNavigation from "./AppNavigation";
import MusicPlayer from "./MusicPlayer";
import { usePlayer } from "@/hooks/usePlayer";

const AppLayout = () => {
  const { currentSong } = usePlayer();
  
  return (
    <div className="flex min-h-screen">
      <AppNavigation />
      <main className={`flex-1 overflow-y-auto pb-20 md:pb-0 ${currentSong ? "pb-40 md:pb-20" : ""}`}>
        <Outlet />
      </main>
      <MusicPlayer />
    </div>
  );
};

export default AppLayout;
