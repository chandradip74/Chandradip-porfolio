import { useState, useEffect } from "react";
import { Award, ExternalLink, Trophy, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";
import { AchievementsSkeleton } from "../components/Skeletons";


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

interface Stat {
  _id?: string;
  label: string;
  value: string;
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

export default function Achievement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    api.get('/achievements')
      .then(data => setAchievements(data))
      .catch(err => console.error('Failed to fetch achievements:', err))
      .finally(() => setLoading(false));

    api.get('/stats')
      .then(data => { if (data?.length > 0) setStats(data); })
      .catch(() => {});
  }, []);

  const heroStats = stats.length > 0
    ? stats.slice(0, 3)
    : [
        { label: "Certificates", value: `${achievements.length || "—"}+` },
        { label: "Projects Done", value: "30+" },
        { label: "Happy Clients", value: "15+" },
      ];

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-background/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center space-y-4 sm:space-y-6 z-10"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 backdrop-blur-md">
            Credentials
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground">
            Achievements
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            Certifications, awards, and milestones that reflect my commitment to
            continuous learning and excellence in software development.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-8 sm:pt-10 border-t border-primary-foreground/10 mt-8 sm:mt-10">
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary-foreground">{s.value}</p>
                <p className="text-xs sm:text-sm font-medium tracking-wide mt-2 text-primary-foreground/60 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>



      {/* Certificates / Achievements from DB */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Professional</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Certificates</h2>
          </div>

          {loading ? (
            <AchievementsSkeleton />
          ) : achievements.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No certificates added yet.</p>
              <p className="text-sm text-muted-foreground">Add certificates from the admin panel.</p>
            </div>
          ) : (() => {
            const totalPages = Math.ceil(achievements.length / ITEMS_PER_PAGE);
            const paged = achievements.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {paged.map((cert, index) => {
                const tagColor = TAG_COLORS[cert.certificateTag] || 'bg-accent text-accent-foreground';
                const certImage = cert.certificateImage || cert.imageUrl;

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    key={cert._id}
                    className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    {/* Top image or accent bar */}
                    {certImage ? (
                      <div className="h-36 sm:h-40 w-full overflow-hidden bg-muted">
                        <img
                          src={certImage}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-2 w-full bg-primary" />
                    )}

                    <div className="p-6 sm:p-8 flex flex-col gap-3 sm:gap-4">
                      {/* Icon + Tag row */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center bg-yellow-500/10 text-yellow-500 flex-shrink-0">
                          <IconRenderer icon={cert.iconPath} size={22} />
                        </div>
                        {cert.certificateTag && (
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${tagColor}`}>
                            {cert.certificateTag}
                          </span>
                        )}
                      </div>

                      {/* Title + Company */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
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
                            className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground text-sm font-semibold transition-all duration-300"
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                          pg === page
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border bg-card text-foreground hover:bg-muted'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
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
    </div>
  );
}

