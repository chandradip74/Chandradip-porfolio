import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router";
import { ArrowRight, Download, ChevronDown, Loader2, Code2 } from "lucide-react";
import { motion } from "motion/react";
import { Typewriter } from "react-simple-typewriter";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";
import { JourneySkeleton, TechnologiesSkeleton } from "../components/Skeletons";

const FALLBACK_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

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
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [techLoading, setTechLoading] = useState(true);
  const [techPage, setTechPage] = useState(1);
  const TECH_PER_PAGE = 8;
  const [interests, setInterests] = useState<any[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(true);

  useEffect(() => {
    api.get('/profile')
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to fetch profile:', err))
      .finally(() => setProfileLoading(false));

    api.get('/journey')
      .then(data => { if (data?.length > 0) setJourney(data); })
      .catch(() => { })
      .finally(() => setJourneyLoading(false));

    api.get('/technologies')
      .then(data => { if (data?.length > 0) setTechnologies(data); })
      .catch(() => { })
      .finally(() => setTechLoading(false));

    api.get('/interests')
      .then(data => { if (data?.length > 0) setInterests(data); })
      .catch(() => { })
      .finally(() => setInterestsLoading(false));
  }, []);

  const displayName = profile?.name || "Chandradipsinh";
  const displayRoles = profile?.role?.length ? profile.role : ['Full Stack Developer', 'Web Developer', 'Database Designer'];
  const displayDescription = profile?.description || "I craft elegant, high-performance web and mobile applications. Specializing in modern frameworks to turn complex ideas into seamless digital experiences.";
  const displayAbout = profile?.aboutMe || "I'm a passionate Full-Stack Developer with years of experience building modern web and mobile applications. I specialize in creating clean, scalable, and high-performance digital products that solve real-world problems.";

  const cvUrl = profile?.cvFile || "#";

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (cvUrl === "#") {
      e.preventDefault();
      return;
    }
    
    // We try to fetch and download as a blob to force the download dialogue
    // If it fails (e.g. CORS), we let the default link behavior happen (new tab)
    try {
      e.preventDefault();
      const response = await fetch(cvUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      const cleanName = (profile?.name || "Portfolio").replace(/\s+/g, "_");
      a.download = `${cleanName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download via blob, opening in new tab", error);
      window.open(cvUrl, '_blank');
    }
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300">

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[calc(100vh-56px)] flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        {/* Glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for New Opportunities
              </div>

              {/* Heading */}
              <div className="space-y-3 flex flex-col items-center">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Hello, I'm{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/50">
                    {profileLoading ? (
                      <span className="inline-block w-48 h-12 sm:h-16 bg-muted rounded-xl animate-pulse align-middle" />
                    ) : (
                      displayName
                    )}
                  </span>
                </h1>

                <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground h-9 flex items-center gap-2 justify-center">
                  <span>I am a</span>
                  <span className="text-foreground font-bold">
                    <Typewriter
                      key={displayRoles.join(',')}
                      words={displayRoles}
                      loop={true}
                      cursor
                      cursorStyle='|'
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={1500}
                    />
                  </span>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mt-2">
                  {displayDescription}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 justify-center mt-2">
                <NavLink
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all text-sm shadow-lg"
                >
                  View My Work
                  <ArrowRight size={16} />
                </NavLink>
                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm"
                >
                  Hire Me
                </NavLink>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        >
          <span className="text-xs tracking-widest uppercase font-medium hidden sm:block">Scroll</span>
          <ChevronDown size={16} />
        </button>
      </section>

      {/* ─── About Me Section ─── */}
      <section ref={aboutRef} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-center lg:text-left"
            >
              <div>
                <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">About</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">About Me</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
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
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-foreground text-background hover:opacity-90 transition-all shadow text-sm"
              >
                Get In Touch
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </motion.div>

            {/* Interests Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-md mx-auto lg:ml-auto p-6 rounded-2xl bg-background border border-border shadow-sm space-y-5"
            >
              <div>
                <h3 className="text-lg font-bold mb-1">My Interests</h3>
                <p className="text-xs text-muted-foreground">Technologies and fields I'm currently exploring.</p>
              </div>

              {interestsLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border animate-pulse">
                      <div className="w-9 h-9 rounded-lg bg-muted" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {interests.map((skill, index) => (
                    <motion.div
                      key={skill._id || skill.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all duration-200"
                    >
                      <div className={`p-2 rounded-lg ${skill.bg || 'bg-muted'} ${skill.color || 'text-foreground'} flex-shrink-0`}>
                        <IconRenderer icon={skill.icon} size={16} />
                      </div>
                      <span className="font-medium text-sm">{skill.title}</span>
                    </motion.div>
                  ))}
                  {interests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 italic">No interests added yet.</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Technology Section ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">Tech Stack</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Technologies I Use</h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-base sm:text-lg">
              I work with a modern and carefully chosen set of tools and frameworks.
            </p>
          </div>

          {techLoading ? (
            <TechnologiesSkeleton />
          ) : (() => {
            const totalPages = Math.ceil(technologies.length / TECH_PER_PAGE);
            const paged = technologies.slice((techPage - 1) * TECH_PER_PAGE, techPage * TECH_PER_PAGE);
            return (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {paged.map((tech, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      key={tech._id || tech.technologyName || i}
                      className="group flex flex-col items-center gap-3 p-5 sm:p-7 rounded-xl bg-card border border-border hover:border-foreground/30 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
                    >
                      <span
                        className={`text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 ${(!tech.colorClass?.startsWith('#') && !tech.colorClass?.startsWith('rgb')) ? tech.colorClass : ''}`}
                        style={(tech.colorClass?.startsWith('#') || tech.colorClass?.startsWith('rgb')) ? { color: tech.colorClass } : undefined}
                      >
                        <IconRenderer icon={tech.iconPath} size={36} />
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">{tech.technologyName}</span>
                    </motion.div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setTechPage(p => Math.max(1, p - 1))}
                      disabled={techPage === 1}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setTechPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${page === techPage
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setTechPage(p => Math.min(totalPages, p + 1))}
                      disabled={techPage === totalPages}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* ─── Journey Timeline Section ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card border-t border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">Experience</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">My Journey</h2>
          </div>

          {journeyLoading ? (
            <JourneySkeleton />
          ) : (
            <div className="relative">
              {/* Animated Vertical line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 w-px bg-border origin-top"
              />

              <div className="space-y-10">
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
                        transition={{ duration: 0.4 }}
                        className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-3.5 h-3.5 rounded-full mt-5 border-2 border-background bg-foreground z-10"
                      />

                      {/* Spacer */}
                      <div className="hidden sm:block flex-1" />

                      {/* Card */}
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                        className="ml-14 sm:ml-0 flex-1 p-5 rounded-xl bg-background border border-border shadow-sm hover:border-foreground/20 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                            {item.year}
                          </span>
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${(!item.labelColor?.startsWith('#') && !item.labelColor?.startsWith('rgb')) ? (item.labelColor || 'text-muted-foreground') : ''}`}
                            style={(item.labelColor?.startsWith('#') || item.labelColor?.startsWith('rgb')) ? { color: item.labelColor } : undefined}
                          >
                            {item.label || item.badge}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CV Section ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-card border border-border mb-2">
            <Code2 size={24} className="text-foreground" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Get My CV</h2>
          <p className="text-base sm:text-lg max-w-md mx-auto text-muted-foreground">
            Download my complete resume to learn more about my experience, skills, and achievements in detail.
          </p>
          {profileLoading ? (
            <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg font-semibold bg-card border border-border text-foreground">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : (
            <a
              href={cvUrl}
              onClick={handleDownload}
              target={cvUrl !== "#" ? "_blank" : undefined}
              rel="noreferrer"
              className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg text-sm ${cvUrl === "#" ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              {cvUrl === "#" ? "CV Not Uploaded Yet" : "Download CV"}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
