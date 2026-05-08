import { useState, useRef, useEffect } from 'react';
import { Search, Grid3X3, List, Upload, Trash2, Eye, Copy, FileText, ImageIcon, Video, X, Filter, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface MediaFile {
  _id: string;
  name: string;
  url: string;
  resourceType: string;
  format: string;
  size: number;
  createdAt: string;
}

const typeIcons: Record<string, any> = {
  image: ImageIcon,
  pdf: FileText,
  video: Video,
  raw: FileText,
  auto: FileText,
};

const typeBadgeColors: Record<string, string> = {
  image: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  pdf: 'bg-red-500/15 text-red-600 dark:text-red-400',
  video: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  raw: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  auto: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
};

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileType = (file: MediaFile) => {
  if (file.format === 'application/pdf' || file.format === 'pdf') return 'pdf';
  if (file.resourceType === 'image') return 'image';
  if (file.resourceType === 'video') return 'video';
  return 'raw';
};

export function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'pdf' | 'video' | 'raw'>('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/resources')
      .then(setFiles)
      .catch(() => toast.error('Failed to fetch media library'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const type = getFileType(f);
    const matchTab = activeTab === 'all' || type === activeTab;
    return matchSearch && matchTab;
  });

  const counts = {
    all: files.length,
    image: files.filter((f) => getFileType(f) === 'image').length,
    pdf: files.filter((f) => getFileType(f) === 'pdf').length,
    video: files.filter((f) => getFileType(f) === 'video').length,
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const newFile = await api.postForm('/resources', formData);
      setFiles((prev) => [newFile, ...prev]);
      toast.success(`"${file.name}" uploaded successfully!`);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`/resources/${id}`);
      setFiles(files.filter((f) => f._id !== id));
      toast.success('File deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'image', label: 'Images' },
    { key: 'pdf', label: 'PDFs' },
    { key: 'video', label: 'Videos' },
  ] as const;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{files.length} files stored</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-muted-foreground/40 hover:bg-accent/20'
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium text-foreground mb-1">
          {isDragging ? 'Drop to upload' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-muted-foreground">or click to browse • Images, PDFs, Videos supported</p>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">Uploading file...</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-60">({counts[tab.key]})</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-1 sm:justify-end">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
            <button onClick={() => setView('grid')} className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}><Grid3X3 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView('table')} className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((file) => {
            const fType = getFileType(file);
            const Icon = typeIcons[fType] || FileText;
            const displayDate = new Date(file.createdAt).toISOString().split('T')[0];
            return (
              <div key={file._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-all group">
                <div className={`h-28 bg-muted flex items-center justify-center relative overflow-hidden`}>
                  {fType === 'image' && file.url ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="w-8 h-8 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button onClick={() => window.open(file.url, '_blank')} className="bg-white/90 text-gray-900 rounded-md p-1.5 hover:bg-white transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                    <button onClick={() => copyUrl(file.url)} className="bg-white/90 text-gray-900 rounded-md p-1.5 hover:bg-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(file._id)} className="bg-white/90 text-red-600 rounded-md p-1.5 hover:bg-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase ${typeBadgeColors[fType] || typeBadgeColors.raw}`}>{fType}</span>
                    <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && !loading && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">File</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file) => {
                const fType = getFileType(file);
                const Icon = typeIcons[fType] || FileText;
                const displayDate = new Date(file.createdAt).toISOString().split('T')[0];
                return (
                  <tr key={file._id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                          {fType === 'image' && file.url ? (
                            <img src={file.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm text-foreground truncate max-w-[180px]" title={file.name}>{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${typeBadgeColors[fType] || typeBadgeColors.raw}`}>{fType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{formatSize(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{displayDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => window.open(file.url, '_blank')} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                        <button onClick={() => copyUrl(file.url)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(file._id)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No files found</p>
            </div>
          )}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <div><h3 className="text-foreground font-medium">Delete File?</h3><p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p></div>
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
