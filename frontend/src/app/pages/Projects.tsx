import { useState, useEffect } from "react";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

const PROJECT_IMAGES = {
  dashboard:
    "https://images.unsplash.com/photo-1648134859187-71dadc9f815a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBhcHAlMjBkYXNoYm9hcmQlMjBVSSUyMHByb2plY3R8ZW58MXx8fHwxNzc4MDczMDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ecommerce:
    "https://images.unsplash.com/photo-1767449181027-dbca7575f91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBlY29tbWVyY2UlMjBkZXNpZ258ZW58MXx8fHwxNzc4MDczMDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  analytics:
    "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwcGxhdGZvcm0lMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc3ODA3MzA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  social:
    "https://images.unsplash.com/photo-1777503810337-e78757a41278?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBsYXRmb3JtJTIwbW9kZXJuJTIwZGVzaWdufGVufDF8fHx8MTc3ODA3MzA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
};

const allProjects = [
  {
    id: 1,
    title: "ProTask — Project Management Dashboard",
    description:
      "A comprehensive project management web app featuring kanban boards, team collaboration, real-time updates, and advanced reporting. Built for modern remote teams.",
    image: PROJECT_IMAGES.dashboard,
    category: "Web App",
    technologies: ["React.js", "Node.js", "MongoDB", "Socket.io", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "ShopFlow — E-Commerce Mobile App",
    description:
      "A full-featured cross-platform e-commerce application with product catalogues, cart management, payment integration, and order tracking built with Flutter.",
    image: PROJECT_IMAGES.ecommerce,
    category: "Mobile App",
    technologies: ["Flutter", "Dart", "Firebase", "Stripe API"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 3,
    title: "DataPulse — Analytics Platform",
    description:
      "A real-time data analytics and visualization platform that transforms complex datasets into actionable insights with interactive charts and custom dashboards.",
    image: PROJECT_IMAGES.analytics,
    category: "Web App",
    technologies: ["React.js", "D3.js", "Express.js", "PostgreSQL", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 4,
    title: "SocialHub — Community Platform",
    description:
      "A modern social networking platform with user profiles, posts, stories, direct messaging, and notifications — designed for niche online communities.",
    image: PROJECT_IMAGES.social,
    category: "Full Stack",
    technologies: ["Next.js", "Node.js", "MongoDB", "AWS S3", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const categories = ["All", "Web App", "Mobile App", "Full Stack"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [dbProjects, setDbProjects] = useState<any[]>(allProjects);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDbProjects(data);
        }
      })
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

  const filtered =
    activeFilter === "All"
      ? dbProjects
      : dbProjects.filter((p) => (p.category || 'Web App') === activeFilter);

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

      {/* Filter */}
      <section className="py-8 px-6 lg:px-12 sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-80 overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    <span className="absolute top-4 left-4 text-xs font-semibold px-4 py-1.5 rounded-full bg-background/90 text-foreground backdrop-blur-sm border border-border/50">
                      {project.category}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <a
                        href={project.githubUrl}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-background/90 text-foreground backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                        aria-label="GitHub"
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={project.liveUrl}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-background/90 text-foreground backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
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
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-6 mt-auto border-t border-border/50">
                      <a
                        href={project.liveUrl}
                        className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        View Project Details
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-lg text-muted-foreground">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
