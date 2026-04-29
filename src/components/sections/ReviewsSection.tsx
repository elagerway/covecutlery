"use client";

import { Star } from "lucide-react";

interface Review {
  author: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    author: "Steve C.",
    text: "I have a variety of Shun knives, some Wusthof and some smaller name paring knives. All my knives have been used (and some abused) professionally, but needed some desperate rejuvenation. Erik brought all my knives back to their genuine edge... I even shaved a bit of hair on my arm with one of the blades! 8 blades sharpened and honed in 20 min. Even sharpened an old pair of sewing scissors. He knows his blades and the angle of their edges — highly recommend.",
    rating: 5,
  },
  {
    author: "Misha M.",
    text: "Great experience! Knives are super sharp. I dropped my knives off at Cove Blades in the secure lock-box and they were finished same-day. Erik was helpful and communicative.",
    rating: 5,
  },
  {
    author: "Hideki Yamamoto",
    text: "As a Japanese sushi chef with 44 years of experience, I take my knives very seriously. I met Erik in person and explained exactly what I wanted. He listened carefully and suggested sharpening my knife with a chisel grind to zero. The result was incredible — I used the freshly sharpened knife during the hectic New Year's Eve service, and it felt like the blade had come alive. Highly recommended, especially for chefs who use traditional Japanese knives.",
    rating: 5,
  },
  {
    author: "Hiroko Yamamoto",
    text: "I was able to get all of our 15 knives done within the same day (dropped off and picked up). They all came back very sharp and passed the finely chopped onion test with very little tears on my side! Sharp knives make life so much easier and cooking fun! I would definitely recommend Cove Blades to anybody who owns a knife.",
    rating: 5,
  },
  {
    author: "Nico Vera",
    text: "As a former chef with a small collection of German and Japanese knives, I was thrilled to find Cove Blades. Erik was very professional, friendly, and punctual, and sharpened about 10 knives in half an hour. The affordable price, convenience of a mobile service, and top-notch quality of work guarantees my knives are ready for any home-cooking project. I will definitely call on Cove Blades again soon!",
    rating: 5,
  },
  {
    author: "Meyrick Jones",
    text: "His effective website had me booking a mobile service for the SAME DAY! When Erik showed up he was cheerful and happy to tell me all about his process. All 12 knives came out unbelievably sharp, and one that had an ugly broken tip looks as good as new. Price was low too. Will definitely use Cove Blades mobile service again. Highly recommended!",
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
          {reviews.slice(0, 6).map((review) => (
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

        {/* See more */}
        <div className="text-center mb-6">
          <a
            href="https://search.google.com/local/reviews?placeid=ChIJPWcc0j97hlQRtBZQ4pi4pPQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#D4A017" }}
          >
            — see more —
          </a>
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
