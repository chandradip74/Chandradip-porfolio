import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Mail } from "lucide-react";
import { api } from "../lib/api";

export default function Footer() {
  const [profile, setProfile] = useState<any>(null);
  const [socialMedia, setSocialMedia] = useState<any[]>([]);

  useEffect(() => {
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile in footer:', err));

    api.get('/social-media')
      .then(data => { if (data?.length > 0) setSocialMedia(data); })
      .catch(() => {});
  }, []);

  const displayName = profile?.name || "Chandradipsinh";
  const displayRole = profile?.role?.join(', ') || "Full-stack developer crafting elegant digital experiences.";
  const displayEmail = profile?.email || "hello@example.com";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 lg:px-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand — same style as Navbar logo */}
          <div className="space-y-4">
            <NavLink to="/" className="inline-flex items-center group overflow-hidden px-1">
              <span className="text-xl font-black tracking-tighter text-foreground flex items-center">
                <span className="text-primary font-mono opacity-80 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-300 mr-1">&lt;/&gt;</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 group-hover:translate-x-1 transition-transform duration-300">
                  {displayName}
                </span>
              </span>
            </NavLink>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {displayRole}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground/70">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "Projects", to: "/projects" },
                { label: "Achievement", to: "/achievement" },
                { label: "Contact Me", to: "/contact" },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className="text-sm transition-colors duration-200 text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect — Social Media Images */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground/70">
              Connect
            </h4>
            {socialMedia.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                {socialMedia.map((item) => (
                  <a
                    key={item._id}
                    href={item.link}
                    aria-label={item.platform}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-border bg-muted/30 hover:bg-muted overflow-hidden"
                    title={item.platform}
                  >
                    <img
                      src={item.image}
                      alt={item.platform}
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                ))}
                <a
                  href={`mailto:${displayEmail}`}
                  aria-label="Email"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-border text-muted-foreground bg-muted/30 hover:bg-muted hover:text-foreground"
                >
                  <Mail size={16} />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${displayEmail}`}
                  aria-label="Email"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-border text-muted-foreground bg-muted/30 hover:bg-muted hover:text-foreground"
                >
                  <Mail size={16} />
                </a>
              </div>
            )}
            <p className="text-sm text-muted-foreground break-all">{displayEmail}</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <p className="text-xs text-muted-foreground/70">
            © {currentYear} {displayName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Designed & Built with passion
          </p>
        </div>
      </div>
    </footer>
  );
}
