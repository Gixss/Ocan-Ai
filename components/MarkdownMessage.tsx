'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

export default function MarkdownMessage({ content }: { content: string }) {
  const clean = content
    .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
    .replace(/<search>[\s\S]*?<\/search>/g, '')
    .trim();

  return (
    <div className="max-w-none text-slate-800 leading-relaxed text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            if (!inline) return <CodeBlock code={code} language={match?.[1]} />;
            return <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[12.5px]" {...props}>{children}</code>;
          },
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
          h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-slate-900">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2 text-slate-900">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5 text-slate-900">{children}</h3>,
          a: ({ children, href }) => <a href={href} target="_blank" className="text-blue-600 underline">{children}</a>,
          table: ({ children }) => <div className="overflow-x-auto my-3"><table className="border-collapse text-xs">{children}</table></div>,
          th: ({ children }) => <th className="border border-slate-300 px-2 py-1 bg-slate-100">{children}</th>,
          td: ({ children }) => <td className="border border-slate-300 px-2 py-1">{children}</td>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-400 pl-3 italic text-slate-600 my-3">{children}</blockquote>,
        }}
      >
        {clean}
      </ReactMarkdown>
    </div>
  );
}
