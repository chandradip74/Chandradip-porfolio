import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Code2, ArrowRight, Zap, Search } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { IconRenderer } from "../components/ui/IconRenderer";
import { ServicesGridSkeleton, ProcessSkeleton } from "../components/Skeletons";

const SERVICES_PER_PAGE = 6;

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [process, setProcess] = useState<any[]>([]);
  const [processLoading, setProcessLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/services')
      .then(data => { if (data?.length > 0) setServices(data); })
      .catch(() => {})
      .finally(() => setServicesLoading(false));

    api.get('/process')
      .then(data => { if (data?.length > 0) setProcess(data); })
      .catch(() => {})
      .finally(() => setProcessLoading(false));
  }, []);

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase()) ||
    s.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / SERVICES_PER_PAGE);
  const paged = filtered.slice((page - 1) * SERVICES_PER_PAGE, page * SERVICES_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
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
            What I Offer
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground">
            My Services
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-primary-foreground/70 leading-relaxed">
            I offer a comprehensive range of development and design services — crafting
            tailored digital solutions that are fast, scalable, and beautifully designed.
          </p>
        </motion.div>
      </section>

      {/* Search bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 sticky top-16 sm:top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              id="services-search"
              placeholder="Search services by name, description or tag..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          {servicesLoading ? (
            <ServicesGridSkeleton />
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No services added yet.</p>
              <p className="text-sm text-muted-foreground">Add services from the admin panel.</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 space-y-3"
            >
              <Search className="w-14 h-14 text-muted-foreground mx-auto" />
              <p className="text-xl text-muted-foreground">No services match your search.</p>
              <button
                onClick={() => handleSearch("")}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paged.map((service, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={service._id || service.title}
                    className="group relative p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-default"
                  >
                    {/* Image */}
                    <div className="w-full h-40 sm:h-48 rounded-2xl mb-5 sm:mb-6 overflow-hidden bg-muted">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
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
                    <div className="absolute top-6 sm:top-8 right-6 sm:right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 text-primary">
                      <ArrowRight size={24} />
                    </div>
                  </motion.div>
                ))}
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
          )}
        </div>
      </section>

      {/* Process Section — Dynamic */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sm:mb-20 space-y-3 sm:space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">How I Work</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">My Process</h2>
          </div>

          {processLoading ? (
            <ProcessSkeleton />
          ) : process.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No process steps added yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Add them from the admin panel → Process.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {process.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={item._id || item.step}
                  className="p-6 sm:p-8 rounded-3xl relative overflow-hidden group bg-background border border-border shadow-sm hover:bg-primary hover:border-primary transition-all duration-300"
                >
                  <div className="text-5xl sm:text-6xl font-bold mb-4 sm:mb-6 text-muted group-hover:text-primary-foreground/20 transition-colors duration-300 select-none">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary-foreground transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-primary-foreground/80 transition-colors duration-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10"
        >
          <div className="inline-flex p-4 rounded-2xl bg-background/10 backdrop-blur-md mb-4">
            <Zap size={28} className="text-primary-foreground" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
            Ready to Start?
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
            Have a project in mind? Let's collaborate and turn your vision into a stunning digital reality.
          </p>
          <NavLink
            to="/contact"
            className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold bg-background text-foreground hover:bg-background/90 transition-all shadow-lg hover:shadow-background/20 hover:-translate-y-1 text-sm sm:text-base"
          >
            Let's Work Together
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </motion.div>
      </section>
    </div>
  );
}
