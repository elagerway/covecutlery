"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Images, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { InstagramPost, InstagramChild } from "@/lib/instagram";

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

function postPreview(post: InstagramPost): string {
  if (post.media_type === "VIDEO") return post.thumbnail_url ?? post.media_url;
  return post.media_url;
}

export default function InstagramFeedClient({ posts }: { posts: InstagramPost[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const openPost = useCallback((index: number) => {
    setOpenIndex(index);
    setCarouselIndex(0);
  }, []);

  const closeModal = useCallback(() => setOpenIndex(null), []);

  const activePost = openIndex !== null ? posts[openIndex] : null;
  const carouselItems: InstagramChild[] | null =
    activePost?.children?.data && activePost.children.data.length > 0
      ? activePost.children.data
      : null;
  const totalSlides = carouselItems?.length ?? 1;

  const nextSlide = useCallback(() => {
    if (!carouselItems) return;
    setCarouselIndex((i) => (i + 1) % carouselItems.length);
  }, [carouselItems]);

  const prevSlide = useCallback(() => {
    if (!carouselItems) return;
    setCarouselIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length);
  }, [carouselItems]);

  // Keyboard: Escape closes, arrows navigate carousel
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, closeModal, nextSlide, prevSlide]);

  // Body scroll lock while modal open
  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {posts.map((post, i) => {
          const preview = postPreview(post);
          const isVideo = post.media_type === "VIDEO";
          const isCarousel = post.media_type === "CAROUSEL_ALBUM";
          return (
            <button
              key={post.id}
              type="button"
              onClick={() => openPost(i)}
              aria-label={post.caption?.slice(0, 100) ?? "Open Instagram post"}
              className="group relative block aspect-square overflow-hidden rounded-xl border cursor-pointer text-left"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={post.caption?.slice(0, 100) ?? "Cove Blades Instagram post"}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {(isVideo || isCarousel) && (
                <div
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                >
                  {isVideo ? (
                    <Play size={14} style={{ color: "#FFFFFF" }} fill="#FFFFFF" />
                  ) : (
                    <Images size={14} style={{ color: "#FFFFFF" }} />
                  )}
                </div>
              )}
              {post.caption && (
                <div
                  className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)" }}
                >
                  <p className="text-xs leading-snug line-clamp-3" style={{ color: "#FFFFFF" }}>
                    {post.caption}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Instagram post"
        >
          {/* Backdrop */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-default"
          />

          {/* Modal body */}
          <div
            className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid #30363D" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: "#D4A017" }}><InstagramIcon /></span>
                <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                  @coveblades
                </span>
                {totalSlides > 1 && (
                  <span className="text-xs ml-2" style={{ color: "#6B7280" }}>
                    {carouselIndex + 1} / {totalSlides}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#161B22] transition-colors"
                style={{ color: "#9CA3AF" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Media */}
            <div
              className="relative flex items-center justify-center"
              style={{ backgroundColor: "#000000", minHeight: 300, maxHeight: "60vh" }}
            >
              <ModalMedia
                post={activePost}
                carouselItems={carouselItems}
                carouselIndex={carouselIndex}
              />

              {/* Carousel arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", backdropFilter: "blur(4px)" }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", backdropFilter: "blur(4px)" }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Caption + footer */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              {activePost.caption && (
                <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: "#9CA3AF" }}>
                  {activePost.caption}
                </div>
              )}
              <div
                className="flex items-center justify-between px-5 py-3 mt-auto"
                style={{ borderTop: "1px solid #30363D" }}
              >
                <span className="text-xs" style={{ color: "#6B7280" }}>
                  {new Date(activePost.timestamp).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <a
                  href={activePost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "#D4A017" }}
                >
                  View on Instagram
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Renders the active media inside the modal — image, video, or one carousel slide. */
function ModalMedia({
  post,
  carouselItems,
  carouselIndex,
}: {
  post: InstagramPost;
  carouselItems: InstagramChild[] | null;
  carouselIndex: number;
}) {
  // Carousel: render the active child
  if (carouselItems) {
    const child = carouselItems[carouselIndex];
    if (child.media_type === "VIDEO") {
      return (
        <video
          key={child.id}
          src={child.media_url}
          controls
          autoPlay
          playsInline
          className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={child.id}
        src={child.media_url}
        alt={post.caption?.slice(0, 100) ?? "Instagram post"}
        className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
      />
    );
  }

  // Single video
  if (post.media_type === "VIDEO") {
    return (
      <video
        src={post.media_url}
        controls
        autoPlay
        playsInline
        poster={post.thumbnail_url}
        className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
      />
    );
  }

  // Single image
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={post.media_url}
      alt={post.caption?.slice(0, 100) ?? "Instagram post"}
      className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
    />
  );
}
