import { useState, useRef } from 'react';
import { Search, Grid3X3, List, Upload, Trash2, Eye, Copy, FileText, ImageIcon, Video, X, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'pdf' | 'video';
  size: string;
  date: string;
  color: string;
}

const initialFiles: MediaFile[] = [
  { id: 1, name: 'profile-photo.jpg', type: 'image', size: '2.4 MB', date: '2024-01-15', color: 'from-blue-400 to-purple-500' },
  { id: 2, name: 'CV_Alex_2024.pdf', type: 'pdf', size: '1.2 MB', date: '2024-01-10', color: 'from-red-400 to-orange-500' },
  { id: 3, name: 'portfolio-screenshot.png', type: 'image', size: '3.8 MB', date: '2024-01-08', color: 'from-green-400 to-teal-500' },
  { id: 4, name: 'aws-certificate.pdf', type: 'pdf', size: '0.8 MB', date: '2023-11-20', color: 'from-orange-400 to-yellow-500' },
  { id: 5, name: 'demo-video.mp4', type: 'video', size: '18.5 MB', date: '2023-12-05', color: 'from-purple-400 to-pink-500' },
  { id: 6, name: 'ecommerce-app.png', type: 'image', size: '4.1 MB', date: '2023-12-01', color: 'from-teal-400 to-cyan-500' },
  { id: 7, name: 'meta-certificate.pdf', type: 'pdf', size: '0.9 MB', date: '2023-06-15', color: 'from-blue-400 to-indigo-500' },
  { id: 8, name: 'project-demo.mp4', type: 'video', size: '24.3 MB', date: '2023-11-10', color: 'from-yellow-400 to-orange-500' },
  { id: 9, name: 'tech-stack-diagram.png', type: 'image', size: '1.5 MB', date: '2023-10-20', color: 'from-pink-400 to-rose-500' },
  { id: 10, name: 'freecodecamp-cert.pdf', type: 'pdf', size: '0.6 MB', date: '2022-09-01', color: 'from-purple-400 to-violet-500' },
  { id: 11, name: 'headshot-2024.jpg', type: 'image', size: '1.8 MB', date: '2024-01-20', color: 'from-green-400 to-emerald-500' },
  { id: 12, name: 'landing-page.png', type: 'image', size: '2.2 MB', date: '2024-01-05', color: 'from-sky-400 to-blue-500' },
];

const typeIcons = {
  image: ImageIcon,
  pdf: FileText,
  video: Video,
};

const typeColors = {
  image: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  pdf: 'bg-red-500/10 text-red-600 dark:text-red-400',
  video: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const typeBadgeColors = {
  image: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  pdf: 'bg-red-500/15 text-red-600 dark:text-red-400',
  video: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
};

export function MediaLibraryPage() {
  const [files, setFiles] = useState(initialFiles);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'pdf' | 'video'>('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'all' || f.type === activeTab;
    return matchSearch && matchTab;
  });

  const counts = {
    all: files.length,
    image: files.filter((f) => f.type === 'image').length,
    pdf: files.filter((f) => f.type === 'pdf').length,
    video: files.filter((f) => f.type === 'video').length,
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setUploading(true);
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setUploadProgress(i);
    }
    const type = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'video';
    const sizeKB = Math.round(file.size / 1024);
    const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
    const colors = ['from-blue-400 to-purple-500', 'from-green-400 to-teal-500', 'from-orange-400 to-yellow-500', 'from-pink-400 to-rose-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newFile: MediaFile = { id: Date.now(), name: file.name, type, size, date: new Date().toISOString().split('T')[0], color };
    setFiles((prev) => [newFile, ...prev]);
    setUploading(false);
    setUploadProgress(0);
    toast.success(`"${file.name}" uploaded successfully!`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter((f) => f.id !== id));
    setDeleteId(null);
    toast.success('File deleted');
  };

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(`https://cdn.example.com/media/${name}`);
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
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Uploading...</p>
            <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
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
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((file) => {
            const Icon = typeIcons[file.type];
            return (
              <div key={file.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-all group">
                <div className={`h-28 bg-gradient-to-br ${file.color} flex items-center justify-center relative`}>
                  <Icon className="w-8 h-8 text-white/80" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button onClick={() => copyUrl(file.name)} className="bg-white/90 text-gray-900 rounded-md p-1.5 hover:bg-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(file.id)} className="bg-white/90 text-red-600 rounded-md p-1.5 hover:bg-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase ${typeBadgeColors[file.type]}`}>{file.type}</span>
                    <span className="text-xs text-muted-foreground">{file.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
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
                const Icon = typeIcons[file.type];
                return (
                  <tr key={file.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${file.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white/80" />
                        </div>
                        <span className="text-sm text-foreground truncate max-w-[180px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${typeBadgeColors[file.type]}`}>{file.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{file.size}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{file.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => copyUrl(file.name)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(file.id)} className="w-7 h-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
