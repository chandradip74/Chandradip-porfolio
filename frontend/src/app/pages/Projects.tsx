import { useState, useEffect } from "react";
import { ExternalLink, ArrowRight, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";
import { ProjectsSkeleton } from "../components/Skeletons";


interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  projectLink: string;
  technologies: string[];
}

const GRADIENT_COLORS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-purple-500 to-pink-600',
  'from-yellow-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-green-600',
];

const getGradient = (title: string) => {
  const code = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENT_COLORS[code % GRADIENT_COLORS.length];
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-background/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center space-y-6 z-10"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 backdrop-blur-md">
            My Work
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground">
            Projects
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            A curated selection of projects that showcase my expertise in building
            modern, scalable, and visually stunning digital products.
          </p>
        </motion.div>
      </section>

      {/* Search bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 sticky top-16 sm:top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <ProjectsSkeleton />
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 space-y-4"
            >
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-xl text-muted-foreground">No projects found.</p>
              <p className="text-sm text-muted-foreground">Add projects from the admin panel.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AnimatePresence>
                {filtered.map((project) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={project._id}
                    className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-500"
                  >
                    {/* Image / Gradient Thumbnail */}
                    <div className="relative h-64 sm:h-80 overflow-hidden bg-muted">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getGradient(project.title)} flex items-center justify-center`}>
                          <span className="text-white/80 font-bold text-2xl px-6 text-center">{project.title}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      {/* Action buttons overlay */}
                      {project.projectLink && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-background/90 text-foreground backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                            aria-label="Live Demo"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-8 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech stack */}
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto items-center">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/50 flex items-center justify-center min-w-8"
                            >
                              <IconRenderer icon={tech} size={18} />
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="pt-6 mt-auto border-t border-border/50">
                        {project.projectLink ? (
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            View Project
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No link available</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-lg text-muted-foreground">No projects match your search.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
