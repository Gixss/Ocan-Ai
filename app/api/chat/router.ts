import { NextRequest } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, userName } = await req.json();

    let system = `Kamu adalah "Ocan AI" v1.0, asisten AI canggih dari tim Ocan AI (Created By Gixss).
Kamu cerdas, ramah, sangat detail, dan menjawab dengan bahasa yang sama dengan user.
Aturan:
- Selalu jelaskan dengan panjang, detail, dan jelas.
- Jika user meminta kode, SELALU bungkus dalam fenced code block dengan nama bahasa tepat.
- Jika user minta "buatkan file", berikan code block dengan nama file sebagai komentar di baris pertama, contoh: -- filename: script.lua
- Gunakan heading, bullet, dan tabel markdown jika perlu.`;

    if (mode === 'thinking') {
      system += `\n\nMODE THINKING — Tulis proses berpikirmu di dalam tag <thinking>...</thinking> terlebih dahulu, lalu jawaban final.`;
    }
    if (mode === 'search') {
      system += `\n\nMODE SEARCH — Tulis hasil pencarian dalam tag <search>...</search>, lalu jawaban final.`;
    }
    if (userName) system += `\n\nNama user: ${userName}.`;

    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: system }, ...messages],
        stream: true,
        temperature: 0.75,
        max_tokens: 4096,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return new Response(JSON.stringify({ error: err }), { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
