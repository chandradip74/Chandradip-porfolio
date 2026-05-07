import { useState, useEffect } from "react";
import { Award, ExternalLink, Star, Trophy, GraduationCap, Zap } from "lucide-react";
import { motion } from "motion/react";
import { FaAws, FaReact, FaGoogle, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiFlutter } from "react-icons/si";

const certificates = [
  {
    id: 1,
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    date: "March 2025",
    category: "Cloud",
    description:
      "Validates technical expertise in developing and maintaining applications on AWS. Covers core AWS services, deployment, and best practices.",
    credentialId: "AWS-DEV-2025-001",
    icon: <FaAws className="text-[#FF9900]" />,
  },
  {
    id: 2,
    title: "Meta React Developer Certificate",
    issuer: "Meta (via Coursera)",
    date: "January 2024",
    category: "Frontend",
    description:
      "Comprehensive training in React.js fundamentals, hooks, state management, and building production-ready web applications.",
    credentialId: "META-REACT-2024",
    icon: <FaReact className="text-[#61DAFB]" />,
  },
  {
    id: 3,
    title: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    date: "July 2024",
    category: "Database",
    description:
      "Expert-level certification covering MongoDB data modeling, aggregation, performance optimization, and advanced querying.",
    credentialId: "MONGO-DEV-2024",
    icon: <SiMongodb className="text-[#47A248]" />,
  },
  {
    id: 4,
    title: "Google UX Design Certificate",
    issuer: "Google (via Coursera)",
    date: "September 2023",
    category: "Design",
    description:
      "Foundation in UX research, wireframing, prototyping, and creating user-centered design solutions for digital products.",
    credentialId: "GOOGLE-UX-2023",
    icon: <FaGoogle className="text-[#4285F4]" />,
  },
  {
    id: 5,
    title: "Flutter & Dart Complete Bootcamp",
    issuer: "Udemy",
    date: "May 2023",
    category: "Mobile",
    description:
      "Comprehensive Flutter and Dart development covering state management, animations, Firebase integration, and publishing apps.",
    credentialId: "UDEMY-FLUTTER-2023",
    icon: <SiFlutter className="text-[#02569B]" />,
  },
  {
    id: 6,
    title: "Node.js: The Complete Guide",
    issuer: "Udemy",
    date: "November 2022",
    category: "Backend",
    description:
      "Advanced Node.js development including REST APIs, authentication, websockets, testing, and performance optimization techniques.",
    credentialId: "UDEMY-NODE-2022",
    icon: <FaNodeJs className="text-[#339933]" />,
  },
];

const achievements = [
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dbAchievements, setDbAchievements] = useState<any[]>(certificates);

  useEffect(() => {
    fetch('http://localhost:5000/api/achievements')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDbAchievements(data);
      })
      .catch(err => console.error('Failed to fetch achievements:', err));
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
              { value: "6+", label: "Certificates" },
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
            {achievements.map((item, index) => (
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

      {/* Certificates Grid */}
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Professional</span>
            <h2 className="text-4xl font-bold text-foreground">Certificates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbAchievements.map((cert, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={cert.id || cert._id || index}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                onMouseEnter={() => setHoveredId(cert.id || cert._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Top colored band or Image */}
                {cert.imageUrl || cert.certificateImage ? (
                  <div className="h-40 w-full overflow-hidden bg-muted">
                    <img src={cert.imageUrl || cert.certificateImage} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-2 w-full bg-primary" />
                )}
                
                <div className="p-8 flex flex-col h-[calc(100%-8px)]">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {cert.iconPath ? <img src={cert.iconPath} className="w-10 h-10 object-contain" alt="" /> : cert.icon}
                    </span>
                    <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                      {cert.certificateTag || cert.category}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {cert.companyName || cert.issuer}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground mb-8">
                    {cert.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-border/50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground/70 mb-1">Issued</p>
                        <p className="text-sm font-semibold text-foreground">{cert.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground/70 mb-1">Credential ID</p>
                        <p className="text-xs font-mono font-medium text-muted-foreground">{cert.credentialId}</p>
                      </div>
                    </div>

                    <a href="#" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground text-sm font-semibold transition-all duration-300">
                      <Award size={16} />
                      View Certificate
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
