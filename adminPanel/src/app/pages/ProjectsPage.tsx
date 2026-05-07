import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search, Grid3X3, List, Github, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  status: 'Live' | 'In Progress' | 'Archived';
  color: string;
  year: number;
}

const initialProjects: Project[] = [
  { id: 1, title: 'Portfolio v3', description: 'My personal portfolio website built with Next.js, TypeScript, and Tailwind CSS featuring a modern design with dark mode support.', technologies: ['Next.js', 'TypeScript', 'Tailwind'], githubUrl: 'https://github.com', liveUrl: 'https://example.com', status: 'Live', color: 'from-blue-500 to-purple-600', year: 2024 },
  { id: 2, title: 'E-Commerce Platform', description: 'Full-stack e-commerce application with product management, cart, payments via Stripe, and admin dashboard.', technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'], githubUrl: 'https://github.com', liveUrl: 'https://example.com', status: 'Live', color: 'from-green-500 to-teal-600', year: 2024 },
  { id: 3, title: 'AI Chat Application', description: 'Real-time chat application with AI-powered responses using OpenAI API, WebSocket for live communication.', technologies: ['React', 'OpenAI', 'WebSocket', 'Redis'], githubUrl: 'https://github.com', liveUrl: '', status: 'In Progress', color: 'from-orange-500 to-red-600', year: 2024 },
  { id: 4, title: 'Task Management App', description: 'Kanban-style task manager with drag-and-drop, team collaboration, and real-time updates using Firebase.', technologies: ['Vue.js', 'Firebase', 'Tailwind'], githubUrl: 'https://github.com', liveUrl: 'https://example.com', status: 'Live', color: 'from-purple-500 to-pink-600', year: 2023 },
  { id: 5, title: 'Blog Platform CMS', description: 'Custom CMS platform for technical blogging with Markdown support, SEO optimization, and analytics dashboard.', technologies: ['Next.js', 'MongoDB', 'GraphQL'], githubUrl: 'https://github.com', liveUrl: 'https://example.com', status: 'Archived', color: 'from-gray-500 to-slate-600', year: 2023 },
  { id: 6, title: 'Social Media Dashboard', description: 'Analytics dashboard aggregating data from multiple social media platforms with charts and insights.', technologies: ['React', 'Python', 'FastAPI', 'Recharts'], githubUrl: 'https://github.com', liveUrl: '', status: 'In Progress', color: 'from-yellow-500 to-orange-600', year: 2024 },
];

const statusColors: Record<string, string> = {
  Live: 'bg-green-500/10 text-green-600 dark:text-green-400',
  'In Progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Archived: 'bg-gray-500/10 text-gray-500',
};

export function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [techInput, setTechInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', technologies: [] as string[], githubUrl: '', liveUrl: '', status: 'Live' as Project['status'], color: 'from-blue-500 to-purple-600', year: 2024 });

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', technologies: [], githubUrl: '', liveUrl: '', status: 'Live', color: 'from-blue-500 to-purple-600', year: 2024 });
    setTechInput('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, technologies: [...p.technologies], githubUrl: p.githubUrl, liveUrl: p.liveUrl, status: p.status, color: p.color, year: p.year });
    setTechInput('');
    setModalOpen(true);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) { setForm({ ...form, technologies: [...form.technologies, t] }); setTechInput(''); }
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (editing) {
      setProjects(projects.map((p) => p.id === editing.id ? { ...p, ...form } : p));
      toast.success('Project updated!');
    } else {
      setProjects([...projects, { id: Date.now(), ...form }]);
      toast.success('Project added!');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteId(null);
    toast.success('Project deleted');
  };

  const colorOptions = ['from-blue-500 to-purple-600', 'from-green-500 to-teal-600', 'from-orange-500 to-red-600', 'from-purple-500 to-pink-600', 'from-yellow-500 to-orange-600', 'from-gray-500 to-slate-600'];

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} projects total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
          <button onClick={() => setView('grid')} className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setView('table')} className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group">
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${project.color} flex items-center justify-center relative`}>
                <span className="text-white/80 font-semibold text-lg">{project.title}</span>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => setPreviewProject(project)} className="bg-white/90 text-gray-900 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-white transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-foreground font-medium">{project.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-xs font-medium">{t}</span>
                  ))}
                  {project.technologies.length > 3 && <span className="px-2 py-0.5 bg-accent text-muted-foreground rounded-md text-xs">+{project.technologies.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-4 h-4" /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(project)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(project.id)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Technologies</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Year</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.color} flex-shrink-0`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.title}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((t) => <span key={t} className="px-1.5 py-0.5 bg-accent text-accent-foreground rounded text-xs">{t}</span>)}
                      {project.technologies.length > 2 && <span className="text-xs text-muted-foreground">+{project.technologies.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{project.year}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Github className="w-3.5 h-3.5" /></a>}
                      <button onClick={() => openEdit(project)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(project.id)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewProject(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className={`h-48 bg-gradient-to-br ${previewProject.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-2xl">{previewProject.title}</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-medium text-lg">{previewProject.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[previewProject.status]}`}>{previewProject.status}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{previewProject.description}</p>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {previewProject.technologies.map((t) => <span key={t} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                {previewProject.githubUrl && <a href={previewProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"><Github className="w-4 h-4" />GitHub</a>}
                {previewProject.liveUrl && <a href={previewProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"><ExternalLink className="w-4 h-4" />Live Demo</a>}
                <button onClick={() => setPreviewProject(null)} className="ml-auto px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Project description..." className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Color Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 transition-all ${form.color === c ? 'border-primary scale-110' : 'border-transparent'}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Technologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.technologies.map((t) => <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">{t}<button onClick={() => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) })} className="hover:text-red-500"><X className="w-3 h-3" /></button></span>)}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTech()} placeholder="Add technology..." className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                  <button onClick={addTech} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">GitHub URL</label>
                  <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Live URL</label>
                  <input type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://example.com" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
                    {['Live', 'In Progress', 'Archived'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <div><h3 className="text-foreground font-medium">Delete Project?</h3><p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p></div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
