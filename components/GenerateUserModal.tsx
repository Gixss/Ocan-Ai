'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Copy, Check, UserPlus } from 'lucide-react';
import {
  Role, StoredUser, getUsers, addUser, deleteUser, genUserPassword,
} from '@/lib/auth';

export default function GenerateUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Premium');
  const [expiry, setExpiry] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setUsers(getUsers());
      setPassword(genUserPassword());
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setExpiry(d.toISOString().split('T')[0]);
    }
  }, [open]);

  const generate = () => {
    const uname = username.trim();
    if (!uname) return alert('Username wajib diisi');
    if (uname.length < 3) return alert('Username minimal 3 karakter');
    if (uname === 'OcanMafiaKeyUser') return alert('Username ini sudah dipakai Mafia');

    const exists = getUsers().some((u) => u.username.toLowerCase() === uname.toLowerCase());
    if (exists) return alert('Username sudah dipakai');

    const finalPass = password.trim() || genUserPassword();
    const newUser: StoredUser = {
      username: uname,
      password: finalPass,
      role,
      expiry: new Date(expiry).toISOString(),
      createdAt: Date.now(),
    };
    addUser(newUser);
    setUsers(getUsers());
    setUsername('');
    setPassword(genUserPassword());

    // Auto copy ke clipboard
    navigator.clipboard.writeText(`Username: ${uname}\nPassword: ${finalPass}\nRole: ${role}\nExpired: ${expiry}`);
    alert(`✅ User berhasil dibuat!\n\nUsername: ${uname}\nPassword: ${finalPass}\nRole: ${role}\nExpired: ${expiry}\n\n(Copied to clipboard)`);
  };

  const remove = (uname: string) => {
    if (!confirm(`Hapus user "${uname}"?`)) return;
    deleteUser(uname);
    setUsers(getUsers());
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-[1.5px] border-slate-900 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-slate-900 to-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Generate User — Mafia Access</h3>
              <p className="text-[10px] text-slate-300">Buat, kelola, dan hapus user database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 border-b bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="contoh: budi123"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password</label>
              <div className="flex gap-1 mt-1">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 font-mono bg-white"
                />
                <button
                  type="button"
                  onClick={() => setPassword(genUserPassword())}
                  className="px-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs"
                  title="Random password"
                >
                  🎲
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="Premium">Premium</option>
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Owner">Owner</option>
                <option value="CEO">CEO</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Expired</label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          <button
            onClick={generate}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Plus size={16} /> Generate User
          </button>
        </div>

        {/* Database */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Database User ({users.length})
            </p>
          </div>

          {users.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">
              Belum ada user yang di-generate
            </p>
          )}

          <div className="space-y-2">
            {users.map((u) => {
              const expired = new Date(u.expiry).getTime() < Date.now();
              return (
                <div
                  key={u.username}
                  className={`p-3 rounded-xl border ${expired ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold truncate text-slate-800">{u.username}</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                          {u.role}
                        </span>
                        {expired ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                            EXPIRED
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate mt-1">
                        pass: {u.password}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Exp: {new Date(u.expiry).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() =>
                          copy(
                            `Username: ${u.username}\nPassword: ${u.password}\nRole: ${u.role}`,
                            u.username
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                        title="Copy kredensial"
                      >
                        {copiedId === u.username ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => remove(u.username)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                        title="Hapus user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}