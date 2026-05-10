import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Tag, BookOpen, Search, ArrowRight } from "lucide-react";
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

const CATEGORY_COLORS: Record<string, string> = {
  General:      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Tech:         "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Tutorial:     "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Career:       "bg-green-500/10 text-green-600 dark:text-green-400",
  Design:       "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Open Source":"bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    api.get("/blogs")
      .then(data => setBlogs(data))
      .catch(err => console.error("Failed to fetch blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  const blogPosts = blogs.filter(b => b.category !== "Case Study");
  const categories = ["All", ...Array.from(new Set(blogPosts.map(b => b.category)))];

  const filtered = blogPosts.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "All" || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (c: string) => { setActiveCategory(c); setPage(1); };

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-background/5 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center space-y-6 z-10"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 ">
            Writing & Thoughts
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground">Blog</h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            Insights, tutorials, and stories from my journey in tech and development.
          </p>
        </motion.div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 sticky top-16 sm:top-20 z-30 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => handleCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-card border border-border animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-4/5" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-4">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-xl text-muted-foreground">
                {search || activeCategory !== "All" ? "No posts match your filters." : "No blog posts yet."}
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {paged.map((blog, i) => (
                  <motion.article
                    layout
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-500"
                  >
                    {/* Cover */}
                    <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <BookOpen className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.General}`}>
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                          <Clock size={11} />{blog.readTime} min
                        </span>
                      </div>

                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {blog.tags.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <NavLink
                          to={`/blog/${blog.slug}`}
                          className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          Read
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
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
            <div className="flex items-center justify-center gap-2 mt-14">
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
                  className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${pg === page ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-foreground hover:bg-muted"}`}
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
        </div>
      </section>
    </div>
  );
}
