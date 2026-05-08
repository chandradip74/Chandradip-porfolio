import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { IconRenderer } from '../components/ui/IconRenderer';


interface Technology {
  _id: string;
  technologyName: string;
  iconPath: string;
}

export function TechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Technology | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Technology | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ technologyName: '', iconPath: '' });

  const fetchTechs = () => {
    setLoading(true);
    api.get('/technologies')
      .then(setTechs)
      .catch(() => toast.error('Failed to load technologies'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTechs(); }, []);

  const filtered = techs.filter((t) =>
    t.technologyName.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ technologyName: '', iconPath: '' });
    setModalOpen(true);
  };

  const openEdit = (t: Technology) => {
    setEditing(t);
    setForm({ technologyName: t.technologyName, iconPath: t.iconPath || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.technologyName.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.put(`/technologies/${editing._id}`, form);
        setTechs(techs.map((t) => t._id === editing._id ? updated : t));
        toast.success('Technology updated!');
      } else {
        const created = await api.post('/technologies', form);
        setTechs([...techs, created]);
        toast.success('Technology added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t: Technology) => {
    try {
      await api.del(`/technologies/${t._id}`);
      setTechs(techs.filter((x) => x._id !== t._id));
      setDeleteTarget(null);
      toast.success('Technology deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Technologies</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{techs.length} technologies in your stack</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Technology
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search technologies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((tech) => (
            <div key={tech._id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                  <IconRenderer icon={tech.iconPath} size={28} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(tech)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(tech)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">{tech.technologyName}</p>
              {tech.iconPath && <p className="text-xs text-muted-foreground mt-0.5 truncate">{tech.iconPath}</p>}
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No technologies found. Add your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">{editing ? 'Edit Technology' : 'Add Technology'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Technology Name</label>
                <input
                  type="text"
                  value={form.technologyName}
                  onChange={(e) => setForm({ ...form, technologyName: e.target.value })}
                  placeholder="e.g. React.js"
                  className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon <span className="text-xs font-normal text-muted-foreground">(FontAwesome HTML, React Icon name, or Image URL)</span></label>
                <input
                  type="text"
                  value={form.iconPath}
                  onChange={(e) => setForm({ ...form, iconPath: e.target.value })}
                  placeholder='<i class="fa-brands fa-react"></i> or https://...'
                  className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {form.iconPath && (
                <div className="flex flex-col items-center gap-3 p-3 bg-accent rounded-lg border border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center shadow-sm">
                    <IconRenderer icon={form.iconPath} size={32} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Icon preview</span>
                </div>
              )}
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
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-foreground font-medium">Delete "{deleteTarget.technologyName}"?</h3>
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
