import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Wrench } from "lucide-react";

interface MaintenancePageProps {
  message?: string;
}

export default function MaintenancePage({ message }: MaintenancePageProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl"
        />
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-2xl"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* LEFT SIDE - Information (60%) */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          {/* Status chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Under Maintenance
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            We'll be back{" "}
            <span className="text-primary">soon{dots}</span>
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl"
          >
            {message ||
              "We're performing scheduled maintenance to improve your experience. Please check back shortly."}
          </motion.p>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mb-12"
          >
            <div className="flex-1 flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Estimated Time</p>
                <p className="text-sm font-semibold text-foreground">A few hours</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-foreground">In Progress</p>
              </div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground/60 font-medium"
          >
            Thank you for your patience. — Chandradip
          </motion.p>
        </div>

        {/* RIGHT SIDE - GIF (40%) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          className="w-full lg:w-[40%] flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-sm lg:max-w-md">
            {/* Soft glow behind the image */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform scale-90" />
            
            <img
              src="/media/maintainance.gif"
              alt="Under Maintenance"
              className="relative z-10 w-full h-auto object-cover rounded-3xl border border-border/40 shadow-2xl shadow-primary/20 bg-card/50 backdrop-blur-sm p-2"
              draggable={false}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
