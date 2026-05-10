import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, GitMerge } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Process {
  _id: string;
  step: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
}

export function ProcessPage() {
  const [entries, setEntries] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Process | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Process | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ step: '', title: '', description: '', order: '0' });

  const fetchEntries = () => {
    setLoading(true);
    api.get('/process')
      .then(setEntries)
      .catch(() => toast.error('Failed to load process steps'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const sorted = [...entries].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditing(null);
    const nextStep = String(entries.length + 1).padStart(2, '0');
    setForm({ step: nextStep, title: '', description: '', order: String(entries.length) });
    setModalOpen(true);
  };

  const openEdit = (e: Process) => {
    setEditing(e);
    setForm({ step: e.step, title: e.title, description: e.description, order: String(e.order) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.step.trim()) { toast.error('Step number is required'); return; }
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) {
        const updated = await api.put(`/process/${editing._id}`, payload);
        setEntries(entries.map((e) => e._id === editing._id ? updated : e));
        toast.success('Step updated!');
      } else {
        const created = await api.post('/process', payload);
        setEntries([...entries, created]);
        toast.success('Step added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: Process) => {
    try {
      await api.del(`/process/${e._id}`);
      setEntries(entries.filter((x) => x._id !== e._id));
      setDeleteTarget(null);
      toast.success('Step deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-xl font-semibold">My Process</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the steps shown in the "How I Work" section of Services
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Step
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <GitMerge className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No process steps yet. Add your first step!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((entry) => (
            <div
              key={entry._id}
              className="group flex items-center gap-5 p-5 bg-card border border-border rounded-xl hover:shadow-sm transition-all"
            >
              {/* Step Badge */}
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                {entry.step}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-semibold text-sm">{entry.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{entry.description}</p>
              </div>

              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(entry)}
                  className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(entry)}
                  className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-semibold">{editing ? 'Edit Step' : 'Add Process Step'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Step Number</label>
                  <input
                    type="text"
                    value={form.step}
                    onChange={(e) => setForm({ ...form, step: e.target.value })}
                    placeholder="01"
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Discovery"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Describe this process step..."
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
              >
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
              <p className="text-sm text-muted-foreground mt-1">This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
