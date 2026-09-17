'use client';
export type Role = 'Mafia' | 'Premium' | 'Admin' | 'Developer' | 'Owner' | 'CEO';

export interface User {
  username: string;
  role: Role;
  loginAt: number;
  expiry?: string;
}

// ===== HARDCODED — HANYA MAFIA =====
const MAFIA_CRED = {
  user: 'OcanMafiaKeyUser',
  pass: 'OcanMafiaKeyUser828364900183747',
};

const USERS_KEY = 'ocan_ai_users_db';
const SESSION_KEY = 'ocan_ai_user';

export interface StoredUser {
  username: string;
  password: string;
  role: Role;
  expiry: string;
  createdAt: number;
}

// ===== DATABASE USER (localStorage) =====
export function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function addUser(u: StoredUser) {
  const users = getUsers();
  users.push(u);
  saveUsers(users);
}
export function deleteUser(username: string) {
  const users = getUsers().filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  saveUsers(users);
}

// ===== LOGIN =====
export function tryLogin(username: string, password: string): User | null {
  const uname = username.trim();
  if (!uname || !password) return null;

  // 1. Cek Mafia hardcoded
  if (uname === MAFIA_CRED.user && password === MAFIA_CRED.pass) {
    const u: User = { username: uname, role: 'Mafia', loginAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return u;
  }

  // 2. Cek database user
  const db = getUsers();
  const found = db.find(
    (u) => u.username.toLowerCase() === uname.toLowerCase() && u.password === password
  );
  if (!found) return null;

  // 3. Cek expired
  if (found.expiry) {
    const exp = new Date(found.expiry).getTime();
    if (Date.now() > exp) return null;
  }

  const u: User = {
    username: found.username,
    role: found.role,
    loginAt: Date.now(),
    expiry: found.expiry,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  return u;
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// ===== UTILS =====
export function genPurchaseCode() {
  const rand = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OCAN-${rand()}-${rand()}`;
}
export function genUserPassword(len = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export const WHATSAPP_NUMBER = '6282322985264';
export function waLink(msg: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const PRICING = [
  { role: 'Admin', price: 'Rp 25.000 / bulan' },
  { role: 'Owner', price: 'Rp 50.000 / bulan' },
  { role: 'CEO',   price: 'Rp 100.000 / bulan' },
];