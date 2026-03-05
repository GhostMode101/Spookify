import { NavLink } from "react-router-dom";
import { Home, Search, Library, Upload, Music } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/library", label: "Library", icon: Library },
  { to: "/upload", label: "Upload", icon: Upload },
];

const AppNavigation = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/40 md:static md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-t-0">
    {/* Desktop header */}
    <div className="hidden md:flex items-center gap-2 px-6 py-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <Music className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold text-gradient">OpenWave</span>
    </div>

    <div className="flex justify-around md:flex-col md:gap-1 md:px-3 md:justify-start">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span className="hidden md:inline">{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default AppNavigation;
