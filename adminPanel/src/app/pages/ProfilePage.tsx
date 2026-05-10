import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Plus, Save, FileText, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [cvFile, setCvFile] = useState('');
  const [cvName, setCvName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<File | null>(null);
  const cvFileRef = useRef<File | null>(null);

  useEffect(() => {
    api.get('/profile')
      .then((data) => {
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
          setRoles(data.role || []);
          setDescription(data.description || '');
          setAbout(data.aboutMe || '');
          setProfileImage(data.profileImage || '');
          setCvFile(data.cvFile || '');
          if (data.cvFile) setCvName('Current CV (from cloud)');
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const addRole = () => {
    const trimmed = newRole.trim();
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed]);
      setNewRole('');
    }
  };

  const removeRole = (r: string) => setRoles(roles.filter((x) => x !== r));

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('role', JSON.stringify(roles));
      formData.append('description', description);
      formData.append('aboutMe', about);
      if (imgFileRef.current) formData.append('profileImage', imgFileRef.current);
      if (cvFileRef.current) formData.append('cvFile', cvFileRef.current);
      await api.putForm('/profile', formData);
      toast.success('Profile saved successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imgFileRef.current = file;
      setProfileImage(URL.createObjectURL(file));
      toast.success('Photo ready — save to upload');
    }
  };

  const handleCvChange = (file: File) => {
    cvFileRef.current = file;
    setCvName(file.name);
    toast.success(`CV "${file.name}" ready — save to upload`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') handleCvChange(file);
    else toast.error('Please drop a PDF file');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your public profile information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile image */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4">
          <div className="relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{name ? name[0]?.toUpperCase() : 'A'}</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card hover:opacity-90 transition-opacity"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">{name || 'Your Name'}</p>
            <p className="text-sm text-muted-foreground">{roles[0] || 'Your Role'}</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Photo
          </button>
          <p className="text-xs text-muted-foreground text-center">JPG, PNG or GIF. Max 5MB.</p>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-foreground font-medium">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-1234"
                  className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Roles <span className="text-xs text-muted-foreground font-normal">(displayed in typewriter effect)</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {roles.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {r}
                    <button onClick={() => removeRole(r)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRole()}
                  placeholder="Add a role..."
                  className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={addRole} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-foreground mb-1.5">About Me</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={5}
              className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
            />
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-foreground font-medium mb-4">CV / Resume</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => cvInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50 hover:bg-accent/30'
          }`}
        >
          <input ref={cvInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => {
            if (e.target.files?.[0]) handleCvChange(e.target.files[0]);
          }} />
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Drop your CV here or click to browse</p>
          <p className="text-xs text-muted-foreground">PDF files only, max 10MB</p>
        </div>
        {cvName && (
          <div className="mt-3 flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border">
            <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{cvName}</p>
              {cvFile && <a href={cvFile} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View current CV</a>}
            </div>
            <button onClick={() => { setCvName(''); cvFileRef.current = null; }} className="text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
