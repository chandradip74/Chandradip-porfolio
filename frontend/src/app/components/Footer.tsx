import { NavLink } from "react-router";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 lg:px-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
                <span className="text-sm font-bold">AK</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Alex Kumar
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Full-stack developer crafting elegant digital experiences with modern technologies.
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

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground/70">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-border text-muted-foreground bg-muted/30 hover:bg-muted hover:text-foreground"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              hello@alexkumar.dev
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <p className="text-xs text-muted-foreground/70">
            © 2026 Alex Kumar. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Designed & Built with passion
          </p>
        </div>
      </div>
    </footer>
  );
}
