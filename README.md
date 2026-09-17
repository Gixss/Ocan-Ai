# Ocan-Ai
<div align="center">

<img src="https://files.catbox.moe/hwql4w.jpg" alt="Ocan AI" width="120" style="border-radius:20px" />

# 🤖 Ocan AI

### Modern AI Assistant Platform — v1.0

**Created By Gixss**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Personal%20Use-red)]()

</div>

---

## ✨ Fitur Unggulan

### 💬 Chat & AI
- 🚀 Streaming real-time (LLaMA 3.3 70B via Groq)
- 🧠 **Mode Berpikir** — preview proses thinking
- 🔍 **Mode Search** — preview hasil pencarian
- ✏️ Edit pesan & Stop generation
- 🎤 **Voice Chat** (speech-to-text & TTS)

### 📁 File & Code
- 📎 Upload file **semua format**
- 💻 Code block dengan tombol **Copy**
- 📥 **Download** code langsung jadi file
- 🔍 **Perbesar** code block (modal fullscreen)
- 📦 Export semua file sebagai **ZIP**

### 👥 Multi-Role System
- 🎭 Login multi-role (Premium, Admin, Developer, Owner, CEO)
- 👑 **Mafia** — Super Admin
- 🎫 Generate kode pembelian otomatis
- 📊 Statistik pengunjung & user real-time
- 🗂️ Database user (tambah/hapus)

### 🎨 UI/UX
- 📱 Responsive (mobile & desktop)
- 🌈 Modern glassmorphism design
- 🎯 Sidebar dengan history chat
- 💬 WhatsApp integration
- 🔤 Custom font (Astral)

---

## 🎭 Role & Akses

| Role | Akses |
|------|-------|
| 🔷 **Premium** | Chat standar |
| 🛡️ **Admin** | Kelola server & user |
| 💻 **Developer** | Akses penuh modul |
| 💼 **Owner** | Pemilik platform |
| ✅ **CEO** | Akses tertinggi |
| 👑 **Mafia** | **Super Admin** (Generate User) |

### 🔐 Kredensial Login

**Mafia (Super Admin):**
```

Username : OcanMafiaKeyUser
Password : OcanMafiaKeyUser828364900183747

```

**User lain** → di-generate oleh Mafia dari dalam aplikasi.

---

## 🚀 Deploy ke Vercel

### Cara 1 — Tombol Deploy (Termudah)

1. Klik tombol **Deploy with Vercel** di atas
2. Import repo `ocan-ai`
3. Set Environment Variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `gsk_xxxxxxxxxxxxx`
4. Deploy 🎉

### Cara 2 — CLI

```bash
git clone https://github.com/USERNAME/ocan-ai.git
cd ocan-ai
npm install
vercel
```

Environment Variables

Variable Deskripsi Wajib
GROQ_API_KEY API Key dari Groq ✅

---

💻 Development Lokal

```bash
# Clone repo
git clone https://github.com/USERNAME/ocan-ai.git
cd ocan-ai

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka http://localhost:3000

Build Production

```bash
npm run build
npm start
```

---

📁 Struktur Project

```
ocan-ai/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles + font
│   ├── page.tsx                # Halaman utama (chat)
│   ├── login/
│   │   └── page.tsx            # Halaman login
│   └── api/
│       └── chat/
│           └── route.ts        # API proxy ke Groq
│
├── components/
│   ├── LoginPage.tsx           # UI Login
│   ├── ChatApp.tsx             # UI Chat utama
│   ├── Sidebar.tsx             # Sidebar drawer
│   ├── MarkdownMessage.tsx     # Render markdown
│   ├── CodeBlock.tsx           # Code block + copy/download
│   └── GenerateUserModal.tsx   # Modal Generate User (Mafia)
│
├── lib/
│   ├── auth.ts                 # Logic login & user DB
│   └── stats.ts                # Logic statistik
│
├── public/
│   └── fonts/
│       └── Astral.ttf          # Custom font
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

---

🔤 Font Custom

Project ini menggunakan font MADE Evolve Sans EVO Medium (rename lokal: Astral).

· Dibuat oleh: MadeType
· Tahun: 2018
· Lisensi: Personal Use Only

Taruh file font di: public/fonts/Astral.ttf

---

📞 Hubungi Developer

Mau beli user Premium/Admin/Owner/CEO? Atau ada pertanyaan?

<div align="center">

https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white

WhatsApp: +62 823-2298-5264

</div>

---

💰 Harga User

Role Harga
🛡️ Admin Rp 25.000 / bulan
💼 Owner Rp 50.000 / bulan
✅ CEO Rp 100.000 / bulan

Cara beli:

1. Login ke aplikasi
2. Klik Up User di sidebar
3. Pilih role yang diinginkan
4. Otomatis redirect ke WhatsApp dengan kode pembelian

---

🛠️ Teknologi

<div align="center">

https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js
https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react
https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript
https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwind-css
https://img.shields.io/badge/Groq-LLaMA_3.3_70B-orange?style=for-the-badge

</div>

---

📜 Lisensi

Personal Use Only © 2024 Gixss

Dilarang:

· ❌ Menjual ulang source code
· ❌ Mengklaim sebagai karya sendiri
· ❌ Menggunakan untuk komersil tanpa izin

Diperbolehkan:

· ✅ Belajar & modifikasi
· ✅ Pakai untuk project pribadi
· ✅ Deploy untuk penggunaan sendiri

---

⭐ Support

Kalau project ini bermanfaat:

· ⭐ Star repo ini
· 🍴 Fork untuk kolaborasi
· 📢 Share ke teman-teman

---

<div align="center">

Made with ❤️ by Gixss

⭐ Jangan lupa kasih bintang ya! ⭐

</div>
