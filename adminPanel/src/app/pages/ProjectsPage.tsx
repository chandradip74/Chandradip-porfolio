import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search, Grid3X3, List, ExternalLink, Eye, Loader2, Upload, Link } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { IconRenderer } from '../components/ui/IconRenderer';


interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  projectLink: string;
  technologies: string[];
  createdAt: string;
}

const GRADIENT_COLORS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-purple-500 to-pink-600',
  'from-yellow-500 to-orange-600',
  'from-cyan-500 to-blue-600',
];

// Pick a deterministic gradient from the project title
const getGradient = (title: string) => {
  const code = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENT_COLORS[code % GRADIENT_COLORS.length];
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    projectLink: '',
    technologies: [] as string[],
    image: '',
  });

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects')
      .then(setProjects)
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', projectLink: '', technologies: [], image: '' });
    setTechInput('');
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, projectLink: p.projectLink || '', technologies: [...p.technologies], image: p.image || '' });
    setTechInput('');
    setImageFile(null);
    setImagePreview(p.image || '');
    setModalOpen(true);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
      setTechInput('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('projectLink', form.projectLink);
      formData.append('technologies', JSON.stringify(form.technologies));
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.image) {
        formData.append('image', form.image);
      }

      if (editing) {
        const updated = await api.putForm(`/projects/${editing._id}`, formData);
        setProjects(projects.map((p) => p._id === editing._id ? updated : p));
        toast.success('Project updated!');
      } else {
        const created = await api.postForm('/projects', formData);
        setProjects([created, ...projects]);
        toast.success('Project added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Project) => {
    try {
      await api.del(`/projects/${p._id}`);
      setProjects(projects.filter((x) => x._id !== p._id));
      setDeleteTarget(null);
      toast.success('Project deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">{search ? 'No projects match your search.' : 'No projects yet. Add your first one!'}</p>
        </div>
      ) : (
        <>
          {/* Grid view */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((project) => (
                <div key={project._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group">
                  <div className={`h-36 flex items-center justify-center relative overflow-hidden ${project.image ? '' : `bg-gradient-to-br ${getGradient(project.title)}`}`}>
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/80 font-semibold text-lg px-4 text-center">{project.title}</span>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setPreviewProject(project)} className="bg-white/90 text-gray-900 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-white transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-foreground font-medium truncate" title={project.title}>{project.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2" title={project.description}>{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4 items-center">
                      {project.technologies.slice(0, 5).map((t, idx) => (
                        <span key={idx} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium flex items-center justify-center min-w-8">
                          <IconRenderer icon={t} size={18} />
                        </span>
                      ))}
                      {project.technologies.length > 5 && <span className="px-2 py-1 bg-accent text-muted-foreground rounded-md text-xs">+{project.technologies.length - 5}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.projectLink && <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(project)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(project)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Link</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr key={project._id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden ${project.image ? '' : `bg-gradient-to-br ${getGradient(project.title)}`}`}>
                            {project.image ? <img src={project.image} alt="" className="w-full h-full object-cover" /> : null}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]" title={project.title}>{project.title}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block line-clamp-1" title={project.description}>{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 items-center">
                          {project.technologies.slice(0, 4).map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-accent text-accent-foreground rounded text-xs">
                              <IconRenderer icon={t} size={14} />
                            </span>
                          ))}
                          {project.technologies.length > 4 && <span className="text-xs text-muted-foreground">+{project.technologies.length - 4}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {project.projectLink ? (
                          <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Visit
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(project)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteTarget(project)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewProject(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className={`h-48 flex items-center justify-center overflow-hidden ${previewProject.image ? '' : `bg-gradient-to-br ${getGradient(previewProject.title)}`}`}>
              {previewProject.image ? (
                <img src={previewProject.image} alt={previewProject.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">{previewProject.title}</span>
              )}
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-foreground font-medium text-lg">{previewProject.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{previewProject.description}</p>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {previewProject.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                      <IconRenderer icon={t} size={18} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                {previewProject.projectLink && <a href={previewProject.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"><ExternalLink className="w-4 h-4" />Live Demo</a>}
                <button onClick={() => setPreviewProject(null)} className="ml-auto px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
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

              {/* Project Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project Image</label>
                {imagePreview && (
                  <div className="mb-2 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
                    <button onClick={() => { setImageFile(null); setImagePreview(''); setForm({ ...form, image: '' }); }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    <Upload className="w-4 h-4" /> Upload Image
                  </button>
                  <input type="text" value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); setImageFile(null); }} placeholder="Or paste image URL..." className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project Link <span className="text-xs font-normal text-muted-foreground">(GitHub / Live URL)</span></label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="url" value={form.projectLink} onChange={(e) => setForm({ ...form, projectLink: e.target.value })} placeholder="https://github.com/..." className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Technologies <span className="text-xs font-normal text-muted-foreground">(FontAwesome HTML or text)</span></label>
                <div className="flex flex-wrap gap-1.5 mb-2 items-center">
                  {form.technologies.map((t, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                      <IconRenderer icon={t} size={18} />
                      <button type="button" onClick={() => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) })} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTech()} placeholder="Add technology..." className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                  <button type="button" onClick={addTech} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <div>
              <h3 className="text-foreground font-medium">Delete "{deleteTarget.title}"?</h3>
              <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
