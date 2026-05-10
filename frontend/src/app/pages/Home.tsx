import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router";
import { ArrowRight, Download, ChevronDown, Loader2, Sparkles, MapPin, Code2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
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
  const displayImage = profile?.profileImage || FALLBACK_PROFILE_IMAGE;
  const cvUrl = profile?.cvFile || "#";

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Grid & Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[500px] lg:w-[800px] lg:h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full pt-12 pb-20">
          <div className="flex flex-col items-center justify-center text-center gap-10">
            {/* ── Center: Text content ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-6 sm:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted text-xs sm:text-sm font-medium text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for New Opportunities
              </div>

              <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  Hello, How Are You? I'm
                  <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                    {profileLoading ? (
                      <span className="inline-block w-40 sm:w-48 h-12 sm:h-14 bg-muted rounded-xl animate-pulse align-middle" />
                    ) : (
                      displayName || "Chandradipsinh"
                    )}
                  </span>
                </h1>

                <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground h-8 flex items-center gap-2 justify-center">
                  <span>I am a</span>
                  <span className="text-primary font-bold">
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

                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4">
                  {displayDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center mt-4">
                <NavLink
                  to="/projects"
                  className="flex items-center justify-center min-w-[160px] px-6 py-3.5 rounded-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all text-sm sm:text-base"
                >
                  View My Work
                </NavLink>
                <NavLink
                  to="/contact"
                  className="flex items-center justify-center min-w-[160px] px-6 py-3.5 rounded-lg font-medium bg-background text-foreground border border-border hover:bg-muted transition-colors text-sm sm:text-base"
                >
                  Hire Me
                </NavLink>
              </div>
            </motion.div>

            {/* ── Right: Premium Profile Image (Disabled temporarily) ── */}
            {false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, type: "spring", bounce: 0.3 }}
                className="flex justify-center relative"
              >
                {/* Outer glow ring */}
                <div className="relative">
                  {/* Animated rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-[2.5rem] border border-primary/20 border-dashed pointer-events-none"
                  />
                  {/* Second ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 rounded-[3rem] border border-primary/10 border-dashed pointer-events-none"
                  />

                  {/* Blob glow behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-2xl rounded-3xl scale-110 pointer-events-none" />

                  {/* Profile image card */}
                  <div className="relative w-64 h-[360px] sm:w-72 sm:h-[420px] lg:w-[340px] lg:h-[460px] rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                    {profileLoading ? (
                      <div className="w-full h-full bg-muted animate-pulse" />
                    ) : (
                      <>
                        <ImageWithFallback
                          src={displayImage}
                          alt={displayName || "Profile"}
                          className="w-full h-full object-cover object-top"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                      </>
                    )}
                  </div>

                  {/* Floating badge — Available */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-background border border-border shadow-xl text-xs sm:text-sm font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    Open to Work
                  </motion.div>

                  {/* Floating badge — Code */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="absolute -top-4 -right-4 sm:-top-5 sm:-right-6 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-primary text-primary-foreground  shadow-xl text-xs sm:text-sm font-medium"
                  >
                    <Code2 size={14} className="flex-shrink-0" />
                    Full Stack Dev
                  </motion.div>

                  {/* Floating sparkle */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 -right-8 sm:-right-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow"
                  >
                    <Sparkles size={16} />
                  </motion.div>

                  {/* Floating location */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/4 -left-8 sm:-left-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-background border border-border shadow text-xs font-medium text-muted-foreground"
                  >
                    <MapPin size={11} className="text-primary flex-shrink-0" />
                    India
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        >
          <span className="text-xs tracking-widest uppercase font-medium hidden sm:block">Scroll</span>
          <ChevronDown size={16} />
        </button>
      </section>

      {/* ─── About Me Section ─── */}
      <section ref={aboutRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8 text-center lg:text-left"
            >
              <div>
                <span className="text-primary font-medium tracking-wider uppercase text-sm">About</span>
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
                className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-medium bg-foreground text-background hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
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
              className="w-full max-w-md mx-auto lg:ml-auto p-6 sm:p-8 rounded-3xl bg-background border border-border shadow-xl space-y-5 sm:space-y-6"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1">My Interests</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Technologies and fields I'm currently exploring.</p>
              </div>

              {interestsLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-muted" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {interests.map((skill, index) => (
                    <motion.div
                      key={skill._id || skill.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-muted/50 border border-border/50 group hover:bg-background hover:shadow-md hover:border-primary/30 transition-all duration-300"
                    >
                      <div className={`p-2 sm:p-2.5 rounded-xl ${skill.bg || 'bg-primary/10'} ${skill.color || 'text-primary'} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <IconRenderer icon={skill.icon} size={18} />
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Tech Stack</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {paged.map((tech, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      key={tech._id || tech.technologyName || i}
                      className="group flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-default"
                    >
                      <span
                        className={`text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 ${(!tech.colorClass?.startsWith('#') && !tech.colorClass?.startsWith('rgb')) ? tech.colorClass : ''}`}
                        style={(tech.colorClass?.startsWith('#') || tech.colorClass?.startsWith('rgb')) ? { color: tech.colorClass } : undefined}
                      >
                        <IconRenderer icon={tech.iconPath} size={36} />
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-center">{tech.technologyName}</span>
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
                            ? 'bg-primary text-primary-foreground border-primary'
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
      <section className="py-24 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Experience</span>
            <h2 className="text-4xl sm:text-5xl font-bold">My Journey</h2>
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

              <div className="space-y-12">
                {journey.map((item, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div
                      key={item._id || item.year}
                      className={`relative flex items-start gap-8 ${isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                        }`}
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
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${(!item.labelColor?.startsWith('#') && !item.labelColor?.startsWith('rgb')) ? (item.labelColor || 'text-muted-foreground') : ''}`}
                            style={(item.labelColor?.startsWith('#') || item.labelColor?.startsWith('rgb')) ? { color: item.labelColor } : undefined}
                          >
                            {item.label || item.badge}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)]" />
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Get My CV</h2>
          <p className="text-base sm:text-lg max-w-md mx-auto opacity-80">
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
              className={`group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold bg-background text-foreground hover:bg-background transition-all shadow-lg text-sm sm:text-base ${cvUrl === "#" ? "opacity-60 cursor-not-allowed" : ""}`}
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
