import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { api } from "../lib/api";
import { IconRenderer } from "./ui/IconRenderer";

export default function Footer() {
  const [profile, setProfile] = useState<any>(null);
  const [socialMedia, setSocialMedia] = useState<any[]>([]);

  useEffect(() => {
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile in footer:', err));

    api.get('/social-media')
      .then(data => { if (data?.length > 0) setSocialMedia(data); })
      .catch(() => { });
  }, []);

  const displayName = profile?.name || "Chandradip";
  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { label: "Home", to: "/" },
    { label: "Contact", to: "/contact" },
    { label: "Achievement", to: "/achievement" },
    { label: "Case Studies", to: "/case-studies" },
  ];

  const learnLinks = [
    { label: "Services", to: "/services" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blog" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Use", to: "/" },
  ];

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand Logo in Footer */}
        <div className="mb-10">
          <NavLink to="/" className="inline-flex items-center gap-2">
            <span className="font-bold text-foreground text-2xl sm:text-3xl tracking-tighter flex items-center">
              <span className="font-mono text-foreground/70 mr-1.5">&lt;/&gt;</span>
              <span>{displayName}</span>
            </span>
          </NavLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Main */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Main</h4>
            <ul className="space-y-2">
              {mainLinks.map((item) => (
                <li key={item.to + item.label}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Learn</h4>
            <ul className="space-y-2">
              {learnLinks.map((item) => (
                <li key={item.to + item.label}>
                  <NavLink
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Social</h4>
            {socialMedia.length > 0 ? (
              <ul className="space-y-2">
                {socialMedia.map((item) => {
                  const iconSrc = item.icon || item.image || '';
                  const isHex = item.colorClass?.startsWith('#') || item.colorClass?.startsWith('rgb');
                  return (
                    <li key={item._id}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 ${!isHex ? (item.colorClass || '') : ''}`}
                        style={isHex ? { color: item.colorClass } : undefined}
                      >
                        <span className="flex-shrink-0">
                          <IconRenderer icon={iconSrc} size={16} />
                        </span>
                        <span>{item.platform}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{profile?.email || ''}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-red-500">♥</span> and{" "}
            <span className="text-yellow-500">☕</span> by{" "}
            <span className="text-foreground font-medium">{displayName}</span>{" "}
            &copy; {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
