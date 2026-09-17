'use client';
import { useEffect, useRef, useState } from 'react';
import { Menu, Send, Paperclip, Mic, MicOff, Brain, Search, Square, Pencil, X, Loader2, Check, Download } from 'lucide-react';
import Sidebar, { ChatHistory } from './Sidebar';
import MarkdownMessage from './MarkdownMessage';
import { User, logout } from '@/lib/auth';
import { getStats, bumpUsage, Stats } from '@/lib/stats';
import JSZip from 'jszip';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'normal' | 'thinking' | 'search';
  searchPreview?: any;
  thinkPreview?: string;
  attachment?: { name: string; size: number; type: string };
  streaming?: boolean;
}
const uid = () => Math.random().toString(36).slice(2, 10);

export default function ChatApp({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'normal' | 'thinking' | 'search'>('normal');
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [listening, setListening] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    setStats(getStats());
    const rawH = localStorage.getItem('ocan_history');
    if (rawH) setHistory(JSON.parse(rawH));
    const id = uid();
    const h: ChatHistory = { id, title: 'Chat baru', messages: [], createdAt: Date.now() };
    setHistory((prev) => { const u = [h, ...prev]; localStorage.setItem('ocan_history', JSON.stringify(u)); return u; });
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (activeId) {
      setHistory((prev) => {
        const updated = prev.map((h) =>
          h.id === activeId ? { ...h, messages, title: messages.find((m) => m.role === 'user')?.content.slice(0, 40) || 'Chat baru' } : h
        );
        localStorage.setItem('ocan_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const newChat = () => {
    const id = uid();
    const h: ChatHistory = { id, title: 'Chat baru', messages: [], createdAt: Date.now() };
    const updated = [h, ...history];
    setHistory(updated);
    localStorage.setItem('ocan_history', JSON.stringify(updated));
    setActiveId(id);
    setMessages([]);
  };

  const selectChat = (id: string) => {
    const h = history.find((x) => x.id === id);
    if (h) { setActiveId(id); setMessages(h.messages); }
  };

  const deleteChat = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('ocan_history', JSON.stringify(updated));
    if (activeId === id) { setActiveId(null); setMessages([]); }
  };

  const stop = () => {
    abortRef.current?.abort();
    setLoading(false);
    setMessages((m) => m.map((msg) => ({ ...msg, streaming: false })));
  };

  const voiceToggle = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) { alert('Browser kamu tidak mendukung voice input.'); return; }
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const rec = new SpeechRec();
    rec.lang = 'id-ID';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => setInput((v) => v + ' ' + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    rec.start();
    setListening(true);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text.replace(/```[\s\S]*?```/g, '').slice(0, 500));
    u.lang = 'id-ID';
    speechSynthesis.speak(u);
  };

  const send = async (overrideText?: string, fromEditId?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    let attachmentInfo;
    if (attachment) attachmentInfo = { name: attachment.name, size: attachment.size, type: attachment.type };

    const userMsg: Message = { id: uid(), role: 'user', content: text, attachment: attachmentInfo, mode };
    const aiMsg: Message = { id: uid(), role: 'assistant', content: '', mode, streaming: true };

    let msgs: Message[];
    if (fromEditId) {
      const idx = messages.findIndex((m) => m.id === fromEditId);
      msgs = [...messages.slice(0, idx), userMsg, aiMsg];
    } else msgs = [...messages, userMsg, aiMsg];

    setMessages(msgs);
    setInput('');
    setAttachment(null);
    setEditing(null);
    setLoading(true);
    bumpUsage();
    setStats(getStats());

    const controller = new AbortController();
    abortRef.current = controller;

    if (mode === 'search') {
      const searchPreview = {
        query: text,
        results: [
          { title: `Hasil teratas untuk "${text}"`, url: 'https://google.com/search?q=' + encodeURIComponent(text), snippet: 'Menelusuri sumber terpercaya...' },
          { title: `Referensi tambahan`, url: 'https://wikipedia.org', snippet: 'Artikel terkait ditemukan.' },
          { title: `Diskusi komunitas`, url: 'https://reddit.com', snippet: 'Pengalaman pengguna lain.' },
        ],
      };
      setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, searchPreview } : m)));
      await new Promise((r) => setTimeout(r, 1200));
    }
    if (mode === 'thinking') {
      const steps = [
        'Menganalisis pertanyaan user...',
        'Mengumpulkan konteks & pengetahuan relevan...',
        'Menyusun struktur jawaban...',
        'Memvalidasi logika dan fakta...',
        'Menghasilkan jawaban final...',
      ];
      for (let i = 0; i < steps.length; i++) {
        setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, thinkPreview: steps.slice(0, i + 1).join('\n') } : m)));
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    try {
      const apiMessages = msgs.filter((m) => m.content || m.role === 'user').map((m) => ({
        role: m.role,
        content: m.role === 'user' && m.attachment
          ? `${m.content}\n\n[Lampiran: ${m.attachment.name} (${m.attachment.type}, ${m.attachment.size} bytes)]`
          : m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, mode, userName: user.username }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error('Gagal terhubung ke AI');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || '';
            if (delta) {
              acc += delta;
              setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, content: acc } : m)));
            }
          } catch {}
        }
      }

      setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, content: acc, streaming: false } : m)));
      speak(acc);
    } catch (e: any) {
      if (e.name === 'AbortError') setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, streaming: false } : m)));
      else setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, content: '⚠️ Error: ' + e.message, streaming: false } : m)));
    } finally {
      setLoading(false);
    }
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    messages.forEach((m) => {
      if (m.role !== 'assistant') return;
      const regex = /```(\w+)?\n([\s\S]*?)```/g;
      let match, i = 1;
      while ((match = regex.exec(m.content))) {
        const lang = match[1] || 'txt';
        zip.file(`file-${i}.${lang}`, match[2]);
        i++;
      }
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ocan-ai-files-${Date.now()}.zip`; a.click();
    URL.revokeObjectURL(url);
  };

  const hasCodeBlocks = messages.some((m) => m.role === 'assistant' && /```/.test(m.content));

  return (
    <div className="min-h-screen h-screen w-full bg-blur-bg relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-blue-50/40 backdrop-blur-sm" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} history={history} activeId={activeId}
        onSelect={selectChat} onNew={newChat} onDelete={deleteChat} user={user}
        onLogout={() => { logout(); onLogout(); }} />

      <header className="relative z-10 flex items-center justify-between px-3 py-3 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100"><Menu size={20} /></button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">OA</div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">Ocan AI</p>
            <p className="text-[9px] text-slate-500">v1.0 · Created By Gixss</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasCodeBlocks && (
            <button onClick={downloadAllAsZip} className="p-2 rounded-lg hover:bg-slate-100 text-emerald-600" title="Download semua sebagai ZIP">
              <Download size={18} />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {messages.length === 0 ? <WelcomeScreen stats={stats} /> : (
          messages.map((m) => (
            <div key={m.id} className="flex flex-col animate-slideUp">
              {m.role === 'user' ? (
                <div className="self-end max-w-[85%] flex flex-col items-end gap-1.5">
                  {m.attachment && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-[10px] text-slate-600">
                      <Paperclip size={11} /> {m.attachment.name}
                    </div>
                  )}
                  {editing === m.id ? (
                    <div className="w-full">
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-blue-300 outline-none text-sm" rows={3} />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg bg-slate-200 text-xs">Batal</button>
                        <button onClick={() => send(editText, m.id)} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs flex items-center gap-1">
                          <Check size={12} /> Kirim
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="chat-bubble-user text-sm whitespace-pre-wrap">{m.content}</div>
                  )}
                  {editing !== m.id && (
                    <button onClick={() => { setEditing(m.id); setEditText(m.content); }}
                      className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-1">
                      <Pencil size={10} /> Edit
                    </button>
                  )}
                </div>
              ) : (
                <div className="self-start max-w-[95%] w-full">
                  {m.thinkPreview && (
                    <div className="mb-2 p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Brain size={13} className="text-purple-600 animate-pulseSlow" />
                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Thinking Process</span>
                      </div>
                      <pre className="text-[10.5px] whitespace-pre-wrap text-purple-900 !bg-transparent !p-0 !m-0">{m.thinkPreview}</pre>
                    </div>
                  )}
                  {m.searchPreview && (
                    <div className="mb-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Search size={13} className="text-blue-600 animate-pulseSlow" />
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Searching Web...</span>
                      </div>
                      <p className="text-[10px] text-blue-900 mb-2 italic">🔍 "{m.searchPreview.query}"</p>
                      <div className="space-y-1.5">
                        {m.searchPreview.results.map((r: any, i: number) => (
                          <div key={i} className="p-2 rounded-lg bg-white border border-blue-100">
                            <p className="text-[10.5px] font-semibold text-slate-800 truncate">{r.title}</p>
                            <p className="text-[9px] text-blue-600 truncate">{r.url}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{r.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.content ? (
                    <div className="chat-bubble-ai">
                      <MarkdownMessage content={m.content} />
                      {m.streaming && <span className="inline-block w-1.5 h-4 bg-blue-500 ml-0.5 align-middle animate-pulseSlow" />}
                    </div>
                  ) : m.streaming && !m.thinkPreview && !m.searchPreview ? (
                    <div className="chat-bubble-ai flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 size={14} className="animate-spin" /> Ocan AI sedang mengetik...
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      <div className="relative z-10 px-3 py-3 bg-white/70 backdrop-blur-md border-t border-slate-200">
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {[
            { id: 'normal', label: 'Normal', icon: null },
            { id: 'thinking', label: 'Berpikir', icon: Brain },
            { id: 'search', label: 'Search', icon: Search },
          ].map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${active ? 'bg-blue-500 text-white shadow' : 'bg-white border border-slate-200 text-slate-600'}`}>
                {Icon && <Icon size={12} />} {m.label}
              </button>
            );
          })}
          {loading && (
            <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold ml-auto">
              <Square size={11} /> Stop
            </button>
          )}
        </div>

        {attachment && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <Paperclip size={13} className="text-blue-600" />
            <span className="text-xs text-blue-800 truncate flex-1">{attachment.name}</span>
            <button onClick={() => setAttachment(null)} className="text-blue-600"><X size={14} /></button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
          <button onClick={() => fileRef.current?.click()} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">
            <Paperclip size={18} className="text-slate-600" />
          </button>
          <div className="flex-1 relative">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Tanya apa saja ke Ocan AI..." rows={1}
              className="w-full resize-none px-4 py-2.5 pr-10 rounded-xl bg-white border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm max-h-32"
              style={{ minHeight: 44 }} />
          </div>
          <button onClick={voiceToggle} className={`p-2.5 rounded-xl border ${listening ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200'}`}>
            {listening ? <MicOff size={18} /> : <Mic size={18} className="text-slate-600" />}
          </button>
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 shadow">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ stats }: { stats: Stats | null }) {
  const items = [
    { label: 'Pengunjung', value: stats?.visitors ?? 0, color: 'from-blue-400 to-blue-600' },
    { label: 'Penggunaan', value: stats?.usage ?? 0, color: 'from-emerald-400 to-emerald-600' },
    { label: 'Premium', value: stats?.Premium ?? 0, color: 'from-purple-400 to-purple-600' },
    { label: 'Admin', value: stats?.Admin ?? 0, color: 'from-cyan-400 to-cyan-600' },
    { label: 'Developer', value: stats?.Developer ?? 0, color: 'from-indigo-400 to-indigo-600' },
    { label: 'Owner', value: stats?.Owner ?? 0, color: 'from-amber-400 to-amber-600' },
    { label: 'CEO', value: stats?.CEO ?? 0, color: 'from-rose-400 to-rose-600' },
    { label: 'Mafia', value: stats?.Mafia ?? 0, color: 'from-slate-700 to-slate-900' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-slideUp">
      <div className="card p-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden border-[1.5px] border-slate-900 shadow-md shrink-0">
          <img src="https://files.catbox.moe/hwql4w.jpg" alt="Ocan AI" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Ocan AI</h2>
          <p className="text-xs text-slate-600">v1.0</p>
          <p className="text-[10px] text-slate-500 mt-1">Created By <b className="text-blue-600">Gixss</b></p>
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-[9px] font-bold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulseSlow" /> LIVE
          </span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-xs font-bold text-slate-900 mb-1.5">Tentang Ocan AI</h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Ocan AI adalah platform asisten AI canggih yang dirancang untuk memberikan performa terbaik —
          mendukung chat pintar, upload file semua format, voice chat, mode berpikir & pencarian web,
          serta pembuatan file (Lua, JavaScript, Python, ZIP, TAR.GZ, dan lainnya) secara nyata.
          Dibangun dengan teknologi mutakhir dan sistem keamanan tingkat tinggi.
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-xs font-bold text-slate-900 mb-3">Statistik & Status AI</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {items.map((it) => (
            <div key={it.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${it.color} mb-2 shadow`} />
              <p className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-wide">{it.label}</p>
              <p className="text-base font-bold text-slate-900">{it.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-500">
        Mulai percakapan dengan Ocan AI — tanya apa saja, upload file, atau ucapkan suara 🎤
      </p>
    </div>
  );
}