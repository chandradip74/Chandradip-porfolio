import { useState, useEffect, FormEvent } from "react";
import { Send, Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get('/profile').then(setProfile).catch(() => {});
  }, []);

  // Build contact info dynamically from profile, fall back to defaults
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: profile?.email || "hello@example.com",
      href: `mailto:${profile?.email || "hello@example.com"}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile?.phone || "+1 (555) 000-1234",
      href: `tel:${(profile?.phone || "+15550001234").replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile?.location || "Your City, Country",
      href: "#",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await api.post('/contact', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        description: form.subject ? `[${form.subject}] ${form.message}` : form.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-5 py-4 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background";

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
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 ">
            Get In Touch
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground">
            Contact Me
          </h1>
          <p className="text-lg max-w-xl mx-auto text-primary-foreground/70 leading-relaxed">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Let's create something extraordinary together.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left Info Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-foreground">
                  Let's Talk
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I'm currently available for freelance projects, full-time roles,
                  and exciting collaborations. Whether you have a project idea, a
                  question, or just want to say hello — my inbox is always open.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-primary hover:border-primary hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium mb-0.5 text-muted-foreground group-hover:text-primary-foreground/60 transition-colors uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary-foreground transition-colors break-all leading-snug">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Availability indicator */}
              <div className="p-8 rounded-3xl bg-muted/30 border border-border flex items-start gap-4">
                <span className="relative flex w-4 h-4 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full w-4 h-4 bg-green-500"></span>
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Available for Work
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Currently accepting new projects and freelance opportunities.
                    Response time is typically within 24 hours.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Form Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="h-full bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8"
                    >
                      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-green-500/10 text-green-500 mb-4">
                        <CheckCircle2 size={48} />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-foreground">
                          Message Sent!
                        </h3>
                        <p className="text-lg max-w-md mx-auto text-muted-foreground">
                          Thank you for reaching out. I'll review your message and get back
                          to you within 24 hours.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
                        }}
                        className="px-8 py-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8 relative z-10"
                    >
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">
                          Send a Message
                        </h2>
                        <p className="text-muted-foreground">
                          Fill in the details below and I'll get back to you soon.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground" htmlFor="firstName">
                            First Name <span className="text-primary">*</span>
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            placeholder="Alex"
                            value={form.firstName}
                            onChange={handleChange}
                            className={inputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground" htmlFor="lastName">
                            Last Name <span className="text-primary">*</span>
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            placeholder="Kumar"
                            value={form.lastName}
                            onChange={handleChange}
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground" htmlFor="email">
                          Email Address <span className="text-primary">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground" htmlFor="subject">
                          Subject
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Project Inquiry / Collaboration / Other"
                          value={form.subject}
                          onChange={handleChange}
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground" htmlFor="message">
                          Message <span className="text-primary">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          placeholder="Tell me about your project, timeline, and budget..."
                          value={form.message}
                          onChange={handleChange}
                          className={`${inputClasses} resize-y min-h-[160px]`}
                        />
                      </div>

                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group w-full flex items-center justify-center gap-3 py-5 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <span className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={20} className="group-hover:-translate-y-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
