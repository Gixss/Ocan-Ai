'use client';
import { useState } from 'react';
import { Copy, Check, Download, Maximize2, X } from 'lucide-react';

const LANG_EXT: Record<string, string> = {
  javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts',
  python: 'py', py: 'py', lua: 'lua', html: 'html', css: 'css',
  json: 'json', bash: 'sh', sh: 'sh', sql: 'sql',
  java: 'java', c: 'c', cpp: 'cpp', go: 'go', rust: 'rs', rs: 'rs',
  php: 'php', ruby: 'rb', swift: 'swift', kotlin: 'kt', dart: 'dart',
  yaml: 'yml', xml: 'xml', markdown: 'md', md: 'md', txt: 'txt',
};

export default function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lang = (language || 'txt').toLowerCase();
  const ext = LANG_EXT[lang] || 'txt';
  const firstLine = code.split('\n')[0] || '';
  const fileMatch = firstLine.match(/(?:filename|file|nama\s*file)[\s:]*[`"']?([\w\-.]+\.\w+)/i);
  const fileName = fileMatch ? fileMatch[1] : `script-${Date.now()}.${ext}`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="my-3 rounded-2xl overflow-hidden border-[1.5px] border-slate-900 bg-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,0.85)]">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-slate-300 font-mono ml-2">{fileName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={copy} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300">
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
            <button onClick={download} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300">
              <Download size={13} />
            </button>
            <button onClick={() => setExpanded(true)} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300">
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
        <pre className="!rounded-none !m-0"><code>{code}</code></pre>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setExpanded(false)}>
          <div className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[88vh] overflow-hidden border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <span className="text-xs text-slate-300 font-mono">{fileName}</span>
              <div className="flex gap-2">
                <button onClick={copy} className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1.5">
                  {copied ? <Check size={12} /> : <Copy size={12} />} Copy
                </button>
                <button onClick={download} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs flex items-center gap-1.5">
                  <Download size={12} /> Download
                </button>
                <button onClick={() => setExpanded(false)} className="p-1.5 rounded-lg bg-slate-700 text-slate-200">
                  <X size={14} />
                </button>
              </div>
            </div>
            <pre className="!rounded-none !m-0 !max-h-[78vh]"><code>{code}</code></pre>
          </div>
        </div>
      )}
    </>
  );
}