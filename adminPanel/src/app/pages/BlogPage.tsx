import { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Search, List, Loader2,
  Upload, Eye, EyeOff, Clock, Tag, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: number;
  published: boolean;
  createdAt: string;
}

const CATEGORIES = ['General', 'Tech', 'Tutorial', 'Career', 'Design', 'Open Source'];

export function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    category: 'General', tags: [] as string[],
    readTime: 5, published: false, coverImage: '',
  });

  const fetchBlogs = () => {
    setLoading(true);
    api.get('/blogs?all=1')
      .then(setBlogs)
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', excerpt: '', content: '', category: 'General', tags: [], readTime: 5, published: false, coverImage: '' });
    setTagInput(''); setImageFile(null); setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (b: Blog) => {
    setEditing(b);
    setForm({ title: b.title, excerpt: b.excerpt, content: b.content, category: b.category, tags: [...b.tags], readTime: b.readTime, published: b.published, coverImage: b.coverImage || '' });
    setTagInput(''); setImageFile(null); setImagePreview(b.coverImage || '');
    setModalOpen(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) { setForm({ ...form, tags: [...form.tags, t] }); setTagInput(''); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('tags', JSON.stringify(form.tags));
      fd.append('readTime', String(form.readTime));
      fd.append('published', String(form.published));
      if (imageFile) fd.append('coverImage', imageFile);
      else if (form.coverImage) fd.append('coverImage', form.coverImage);

      if (editing) {
        const updated = await api.putForm(`/blogs/${editing._id}`, fd);
        setBlogs(blogs.map(b => b._id === editing._id ? updated : b));
        toast.success('Blog updated!');
      } else {
        const created = await api.postForm('/blogs', fd);
        setBlogs([created, ...blogs]);
        toast.success('Blog created!');
      }
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save blog');
    } finally { setSaving(false); }
  };

  const handleDelete = async (b: Blog) => {
    try {
      await api.del(`/blogs/${b._id}`);
      setBlogs(blogs.filter(x => x._id !== b._id));
      setDeleteTarget(null);
      toast.success('Blog deleted');
    } catch (e: any) { toast.error(e.message || 'Failed to delete'); }
  };

  const togglePublish = async (b: Blog) => {
    try {
      const fd = new FormData();
      fd.append('published', String(!b.published));
      const updated = await api.putForm(`/blogs/${b._id}`, fd);
      setBlogs(blogs.map(x => x._id === b._id ? updated : x));
      toast.success(updated.published ? 'Blog published!' : 'Blog unpublished');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{blogs.length} posts total · {blogs.filter(b => b.published).length} published</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Read Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">{search ? 'No posts match your search.' : 'No blog posts yet. Add your first one!'}</td></tr>
              ) : filtered.map(blog => (
                <tr key={blog._id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-muted">
                        {blog.coverImage
                          ? <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-muted-foreground" /></div>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium">{blog.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((t, i) => <span key={i} className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">#{t}</span>)}
                      {blog.tags.length > 3 && <span className="text-xs text-muted-foreground">+{blog.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <button onClick={() => togglePublish(blog)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${blog.published ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                      {blog.published ? <><Eye className="w-3 h-3" />Published</> : <><EyeOff className="w-3 h-3" />Draft</>}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(blog)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(blog)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Post" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
              </div>

              {/* Excerpt */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Excerpt *</label>
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary…" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none placeholder:text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Content *</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} placeholder="Write your blog post here…" className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-y placeholder:text-muted-foreground font-mono" />
                <div className="mt-1.5 p-3 bg-muted/50 rounded-lg border border-border/50 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground/70 mb-1">✦ Formatting guide</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 font-mono">
                    <span><span className="text-primary"># </span>Heading 1</span>
                    <span><span className="text-primary">## </span>Heading 2</span>
                    <span><span className="text-primary">**text**</span> → bold</span>
                    <span><span className="text-primary">`code`</span> → inline code</span>
                    <span><span className="text-primary">- item</span> → bullet list</span>
                    <span><span className="text-primary">1. item</span> → numbered list</span>
                    <span><span className="text-primary">&gt; text</span> → blockquote</span>
                    <span><span className="text-primary">```js … ```</span> → code block</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Read Time (min)</label>
                <input type="number" min={1} value={form.readTime} onChange={e => setForm({ ...form, readTime: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                      <Tag className="w-3 h-3" />{t}
                      <button onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })} className="hover:text-red-500 ml-0.5"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag…" className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                  <button onClick={addTag} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Cover Image</label>
                {imagePreview && (
                  <div className="mb-2 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
                    <button onClick={() => { setImageFile(null); setImagePreview(''); setForm({ ...form, coverImage: '' }); }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => imageRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input value={form.coverImage} onChange={e => { setForm({ ...form, coverImage: e.target.value }); setImagePreview(e.target.value); setImageFile(null); }} placeholder="Or paste image URL…" className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground" />
                </div>
                <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Publish toggle */}
              <div className="sm:col-span-2 flex items-center gap-3">
                <button type="button" onClick={() => setForm({ ...form, published: !form.published })}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.published ? 'bg-primary' : 'bg-muted'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-foreground">{form.published ? 'Published (visible on site)' : 'Draft (hidden from site)'}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing ? 'Update' : 'Publish'}
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
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
