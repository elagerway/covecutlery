"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Copy, Check } from "lucide-react";

interface LessonContentProps {
  content: string;
  contentType: string;
}

function VideoThumbnail({ src, ytId, caption }: { src: string; ytId: string; caption: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="my-6 aspect-video overflow-hidden rounded-xl border border-neutral-700">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative my-6 block w-full overflow-hidden rounded-xl border border-neutral-700 cursor-pointer"
    >
      <img src={src} alt={caption} className="w-full transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/20">
        <div className="flex size-20 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1 size-9 text-neutral-900" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10">
          <p className="text-sm font-medium text-white text-left">{caption}</p>
        </div>
      )}
    </button>
  );
}

function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = typeof children === "string"
      ? children
      : (children as any)?.props?.children ?? "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <pre
      className="group relative my-6 overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-900 p-5 pr-12 text-sm text-emerald-400"
      {...props}
    >
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-500 opacity-0 transition-all hover:bg-neutral-800 hover:text-emerald-400 group-hover:opacity-100"
        title="Copy"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      {children}
    </pre>
  );
}

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-6 mt-10 text-3xl font-bold tracking-tight text-white first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-white" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold text-white" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-5 leading-7 text-neutral-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-6 ml-1 space-y-2 text-neutral-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 ml-1 space-y-2 list-decimal list-inside text-neutral-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7 pl-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-2 border-emerald-500/50 bg-emerald-500/5 py-3 pl-5 pr-4 rounded-r-lg italic text-neutral-300"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-10 border-neutral-700" {...props} />,
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-white" {...props}>{children}</strong>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-700">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border-b border-neutral-700 bg-neutral-800 px-4 py-2.5 text-left font-semibold text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-neutral-800 px-4 py-2.5 text-neutral-300" {...props}>
      {children}
    </td>
  ),
  img: ({ src, alt, ...props }) => {
    const videoMatch = alt?.match(/^video:(https?:\/\/[^\s]+)\s*(.*)/);
    if (videoMatch) {
      const videoUrl = videoMatch[1];
      const caption = videoMatch[2] || "";
      const ytId = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/)?.[1];
      if (ytId) {
        return <VideoThumbnail src={String(src ?? "")} ytId={ytId} caption={caption} />;
      }
    }
    return <img src={src} alt={alt ?? ""} className="my-6 rounded-xl border border-neutral-700 w-full" {...props} />;
  },
  a: ({ href, children, ...props }) => {
    const ytMatch = href?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
    if (ytMatch) {
      return (
        <div className="my-6 aspect-video overflow-hidden rounded-xl border border-neutral-700">
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return <a href={href} className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
};

export function LessonContent({ content, contentType }: LessonContentProps) {
  return (
    <div className="mb-12 max-w-none">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
