import { NavLink } from "react-router-dom";
import { Home, Search, Library, LayoutDashboard, Music, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/discover", label: "Discover", icon: Sparkles },
  { to: "/search", label: "Search", icon: Search },
  { to: "/library", label: "Library", icon: Library },
];

const AppNavigation = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 glass-player md:static md:flex md:h-screen md:w-64 md:flex-col md:border-r-0 glass-sidebar">
    {/* Desktop header */}
    <div className="hidden md:flex items-center gap-3 px-6 py-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1DB954] to-[#1DB954]/70 shadow-lg shadow-[#1DB954]/20">
        <Music className="h-5 w-5 text-black" />
      </div>
      <span className="text-xl font-bold text-gradient tracking-tight">SpookieFY</span>
    </div>

    <div className="flex justify-around md:flex-col md:gap-1.5 md:px-3 md:justify-start md:mt-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300 ease-out
            ${
              isActive
                ? "text-[#1DB954] bg-[#1DB954]/[0.12] nav-glow-active"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] hover:scale-[1.02]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`h-5 w-5 transition-all duration-300 ${
                  isActive ? "drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" : "group-hover:scale-110"
                }`}
              />
              <span className="hidden md:inline">{label}</span>
              {isActive && (
                <span className="hidden md:block ml-auto h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse-glow" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default AppNavigation;
