import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { api } from "../lib/api";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Blog", to: "/blog" },
  { label: "Achievement", to: "/achievement" },
  { label: "Contact Me", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile in navbar:', err));
  }, []);

  const displayName = profile?.name || "Chandradipsinh";

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-foreground text-xl sm:text-2xl tracking-tighter flex items-center">
            <span className="font-mono text-foreground/70 mr-1.5">&lt;/&gt;</span>
            <span>{displayName}</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-b border-border bg-background overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[500px]" : "max-h-0 border-none"
        }`}
      >
        <ul className="flex flex-col px-4 py-3 gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
