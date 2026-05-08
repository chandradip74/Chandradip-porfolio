import { useState, useEffect } from "react";
import { Award, ExternalLink, Star, Trophy, GraduationCap, Zap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";


interface Achievement {
  _id: string;
  title: string;
  description: string;
  certificateImage: string;
  imageUrl: string;
  certificateTag: string;
  companyName: string;
  iconPath: string;
}

const TAG_COLORS: Record<string, string> = {
  Cloud: 'bg-blue-500/10 text-blue-500',
  Frontend: 'bg-cyan-500/10 text-cyan-500',
  Backend: 'bg-green-500/10 text-green-500',
  Database: 'bg-orange-500/10 text-orange-500',
  Mobile: 'bg-purple-500/10 text-purple-500',
  Design: 'bg-pink-500/10 text-pink-500',
  Security: 'bg-red-500/10 text-red-500',
  AI: 'bg-violet-500/10 text-violet-500',
};

const NOTABLE_ACHIEVEMENTS = [
  {
    icon: Trophy,
    title: "Hackathon Winner",
    description: "1st place at CityTech Hackathon 2024 — built an AI-powered productivity app in 24 hours.",
    year: "2024",
  },
  {
    icon: Star,
    title: "Top Rated Freelancer",
    description: "Achieved Top Rated Plus status on Upwork with 100% job success score across 25+ projects.",
    year: "2024",
  },
  {
    icon: GraduationCap,
    title: "Dean's List",
    description: "Graduated BSc Computer Science with First Class Honours from State University.",
    year: "2022",
  },
  {
    icon: Zap,
    title: "Open Source Contributor",
    description: "Contributed to 10+ open-source projects with 200+ GitHub stars on personal repositories.",
    year: "2023",
  },
];

export default function Achievement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/achievements')
      .then(data => setAchievements(data))
      .catch(err => console.error('Failed to fetch achievements:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-background/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center space-y-6 z-10"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 backdrop-blur-md">
            Credentials
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground">
            Achievements
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            Certifications, awards, and milestones that reflect my commitment to
            continuous learning and excellence in software development.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 pt-10 border-t border-primary-foreground/10 mt-10">
            {[
              { value: `${achievements.length || "—"}+`, label: "Certificates" },
              { value: "4+", label: "Awards" },
              { value: "200+", label: "GitHub Stars" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-primary-foreground">{s.value}</p>
                <p className="text-sm font-medium tracking-wide mt-2 text-primary-foreground/60 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Notable Achievements */}
      <section className="py-24 px-6 lg:px-12 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Awards & Honors</span>
            <h2 className="text-4xl font-bold text-foreground">Notable Achievements</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NOTABLE_ACHIEVEMENTS.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={item.title}
                className="group p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:bg-primary hover:border-primary transition-all duration-300 cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground transition-all duration-300">
                  <item.icon size={26} />
                </div>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary-foreground/60 transition-colors uppercase tracking-wider">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-4 text-foreground group-hover:text-primary-foreground transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates / Achievements from DB */}
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Professional</span>
            <h2 className="text-4xl font-bold text-foreground">Certificates</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading certificates...</span>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No certificates added yet.</p>
              <p className="text-sm text-muted-foreground">Add certificates from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((cert, index) => {
                const tagColor = TAG_COLORS[cert.certificateTag] || 'bg-accent text-accent-foreground';
                const certImage = cert.imageUrl || cert.certificateImage;

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={cert._id}
                    className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    {/* Top colored band or Image */}
                    {certImage ? (
                      <div className="h-40 w-full overflow-hidden bg-muted">
                        <img
                          src={certImage}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-2 w-full bg-primary" />
                    )}

                    <div className="p-8 flex flex-col gap-4">
                      {/* Icon + Tag row */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-yellow-500/10 text-yellow-500">
                          <IconRenderer icon={cert.iconPath} size={24} />
                        </div>
                        {cert.certificateTag && (
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${tagColor}`}>
                            {cert.certificateTag}
                          </span>
                        )}
                      </div>

                      {/* Title + Company */}
                      <div>
                        <h3 className="text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                          {cert.title}
                        </h3>
                        {cert.companyName && (
                          <p className="text-sm font-medium text-blue-500 mt-1">{cert.companyName}</p>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {cert.description}
                      </p>

                      {/* Bottom action */}
                      {certImage && (
                        <div className="mt-auto pt-4 border-t border-border/50">
                          <a
                            href={certImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground text-sm font-semibold transition-all duration-300"
                          >
                            <Award size={16} />
                            View Certificate
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
