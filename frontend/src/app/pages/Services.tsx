import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import {
  Code2, Smartphone, Globe, Database, Palette, ShieldCheck,
  ArrowRight, Zap, Loader2, Briefcase,
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";


// Custom icon lookup removed in favor of dynamic IconRenderer

const process = [
  { step: "01", title: "Discovery", description: "Understanding your goals, target audience, and project requirements in detail." },
  { step: "02", title: "Planning", description: "Architecting the solution, defining milestones, and setting clear deliverables." },
  { step: "03", title: "Development", description: "Building with clean, tested, and maintainable code using modern best practices." },
  { step: "04", title: "Delivery", description: "Thorough testing, smooth deployment, and ongoing support post-launch." },
];

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(data => {
        if (data && data.length > 0) setServices(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
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
            What I Offer
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-primary-foreground">
            My Services
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            I offer a comprehensive range of development and design services — crafting
            tailored digital solutions that are fast, scalable, and beautifully designed.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-24 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading services...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={service._id || service.title}
                    className="group relative p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-default"
                  >
                    {/* Image */}
                    <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden bg-muted">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Tags */}
                    {service.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {service.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/50 group-hover:bg-primary/5 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Hover arrow */}
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 text-primary">
                      <ArrowRight size={24} />
                    </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 lg:px-12 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">How I Work</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">My Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={item.step}
                className="p-8 rounded-3xl relative overflow-hidden group bg-background border border-border shadow-sm hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <div className="text-6xl font-bold mb-6 text-muted group-hover:text-primary-foreground/20 transition-colors duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary-foreground transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-primary-foreground/80 transition-colors duration-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8 relative z-10"
        >
          <div className="inline-flex p-4 rounded-2xl bg-background/10 backdrop-blur-md mb-4">
            <Zap size={32} className="text-primary-foreground" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Ready to Start?
          </h2>
          <p className="text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
            Have a project in mind? Let's collaborate and turn your vision into a stunning digital reality.
          </p>
          <NavLink
            to="/contact"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-background text-foreground hover:bg-background/90 transition-all shadow-lg hover:shadow-background/20 hover:-translate-y-1"
          >
            Let's Work Together
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </motion.div>
      </section>
    </div>
  );
}
