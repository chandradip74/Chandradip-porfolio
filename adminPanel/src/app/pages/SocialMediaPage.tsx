import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Save, Loader2, Share2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface SocialMedia {
  _id: string;
  platform: string;
  image: string;
  link: string;
  order: number;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {msg}
    </p>
  );
}

export function SocialMediaPage() {
  const [items, setItems] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialMedia | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialMedia | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ platform: '', image: '', link: '', order: '0' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchItems = () => {
    setLoading(true);
    api.get('/social-media')
      .then(setItems)
      .catch(() => toast.error('Failed to load social media'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = items.filter((i) =>
    i.platform.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ platform: '', image: '', link: '', order: '0' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: SocialMedia) => {
    setEditing(item);
    setForm({ platform: item.platform, image: item.image, link: item.link, order: String(item.order) });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.platform.trim()) e.platform = 'Platform name is required';
    if (!form.image.trim()) e.image = 'Image URL is required';
    else if (!/^https?:\/\/.+/.test(form.image.trim())) e.image = 'Must be a valid URL (starts with http/https)';
    if (!form.link.trim()) e.link = 'Profile link is required';
    else if (!/^https?:\/\/.+/.test(form.link.trim())) e.link = 'Must be a valid URL (starts with http/https)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      if (editing) {
        const updated = await api.put(`/social-media/${editing._id}`, payload);
        setItems(items.map((i) => i._id === editing._id ? updated : i));
        toast.success('Social media updated!');
      } else {
        const created = await api.post('/social-media', payload);
        setItems([...items, created]);
        toast.success('Social media added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SocialMedia) => {
    try {
      await api.del(`/social-media/${item._id}`);
      setItems(items.filter((x) => x._id !== item._id));
      setDeleteTarget(null);
      toast.success('Social media deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Social Media</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} social media links</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Social Media
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search platforms..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item._id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0 border border-border/50">
                  <img
                    src={item.image}
                    alt={item.platform}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{item.platform}</p>
              <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block mt-0.5">{item.link}</a>
              <p className="text-xs text-muted-foreground mt-1">Order: {item.order}</p>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Share2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No social media links added yet.</p>
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
              <h3 className="text-foreground font-medium">{editing ? 'Edit Social Media' : 'Add Social Media'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Platform Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.platform}
                  onChange={(e) => { setForm({ ...form, platform: e.target.value }); if (errors.platform) setErrors({ ...errors, platform: '' }); }}
                  placeholder="e.g. GitHub, LinkedIn, Twitter"
                  className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground ${errors.platform ? 'border-red-500' : 'border-border'}`}
                />
                <FieldError msg={errors.platform} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Image URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); if (errors.image) setErrors({ ...errors, image: '' }); }}
                  placeholder="https://cdn.example.com/github.png"
                  className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground ${errors.image ? 'border-red-500' : 'border-border'}`}
                />
                <FieldError msg={errors.image} />
              </div>
              {form.image && /^https?:\/\/.+/.test(form.image) && (
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg border border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-border/30 shadow-sm">
                    <img src={form.image} alt="preview" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground">Image preview — {form.platform || 'Platform'}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Profile Link <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => { setForm({ ...form, link: e.target.value }); if (errors.link) setErrors({ ...errors, link: '' }); }}
                  placeholder="https://github.com/yourusername"
                  className={`w-full px-3 py-2 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground ${errors.link ? 'border-red-500' : 'border-border'}`}
                />
                <FieldError msg={errors.link} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  placeholder="0"
                  min={0}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
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
              <h3 className="text-foreground font-medium">Delete "{deleteTarget.platform}"?</h3>
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
