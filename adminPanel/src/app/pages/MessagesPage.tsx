import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, Clock, X, Loader2, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Message {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  createdAt: string;
}

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    api.get('/contact')
      .then((data) => {
        setMessages(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const filtered = messages.filter((m) => {
    const name = `${m.firstName} ${m.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (m: Message) => {
    try {
      await api.del(`/contact/${m._id}`);
      const updated = messages.filter((x) => x._id !== m._id);
      setMessages(updated);
      if (selected?._id === m._id) setSelected(updated[0] || null);
      setDeleteTarget(null);
      toast.success('Message deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (m: Message) => `${m.firstName[0]}${m.lastName[0]}`.toUpperCase();
  const getFullName = (m: Message) => `${m.firstName} ${m.lastName}`;

  // Extract subject vs body from description
  const parseDescription = (desc: string) => {
    const subjectMatch = desc.match(/^\[(.+?)\]/);
    if (subjectMatch) {
      return { subject: subjectMatch[1], body: desc.replace(/^\[.+?\]\s*/, '') };
    }
    return { subject: '(No Subject)', body: desc };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="max-w-7xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{messages.length} contact messages received</p>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Message list */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              filtered.map((msg) => {
                const { subject } = parseDescription(msg.description);
                return (
                  <div
                    key={msg._id}
                    onClick={() => setSelected(msg)}
                    className={`p-3 cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-accent/50 ${selected?._id === msg._id ? 'bg-accent' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-medium">{getInitials(msg)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-foreground truncate">{getFullName(msg)}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground truncate mt-0.5">{subject}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 bg-card border border-border rounded-xl flex-col overflow-hidden hidden md:flex">
            <div className="p-5 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-white font-medium">{getInitials(selected)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{getFullName(selected)}</p>
                    <p className="text-xs text-muted-foreground">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(selected.createdAt)}
                  </div>
                  <button
                    onClick={() => setDeleteTarget(selected)}
                    className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {(() => {
                const { subject } = parseDescription(selected.description);
                return subject !== '(No Subject)' ? (
                  <div className="mt-3 px-3 py-2 bg-accent rounded-lg">
                    <p className="text-xs font-medium text-foreground">Subject: {subject}</p>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {(() => {
                const { body } = parseDescription(selected.description);
                return body.split('\n').map((line, i) => (
                  <p key={i} className="text-sm text-foreground leading-relaxed mb-2 last:mb-0">
                    {line || <br />}
                  </p>
                ));
              })()}
            </div>

            <div className="p-4 border-t border-border">
              <a
                href={`mailto:${selected.email}?subject=Re: Your message`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full"
              >
                <Mail className="w-4 h-4" />
                Reply via Email Client
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-card border border-border rounded-xl hidden md:flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {messages.length === 0 ? 'No messages yet' : 'Select a message to read'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <div>
              <h3 className="text-foreground font-medium">Delete this message?</h3>
              <p className="text-sm text-muted-foreground mt-1">From: {getFullName(deleteTarget)}</p>
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
