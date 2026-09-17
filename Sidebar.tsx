'use client';
import { X, Plus, MessageSquare, LogOut, Crown, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { PRICING, User as UserT, waLink, genPurchaseCode } from '@/lib/auth';
import GenerateUserModal from './GenerateUserModal';

export interface ChatHistory {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  history: ChatHistory[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  user: UserT;
  onLogout: () => void;
}

export default function Sidebar({
  open, onClose, history, activeId, onSelect, onNew, onDelete, user, onLogout,
}: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);

  const isMafia = user.role === 'Mafia';

  const buy = (role: string, price: string) => {
    const code = genPurchaseCode();
    const msg = `Halo Developer Ocan AI 👋\n\nSaya ingin membeli akun *${role}*\nHarga: ${price}\nKode Pembelian: *${code}*\nUsername saya: ${user.username}\n\nMohon diproses ya 🙏`;
    window.open(waLink(msg), '_blank');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-[300px] z-50 bg-white border-r-[1.5px] border-slate-900 transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">OA</div>
            <div>
              <p className="text-sm font-bold">Ocan AI</p>
              <p className="text-[10px] text-slate-500">v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${isMafia ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.username}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${isMafia ? 'bg-slate-900 text-white' : 'bg-purple-100 text-purple-700'}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => { onNew(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 btn-primary text-sm"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Riwayat Chat
          </p>
          {history.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat</p>
          )}
          {history.map((h) => (
            <div
              key={h.id}
              className={`group flex items-center gap-2 p-2 rounded-lg mb-1 cursor-pointer transition ${activeId === h.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100'}`}
              onClick={() => { onSelect(h.id); onClose(); }}
            >
              <MessageSquare size={14} className="text-slate-500 shrink-0" />
              <span className="text-xs truncate flex-1">{h.title || 'Chat baru'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(h.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t p-3 space-y-2">
          {/* Generate User — hanya Mafia */}
          {isMafia && (
            <button
              onClick={() => { setShowGenerate(true); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 text-sm font-bold border border-emerald-200"
            >
              <UserPlus size={16} /> Generate User
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-slate-900 text-white font-bold">
                MAFIA
              </span>
            </button>
          )}

          <button
            onClick={() => setShowUpgrade((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-700 text-sm font-semibold"
          >
            <Crown size={16} /> Up User
          </button>
          {showUpgrade && (
            <div className="space-y-2 pl-1">
              {PRICING.map((p) => (
                <button
                  key={p.role}
                  onClick={() => buy(p.role, p.price)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <p className="text-xs font-bold text-slate-800">{p.role}</p>
                  <p className="text-[10px] text-slate-500">{p.price}</p>
                  <p className="text-[9px] text-emerald-600 mt-1">→ Hubungi Developer via WhatsApp</p>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm font-semibold"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Modal Generate User */}
      <GenerateUserModal open={showGenerate} onClose={() => setShowGenerate(false)} />
    </>
  );
}