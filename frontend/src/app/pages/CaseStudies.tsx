import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, BookOpen, Search, ArrowRight, Lightbulb } from "lucide-react";
import { api } from "../lib/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: number;
  published: boolean;
  createdAt: string;
}

export default function CaseStudies() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    api.get("/blogs")
      .then(data => {
        // Only keep Case Studies
        setBlogs(data.filter((b: Blog) => b.category === "Case Study"));
      })
      .catch(err => console.error("Failed to fetch case studies:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter(b => {
    return b.title.toLowerCase().includes(search.toLowerCase()) ||
           b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
           b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-20 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-7xl mx-auto text-center space-y-4 z-10"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-border bg-muted text-muted-foreground">
            <Lightbulb size={13} /> Problem Solving & Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">Case Studies</h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Deep dives into complex engineering challenges, architectural trade-offs, and my academic research.
          </p>
        </motion.div>
      </section>

      {/* ── Search Bar ── */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 sticky top-14 z-30 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search case studies by topic, technology, or keywords…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── Case Study Cards ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-card border border-border animate-pulse flex flex-col md:flex-row min-h-[250px]">
                  <div className="h-48 md:h-auto md:w-1/3 bg-muted" />
                  <div className="p-8 space-y-4 md:w-2/3 flex flex-col justify-center">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground/60" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">No case studies found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {search ? "Try adjusting your search terms." : "I haven't published any case studies yet. Check back soon!"}
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-8 sm:space-y-12">
              <AnimatePresence>
                {paged.map((blog, i) => (
                  <motion.article
                    layout
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group flex flex-col md:flex-row rounded-3xl overflow-hidden bg-card border border-border shadow-md hover:shadow-2xl hover:border-primary/50 transition-all duration-500 min-h-[300px]"
                  >
                    {/* Cover */}
                    <div className="relative h-64 md:h-auto md:w-2/5 overflow-hidden bg-muted flex-shrink-0">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <BookOpen className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/90 md:from-card/90 via-background/40 md:via-transparent to-transparent opacity-60 md:opacity-0 transition-opacity duration-300" />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-8 sm:p-10 justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                          Case Study
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Clock size={14} />{blog.readTime} min read
                        </span>
                      </div>

                      <div className="space-y-4 mb-6">
                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {blog.title}
                        </h3>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {blog.tags.slice(0, 4).map((t, idx) => (
                            <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-md border border-border bg-muted/50 text-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-border/60 flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                        <NavLink
                          to={`/blog/${blog.slug}`}
                          className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all duration-300"
                        >
                          Read Case Study
                          <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </NavLink>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold border transition-colors ${pg === page ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border bg-card text-foreground hover:bg-muted"}`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
