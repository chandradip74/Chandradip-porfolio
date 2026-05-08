import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router";
import { ArrowRight, Download, ChevronDown, Cpu, Cloud, Shield, Zap, Layers, Globe, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { Typewriter } from "react-simple-typewriter";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiExpress, SiFlutter, SiTypescript, SiPostgresql } from "react-icons/si";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";


const FALLBACK_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Static fallback removed as it will be fetched from database

interface Profile {
  name: string;
  role: string[];
  description: string;
  aboutMe: string;
  profileImage: string;
  cvFile: string;
}

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [journey, setJourney] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);

  useEffect(() => {
    // Fetch profile
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile:', err))
      .finally(() => setProfileLoading(false));

    // Fetch journey
    api.get('/journey')
      .then(data => { if (data && data.length > 0) setJourney(data); })
      .catch(() => {});

    // Fetch technologies
    api.get('/technologies')
      .then(data => { if (data && data.length > 0) setTechnologies(data); })
      .catch(() => {});

    // Fetch interests
    api.get('/interests')
      .then(data => { if (data && data.length > 0) setInterests(data); })
      .catch(() => {});
  }, []);

  const displayName = profile?.name || "";
  const displayRoles = profile?.role?.length ? profile.role : ['Full Stack Developer', 'Web Developer', 'Database Designer'];
  const displayDescription = profile?.description || "I craft elegant, high-performance web and mobile applications. Specializing in modern frameworks to turn complex ideas into seamless digital experiences.";
  const displayAbout = profile?.aboutMe || "I'm a passionate Full-Stack Developer with years of experience building modern web and mobile applications. I specialize in creating clean, scalable, and high-performance digital products that solve real-world problems.";
  const displayImage = profile?.profileImage || FALLBACK_PROFILE_IMAGE;
  const cvUrl = profile?.cvFile || "#";

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background Grid & Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 backdrop-blur-sm text-sm font-medium text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Available for New Opportunities
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Hello, I'm
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    {profileLoading ? (
                      <span className="inline-block w-48 h-14 bg-muted rounded-xl animate-pulse align-middle" />
                    ) : (
                      displayName || "Developer"
                    )}
                  </span>
                </h1>

                <div className="text-xl sm:text-2xl font-medium text-foreground h-8 flex items-center gap-2">
                  <span>I am a</span>
                  <span className="text-primary font-bold">
                    <Typewriter
                      words={displayRoles}
                      loop={true}
                      cursor
                      cursorStyle='_'
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={1500}
                    />
                  </span>
                </div>

                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mt-4">
                  {displayDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <NavLink
                  to="/projects"
                  className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25"
                >
                  View My Work
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </NavLink>
                <NavLink
                  to="/contact"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-border hover:bg-muted transition-colors"
                >
                  Hire Me
                </NavLink>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-border/50">
                {[
                  { value: "5+", label: "Years Exp" },
                  { value: "30+", label: "Projects" },
                  { value: "15+", label: "Clients" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
            >
              <div className="relative w-72 h-[400px] sm:w-80 sm:h-[480px] lg:w-[400px] rounded-3xl overflow-hidden border border-border shadow-2xl">
                {profileLoading ? (
                  <div className="w-full h-full bg-muted animate-pulse" />
                ) : (
                  <ImageWithFallback
                    src={displayImage}
                    alt={displayName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <ChevronDown size={16} />
        </button>
      </section>

      {/* ─── About Me Section ─── */}
      <section ref={aboutRef} className="py-24 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-primary font-medium tracking-wider uppercase text-sm">About</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-2">About Me</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                {displayAbout.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {!displayAbout.includes('\n') && !profile?.aboutMe && (
                  <p>
                    My journey started with a deep curiosity for how things work on the internet, which led me to master technologies like React.js, Node.js, MongoDB, and Flutter. I believe great software isn't just about code — it's about crafting experiences that are intuitive, beautiful, and impactful.
                  </p>
                )}
              </div>
              <NavLink
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-foreground text-background hover:opacity-90 transition-all shadow-lg"
              >
                Get In Touch
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </motion.div>

            {/* Right: Interested Skills card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-md mx-auto lg:ml-auto p-8 rounded-3xl bg-background border border-border shadow-xl space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">My Interests</h3>
                <p className="text-sm text-muted-foreground mb-6">Technologies and fields I am currently exploring or passionate about.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {interests.map((skill, index) => (
                  <motion.div
                    key={skill._id || skill.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 group hover:bg-background hover:shadow-md hover:border-primary/30 transition-all duration-300"
                  >
                    <div className={`p-2.5 rounded-xl ${skill.bg || 'bg-primary/10'} ${skill.color || 'text-primary'} group-hover:scale-110 transition-transform duration-300`}>
                      <IconRenderer icon={skill.icon} size={20} />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{skill.title}</span>
                  </motion.div>
                ))}
                {interests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">No interests added yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Technology Section ─── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Tech Stack</span>
            <h2 className="text-4xl sm:text-5xl font-bold">Technologies I Use</h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-lg">
              I work with a modern and carefully chosen set of tools and frameworks to build robust, scalable applications.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {technologies.map((tech, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                key={tech._id || tech.technologyName || i}
                className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-default"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  <IconRenderer icon={tech.iconPath} size={40} />
                </span>
                <span className="text-sm font-medium text-center">{tech.technologyName}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Journey Timeline Section ─── */}
      <section className="py-24 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Experience</span>
            <h2 className="text-4xl sm:text-5xl font-bold">My Journey</h2>
          </div>

          <div className="relative">
            {/* Animated Vertical line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 w-px bg-border origin-top"
            />

            <div className="space-y-12">
              {journey.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item._id || item.year}
                    className={`relative flex items-start gap-8 ${isEven ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                  >
                    {/* Dot */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full mt-5 border-4 border-background bg-primary z-10"
                    />

                    {/* Spacer */}
                    <div className="hidden sm:block flex-1" />

                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: false, amount: 0.2, margin: "-50px" }}
                      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                      className="ml-14 sm:ml-0 flex-1 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                          {item.year}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {item.label || item.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CV Section ─── */}
      <section className="py-32 px-6 lg:px-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)]" />
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold">Get My CV</h2>
          <p className="text-lg max-w-md mx-auto opacity-80">
            Download my complete resume to learn more about my experience, skills, and achievements in detail.
          </p>
          {profileLoading ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-background/20 text-primary-foreground">
              <Loader2 size={20} className="animate-spin" /> Loading...
            </div>
          ) : (
            <a
              href={cvUrl}
              target={cvUrl !== "#" ? "_blank" : undefined}
              rel="noreferrer"
              download={cvUrl !== "#"}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-background text-foreground hover:bg-background/90 transition-all shadow-lg ${cvUrl === "#" ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
              {cvUrl === "#" ? "CV Not Uploaded Yet" : "Download CV"}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
