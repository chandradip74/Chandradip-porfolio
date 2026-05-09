import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, GitBranch, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Journey {
  _id: string;
  year: string;
  title: string;
  label: string;
  description: string;
  createdAt: string;
}

export function JourneyPage() {
  const [entries, setEntries] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Journey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Journey | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ year: String(new Date().getFullYear()), title: '', label: '', labelColor: '', description: '' });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const FieldError = ({ msg }: { msg?: string }) => msg ? (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}</p>
  ) : null;

  const fetchEntries = () => {
    setLoading(true);
    api.get('/journey')
      .then(setEntries)
      .catch(() => toast.error('Failed to load journey'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const sorted = [...entries].sort((a, b) => Number(b.year) - Number(a.year));

  const openAdd = () => {
    setEditing(null);
    setForm({ year: String(new Date().getFullYear()), title: '', label: '', labelColor: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (e: Journey) => {
    setEditing(e);
    setForm({ year: e.year, title: e.title, label: e.label || '', labelColor: (e as any).labelColor || '', description: e.description });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const e: Record<string,string> = {};
    if (!form.year.trim()) e.year = 'Year is required';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.put(`/journey/${editing._id}`, form);
        setEntries(entries.map((e) => e._id === editing._id ? updated : e));
        toast.success('Entry updated!');
      } else {
        const created = await api.post('/journey', form);
        setEntries([...entries, created]);
        toast.success('Entry added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: Journey) => {
    try {
      await api.del(`/journey/${e._id}`);
      setEntries(entries.filter((x) => x._id !== e._id));
      setDeleteTarget(null);
      toast.success('Entry deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const labelColors: Record<string, string> = {
    Foundation: 'bg-gray-500/10 text-gray-500',
    Education: 'bg-purple-500/10 text-purple-500',
    Internship: 'bg-blue-500/10 text-blue-500',
    Career: 'bg-green-500/10 text-green-500',
    Growth: 'bg-orange-500/10 text-orange-500',
    Now: 'bg-primary/10 text-primary',
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Journey Timeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your professional and educational milestones</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <GitBranch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No journey entries yet. Add your first milestone!</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-0">
            {sorted.map((entry) => (
              <div key={entry._id} className="relative flex gap-6 pb-8 last:pb-0 group">
                <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 border-border bg-card text-primary">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">{entry.year}</span>
                        {entry.label && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${labelColors[entry.label] || 'bg-accent text-accent-foreground'}`}>
                            {entry.label}
                          </span>
                        )}
                      </div>
                      <h3 className="text-foreground font-medium">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{entry.description}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEdit(entry)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(entry)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">{editing ? 'Edit Entry' : 'Add Journey Entry'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Year <span className="text-red-500">*</span></label>
                  <input type="text" value={form.year} onChange={(e) => { setForm({ ...form, year: e.target.value }); if (errors.year) setErrors({...errors, year: ''}); }} placeholder="2024" className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground ${errors.year ? 'border-red-500' : 'border-border'}`} />
                  <FieldError msg={errors.year} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Label/Badge</label>
                  <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Career, Education" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1 text-xs">Label Color Class (Tailwind)</label>
                <input type="text" value={form.labelColor} onChange={(e) => setForm({ ...form, labelColor: e.target.value })} placeholder="e.g. text-blue-500" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
              </div>
              {(form.label) && (
                <div className="flex items-center gap-2 p-3 bg-accent rounded-lg border border-border/50">
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border border-border/50 bg-background ${form.labelColor || 'text-foreground'}`}>
                    {form.label}
                  </span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); if (errors.title) setErrors({...errors, title: ''}); }} placeholder="e.g. Senior Developer" className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground ${errors.title ? 'border-red-500' : 'border-border'}`} />
                <FieldError msg={errors.title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({...errors, description: ''}); }} rows={4} placeholder="Describe this milestone..." className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none placeholder:text-muted-foreground ${errors.description ? 'border-red-500' : 'border-border'}`} />
                <FieldError msg={errors.description} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60">
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
              <p className="text-sm text-muted-foreground mt-1">This cannot be undone.</p>
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
