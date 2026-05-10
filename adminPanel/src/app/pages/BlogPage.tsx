import { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Search, List, Loader2,
  Upload, Eye, EyeOff, Clock, Tag, BookOpen, ChevronUp, ChevronDown, AlignLeft, Image as ImageIcon, Code, Heading1, ListOrdered
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

const CATEGORIES = ['General', 'Tech', 'Tutorial', 'Career', 'Design', 'Open Source', 'Case Study'];

type BlockType = 'heading' | 'paragraph' | 'code' | 'image' | 'list';
interface ContentBlock {
  id: string;
  type: BlockType;
  value: string;
  extra: string;
}

const parseMarkdownToBlocks = (md: string) => {
  if (!md) return [{ id: Date.now().toString(), type: 'paragraph' as BlockType, value: '', extra: '' }];
  const blks: ContentBlock[] = [];
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blks.push({ id: Math.random().toString(), type: 'code', value: codeLines.join('\n'), extra: lang });
    } else if (line.startsWith('### ')) {
      blks.push({ id: Math.random().toString(), type: 'heading', value: line.slice(4), extra: '' });
    } else if (line.startsWith('## ')) {
      blks.push({ id: Math.random().toString(), type: 'heading', value: line.slice(3), extra: '' });
    } else if (line.startsWith('# ')) {
      blks.push({ id: Math.random().toString(), type: 'heading', value: line.slice(2), extra: '' });
    } else if (line.match(/^!\[(.*?)\]\((.*?)\)$/)) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)$/)!;
      blks.push({ id: Math.random().toString(), type: 'image', value: match[1], extra: match[2] });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listLines = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listLines.push(lines[i].slice(2));
        i++;
      }
      blks.push({ id: Math.random().toString(), type: 'list', value: listLines.join('\n'), extra: '' });
      continue;
    } else if (line.trim() === '---' || line.trim() === '') {
       // ignore
    } else {
      const pLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !lines[i].startsWith('#') && !lines[i].match(/^!\[(.*?)\]\((.*?)\)$/) && !lines[i].startsWith('- ') && !lines[i].startsWith('* ')) {
        pLines.push(lines[i]);
        i++;
      }
      if (pLines.length > 0) {
        blks.push({ id: Math.random().toString(), type: 'paragraph', value: pLines.join('\n'), extra: '' });
        continue;
      }
    }
    i++;
  }
  return blks.length ? blks : [{ id: Date.now().toString(), type: 'paragraph' as BlockType, value: '', extra: '' }];
};

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
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', excerpt: '',
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

  const blocksToMarkdown = (blks: ContentBlock[]) => {
    return blks.map(b => {
      switch (b.type) {
        case 'heading': return `## ${b.value}\n`;
        case 'paragraph': return `${b.value}\n`;
        case 'code': return `\`\`\`${b.extra || 'js'}\n${b.value}\n\`\`\`\n`;
        case 'image': return `![${b.value}](${b.extra})\n`;
        case 'list': return b.value.split('\n').filter(x => x.trim()).map(l => `- ${l}`).join('\n') + '\n';
        default: return b.value;
      }
    }).join('\n');
  };

  const addBlock = (type: BlockType) => setBlocks([...blocks, { id: Math.random().toString(), type, value: '', extra: '' }]);
  const updateBlock = (id: string, updates: Partial<ContentBlock>) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    }
    setBlocks(newBlocks);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', excerpt: '', category: 'General', tags: [], readTime: 5, published: false, coverImage: '' });
    setBlocks([{ id: Date.now().toString(), type: 'heading', value: 'Introduction', extra: '' }, { id: (Date.now()+1).toString(), type: 'paragraph', value: '', extra: '' }]);
    setTagInput(''); setImageFile(null); setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (b: Blog) => {
    setEditing(b);
    setForm({ title: b.title, excerpt: b.excerpt, category: b.category, tags: [...b.tags], readTime: b.readTime, published: b.published, coverImage: b.coverImage || '' });
    setBlocks(parseMarkdownToBlocks(b.content));
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
    const finalContent = blocksToMarkdown(blocks);
    if (!finalContent.trim()) { toast.error('Content is required'); return; }
    
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append('content', finalContent);
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
                        <p className="text-sm font-medium text-foreground line-clamp-1" title={blog.title}>{blog.title}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block line-clamp-1" title={blog.excerpt}>{blog.excerpt}</p>
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

              {/* Dynamic Content Builder */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Blog Content</label>
                
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <div key={block.id} className="relative p-4 bg-muted/20 border border-border rounded-xl group transition-colors hover:border-primary/40">
                      {/* Block Controls */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                        <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 bg-card border border-border rounded-md shadow-sm hover:bg-accent disabled:opacity-30 disabled:hover:bg-card"><ChevronUp className="w-3 h-3 text-muted-foreground"/></button>
                        <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 bg-card border border-border rounded-md shadow-sm hover:bg-accent disabled:opacity-30 disabled:hover:bg-card"><ChevronDown className="w-3 h-3 text-muted-foreground"/></button>
                      </div>

                      <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 p-1.5 rounded-md bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive hover:text-white" title="Remove block">
                        <X className="w-4 h-4" />
                      </button>

                      {block.type === 'heading' && (
                        <div>
                          <p className="text-xs font-semibold text-primary/70 mb-2 flex items-center gap-1.5"><Heading1 size={14}/> HEADING</p>
                          <input value={block.value} onChange={e => updateBlock(block.id, { value: e.target.value })} placeholder="Section Title..." className="w-full bg-transparent border-b border-border focus:border-primary focus:outline-none py-1 text-lg font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground" />
                        </div>
                      )}

                      {block.type === 'paragraph' && (
                        <div>
                          <p className="text-xs font-semibold text-primary/70 mb-2 flex items-center gap-1.5"><AlignLeft size={14}/> TEXT PARAGRAPH</p>
                          <textarea value={block.value} onChange={e => updateBlock(block.id, { value: e.target.value })} placeholder="Write your content here... (Use **bold** for emphasis)" rows={3} className="w-full bg-input-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y text-foreground placeholder:text-muted-foreground" />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div>
                          <p className="text-xs font-semibold text-primary/70 mb-2 flex items-center gap-1.5"><ImageIcon size={14}/> IMAGE</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input value={block.extra} onChange={e => updateBlock(block.id, { extra: e.target.value })} placeholder="Image URL..." className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none text-foreground placeholder:text-muted-foreground" />
                            <input value={block.value} onChange={e => updateBlock(block.id, { value: e.target.value })} placeholder="Caption text..." className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none text-foreground placeholder:text-muted-foreground" />
                          </div>
                          {block.extra && <img src={block.extra} alt={block.value} className="mt-3 max-h-32 object-contain rounded-lg border border-border bg-black/20" />}
                        </div>
                      )}

                      {block.type === 'code' && (
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-xs font-semibold text-primary/70 flex items-center gap-1.5"><Code size={14}/> CODE BLOCK</p>
                            <input value={block.extra} onChange={e => updateBlock(block.id, { extra: e.target.value })} placeholder="Language (e.g. js, python)" className="w-32 text-xs px-2 py-1 bg-input-background border border-border rounded focus:outline-none text-foreground" />
                          </div>
                          <textarea value={block.value} onChange={e => updateBlock(block.id, { value: e.target.value })} placeholder="Paste your code here..." rows={4} className="w-full bg-[#0d1117] text-[#e6edf3] border border-border rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y" />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <div>
                          <p className="text-xs font-semibold text-primary/70 mb-2 flex items-center gap-1.5"><ListOrdered size={14}/> BULLET LIST</p>
                          <textarea value={block.value} onChange={e => updateBlock(block.id, { value: e.target.value })} placeholder="Item 1\nItem 2\nItem 3" rows={4} className="w-full bg-input-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y text-foreground placeholder:text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => addBlock('heading')} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium border border-border flex items-center gap-1.5 text-foreground transition-colors"><Heading1 size={14}/> Add Heading</button>
                  <button type="button" onClick={() => addBlock('paragraph')} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium border border-border flex items-center gap-1.5 text-foreground transition-colors"><AlignLeft size={14}/> Add Text</button>
                  <button type="button" onClick={() => addBlock('image')} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium border border-border flex items-center gap-1.5 text-foreground transition-colors"><ImageIcon size={14}/> Add Image</button>
                  <button type="button" onClick={() => addBlock('code')} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium border border-border flex items-center gap-1.5 text-foreground transition-colors"><Code size={14}/> Add Code</button>
                  <button type="button" onClick={() => addBlock('list')} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs font-medium border border-border flex items-center gap-1.5 text-foreground transition-colors"><ListOrdered size={14}/> Add List</button>
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
