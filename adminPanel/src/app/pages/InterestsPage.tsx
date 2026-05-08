import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Save, Loader2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { IconRenderer } from '../components/ui/IconRenderer';

interface Interest {
  _id: string;
  title: string;
  icon: string;
  color: string;
  bg: string;
}

export function InterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Interest | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    icon: '', 
    color: 'text-primary', 
    bg: 'bg-primary/10' 
  });

  const fetchInterests = () => {
    setLoading(true);
    api.get('/interests')
      .then(setInterests)
      .catch(() => toast.error('Failed to load interests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInterests(); }, []);

  const filtered = interests.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', icon: '', color: 'text-primary', bg: 'bg-primary/10' });
    setModalOpen(true);
  };

  const openEdit = (i: Interest) => {
    setEditing(i);
    setForm({ 
      title: i.title, 
      icon: i.icon || '', 
      color: i.color || 'text-primary', 
      bg: i.bg || 'bg-primary/10' 
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.put(`/interests/${editing._id}`, form);
        setInterests(interests.map((i) => i._id === editing._id ? updated : i));
        toast.success('Interest updated!');
      } else {
        const created = await api.post('/interests', form);
        setInterests([...interests, created]);
        toast.success('Interest added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (i: Interest) => {
    try {
      await api.del(`/interests/${i._id}`);
      setInterests(interests.filter((x) => x._id !== i._id));
      setDeleteTarget(null);
      toast.success('Interest deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">My Interests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{interests.length} interests added</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Interest
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search interests..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((interest) => (
            <div key={interest._id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all group flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${interest.bg} ${interest.color}`}>
                <IconRenderer icon={interest.icon} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{interest.title}</p>
                <p className="text-xs text-muted-foreground truncate">{interest.icon || 'No icon'}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(interest)} className="w-8 h-8 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(interest)} className="w-8 h-8 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No interests found. Add what you are passionate about!</p>
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
              <h3 className="text-foreground font-medium">{editing ? 'Edit Interest' : 'Add Interest'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon <span className="text-xs font-normal text-muted-foreground">(Name, HTML, or URL)</span></label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder='e.g. <IoLogoReact /> or FaBrain or https://...'
                  className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 text-xs">Color Class (Tailwind)</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder='text-primary'
                    className="w-full px-3 py-2 text-xs bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 text-xs">BG Class (Tailwind)</label>
                  <input
                    type="text"
                    value={form.bg}
                    onChange={(e) => setForm({ ...form, bg: e.target.value })}
                    placeholder='bg-primary/10'
                    className="w-full px-3 py-2 text-xs bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 p-4 bg-accent rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground self-start mb-1">Live Preview:</span>
                <div className={`flex items-center gap-4 p-4 rounded-2xl bg-background border border-border shadow-sm w-full`}>
                  <div className={`p-2.5 rounded-xl ${form.bg} ${form.color}`}>
                    <IconRenderer icon={form.icon} size={20} />
                  </div>
                  <span className="font-medium text-sm">{form.title || 'Interest Title'}</span>
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
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
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
