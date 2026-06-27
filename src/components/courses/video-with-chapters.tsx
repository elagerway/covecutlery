"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Chapter = { seconds: number; label: string };

// Chapters keyed by YouTube video id. The Level 1 practicum is a single video
// whose 20 chapters double as navigation for the whole Practicum module — every
// practicum lesson deep-links into this same video at its own start time and
// shows this clickable chapter list. Add more videos here as they're produced.
const CHAPTERS_BY_VIDEO: Record<string, Chapter[]> = {
  _Aam40x1HDw: [
    { seconds: 0, label: "Introduction" },
    { seconds: 34, label: "Safety & Protective Gear" },
    { seconds: 136, label: "Sorting & Inspecting Customer Knives" },
    { seconds: 237, label: "Sharpening Stations & the 4 Phases" },
    { seconds: 407, label: "The 1×30 Buck Tool & Angle Guide" },
    { seconds: 640, label: "Setting Your Angle (Digital Gauge)" },
    { seconds: 762, label: "Fixing a Broken Tip" },
    { seconds: 1015, label: "Removing Chips" },
    { seconds: 1090, label: "Sharpening: Coarse Grit & Reading the Burr" },
    { seconds: 1385, label: "Polishing (600–800 Grit)" },
    { seconds: 1508, label: "Stropping" },
    { seconds: 1605, label: "Cleaning & Invoicing the Customer" },
    { seconds: 1730, label: "Serrated Knives" },
    { seconds: 1878, label: "Scissors" },
    { seconds: 1980, label: "Ceramic Knives" },
    { seconds: 2237, label: "Salon Shears — What Not to Sharpen" },
    { seconds: 2393, label: "Handling Smaller Knives" },
    { seconds: 2481, label: "Certification & Video Review" },
    { seconds: 2537, label: "Mirror Polishing (Advanced — Out of Scope)" },
    { seconds: 2638, label: "Wrap-Up & Final Tips" },
  ],
};

interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });
  return apiPromise;
}

function parseVideoUrl(url: string): { id: string; start: number } {
  const id = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? "";
  const t = url.match(/[?&](?:t|start)=(\d+)/)?.[1];
  return { id, start: t ? parseInt(t, 10) : 0 };
}

function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
}

export function VideoWithChapters({ videoUrl }: { videoUrl: string }) {
  const { id, start } = parseVideoUrl(videoUrl);
  const chapters = CHAPTERS_BY_VIDEO[id] ?? [];
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    let poll: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi().then(() => {
      if (!mounted || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: id,
        playerVars: { start, rel: 0, modestbranding: 1, playsinline: 1 },
      });
      poll = setInterval(() => {
        const p = playerRef.current;
        if (!p?.getCurrentTime || chapters.length === 0) return;
        let t = 0;
        try {
          t = p.getCurrentTime();
        } catch {
          return;
        }
        let idx = 0;
        for (let i = 0; i < chapters.length; i++) {
          if (t >= chapters[i].seconds) idx = i;
        }
        setActiveIdx(idx);
      }, 1000);
    });

    return () => {
      mounted = false;
      if (poll) clearInterval(poll);
      try {
        playerRef.current?.destroy();
      } catch {
        /* player may already be gone */
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, start]);

  function seek(seconds: number) {
    const p = playerRef.current;
    if (p?.seekTo) {
      p.seekTo(seconds, true);
      p.playVideo();
    }
  }

  if (!id) return null;

  return (
    <div className="my-6">
      <div className="aspect-video overflow-hidden rounded-xl border border-neutral-700 [&>iframe]:h-full [&>iframe]:w-full">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {chapters.length > 0 && (
        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Chapters
          </p>
          <ul className="max-h-80 overflow-y-auto pb-2">
            {chapters.map((c, i) => (
              <li key={c.seconds}>
                <button
                  type="button"
                  onClick={() => seek(c.seconds)}
                  className={cn(
                    "flex w-full items-baseline gap-3 px-4 py-1.5 text-left text-sm transition-colors hover:bg-neutral-800",
                    i === activeIdx ? "font-medium text-emerald-400" : "text-neutral-300"
                  )}
                >
                  <span className="w-12 shrink-0 tabular-nums text-xs text-neutral-500">
                    {formatTime(c.seconds)}
                  </span>
                  <span>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
