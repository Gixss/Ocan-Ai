'use client';
import { useEffect, useState } from 'react';
import { Shield, Code2, Briefcase, BadgeCheck, MessageCircle, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Role, tryLogin, User, WHATSAPP_NUMBER, genPurchaseCode } from '@/lib/auth';

const ROLES: { role: Role; icon: any; color: string; desc: string }[] = [
  { role: 'Premium',   icon: Sparkles,   color: 'from-emerald-400 to-emerald-600', desc: 'Akses standar chat AI' },
  { role: 'Admin',     icon: Shield,     color: 'from-blue-400 to-blue-600',       desc: 'Kelola server & user' },
  { role: 'Developer', icon: Code2,      color: 'from-purple-400 to-purple-600',   desc: 'Akses penuh modul' },
  { role: 'Owner',     icon: Briefcase,  color: 'from-amber-400 to-amber-600',     desc: 'Pemilik platform' },
  { role: 'CEO',       icon: BadgeCheck, color: 'from-rose-400 to-rose-600',       desc: 'Akses tertinggi' },
];

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [tab, setTab] = useState<Role>('Premium');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseCode, setPurchaseCode] = useState('');

  useEffect(() => { setPurchaseCode(genPurchaseCode()); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    // Coba Mafia dulu, kalau tidak cek database user
    const user = tryLogin(username, password);
    if (!user) {
      setError('Username atau password salah, atau akun sudah expired');
    } else {
      onLogin(user);
    }
    setLoading(false);
  };

  const buyClick = () => {
    const msg = `Halo Developer Ocan AI 👋\n\nSaya ingin membeli akses user.\nKode Pembelian: *${purchaseCode}*\nRole yang saya butuhkan: *${tab}*\n\nMohon info harga & cara pembayarannya 🙏`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-blur-bg relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/70 to-purple-900/60" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-6 animate-slideUp">
          <div className="inline-flex items-center gap-3 glass px-5 py-3 rounded-2xl border border-white/30">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              OA
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white tracking-wide">Ocan AI</h1>
              <p className="text-[10px] text-white/70">Created By Gixss · v1.0</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 shadow-2xl border border-white/40 animate-slideUp">
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = tab === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => { setTab(r.role); setError(''); }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-semibold transition ${active ? 'bg-white shadow-md scale-105' : 'bg-white/40 hover:bg-white/60'}`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white`}>
                    <Icon size={14} />
                  </div>
                  <span className="text-slate-800">{r.role}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-700 mb-3 text-center">
            {ROLES.find((r) => r.role === tab)?.desc}
          </p>

          <form onSubmit={submit} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition"
            />
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm pr-11 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-[10px] text-amber-800 font-semibold mb-1">🎫 Kode Pembelian Kamu:</p>
            <p className="font-mono text-sm font-bold text-amber-900 tracking-wider">{purchaseCode}</p>
          </div>

          <button
            onClick={buyClick}
            className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <MessageCircle size={16} /> Hubungin Developer Untuk Membeli User
          </button>
        </div>
      </div>
    </div>
  );
}