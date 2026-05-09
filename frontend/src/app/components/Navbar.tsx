import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { api } from "../lib/api";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Blog", to: "/blog" },
  { label: "Achievement", to: "/achievement" },
  { label: "Contact Me", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile in navbar:', err));
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "AK";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const displayName = profile?.name || "Chandradipsinh";
  const displayInitials = getInitials(displayName);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/" className="flex items-center group overflow-hidden px-1">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground flex items-center">
            <span className="text-primary font-mono opacity-80 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-300 mr-1">&lt;/&gt;</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 group-hover:translate-x-1 transition-transform duration-300">
              {displayName}
            </span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative text-sm font-medium tracking-wide transition-colors duration-300 pb-1 group ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-px transition-all duration-300 bg-primary ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 block dark:hidden" />
            <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hidden dark:block" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 bg-background border-b border-border ${
          menuOpen ? "max-h-[400px] border-t" : "max-h-0 border-none"
        }`}
      >
        <ul className="flex flex-col px-6 py-4 gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
