import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock, Tag, Calendar, BookOpen, ChevronRight } from "lucide-react";
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

/* ─── Lightweight content renderer ───────────────────────────────────────── */
function renderContent(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let keyIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ───────────────────────────────────────────────────
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "code";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={keyIdx++} className="my-6 rounded-xl overflow-hidden border border-border">
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/80 border-b border-border">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{lang}</span>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <span className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
          </div>
          <pre className="overflow-x-auto p-5 bg-[#0d1117] dark:bg-[#0d1117] text-[#e6edf3] text-sm leading-relaxed font-mono">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // ── Headings ────────────────────────────────────────────────────────────
    if (line.startsWith("### ")) {
      elements.push(<h3 key={keyIdx++} className="text-xl font-bold mt-8 mb-3 text-foreground">{parseLine(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={keyIdx++} className="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border pb-2">{parseLine(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={keyIdx++} className="text-3xl font-bold mt-10 mb-4 text-foreground">{parseLine(line.slice(2))}</h1>);
      i++; continue;
    }

    // ── Unordered list ──────────────────────────────────────────────────────
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={keyIdx++} className="my-4 space-y-2 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-foreground/85">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span>{parseLine(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // ── Ordered list ────────────────────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={keyIdx++} className="my-4 space-y-2 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-foreground/85">
              <span className="mt-0.5 min-w-[1.5rem] h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
              <span>{parseLine(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // ── Blockquote ──────────────────────────────────────────────────────────
    if (line.startsWith("> ")) {
      const quotes: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quotes.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={keyIdx++} className="my-6 pl-5 border-l-4 border-primary bg-primary/5 rounded-r-xl py-4 pr-4 italic text-foreground/80">
          {quotes.map((q, idx) => <p key={idx}>{parseLine(q)}</p>)}
        </blockquote>
      );
      continue;
    }

    // ── Divider ─────────────────────────────────────────────────────────────
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={keyIdx++} className="my-8 border-border" />);
      i++; continue;
    }

    // ── Empty line → spacer ─────────────────────────────────────────────────
    if (line.trim() === "") {
      elements.push(<div key={keyIdx++} className="my-2" />);
      i++; continue;
    }

    // ── Normal paragraph ────────────────────────────────────────────────────
    elements.push(
      <p key={keyIdx++} className="my-3 text-foreground/85 leading-[1.85] text-[1.05rem]">
        {parseLine(line)}
      </p>
    );
    i++;
  }

  return elements;
}

/* Inline: **bold**, `code`, *italic* */
function parseLine(text: string): React.ReactNode {
  // Split on `code`, **bold**, *italic*
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm text-primary border border-border">{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}
/* ─────────────────────────────────────────────────────────────────────────── */

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/blogs/${slug}`)
      .then(data => setBlog(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="bg-background min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse">
        <div className="h-6 w-24 bg-muted rounded-full" />
        <div className="h-10 bg-muted rounded-xl w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="h-72 bg-muted rounded-2xl" />
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`h-4 bg-muted rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />)}
      </div>
    </div>
  );

  /* ── Not found ── */
  if (notFound || !blog) return (
    <div className="bg-background min-h-screen pt-20 flex flex-col items-center justify-center gap-6 text-center px-4">
      <BookOpen className="w-16 h-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
      <p className="text-muted-foreground">This blog post doesn't exist or has been removed.</p>
      <NavLink to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
        <ArrowLeft size={16} /> Back to Blog
      </NavLink>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ── Cover image hero ── */}
      {blog.coverImage && (
        <div className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 text-sm text-muted-foreground ${blog.coverImage ? "-mt-8 relative z-10" : "pt-24"}`}
        >
          <NavLink to="/blog" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Blog
          </NavLink>
          <ChevronRight size={14} className="text-border" />
          <span className="truncate text-foreground/60">{blog.title}</span>
        </motion.div>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 mb-10 space-y-5"
        >
          {/* Category + meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.General}`}>
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} /> {blog.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar size={12} />
              {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 italic">
            {blog.excerpt}
          </p>
        </motion.header>

        {/* ── Content ── */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pb-20"
        >
          <div className="prose-content">
            {renderContent(blog.content)}
          </div>

          {/* ── Tags footer ── */}
          {blog.tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors">
                    <Tag size={12} className="text-primary" />#{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Back link ── */}
          <div className="mt-12">
            <NavLink
              to="/blog"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to all posts
            </NavLink>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
