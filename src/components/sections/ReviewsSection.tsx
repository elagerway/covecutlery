"use client";

import { Star } from "lucide-react";

interface Review {
  author: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    author: "Erin S.",
    text: "Friendly and efficient. My knives were picked up, sharpened and returned within 22 hours. I highly recommend Cove Blades.",
    rating: 5,
  },
  {
    author: "Brad W.",
    text: "Dropped off a custom fillet knife and an old Bruks axe — both in dire need of blade repair and sharpening. They did an amazing job. Couldn't be more satisfied with the price and quality of the workmanship.",
    rating: 5,
  },
  {
    author: "David C.",
    text: "They dropped by our place, picked up the knives and returned them sharp as promised, within a couple of days. Highly recommended. Will use again for sure.",
    rating: 5,
  },
  {
    author: "Steve M.",
    text: "Excellent experience, beautifully sharpened and ready before promised! Will use and refer always!",
    rating: 5,
  },
  {
    author: "Lana Joyce",
    text: "It was so convenient that Cove Blades came to me, and returned all knives sharp enough to slice hair!",
    rating: 5,
  },
  {
    author: "Keith Labrecque",
    text: "Erik was able to bring my kitchen knives back like new sharpness, or maybe even better than brand new.",
    rating: 5,
  },
  {
    author: "Malae Blakeley",
    text: "Excellent service, quick turnaround; don't have to go into Vancouver. A north shore gem!",
    rating: 5,
  },
  {
    author: "Peter Teevan",
    text: "Very happy with my first visit to Cove Blades! I felt nervous about the lock-box drop off but it worked perfectly.",
    rating: 5,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current"
          style={{ color: "#D4A017" }}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="py-20 px-6"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            What Our <span style={{ color: "#D4A017" }}>Customers Say</span>
          </h2>
          <div
            className="mx-auto h-px w-16 mb-6"
            style={{ backgroundColor: "#D4A017", opacity: 0.5 }}
          />

          {/* 5-star rating badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border mb-12"
            style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-current"
                  style={{ color: "#D4A017" }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              5.0 on Google
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {reviews.map((review) => (
            <div
              key={review.author}
              className="rounded-xl p-6 border flex flex-col gap-4"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              {/* Stars */}
              <StarRating count={review.rating} />

              {/* Quote */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "#FFFFFF" }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "#30363D" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {getInitials(review.author)}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  {review.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://g.page/r/CbQWUOKYuKT0EBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
            style={{ borderColor: "#D4A017", color: "#D4A017" }}
          >
            <Star className="w-4 h-4" />
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  );
}
