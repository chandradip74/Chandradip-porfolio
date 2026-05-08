import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { IconRenderer } from '../components/ui/IconRenderer';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  certificateTag: string;
  companyName: string;
  iconPath: string;
  certificateImage: string;
}

const TAG_COLORS: Record<string, string> = {
  Cloud: 'bg-blue-500/10 text-blue-500',
  Frontend: 'bg-cyan-500/10 text-cyan-500',
  Backend: 'bg-green-500/10 text-green-500',
  Database: 'bg-orange-500/10 text-orange-500',
  Mobile: 'bg-purple-500/10 text-purple-500',
  Design: 'bg-pink-500/10 text-pink-500',
};

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', certificateImage: '', certificateTag: '', companyName: '', iconPath: '',
  });

  const fetchAchievements = () => {
    setLoading(true);
    api.get('/achievements')
      .then(setAchievements)
      .catch(() => toast.error('Failed to load achievements'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAchievements(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', imageUrl: '', certificateImage: '', certificateTag: '', companyName: '', iconPath: '' });
    setCertFile(null);
    setIconFile(null);
    setModalOpen(true);
  };

  const openEdit = (a: Achievement) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description, imageUrl: a.imageUrl || '', certificateImage: a.certificateImage || '', certificateTag: a.certificateTag || '', companyName: a.companyName || '', iconPath: a.iconPath || '' });
    setCertFile(null);
    setIconFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('certificateTag', form.certificateTag);
      formData.append('companyName', form.companyName);
      formData.append('imageUrl', form.imageUrl); // keeping imageUrl if it is used
      
      if (certFile) formData.append('certificateImage', certFile);
      else if (form.certificateImage) formData.append('certificateImage', form.certificateImage);

      if (iconFile) formData.append('iconPath', iconFile);
      else if (form.iconPath) formData.append('iconPath', form.iconPath);

      if (editing) {
        const updated = await api.putForm(`/achievements/${editing._id}`, formData);
        setAchievements(achievements.map((a) => a._id === editing._id ? updated : a));
        toast.success('Achievement updated!');
      } else {
        const created = await api.postForm('/achievements', formData);
        setAchievements([...achievements, created]);
        toast.success('Achievement added!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Achievement) => {
    try {
      await api.del(`/achievements/${a._id}`);
      setAchievements(achievements.filter((x) => x._id !== a._id));
      setDeleteTarget(null);
      toast.success('Achievement deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground';

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{achievements.length} certificates & awards</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No achievements yet. Add your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div key={ach._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-all group">
              {ach.certificateImage || ach.imageUrl ? (
                <div className="h-36 bg-muted overflow-hidden">
                  <img src={ach.certificateImage || ach.imageUrl} alt={ach.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-2 w-full bg-primary" />
              )}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center overflow-hidden text-yellow-500">
                      <IconRenderer icon={ach.iconPath} size={20} />
                    </div>
                    {ach.certificateTag && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[ach.certificateTag] || 'bg-accent text-accent-foreground'}`}>
                        {ach.certificateTag}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(ach)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(ach)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-medium text-sm leading-snug">{ach.title}</h3>
                  {ach.companyName && <p className="text-xs text-blue-500 mt-0.5">{ach.companyName}</p>}
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{ach.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">{editing ? 'Edit Achievement' : 'Add Achievement'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Certified Developer" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What did you achieve?" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company / Issuer</label>
                  <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. Amazon Web Services" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category Tag</label>
                  <input type="text" value={form.certificateTag} onChange={(e) => setForm({ ...form, certificateTag: e.target.value })} placeholder="e.g. Cloud, Frontend" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Certificate Image</label>
                {(certFile || form.certificateImage || form.imageUrl) && (
                  <div className="mb-2 relative">
                    <img src={certFile ? URL.createObjectURL(certFile) : (form.certificateImage || form.imageUrl)} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
                    <button onClick={() => { setCertFile(null); setForm({ ...form, certificateImage: '', imageUrl: '' }); }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => certInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    Upload Image
                  </button>
                  <input type="text" value={form.certificateImage || form.imageUrl} onChange={(e) => { setForm({ ...form, certificateImage: e.target.value, imageUrl: e.target.value }); setCertFile(null); }} placeholder="Or paste image URL..." className={inputCls} />
                </div>
                <input ref={certInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setCertFile(e.target.files[0])} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Company Icon <span className="text-xs font-normal text-muted-foreground">(Emoji, Icon Name, or Image URL)</span></label>
                {(iconFile || form.iconPath) && (
                  <div className="mb-2 relative">
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg border border-border bg-muted p-1 overflow-hidden">
                      {iconFile ? <img src={URL.createObjectURL(iconFile)} alt="Preview" className="w-full h-full object-contain" /> : <IconRenderer icon={form.iconPath} size={32} />}
                    </div>
                    <button onClick={() => { setIconFile(null); setForm({ ...form, iconPath: '' }); }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => iconInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    Upload Icon
                  </button>
                  <input type="text" value={form.iconPath} onChange={(e) => { setForm({ ...form, iconPath: e.target.value }); setIconFile(null); }} placeholder="Or paste icon URL..." className={inputCls} />
                </div>
                <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setIconFile(e.target.files[0])} />
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
